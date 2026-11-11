import { defineStore } from "pinia";
import { ref } from "vue";
import { SoldWeek } from "@/models/SoldWeek";
import api from "@/services/api";

export const useSoldWeekStore = defineStore("soldWeek", () => {
  const path = "/dashbord-data";
  const soldWeekList = ref([]);

  async function loadSoldWeek() {
    try {
      const response = await api.get(`${path}/sold-per-week`);
      soldWeekList.value = response.data.soldPerWeekList.map(
        (it) => new SoldWeek(it)
      );
    } catch (error) {
      console.error(
        "Error al obtener la informacion de ventas por semana:",
        error
      );
      throw error;
    }
  }

  return {
    soldWeekList,
    loadSoldWeek,
  };
});
