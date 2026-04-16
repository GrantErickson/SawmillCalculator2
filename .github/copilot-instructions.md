# Copilot Instructions for Sawmill Calculator Pro

## Project Overview

Sawmill Calculator Pro is a cross-platform mobile app for lumber and timber calculations (cut lists, board feet, log volume). It targets iOS and Android via Capacitor and is also testable in the browser.

- **App ID:** `net.micapeak.SawmillCalculatorPro`
- **Author:** MicaPeak Solutions
- **License:** ISC

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI framework | Vue 3 (Composition API with `<script setup>`) | ^3.5 |
| UI components | Ionic Framework (`@ionic/vue`) | ^8.8 |
| Build tool | Vite | ^8.0 |
| Language | TypeScript (strict mode off) | ^6.0 |
| Native runtime | Capacitor | ^8.3 |
| Routing | Vue Router via `@ionic/vue-router` | ^4.6 |
| PDF generation | jsPDF (loaded via `<script>` tag in `index.html`) | global `jsPDF` |
| Analytics | Firebase Analytics (`@capacitor-firebase/analytics`) | ^8.2 |
| Cloud builds | Capawesome Cloud | — |
| Version management | @capawesome/capver | ^0.1 |

## Project Structure

```
src/
├── main.ts              # App entry point — Vue + Ionic bootstrap
├── App.vue              # Root component (review prompt timer)
├── router/index.ts      # Route definitions with analytics screen tracking
├── stores/settings.ts   # Reactive settings backed by localStorage
├── utils/
│   ├── formatting.ts    # Number/currency formatting helpers
│   ├── email.ts         # PDF generation and email/share via capacitor-email-composer
│   ├── analytics.ts     # Firebase Analytics wrappers (native only)
│   └── review.ts        # In-app review prompt logic
├── theme/variables.css  # Ionic CSS custom properties
└── views/               # Page components (one per route)
    ├── HomePage.vue
    ├── CutListPage.vue / CutListMetricPage.vue
    ├── BoardFeetPage.vue / BoardFeetMetricPage.vue
    ├── VolumePage.vue / VolumeMetricPage.vue
    ├── SettingsPage.vue
    ├── AboutPage.vue
    └── PrivacyPage.vue
```

Key non-source directories:

- `android/` — Android native project (committed to repo; required by Capawesome Cloud)
- `ios/` — iOS native project (committed to repo; required by Capawesome Cloud)
- `public/lib/jspdf.js` — jsPDF library loaded globally
- `dist/` — Vite build output (gitignored)
- `docs/` — Additional deployment guides

## Coding Conventions

### Vue Components

- **Always** use `<script setup lang="ts">` (Composition API, no Options API).
- Import Ionic components explicitly from `@ionic/vue` (tree-shaking).
- Import icons from `ionicons/icons`.
- Use `ref()` and `computed()` for reactive state — this project migrated from KnockoutJS and follows the same observable/computed pattern.
- Use `watch()` to persist values to `localStorage`.
- Each calculator page is self-contained with its own state; there is no global Vuex/Pinia store.
- Shared settings live in `src/stores/settings.ts` as exported `ref()` values.

### State Persistence

All user data is persisted to `localStorage`. Pattern:

```typescript
const myValue = ref(Number(localStorage.getItem('MyKey')) || defaultValue)
watch(myValue, (v) => localStorage.setItem('MyKey', String(v)))
```

There is no backend, no API calls, and no authentication. The app works entirely offline.

### TypeScript

- `strict` mode is **off** in `tsconfig.json`.
- Target is `ESNext` with bundler module resolution.
- The `@/*` path alias maps to `./src/*`.

### Ionic Component Patterns

- Pages use `<ion-page>` → `<ion-header>` → `<ion-content>` structure.
- Sub-pages include `<ion-back-button default-href="/">` in the toolbar.
- Range inputs pair `<ion-range>` with an `<ion-input>` in the `end` slot for direct numeric entry.
- Use `@ionChange` and `@ionInput` events (not native DOM events) for Ionic components.
- Use `$event.detail.value` to read Ionic event values.

### Formatting

- Use helpers from `src/utils/formatting.ts`: `formatNumber`, `formatMoney`, `formatBft`, `formatBft2`, `formatM3`, `round`.
- Money formatting respects the user's `moneySymbol` and `moneySymbolLocation` settings.

### Analytics

- Firebase Analytics is only active on native platforms (`Capacitor.isNativePlatform()`).
- Use `logScreenView()` for page views (already handled by the router `afterEach` guard).
- Use `logEvent()` for custom events (e.g., `add_lumber_item`, `send_email`).
- Analytics calls should never block the UI — all errors are silently caught.

### Email / PDF Export

- `sendEmail()` in `src/utils/email.ts` generates a PDF with jsPDF, then:
  1. Tries `capacitor-email-composer` (native platforms)
  2. Falls back to Web Share API
  3. Falls back to direct PDF download
- PDF content is built as HTML table strings using `pdfStyles`.

## Build & Development Commands

```bash
npm run dev          # Start Vite dev server at http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
npm run cap:sync     # Sync dist/ to native projects (run after build)
npm run cap:open:ios     # Open iOS project in Xcode
npm run cap:open:android # Open Android project in Android Studio
```

### Build Notes

