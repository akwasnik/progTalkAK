<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="overlay" @click.self="emit('close')">
        <div class="modal">
          <!-- HEADER -->
          <header class="header">
            <h3 class="title">Moderatorzy</h3>
            <button class="close-btn" @click="emit('close')">✕</button>
          </header>

          <!-- ADD MODERATOR -->
          <div class="add">
            <input
              v-model="login"
              placeholder="Login użytkownika"
              @keydown.enter="add"
            />
            <button
              class="primary"
              :disabled="loading || !login.trim()"
              @click="add"
            >
              Dodaj
            </button>
          </div>

          <!-- ERROR -->
          <p v-if="error" class="error">{{ error }}</p>

          <!-- LIST -->
          <ul class="list">
            <li
              v-for="m in moderators"
              :key="m"
              class="item"
            >
              <span>{{ m }}</span>

              <button
                v-if="m !== topic.createdBy && canEdit && topic.moderators.includes(m)"
                class="remove"
                @click="remove(m)"
              >
                Usuń
              </button>
            </li>
          </ul>

          <p v-if="!moderators.length && !loading" class="empty">
            Brak moderatorów
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getModerators,
  addModerator,
  removeModerator,
} from "@/services/topics";

const props = defineProps({
  topic: {
    type: Object,
    required: true,
  },
  canEdit: Boolean,
});

const emit = defineEmits(["close"]);

const moderators = ref([]);
const login = ref("");
const loading = ref(false);
const error = ref("");

const load = async () => {
  try {
    console.log(props.topic.moderators);
    loading.value = true;
    error.value = "";
    moderators.value = await getModerators(props.topic._id);
    console.log(moderators.value);
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      "Nie udało się pobrać moderatorów";
  } finally {
    loading.value = false;
  }
};

const add = async () => {
  try {
    loading.value = true;
    error.value = "";
    await addModerator(props.topic._id, login.value);
    login.value = "";
    await load();
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      "Nie udało się dodać moderatora";
  } finally {
    loading.value = false;
  }
};

const remove = async (loginToRemove) => {
  try {
    loading.value = true;
    error.value = "";
    await removeModerator(props.topic._id, loginToRemove);
    await load();
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      "Nie udało się usunąć moderatora";
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>

<style scoped>
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

.modal {
  width: min(420px, 94%);
  background: var(--bg-secondary);
  border-radius: 18px;
  box-shadow: var(--shadow-strong);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.add {
  display: flex;
  gap: 8px;
}

.add input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  background: var(--bg-primary);
  color: white;
}

.primary {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 10px;
  transition: background 0.2s;
}

.item:hover {
  background: rgba(80, 200, 160, 0.12);
}

.remove {
  background: none;
  border: none;
  color: #ff8b8b;
  cursor: pointer;
}

.error {
  color: #ff8b8b;
  font-size: 13px;
}

.empty {
  opacity: 0.6;
  font-size: 13px;
  text-align: center;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(12px);
}
</style>
