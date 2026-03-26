<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Saw Calc Pro</ion-title>
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

      <div class="ion-text-center ion-padding">
        <ion-text color="medium">
          <small>&copy; 2019 MicaPeak Solutions</small>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonListHeader, IonItem, IonLabel, IonText
} from '@ionic/vue'
</script>
