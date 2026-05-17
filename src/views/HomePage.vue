<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sawmill Calculator Pro</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list inset>
        <ion-list-header>
          <ion-label>Tools</ion-label>
        </ion-list-header>
        <ion-item button router-link="/cutlist">
          <ion-label>Cut List (US)</ion-label>
        </ion-item>
        <ion-item button router-link="/cutlist-metric">
          <ion-label>Cut List (Metric)</ion-label>
        </ion-item>
        <ion-item button router-link="/boardfeet">
          <ion-label>Board Feet (US)</ion-label>
        </ion-item>
        <ion-item button router-link="/boardfeet-metric">
          <ion-label>Board Feet (Metric)</ion-label>
        </ion-item>
        <ion-item button router-link="/volume">
          <ion-label>Log Volume (US)</ion-label>
        </ion-item>
        <ion-item button router-link="/volume-metric">
          <ion-label>Log Volume (Metric)</ion-label>
        </ion-item>
      </ion-list>

      <ion-list inset>
        <ion-list-header>
          <ion-label>Options</ion-label>
        </ion-list-header>
        <ion-item button router-link="/settings">
          <ion-label>Settings</ion-label>
        </ion-item>
        <ion-item button router-link="/about">
          <ion-label>About</ion-label>
        </ion-item>
        <ion-item button router-link="/privacy">
          <ion-label>Privacy Policy</ion-label>
        </ion-item>
      </ion-list>

      <ion-list inset>
        <ion-item button @click="requestReview()">
          <ion-icon :icon="starOutline" slot="end"></ion-icon>
          <ion-label>Write a Review</ion-label>
        </ion-item>
      </ion-list>

      <div class="ion-text-center ion-padding">
        <ion-text color="medium">
          <small>&copy; 2026 MicaPeak Solutions</small>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
} from "@ionic/vue";
import { starOutline } from "ionicons/icons";
import { requestReview } from "../utils/review";
</script>

<style scoped>
ion-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: var(--ion-color-primary);
}

ion-item ion-label {
  font-size: 1.15rem;
}

ion-list-header ion-label {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--ion-color-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
