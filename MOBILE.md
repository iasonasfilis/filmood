# FILMOOD. — Android & iPhone app (Capacitor)

This branch adds a **native Android/iOS shell** around the existing FILMOOD Next.js application. The desktop site remains unchanged and is still built with `npm run build` and hosted on Vercel.

## Architecture

- **Desktop:** Next.js 15, unchanged server/web deployment. `/` redirects to `/studio`.
- **Mobile:** Capacitor 7 bundles a **static Next.js export** inside the Android/iOS app. It does not point to a live Vercel website.
- **Native UI:** FILMOOD's phone-specific CSS, safe-area-aware header, five-tab bottom navigation, Android back button and in-app browser handling. Film Lab and DNA Fusion use segmented Mix/Matches views to avoid very long screens.
- **Film data:** the existing curated 23-film catalog and local recommendation logic are bundled. Poster/backdrop URLs, external links and Google Fonts still require an internet connection.
- **Local data:** watchlist, liked/watched movies, preferences and recent searches continue to use WebView localStorage. **Web and native app storage are separate**; there is no login or sync yet.
- **Credits:** all 23 `/studio/credits/[id]` pages are generated at build time.

## Prerequisites

- Node.js 20.17+ or Node.js 22 LTS, npm.
- Android: Android Studio, Android SDK, Java 21.
- iOS: **a Mac**, current Xcode, CocoaPods and (for a physical device or distribution) Apple signing.
- App IDs, store listings, privacy disclosures, screenshots, icon/splash assets and signing must be finalized before publication.

## Install dependencies

```bash
npm install
```

## Run the existing desktop website

```bash
npm run dev
npm run build
```

These commands do **not** enable Capacitor or change the desktop build.

## Build the native web assets

```bash
npm run mobile:build
```

This exports `out/` using `FILMOOD_NATIVE=1`. Do not deploy `out/` as the normal Vercel desktop build.

## Android (Windows, macOS or Linux)

```bash
npm run mobile:android
npm run mobile:open:android
```

The first command creates `android/` if missing, exports the app, and syncs Capacitor. On subsequent runs it syncs the existing project. In Android Studio choose an emulator/device and **Run**.

To build a local debug APK from the generated project:

```bash
cd android
./gradlew assembleDebug
```

On Windows use `gradlew.bat assembleDebug`. Output: `android/app/build/outputs/apk/debug/app-debug.apk`.

## iPhone (macOS required)

```bash
npm run mobile:ios
npm run mobile:open:ios
```

Choose an iPhone Simulator in Xcode and Run. A real iPhone requires signing with an Apple development team. An App Store release requires an Apple Developer Program membership and App Store Connect setup.

## Sync changes

After changing the web UI or data:

```bash
npm run mobile:sync
```

Then rebuild/run from Android Studio or Xcode.

## GitHub Actions

`.github/workflows/mobile-native.yml` runs an Android debug APK build and an unsigned iOS Simulator build. The APK is uploaded as a downloadable Actions artifact if the job succeeds. The iOS artifact is **not** a signed installable iPhone app.

Because the native folders are generated locally, the repository initially contains the Capacitor configuration and generation scripts rather than committed Xcode/Gradle projects. **Once generated and reviewed, commit `android/` and `ios/`** (excluding local build outputs) so future native customizations are version-controlled.

## Limitations before a public launch

1. The native projects have not yet been tested on physical Android and iPhone devices. Run both platform builds and test navigation, WebView storage, keyboard, safe areas and external links.
2. Replace the provisional `com.filmood.discovery` identifier with an identifier controlled by the publisher **before first store release**; changing it later is disruptive.
3. Create native launcher icons, splash screen, store screenshots and accessibility/device-size testing.
4. Film posters are third-party artwork. A prototype is **not automatically licensed**; verify TMDB and rights-holder terms before publication.
5. The existing app is still a prototype: 23-film catalog, illustrative DNA matching, no real AI backend, accounts or verified streaming availability.
6. Review the Privacy Policy, Terms and store data-safety/privacy declarations before distribution.

## Suggested first device QA

- Launch the app from its icon, switch between all five tabs and return via the Android hardware back button.
- Search for a movie with the on-screen keyboard; select it and view recommendations.
- Use Film Lab's **Your recipe / Director's cut** segmented tabs; verify that choosing a base film shows matches.
- Use DNA Fusion's **Combine films / Your matches** tabs and open a film detail sheet.
- Open **Cast & crew**, **JustWatch Greece** and **TMDB** links; verify internal routes stay in the app and external sites open in the native browser.
- Save/like a film, force-quit, reopen and verify that the local data persists.
- Test an iPhone with a notch and an Android device with gesture navigation.
