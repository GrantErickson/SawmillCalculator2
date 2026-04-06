import { createRouter, createWebHistory } from "@ionic/vue-router";
import type { RouteRecordRaw } from "vue-router";
import { logScreenView } from "../utils/analytics";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/HomePage.vue"),
    meta: { screenName: "Home" },
  },
  {
    path: "/cutlist",
    component: () => import("../views/CutListPage.vue"),
    meta: { screenName: "CutList_US" },
  },
  {
    path: "/cutlist-metric",
    component: () => import("../views/CutListMetricPage.vue"),
    meta: { screenName: "CutList_Metric" },
  },
  {
    path: "/boardfeet",
    component: () => import("../views/BoardFeetPage.vue"),
    meta: { screenName: "BoardFeet_US" },
  },
  {
    path: "/boardfeet-metric",
    component: () => import("../views/BoardFeetMetricPage.vue"),
    meta: { screenName: "BoardFeet_Metric" },
  },
  {
    path: "/volume",
    component: () => import("../views/VolumePage.vue"),
    meta: { screenName: "Volume_US" },
  },
  {
    path: "/volume-metric",
    component: () => import("../views/VolumeMetricPage.vue"),
    meta: { screenName: "Volume_Metric" },
  },
  {
    path: "/settings",
    component: () => import("../views/SettingsPage.vue"),
    meta: { screenName: "Settings" },
  },
  {
    path: "/about",
    component: () => import("../views/AboutPage.vue"),
    meta: { screenName: "About" },
  },
  {
    path: "/privacy",
    component: () => import("../views/PrivacyPage.vue"),
    meta: { screenName: "Privacy" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.afterEach((to) => {
  const screenName = to.meta?.screenName as string | undefined;
  if (screenName) {
    logScreenView(screenName);
  }
});

export default router;
