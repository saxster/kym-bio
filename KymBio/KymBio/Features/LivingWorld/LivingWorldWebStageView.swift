import SwiftUI
import WebKit

/// Offline WKWebView stage that renders the bundled `Resources/LivingWorldBook/index.html`
/// (with all 16 chapters, 4 Explorers, and 47 Three.js / Canvas simulations) and bridges
/// theme palette tokens, chapter navigation, and challenge stamps bidirectionally with Swift.
struct LivingWorldWebStageView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.standardTheme) private var theme
    @AppStorage("kymbio.reader.face") private var rawFace: String = KymBioReadingFace.literata.rawValue
    @AppStorage("kymbio.reader.sizeStep") private var sizeStep: Int = 1
    @AppStorage("kymbio.reader.lineSpacing") private var rawSpacing: String = KymBioLineSpacing.comfortable.rawValue
    @AppStorage("kymbio.reader.lineWidth") private var rawWidth: String = KymBioReadingWidth.normal.rawValue

    let chapterNumber: Int
    var targetWidgetId: String? = nil
    var targetExplorerId: String? = nil

    var body: some View {
        let _ = (rawFace, sizeStep, rawSpacing, rawWidth)
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
            },
            onCalloutSaved: { calloutId, responseText, confidenceTag, readingThinking in
                store.saveCalloutResponse(
                    calloutId: calloutId,
                    chapterNumber: chapterNumber,
                    responseText: responseText,
                    isUnlocked: true,
                    confidenceTag: confidenceTag,
                    readingThinkingText: readingThinking
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
    var onCalloutSaved: ((String, String, String, String) -> Void)? = nil

    func makeCoordinator() -> LivingWorldWebCoordinator {
        LivingWorldWebCoordinator(onWidgetStamped: onWidgetStamped, onCalloutSaved: onCalloutSaved)
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
    var onCalloutSaved: ((String, String, String, String) -> Void)? = nil

    func makeCoordinator() -> LivingWorldWebCoordinator {
        LivingWorldWebCoordinator(onWidgetStamped: onWidgetStamped, onCalloutSaved: onCalloutSaved)
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

final class LivingWorldWebCoordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate, WKURLSchemeHandler {
    static let bookScheme = "kymbio-book"
    let onWidgetStamped: (String, String) -> Void
    let onCalloutSaved: ((String, String, String, String) -> Void)?
    private var hasLoaded = false
    private var isDocumentReady = false
    private var lastChapterNumber: Int = -999
    private var lastWidgetId: String? = nil
    private var lastExplorerId: String? = nil

    private var pendingChapterNumber: Int = 1
    private var pendingWidgetId: String? = nil
    private var pendingExplorerId: String? = nil
    private var pendingTheme: StandardTheme = .parchment
    private var pendingSyllabusBoard: String = "0893"
    private var pendingStampedWidgetIds: [String] = []

    init(
        onWidgetStamped: @escaping (String, String) -> Void,
        onCalloutSaved: ((String, String, String, String) -> Void)? = nil
    ) {
        self.onWidgetStamped = onWidgetStamped
        self.onCalloutSaved = onCalloutSaved
    }

    static func resolveExplorerHash(_ rawId: String) -> String {
        let cleaned = rawId.trimmingCharacters(in: .whitespacesAndNewlines)
        switch cleaned {
        case "top", "cover", "#top":
            return "#top"
        case "x_scale", "scale", "explore-scale":
            return "#explore-scale"
        case "x_cell", "cell", "explore-cell":
            return "#explore-cell"
        case "x_code", "code", "explore-code":
            return "#explore-code"
        case "x_map", "map", "explore-map":
            return "#explore-map"
        default:
            return cleaned.hasPrefix("#") ? cleaned : "#\(cleaned)"
        }
    }

    static let embedStylesheet: String = [
        ".cont-chip { display: none !important; }",
        ".navbtn { top: .55rem !important; right: .65rem !important; left: auto !important; bottom: auto !important; border-radius: 999px !important; border-width: 1px !important; padding: .18rem .42rem !important; box-shadow: 0 4px 14px rgba(0,0,0,.10) !important; }",
        "@media screen and (max-width: 700px) { .navbtn a, .navbtn button { min-height: 34px !important; min-width: 34px !important; padding: .3rem .5rem !important; font-size: .76rem !important; } body { padding-bottom: 1.5rem !important; } }",
        "@media screen and (min-width: 701px) and (max-width: 1120px) { .flow, .opener, .pg-nav { padding-left: clamp(1.25rem, 4vw, 2.5rem) !important; padding-right: clamp(1.25rem, 4vw, 2.5rem) !important; max-width: 48rem !important; margin-left: auto !important; margin-right: auto !important; } .sidenote { float: none !important; clear: none !important; width: auto !important; margin: .65rem 0 !important; padding: .55rem .8rem !important; background: var(--paper-2) !important; border-left: 2px solid var(--acc) !important; border-radius: 0 6px 6px 0 !important; } }",
        "html[data-kymbio-widget-only=\"1\"] body { padding: 0 !important; margin: 0 !important; }",
        "html[data-kymbio-widget-only=\"1\"] .navbtn, html[data-kymbio-widget-only=\"1\"] .bar, html[data-kymbio-widget-only=\"1\"] .pg-nav, html[data-kymbio-widget-only=\"1\"] .opener, html[data-kymbio-widget-only=\"1\"] .atelier-strip { display: none !important; }",
        "html[data-kymbio-widget-only=\"1\"] main.book { padding: 0 !important; margin: 0 !important; max-width: none !important; }",
        "html[data-kymbio-widget-only=\"1\"] main.book > :not(.kymbio-widget-ancestor) { display: none !important; }",
        "html[data-kymbio-widget-only=\"1\"] .kymbio-widget-ancestor { padding: 0 !important; margin: 0 !important; border: none !important; max-width: none !important; }",
        "html[data-kymbio-widget-only=\"1\"] .flow { padding: .35rem !important; margin: 0 !important; max-width: none !important; }",
        "html[data-kymbio-widget-only=\"1\"] .flow > :not(.kymbio-active-widget):not(.kymbio-widget-ancestor) { display: none !important; }",
        "html[data-kymbio-widget-only=\"1\"] .sec > :not(.kymbio-active-widget):not(.kymbio-widget-ancestor) { display: none !important; }",
        "html[data-kymbio-widget-only=\"1\"] figure.kymbio-active-widget { margin: 0 !important; max-width: 100% !important; }"
    ].joined(separator: " ")

    static func makeWebConfiguration(coordinator: LivingWorldWebCoordinator) -> WKWebViewConfiguration {
        let config = WKWebViewConfiguration()
        config.setURLSchemeHandler(coordinator, forURLScheme: bookScheme)
        config.userContentController.add(coordinator, name: "kymbioBridge")
        let bridgeScript = WKUserScript(
            source: """
            (function() {
                if (window.__kymbioBridgeInstalled) return;
                window.__kymbioBridgeInstalled = true;
                if (!document.getElementById('kymbio-embed-style') && document.head) {
                    var st = document.createElement('style');
                    st.id = 'kymbio-embed-style';
                    st.textContent = '\(embedStylesheet)';
                    document.head.appendChild(st);
                }
                window.__kymbioIsolateWidget = function(wid) {
                    var fig = document.querySelector('figure[data-live="' + wid + '"], [data-widget="' + wid + '"], #widget-' + wid);
                    if (!fig) return;
                    document.querySelectorAll('.kymbio-active-widget').forEach(function(el) { el.classList.remove('kymbio-active-widget'); });
                    document.querySelectorAll('.kymbio-widget-ancestor').forEach(function(el) { el.classList.remove('kymbio-widget-ancestor'); });
                    fig.classList.add('kymbio-active-widget');
                    var p = fig.parentElement;
                    while (p && p !== document.body) {
                        p.classList.add('kymbio-widget-ancestor');
                        p = p.parentElement;
                    }
                    document.documentElement.setAttribute('data-kymbio-widget-only', '1');
                    if (window.App && window.App.reveal) {
                        window.App.reveal(fig);
                    }
                    var openBtn = fig.querySelector('.live-open');
                    if (openBtn && !fig.classList.contains('live-on')) {
                        openBtn.click();
                    }
                    window.scrollTo(0, 0);
                };
                try {
                    var params = new URLSearchParams(window.location.search);
                    var initWid = params.get('widget');
                    if (initWid) {
                        document.documentElement.setAttribute('data-kymbio-widget-only', '1');
                        window.__kymbioIsolateWidget(initWid);
                        if (window.App && window.App.ready) {
                            window.App.ready(function() {
                                window.__kymbioIsolateWidget(initWid);
                                setTimeout(function() { window.__kymbioIsolateWidget(initWid); }, 80);
                            });
                        }
                    }
                } catch (e) {}
                var origSetItem = Storage.prototype.setItem;
                Storage.prototype.setItem = function(key, val) {
                    origSetItem.call(this, key, val);
                    try {
                        if (typeof key === 'string' && (key.indexOf('lw.stamp.') === 0 || key.indexOf('lw.challenge.') === 0)) {
                            var wid = key.replace('lw.stamp.', '').replace('lw.challenge.', '');
                            window.webkit.messageHandlers.kymbioBridge.postMessage({ widgetId: wid, readout: String(val) });
                        } else if (typeof key === 'string' && (key.indexOf('lw:chk:') === 0 || key.indexOf('lw:pred:') === 0)) {
                            var cid = key.replace('lw:', '');
                            var parsed = JSON.parse(val);
                            window.webkit.messageHandlers.kymbioBridge.postMessage({
                                calloutId: cid,
                                responseText: String(parsed.a || parsed.o || ''),
                                confidenceTag: String(parsed.conf || ''),
                                readingThinking: String(parsed.rt || '')
                            });
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

    func webView(_ webView: WKWebView, start urlSchemeTask: any WKURLSchemeTask) {
        guard let requestURL = urlSchemeTask.request.url,
              let rootIndexURL = Self.resolveBookIndexURL() else {
            urlSchemeTask.didFailWithError(URLError(.fileDoesNotExist))
            return
        }
        let baseDir = rootIndexURL.deletingLastPathComponent().standardizedFileURL
        var relPath = requestURL.path
        if relPath.hasPrefix("/") {
            relPath.removeFirst()
        }
        if relPath.isEmpty {
            relPath = "index.html"
        }
        let fileURL = baseDir.appendingPathComponent(relPath).standardizedFileURL
        guard fileURL.path.hasPrefix(baseDir.path),
              let data = try? Data(contentsOf: fileURL) else {
            urlSchemeTask.didFailWithError(URLError(.fileDoesNotExist))
            return
        }
        let ext = fileURL.pathExtension.lowercased()
        let mimeType: String
        switch ext {
        case "html": mimeType = "text/html; charset=utf-8"
        case "js", "mjs": mimeType = "text/javascript; charset=utf-8"
        case "css": mimeType = "text/css; charset=utf-8"
        case "json", "webmanifest": mimeType = "application/json; charset=utf-8"
        case "svg": mimeType = "image/svg+xml"
        case "webp": mimeType = "image/webp"
        case "png": mimeType = "image/png"
        case "woff2": mimeType = "font/woff2"
        default: mimeType = "application/octet-stream"
        }
        let headers: [String: String] = [
            "Content-Type": mimeType,
            "Content-Length": "\(data.count)",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache"
        ]
        if let response = HTTPURLResponse(
            url: requestURL,
            statusCode: 200,
            httpVersion: "HTTP/1.1",
            headerFields: headers
        ) {
            urlSchemeTask.didReceive(response)
            urlSchemeTask.didReceive(data)
            urlSchemeTask.didFinish()
        } else {
            urlSchemeTask.didFailWithError(URLError(.badServerResponse))
        }
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: any WKURLSchemeTask) {}

    func loadBookIfNeeded(in webView: WKWebView, chapterNumber: Int, widgetId: String?, explorerId: String?) {
        guard !hasLoaded else { return }
        hasLoaded = true
        pendingChapterNumber = chapterNumber
        pendingWidgetId = widgetId
        pendingExplorerId = explorerId
        webView.navigationDelegate = self
        let targetHash: String
        if let explorerId, !explorerId.isEmpty {
            targetHash = Self.resolveExplorerHash(explorerId)
        } else {
            targetHash = chapterNumber < 0 ? "#top" : "#ch\(chapterNumber)"
        }
        var urlString = "\(Self.bookScheme)://localhost/index.html"
        if let widgetId, !widgetId.isEmpty {
            let encoded = widgetId.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? widgetId
            urlString += "?widget=\(encoded)"
        }
        urlString += targetHash
        if let schemeURL = URL(string: urlString) {
            webView.load(URLRequest(url: schemeURL))
        } else if let indexURL = Self.resolveBookIndexURL() {
            let readDir = indexURL.deletingLastPathComponent()
            webView.loadFileURL(indexURL, allowingReadAccessTo: readDir)
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        isDocumentReady = true
        lastChapterNumber = -999
        lastWidgetId = nil
        lastExplorerId = nil
        applyState(in: webView)
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
        pendingChapterNumber = chapterNumber
        pendingWidgetId = widgetId
        pendingExplorerId = explorerId
        pendingTheme = theme
        pendingSyllabusBoard = syllabusBoard
        pendingStampedWidgetIds = stampedWidgetIds
        guard isDocumentReady else { return }
        applyState(in: webView)
    }

    private func applyState(in webView: WKWebView) {
        let chapterNumber = pendingChapterNumber
        let widgetId = pendingWidgetId
        let explorerId = pendingExplorerId
        let theme = pendingTheme
        let syllabusBoard = pendingSyllabusBoard
        let stampedWidgetIds = pendingStampedWidgetIds

        let webTheme = AppTheme.webBookTheme(for: theme)
        func css(_ hex: UInt32) -> String {
            "rgb(\((hex >> 16) & 0xFF), \((hex >> 8) & 0xFF), \(hex & 0xFF))"
        }
        let bgCSS = css(theme.bgHex)
        let surfCSS = css(theme.surfaceHex)
        let inkCSS = css(theme.inkHex)
        let accCSS = css(theme.brassHex)
        let stampsJSON = (try? String(data: JSONEncoder().encode(stampedWidgetIds), encoding: .utf8)) ?? "[]"
        let readerFace = UserDefaults.standard.string(forKey: "kymbio.reader.face") ?? "literata"
        let readerSize = UserDefaults.standard.object(forKey: "kymbio.reader.sizeStep") as? Int ?? 1
        let readerSpacing = KymBioLineSpacing(rawValue: UserDefaults.standard.string(forKey: "kymbio.reader.lineSpacing") ?? "comfortable") ?? .comfortable
        let readerWidth = KymBioReadingWidth(rawValue: UserDefaults.standard.string(forKey: "kymbio.reader.lineWidth") ?? "normal") ?? .normal
        let scaleValues = ["0.92", "1", "1.1", "1.22"]
        let clampedSize = max(0, min(3, readerSize))
        let webScale = scaleValues[clampedSize]
        var js = """
        (function() {
            if (!document.getElementById('kymbio-embed-style')) {
                var st = document.createElement('style');
                st.id = 'kymbio-embed-style';
                st.textContent = '\(Self.embedStylesheet)';
                document.head.appendChild(st);
            }
            document.documentElement.setAttribute('data-theme', '\(webTheme)');
            document.documentElement.setAttribute('data-kymbio-scheme', '\(theme.id)');
            document.documentElement.setAttribute('data-face', '\(readerFace)');
            document.documentElement.style.setProperty('--scale', '\(webScale)');
            document.documentElement.style.setProperty('--lh', '\(readerSpacing.webLineHeight)');
            document.documentElement.style.setProperty('--measure', '\(readerWidth.webMeasure)');
            document.documentElement.style.setProperty('--kymbio-bg', '\(bgCSS)');
            document.documentElement.style.setProperty('--kymbio-surface', '\(surfCSS)');
            document.documentElement.style.setProperty('--kymbio-ink', '\(inkCSS)');
            document.documentElement.style.setProperty('--kymbio-accent', '\(accCSS)');
            if (window.__applyKymBioSettings) {
                window.__applyKymBioSettings({ face: '\(readerFace)', size: \(clampedSize), spacing: '\(readerSpacing.rawValue)', width: '\(readerWidth.rawValue)', theme: '\(webTheme)' });
            }
            try {
                localStorage.setItem('lw.board', '\(syllabusBoard)');
                var stamps = \(stampsJSON);
                for (var i = 0; i < stamps.length; i++) {
                    localStorage.setItem('lw.stamp.' + stamps[i], 'stamped');
                }
            } catch(e) {}
        """

        if let widgetId, !widgetId.isEmpty {
            lastWidgetId = widgetId
            lastExplorerId = nil
            lastChapterNumber = chapterNumber
            js += """
            if (window.__kymbioIsolateWidget) {
                window.__kymbioIsolateWidget('\(widgetId)');
                if (window.App && window.App.ready) {
                    window.App.ready(function() {
                        window.__kymbioIsolateWidget('\(widgetId)');
                        setTimeout(function() { window.__kymbioIsolateWidget('\(widgetId)'); }, 80);
                    });
                }
            }
            """
        } else {
            lastWidgetId = nil
            let targetHash: String
            if let explorerId, !explorerId.isEmpty {
                lastExplorerId = explorerId
                lastChapterNumber = -999
                targetHash = Self.resolveExplorerHash(explorerId)
            } else {
                lastExplorerId = nil
                lastChapterNumber = chapterNumber
                targetHash = chapterNumber < 0 ? "#top" : "#ch\(chapterNumber)"
            }
            js += """
            document.documentElement.removeAttribute('data-kymbio-widget-only');
            function routeFullBook() {
                var hash = '\(targetHash)';
                var el = document.querySelector(hash);
                if (window.App && window.App.reveal && el) {
                    window.App.reveal(el);
                }
                if (window.location.hash !== hash) {
                    window.location.hash = hash;
                }
                window.scrollTo(0, 0);
            }
            if (window.App && window.App.ready) {
                window.App.ready(function() {
                    routeFullBook();
                    setTimeout(routeFullBook, 60);
                });
            } else {
                setTimeout(routeFullBook, 100);
            }
            """
        }

        js += "})();"
        webView.evaluateJavaScript(js, completionHandler: nil)
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any] else { return }
        if let widgetId = body["widgetId"] as? String {
            let readout = (body["readout"] as? String) ?? "Completed in interactive stage"
            Task { @MainActor in
                onWidgetStamped(widgetId, readout)
            }
        } else if let calloutId = body["calloutId"] as? String {
            let responseText = (body["responseText"] as? String) ?? ""
            let confidenceTag = (body["confidenceTag"] as? String) ?? ""
            let readingThinking = (body["readingThinking"] as? String) ?? ""
            Task { @MainActor in
                onCalloutSaved?(calloutId, responseText, confidenceTag, readingThinking)
            }
        }
    }
}
