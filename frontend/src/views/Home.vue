<template>
  <div class="home">
    <h1>Home</h1>

    <p>Zalogowany użytkownik</p>

    <button @click="handleLogout">
      Wyloguj się
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { logout } from "@/services/auth";
import { auth } from "@/store/auth";

const router = useRouter();

const handleLogout = async () => {
  try {
    await logout();
    router.push("/login");
    auth.clear();
  } catch (err) {
    console.error("Logout failed", err);
  }
};
</script>

<style scoped>
.home {
  padding: 2rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
