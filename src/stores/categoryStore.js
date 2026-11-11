import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Category } from "@/models/Category";
import api from "@/services/api";

export const useCategoryStore = defineStore("category", () => {
  const path = "/category";
  const categories = ref([]);
  const matchCategory = ref("");
  const page = ref(1);
  const limit = ref(10);
  const totalItems = ref(0);

  const paginatedCategories = computed(() => categories.value);

  async function loadCategories() {
    try {
      const response = await api.get(path, {
        params: {
          page: page.value,
          limit: limit.value,
          name: matchCategory.value || undefined,
        },
      });
      categories.value = response.data.categories.map((c) => new Category(c));
      totalItems.value = response.data.totalItems;
    } catch (err) {
      console.log("Error al cargar categorias:", err);
    }
  }

  async function saveOrUpdateCategory(data) {
    try {
      let response;
      if (data.id) {
        response = await api.put(`${path}/${data.id}`, data);
        const index = categories.value.findIndex((cat) => cat.id === data.id);
        if (index !== -1) categories.value[index] = new Category(data);
      } else {
        response = await api.post("/category", data);
        categories.value.unshift(new Category(response.data.category));
      }
      return response.data.message;
    } catch (err) {
      console.error("Error al guardar la categoría:", err);
      throw err;
    }
  }

  async function changeCategoryStatus(id, active) {
    try {
      const response = await api.patch(`${path}/${id}/status`, { active });
      const index = categories.value.findIndex((cat) => cat.id === id);
      if (index !== -1) categories.value[index].active = active;
      return response.data.message;
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      throw err;
    }
  }

  async function deleteCategory(id) {
    try {
      const response = await api.delete(`${path}/${id}`);
      categories.value = categories.value.filter((cat) => cat.id !== id);
      return response.data;
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      throw err;
    }
  }

  return {
    categories: paginatedCategories,
    matchCategory,
    page,
    limit,
    totalItems,
    loadCategories,
    saveOrUpdateCategory,
    changeCategoryStatus,
    deleteCategory,
  };
});
