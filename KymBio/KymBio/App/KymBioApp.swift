import SwiftUI

@main
struct KymBioApp: App {
    @StateObject private var store = AppStore.shared

    init() {
        AppTheme.register()
        let herbariumDefaultKey = "kymbio.herbariumThemeDefault.v2"
        if UserDefaults.standard.string(forKey: herbariumDefaultKey) == nil {
            UserDefaults.standard.set(StandardTheme.parchment.id, forKey: StandardThemeStore.subjectAppStorageKey)
            UserDefaults.standard.set("1", forKey: herbariumDefaultKey)
        }
        TutorConstitution.register(.kymBio)
    }

    var body: some Scene {
        WindowGroup {
            StandardIdiomReader {
                KymBioRootShellView()
                    .environmentObject(store)
                    .standardThemeHost()
                    .onOpenURL { url in
                        store.openDeepLink(url)
                    }
                    .task {
                        let args = ProcessInfo.processInfo.arguments
                        if let idx = args.firstIndex(of: "--room"), idx + 1 < args.count,
                           let room = AppRoom(rawValue: args[idx + 1]) {
                            store.selectedRoom = room
                        }
                        if let idx = args.firstIndex(of: "--explorer"), idx + 1 < args.count {
                            store.activeExplorerId = args[idx + 1]
                        }
                        if let idx = args.firstIndex(of: "--chapter"), idx + 1 < args.count,
                           let ch = Int(args[idx + 1]) {
                            store.activeExplorerId = nil
                            store.activeLivingWorldChapter = ch
                        }
                        SystemSurfaceSnapshotStore.shared.indexContentInSpotlight(pack: store.pack)
                    }
            }
        }
        #if os(macOS)
        Settings {
            KymBioAppearanceSettingsSheet(appName: "KymBio", showsDone: false)
                .standardThemeHost(rebuildsOnThemeChange: false)
        }
        #endif
    }
}

