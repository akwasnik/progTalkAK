<template>
  <div>
    <h2>Admin Dashboard</h2>

    <!-- FILTER BUTTONS -->
    <div style="margin-bottom: 16px;">
      <button @click="loadAll">ALL</button>
      <button @click="loadAdmins">ADMINS</button>
      <button @click="loadNotAllowed">NOT ALLOWED</button>
    </div>

    <!-- USERS LIST -->
    <ul v-if="users.length">
      <li v-for="u in users" :key="u._id" style="margin-bottom: 8px;">
        <strong>{{ u.login }}</strong>

        <!-- ADMIN -->
        <button
          @click="toggleAdmin(u)"
          :style="{ color: u.isAdmin ? 'green' : 'red', marginLeft: '10px' }"
        >
          ADMIN
        </button>

        <!-- ALLOWED -->
        <button
          @click="toggleAllowed(u)"
          :style="{ color: u.isAllowed ? 'green' : 'red', marginLeft: '5px' }"
        >
          ALLOWED
        </button>
      </li>
    </ul>

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
const currentLoader = ref(fetchAllUsers);

// loaders
const loadAll = async () => {
  currentLoader.value = fetchAllUsers;
  users.value = await fetchAllUsers();
};

const loadAdmins = async () => {
  currentLoader.value = fetchAdmins;
  users.value = await fetchAdmins();
};

const loadNotAllowed = async () => {
  currentLoader.value = fetchNotAllowed;
  users.value = await fetchNotAllowed();
};

// actions
const toggleAdmin = async (user) => {
  await setAdmin(user._id, !user.isAdmin);
  users.value = await currentLoader.value();
};

const toggleAllowed = async (user) => {
    console.log(user);
  await setAllowed(user._id, !user.isAllowed);
  users.value = await currentLoader.value();
};

onMounted(loadAll);
</script>
