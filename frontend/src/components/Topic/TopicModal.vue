<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="overlay" @click.self="emit('close')">
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
                class="icon-btn"
                title="Dodaj podtemat"
                @click.stop="showSubtopicModal = true"
              >
                +
              </button>

              <button
                v-if="canSeeOptions"
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
            <!-- przyszłe posty -->
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- SUBTOPIC MODAL -->
  <SubtopicModal
    v-if="showSubtopicModal"
    :parentTopic="topic"
    @close="showSubtopicModal = false"
    @created="handleRefresh"
  />

  <!-- OPTIONS MODAL -->
  <TopicOptionsModal
    v-if="showOptionsModal"
    :canEdit="canEdit"
    :canManageModerators="canManageModerators"
    :canManageBlocked="canManageBlocked"
    @close="showOptionsModal = false"
    @action="handleOption"
  />
</template>

<script setup>
import { ref, computed } from "vue";

import SubtopicModal from "@/components/Topic/SubtopicModal.vue";
import TopicOptionsModal from "@/components/Topic/TopicOptionsModal.vue";

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

const isModerator = computed(
  () => props.topic.isModerator === true
);

const canSeeFullOptions = computed(
  () => props.isAdmin || isOwner.value
);

const canSeeLimitedOptions = computed(
  () => isModerator.value && !canSeeFullOptions.value
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
  emit("refresh")
};

const handleOption = (type) => {
  showOptionsModal.value = false;

  switch (type) {
    case "edit":
      emit("refresh");
      break;

    case "moderators":
      console.log("OPEN MODERATORS MODAL");
      break;

    case "blocked":
      console.log("OPEN BLOCKED USERS MODAL");
      break;
  }
};
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
  background: var(--bg-secondary);
  border-radius: 16px;
  box-shadow: var(--shadow-strong);
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  padding: 22px;
  min-height: 220px;
  opacity: 0.4;
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
</style>
