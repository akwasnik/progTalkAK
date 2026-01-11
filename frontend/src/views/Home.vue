<template>
  <div>
    <AddTopic @created="reloadTopics" />
    <Topics ref="topicsRef" :isAdmin="auth.user.isAdmin" :login="auth.user.login"/>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { auth } from "@/store/auth";

  import Topics from "@/components/Topic/Topics.vue";
  import AddTopic from "@/components/Topic/AddTopic.vue";

  const topicsRef = ref(null);

  const reloadTopics = async (topic) => {
    try {
      await topicsRef.value.loadTopics();
      if(topic) topicsRef.value.openTopic(topic);
    } catch (err) {
      console.error("Nie udało się przeładować topiców", err);
    }
  };
</script>
