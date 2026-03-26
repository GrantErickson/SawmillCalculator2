# Sawmill Calculator Pro

A cross-platform mobile app that assists with lumber and timber calculations. It supports both US (imperial) and metric measurements.

## Features

- **Cut List Calculator** — Generate exact cut positions for sawing boards from a log, accounting for blade kerf
- **Board Feet Calculator** — Calculate lumber volume and pricing for softwoods and hardwoods
- **Log Volume Calculator** — Calculate timber volume using Doyle, Scribner, International 1/4", and ROY scales
- **PDF Export** — Email or share calculation results as PDF reports
- **Offline Support** — Fully functional without internet via localStorage persistence

## Technology Stack

- **[Vue.js 3](https://vuejs.org/)** — Reactive UI framework (Composition API with `ref`, `computed`, `watch`)
- **[Ionic Framework](https://ionicframework.com/)** — Mobile-optimized UI components (platform-adaptive iOS/Android styling)
- **[Vite](https://vitejs.dev/)** — Fast build tool with hot module replacement
- **[Vue Router](https://router.vuejs.org/)** — Single-page application routing via `@ionic/vue-router`
- **[Capacitor](https://capacitorjs.com/)** — Cross-platform native runtime (replaces the previous PhoneGap/Cordova setup)
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[jsPDF](https://github.com/parallax/jsPDF)** — Client-side PDF generation

> **Migration Note:** This project was migrated from KnockoutJS + jQuery Mobile to Vue + Ionic. See [`framework-recommendations.md`](framework-recommendations.md) for the evaluation that led to this decision.

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

### Cloud Builds with Capawesome Cloud

This project uses [Capawesome Cloud](https://cloud.capawesome.io/) for native iOS and Android builds — no local Xcode or Android Studio required.

- **Starter plan ($9/month):** 200 build minutes (~40 builds), live updates, App Store publishing
- **Professional plan ($29/month):** 600 build minutes (~120 builds), 2 concurrent builds
- **Free for open-source projects** (apply on their site)
- **Price lock guarantee:** Your subscription price never increases

The project includes a [`capawesome.config.json`](capawesome.config.json) file that configures Capawesome Cloud builds. See [`docs.md`](docs.md) for detailed setup instructions.

> **Note:** Ionic's [Appflow](https://ionic.io/appflow) is being discontinued (end of service December 2027). Capawesome Cloud is the officially recommended replacement.

### Version Management with Capver

This project uses [@capawesome/capver](https://github.com/capawesome-team/capver) to manage version numbers across all platforms (web, iOS, Android) from a single command:

```bash
npm run version:get      # Check current version across all platforms
npm run version:patch    # Bump patch version (e.g., 3.0.0 → 3.0.1)
npm run version:minor    # Bump minor version (e.g., 3.0.1 → 3.1.0)
npm run version:major    # Bump major version (e.g., 3.1.0 → 4.0.0)
```

See [`docs.md`](docs.md) for the full version management guide.

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
npm run dev
```

This opens the app at `http://localhost:5173` for browser-based testing and development with hot module replacement.

### Production Build

```bash
npm run build    # Builds to dist/
npm run preview  # Preview the production build locally
```

### Building for iOS

Requires a Mac with [Xcode](https://developer.apple.com/xcode/) installed.

```bash
# Build the web app and sync to the native project
npm run build
npm run cap:sync

# Open in Xcode to build and run
npm run cap:open:ios
```

### Building for Android

Requires [Android Studio](https://developer.android.com/studio) installed.

```bash
# Build the web app and sync to the native project
npm run build
npm run cap:sync

# Open in Android Studio to build and run
npm run cap:open:android
```

### Using Capawesome Cloud (Recommended)

If you don't have local build tools (Xcode/Android Studio), use [Capawesome Cloud](https://cloud.capawesome.io/) for native builds:

1. Sign up at [cloud.capawesome.io](https://cloud.capawesome.io/)
2. Create a new app in the Capawesome Cloud Console
3. Copy your Capawesome App ID and update `capawesome.config.json` (replace `YOUR_CAPAWESOME_APP_ID`)
4. Connect your GitHub repository
5. Upload your iOS certificates and/or Android keystore in the Capawesome Cloud Console
6. Trigger a build from the console or push to your connected branch

For full setup instructions including pipeline configuration, see [`docs.md`](docs.md).

## Project Structure

```
├── android/                # Android native project (generated by Capacitor)
├── ios/                    # iOS native project (generated by Capacitor)
├── public/                 # Static assets (copied as-is to dist/)
│   └── lib/jspdf.js        # jsPDF library for PDF generation
├── src/                    # Vue application source code
│   ├── main.ts             # App entry point (Vue + Ionic setup)
│   ├── App.vue             # Root Vue component
│   ├── router/index.ts     # Vue Router configuration
│   ├── stores/settings.ts  # Reactive settings store (localStorage)
│   ├── utils/              # Shared utilities
│   │   ├── formatting.ts   # Number/currency formatting
│   │   └── email.ts        # PDF generation & email/share
│   ├── theme/variables.css # Ionic theme customization
│   └── views/              # Page components
│       ├── HomePage.vue
│       ├── CutListPage.vue / CutListMetricPage.vue
│       ├── BoardFeetPage.vue / BoardFeetMetricPage.vue
│       ├── VolumePage.vue / VolumeMetricPage.vue
│       ├── SettingsPage.vue
│       ├── AboutPage.vue
│       └── PrivacyPage.vue
├── dist/                   # Production build output (served by Capacitor)
├── index.html              # Vite entry point
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
├── capacitor.config.json   # Capacitor configuration (app ID, plugins)
├── capawesome.config.json  # Capawesome Cloud build configuration
├── package.json            # npm dependencies and scripts
└── res/                    # App icons and splash screens
```

## License

ISC
