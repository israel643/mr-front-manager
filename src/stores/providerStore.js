import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Provider } from "@/models/Provider";
import api from "@/services/api";

export const useProviderStore = defineStore("provider", () => {
  const path = "/providers";
  const providers = ref([]);
  const matchProvider = ref("");
  const page = ref(1);
  const limit = ref(10);
  const totalItems = ref(0);

  const paginatedProviders = computed(() => providers.value);

  async function loadProviders() {
    try {
      const response = await api.get(path, {
        params: {
          page: page.value,
          limit: limit.value,
          name: matchProvider.value || undefined,
        },
      });
      providers.value = response.data.providers.map((p) => new Provider(p));
      totalItems.value = response.data.totalItems;
    } catch (err) {
      console.log("Error al cargar los proveedores:", err);
      throw err;
    }
  }

  async function saveOrUpdateProvider(formData) {
    const id = formData.get("id")
    try {
      let response;
      if (id && id.trim().length > 0) {
        response = await api.put(`${path}/${formData.get("id")}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const index = providers.value.findIndex((p) => p.id == id);
        if (index !== -1) providers.value[index] = new Provider(response.data.provider);
      } else {
        response = await api.post(path, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        providers.value.unshift(new Provider(response.data.provider));
      }
      
      return response.data.message;
    } catch (err) {
      console.error("Error al guardar el proveedor:", err);
      throw err;
    }
  }

  async function changeProviderStatus(id, active) {
    try {
      const response = await api.patch(`${path}/${id}/status`, { active });
      const index = providers.value.findIndex((p) => p.id === id);
      if (index !== -1) providers.value[index].active = active;
      return response.data.message;
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      throw err;
    }
  }

  async function deleteProvider(id) {
    try {
      const response = await api.delete(`${path}/${id}`);
      providers.value = providers.value.filter((p) => p.id !== id);
      return response.data;
    } catch (err) {
      console.error("Error al eliminar el proveedor:", err);
      throw err;
    }
  }

  return {
    providers: paginatedProviders,
    matchProvider,
    page,
    limit,
    totalItems,
    loadProviders,
    saveOrUpdateProvider,
    changeProviderStatus,
    deleteProvider,
  };
});
