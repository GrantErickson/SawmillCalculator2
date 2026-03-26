import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/cutlist',
    component: () => import('../views/CutListPage.vue')
  },
  {
    path: '/cutlist-metric',
    component: () => import('../views/CutListMetricPage.vue')
  },
  {
    path: '/boardfeet',
    component: () => import('../views/BoardFeetPage.vue')
  },
  {
    path: '/boardfeet-metric',
    component: () => import('../views/BoardFeetMetricPage.vue')
  },
  {
    path: '/volume',
    component: () => import('../views/VolumePage.vue')
  },
  {
    path: '/volume-metric',
    component: () => import('../views/VolumeMetricPage.vue')
  },
  {
    path: '/settings',
    component: () => import('../views/SettingsPage.vue')
  },
  {
    path: '/about',
    component: () => import('../views/AboutPage.vue')
  },
  {
    path: '/privacy',
    component: () => import('../views/PrivacyPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
