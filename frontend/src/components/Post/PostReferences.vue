<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="overlay" @click.self="emit('close')">
        <article class="modal">
          <header class="header">
            <h3>Referencje</h3>

            <button class="close-btn" @click="emit('close')">
              ✕
            </button>
          </header>

          <section class="content">
            <div
              v-if="loading"
              class="loading"
            >
              Ładowanie…
            </div>

            <article
              v-for="post in posts"
              :key="post._id"
              class="ref-post"
              @click="openPost(post)"
            >
              <header class="ref-header">
                <span class="login">{{ post.login }}</span>
                <span class="topic">{{ post.topic.name }}</span>
              </header>

              <p class="ref-content">
                {{ post.content.slice(0, 180) }}
              </p>
            </article>
          </section>
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchPostById } from "@/services/posts";

const props = defineProps({
  referenceIds: {
    type: Array,
    required: true
  },
  login: String,
  isAdmin: Boolean
});

const emit = defineEmits(["close", "open-post"]);

const openPost = (post) => {
  emit("open-post", post);
  emit('close');
};

const posts = ref([]);
const loading = ref(true);

onMounted(async () => {
  posts.value = await Promise.all(
    props.referenceIds.map(id => fetchPostById(id))
  );
  loading.value = false;
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

  z-index: 1200;
}
.modal {
  width: min(640px, 95%);
  max-height: 80vh;
  background: var(--bg-secondary);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-soft);
}

.content {
  padding: 14px 18px;
  overflow-y: auto;
}

.ref-post {
  background: var(--bg-primary);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  margin-bottom: 10px;
}

.ref-post:hover {
  box-shadow: var(--shadow-soft);
}

.ref-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 6px;
}

.login {
  color: var(--accent);
  font-weight: 600;
}

.topic {
  opacity: 0.6;
}

.ref-content {
  font-size: 13px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
