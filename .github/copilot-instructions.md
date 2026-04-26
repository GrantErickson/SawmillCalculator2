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

## Domain Knowledge — Sawmill & Lumber Calculations

Understanding the domain is essential for writing correct calculator logic.

### Lumber Terminology

| Term | Definition |
|------|-----------|
| **Board foot (bft)** | Volume unit: thickness(in) × width(in) × length(ft) ÷ 12. One board foot = 144 cubic inches. |
| **Kerf** | The width of material removed by the saw blade during a cut. Expressed in 32nds of an inch (e.g., kerf=2 means 1/16"). |
| **Flitch** | The outermost slab cut from a log. Often used as a starting offset before the first usable board. |
| **Slab** | The first and last pieces cut from a log; usually contains bark and is discarded or used as flitch. |
| **Nominal thickness** | The stated dimension of lumber before surfacing (e.g., a 2×4 is nominally 2" thick but actually 1.5"). |
| **Quarter-sawn (quarters)** | Hardwood thickness measured in quarters of an inch (e.g., 8/4 = 2" thick). |
| **Log scale** | Estimate of board-foot volume in a log before milling. Several methods exist (see below). |

### Board Feet Formulas

**Softwood** (thickness in whole inches):
```
bft = thickness × width × length / 12
```

**Hardwood** (thickness in quarters of an inch):
```
bft = (thickness/4) × width × length / 12
```

### Log Volume Scales

Four standard methods are supported. All inputs: `d` = diameter (inches, inside bark), `l` = log length (feet).

| Scale | Formula |
|-------|---------|
| **Doyle** | `(d - 4)² × (l / 16)` |
| **Scribner** | `(0.79d² - 2d - 4) × l / 16` |
| **International** | Polynomial: `0.04976191·l·d² + 0.006220239·l²·d - 0.1854762·l·d + 0.0002591767·l³ - 0.01159226·l² + 0.04222222·l` |
| **ROY** | `(d - 1)² × 0.5 × l / 10` |

### Cut List Measurement System

Measurements are stored internally in **32nds of an inch** for precision:
- `kerf` values correspond directly to 32nds (kerf=2 → 1/16")
- `thickness` values are stored in **8ths of an inch** (×4 converts to 32nds: thickness=8 → 1", so `thickness * 4` = 32 thirty-seconds = 32nds)
- `flitch` values are stored in **half-inches** (×16 converts to 32nds)
- `total` is in whole inches (×32 converts to 32nds)

### Blade Side of Cut (`sideOfBlade` setting)

Controls whether the kerf is added before (`top`) or after (`bottom`) each board measurement. This determines whether cut marks fall on the top or bottom face of the board in the log.

## US/Metric Page Pairs

Every calculator has a US (imperial) version and a metric version:

| US | Metric |
|----|--------|
| `CutListPage.vue` | `CutListMetricPage.vue` |
| `BoardFeetPage.vue` | `BoardFeetMetricPage.vue` |
| `VolumePage.vue` | `VolumeMetricPage.vue` |

**When adding a feature or fixing a bug in one page, apply the same change to its pair.** The metric pages use mm/cm/m³ instead of inches/feet/board-feet, but follow the same component structure and state patterns.

## Calculator Page Architecture

All calculator pages follow the same pattern:

1. **State** — `ref()` values for each input, restored from `localStorage`
2. **Watchers** — `watch()` calls to persist state back to `localStorage`
3. **Update functions** — validate and clamp raw input before assigning to a `ref`
4. **Computed results** — one `computed()` per output value
5. **Item list** — `ref<ItemData[]>` for the accumulator list, deep-watched to localStorage
6. **Grand totals** — `computed()` values using `Array.reduce()` over the item list
7. **`addItem()`** — pushes current computed values to the list, fires an analytics event
8. **`deleteItem(index)`** — splices the list at the given index
9. **`clearItems()`** — confirms with the user, then resets the list to `[]`
10. **`onSendEmail()`** — builds an HTML table string, calls `sendEmail()`, fires an analytics event

### `clamp()` Helper

Every calculator page defines a local `clamp()` that guards range inputs from invalid values:

```typescript
function clamp(value: number, min: number, max: number): number {
  if (isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}
```

Update handler pattern for `<ion-range>` / `<ion-input>` pairs:
```typescript
function updateDiameter(v: any) {
  diameter.value = clamp(Number(v), 1, 40)
}
```

### Price Input Pattern (edit/display toggle)

When a field displays a formatted value but must accept raw numeric entry, use a focus/blur toggle:

```typescript
const priceEditing = ref(false)
const priceEditValue = ref('')

function onPriceFocus() {
  priceEditing.value = true
  priceEditValue.value = String(pricePer1000.value)
}
function onPriceBlur() {
  priceEditing.value = false
  pricePer1000.value = Number(priceEditValue.value) || 0
}
function updatePricePer1000Raw(v: any) {
  priceEditValue.value = String(v)
  pricePer1000.value = Number(v) || 0
}
```

Template binding:
```html
<ion-input
  :value="priceEditing ? priceEditValue : formatMoney(pricePer1000)"
  @ionFocus="onPriceFocus"
  @ionBlur="onPriceBlur"
  @ionInput="updatePricePer1000Raw($event.detail.value)"
/>
```

## localStorage Key Naming Conventions

Keys are strings — use these conventions to stay consistent with existing data:

- **Global settings** (`src/stores/settings.ts`): camelCase — `sideOfBlade`, `maxQuantity`, `moneySymbol`, `moneySymbolLocation`
- **CutList page** (no prefix): `Kerf`, `Thickness`, `Total`, `Flitch`
- **Board Feet page** (`Bf` prefix for scalars, no prefix for the items array): `BfWidth`, `BfThickness`, `BfLength`, `BfQuantity`, `BfPricePer1000`, `BfWoodType`, `LumberItems`
- **Volume page** (`Volume` prefix): `VolumeLength`, `VolumeDiameter`, `VolumeQuantity`, `VolumeItems`
- **Metric variants** add a `Metric` prefix to the page-specific prefix to distinguish their keys from US keys (e.g., `BfMetricWidth`, `VolumeMetricDiameter`).

When adding new state to an existing page, follow its existing prefix scheme. Object/array state is stored as JSON: `JSON.stringify` / `JSON.parse`.

## jsPDF Usage

jsPDF is loaded as a global `<script>` tag — do **not** import it with `import jsPDF from 'jspdf'`. Access it as:

```typescript
var doc = new jsPDF('p', 'pt', 'letter')  // portrait, points, letter-size
doc.fromHTML(htmlString, 15, 15)           // render HTML table at x=15, y=15
var base64 = doc.output('datauristring')   // for email attachment
doc.save('filename.pdf')                   // triggers browser download
```

The `doc.fromHTML()` method accepts the HTML table strings built with `pdfStyles`. Always prepend `pdfStyles` to the HTML before calling `sendEmail()`.

## ⚠️ REQUIRED: Version Patch on Every PR

**Every PR must include a version patch bump.** Before finalizing any PR, run the full version bump workflow:

1. `npm run version:patch` — bump the patch version
2. Update `package-lock.json` — manually change the `"version"` field at the top to match `package.json`
3. Restore leading zeros in `ios/App/App.xcodeproj/project.pbxproj` if capver strips them (`LastSwiftUpdateCheck = 0920`, `LastUpgradeCheck = 0920`)
4. `npm run version:get` — verify all platforms show the same version
5. Commit all version-related changed files

This is required because the App Store (iOS) and Google Play (Android) reject duplicate version numbers. Every push that triggers a Capawesome Cloud build must have a unique version.

## Documentation

- `README.md` — Project overview, getting started, and project structure
- `docs.md` — Full development and build guide (local testing, native builds, version management, Capawesome Cloud setup, iOS signing)
- `framework-recommendations.md` — Historical evaluation of framework migration from KnockoutJS/jQuery Mobile to Vue/Ionic
- `docs/android-play-signing-capawesome-guide.md` — Detailed Android AAB signing and Google Play submission guide
