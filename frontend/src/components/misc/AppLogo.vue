<template>
  <RouterLink to="/" class="logo">
    <img src="@/assets/ptlogo.svg" alt="ProgTalk logo" />
  </RouterLink>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.25s ease;
}

.logo:hover {
  transform: scale(1.04);
}

.logo img {
  height: 34px;
  filter: drop-shadow(0 0 6px rgba(47, 163, 127, 0.25));
}
</style>
