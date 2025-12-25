import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/store/auth";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import NotAllowed from "@/views/NotAllowed.vue";

import Home from "@/views/Home.vue";
import Profile from "@/views/Profile.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";

import AuthLayout from "@/layouts/AuthLayout.vue";

const routes = [
  // PUBLIC (NO LAYOUT)
  {
    path: "/login",
    component: Login
  },
  {
    path: "/register",
    component: Register
  },
  {
    path: "/not-allowed",
    component: NotAllowed
  },

  // AUTH LAYOUT
  {
    path: "/",
    component: AuthLayout,
    children: [
      {
        path: "",
        component: Home
      },
      {
        path: "profile",
        component: Profile
      },
      {
        path: "admin",
        component: AdminDashboard,
        meta: { adminOnly: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// GLOBAL GUARD
router.beforeEach(async (to) => {
  if (auth.loading) {
    await auth.init();
  }

  const isPublic = ["/login", "/register"].includes(to.path);

  if (!auth.user) {
    if (isPublic) return true;
    return "/login";
  }

  if (!auth.user.isAllowed) {
    if (to.path === "/not-allowed") return true;
    return "/not-allowed";
  }

  if (to.meta.adminOnly && !auth.user.isAdmin) {
    return "/";
  }

  if (auth.user && (isPublic || to.path === "/not-allowed")) {
    return "/";
  }

  return true;
});

export default router;
