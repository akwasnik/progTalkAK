<template>
  <div class="create-post">
    <textarea
      v-model="content"
      class="post-input"
      placeholder="Napisz wiadomość..."
      rows="4"
    />

    <div class="tags">
      <button
        class="tag-toggle"
        @click="showTags = !showTags"
      >
        🏷 Otaguj
      </button>

      <Transition name="fade">
        <div v-if="showTags" class="tag-picker">
          <button
            v-for="tag in tags"
            :key="tag._id"
            class="tag-item"
            :class="{ selected: selectedTags.includes(tag.name) }"
            @click="toggleTag(tag.name)"
          >
            {{ tag.name }}
          </button>
        </div>
      </Transition>

      <div v-if="selectedTags.length" class="selected-tags">
        <span
          v-for="tag in selectedTagObjects"
          :key="tag._id"
          class="tag-chip"
        >
          {{ tag.name }}
          <button @click="toggleTag(tag.name)">✕</button>
        </span>
      </div>
    </div>

    <div
      v-if="storedReferences.length"
      class="references"
    >
      <p class="ref-title">
        Referencje
      </p>

      <div class="ref-list">
        <div
          v-for="ref in storedReferences"
          :key="ref.id"
          class="ref-card"
        >
          <p class="ref-content">
            {{ ref.content }}
          </p>

          <button
            class="remove-ref"
            @click="removeReference(ref.id)"
          >
            ✕
          </button>
        </div>
      </div>
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
import { ref, computed, onMounted } from "vue";
import { createPost } from "@/services/posts";
import { fetchTags } from "@/services/tags";

const props = defineProps({
  topicId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["created"]);


const content = ref("");
const storedReferences = ref([]);

const REFERENCES_KEY = "postReferences";

const loadStoredReferences = () => {
  storedReferences.value = JSON.parse(
    localStorage.getItem(REFERENCES_KEY) || "[]"
  );
};

defineExpose({loadStoredReferences});

const removeReference = (id) => {
  storedReferences.value = storedReferences.value.filter(
    r => r.id !== id
  );

  localStorage.setItem(
    REFERENCES_KEY,
    JSON.stringify(storedReferences.value)
  );
};

const clearStoredReferences = () => {
  localStorage.removeItem(REFERENCES_KEY);
  storedReferences.value = [];
};

const tags = ref([]);
const selectedTags = ref([]);
const showTags = ref(false);

onMounted(async () => {
  tags.value = await fetchTags();
  loadStoredReferences();
});

const toggleTag = (name) => {
  selectedTags.value.includes(name)
    ? selectedTags.value = selectedTags.value.filter(t => t !== name)
    : selectedTags.value.push(name);
};

const selectedTagObjects = computed(() =>
  tags.value.filter(t => selectedTags.value.includes(t.name))
);

const sendPost = async () => {
  await createPost(
    props.topicId,
    content.value,
    selectedTags.value,
    storedReferences.value.map( ref => ref.id)
  );

  content.value = "";
  selectedTags.value = [];
  showTags.value = false;

  clearStoredReferences();

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
  color: white;
  background: var(--bg-primary);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
}

/* TAGI */

.tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-toggle {
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: 13px;
}

.tag-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 10px;
  max-height: 70px;
  overflow-y: auto;
}

.tag-item {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid var(--border-soft);
  background: transparent;
  cursor: pointer;
  color: var(--accent);
}

.tag-item.selected {
  background: var(--accent);
  color: #022;
  border-color: var(--accent);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  max-height: 80px;
  overflow-y: auto;
  padding-right: 4px;
}

.tag-chip {
  background: rgba(80, 200, 160, 0.15);
  color: var(--accent);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tag-chip button {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
}

/* REFERENCJE */

.references {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ref-title {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.7;
}

.ref-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 160px;
  overflow-y: auto;
  padding-right: 6px;
}

.ref-card {
  position: relative;
  background: var(--bg-primary);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 10px 36px 10px 12px;
  font-size: 13px;
  color: var(--text-primary);

}

.ref-content {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.remove-ref {
  position: absolute;
  top: 6px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #ff9b9b;
  font-size: 14px;
  opacity: 0.7;
}

.remove-ref:hover {
  opacity: 1;
}

/* SCROLLBAR */
.ref-list::-webkit-scrollbar {
  width: 8px;
}

.ref-list::-webkit-scrollbar-thumb {
  background: rgba(80, 200, 160, 0.35);
  border-radius: 999px;
}

.ref-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(80,200,160,0.45) transparent;
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
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ANIMACJE */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* ===== SCROLLBAR – textarea ===== */

.post-input::-webkit-scrollbar {
  width: 8px;
}

.post-input::-webkit-scrollbar-track {
  background: transparent;
}

.post-input::-webkit-scrollbar-thumb {
  background: rgba(80, 200, 160, 0.35);
  border-radius: 999px;
}

.post-input::-webkit-scrollbar-thumb:hover {
  background: rgba(80, 200, 160, 0.6);
}

/* Firefox */
.post-input {
  scrollbar-width: thin;
  scrollbar-color: rgba(80,200,160,0.45) transparent;
}

/* ===== SCROLLBAR – tag picker ===== */

.tag-picker::-webkit-scrollbar {
  width: 8px;
}

.tag-picker::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
}

.tag-picker::-webkit-scrollbar-thumb {
  background: rgba(80, 200, 160, 0.35);
  border-radius: 999px;
}

.tag-picker::-webkit-scrollbar-thumb:hover {
  background: rgba(80, 200, 160, 0.6);
}

/* Firefox */
.tag-picker {
  scrollbar-width: thin;
  scrollbar-color: rgba(80,200,160,0.45) rgba(255,255,255,0.05);
}

/* ===== SCROLLBAR – selected tags ===== */

.selected-tags::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.selected-tags::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
}

.selected-tags::-webkit-scrollbar-thumb {
  background: rgba(80, 200, 160, 0.35);
  border-radius: 999px;
}

.selected-tags::-webkit-scrollbar-thumb:hover {
  background: rgba(80, 200, 160, 0.6);
}


</style>
