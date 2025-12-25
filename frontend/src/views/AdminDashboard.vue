<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-card">
      <h2>Admin Dashboard</h2>

      <!-- FILTERS -->
      <div class="filters">
        <button
          class="btn filter-btn"
          :class="{ active: current === 'all' }"
          @click="loadAll"
        >
          ALL
        </button>

        <button
          class="btn filter-btn"
          :class="{ active: current === 'admins' }"
          @click="loadAdmins"
        >
          ADMINS
        </button>

        <button
          class="btn filter-btn"
          :class="{ active: current === 'notAllowed' }"
          @click="loadNotAllowed"
        >
          NOT ALLOWED
        </button>
      </div>

      <!-- USERS LIST -->
      <ul v-if="users.length" class="user-list">
        <li v-for="u in users" :key="u._id" class="user-row">
          <span class="login">{{ u.login }}</span>

          <div class="actions">
            <!-- ADMIN -->
            <button
              class="status-btn"
              :class="u.isAdmin ? 'ok' : 'no'"
              :disabled="!u.isAllowed"
              @click="toggleAdmin(u)"
            >
              ADMIN
            </button>

            <!-- ALLOWED -->
            <button
              class="status-btn"
              :class="u.isAllowed ? 'ok' : 'no'"
              @click="toggleAllowed(u)"
            >
              ALLOWED
            </button>
          </div>
        </li>
      </ul>

      <!-- EMPTY / INFO -->
      <p v-else-if="infoMessage" class="info">
        {{ infoMessage }}
      </p>

      <p v-else class="info">
        Brak użytkowników
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  fetchAllUsers,
  fetchAdmins,
  fetchNotAllowed,
  setAdmin,
  setAllowed
} from "@/services/users";

const users = ref([]);
const infoMessage = ref("");
const currentLoader = ref(fetchAllUsers);
const current = ref("all");

const reload = async () => {
  infoMessage.value = "";

  try {
    users.value = await currentLoader.value();
  } catch (err) {
    if (
      currentLoader.value === fetchNotAllowed &&
      err?.response?.status === 404
    ) {
      users.value = [];
      infoMessage.value = "Brak użytkowników do zatwierdzenia";
      return;
    }
    throw err;
  }
};

// loaders
const loadAll = async () => {
  current.value = "all";
  currentLoader.value = fetchAllUsers;
  await reload();
};

const loadAdmins = async () => {
  current.value = "admins";
  currentLoader.value = fetchAdmins;
  await reload();
};

const loadNotAllowed = async () => {
  current.value = "notAllowed";
  currentLoader.value = fetchNotAllowed;
  await reload();
};

// actions
const toggleAdmin = async (user) => {
  if (!user.isAllowed) return;
  await setAdmin(user._id, !user.isAdmin);
  await reload();
};

const toggleAllowed = async (user) => {
  await setAllowed(user._id, !user.isAllowed);
  await reload();
};

onMounted(loadAll);
</script>

<style scoped>
.dashboard-wrapper {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 16px;
}

.dashboard-card {
  width: 100%;
  max-width: 900px;
  padding: 32px;
  background: var(--bg-secondary);
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
  animation: enter 0.6s ease;
}

h2 {
  text-align: center;
  margin-bottom: 24px;
}


.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  background: transparent;
  border: 1px solid var(--border-soft);
}

.filter-btn.active {
  background: var(--accent);
  border-color: var(--accent);
}


.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 12px;
  border-bottom: 1px solid var(--border-soft);
}

.user-row:last-child {
  border-bottom: none;
}

.login {
  font-weight: 500;
  word-break: break-all;
}


.actions {
  display: flex;
  gap: 8px;
}

.status-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.status-btn.ok {
  background: rgba(31, 122, 95, 0.2);
  color: var(--accent);
}

.status-btn.no {
  background: rgba(139, 47, 47, 0.2);
  color: #d16b6b;
}

.status-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.status-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}


.info {
  margin-top: 24px;
  text-align: center;
  color: var(--text-muted);
}


@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


@media (max-width: 600px) {
  .user-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .actions {
    align-self: flex-end;
  }
}
</style>
