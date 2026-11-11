<script setup>
import { computed, ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler)

// 🔹 Datos ficticios
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo']
const ventasMensuales = ref({
    Ferretería: [4000, 4200, 3900, 5000, 5200],
    Electricidad: [2500, 2700, 3000, 3100, 2800],
    Pintura: [1500, 1600, 1700, 1800, 1900],
})

const chartData = computed(() => ({
    labels: meses,
    datasets: [
        {
            label: 'Ferretería',
            data: ventasMensuales.value.Ferretería,
            fill: true,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.2)',
            tension: 0.4
        },
        {
            label: 'Electricidad',
            data: ventasMensuales.value.Electricidad,
            fill: true,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.2)',
            tension: 0.4
        },
        {
            label: 'Pintura',
            data: ventasMensuales.value.Pintura,
            fill: true,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.2)',
            tension: 0.4
        }
    ]
}))

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'top' },
        title: { display: false }
    },
    scales: {
        y: { stacked: true, beginAtZero: true },
        x: { stacked: true }
    }
}
</script>

<template>
    <!-- Ver cómo han cambiado las ventas entre categorías mes a mes. -->
    <div class="bg-base-100 p-4 rounded shadow">
        <h3 class="text-xl font-bold mb-2">Ventas por Categoría (Mensual)</h3>
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>