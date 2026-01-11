<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="overlay" @click.self="$emit('close')">
        <div class="modal">
          <h3 class="title">Nowy podtemat</h3>

          <div class="form">
            <input
              v-model="name"
              placeholder="Nazwa podtematu"
              autofocus
            />

            <textarea
              v-model="description"
              placeholder="Opis (opcjonalnie)"
              rows="4"
            />
          </div>

          <div class="actions">
            <button @click="$emit('close')">
              Anuluj
            </button>

            <button
              class="primary"
              :disabled="!name.trim()"
              @click="create"
            >
              Utwórz
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import { postSubtopic } from "@/services/topics";

const props = defineProps({
  parentTopic: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "created"]);

const name = ref("");
const description = ref("");

const create = async () => {
  const topic = await postSubtopic(name.value,description.value,props.parentTopic._id);
  
  emit("created");

  name.value = "";
  description.value = "";
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
  width: min(420px, 92%);
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-strong);
}

.title {
  margin-bottom: 12px;
  font-size: 18px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input,
textarea {
  width: 100%;
  background: var(--bg-primary);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  padding: 8px;
  color: inherit;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
}

button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
}

button.primary {
  background: var(--accent);
  color: #fff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
