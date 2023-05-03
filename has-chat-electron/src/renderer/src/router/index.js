import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

import Home from "../views/Home/Home.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/main", name: "Main", component: () => import("../views/HasChat/HasChat.vue") }
];

const router = createRouter({
  history: createWebHistory('/haschat'),
  routes,
});

export default router;