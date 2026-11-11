import { defineStore } from "pinia";
import { ref } from "vue";
import { CriticalStock } from "@/models/CriticalStock";
import api from "@/services/api";

export const useCriticalStore = defineStore("criticalSock", () => {
  const path = "/dashbord-data";
  const page = ref(1);
  const limit = ref(5);
  const totalItems = ref(0);
  const criticalStockList = ref([]);

  async function loadCriticalStockData() {
    try {
      const response = await api.get(`${path}/critical-stock`, {
        params: {
          page: page.value,
          limit: limit.value,
        },
      });
      criticalStockList.value = response.data.critialStockList.map(
        (it) => new CriticalStock(it)
      );
      totalItems.value = response.data.totalItems;
    } catch (error) {
      console.error(
        "Error al obtener la informacion del stock critico:",
        error
      );
      throw error;
    }
  }

  return {
    criticalStockList,
    page,
    limit,
    totalItems,
    loadCriticalStockData,
  };
});
