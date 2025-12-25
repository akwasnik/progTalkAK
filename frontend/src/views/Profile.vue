<template>
  <div class="profile-wrapper">
    <div class="profile-card">
      <h2>Profil użytkownika</h2>

      <!-- USER INFO -->
      <div class="info">
        <p><span>Login:</span> {{ auth.user.login }}</p>

        <p>
          <span>Admin:</span>
          <span
            :class="auth.user.isAdmin ? 'status ok' : 'status no'"
          >
            {{ auth.user.isAdmin ? "TAK" : "NIE" }}
          </span>
        </p>

        <p>
          <span>Allowed:</span>
          <span
            :class="auth.user.isAllowed ? 'status ok' : 'status no'"
          >
            {{ auth.user.isAllowed ? "TAK" : "NIE" }}
          </span>
        </p>
      </div>

      <hr />

      <!-- UPDATE PASSWORD -->
      <h3>Zmień hasło</h3>

      <form @submit.prevent="handleUpdatePassword">
        <div class="field">
          <input
            v-model="password"
            type="password"
            placeholder="Nowe hasło"
            required
          />
        </div>

        <div class="field">
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Potwierdź hasło"
            required
          />
        </div>

        <p v-if="passwordError" class="error">
          {{ passwordError }}
        </p>

        <button class="btn auth-btn" type="submit">
          Zmień hasło
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/store/auth";
import { logout } from "@/services/auth";
import api from "@/services/api";

const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const passwordError = ref("");

const logoutAndRedirect = async () => {
  await logout();
  auth.clear();
  router.push("/login");
};

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
    const id = auth.user.id;
    await api.patch(`/users/${id}/password`, {
      password: password.value
    });

    await logoutAndRedirect();
  } catch (err) {
    passwordError.value =
      err?.response?.data?.message || "Błąd zmiany hasła";
  }
};
</script>

<style scoped>
.profile-wrapper {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-card {
  width: 100%;
  max-width: 480px;
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

.info p {
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
}

.info span:first-child {
  color: var(--text-muted);
}

.status {
  font-weight: 600;
}

.status.ok {
  color: var(--accent);
}

.status.no {
  color: #d16b6b;
}

hr {
  margin: 24px 0;
  border: none;
  border-top: 1px solid var(--border-soft);
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
