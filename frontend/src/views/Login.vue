<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h1>Logowanie</h1>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <input
            v-model="loginValue"
            placeholder="Email"
            type="email"
            required
          />
        </div>

        <div class="field">
          <input
            v-model="password"
            type="password"
            placeholder="Hasło"
            required
          />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button class="btn auth-btn" type="submit">
          Zaloguj się
        </button>
      </form>

      <p class="switch">
        Nie masz konta?
        <RouterLink to="/register">Zarejestruj się</RouterLink>
      </p>
    </div>
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
    error.value = "Podaj poprawny adres email";
    return;
  }

  if (password.value.length < 6) {
    error.value = "Hasło musi mieć minimum 6 znaków";
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
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 32px;
  background: var(--bg-secondary);
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
  animation: enter 0.6s ease;
}

h1 {
  margin-bottom: 24px;
  text-align: center;
}

.field {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid var(--border-soft);
  color: var(--text-main);
  transition: border 0.2s, box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(31, 122, 95, 0.25);
}

.auth-btn {
  width: 100%;
  margin-top: 8px;
}

.error {
  background: rgba(139, 47, 47, 0.15);
  border: 1px solid var(--danger);
  color: #ffb3b3;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.switch {
  margin-top: 20px;
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
</style>
