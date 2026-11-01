import SwiftUI
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
#if os(iOS)
import UIKit
import PencilKit
#endif

/// Tool mode for `JournalInkCanvasView`, toggleable via UI or Apple Pencil double-tap / squeeze.
enum JournalInkToolMode: String, CaseIterable, Identifiable {
    case pen = "Pen"
    case highlighter = "Highlighter"
    case eraser = "Eraser"

    var id: String { rawValue }

    var symbolName: String {
        switch self {
        case .pen: return "pencil.tip"
        case .highlighter: return "highlighter"
        case .eraser: return "eraser"
        }
    }
}

/// Encodes and decodes multi-stroke Apple Pencil / freehand paths (`[[CGPoint]]`) to and from JSON `Data`,
/// and rasterizes strokes to PNG `Data` for `HandwritingRecognition` (`VNRecognizeTextRequest`).
enum JournalInkDrawingCodec {
    static func encode(strokes: [[CGPoint]]) -> Data? {
        guard !strokes.isEmpty else { return nil }
        let serialized: [[[Double]]] = strokes.map { stroke in
            stroke.map { [Double($0.x), Double($0.y)] }
        }
        return try? JSONEncoder().encode(serialized)
    }

    static func decode(data: Data?) -> [[CGPoint]] {
        guard let data, !data.isEmpty else { return [] }
        if let multi = try? JSONDecoder().decode([[[Double]]].self, from: data) {
            return multi.map { stroke in
                stroke.compactMap { pair in
                    guard pair.count >= 2 else { return nil }
                    return CGPoint(x: pair[0], y: pair[1])
                }
            }
        }
        if let flat = try? JSONDecoder().decode([[Double]].self, from: data) {
            let pts = flat.compactMap { pair -> CGPoint? in
                guard pair.count >= 2 else { return nil }
                return CGPoint(x: pair[0], y: pair[1])
            }
            return pts.isEmpty ? [] : [pts]
        }
        return []
    }

    /// Rasterizes `strokes` onto a high-contrast white bitmap and encodes as PNG `Data` for Vision OCR.
    static func renderPNGData(strokes: [[CGPoint]], canvasSize: CGSize = CGSize(width: 900, height: 420)) -> Data? {
        let nonEmpty = strokes.filter { !$0.isEmpty }
        guard !nonEmpty.isEmpty else { return nil }

        var maxX = canvasSize.width
        var maxY = canvasSize.height
        for stroke in nonEmpty {
            for pt in stroke {
                if pt.x + 32 > maxX { maxX = pt.x + 32 }
                if pt.y + 32 > maxY { maxY = pt.y + 32 }
            }
        }
        let width = max(Int(maxX), 320)
        let height = max(Int(maxY), 180)
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        guard let ctx = CGContext(
            data: nil,
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: width * 4,
            space: colorSpace,
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else {
            return nil
        }

        // Flip coordinate system so top-left is (0, 0) matching SwiftUI Canvas
        ctx.translateBy(x: 0, y: CGFloat(height))
        ctx.scaleBy(x: 1.0, y: -1.0)

        ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
        ctx.fill(CGRect(x: 0, y: 0, width: width, height: height))

        ctx.setStrokeColor(CGColor(red: 0.08, green: 0.08, blue: 0.12, alpha: 1))
        ctx.setLineWidth(3.0)
        ctx.setLineCap(.round)
        ctx.setLineJoin(.round)

        for stroke in nonEmpty {
            guard let first = stroke.first else { continue }
            ctx.beginPath()
            ctx.move(to: first)
            for pt in stroke.dropFirst() {
                ctx.addLine(to: pt)
            }
            ctx.strokePath()
        }

        guard let cgImage = ctx.makeImage() else { return nil }
        let mutableData = CFDataCreateMutable(nil, 0)!
        guard let destination = CGImageDestinationCreateWithData(
            mutableData,
            UTType.png.identifier as CFString,
            1,
            nil
        ) else {
            return nil
        }
        CGImageDestinationAddImage(destination, cgImage, nil)
        guard CGImageDestinationFinalize(destination) else { return nil }
        return mutableData as Data
    }
}

#if os(iOS)
/// Bridges `UIPencilInteraction` double-tap and squeeze events from Apple Pencil Pro / 2nd Gen to toggle between Pen and Eraser.
private struct ApplePencilInteractionBridge: UIViewRepresentable {
    var onToggleEraser: () -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(onToggleEraser: onToggleEraser)
    }

    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: .zero)
        view.backgroundColor = .clear
        view.isUserInteractionEnabled = false
        let interaction = UIPencilInteraction()
        interaction.delegate = context.coordinator
        view.addInteraction(interaction)
        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        context.coordinator.onToggleEraser = onToggleEraser
    }

    final class Coordinator: NSObject, UIPencilInteractionDelegate {
        var onToggleEraser: () -> Void

        init(onToggleEraser: @escaping () -> Void) {
            self.onToggleEraser = onToggleEraser
        }

        func pencilInteractionDidTap(_ interaction: UIPencilInteraction) {
            onToggleEraser()
        }
    }
}
#endif

