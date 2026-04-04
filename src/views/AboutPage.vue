<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>About</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label class="ion-text-wrap">
            Version 3.0 is a complete rewrite using Vue 3, Ionic, Capacitor, and TypeScript for a modern,
            faster experience on both iOS and Android. All existing calculator features have been preserved.
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            Version 2.0 reworked for latest iOS. Sorry for the delay. A few new tweaks for the UI.
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            Version 1.6 adds metric cut lists and larger thicknesses.
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            Version 1.5 expands the thickness options for hardwoods TO 48/4 and the quantities for lumber and
            timber from 50 to 100.
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            Version 1.4 introduces board feet and cost grand totals at the bottom of the board feet page.
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            Version 1.3 introduces board feet measurements for hardwoods.
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            This application was developed to help saw mill users determine the cuts to make to get the
            desired board thickness automatically accounting for the kerf. A board feet calculator was
            also added with both softwood and hardwood thickness measurements. Happy sawing.
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            Users requested log volume calculations and lumber list creation which are available
            in this Pro version.
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            The log volume calculations for Doyle, Scribner, and International are approximations taken from the
            equations at https://www.extension.purdue.edu/extmedia/FNR/FNR-191.pdf. The ROY scale is directly from the
            formula.
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            If you find any issues with the application or have a feature request please email grant@micapeak.net.
          </ion-label>
        </ion-item>
      </ion-list>

      <div class="ion-text-center ion-padding">
        <ion-text color="medium">
          <small>&copy; 2019-2026 MicaPeak Solutions</small>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonText
} from '@ionic/vue'
</script>
