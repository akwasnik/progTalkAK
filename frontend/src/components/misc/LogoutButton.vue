<template>
  <button class="btn btn-danger" @click="handleLogout">
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
  margin-left: auto;
}

@media (max-width: 768px) {
  button {
    margin-left: 0;
  }
}
</style>