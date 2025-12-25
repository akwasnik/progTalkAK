<template>
  <div class="login">
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <input
        v-model="loginValue"
        placeholder="Email"
        type="email"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit">
        Zaloguj się
      </button>
    </form>

    <p class="register-link">
      Nie masz konta?
      <RouterLink to="/register">Zarejestruj się</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/auth";
import { auth } from "@/store/auth";

const router = useRouter();

const loginValue = ref("");
const password = ref("");
const error = ref("");

const isEmail = (val) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

const handleLogin = async () => {
  error.value = "";

  if (!isEmail(loginValue.value)) {
    error.value = "Login musi być poprawnym adresem email";
    return;
  }

  if (password.value.length < 6) {
    error.value = "Hasło musi mieć co najmniej 6 znaków";
    return;
  }

  try {
    await login(loginValue.value, password.value);
    await auth.init();
    router.push("/");
  } catch {
    error.value = "Nieprawidłowy login lub hasło";
  }
};
</script>

<style scoped>
.login {
  padding: 2rem;
}

.error {
  color: red;
  margin: 0.5rem 0;
}
</style>
