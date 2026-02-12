<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="overlay">
        <div class="modal">
          <!-- HEADER -->
          <header class="header">
            <div class="title-section">
              <button
                v-if="topic.parent"
                class="parent-btn"
                @click.stop="emit('open-parent', topic.parent)"
              >
                ⬆ Nadtemat
              </button>
              <h2 class="title">{{ topic.name }}</h2>
              <p class="description">
                {{ topic.description || "Brak opisu tematu" }}
              </p>
            </div>

            <div class="header-actions">
              <button
                v-if="isMod || isAdmin"
                class="icon-btn"
                title="Dodaj podtemat"
                @click.stop="showSubtopicModal = true"
              >
                +
              </button>

              <button
                v-if="canSeeOptions && !topic.isClosed"
                class="icon-btn"
                title="Opcje"
                @click.stop="showOptionsModal = true"
              >
                ⚙
              </button>

              <!-- CLOSE -->
              <button
                class="icon-btn close"
                title="Zamknij"
                @click="emit('close')"
              >
                ✕
              </button>
            </div>
          </header>

          <!-- META -->
          <div class="meta">
            <span class="author">
              Utworzył: <strong>{{ topic.createdBy }}</strong>
            </span>

            <div class="badges">
              <span v-if="topic.isClosed" class="badge closed">
                Zamknięty
              </span>
              <span v-if="topic.isHidden" class="badge hidden">
                Ukryty
              </span>
            </div>
          </div>

          <section class="content">
            <CreatePost
              :topicId="topic._id"
              ref="createPostRefernce"
              @created="handleRefresh"
            />
            <PostList
              :topic="topic"
              :login="login"
              :isAdmin="isAdmin"
              @referenceAdded="createPostRefernce.loadStoredReferences()"
            />
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>

  <SubtopicModal
    v-if="showSubtopicModal"
    :parentTopic="topic"
    @close="showSubtopicModal = false"
    @created="handleRefresh"
  />

  <TopicOptionsModal
    v-if="showOptionsModal"
    :topic="topic"
    :canEdit="canEdit"
    :canManageModerators="canManageModerators"
    :canManageBlocked="canManageBlocked"
    @close="showOptionsModal = false"
    @updated="handleRefresh"
  />

</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted, onUnmounted } from "vue";

import SubtopicModal from "@/components/Topic/SubtopicModal.vue";
import TopicOptionsModal from "@/components/Topic/TopicOptionsModal.vue";

import CreatePost from "@/components/Post/CreatePost.vue";
import PostList from "@/components/Post/PostList.vue";

import { checkIsModerator } from "@/services/topics";
import { getSocket, joinTopic, leaveTopic } from "@/services/socket";

const props = defineProps({
  topic: {
    type: Object,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "refresh", "open-parent"]);

const isOwner = computed(
  () => props.topic.createdBy === props.login
);

const isMod = ref(false);
const createPostRefernce = ref(null);

const checkIsMod = async () => {
  const { isModerator } = await checkIsModerator(props.topic);
  isMod.value = isModerator;
}

const canSeeFullOptions = computed(
  () => props.isAdmin || isOwner.value
);

const canSeeLimitedOptions = computed(
  () => isMod.value && !canSeeFullOptions.value
);

const canSeeOptions = computed(
  () => canSeeFullOptions.value || canSeeLimitedOptions.value
);

const canEdit = computed(
  () => canSeeFullOptions.value
);

const canManageModerators = computed(
  () => canSeeOptions.value
);

const canManageBlocked = computed(
  () => canSeeOptions.value
);

const showSubtopicModal = ref(false);
const showOptionsModal = ref(false);

const handleRefresh = () => {
  showSubtopicModal.value = false;
  showOptionsModal.value = false;
  emit("refresh");
};

onBeforeMount(checkIsMod);

// SOCKETY

onMounted(() => {
  const socket = getSocket();
  if (!socket) return;

  joinTopic(props.topic._id);
});

onUnmounted(() => {
  const socket = getSocket();
  if (!socket) return;

  leaveTopic(props.topic._id);
});

</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 40, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  width: min(720px, 94%);
  max-height: 92vh;

  background: var(--bg-secondary);
  border-radius: 16px;
  box-shadow: var(--shadow-strong);

  display: flex;
  flex-direction: column;

  overflow-y: auto;
  overscroll-behavior: contain;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 22px;
  border-bottom: 1px solid var(--border-soft);
}

.title {
  font-size: 22px;
  font-weight: 600;
}

.description {
  font-size: 14px;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-muted);
  padding: 6px;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.icon-btn:hover {
  background: rgba(80, 200, 160, 0.15);
  color: var(--accent);
}

.meta {
  display: flex;
  justify-content: space-between;
  padding: 12px 22px;
  border-bottom: 1px solid var(--border-soft);
  font-size: 13px;
}

.badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
}

.closed {
  background: rgba(180, 60, 60, 0.25);
  color: #ff9b9b;
}

.hidden {
  background: rgba(120, 120, 120, 0.25);
  color: #ddd;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1em;

  padding: 2px 10px;
  min-height: 220px;
  font-style: italic;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(10px);
}

/* ===== SCROLLBAR – TopicModal ===== */

.modal::-webkit-scrollbar {
  width: 10px;
}

.modal::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
}

.modal::-webkit-scrollbar-thumb {
  background: rgba(80, 200, 160, 0.35);
  border-radius: 999px;
}

.modal::-webkit-scrollbar-thumb:hover {
  background: rgba(80, 200, 160, 0.6);
}

.modal {
  scrollbar-width: thin;
  scrollbar-color: rgba(80,200,160,0.5) rgba(255,255,255,0.05);
}
</style>
