import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Measurement } from "@/models/Measurement";
import api from "@/services/api";

export const useMeasurementStore = defineStore("measurement", () => {
  const path = "/measurement";
  const measurements = ref([]);
  const matchMeasurement = ref("");
  const page = ref(1);
  const limit = ref(10);
  const totalItems = ref(0);

  const paginatedMeasurements = computed(() => measurements.value);

  async function loadMeasurements() {
    try {
      const response = await api.get(path, {
        params: {
          page: page.value,
          limit: limit.value,
          match: matchMeasurement.value || undefined,
        },
      });
      measurements.value = response.data.measurements.map(
        (m) => new Measurement(m)
      );
      totalItems.value = response.data.totalItems;
    } catch (err) {
      console.log("Error al cargar las medidas:", err);
    }
  }

  async function saveOrUpdateMeasurement(data) {
    try {
      let response;
      if (data.id) {
        response = await api.put(`${path}/${data.id}`, data);
        const index = measurements.value.findIndex((m) => m.id === data.id);
        if (index !== -1) measurements.value[index] = new Measurement(data);
      } else {
        response = await api.post(path, data);
        measurements.value.unshift(new Measurement(response.data.measurement));
      }
      return response.data.message;
    } catch (err) {
      console.error("Error al guardar la medida:", err);
      throw err;
    }
  }

  async function changeMeasurementStatus(id, active) {
    try {
      const response = await api.patch(`${path}/${id}/status`, { active });
      const index = measurements.value.findIndex((m) => m.id === id);
      if (index !== -1) measurements.value[index].active = active;
      return response.data.message;
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      throw err;
    }
  }

  async function deleteMeasurement(id) {
    try {
      const response = await api.delete(`${path}/${id}`);
      measurements.value = measurements.value.filter((m) => m.id !== id);
      return response.data;
    } catch (err) {
      console.error("Error al eliminar la medida:", err);
      throw err;
    }
  }

  return {
    measurements: paginatedMeasurements,
    matchMeasurement,
    page,
    limit,
    totalItems,
    loadMeasurements,
    saveOrUpdateMeasurement,
    changeMeasurementStatus,
    deleteMeasurement,
  };
});
