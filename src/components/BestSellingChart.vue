<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs'
import { useBestSellingStore } from '@/stores/bestSellingStore';
import { storeToRefs } from 'pinia';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const store = useBestSellingStore();
const { bestSellingList } = storeToRefs(store);

const chartData = computed(() => ({
    labels: bestSellingList.value.map(it => it.name),
    datasets: [
        {
            label: 'Unidades Vendidas',
            borderColor: 'red',
            backgroundColor: 'rgba(59,130,246,0.4)',
            data: bestSellingList.value.map(it => it.amountSold),
        }
    ]
}))

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        title: { display: false }
    }
}
</script>

<template>
    <div class="bg-base-100 p-4 rounded shadow">
        <h3 class="text-xl font-bold mb-2">Top 10 Productos más Vendidos</h3>
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>