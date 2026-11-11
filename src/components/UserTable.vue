<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { IconEdit, IconPower, IconLockPassword } from '@tabler/icons-vue'
import { useToast } from 'vue-toastification';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/User';
import { API_BASE_URL } from '@/config';

import imageNotAvailable from '@/assets/images/image-not-found.png';
import BaseTableActionButton from '@/components/BaseTableActionButton.vue'
import BaseTableHeader from '@/components/BaseTableHeader.vue';
import ThePaginator from '@/components/ThePaginator.vue';

const emit = defineEmits(['openForm', 'password', 'toggle']);
const title = 'Gestión de usuarios';
const toast = useToast();
const store = useUserStore();
const isLoading = ref(false);
const { users, page, limit, totalItems, matchUser } = storeToRefs(store);
const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));
let debouncedTimeout = null;

const fetchUsers = async () => {
    isLoading.value = true;
    try {
        await store.loadUsers();
    } catch (error) {
        toast.error(error.message || 'Error al cargar los usuarios');
    } finally {
        isLoading.value = false;
    }
};

const increasePage = () => {
    if (page.value < totalPages.value) {
        store.page++;
    }
};

const decreasePage = () => {
    if (page.value > 1) {
        store.page--;
    }
};

watch(limit, () => {
    store.page = 1;
    fetchUsers();
});

watch(page, fetchUsers);

watch(matchUser, (newValue) => {
    clearTimeout(debouncedTimeout);
    debouncedTimeout = setTimeout(() => {
        store.matchUser = newValue;
        store.page = 1;
        fetchUsers();
    }, 700);
});

onMounted(fetchUsers);
</script>

<template>
    <div class="w-full">
        <BaseTableHeader :title="title" v-model="matchUser" @create="$emit('openForm', new User())" />
        <div class="overflow-x-auto w-full">
            <table class="table table-md table-zebra w-full">
                <thead>
                    <tr class="bg-base-200 text-base-content">
                        <th></th>
                        <th>Correo electrónico</th>
                        <th>Estatus</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="!isLoading">
                    <tr v-for="user in users" :key="user.id">
                        <td class="flex items-center gap-3">
                            <div class="avatar">
                                <div class="mask mask-squircle h-20 w-20">
                                    <img :src="user.photoUrl ? `${API_BASE_URL}${user.photoUrl}` : imageNotAvailable"
                                        :alt="user.name" />
                                </div>
                            </div>
                            <div>
                                <div class="font-bold">{{ user.fullName }}</div>
                                <div class="text-md opacity-80">{{ user.role?.name }}</div>
                            </div>
                        </td>
                        <td>
                            {{ user.email }}
                        </td>
                        <td>
                            <span
                                :class="['badge badge-md', user.active == true ? 'badge-success' : 'badge-default']">{{
                                    user.active == true ? 'Activo' : 'Inactivo'
                                }}</span>
                        </td>
                        <td>
                            <div class="flex gap-1">
                                <BaseTableActionButton :icon="IconEdit" tooltip="Editar"
                                    @click="$emit('openForm', user)" />
                                <BaseTableActionButton :icon="IconLockPassword" tooltip="Cambiar contraseña"
                                    @click="$emit('password', user)" />
                                <BaseTableActionButton :icon="IconPower"
                                    :tooltip="user.active ? 'Desactivar' : 'Activar'" @click="$emit('toggle', user)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr v-for="n in limit" :key="n">
                        <td>
                            <div class="flex items-center gap-3">
                                <div class="skeleton h-20 w-20 rounded-3xl"></div>
                                <div>
                                    <div class="skeleton h-4 w-32 rounded"></div>
                                    <div class="skeleton h-4 w-24 rounded"></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-24 rounded"></div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-12 rounded"></div>
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <div class="skeleton h-8 w-8 rounded-lg"></div>
                                <div class="skeleton h-8 w-8 rounded-lg"></div>
                                <div class="skeleton h-8 w-8 rounded-lg"></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ThePaginator :page="page" :total-pages="totalPages" @increasePage="increasePage" @decreasePage="decreasePage"
            v-model:rowsPerPage="limit" />
    </div>
</template>