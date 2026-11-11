<script setup>
import { onMounted } from 'vue';
import { useCriticalStore } from '@/stores/criticalStore';
import { useWithoutRotationStore } from '@/stores/withoutRotationStore';
import { useSoldWeekStore } from '@/stores/soldWeekStore';
import { useBestSellingStore } from '@/stores/bestSellingStore';

import InventarioPorCategoria from '@/components/InventarioPorCategoria.vue';
import RentabilidadPorCategoria from '@/components/RentabilidadPorCategoria.vue';
import VentasPorCategoria from '@/components/VentasPorCategoria.vue';

import CriticalStockTable from '@/components/CriticalStockTable.vue';
import WithoutRotationTable from '@/components/WithoutRotationTable.vue';
import SoldWeekChart from '@/components/SoldWeekChart.vue';
import BestSellingChart from '@/components/BestSellingChart.vue';

const criticalStore = useCriticalStore();
const withoutRotationStore = useWithoutRotationStore();
const soldWeekStore = useSoldWeekStore();
const bestSellingStore = useBestSellingStore();

onMounted(async () => {
    await criticalStore.loadCriticalStockData();
    await withoutRotationStore.loadWithoutRotationData();
    await soldWeekStore.loadSoldWeek();
    await bestSellingStore.loadBestSellingData();
})
</script>

<template>
  <div class="w-full flex justify-center px-4">
    <div class="w-full max-w-screen-xl grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card bg-base-100">
        <WithoutRotationTable />
      </div>

      <div class="card bg-base-100">
        <CriticalStockTable />
      </div>

      <div class="card bg-base-100">
        <VentasPorCategoria />
      </div>

      <div class="card bg-base-100">
        <SoldWeekChart />
      </div>

      <div class="card bg-base-100 md:col-span-2">
        <BestSellingChart />
      </div>
    </div>
  </div>
</template>
