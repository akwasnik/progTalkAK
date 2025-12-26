<template>
  <div>
    <AddTopic @created="reloadTopics" />
    <Topics ref="topicsRef" :isAdmin="auth.user.isAdmin" :login="auth.user.login"/>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { auth } from "@/store/auth";

  import Topics from "@/components/Topics.vue";
  import AddTopic from "@/components/AddTopic.vue";

  const topicsRef = ref(null);

  const reloadTopics = async () => {
    try {
      await topicsRef.value.loadTopics();
    } catch (err) {
      console.error("Nie udało się przeładować topiców", err);
    }
  };
</script>
