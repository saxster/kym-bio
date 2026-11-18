import SwiftUI

/// A scrolling page on the theme's background. A top-level room page passes an `eyebrow` and draws
/// The Standard's `EditorialHeader` (eyebrow, serif title, muted subtitle) with an inline
/// navigation title; a nested page keeps the large navigation title and the subtitle line.
struct JournalPage<Content: View>: View {
    @AppStorage("kymbio.reader.face") private var rawFace: String = KymBioReadingFace.literata.rawValue
    @AppStorage("kymbio.reader.sizeStep") private var sizeStep: Int = 1
    @AppStorage("kymbio.reader.lineSpacing") private var rawSpacing: String = KymBioLineSpacing.comfortable.rawValue
    @AppStorage("kymbio.reader.lineWidth") private var rawWidth: String = KymBioReadingWidth.normal.rawValue

    let title: String
    var eyebrow: String?
    var subtitle: String?
    var subtitleIdentifier: String
    var floatingAction: JournalAction?
    var column: JournalLayout.Column
    private let content: Content

    private var activeFace: KymBioReadingFace {
        KymBioReadingFace(rawValue: rawFace) ?? .literata
    }

    private var activeSpacing: KymBioLineSpacing {
        KymBioLineSpacing(rawValue: rawSpacing) ?? .comfortable
    }

    private var activeWidth: KymBioReadingWidth {
        KymBioReadingWidth(rawValue: rawWidth) ?? .normal
    }

    private var activeDynamicTypeSize: DynamicTypeSize {
        switch sizeStep {
        case 0: return .medium
        case 1: return .large
        case 2: return .xLarge
        default: return .xxLarge
        }
    }

    private var resolvedMaxWidth: CGFloat {
        switch column {
        case .page:
            return activeWidth.pageMaxWidth
        default:
            return column.maxWidth
        }
    }

    init(
        title: String,
        eyebrow: String? = nil,
        subtitle: String? = nil,
        subtitleIdentifier: String = "journal-page.subtitle",
        floatingAction: JournalAction? = nil,
        column: JournalLayout.Column = .page,
        @ViewBuilder content: () -> Content
    ) {
        self.title = title
        self.eyebrow = eyebrow
        self.subtitle = subtitle
        self.subtitleIdentifier = subtitleIdentifier
        self.floatingAction = floatingAction
        self.column = column
        self.content = content()
    }

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            KymaiaBackground()

            ScrollView {
                VStack(alignment: .leading, spacing: JournalLayout.sectionSpacing) {
                    if let eyebrow {
                        EditorialHeader(eyebrow: eyebrow, title: title, subtitle: subtitle ?? "")
                            .padding(.bottom, -JournalLayout.sectionSpacing)
                            .accessibilityIdentifier(subtitleIdentifier)
                    } else if let subtitle {
                        subtitleLine(subtitle)
                    }
                    content
                }
                .frame(maxWidth: resolvedMaxWidth, alignment: .leading)
                .frame(maxWidth: .infinity)
                .padding(.horizontal, JournalLayout.pageGutter)
                .padding(.top, Spacing.xs)
                .padding(.bottom, Spacing.lg)
                .fontDesign(activeFace.fontDesign)
                .lineSpacing(activeSpacing.swiftUILineSpacing)
                .dynamicTypeSize(activeDynamicTypeSize)
            }
            .safeAreaInset(edge: .bottom, spacing: 0) {
                if let floatingAction {
                    HStack {
                        Spacer(minLength: 0)
                        JournalFloatingActionButton(action: floatingAction)
                    }
                    .padding(.trailing, JournalLayout.pageGutter)
                    .frame(height: JournalLayout.bottomInset(hasFloatingAction: true), alignment: .top)
                }
            }
        }
        .foregroundStyle(Color.kymaiaInk)
        .modifier(JournalNavigationTitle(title: eyebrow == nil ? title : "", display: eyebrow == nil ? .large : .inline))
    }

    private func subtitleLine(_ text: String) -> some View {
        Text(text)
            .font(.kymaiaSubheadline)
            .foregroundStyle(Color.kymaiaMutedInk)
            .fixedSize(horizontal: false, vertical: true)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, -Spacing.sm - 2)
            .accessibilityIdentifier(subtitleIdentifier)
            .staggeredFadeIn(index: 0)
    }
}

private struct JournalFloatingActionButton: View {
    let action: JournalAction

    var body: some View {
        Button(action: action.action) {
            Image(systemName: action.systemImage)
                .resizable()
                .scaledToFit()
                .fontWeight(.semibold)
                .frame(width: JournalLayout.floatingActionGlyph, height: JournalLayout.floatingActionGlyph)
                .foregroundStyle(Color.kymaiaBackground)
                .frame(width: JournalLayout.floatingActionDiameter, height: JournalLayout.floatingActionDiameter)
                .background(Color.kymaiaPrimary, in: Circle())
                .shadow(color: Color.kymaiaPrimary.opacity(0.4), radius: 12, y: 6)
                .contentShape(Circle())
                .kymaiaPointerHighlight(Circle())
        }
        .buttonStyle(.plain)
        .help(action.title)
        .accessibilityLabel(action.title)
        .accessibilityHint(action.hint ?? "")
        .accessibilityIdentifier(action.identifier)
    }
}
