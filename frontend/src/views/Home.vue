<template>
  <div>
    <h1>Home</h1>
    <p>Witaj {{ auth.user.login }}</p>
  </div>
</template>

<script setup>
import { auth } from "@/store/auth";
</script>
