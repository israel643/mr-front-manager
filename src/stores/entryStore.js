import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { Article } from "@/models/Article";
import { useAuthStore } from "@/stores/authStore";
import { MovementType } from '@/constants/movementType'
import api from "@/services/api";

export const useEntryStore = defineStore("entry", () => {
  const articlePath = "/articles";
  const movementsPath = "/movements";
  const articles = ref([]);
  const cart = ref([]);
  const matchEntry = ref("");
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);

  async function findArticles() {
    try {
      const response = await api.get(articlePath, {
        params: {
          match: matchEntry.value || undefined,
          active: true,
        },
      });
      articles.value = response.data.articles.map((a) => new Article(a));
    } catch (err) {
      console.log("Error al cargar los articulos:", err);
      throw err;
    }
  }

  async function createEntry() {
    try {
      const response = await api.post(`${movementsPath}/create`, {
        movementType: MovementType.ENTRADA,
        userId: user.value?.id,
        items: cart.value.map((item) => ({
          articleId: item.articleId,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      cart.value = [];
      return response.data;
    } catch (err) {
      console.log("Error al crear la entrada de productos");
      throw err;
    }
  }

  return {
    articles,
    cart,
    matchEntry,
    findArticles,
    createEntry,
  };
});
