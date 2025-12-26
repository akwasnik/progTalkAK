<template>
  <div class="add-topic">
    <h3>Dodaj nowy temat</h3>

    <form @submit.prevent="handleSubmit">
      <div class="field">
        <input
          v-model="name"
          placeholder="Nazwa tematu"
          required
        />
      </div>

      <div class="field">
        <textarea
          v-model="description"
          placeholder="Opis (opcjonalnie)"
          rows="3"
        />
      </div>

      <p v-if="error" class="error">
        {{ error }}
      </p>

      <button type="submit">
        Dodaj temat
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/services/api";

const emit = defineEmits(["created"]);

const name = ref("");
const description = ref("");
const error = ref("");

const handleSubmit = async () => {
  error.value = "";

  if (!name.value.trim()) {
    error.value = "Nazwa tematu jest wymagana";
    return;
  }

  try {
    await api.post("/topics", {
      name: name.value,
      description: description.value
    });

    name.value = "";
    description.value = "";

    emit("created");
  } catch(err) {
    error.value = err;
  }
};
</script>

<style scoped>
.add-topic {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 14px;
  width: 600px;
  justify-self: center;

  background: linear-gradient(
    160deg,
    rgba(10, 30, 40, 0.9),
    rgba(10, 45, 35, 0.9)
  );

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(47, 163, 127, 0.15);

  animation: fadeInUp 0.5s ease-out;
}

h3 {
  margin-bottom: 1rem;
  font-weight: 600;
  color: #9fe3c3;
  letter-spacing: 0.5px;
}

.field {
  margin-bottom: 0.75rem;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem 0.9rem;

  background: rgba(5, 20, 25, 0.8);
  color: #e8fdf3;

  border-radius: 10px;
  border: 1px solid rgba(47, 163, 127, 0.25);

  outline: none;
  transition:
    border 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.15s ease;
}

input::placeholder,
textarea::placeholder {
  color: rgba(200, 255, 235, 0.45);
}

input:focus,
textarea:focus {
  border-color: #2fa37f;
  box-shadow: 0 0 0 3px rgba(47, 163, 127, 0.25);
  transform: translateY(-1px);
}

.error {
  margin: 0.5rem 0;
  color: #ff6b6b;
  font-size: 0.9rem;
  animation: shake 0.3s ease;
}

button {
  margin-top: 0.5rem;
  padding: 0.7rem 1.4rem;

  border-radius: 999px;
  border: none;

  background: linear-gradient(
    135deg,
    #2fa37f,
    #1d6b54
  );
  color: #0b1e1f;

  font-weight: 600;
  letter-spacing: 0.4px;
  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    filter 0.15s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(47, 163, 127, 0.35);
  filter: brightness(1.05);
}

button:active {
  transform: translateY(0);
  box-shadow: none;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  50% { transform: translateX(3px); }
  75% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}

@media (max-width: 600px) {
  .add-topic {
    max-width: 300px;
    padding: 1.2rem;
  }

  button {
    width: 100%;
  }
}
</style>
