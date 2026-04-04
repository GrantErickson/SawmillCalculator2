import { InAppReview } from "@capacitor-community/in-app-review";
import { Capacitor } from "@capacitor/core";
import { alertController } from "@ionic/vue";

const REVIEW_PROMPTED_KEY = "reviewPrompted";
const SUPPORT_EMAIL = "support@micapeak.net";
const APP_STORE_ID = "1456498498";

export function hasBeenPrompted(): boolean {
  return localStorage.getItem(REVIEW_PROMPTED_KEY) === "true";
}

function markPrompted(): void {
  localStorage.setItem(REVIEW_PROMPTED_KEY, "true");
}

export async function requestReview(): Promise<void> {
  try {
    await InAppReview.requestReview();
  } catch {
    // Fallback: open the App Store / Play Store review page directly
    if (Capacitor.getPlatform() === "ios") {
      window.open(
        `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`,
        "_system",
      );
    } else if (Capacitor.getPlatform() === "android") {
      window.open(
        `market://details?id=net.micapeak.SawmillCalculatorPro`,
        "_system",
      );
    }
  }
}

export function openSupportEmail(): void {
  window.open(`mailto:${SUPPORT_EMAIL}`, "_system");
}

export async function showReviewPrompt(): Promise<void> {
  if (hasBeenPrompted()) return;

  const likeAlert = await alertController.create({
    header: "Enjoying the App?",
    message: "Are you enjoying Sawmill Calculator Pro?",
    buttons: [
      {
        text: "No",
        role: "cancel",
        handler: async () => {
          markPrompted();
          const feedbackAlert = await alertController.create({
            header: "We'd Love Your Feedback",
            message: "Would you like to send feedback to the developer?",
            buttons: [
              {
                text: "No",
                role: "cancel",
              },
              {
                text: "Yes",
                handler: async () => {
                  openSupportEmail();
                },
              },
            ],
          });
          await feedbackAlert.present();
        },
      },
      {
        text: "Yes",
        handler: async () => {
          markPrompted();
          const reviewAlert = await alertController.create({
            header: "Rate Us",
            message: "Would you like to rate us in the App Store?",
            buttons: [
              {
                text: "No",
                role: "cancel",
              },
              {
                text: "Yes",
                handler: async () => {
                  requestReview();
                },
              },
            ],
          });
          await reviewAlert.present();
        },
      },
    ],
  });

  await likeAlert.present();
}
