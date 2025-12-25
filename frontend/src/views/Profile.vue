<template>
  <div>
    <h2>Profil użytkownika</h2>

    <p><strong>Login:</strong> {{ auth.user.login }}</p>
    <p><strong>Admin:</strong> {{ auth.user.isAdmin ? "TAK" : "NIE" }}</p>
    <p><strong>Allowed:</strong> {{ auth.user.isAllowed ? "TAK" : "NIE" }}</p>

    <hr />

    <!-- UPDATE PASSWORD -->
    <h3>Zmień hasło</h3>

    <form @submit.prevent="handleUpdatePassword">
      <input
        v-model="password"
        type="password"
        placeholder="Nowe hasło"
        required
      />

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Potwierdź hasło"
        required
      />

      <button type="submit">Zmień hasło</button>
    </form>

    <p v-if="passwordError" style="color: red;">
      {{ passwordError }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/store/auth";
import { logout } from "@/services/auth";
import api from "@/services/api";

const router = useRouter();

// state
const password = ref("");
const confirmPassword = ref("");
const passwordError = ref("");

// helpers
const logoutAndRedirect = async () => {
  await logout();
  auth.clear();
  router.push("/login");
};

// actions
const handleUpdatePassword = async () => {
  passwordError.value = "";

  if (password.value.length < 6) {
    passwordError.value = "Hasło musi mieć minimum 6 znaków";
    return;
  }

  if (password.value !== confirmPassword.value) {
    passwordError.value = "Hasła nie są takie same";
    return;
  }

  try {
    const id = await auth.user.id;
    await api.patch(`/users/${id}/password`, {
      password: password.value
    });
    await logoutAndRedirect();
  } catch (err) {
    console.log(err);
    passwordError.value =
      err.response.data.message || "Błąd zmiany hasła";
  }
};
</script>
