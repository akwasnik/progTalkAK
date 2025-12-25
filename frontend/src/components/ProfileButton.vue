<template>
  <button
    v-if="isAllowed"
    @click="goToProfile"
  >
    Profil
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  isAllowed: {
    type: Boolean,
    required: true
  }
});

const router = useRouter();

const goToProfile = () => {
  router.push("/profile");
};
</script>
