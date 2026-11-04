import SwiftUI
import WebKit

/// Offline WKWebView stage that renders the bundled `Resources/LivingWorldBook/index.html`
/// (with all 16 chapters, 4 Explorers, and 47 Three.js / Canvas simulations) and bridges
/// theme palette tokens, chapter navigation, and challenge stamps bidirectionally with Swift.
struct LivingWorldWebStageView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.standardTheme) private var theme

    let chapterNumber: Int
    var targetWidgetId: String? = nil
    var targetExplorerId: String? = nil

    var body: some View {
        LivingWorldWebRepresentable(
            chapterNumber: chapterNumber,
            targetWidgetId: targetWidgetId,
            targetExplorerId: targetExplorerId,
            theme: theme,
            syllabusBoard: store.syllabusBoard,
            stampedWidgetIds: Array(store.widgetStamps.keys),
            onWidgetStamped: { widgetId, readout in
                store.earnWidgetChallengeStamp(
                    widgetId: widgetId,
                    chapterNumber: chapterNumber,
                    readout: readout
                )
            }
        )
    }
}

#if os(iOS)
private struct LivingWorldWebRepresentable: UIViewRepresentable {
    let chapterNumber: Int
    let targetWidgetId: String?
    let targetExplorerId: String?
    let theme: StandardTheme
    let syllabusBoard: String
    let stampedWidgetIds: [String]
    let onWidgetStamped: (String, String) -> Void

    func makeCoordinator() -> LivingWorldWebCoordinator {
        LivingWorldWebCoordinator(onWidgetStamped: onWidgetStamped)
    }

    func makeUIView(context: Context) -> WKWebView {
        let config = LivingWorldWebCoordinator.makeWebConfiguration(coordinator: context.coordinator)
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.isOpaque = false
        webView.backgroundColor = .clear
        context.coordinator.loadBookIfNeeded(in: webView, chapterNumber: chapterNumber, widgetId: targetWidgetId, explorerId: targetExplorerId)
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        context.coordinator.syncState(
            in: webView,
            chapterNumber: chapterNumber,
            widgetId: targetWidgetId,
            explorerId: targetExplorerId,
            theme: theme,
            syllabusBoard: syllabusBoard,
            stampedWidgetIds: stampedWidgetIds
        )
    }
}
#elseif os(macOS)
private struct LivingWorldWebRepresentable: NSViewRepresentable {
    let chapterNumber: Int
    let targetWidgetId: String?
    let targetExplorerId: String?
    let theme: StandardTheme
    let syllabusBoard: String
    let stampedWidgetIds: [String]
    let onWidgetStamped: (String, String) -> Void

    func makeCoordinator() -> LivingWorldWebCoordinator {
        LivingWorldWebCoordinator(onWidgetStamped: onWidgetStamped)
    }

    func makeNSView(context: Context) -> WKWebView {
        let config = LivingWorldWebCoordinator.makeWebConfiguration(coordinator: context.coordinator)
        let webView = WKWebView(frame: .zero, configuration: config)
        context.coordinator.loadBookIfNeeded(in: webView, chapterNumber: chapterNumber, widgetId: targetWidgetId, explorerId: targetExplorerId)
        return webView
    }

    func updateNSView(_ webView: WKWebView, context: Context) {
        context.coordinator.syncState(
            in: webView,
            chapterNumber: chapterNumber,
            widgetId: targetWidgetId,
            explorerId: targetExplorerId,
            theme: theme,
            syllabusBoard: syllabusBoard,
            stampedWidgetIds: stampedWidgetIds
        )
    }
}
#endif

final class LivingWorldWebCoordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate {
    let onWidgetStamped: (String, String) -> Void
    private var hasLoaded = false
    private var lastChapterNumber: Int = -1
    private var lastWidgetId: String? = nil
    private var lastExplorerId: String? = nil

    init(onWidgetStamped: @escaping (String, String) -> Void) {
        self.onWidgetStamped = onWidgetStamped
    }

