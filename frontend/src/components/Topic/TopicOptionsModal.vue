<template>
  <Teleport to="body">
    <Transition name="options">
      <div class="overlay" @click.self="close">
        <div class="modal">
          <h3 class="title">Opcje tematu</h3>

          <ul class="options">
            <li
              v-if="canEdit"
              @click="openEdit"
            >
              ✏ Edytuj temat
            </li>

            <li
              v-if="canManageModerators"
              @click="noop"
            >
              👥 Moderatorzy
            </li>

            <li
              v-if="canManageBlocked"
              @click="noop"
            >
              🚫 Zablokowani
            </li>
          </ul>

          <button class="close-btn" @click="emit('close')">
            Zamknij
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>

  <TopicEditModal
    v-if="showEdit"
    :topic="topic"
    @close="showEdit = false"
    @saved="handleUpdated"
  />

</template>

<script setup>
import { ref } from "vue";
import TopicEditModal from "@/components/Topic/TopicEditModal.vue";

const props = defineProps({
  topic: {
    type: Object,
    required: true,
  },
  canEdit: Boolean,
  canManageModerators: Boolean,
  canManageBlocked: Boolean,
});

const emit = defineEmits(["close", "updated"]);

const showEdit = ref(false);

const openEdit = () => {
  showEdit.value = true;
};

const handleUpdated = () => {
  showEdit.value = false;
  emit("updated");
};
</script>

<style scoped>
/* ===== OVERLAY ===== */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 18, 28, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

/* ===== MODAL ===== */
.modal {
  width: min(380px, 92%);
  background: var(--bg-secondary);
  border-radius: 18px;
  padding: 20px;
  box-shadow: var(--shadow-strong);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ===== TITLE ===== */
.title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* ===== OPTIONS ===== */
.options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.options li {
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease, transform 0.15s ease;
}

.options li:hover {
  background: rgba(80, 200, 160, 0.15);
  transform: translateX(4px);
}

.close-btn {
  margin-top: 8px;
  align-self: flex-end;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 13px;
}

.close-btn:hover {
  color: var(--accent);
}

.options-enter-active,
.options-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.options-enter-from,
.options-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(12px);
}

@media (max-width: 480px) {
  .modal {
    padding: 16px;
  }

  .options li {
    font-size: 13px;
  }
}
</style>
