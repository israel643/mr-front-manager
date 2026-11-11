import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { User } from "@/models/User";
import api from "@/services/api";

export const useUserStore = defineStore("user", () => {
  const path = "/users";
  const users = ref([]);
  const matchUser = ref("");
  const page = ref(1);
  const limit = ref(10);
  const totalItems = ref(0);

  const paginatedUsers = computed(() => users.value);

  async function loadUsers() {
    try {
      const response = await api.get(path, {
        params: {
          page: page.value,
          limit: limit.value,
          match: matchUser.value || undefined,
        },
      });
      users.value = response.data.users.map((u) => new User(u));
      totalItems.value = response.data.totalItems;
    } catch (err) {
      console.log("Error al cargar los usuarios:", err);
    }
  }

  async function saveOrUpdateUser(formData) {
    const id = formData.get("id");
    try {
      let response;

      if (id && id.trim().length > 0) {
        response = await api.put(`${path}/${formData.get("id")}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const index = users.value.findIndex((u) => u.id == id);
        if (index !== -1) users.value[index] = new User(response.data.user);
      } else {
        response = await api.post(path, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        users.value.unshift(new User(response.data.user));
      }
      
      return response.data.message;
    } catch (err) {
      console.error("Error al guardar el usuario:", err);
      throw err;
    }
  }

  async function changeUserStatus(id, active) {
    try {
      const response = await api.patch(`${path}/${id}/status`, { active });
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) users.value[index].active = active;
      return response.data.message;
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      throw err;
    }
  }

  async function changeUserPassword(id, password) {
    try {
      const response = await api.patch(`${path}/${id}/password`, { password });
      return response.data.message;
    } catch (err) {
      console.error("Error al cambiar password:", err);
      throw err;
    }
  }

  async function deleteUser(id) {
    try {
      const response = await api.delete(`${path}/${id}`);
      users.value = users.value.filter((u) => u.id !== id);
      return response.data;
    } catch (err) {
      console.error("Error al eliminar el usuario:", err);
      throw err;
    }
  }

  return {
    users: paginatedUsers,
    matchUser,
    page,
    limit,
    totalItems,
    loadUsers,
    saveOrUpdateUser,
    changeUserStatus,
    changeUserPassword,
    deleteUser,
  };
});
