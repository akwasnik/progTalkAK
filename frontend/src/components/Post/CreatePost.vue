<template>
  <div class="create-post">
    <textarea
      v-model="content"
      class="post-input"
      placeholder="Napisz wiadomość..."
      rows="4"
    />

    <div class="references">
      <div class="ref-input">
        <input
          v-model="referenceInput"
          placeholder="Dodaj reference (postId)"
          @keydown.enter.prevent="addReference"
        />
        <button
          class="add-ref-btn"
          @click="addReference"
          :disabled="!referenceInput"
        >
          +
        </button>
      </div>

      <TransitionGroup name="ref-list" tag="div" class="ref-list">
        <div
          v-for="ref in references"
          :key="ref"
          class="ref-item"
        >
          <span class="ref-id">{{ ref }}</span>
          <button class="remove-ref" @click="removeReference(ref)">
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>

    <div class="actions">
      <button
        class="send-btn"
        :disabled="!content.trim()"
        @click="sendPost"
      >
        Wyślij
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createPost } from "@/services/posts";

const props = defineProps({
  topicId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["created"]);

const content = ref("");
const referenceInput = ref("");
const references = ref([]);

const addReference = () => {
  const id = referenceInput.value.trim();
  if (!id || references.value.includes(id)) return;

  references.value.push(id);
  referenceInput.value = "";
};

const removeReference = (id) => {
  references.value = references.value.filter(r => r !== id);
};

const sendPost = async () => {
  await createPost(
    props.topicId,
    content.value,
    [],
    references.value
  );

  content.value = "";
  references.value = [];
  referenceInput.value = "";

  emit("created");
};
</script>

<style scoped>
.create-post {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.post-input {
  width: 100%;
  resize: none;
  background: var(--bg-primary);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 12px 14px;
  color: var(--text-primary);
  font-size: 14px;
}

.references {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ref-input {
  display: flex;
  gap: 8px;
}

.ref-input input {
  color: white;
  flex: 1;
  background: var(--bg-primary);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
}

.add-ref-btn {
  width: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: rgba(80, 200, 160, 0.15);
  color: var(--accent);
  font-size: 18px;
}

.ref-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ref-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(80, 200, 160, 0.15);
  color: var(--accent);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.remove-ref {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.send-btn {
  padding: 8px 18px;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: #022;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  transform: translateY(-1px);
}

/* Animacje referencji */
.ref-list-enter-active,
.ref-list-leave-active {
  transition: all 0.2s ease;
}

.ref-list-enter-from,
.ref-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

</style>