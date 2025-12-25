<template>
  <div>
    <h2>Admin Dashboard</h2>

    <div style="margin-bottom: 16px;">
      <button @click="loadAll">ALL</button>
      <button @click="loadAdmins">ADMINS</button>
      <button @click="loadNotAllowed">NOT ALLOWED</button>
    </div>

    <ul v-if="users.length">
      <li v-for="u in users" :key="u._id" style="margin-bottom: 8px;">
        <strong>{{ u.login }}</strong>

        <button
          @click="toggleAdmin(u)"
          :style="{ color: u.isAdmin ? 'green' : 'red', marginLeft: '10px' }"
          :disabled="!u.isAllowed"
        >
          ADMIN
        </button>

        <button
          @click="toggleAllowed(u)"
          :style="{ color: u.isAllowed ? 'green' : 'red', marginLeft: '5px' }"
        >
          ALLOWED
        </button>
      </li>
    </ul>

    <p v-else-if="infoMessage">{{ infoMessage }}</p>
    <p v-else>Brak użytkowników</p>
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
  currentLoader.value = fetchAllUsers;
  await reload();
};

const loadAdmins = async () => {
  currentLoader.value = fetchAdmins;
  await reload();
};

const loadNotAllowed = async () => {
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
