<template>
  <div class="register">
    <h1>Register</h1>

    <form @submit.prevent="handleRegister">
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

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm password"
        required
      />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit">
        Zarejestruj się
      </button>
    </form>

    <p>
      Masz już konto?
      <RouterLink to="/login">Zaloguj się</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/services/auth";

const router = useRouter();

const loginValue = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");

const isEmail = (val) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

const handleRegister = async () => {
  error.value = "";

  if (!isEmail(loginValue.value)) {
    error.value = "Login musi być poprawnym adresem email";
    return;
  }

  if (password.value.length < 6) {
    error.value = "Hasło musi mieć co najmniej 6 znaków";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Hasła nie są takie same";
    return;
  }

  try {
    await register(loginValue.value, password.value);
    router.push("/login");
  } catch {
    error.value = "Rejestracja nie powiodła się";
  }
};
</script>

<style scoped>
.register {
  padding: 2rem;
}

.error {
  color: red;
  margin: 0.5rem 0;
}
</style>
