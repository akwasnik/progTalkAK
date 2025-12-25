<template>
  <div>
    <header style="margin-bottom: 16px;">
      <ProfileButton :isAllowed="auth.user.isAllowed" />
      <AdminDashboardButton :isAdmin="auth.user.isAdmin" />
      <LogoutButton />
    </header>

    <router-view />
  </div>
</template>

<script setup>
    import { auth } from "@/store/auth";
    import ProfileButton from "@/components/ProfileButton.vue";
    import AdminDashboardButton from "@/components/AdminDashboardButton.vue";
    import LogoutButton from "@/components/LogoutButton.vue"
</script>
