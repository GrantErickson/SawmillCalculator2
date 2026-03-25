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

- **Free and open source** — No subscription or build fees
- **Modern successor to Cordova** — Built by the [Ionic](https://ionicframework.com/) team specifically as a Cordova replacement
- **Drop-in compatible** — Works with existing web apps; uses the same `www` directory structure
- **Browser testing** — Develop and test in any browser, just like PhoneGap
- **iOS and Android** — Full support for both platforms
- **Active maintenance** — Regular updates with modern native platform support

### Alternative Build Services (under $100/year)

If you need a cloud build service (no local Xcode/Android Studio):

| Service | Cost | Notes |
|---------|------|-------|
| [VoltBuilder](https://volt.build/) | ~$36/year (Starter) | Direct replacement for PhoneGap Build; supports Cordova & Capacitor projects |
| [Appflow](https://ionic.io/appflow) | Free tier available | Ionic's cloud build service; native builds require paid plan |
| [GitHub Actions](https://github.com/features/actions) | Free for public repos | Self-managed CI/CD; requires setup but fully free |

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

If you don't have local build tools (Xcode/Android Studio), you can use a cloud build service like [VoltBuilder](https://volt.build/):

1. Push your code to a Git repository
2. Sign up at [volt.build](https://volt.build/)
3. Connect your repository and configure signing certificates
4. Build iOS and Android packages in the cloud

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
