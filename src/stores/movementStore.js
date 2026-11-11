import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Movement } from "@/models/Movement";
import api from "@/services/api";

export const useMovementStore = defineStore("movement", () => {
  const path = "/movements";
  const movements = ref([]);
  const movementTypeId = ref(null);
  const startDate = ref(null);
  const endDate = ref(null);
  const page = ref(1);
  const limit = ref(10);
  const totalItems = ref(0);

  const paginatedMovements = computed(() => movements.value);

  async function loadMovements() {
    try {
      const response = await api.get(path, {
        params: {
          page: page.value,
          limit: limit.value,
          movementType: movementTypeId.value || undefined,
          startDate: startDate.value || undefined,
          endDate: endDate.value || undefined,
        },
      });
      movements.value = response.data.movements.map((m) => new Movement(m));
      totalItems.value = response.data.totalItems;
    } catch (err) {
      console.log("Error al cargar los movimientos:", err);
    }
  }

  return {
    movements: paginatedMovements,
    movementTypeId,
    startDate,
    endDate,
    page,
    limit,
    totalItems,
    loadMovements
  };
});
