# Sawmill Calculator Pro

A cross-platform mobile app that assists with lumber and timber calculations. It supports both US (imperial) and metric measurements.

## Features

- **Cut List Calculator** — Generate exact cut positions for sawing boards from a log, accounting for blade kerf
- **Board Feet Calculator** — Calculate lumber volume and pricing for softwoods and hardwoods
- **Log Volume Calculator** — Calculate timber volume using Doyle, Scribner, International 1/4", and ROY scales
- **PDF Export** — Email or share calculation results as PDF reports
- **Offline Support** — Fully functional without internet via localStorage persistence

## Technology Stack

- **[Capacitor](https://capacitorjs.com/)** — Cross-platform native runtime (replaces the previous PhoneGap/Cordova setup)
- **jQuery Mobile** — Touch-optimized UI framework
- **KnockoutJS** — MVVM data binding
- **jsPDF** — Client-side PDF generation

## Migration from PhoneGap

This project was previously built with Apache Cordova / PhoneGap and used Adobe PhoneGap Build for cloud compilation. Since PhoneGap Build was [discontinued in October 2020](https://blog.phonegap.com/update-for-customers-using-phonegap-and-phonegap-build-cc701c77502c), the project has been migrated to **[Capacitor](https://capacitorjs.com/)**.

### Why Capacitor?

- **Free and open source** — MIT license, no subscription or build fees for the framework itself
- **Modern successor to Cordova** — Built by the [Ionic](https://ionicframework.com/) team specifically as a Cordova replacement
- **Drop-in compatible** — Works with existing web apps; uses the same `www` directory structure
- **Browser testing** — Develop and test in any browser, just like PhoneGap
- **iOS and Android** — Full support for both platforms
- **Actively maintained** — Capacitor 8 was released December 2025 with regular updates (8.2.0 in March 2026). The Ionic team follows a clear [support policy](https://capacitorjs.com/docs/main/reference/support-policy) with active development, maintenance, and extended support phases for each major version

### Capacitor Support & Maintenance

Capacitor is backed by the [Ionic](https://ionicframework.com/) team and has strong, ongoing support:

- **Current version:** Capacitor 8 (released December 2025) — actively maintained with new features, bug fixes, and security updates
- **Release cadence:** Regular point releases (v8.0.0 → v8.0.2 → v8.1.0 → v8.2.0 within 3 months)
- **Support policy:** Each major version gets active support → maintenance (critical fixes only) → end of support. See the [official support policy](https://capacitorjs.com/docs/main/reference/support-policy)
- **Open source:** [MIT licensed on GitHub](https://github.com/ionic-team/capacitor) with active community contributions
- **Cordova plugin compatibility:** Most Cordova plugins continue to work with Capacitor
- **Enterprise support:** Available from Ionic for teams that need SLAs and dedicated assistance

### Cloud Build Services (No Local Xcode/Android Studio Required)

Several cloud build services support Capacitor projects, so you don't need to install Xcode or Android Studio locally. Here are the best options under $100/year:

| Service | Starting Cost | iOS Builds | Android Builds | Best For |
|---------|--------------|------------|----------------|----------|
| [VoltBuilder](https://volt.build/) | Free (debug Android); $15/mo for release builds | ✅ | ✅ | Closest PhoneGap Build replacement; simplest workflow |
| [Capawesome Cloud](https://cloud.capawesome.io/) | $9/mo (Starter) | ✅ | ✅ | Official Capacitor recommendation; includes live updates |
| [GitHub Actions](https://github.com/features/actions) | Free for public repos | ✅ (with macOS runner) | ✅ | Free, but requires CI/CD setup |

#### VoltBuilder — Closest to PhoneGap Build (~$15/month)

[VoltBuilder](https://volt.build/) is the most direct replacement for Adobe PhoneGap Build:

- **Free tier:** Debug Android builds, 4 builds/day, 10 MB limit
- **Indy plan ($15/month):** Release builds for both iOS and Android, 20 builds/day, 50 MB limit
- **Includes [VoltSigner](https://volt.build/):** Free certificate signing — no Mac required for iOS certificates
- **Simple workflow:** Zip your project → upload → get store-ready binaries
- **Supports Capacitor and Cordova** projects and plugins

#### Capawesome Cloud — Official Capacitor Recommendation ($9/month)

[Capawesome Cloud](https://cloud.capawesome.io/) is the officially recommended cloud build service for Capacitor (recommended after Ionic Appflow's planned discontinuation in 2027):

- **Starter plan ($9/month):** 200 build minutes (~40 builds), live updates, App Store publishing
- **Professional plan ($29/month):** 600 build minutes (~120 builds), 2 concurrent builds
- **Free for open-source projects** (apply on their site)
- **Live updates:** Push updates directly to user devices without app store review
- **CI/CD integration:** Works with GitHub, GitLab, Bitbucket, and Azure DevOps
- **Price lock guarantee:** Your subscription price never increases

#### GitHub Actions — Free for Public Repos

[GitHub Actions](https://github.com/features/actions) can build Capacitor apps for free:

- **Free for public repositories** (2,000 minutes/month for private repos on free plan)
- **macOS runners available** for iOS builds
- **Requires setup:** You need to write workflow YAML files and manage signing certificates
- **Full control:** Customize your build pipeline however you need

> **Note:** Ionic's [Appflow](https://ionic.io/appflow) is being discontinued (end of service December 2027). It is not recommended for new projects.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (included with Node.js)

### Development (Browser Testing)

```bash
# 1. Clone the repository
git clone https://github.com/GrantErickson/SawmillCalculator2.git
cd SawmillCalculator2

# 2. Install dependencies
npm install

# 3. Start the local development server
npm start
```

This opens the app at `http://localhost:8080` for browser-based testing and development.

### Building for iOS

Requires a Mac with [Xcode](https://developer.apple.com/xcode/) installed.

```bash
# Add the iOS platform (first time only)
npm run cap:add:ios

# Sync web assets to the native project
npm run cap:sync

# Open in Xcode to build and run
npm run cap:open:ios
```

### Building for Android

Requires [Android Studio](https://developer.android.com/studio) installed.

```bash
# Add the Android platform (first time only)
npm run cap:add:android

# Sync web assets to the native project
npm run cap:sync

# Open in Android Studio to build and run
npm run cap:open:android
```

### Using a Cloud Build Service

If you don't have local build tools (Xcode/Android Studio), use a cloud build service.

**Option A: VoltBuilder** (simplest, closest to PhoneGap Build)

1. Sign up at [volt.build](https://volt.build/) (free tier available for debug Android builds)
2. Zip your project files and upload, or connect your Git repository
3. VoltBuilder builds your app and returns store-ready iOS/Android binaries
4. Use [VoltSigner](https://volt.build/) to generate signing certificates for free (no Mac needed)

**Option B: Capawesome Cloud** (official Capacitor recommendation)

1. Sign up at [cloud.capawesome.io](https://cloud.capawesome.io/)
2. Connect your GitHub/GitLab/Bitbucket repository
3. Configure your build settings and signing certificates
4. Build and deploy directly to the App Store and Google Play

## Project Structure

```
├── capacitor.config.json   # Capacitor configuration (app ID, plugins, platform settings)
├── config.xml              # Legacy Cordova config (retained for reference)
├── package.json            # npm dependencies and scripts
├── res/                    # App icons and splash screens
│   ├── icon/               # Platform-specific app icons
│   └── screen/             # Platform-specific splash screens
└── www/                    # Web application source (served by Capacitor)
    ├── index.html          # Main entry point / home screen
    ├── cutlist.html         # Cut List calculator (US)
    ├── cutlistMetric.html   # Cut List calculator (Metric)
    ├── boardfeet.html       # Board Feet calculator (US)
    ├── boardfeetMetric.html # Board Feet calculator (Metric)
    ├── volume.html          # Log Volume calculator (US)
    ├── volumeMetric.html    # Log Volume calculator (Metric)
    ├── settings.html        # App settings
    ├── css/                 # Stylesheets
    ├── lib/                 # Third-party libraries (jQuery, KnockoutJS, jsPDF)
    └── scripts/             # Application logic
```

## License

ISC