struct KymBioRootShellView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @State private var columnVisibility: NavigationSplitViewVisibility = .all
    @State private var showPageScannerSheet: Bool = false
    @State private var showMetacognitionSheet: Bool = false
    @State private var isPencilAnnotatorActive: Bool = false

    private var studioTabTag: AppRoom {
        switch store.selectedRoom {
        case .coach, .vaultAndTips, .labJournal, .calendar:
            return store.selectedRoom
        default:
            return .coach
        }
    }

    var body: some View {
        ZStack {
            #if os(iOS)
            if horizontalSizeClass == .compact {
                compactPhoneShellView
                    .tint(Color.kymaiaPrimary)
            } else {
                regularSplitShellView
                    .tint(Color.kymaiaPrimary)
            }
            #else
            regularSplitShellView
                .tint(Color.kymaiaPrimary)
            #endif

            if isPencilAnnotatorActive {
                FullScreenPencilAnnotatorOverlay(isPresented: $isPencilAnnotatorActive)
                    .environmentObject(store)
            }
        }
        .sheet(isPresented: $showPageScannerSheet) {
            TextbookPageScannerSheet()
                .environmentObject(store)
                #if os(macOS)
                .frame(minWidth: 760, minHeight: 620)
                #endif
        }
        .sheet(isPresented: $showMetacognitionSheet) {
            MetacognitionAndBackupSheet()
                .environmentObject(store)
                #if os(macOS)
                .frame(minWidth: 780, minHeight: 660)
                #endif
        }
    }

    private var regularSplitShellView: some View {
        NavigationSplitView(columnVisibility: $columnVisibility) {
            sidebarView
                .toolbar {
                    ToolbarItem(placement: .automatic) {
                        KymBioSettingsButton(appName: "KymBio")
                    }
                }
                .navigationSplitViewColumnWidth(
                    min: 248,
                    ideal: 268,
                    max: 300
                )
        } detail: {
            NavigationStack {
                detailDestinationView
                    .toolbar {
                        sharedPrimaryToolbarItems
                    }
            }
        }
    }

    private var compactPhoneShellView: some View {
        TabView(selection: $store.selectedRoom) {
            NavigationStack {
                TodayHomeView()
                    .toolbar { compactPhoneToolbarItems }
            }
            .tabItem {
                Label("Today", systemImage: "sun.max.fill")
            }
            .tag(AppRoom.today)

            NavigationStack {
                LivingWorldHomeView()
                    .toolbar { compactPhoneToolbarItems }
            }
            .tabItem {
                Label("Living World", systemImage: "leaf.fill")
            }
            .tag(AppRoom.livingWorld)

            NavigationStack {
                SchoolScienceHomeView()
                    .toolbar { compactPhoneToolbarItems }
            }
            .tabItem {
                Label("Science 8", systemImage: "book.closed.fill")
            }
            .tag(AppRoom.schoolScience)

            NavigationStack {
                LabsAtlasHomeView()
                    .toolbar { compactPhoneToolbarItems }
            }
            .tabItem {
                Label("3D Labs", systemImage: "cube.transparent.fill")
            }
            .tag(AppRoom.labsAtlas)

            NavigationStack {
                detailDestinationView
                    .toolbar { compactPhoneToolbarItems }
            }
            .tabItem {
                Label("Coach & Tools", systemImage: "bubble.left.and.text.bubble.right.fill")
            }
            .tag(studioTabTag)
        }
    }

    @ToolbarContentBuilder
    private var sharedPrimaryToolbarItems: some ToolbarContent {
        ToolbarItemGroup(placement: .primaryAction) {
            Button {
                showPageScannerSheet = true
            } label: {
                Label("Scan Textbook Page", systemImage: "doc.text.viewfinder")
            }
            .help("Scan or slot a Cambridge Learner's Book 8 or Workbook 8 page")

            Button {
                isPencilAnnotatorActive.toggle()
            } label: {
                Label("Annotate Screen", systemImage: isPencilAnnotatorActive ? "pencil.tip.crop.circle.fill" : "pencil.tip.crop.circle")
            }
            .help("Annotate the current screen with Apple Pencil and save to Lab Journal")

            Button {
                showMetacognitionSheet = true
            } label: {
                Label("Mistake Log & Backup", systemImage: "chart.xyaxis.line")
            }
            .help("Review common mistakes and save a .kymbiobackup archive")
        }
    }

    @ToolbarContentBuilder
    private var compactPhoneToolbarItems: some ToolbarContent {
        ToolbarItem(placement: .automatic) {
            Menu {
                Section("All Study Rooms") {
                    ForEach(AppRoom.allCases) { room in
                        Button {
                            store.selectedRoom = room
                        } label: {
                            Label(room.title, systemImage: room.symbol)
                        }
                    }
                }
                Section("The Living World Volumes") {
                    ForEach(store.pack.volumes) { vol in
                        Button {
                            if let firstCh = vol.chapters.first {
                                store.activeLivingWorldChapter = firstCh
                            }
                            store.selectedRoom = .livingWorld
                        } label: {
                            Label("Vol \(roman(vol.number)) · \(shortVolumeTitle(vol.number))", systemImage: "book.pages.fill")
                        }
                    }
                }
                Section("Cambridge Science 8 Units") {
                    ForEach(store.pack.schoolTextbook.units(for: .biologyCore)) { unit in
                        Button {
                            store.selectedUnitNumber = unit.unitNumber
                            store.selectedRoom = .schoolScience
                        } label: {
                            Label("Unit \(unit.unitNumber) · \(unit.title)", systemImage: "leaf.fill")
                        }
                    }
                }
            } label: {
                Label("Rooms & Chapters", systemImage: "list.bullet.rectangle")
            }
            .accessibilityIdentifier("compact.rooms-menu")
        }

        ToolbarItemGroup(placement: .primaryAction) {
            Button {
                showPageScannerSheet = true
            } label: {
                Label("Scan Page", systemImage: "doc.text.viewfinder")
            }
            KymBioSettingsButton(appName: "KymBio")
        }
    }

    private var sidebarView: some View {
        List {
            Section {
                ForEach(AppRoom.allCases) { room in
                    let isSelected = store.selectedRoom == room
                    Button {
                        store.selectedRoom = room
                    } label: {
                        JournalRow(
                            title: room.title,
                            subtitle: nil,
                            icon: .glyph(symbol: room.symbol, tint: isSelected ? .kymaiaPrimaryStrong : .kymaiaPrimary),
                            trailing: trailingCount(for: room, emphasized: isSelected)
                        )
                    }
                    .buttonStyle(.plain)
                    .listRowBackground(
                        RoundedRectangle(cornerRadius: CornerRadius.small, style: .continuous)
                            .fill(isSelected ? Color.kymaiaSelectionFill : Color.clear)
                    )
                    .accessibilityIdentifier("sidebar.room.\(room.rawValue)")
                }
            } header: {
                Text("Study Rooms")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaMutedInk)
                    .textCase(nil)
            }

            Section {
                ForEach(store.pack.schoolTextbook.units(for: .biologyCore)) { unit in
                    Button {
                        store.selectedUnitNumber = unit.unitNumber
                        store.selectedRoom = .schoolScience
                    } label: {
                        JournalRow(
                            title: "Unit \(unit.unitNumber) · \(unit.title)",
                            subtitle: "LB pp. \(unit.learnersBookStartPage)–\(unit.learnersBookEndPage) · \(unit.isCompletedInSchool ? "Done" : "Up next")",
                            icon: .glyph(symbol: "leaf.fill", tint: .kymaiaSuccess),
                            trailing: .none
                        )
                    }
                    .buttonStyle(.plain)
                    .accessibilityIdentifier("sidebar.bio-unit.\(unit.unitNumber)")
                }
            } header: {
                Text("Cambridge Science 8")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaMutedInk)
                    .textCase(nil)
            }

            Section {
                ForEach(store.pack.volumes) { vol in
                    Button {
                        if let firstCh = vol.chapters.first {
                            store.activeLivingWorldChapter = firstCh
                        }
                        store.selectedRoom = .livingWorld
                    } label: {
                        let firstCh = vol.chapters.first ?? 0
                        let lastCh = vol.chapters.last ?? 0
                        JournalRow(
                            title: "Vol \(roman(vol.number)) · \(shortVolumeTitle(vol.number))",
                            subtitle: "Chapters \(firstCh)–\(lastCh)",
                            icon: .glyph(symbol: "book.pages.fill", tint: .kymaiaPrimary),
                            trailing: .none
                        )
                    }
                    .buttonStyle(.plain)
                    .accessibilityIdentifier("sidebar.volume.\(vol.number)")
                }
            } header: {
                Text("The Living World")
                    .font(.kymaiaCaption.weight(.semibold))
                    .foregroundStyle(Color.kymaiaMutedInk)
                    .textCase(nil)
            }
        }
        .journalListRows()
        .scrollContentBackground(.hidden)
        .background(KymaiaBackground())
    }

    private func trailingCount(for room: AppRoom, emphasized: Bool) -> JournalRow.Trailing {
        switch room {
        case .today:
            return .count(store.dueFSRSCards.count, emphasized: emphasized)
        case .calendar:
            return .count(store.deadlines.count, emphasized: emphasized)
        case .schoolScience, .livingWorld, .labsAtlas, .vaultAndTips, .labJournal, .coach:
            return .none
        }
    }

    private func shortVolumeTitle(_ n: Int) -> String {
        switch n {
        case 1: return "Cells & Life"
        case 2: return "Energy & Systems"
        case 3: return "Health & Microbes"
        case 4: return "Genes & Ecosystems"
        default: return "Volume \(n)"
        }
    }

    private func roman(_ n: Int) -> String {
        switch n {
        case 1: return "I"
        case 2: return "II"
        case 3: return "III"
        case 4: return "IV"
        default: return "\(n)"
        }
    }

    @ViewBuilder
    private var detailDestinationView: some View {
        switch store.selectedRoom {
        case .today:
            TodayHomeView()
        case .livingWorld:
            LivingWorldHomeView()
        case .schoolScience:
            SchoolScienceHomeView()
        case .labsAtlas:
            LabsAtlasHomeView()
        case .vaultAndTips:
            BiologyVaultHomeView()
        case .labJournal:
            LabJournalHomeView()
        case .coach:
            BiologyCoachView()
        case .calendar:
            CalendarHomeView()
        }
    }
}
