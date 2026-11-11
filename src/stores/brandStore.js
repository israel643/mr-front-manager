import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Brand } from "@/models/Brand";
import api from "@/services/api";

export const useBrandStore = defineStore("brand", () => {
  const path = "/brand";
  const brands = ref([]);
  const matchBrand = ref("");
  const page = ref(1);
  const limit = ref(10);
  const totalItems = ref(0);

  const paginatedBrands = computed(() => brands.value);

  async function loadBrands() {
    try {
      const response = await api.get(path, {
        params: {
          page: page.value,
          limit: limit.value,
          name: matchBrand.value || undefined,
        },
      });
      brands.value = response.data.brands.map((b) => new Brand(b));
      totalItems.value = response.data.totalItems;
    } catch (err) {
      console.log("Error al cargar categorias:", err);
    }
  }

  async function saveOrUpdateBrand(formData) {
    const id = formData.get("id");
    try {
      let response;
      if (id && id.trim().length > 0) {
        response = await api.put(`${path}/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const index = brands.value.findIndex((brand) => brand.id === id);
        if (index !== -1) brands.value[index] = new Brand(response.data.brand);
      } else {
        response = await api.post(path, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        brands.value.unshift(new Brand(response.data.brand));
      }

      return response.data.message;
    } catch (err) {
      console.error("Error al guardar la marca:", err);
      throw err;
    }
  }

  async function changeBrandStatus(id, active) {
    try {
      const response = await api.patch(`${path}/${id}/status`, { active });
      const index = brands.value.findIndex((brand) => brand.id === id);
      if (index !== -1) brands.value[index].active = active;
      return response.data.message;
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      throw err;
    }
  }

  async function deleteBrand(id) {
    try {
      const response = await api.delete(`${path}/${id}`);
      brands.value = brands.value.filter((brand) => brand.id !== id);
      return response.data;
    } catch (err) {
      console.error("Error al eliminar marca:", err);
      throw err;
    }
  }

  return {
    brands: paginatedBrands,
    matchBrand,
    page,
    limit,
    totalItems,
    loadBrands,
    saveOrUpdateBrand,
    changeBrandStatus,
    deleteBrand,
  };
});
