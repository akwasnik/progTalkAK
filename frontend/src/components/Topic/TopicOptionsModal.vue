<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="overlay" @click.self="$emit('close')">
        <div class="modal">
          <h3 class="title">Opcje tematu</h3>

          <ul class="options">
            <li
              v-if="canEdit"
              @click="select('edit')"
            >
              Edytuj temat
            </li>

            <li
              v-if="canManageModerators"
              @click="select('moderators')"
            >
              Moderatorzy
            </li>

            <li
              v-if="canManageBlocked"
              @click="select('blocked')"
            >
              Zablokowani
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  canEdit: {
    type: Boolean,
    required: true,
  },
  canManageModerators: {
    type: Boolean,
    required: true,
  },
  canManageBlocked: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "action"]);

const select = (type) => {
  emit("action", type);
  emit("close");
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 40, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: min(360px, 92%);
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 18px;
  box-shadow: var(--shadow-strong);
}

.title {
  font-size: 17px;
  margin-bottom: 10px;
}

.options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.options li {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.options li:hover {
  background: rgba(80, 200, 160, 0.15);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(10px);
}
</style>
