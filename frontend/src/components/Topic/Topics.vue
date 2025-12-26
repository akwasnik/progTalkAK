<template>
  <div class="topics">
    <h2 class="title">Tematy</h2>

    <transition-group
      name="topic"
      tag="ul"
      class="topics-list"
    >
      <li
        v-for="t in visibleTopics"
        :key="t._id"
        class="topic-item"
        :class="{
          hidden: t.isHidden,
          closed: t.isClosed
        }"
        @click="openTopic(t)"
      >
        <div class="topic-header">
          <div class="left">
            <span class="icon">💬</span>
            <strong class="topic-name">{{ t.name }}</strong>

            <span
              v-if="t.isClosed"
              class="badge closed-badge"
            >
              🔒 CLOSED
            </span>

            <span
              v-if="t.isHidden"
              class="badge hidden-badge"
            >
              🙈 HIDDEN
            </span>
          </div>

          <!-- ADMIN ACTIONS -->
          <div
            v-if="isAdmin"
            class="actions"
            @click.stop
          >
            <button
              class="action-btn"
              @click="toggleHidden(t)"
            >
              {{ t.isHidden ? "👁 Show" : "🙈 Hide" }}
            </button>

            <button
              class="action-btn"
              @click="toggleClosed(t)"
            >
              {{ t.isClosed ? "🔓 Open" : "🔒 Close" }}
            </button>
          </div>
        </div>

        <p class="author">
          Autor: <strong>{{ t.createdBy }}</strong>
        </p>

        <p
          v-if="t.description"
          class="desc"
        >
          {{ t.description }}
        </p>

        <div class="open-hint">
          Kliknij, aby otworzyć
        </div>
      </li>
    </transition-group>

    <p v-if="!visibleTopics.length" class="empty">
      Brak dostępnych tematów
    </p>

    <!-- MODAL -->
    <TopicModal
      v-if="activeTopic"
      :topic="activeTopic"
      :login="login"
      :isAdmin="isAdmin"
      @close="activeTopic = null"
      @refresh="reloadTopics"
      @open-parent="openParent"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";
import TopicModal from "@/components/Topic/TopicModal.vue";

const props = defineProps({
  login: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  }
});

const topics = ref([]);
const activeTopic = ref(null);


const loadTopics = async () => {
  const res = await api.get("/topics");
  topics.value = res.data;
};

const reloadTopics = async () => {
  await loadTopics();
};

const visibleTopics = computed(() =>
  props.isAdmin
    ? topics.value
    : topics.value.filter(t => !t.isHidden)
);


const openTopic = (topic) => {
  activeTopic.value = topic;
};

const openParent = async (parentId) => {
  const res = await api.get(`/topics/${parentId}`);
  activeTopic.value = res.data;
};


const toggleHidden = async (topic) => {
  await api.patch(`/topics/${topic._id}/hidden`, {
    isHidden: !topic.isHidden
  });
  await reloadTopics();
};

const toggleClosed = async (topic) => {
  await api.patch(`/topics/${topic._id}/closed`, {
    isClosed: !topic.isClosed
  });
  await reloadTopics();
};

onMounted(loadTopics);
</script>

<style scoped>

.topics {
  margin-top: 2rem;
  width: min(900px, 100%);
  margin-inline: auto;
}

.title {
  margin-bottom: 1.2rem;
  color: #e6fff5;
  font-size: 1.5rem;
  letter-spacing: 0.3px;
}


.topics-list {
  list-style: none;
  padding: 0;
}


.topic-item {
  background: linear-gradient(
    135deg,
    rgba(10, 45, 35, 0.85),
    rgba(5, 30, 25, 0.85)
  );
  border: 1px solid rgba(60, 160, 130, 0.25);
  border-radius: 14px;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  transition: all 0.25s ease;
  cursor: pointer;
  position: relative;
}

.topic-item::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px rgba(80, 200, 160, 0);
  transition: box-shadow 0.25s ease;
}

.topic-item:hover::after {
  box-shadow: inset 0 0 0 1px rgba(80, 200, 160, 0.35);
}

.topic-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.35);
}

.topic-item.closed {
  opacity: 0.85;
}

.topic-item.hidden {
  border-style: dashed;
}


.topic-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.icon {
  font-size: 1.25rem;
}

.topic-name {
  color: #d9fff1;
  font-size: 1.05rem;
}


.badge {
  font-size: 0.75rem;
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  font-weight: 600;
}

.closed-badge {
  background: rgba(255, 180, 80, 0.2);
  color: #ffcc80;
}

.hidden-badge {
  background: rgba(255, 120, 120, 0.2);
  color: #ff9b9b;
}


.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: transparent;
  border: 1px solid rgba(80, 200, 160, 0.5);
  color: #bfffe6;
  padding: 0.3rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.action-btn:hover {
  background: rgba(80, 200, 160, 0.15);
}


.author {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #9fdac5;
}

.desc {
  margin-top: 0.4rem;
  color: #b5e6d5;
}

.open-hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.6;
  text-align: right;
}


.empty {
  margin-top: 1.5rem;
  text-align: center;
  color: #8fcfba;
  opacity: 0.8;
}


.topic-enter-active,
.topic-leave-active {
  transition: all 0.35s ease;
}

.topic-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.topic-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
