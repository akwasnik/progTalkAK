<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-header">
        <h2>🔔 Powiadomienia</h2>
        <button class="icon-button" @click="$emit('close')">✖️</button>
      </header>

      <div class="modal-content">
        <p v-if="!notifications.length" class="empty">
          Brak powiadomień
        </p>

        <ul v-else>
          <li v-for="n in notifications" :key="n.id">
            {{ n.message }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  notifications: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;

  background: rgba(5, 10, 25, 0.85);
  backdrop-filter: blur(4px);

  display: flex;
  align-items: center;
  justify-content: center;

  animation: fadeIn 0.3s ease;
}

.modal {
  width: min(600px, 90vw);
  max-height: 80vh;

  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: var(--shadow-strong);

  display: flex;
  flex-direction: column;

  animation: slideUp 0.35s ease;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-soft);

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-content {
  padding: 20px;
  overflow-y: auto;
}

.modal-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-content li {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-soft);
}

.empty {
  text-align: center;
  opacity: 0.7;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
