import SwiftUI

@main
struct KymBioApp: App {
    @StateObject private var store = AppStore.shared
    @AppStorage(CuratedColorScheme.storageKey) private var selectedSchemeRaw = CuratedColorScheme.defaultScheme.rawValue

    init() {
        CuratedColorScheme.registerAsKymaiaTheme()
        TutorConstitution.register(.kymBio)
    }

    private var activeScheme: CuratedColorScheme {
        CuratedColorScheme(rawValue: selectedSchemeRaw) ?? .defaultScheme
    }

    var body: some Scene {
        WindowGroup {
            KymBioRootShellView()
                .environmentObject(store)
                .environment(\.curatedColorScheme, activeScheme)
                .id(activeScheme.rawValue)
                .onOpenURL { url in
                    store.openDeepLink(url)
                }
                .task {
                    SystemSurfaceSnapshotStore.shared.indexContentInSpotlight(pack: store.pack)
                }
        }
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
                                    Label("Error Log & Backup", systemImage: "chart.xyaxis.line")
                                }
                                .help("Metacognition error-attribution log and .kymbiobackup archive")
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
                            subtitle: room.subtitle,
                            icon: .glyph(symbol: room.symbol, tint: .kymaiaPrimary),
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
                Text("KymBio · 8th Grade Biology")
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
                            title: "Unit \(unit.unitNumber): \(unit.title)",
                            subtitle: "LB p. \(unit.learnersBookStartPage) · WB p. \(unit.workbookStartPage)",
                            icon: .tile(symbol: "leaf.fill", tint: .kymaiaSuccess),
                            trailing: .chip(
                                unit.isCompletedInSchool ? "Ticked" : "Next",
                                tone: unit.isCompletedInSchool ? .good : .accent,
                                showsChevron: true
                            )
                        )
                    }
                    .buttonStyle(.plain)
                    .accessibilityIdentifier("sidebar.bio-unit.\(unit.unitNumber)")
                }
            } header: {
                Text("Cambridge Science 8 Biology")
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
                        JournalRow(
                            title: "Volume \(vol.number)",
                            subtitle: vol.title.replacingOccurrences(of: "Volume \(roman(vol.number)) · ", with: ""),
                            icon: .tile(symbol: "book.pages.fill", tint: .kymaiaPrimary),
                            trailing: .count(vol.chapters.count)
                        )
                    }
                    .buttonStyle(.plain)
                    .accessibilityIdentifier("sidebar.volume.\(vol.number)")
                }
            } header: {
                Text("The Living World (16 Chapters)")
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
        case .schoolScience:
            return .count(store.pack.schoolQuestions.count, emphasized: emphasized)
        case .livingWorld:
            return .count(store.pack.chapters.count, emphasized: emphasized)
        case .labsAtlas:
            return .count(store.pack.widgets.count, emphasized: emphasized)
        case .vaultAndTips:
            return .count(BiologyVaultCatalog.cards.count + BiologyVaultCatalog.morphemes.count, emphasized: emphasized)
        case .labJournal:
            return .count(store.journalEntries.count, emphasized: emphasized)
        case .coach:
            return .count(QuantitativeBioEngine.allProblems.count, emphasized: emphasized)
        case .calendar:
            return .count(store.deadlines.count, emphasized: emphasized)
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
