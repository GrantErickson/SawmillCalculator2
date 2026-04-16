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
let darkMediaQuery: MediaQueryList | null = null

function applyStatusBarStyle(prefersDark: boolean) {
  if (!Capacitor.isNativePlatform()) return
  try {
    StatusBar.show()
    // Style.Light = light-colored icons (for dark backgrounds)
    // Style.Dark = dark-colored icons (for light backgrounds)
    StatusBar.setStyle({ style: prefersDark ? Style.Light : Style.Dark })
    StatusBar.setBackgroundColor({ color: prefersDark ? '#000000' : '#ffffff' })
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
