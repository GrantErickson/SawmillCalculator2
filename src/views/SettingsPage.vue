<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list inset>
        <ion-list-header>
          <ion-label>Side of Blade to Measure for Cut List</ion-label>
        </ion-list-header>
        <ion-radio-group :value="sideOfBlade" @ionChange="sideOfBlade = $event.detail.value">
          <ion-item>
            <ion-radio value="bottom">Bottom or Right of Blade</ion-radio>
          </ion-item>
          <ion-item>
            <ion-radio value="top">Top or Left of Blade</ion-radio>
          </ion-item>
        </ion-radio-group>
      </ion-list>

      <ion-list inset>
        <ion-list-header>
          <ion-label>Board Feet Max Quantity</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-input
            type="number"
            :value="maxQuantity"
            @ionInput="maxQuantity = $event.detail.value || '100'"
          ></ion-input>
        </ion-item>
      </ion-list>

      <ion-list inset>
        <ion-list-header>
          <ion-label>Money Symbol</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-input
            :value="moneySymbol"
            @ionInput="moneySymbol = $event.detail.value || '$'"
          ></ion-input>
        </ion-item>
        <ion-radio-group :value="moneySymbolLocation" @ionChange="moneySymbolLocation = $event.detail.value">
          <ion-item>
            <ion-radio value="before">Before Number: {{ moneySymbol }}100</ion-radio>
          </ion-item>
          <ion-item>
            <ion-radio value="after">After Number: 100{{ moneySymbol }}</ion-radio>
          </ion-item>
        </ion-radio-group>
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
  IonButtons, IonBackButton, IonList, IonListHeader, IonItem, IonLabel,
  IonRadioGroup, IonRadio, IonInput, IonText
} from '@ionic/vue'
import { sideOfBlade, maxQuantity, moneySymbol, moneySymbolLocation } from '../stores/settings'
</script>
