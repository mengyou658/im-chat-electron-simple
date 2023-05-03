import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

import Home from "../views/Home/Home.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/main", name: "Main", component: () => import("../views/chatim/chatim.vue") }
];

const router = createRouter({
  history: createWebHashHistory('/chatim'),
  routes,
});

export default router;
