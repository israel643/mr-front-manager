<script setup>
import { computed } from 'vue';
import { useSoldWeekStore } from '@/stores/soldWeekStore';
import { storeToRefs } from 'pinia';
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);
const store = useSoldWeekStore();
const { soldWeekList } = storeToRefs(store);

const chartData = computed(() => ({
    labels: soldWeekList.value.map(s => s.intervalWeek),
    datasets: [
        {
            label: 'Ventas por semana (MXN)',
            backgroundColor: 'rgba(59,130,246,0.2)',
            borderColor: '#3b82f6',
            tension: 0.4,
            fill: true,
            data: soldWeekList.value.map(s => s.totalSold),
        }
    ]
}))

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'top' },
        title: { display: false },
        tooltip: { enabled: true },
    },
    scales: {
        y: { beginAtZero: true }
    }
}
</script>

<template>
    <!-- Mostrar cómo evolucionan las ventas a lo largo del tiempo. -->
    <div class="bg-base-100 p-4 rounded shadow">
        <h3 class="text-xl font-bold mb-2">Ventas Semanales</h3>
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>
