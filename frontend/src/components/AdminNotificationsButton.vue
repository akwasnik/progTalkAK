<template>
  <button
    v-if="isAdmin"
    class="icon-button notification-button"
    @click="openModal"
  >
    🔔
    <span v-if="notifications.length" class="badge">
      {{ notifications.length }}
    </span>
  </button>

  <AdminNotifications
    v-if="showModal"
    :notifications="notifications"
    @close="showModal = false"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { getSocket } from "@/services/socket";
import AdminNotifications from "./AdminNotifications.vue";

const props = defineProps({
  isAdmin: {
    type: Boolean,
    required: true
  }
});

const notifications = ref([]);
const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

onMounted(() => {
  if (!props.isAdmin) return;

  const socket = getSocket();
  if (!socket) return;

  socket.on("user-awaiting-approval", (payload) => {
    notifications.value.unshift({
      id: Date.now(),
      message: payload.message
    });
  });

  socket.on("user-approved", (payload) => {
    notifications.value.unshift({
      id: Date.now(),
      message: payload.message
    });
  });
});

onUnmounted(() => {
  const socket = getSocket();
  if (!socket) return;

  socket.off("user-awaiting-approval");
  socket.off("user-approved");
});
</script>

<style scoped>
.notification-button {
  position: relative;
  font-size: 20px;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;

  min-width: 18px;
  height: 18px;
  padding: 0 5px;

  border-radius: 999px;
  background: var(--danger);
  color: white;

  font-size: 11px;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: pop 0.3s ease;
}

@keyframes pop {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
