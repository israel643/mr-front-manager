import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { Article } from "@/models/Article";
import { useAuthStore } from "@/stores/authStore";
import { MovementType } from '@/constants/movementType'
import api from "@/services/api";

export const useOutputStore = defineStore("output", () => {
  const articlePath = "/articles";
  const movementsPath = "/movements";
  const articles = ref([]);
  const cart = ref([]);
  const matchOutput = ref("");
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore)

  async function findArticles() {
    try {
      const response = await api.get(articlePath, {
        params: {
          match: matchOutput.value || undefined,
          active: true,
        },
      });
      articles.value = response.data.articles.map((a) => new Article(a));
    } catch (err) {
      console.log("Error al cargar los articulos:", err);
      throw err;
    }
  }

  async function createOutput() {
    try {
      const response = await api.post(`${movementsPath}/create`, {
        movementType: MovementType.SALIDA,
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
      console.log("Error al crear la salida de productos", err);
      throw err;
    }
  }

  return {
    articles,
    cart,
    matchOutput,
    findArticles,
    createOutput,
  };
});
