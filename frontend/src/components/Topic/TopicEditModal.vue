<template>
  <Teleport to="body">
    <Transition name="edit">
      <div class="overlay" @click.self="emit('close')">
        <div class="modal">

          <header class="header">
            <h3 class="title">Edytuj temat</h3>
            <button class="close-btn" @click="emit('close')">✕</button>
          </header>

          <div class="form">
            <label>
              Nazwa tematu
              <input
                v-model="name"
                type="text"
                placeholder="Nazwa tematu"
              />
            </label>

            <label>
              Opis
              <textarea
                v-model="description"
                rows="4"
                placeholder="Opis tematu"
              />
            </label>

            <p v-if="error" class="error">
              {{ error }}
            </p>
          </div>

          <!-- ACTIONS -->
          <div class="actions">
            <button @click="emit('close')">
              Anuluj
            </button>

            <button
              class="primary"
              :disabled="loading || !name.trim()"
              @click="save"
            >
              <span v-if="!loading">Zapisz</span>
              <span v-else>Zapisywanie…</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import { patchTopic } from "@/services/topics";

const props = defineProps({
  topic: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "saved"]);

const name = ref(props.topic.name);
const description = ref(props.topic.description || "");

const loading = ref(false);
const error = ref("");

const save = async () => {
  try {
    loading.value = true;
    error.value = "";
    await patchTopic(props.topic,name.value,description.value);

    emit("saved");
  } catch (e) {
    error.value =
      e.response.data ||
      "Nie udało się zapisać zmian";
  } finally {
    loading.value = false;
  }
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
  z-index: 1200;
}

/* ===== MODAL ===== */
.modal {
  width: min(480px, 94%);
  background: var(--bg-secondary);
  border-radius: 18px;
  box-shadow: var(--shadow-strong);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== HEADER ===== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-soft);
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-muted);
}

.close-btn:hover {
  color: var(--accent);
}

/* ===== FORM ===== */
.form {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: 6px;
}

input,
textarea {
  background: var(--bg-primary);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  padding: 10px;
  color: inherit;
  font-size: 14px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent);
}

/* ===== ERROR ===== */
.error {
  color: #ff8b8b;
  font-size: 13px;
}

/* ===== ACTIONS ===== */
.actions {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid var(--border-soft);
}

.actions button {
  background: none;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  color: inherit;
}

.actions button.primary {
  background: var(--accent);
  color: #fff;
}

.actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== ANIMATION ===== */
.edit-enter-active,
.edit-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.edit-enter-from,
.edit-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(12px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 480px) {
  .modal {
    border-radius: 14px;
  }

  .form,
  .actions {
    padding: 14px 16px;
  }
}
</style>
