import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Article } from "@/models/Article";
import api from "@/services/api";

export const useArticleStore = defineStore("article", () => {
  const path = "/articles";
  const articles = ref([]);
  const matchArticle = ref("");
  const categoryId = ref(null);
  const brandId = ref(null);
  const measurementId = ref(null);
  const page = ref(1);
  const limit = ref(10);
  const totalItems = ref(0);

  const paginatedArticles = computed(() => articles.value);

  async function loadArticles() {
    try {
      const response = await api.get(path, {
        params: {
          page: page.value,
          limit: limit.value,
          match: matchArticle.value || undefined,
          categoryId: categoryId.value || undefined,
          brandId: brandId.value || undefined,
          measurementId: measurementId.value || undefined,
        },
      });
      articles.value = response.data.articles.map((a) => new Article(a));
      totalItems.value = response.data.totalItems;
    } catch (err) {
      console.log("Error al cargar los articulos:", err);
      throw err;
    }
  }

  async function saveOrUpdateArticle(formData) {
    const id = formData.get("id");
    try {
      let response;
      if (id) {
        response = await api.put(`${path}/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const index = articles.value.findIndex((a) => a.id == id);
        if (index !== -1)
          articles.value[index] = new Article(response.data.article);
      } else {
        response = await api.post(path, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        articles.value.unshift(new Article(response.data.article));
      }

      return response.data.message;
    } catch (err) {
      console.error("Error al guardar el articulo:", err);
      throw err;
    }
  }

  async function changeArticleStatus(id, active) {
    try {
      const response = await api.patch(`${path}/${id}/status`, { active });
      const index = articles.value.findIndex((a) => a.id == id);
      if (index !== -1) articles.value[index].active = active;
      return response.data.message;
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      throw err;
    }
  }

  async function deleteArticle(id) {
    try {
      const response = await api.delete(`${path}/${id}`);
      const index = articles.value.findIndex((a) => a.id == id);
      if (index !== -1) articles.value.splice(index, 1);
      return response.data.message;
    } catch (err) {
      console.error("Error al eliminar el articulo:", err);
      throw err;
    }
  }

  return {
    articles: paginatedArticles,
    matchArticle,
    categoryId,
    brandId,
    measurementId,
    page,
    limit,
    totalItems,
    loadArticles,
    saveOrUpdateArticle,
    changeArticleStatus,
    deleteArticle,
  };
});
