import { defineStore } from "pinia";
import { ref } from "vue";
import { CriticalStock } from "@/models/CriticalStock";
import api from "@/services/api";

export const useWithoutRotationStore = defineStore("withoutRotation", () => {
  const path = "/dashbord-data";
  const page = ref(1);
  const limit = ref(5);
  const totalItems = ref(0);
  const withoutRotationList = ref([]);

  async function loadWithoutRotationData() {
    try {
      const response = await api.get(`${path}/without-rotation`, {
        params: {
          page: page.value,
          limit: limit.value,
        },
      });
      withoutRotationList.value = response.data.withoutRotationList.map(
        (it) => new CriticalStock(it)
      );
      totalItems.value = response.data.totalItems;
    } catch (error) {
      console.error(
        "Error al obtener la informacion de articulos sin rotacion:",
        error
      );
      throw error;
    }
  }

  return {
    withoutRotationList,
    page,
    limit,
    totalItems,
    loadWithoutRotationData,
  };
});