- Vite 8 + Ionic produces benign `lightningcss` warnings about `:host-context` during build. These are harmless and cannot be suppressed in Vite 8. The build succeeds.
- The `webDir` in `capacitor.config.json` is `dist` (not `www`).

## Version Management

This project uses `@capawesome/capver` to keep versions in sync across `package.json`, `android/app/build.gradle`, and `ios/App/App.xcodeproj/project.pbxproj`.

```bash
npm run version:get      # Check current version across all platforms
npm run version:patch    # Bump patch (e.g., 3.0.18 → 3.0.19)
npm run version:minor    # Bump minor (e.g., 3.0.19 → 3.1.0)
npm run version:major    # Bump major (e.g., 3.1.0 → 4.0.0)
```

### ⚠️ Version Bump Gotchas

After running any `version:patch/minor/major` command:

1. **`package-lock.json`** — capver does NOT update `package-lock.json`. Manually update the `"version"` field at the top of `package-lock.json` to match `package.json`.
2. **`ios/App/App.xcodeproj/project.pbxproj`** — capver strips leading zeros from `LastSwiftUpdateCheck` and `LastUpgradeCheck` (e.g., `0920` → `920`). Restore them to `0920` after running capver.
3. **`ios/App/App/Info.plist`** — capver updates `CFBundleShortVersionString` and `CFBundleVersion` here. Verify they match.

### Version Workflow for a Release

1. `npm run version:patch` (or `minor` / `major`)
2. Fix `package-lock.json` version manually
3. Restore leading zeros in `project.pbxproj` (`LastSwiftUpdateCheck = 0920`, `LastUpgradeCheck = 0920`)
4. `npm run version:get` — verify all platforms show the same version
5. Commit all changed files
6. Push to trigger Capawesome Cloud build

## Capawesome Cloud Builds

Configuration is in `capawesome.config.json`. On every build, Capawesome Cloud runs:

1. `npm install` (dependency install)
2. `npm run build` (Vite production build to `dist/`)
3. `npx cap sync` (syncs web assets to native projects)
4. Native build (Xcode/Gradle)

### ⚠️ CRITICAL: Run Version Patch Before Each Build

**Before every Capawesome Cloud build**, you must bump the version with `npm run version:patch` (or `minor`/`major`). The App Store (iOS) and Google Play (Android) **reject duplicate version numbers**. If you push a build without bumping the version, the store submission will fail.

The complete pre-build checklist:

1. `npm run version:patch` — bump the version
2. Fix `package-lock.json` version to match
3. Restore leading zeros in `project.pbxproj` if needed
4. Commit and push

### Build Configuration

The `android/` and `ios/` directories are committed to the repo (not gitignored). This is intentional — Capawesome Cloud expects them to exist.

## Android-Specific Notes

- **AD_ID:** This app does not use advertising. `AndroidManifest.xml` includes `tools:node="remove"` for the `AD_ID` permission. In Google Play Console, declare "No" under Policy and programs → App content → Advertising ID.
- **In-app review:** `@capacitor-community/in-app-review` requires `googleAndroidPlayReviewVersion = '2.0.2'` in `android/variables.gradle`.
- **Build signing:** Uses Google Play Managed App Signing. See `docs/android-play-signing-capawesome-guide.md`.

## iOS-Specific Notes

- **SPM (Swift Package Manager):** Capacitor 8 uses SPM for iOS dependencies. Configuration in `capacitor.config.json` under `experimental.ios.spm`.
- **Firebase without Ad ID:** The `AnalyticsWithoutAdIdSupport` trait is set in `capacitor.config.json` to exclude IDFA from Firebase Analytics on iOS.
- **Content inset:** `ios.contentInset` is set to `"always"` to handle safe areas.

## Capacitor Configuration Highlights

From `capacitor.config.json`:

- StatusBar: white background, dark style, no overlay
- SplashScreen: auto-hide enabled, CENTER_CROP on Android
- No mixed content on Android (`allowMixedContent: false`)

## Native Platform Detection

Use `Capacitor.isNativePlatform()` or `Capacitor.getPlatform()` to detect the runtime environment. Do NOT use `location.hostname` checks — both iOS and Android use `localhost`.

## Dependencies to Be Aware Of

- `capacitor-email-composer` — Email with HTML body and base64 PDF attachments (native)
- `@capacitor/share` — Web Share API fallback
- `@capacitor-firebase/analytics` and `@capacitor-firebase/crashlytics` — Firebase integration
- `@capacitor-community/in-app-review` — Native in-app review prompts
- `firebase` — Firebase SDK (used by the Capacitor Firebase plugins)
- `jsPDF` — Loaded as a global script, NOT an npm import. Access via `new jsPDF()`.

## Testing

- There is no test framework currently configured (Jasmine tests from the old KnockoutJS codebase were removed during migration).
- Test manually in the browser with `npm run dev`.
- Test on native platforms via Capawesome Cloud builds or local Xcode/Android Studio.

## Documentation

- `README.md` — Project overview, getting started, and project structure
- `docs.md` — Full development and build guide (local testing, native builds, version management, Capawesome Cloud setup, iOS signing)
- `framework-recommendations.md` — Historical evaluation of framework migration from KnockoutJS/jQuery Mobile to Vue/Ionic
- `docs/android-play-signing-capawesome-guide.md` — Detailed Android AAB signing and Google Play submission guide
