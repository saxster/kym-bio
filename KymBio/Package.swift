// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "KymBio",
    platforms: [
        .macOS(.v14),
        .iOS(.v17)
    ],
    products: [
        .executable(name: "KymBio", targets: ["KymBio"])
    ],
    dependencies: [
        .package(url: "https://github.com/groue/GRDB.swift.git", from: "6.24.0"),
        .package(path: "../../teaching_kit")
    ],
    targets: [
        .executableTarget(
            name: "KymBio",
            dependencies: [
                .product(name: "GRDB", package: "GRDB.swift"),
                .product(name: "KymDesign", package: "teaching_kit"),
                .product(name: "KymLearning", package: "teaching_kit"),
                .product(name: "KymTutorAI", package: "teaching_kit")
            ],
            path: "KymBio",
            exclude: [
                "Info-iPad.plist",
                "KymBio.entitlements",
                "KymBio-iPad.entitlements"
            ],
            resources: [
                .copy("Resources/ContentPacks"),
                .copy("Resources/LivingWorldBook")
            ]
        ),
        .testTarget(
            name: "KymBioTests",
            dependencies: [
                "KymBio",
                .product(name: "GRDB", package: "GRDB.swift")
            ],
            path: "Tests"
        )
    ]
)
