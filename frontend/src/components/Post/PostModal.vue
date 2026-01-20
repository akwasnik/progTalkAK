<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="overlay" @click.self="emit('close')">
        <article class="modal">
          <header class="header">
            <div class="meta">
              <span class="author">{{ post.login }}</span>
              <span class="topic">w temacie: {{ topicName }}</span>
            </div>

          </header>

          <section class="content">
            <div
              class="full-content"
              v-html="renderedContent"
            />
          </section>

          <footer class="footer">
            <button
              class="like-btn"
              :class="{ liked: post.likes.includes(login) }"
              :disabled="post.isDeleted"
              @click="toggleLike"
            >
              ♥ {{ post.likes.length }}
            </button>

            <button class="close-btn" @click="emit('close')">
              Zamknij
            </button>
          </footer>
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { toggleLikePost } from "@/services/posts";
import { computed } from "vue";
import { renderPostContent } from "@/services/highlight";

const renderedContent = computed(() =>
  renderPostContent(props.post.content)
);

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  topicName: {
    type: String,
    required: true
  },
  login: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close"]);

const toggleLike = async () => {
  if (props.post.isDeleted) return;

  const { liked } = await toggleLikePost(props.post._id);

  liked
    ? props.post.likes.push(props.login)
    : props.post.likes.splice(
        props.post.likes.indexOf(props.login),
        1
      );
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
  z-index: 1000;
}

/* ===== MODAL ===== */

.modal {
  width: min(720px, 95%);
  max-height: 90vh;
  background: var(--bg-secondary);
  border-radius: 18px;
  box-shadow: var(--shadow-strong);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== HEADER ===== */

.header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--border-soft);
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.03),
    transparent
  );
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author {
  font-weight: 600;
  color: var(--accent);
  font-size: 14px;
}

.topic {
  font-size: 12px;
  opacity: 0.65;
}

/* ===== CONTENT ===== */

.content {
  padding: 20px 22px;
  overflow-y: auto;
  flex: 1;
}

.full-content {
  background: var(--bg-primary);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  padding: 18px 20px;

  box-shadow: var(--shadow-soft);

  white-space: pre-wrap;
  line-height: 1.75;
  font-size: 15px;
  color: var(--text-primary);
}

.full-content p {
  margin: 0 0 0.9em;
}

:deep(.code-block) {
  margin: 0px;
  border-radius: 12px;
  overflow-x: auto;
  background: #0d1117;
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.06),
    0 6px 18px rgba(0,0,0,0.35);
}

:deep(.code-block code) {
  font-size: 13px;
  line-height: 1.6;
}


/* ===== FOOTER ===== */

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 22px;
  border-top: 1px solid var(--border-soft);
  background: linear-gradient(
    to top,
    rgba(255,255,255,0.03),
    transparent
  );
}

/* ===== ACTIONS ===== */

.like-btn {
  border: none;
  background: rgba(80, 200, 160, 0.15);
  color: var(--accent);
  border-radius: 999px;
  padding: 6px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.15s, transform 0.15s;
}

.like-btn:hover {
  transform: translateY(-1px);
  background: rgba(80, 200, 160, 0.25);
}

.like-btn.liked {
  background: var(--accent);
  color: #022;
}

.like-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.close-btn:hover {
  opacity: 1;
}

/* ===== ANIMATIONS ===== */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(10px);
}

/* ===== MOBILE ===== */

@media (max-width: 640px) {
  .modal {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }

  .content {
    padding: 16px;
  }

  .full-content {
    padding: 16px;
  }
}

/* ===== SCROLLBAR – PostModal content ===== */
:deep(.content::-webkit-scrollbar) {
  width: 10px;
}

:deep(.content::-webkit-scrollbar-track) {
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
}

:deep(.content::-webkit-scrollbar-thumb) {
  background: rgba(80, 200, 160, 0.35);
  border-radius: 999px;
}

:deep(.content::-webkit-scrollbar-thumb:hover) {
  background: rgba(80, 200, 160, 0.6);
}

:deep(.content) {
  scrollbar-width: thin;
  scrollbar-color: rgba(80,200,160,0.5) rgba(255,255,255,0.05);
}
</style>