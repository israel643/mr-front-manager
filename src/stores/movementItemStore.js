import { defineStore } from "pinia";
import { ref } from "vue";
import { MovementItem } from "@/models/MovementItem";
import api from "@/services/api";

export const useMovementItem = defineStore("movementItem", () => {
  const path = "/movements/detail";
  const items = ref([]);

  async function fetchMovementDetails(movementId) {
    try {
      const response = await api.get(`${path}/movement/${movementId}`);
      items.value = response.data.map((i) => new MovementItem(i));
    } catch (err) {
      console.error("Error al cargar el detalle del movimiento:", err);
    }
  }

  return {
    items,
    fetchMovementDetails,
  };
});
