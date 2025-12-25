import { createRouter, createWebHistory } from "vue-router";

import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import NotAllowed from "@/views/NotAllowed.vue";
import Register from "@/views/Register.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";

import { auth } from "@/store/auth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/not-allowed",
    name: "notAllowed",
    component: NotAllowed
  },
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminDashboard
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

// guard
router.beforeEach(async (to) => {
  if (auth.loading) {
    await auth.init();
  }
  
  const isPublic = ["/login", "/register"].includes(to.path);

  // niezalogowany
  if (!auth.user) {
    if (isPublic) return true;
    return "/login";
  }
  
  // zalogowany, ale NIE allowed
  if (!auth.user.isAllowed) {
    if (to.path === "/not-allowed") return true;
    return "/not-allowed";
  }

  // zalogowany i allowed
  if (auth.user.isAllowed) {
    if (to.path === "/not-allowed") return "/";
    if (isPublic) return "/";
  }

  // dostep do dashboard tylko jezeli jestesmy adminem
  if (auth.user && !auth.user.isAdmin && to.path === "/admin") {
    return "/";
  }

  return true;
});

export default router;