    static func makeWebConfiguration(coordinator: LivingWorldWebCoordinator) -> WKWebViewConfiguration {
        let config = WKWebViewConfiguration()
        config.userContentController.add(coordinator, name: "kymbioBridge")
        let bridgeScript = WKUserScript(
            source: """
            (function() {
                if (window.__kymbioBridgeInstalled) return;
                window.__kymbioBridgeInstalled = true;
                var origSetItem = Storage.prototype.setItem;
                Storage.prototype.setItem = function(key, val) {
                    origSetItem.call(this, key, val);
                    try {
                        if (typeof key === 'string' && (key.indexOf('lw.stamp.') === 0 || key.indexOf('lw.challenge.') === 0)) {
                            var wid = key.replace('lw.stamp.', '').replace('lw.challenge.', '');
                            window.webkit.messageHandlers.kymbioBridge.postMessage({ widgetId: wid, readout: String(val) });
                        }
                    } catch (e) {}
                };
                document.addEventListener('click', function(ev) {
                    var btn = ev.target && ev.target.closest ? ev.target.closest('[data-stamp-widget], .lw-stamp-btn') : null;
                    if (btn) {
                        var wid = btn.getAttribute('data-stamp-widget') || btn.getAttribute('data-widget') || 'interactive-lab';
                        try {
                            window.webkit.messageHandlers.kymbioBridge.postMessage({ widgetId: wid, readout: 'Completed interactive challenge in web stage' });
                        } catch (e) {}
                    }
                }, true);
            })();
            """,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: false
        )
        config.userContentController.addUserScript(bridgeScript)
        return config
    }

    static func resolveBookIndexURL() -> URL? {
        let candidates: [URL?] = [
            Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "LivingWorldBook"),
            URL(fileURLWithPath: "/Users/amarsukhi/src/MyCode/kym_bio/KymBio/KymBio/Resources/LivingWorldBook/index.html"),
            URL(fileURLWithPath: "/Users/amarsukhi/src/MyCode/kym_bio/index.html")
        ]
        for case let url? in candidates where FileManager.default.fileExists(atPath: url.path) {
            return url
        }
        return nil
    }

    func loadBookIfNeeded(in webView: WKWebView, chapterNumber: Int, widgetId: String?, explorerId: String?) {
        guard !hasLoaded else { return }
        hasLoaded = true
        webView.navigationDelegate = self
        if let indexURL = Self.resolveBookIndexURL() {
            let readDir = indexURL.deletingLastPathComponent()
            webView.loadFileURL(indexURL, allowingReadAccessTo: readDir)
        }
    }

    func syncState(
        in webView: WKWebView,
        chapterNumber: Int,
        widgetId: String?,
        explorerId: String?,
        theme: StandardTheme,
        syllabusBoard: String,
        stampedWidgetIds: [String]
    ) {
        let webTheme = AppTheme.webBookTheme(for: theme)
        func css(_ hex: UInt32) -> String {
            "rgb(\((hex >> 16) & 0xFF), \((hex >> 8) & 0xFF), \(hex & 0xFF))"
        }
        let bgCSS = css(theme.bgHex)
        let surfCSS = css(theme.surfaceHex)
        let inkCSS = css(theme.inkHex)
        let accCSS = css(theme.brassHex)
        let stampsJSON = (try? String(data: JSONEncoder().encode(stampedWidgetIds), encoding: .utf8)) ?? "[]"
        var js = """
        (function() {
            document.documentElement.setAttribute('data-theme', '\(webTheme)');
            document.documentElement.setAttribute('data-kymbio-scheme', '\(theme.id)');
            document.documentElement.style.setProperty('--kymbio-bg', '\(bgCSS)');
            document.documentElement.style.setProperty('--kymbio-surface', '\(surfCSS)');
            document.documentElement.style.setProperty('--kymbio-ink', '\(inkCSS)');
            document.documentElement.style.setProperty('--kymbio-accent', '\(accCSS)');
            try {
                localStorage.setItem('lw.board', '\(syllabusBoard)');
                var stamps = \(stampsJSON);
                for (var i = 0; i < stamps.length; i++) {
                    localStorage.setItem('lw.stamp.' + stamps[i], 'stamped');
                }
            } catch(e) {}
        """

        if let explorerId, explorerId != lastExplorerId {
            lastExplorerId = explorerId
            js += "window.location.hash = '#\(explorerId)';"
        } else if chapterNumber != lastChapterNumber {
            lastChapterNumber = chapterNumber
            let chHash = String(format: "#ch%02d", chapterNumber)
            js += "window.location.hash = '\(chHash)';"
        }

        if let widgetId, widgetId != lastWidgetId {
            lastWidgetId = widgetId
            js += """
            setTimeout(function() {
                var el = document.querySelector('[data-widget="\(widgetId)"], #widget-\(widgetId)');
                if (el) { el.scrollIntoView({behavior: 'smooth', block: 'center'}); }
            }, 350);
            """
        }

        js += "})();"
        webView.evaluateJavaScript(js, completionHandler: nil)
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let widgetId = body["widgetId"] as? String else { return }
        let readout = (body["readout"] as? String) ?? "Completed in interactive stage"
        Task { @MainActor in
            onWidgetStamped(widgetId, readout)
        }
    }
}