/// Shared Apple Pencil / pointer freehand ink canvas used across Question Proofs, Specimen Recall Plates, and Lab Journal pages.
/// Includes Apple Pencil double-tap tool switching, stroke eraser support, and 1-tap `HandwritingRecognition` text conversion.
struct JournalInkCanvasView: View {
    @Binding var strokes: [[CGPoint]]
    @Binding var activeStroke: [CGPoint]
    var strokeColor: Color = Color.kymaiaPrimaryStrong
    var lineWidth: CGFloat = 2.5
    var onStrokesCommitted: (([[CGPoint]], Data?) -> Void)?
    var onTextConverted: ((String) -> Void)?

    @State private var toolMode: JournalInkToolMode = .pen

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            Canvas { context, _ in
                for stroke in strokes {
                    var path = Path()
                    if let first = stroke.first {
                        path.move(to: first)
                        for pt in stroke.dropFirst() {
                            path.addLine(to: pt)
                        }
                    }
                    context.stroke(path, with: .color(strokeColor), lineWidth: lineWidth)
                }
                if toolMode != .eraser {
                    var activePath = Path()
                    if let first = activeStroke.first {
                        activePath.move(to: first)
                        for pt in activeStroke.dropFirst() {
                            activePath.addLine(to: pt)
                        }
                    }
                    let activeColor = toolMode == .highlighter
                        ? Color.kymaiaWarning.opacity(0.45)
                        : Color.kymaiaPrimary
                    let activeWidth = toolMode == .highlighter ? lineWidth * 3.2 : lineWidth
                    context.stroke(activePath, with: .color(activeColor), lineWidth: activeWidth)
                }
            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { val in
                        if toolMode == .eraser {
                            eraseStrokes(near: val.location, radius: 18)
                        } else {
                            activeStroke.append(val.location)
                        }
                    }
                    .onEnded { _ in
                        if toolMode == .eraser {
                            let encoded = JournalInkDrawingCodec.encode(strokes: strokes)
                            onStrokesCommitted?(strokes, encoded)
                        } else if !activeStroke.isEmpty {
                            strokes.append(activeStroke)
                            activeStroke.removeAll()
                            let encoded = JournalInkDrawingCodec.encode(strokes: strokes)
                            onStrokesCommitted?(strokes, encoded)
                        }
                    }
            )
            #if os(iOS)
            .background(
                ApplePencilInteractionBridge {
                    toolMode = (toolMode == .eraser) ? .pen : .eraser
                }
            )
            #endif

            // Floating mini Apple Pencil tool strip + Convert Handwriting to Text button
            HStack(spacing: Spacing.xs) {
                ForEach(JournalInkToolMode.allCases) { mode in
                    Button {
                        toolMode = mode
                    } label: {
                        Image(systemName: mode.symbolName)
                            .font(.kymaiaCaption.weight(.semibold))
                            .foregroundStyle(toolMode == mode ? Color.white : Color.kymaiaSecondaryInk)
                            .padding(6)
                            .background(
                                Circle()
                                    .fill(toolMode == mode ? Color.kymaiaPrimary : Color.kymaiaSurface.opacity(0.92))
                            )
                    }
                    .buttonStyle(.plain)
                    .help(mode.rawValue)
                    .accessibilityLabel(mode.rawValue)
                }

                if !strokes.isEmpty {
                    DrawingTextConversionButton(
                        imageData: {
                            JournalInkDrawingCodec.renderPNGData(strokes: strokes)
                        },
                        onTextConversion: onTextConverted,
                        compact: true
                    )
                    .padding(4)
                    .background(
                        Capsule()
                            .fill(Color.kymaiaSurface.opacity(0.92))
                    )
                }
            }
            .padding(Spacing.xs)
        }
    }

    private func eraseStrokes(near point: CGPoint, radius: CGFloat) {
        let radiusSq = radius * radius
        strokes.removeAll { stroke in
            stroke.contains { pt in
                let dx = pt.x - point.x
                let dy = pt.y - point.y
                return (dx * dx + dy * dy) <= radiusSq
            }
        }
    }
}
