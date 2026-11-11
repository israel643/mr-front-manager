import { defineStore } from "pinia";
import { ref } from "vue";
import { Email } from "@/models/Email";
import api from "@/services/api";

export const useEmailStore = defineStore("email", () => {
  const path = "/emails";
  const emails = ref([]);

  async function fetchEmails(providerId) {
    try {
      const response = await api.get(`${path}/provider/${providerId}`);
      emails.value = response.data.map((e) => new Email(e));
    } catch (err) {
      console.error("Error al cargar los correos:", err);
    }
  }

  async function saveEmail(email, providerId) {
    try {
      const response = await api.post(path, { email, providerId });
      emails.value.unshift(new Email(response.data));
    } catch (err) {
      console.error("Error al guardar el correo:", err);
      throw err;
    }
  }

  async function deleteEmail(id) {
    try {
      const response = await api.delete(`${path}/${id}`);
      emails.value = emails.value.filter((e) => e.id !== id);
      return response.data;
    } catch (err) {
      console.error("Error al eliminar el correo:", err);
      throw err;
    }
  }
  
  return {
    emails,
    fetchEmails,
    saveEmail,
    deleteEmail,
  };
});
