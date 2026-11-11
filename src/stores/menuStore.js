import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { userList } from "@/data/users";
import { profileList } from "@/data/profile";

export const useMenuStore = defineStore("menu", () => {
  // Estado: ID del usuario seleccionado
  const selectedUserId = ref(1);

  // Método para actualizar el usuario seleccionado
  const setSelectedUser = (id) => {
    selectedUserId.value = id;
  };

  const selectedUser = computed(
    () => userList.find((usr) => usr.id === selectedUserId.value) || null
  );

  const userPermissions = computed(() => {
    if (!selectedUser.value) return null;
    const profile = profileList.find((prof) => prof.id === selectedUser.value.profile);
    return profile ? profile.abbreviation : null;
  });

  return { selectedUserId, selectedUser, userPermissions, setSelectedUser };
});
