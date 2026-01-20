<template>
  <div class="post-list-wrapper">
    <div class="pagination">
      <button
        @click="prevPage"
        :disabled="page === 0"
      >
        ← Nowsze
      </button>

      <span class="page-info">
        Strona {{ page + 1 }}
      </span>

      <button @click="nextPage">
        Starsze →
      </button>
    </div>

    <div class="post-list">
      <TransitionGroup name="post" tag="div">
        <article
          v-for="post in posts"
          :key="post._id"
          class="post"
          :class="{ deleted: post.isDeleted }"
          @click="!post.isDeleted && openPost(post)"
        >
          <header class="post-header">
            <span class="login">{{ post.login }}</span>

            <span v-if="post.isDeleted" class="deleted-badge">
              usunięty
            </span>

            <button
              v-else-if="canDelete(post)"
              class="delete-btn"
              @click.stop="removePost(post._id)"
            >
              ✕
            </button>
          </header>

          <div class="post-content">
            {{ post.isDeleted ? "Ten post został usunięty." : post.content }}
          </div>

          <span
            v-if="!post.isDeleted && post.content.length > 200"
            class="more-hint"
          >
            Kliknij, aby zobaczyć całość
          </span>

          <footer class="post-footer">
            <button
              class="like-btn"
              :class="{ liked: post.likes.includes(login) }"
              :disabled="post.isDeleted"
              @click.stop="toggleLike(post)"
            >
              ♥ {{ post.likes.length }}
            </button>
          </footer>
        </article>
      </TransitionGroup>
    </div>
  </div>
    <PostModal
    v-if="selectedPost"
    :post="selectedPost"
    :topicName="topic.name"
    :login="login"
    :isAdmin="isAdmin"
    @close="selectedPost = null"
    />
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import {
  fetchPostsByTopic,
  toggleLikePost,
  deletePost
} from "@/services/posts";
import { getSocket } from "@/services/socket";
import PostModal from "@/components/Post/PostModal.vue";

const props = defineProps({
  topic: {
    type: Object,
    required: true
  },
  login: String,
  isAdmin: Boolean
});

const posts = ref([]);
const page = ref(0);
const selectedPost = ref(null);

const STORAGE_KEY = (id) => `postPage:${id}`;

const loadPageFromStorage = () =>
  Number(localStorage.getItem(STORAGE_KEY(props.topic._id))) || 0;

const savePageToStorage = (p) =>
  localStorage.setItem(STORAGE_KEY(props.topic._id), p);

const loadPosts = async () => {
  posts.value = await fetchPostsByTopic(props.topic._id, {
    page: page.value,
    limit: 20
  });
};

watch(
  () => props.topic._id,
  () => { // wrazie czego można jeszcze onmounted
    page.value = loadPageFromStorage();
    loadPosts();
  },
  { immediate: true }
);

const nextPage = () => {
  page.value += 1;
  savePageToStorage(page.value);
  loadPosts();
};

const prevPage = () => {
  if (page.value === 0) return;
  page.value -= 1;
  savePageToStorage(page.value);
  loadPosts();
};

const toggleLike = async (post) => {
  if (post.isDeleted) return;
  const { liked } = await toggleLikePost(post._id);
  liked
    ? post.likes.push(props.login)
    : post.likes.splice(post.likes.indexOf(props.login), 1);
};

const canDelete = (post) =>
  !post.isDeleted &&
  (post.login === props.login || props.isAdmin);

const removePost = async (id) => {
  await deletePost(id);
  loadPosts();
};

const openPost = (post) => {
  selectedPost.value = post;
};

onMounted(() => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("post-created", (post) => {
    if (page.value === 0) {
      posts.value.unshift(post);
    }
  });
});

onUnmounted(() => {
  const socket = getSocket();
  if (!socket) return;
  socket.off("post-created");
});
</script>


<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 1em;
  max-height: 45vh;
  overflow-y: auto;
  padding-right: 6px;
}

@media (max-width: 640px) {
  .post-list {
    max-height: 20vh;
  }
}

.post {
  background: var(--bg-primary);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.post.deleted {
  opacity: 0.55;
}

.deleted-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(180, 60, 60, 0.25);
  color: #ff9b9b;
  margin-left: auto;
}

.like-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.post:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-soft);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.login {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ff9b9b;
  font-size: 16px;
}

.post-content {
  padding-left: 1em;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 6px;

  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;

  white-space: pre-wrap;
}

.more-hint {
  font-size: 11px;
  opacity: 0.6;
  padding-left: 1em;
}

.post-footer {
  display: flex;
  justify-content: flex-end;
}

.like-btn {
  border: none;
  background: rgba(80, 200, 160, 0.15);
  color: var(--accent);
  border-radius: 999px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s, transform 0.15s;
}

.like-btn:hover {
  transform: scale(1.05);
}

.like-btn.liked {
  background: var(--accent);
  color: #022;
}

.post-enter-active,
.post-leave-active {
  transition: all 0.25s ease;
}

.post-enter-from,
.post-leave-to {
  opacity: 0;
  transform: translateY(6px);
}


.post-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75em;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.pagination button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--accent);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ===== SCROLLBAR – WebKit ===== */
:deep(.post-list::-webkit-scrollbar) {
  width: 8px;
}

:deep(.post-list::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.post-list::-webkit-scrollbar-thumb) {
  background: rgba(80, 200, 160, 0.35);
  border-radius: 999px;
}

:deep(.post-list::-webkit-scrollbar-thumb:hover) {
  background: rgba(80, 200, 160, 0.55);
}

/* ===== SCROLLBAR – Firefox ===== */
:deep(.post-list) {
  scrollbar-width: thin;
  scrollbar-color: rgba(80,200,160,0.45) transparent;
}
</style>
