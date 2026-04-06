// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.3.0"),
        .package(name: "CapacitorCommunityInAppReview", path: "..\..\..\node_modules\@capacitor-community\in-app-review"),
        .package(name: "CapacitorFirebaseAnalytics", path: "..\..\..\node_modules\@capacitor-firebase\analytics"),
        .package(name: "CapacitorFirebaseCrashlytics", path: "..\..\..\node_modules\@capacitor-firebase\crashlytics"),
        .package(name: "CapacitorShare", path: "..\..\..\node_modules\@capacitor\share"),
        .package(name: "CapacitorStatusBar", path: "..\..\..\node_modules\@capacitor\status-bar"),
        .package(name: "CapacitorEmailComposer", path: "..\..\..\node_modules\capacitor-email-composer")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorCommunityInAppReview", package: "CapacitorCommunityInAppReview"),
                .product(name: "CapacitorFirebaseAnalytics", package: "CapacitorFirebaseAnalytics"),
                .product(name: "CapacitorFirebaseCrashlytics", package: "CapacitorFirebaseCrashlytics"),
                .product(name: "CapacitorShare", package: "CapacitorShare"),
                .product(name: "CapacitorStatusBar", package: "CapacitorStatusBar"),
                .product(name: "CapacitorEmailComposer", package: "CapacitorEmailComposer")
            ]
        )
    ]
)
