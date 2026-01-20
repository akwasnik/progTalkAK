<template>
  <div class="tag-list">
    <ul v-if="tags.length">
      <li
        v-for="tag in tags"
        :key="tag._id"
        class="tag-row"
      >
        <span class="tag-name">
          #{{ tag.name }}
        </span>

        <button
          class="delete-btn"
          @click="remove(tag._id)"
        >
          ✕
        </button>
      </li>
    </ul>

    <p v-else class="empty">
      Brak tagów
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchTags, deleteTag } from "@/services/tags";

const tags = ref([]);

const load = async () => {
  tags.value = await fetchTags();
};

const remove = async (id) => {
  await deleteTag(id);
  await load();
};

onMounted(load);

defineExpose({ load });

</script>

<style scoped>
.tag-list {
  margin-top: 12px;
}

.tag-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-soft);
}

.tag-row:last-child {
  border-bottom: none;
}

.tag-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--accent);
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #d16b6b;
  transition: transform 0.15s, opacity 0.15s;
}

.delete-btn:hover {
  transform: scale(1.1);
  opacity: 0.85;
}

.empty {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
