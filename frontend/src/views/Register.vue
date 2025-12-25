<template>
  <div class="register">
    <h1>Register</h1>

    <form @submit.prevent="handleRegister">
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

const handleRegister = async () => {
  try {
    await register(loginValue.value, password.value);
    router.push("/login");
  } catch (err) {
    console.error("Register failed", err);
  }
};
</script>

<style scoped>
.register {
  padding: 2rem;
}
</style>
