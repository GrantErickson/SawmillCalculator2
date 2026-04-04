<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { showReviewPrompt } from './utils/review'

const REVIEW_DELAY_MS = 5 * 60 * 1000 // 5 minutes

let reviewTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
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
