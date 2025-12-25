<template>
  <button @click="handleLogout">
    Wyloguj się
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";
import { logout } from "@/services/auth";
import { auth } from "@/store/auth";

const router = useRouter();

const handleLogout = async () => {
  try {
    console.log(auth.user);
    await logout();
  } finally {
    auth.clear();
    router.push("/login");
  }
};
</script>

<style scoped>
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
