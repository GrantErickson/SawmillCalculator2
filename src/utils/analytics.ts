import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { Capacitor } from "@capacitor/core";

/**
 * Log a screen view event.
 */
export async function logScreenView(screenName: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await FirebaseAnalytics.setCurrentScreen({ screenName });
    } catch {
      // Ignore analytics errors — should never block the app
    }
  }
}

/**
 * Log a custom event with optional params.
 */
export async function logEvent(
  name: string,
  params?: Record<string, unknown>,
): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await FirebaseAnalytics.logEvent({ name, params });
    } catch {
      // Ignore analytics errors
    }
  }
}
