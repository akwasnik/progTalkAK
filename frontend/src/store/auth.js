import { reactive } from "vue";
import { fetchMe } from "@/services/auth";

export const auth = reactive({
  user: null,
  loading: true,

  async init() {
    try {
      this.user = await fetchMe();
    } catch {
      this.user = null;
    } finally {
      this.loading = false;
    }
  },

  clear() {
    this.user = null;
  }
});
