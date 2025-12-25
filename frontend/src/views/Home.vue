<template>
  <div class="home">
    <h1>Home</h1>

    <AdminDashboardButton :isAdmin="auth.user.isAdmin"/>
    <ProfileButton :isAllowed="auth.user.isAllowed" />
    <p>Zalogowany użytkownik</p>

    <LogoutButton />
  </div>
</template>

<script setup>
  import { auth } from "@/store/auth";
  import LogoutButton from "@/components/LogoutButton.vue";
  import AdminDashboardButton from "@/components/AdminDashboardButton.vue";
  import ProfileButton from "../components/ProfileButton.vue";
</script>

<style scoped>
.home {
  padding: 2rem;
}
</style>
