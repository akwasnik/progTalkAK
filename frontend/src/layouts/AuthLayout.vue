<template>
  <div>
    <header class="navbar">
      <div class="navbar-left">
        <ProfileButton :isAllowed="auth.user.isAllowed" />
        <AdminDashboardButton :isAdmin="auth.user.isAdmin" />
      </div>

      <div class="navbar-right">
        <AdminNotificationsButton :isAdmin="auth.user.isAdmin" />
        <LogoutButton />
      </div>
    </header>

    <main class="page">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onBeforeMount, onUnmounted } from "vue";
import { auth } from "@/store/auth";
import { initSocket, disconnectSocket } from "@/services/socket";

import ProfileButton from "@/components/ProfileButton.vue";
import AdminDashboardButton from "@/components/AdminDashboardButton.vue";
import LogoutButton from "@/components/LogoutButton.vue";
import AdminNotificationsButton from "../components/AdminNotificationsButton.vue";

onBeforeMount(() => {
  initSocket(auth.user.isAdmin);
});

onUnmounted(() => {
  disconnectSocket();
});
</script>

<style scoped>
/* =========================
   NAVBAR
========================= */

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px 24px;
  background: linear-gradient(
    180deg,
    var(--bg-secondary),
    rgba(28, 37, 65, 0.95)
  );

  border-bottom: 1px solid var(--border-soft);
  box-shadow: var(--shadow-soft);

  animation: slideDown 0.5s ease;
}

/* LEFT / RIGHT GROUPS */

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* MAIN CONTENT */

.page {
  padding: 24px;
}

/* =========================
   ANIMATIONS
========================= */

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .navbar-left,
  .navbar-right {
    justify-content: center;
    flex-wrap: wrap;
  }

  .page {
    padding: 16px;
  }
}
</style>
