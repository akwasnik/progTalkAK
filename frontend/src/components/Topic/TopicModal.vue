<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emit('close')">
      <div class="modal">
        <header class="modal-header">
          <h2>{{ topic.name }}</h2>
          <button class="close" @click="emit('close')">✖</button>
        </header>

        <section class="content">
          <p class="desc">{{ topic.description || "Brak opisu" }}</p>

          <div class="meta">
            <span>Autor: <strong>{{ topic.createdBy }}</strong></span>
            <span v-if="topic.isClosed" class="badge closed">Zamknięty</span>
            <span v-if="topic.isHidden" class="badge hidden">Ukryty</span>
          </div>

          <!-- PARENT -->
          <button
            v-if="topic.parent"
            class="link"
            @click="emit('open-parent', topic.parent)"
          >
            ⬆ Przejdź do tematu nadrzędnego
          </button>

          <!-- ACTIONS -->
          <div v-if="canManage" class="actions">
            <h4>Moderacja</h4>

            <input v-model="loginInput" placeholder="Login (email)" />

            <div class="action-buttons">
              <button @click="addModerator">➕ Moderator</button>
              <button @click="removeModerator">➖ Moderator</button>
              <button @click="blockUser">🚫 Zablokuj</button>
              <button @click="unblockUser">✅ Odblokuj</button>
            </div>

            <button class="subtopic" @click="createSubtopic">
              🌱 Utwórz subtopic
            </button>
          </div>

          <p v-if="error" class="error">{{ error }}</p>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import api from "@/services/api";

const props = defineProps({
  topic: Object,
  login: String,
  isAdmin: Boolean
});

const emit = defineEmits(["close", "refresh", "open-parent"]);

const loginInput = ref("");
const error = ref("");

const canManage = ref(false);

async function checkCanManage(){
  if(props.isAdmin) canManage.value = true;
}

onBeforeMount()

const action = async (fn) => {
  error.value = "";
  try {
    await fn();
    emit("refresh");
  } catch (err) {
    error.value = err;
  }
};

const addModerator = () =>
  action(() =>
    api.post(`/topics/${props.topic._id}/moderators`, {
      login: loginInput.value
    })
  );

const removeModerator = () =>
  action(() =>
    api.delete(`/topics/${props.topic._id}/moderators`, {
      data: { login: loginInput.value }
    })
  );

const blockUser = () =>
  action(() =>
    api.post(`/topics/${props.topic._id}/block`, {
      login: loginInput.value
    })
  );

const unblockUser = () =>
  action(() =>
    api.post(`/topics/${props.topic._id}/unblock`, {
      login: loginInput.value
    })
  );

const createSubtopic = () =>
  action(() =>
    api.post("/topics", {
      name: "Nowy subtopic",
      parent: props.topic._id
    })
  );
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 40, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  width: min(640px, 92%);
  background: var(--bg-secondary);
  border-radius: 14px;
  box-shadow: var(--shadow-strong);
  animation: scaleIn 0.25s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border-soft);
}

.content {
  padding: 16px;
}

.desc {
  opacity: 0.9;
  margin-bottom: 12px;
}

.meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.closed {
  background: #8b0000;
}

.hidden {
  background: #555;
}

.actions {
  margin-top: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0;
}

button {
  background: var(--accent);
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.link {
  background: none;
  color: var(--accent);
  padding: 0;
}

.close {
  background: none;
  font-size: 18px;
}

.error {
  color: #ff6b6b;
  margin-top: 8px;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
