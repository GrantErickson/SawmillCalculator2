<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { showReviewPrompt } from './utils/review'

const REVIEW_DELAY_MS = 5 * 60 * 1000 // 5 minutes

let reviewTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (Capacitor.isNativePlatform()) {
    StatusBar.show()
    StatusBar.setStyle({ style: Style.Dark })
  }

  reviewTimer = setTimeout(() => {
    showReviewPrompt()
  }, REVIEW_DELAY_MS)
})

onUnmounted(() => {
  if (reviewTimer !== null) {
    clearTimeout(reviewTimer)
  }
})
</script>
