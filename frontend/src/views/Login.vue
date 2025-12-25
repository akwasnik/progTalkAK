<template>
  <div class="login">
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <input
        v-model="loginValue"
        placeholder="Login"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />

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

const handleLogin = async () => {
  try {
    await login(loginValue.value, password.value);
    await auth.init();
    router.push("/");
  } catch (err) {
    console.error("Login failed", err);
  }
};
</script>

<style scoped>
.login {
  padding: 2rem;
}

.register-link {
  margin-top: 1rem;
}
</style>
