import SwiftUI

@main
struct KymBioApp: App {
    @StateObject private var store = AppStore.shared

    init() {
        AppTheme.register()
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
                        SystemSurfaceSnapshotStore.shared.indexContentInSpotlight(pack: store.pack)
                    }
            }
        }
        #if os(macOS)
        Settings {
            StandardAppearanceSettings(appName: "KymBio")
                .standardThemeHost(rebuildsOnThemeChange: false)
        }
        #endif
    }
}

struct KymBioRootShellView: View {
    @EnvironmentObject private var store: AppStore
    @State private var showPageScannerSheet: Bool = false
    @State private var showMetacognitionSheet: Bool = false
    @State private var isPencilAnnotatorActive: Bool = false

    var body: some View {
        ZStack {
            NavigationSplitView {
                sidebarView
                    .toolbar {
                        ToolbarItem(placement: .automatic) {
                            StandardSettingsButton(appName: "KymBio")
                        }
                    }
                    .navigationSplitViewColumnWidth(
                        min: Theme.Dimension.sidebarMinimumWidth,
                        ideal: Theme.Dimension.sidebarIdealWidth,
                        max: Theme.Dimension.sidebarMaximumWidth
                    )
            } detail: {
                NavigationStack {
                    detailDestinationView
                        .toolbar {
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
                }
            }
            .tint(Color.kymaiaPrimary)

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
                            subtitle: "LB pp. \(unit.learnersBookStartPage)–\(unit.learnersBookEndPage)",
                            icon: .glyph(symbol: "leaf.fill", tint: .kymaiaSuccess),
                            trailing: .text(unit.isCompletedInSchool ? "Done" : "Up next")
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
                            subtitle: nil,
                            icon: .glyph(symbol: "book.pages.fill", tint: .kymaiaPrimary),
                            trailing: .text("Ch \(firstCh)–\(lastCh)")
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
