<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style, BackgroundColorOptions } from '@capacitor/status-bar'
import { showReviewPrompt } from './utils/review'

const REVIEW_DELAY_MS = 5 * 60 * 1000 // 5 minutes

let reviewTimer: ReturnType<typeof setTimeout> | null = null
let darkMediaQuery: MediaQueryList | null = null

async function applyStatusBarStyle(prefersDark: boolean) {
  if (!Capacitor.isNativePlatform()) return
  try {
    await StatusBar.show()
    await StatusBar.setStyle({ style: prefersDark ? Style.Light : Style.Dark })
    if (Capacitor.getPlatform() === 'android') {
      const color = prefersDark ? '#1c1c1c' : '#ffffff'
      await StatusBar.setBackgroundColor({ color } as BackgroundColorOptions)
    }
  } catch {
    // StatusBar plugin may not be available on all devices
  }
}

function onColorSchemeChange(e: MediaQueryListEvent) {
  applyStatusBarStyle(e.matches)
}

onMounted(() => {
  darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  applyStatusBarStyle(darkMediaQuery.matches)
  darkMediaQuery.addEventListener('change', onColorSchemeChange)

  reviewTimer = setTimeout(() => {
    showReviewPrompt()
  }, REVIEW_DELAY_MS)
})

onUnmounted(() => {
  if (reviewTimer !== null) {
    clearTimeout(reviewTimer)
  }
  if (darkMediaQuery) {
    darkMediaQuery.removeEventListener('change', onColorSchemeChange)
  }
})
</script>
