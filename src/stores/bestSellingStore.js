import { defineStore } from "pinia";
import { ref } from "vue";
import { BestSellingItem } from "@/models/BestSellingItem";
import api from "@/services/api";

export const useBestSellingStore = defineStore("bestSelling", () => {
  const path = "/dashbord-data";
  const bestSellingList = ref([]);

  async function loadBestSellingData() {
    try {
      const response = await api.get(`${path}/best-selling`);
      bestSellingList.value = response.data.bestSellingList.map(
        (it) => new BestSellingItem(it)
      );
    } catch (error) {
      console.error(
        "Error al obtener el top 10 de los articulos más vendidos:",
        error
      );
      throw error;
    }
  }

  return {
    bestSellingList,
    loadBestSellingData,
  };
});
