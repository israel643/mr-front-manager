import { defineStore } from "pinia";
import { ref } from "vue";
import { Phone } from "@/models/Phone";
import api from "@/services/api";

export const usePhoneStore = defineStore("phone", () => {
  const path = "/phones";
  const phones = ref([]);

  async function fetchPhones(providerId) {
    try {
      const response = await api.get(`${path}/provider/${providerId}`);
      phones.value = response.data.map((p) => new Phone(p));
    } catch (err) {
      console.error("Error al cargar los teléfonos:", err);
    }
  }

  async function savePhone(phone, providerId) {
    try {
      const response = await api.post(path, { phone, providerId });
      phones.value.unshift(new Phone(response.data));
    } catch (err) {
      console.error("Error al guardar el teléfono:", err);
      throw err;
    }
  }

  async function deletePhone(id) {
    try {
      const response = await api.delete(`${path}/${id}`);
      phones.value = phones.value.filter((p) => p.id !== id);
      return response.data;
    } catch (err) {
      console.error("Error al eliminar el telefono:", err);
      throw err;
    }
  }

  return {
    phones,
    fetchPhones,
    savePhone,
    deletePhone,
  };
});
