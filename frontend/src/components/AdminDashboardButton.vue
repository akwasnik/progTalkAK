<template>
  <button
    v-if="isAdmin"
    @click="goToAdmin"
  >
    Admin Dashboard
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  isAdmin: {
    type: Boolean,
    required: true
  }
});

const router = useRouter();

const goToAdmin = () => {
  router.push("/admin");
};
</script>
