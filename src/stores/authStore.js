import { defineStore } from "pinia";
import { ref } from "vue";
import { RoleType } from "@/constants/roleType"
import router from "@/router";
import api from "@/services/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const permissions = ref([]);

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/profile");
      user.value = response.data.user;
      permissions.value = response.data.permissions;
      console.log(response.data);
      return response.data;
    } catch (error) {
      user.value = null;
      permissions.value = null;
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      user.value = response.data.user;
      permissions.value = response.data.permissions;
      if (user.value.role.id == RoleType.ADMIN)
        router.push("/dashboard");
      else
        router.push("/articles");
      return response.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await api.post("/auth/logout");
      user.value = null;
      permissions.value = [];
      router.push("/login");
      return response.data.message;
    } catch(error) {
      throw error;
    }
  };

  return {
    user,
    permissions,
    fetchUser,
    login,
    logout,
  };
});
