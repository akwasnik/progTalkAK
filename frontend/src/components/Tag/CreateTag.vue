<template>
  <div class="create-tag">
    <input
      v-model="name"
      class="tag-input"
      placeholder="Nazwa taga"
      @keydown.enter="submit"
    />

    <button
      class="btn add-btn"
      :disabled="!name.trim()"
      @click="submit"
    >
      Dodaj
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createTag } from "@/services/tags";

const emit = defineEmits(["created"]);

const name = ref("");

const submit = async () => {
  if (!name.value.trim()) return;

  await createTag({ name: name.value });
  name.value = "";
  emit("created");
};
</script>

<style scoped>
.create-tag {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tag-input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
}

.tag-input::placeholder {
  color: var(--text-muted);
}

.add-btn {
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
}

.add-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
