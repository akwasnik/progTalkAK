<template>
  <div class="wrap">
    <h1>Brak dostępu</h1>
    <p>Twoje konto nie ma jeszcze dostępu do serwisu.</p>

    <LogoutButton />
  </div>
</template>

<script setup>
  import LogoutButton from "@/components/LogoutButton.vue";
</script>

<style scoped>
.wrap {
  padding: 2rem;
}
</style>
