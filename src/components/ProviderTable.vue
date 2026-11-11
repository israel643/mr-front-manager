<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { IconEdit, IconPower, IconPhone, IconMail } from '@tabler/icons-vue'
import { useToast } from 'vue-toastification';
import { storeToRefs } from 'pinia';
import { useProviderStore } from '@/stores/providerStore';
import { Provider } from '@/models/Provider';
import { API_BASE_URL } from '@/config';

import imageNotAvailable from '@/assets/images/image-not-found.png'
import BaseTableActionButton from '@/components/BaseTableActionButton.vue'
import BaseTableHeader from '@/components/BaseTableHeader.vue';
import ThePaginator from '@/components/ThePaginator.vue';

const emit = defineEmits(['openForm', 'openPhones', 'openEmails', 'toggle']);
const title = 'Gestión de proveedores';
const toast = useToast();
const store = useProviderStore();
const isLoading = ref(false);
const { providers, page, limit, totalItems, matchProvider } = storeToRefs(store);
const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));
let debouncedTimeout = null;

const fetchProviders = async () => {
  isLoading.value = true;
  try {
    await store.loadProviders();
  } catch (error) {
    toast.error(error.message || 'Error al cargar los proveedores');
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
    fetchProviders();
});

watch(page, fetchProviders);

watch(matchProvider, (newValue) => {
  clearTimeout(debouncedTimeout);
  debouncedTimeout = setTimeout(() => {
    store.matchProvider = newValue;
    store.page = 1;
    fetchProviders();
  }, 700);
});

onMounted(fetchProviders);
</script>

<template>
  <div class="w-full">
    <BaseTableHeader :title="title" v-model="matchProvider" @create="$emit('openForm', new Provider())" />
    <div class="overflow-x-auto w-full">
      <table class="table table-md table-zebra w-full">
        <thead>
          <tr class="bg-base-200 text-base-content">
            <th></th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr v-for="prov in providers" :key="prov.id">
            <td>
              <figure class="w-40 h-15 overflow-hidden rounded-md">
                <img :src="prov.logoUrl ? `${API_BASE_URL}${prov.logoUrl}` : imageNotAvailable" :alt="prov.name" class="object-cover w-full h-full">
              </figure>
            </td>
            <td class="min-w-[12rem] max-w-[20rem]">{{ prov.name }}</td>
            <td class="min-w-[15rem] max-w-[30rem]">{{ prov.address }}</td>
            <td>
              <span :class="['badge badge-md', prov.active == true ? 'badge-success' : 'badge-default']">{{
                prov.active == true ? 'Activo' : 'Inactivo'
                }}</span>
            </td>
            <td>
              <div class="flex gap-1">
                <BaseTableActionButton :icon="IconEdit" tooltip="Editar" @click="$emit('openForm', prov)" />
                <BaseTableActionButton :icon="IconPhone" tooltip="Teléfonos" @click="$emit('openPhones', prov)" />
                <BaseTableActionButton :icon="IconMail" tooltip="Correos" @click="$emit('openEmails', prov)" />
                <BaseTableActionButton :icon="IconPower" :tooltip="prov.active ? 'Desactivar' : 'Activar'"
                  @click="$emit('toggle', prov)" />
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="n in limit" :key="n">
            <td>
              <div class="skeleton h-15 w-30 rounded"></div>
            </td>
            <td>
              <div class="skeleton h-4 w-40 rounded"></div>
            </td>
            <td>
              <div class="skeleton h-4 w-60 rounded"></div>
            </td>
            <td>
              <div class="skeleton h-4 w-12 rounded"></div>
            </td>
            <td>
              <div class="flex gap-2">
                <div class="skeleton h-8 w-8 rounded-full"></div>
                <div class="skeleton h-8 w-8 rounded-full"></div>
                <div class="skeleton h-8 w-8 rounded-full"></div>
                <div class="skeleton h-8 w-8 rounded-full"></div>
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