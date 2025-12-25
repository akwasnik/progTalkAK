import { createRouter, createWebHistory } from "vue-router";

import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import NotAllowed from "@/views/NotAllowed.vue";
import Register from "@/views/Register.vue";

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

  if (!auth.user && !isPublic) {
    return "/login";
  }

  if (auth.user && !auth.user.isAllowed && to.path !== "/not-allowed") {
    return "/not-allowed";
  }

  if (auth.user && auth.user.isAllowed && isPublic) {
    return "/home";
  }
});

export default router;
