<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="overlay" @click.self="emit('close')">
        <div class="modal">
          <!-- HEADER -->
          <header class="header">
            <h3 class="title">Zablokowani użytkownicy</h3>
            <button class="close-btn" @click="emit('close')">✕</button>
          </header>

          <!-- BLOCK USER -->
          <div class="add">
            <input
              v-model="login"
              placeholder="Login użytkownika"
              @keydown.enter="block"
            />
            <button
              class="primary danger"
              :disabled="loading || !login.trim()"
              @click="block"
            >
              Zablokuj tutaj
            </button>
            <button
              class="primary danger"
              :disabled="loading || !login.trim()"
              @click="fullBlock"
            >
              Zablokuj Całkowicie
            </button>
          </div>

          <!-- ERROR -->
          <p v-if="error" class="error">{{ error }}</p>

          <!-- LIST -->
          <ul class="list">
            <li
              v-for="u in blocked"
              :key="u"
              class="item"
            >
              <span>{{ u }}</span>

              <button
                v-if="topic.blockedUsers.includes(u)"
                class="unblock"
                @click="unblock(u)"
              >
                Odblokuj tutaj
              </button>

              <button
                v-if="topic.blockedUsers.includes(u)"
                class="unblock"
                @click="fullUnblock(u)"
              >
                Odblokuj całkoiwice
              </button>
            </li>
          </ul>

          <p v-if="!blocked.length && !loading" class="empty">
            Brak zablokowanych użytkowników
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getBlocked,
  blockUser,
  fullBlockUser,
  unblockUser,
  fullUnblockUser,
} from "@/services/topics";

const props = defineProps({
  topic: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const blocked = ref([]);
const login = ref("");
const loading = ref(false);
const error = ref("");

const load = async () => {
  try {
    loading.value = true;
    error.value = "";
    blocked.value = await getBlocked(props.topic._id);
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      "Nie udało się pobrać zablokowanych użytkowników";
  } finally {
    loading.value = false;
  }
};

const block = async () => {
  try {
    loading.value = true;
    error.value = "";
    await blockUser(props.topic._id, login.value);
    login.value = "";
    await load();
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      "Nie udało się zablokować użytkownika";
  } finally {
    loading.value = false;
  }
};

const fullBlock = async () => {
  try {
    loading.value = true;
    error.value = "";
    await fullBlockUser(props.topic._id, login.value);
    login.value = "";
    await load();
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      "Nie udało się zablokować użytkownika";
  } finally {
    loading.value = false;
  }
};

const unblock = async (loginToUnblock) => {
  try {
    loading.value = true;
    error.value = "";
    console.log(props.topic);
    await unblockUser(props.topic._id, loginToUnblock);
    await load();
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      "Nie udało się odblokować użytkownika";
  } finally {
    loading.value = false;
  }
};

const fullUnblock = async (loginToUnblock) => {
  try {
    loading.value = true;
    error.value = "";
    console.log(props.topic);
    await fullUnblockUser(props.topic._id, loginToUnblock);
    await load();
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      "Nie udało się odblokować użytkownika";
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

.primary.danger {
  background: #c44;
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

.unblock {
  background: none;
  border: none;
  color: #8bffb0;
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
