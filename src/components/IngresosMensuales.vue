<script setup>
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
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

// 🔹 Datos ficticios de prueba
const ingresosMensuales = ref([
    { mes: 'Enero', total: 15500 },
    { mes: 'Febrero', total: 19200 },
    { mes: 'Marzo', total: 18400 },
    { mes: 'Abril', total: 21000 },
    { mes: 'Mayo', total: 16500 },
    { mes: 'Junio', total: 19800 },
])

const chartData = computed(() => ({
    labels: ingresosMensuales.value.map(m => m.mes),
    datasets: [
        {
            label: 'Ingresos ($)',
            backgroundColor: '#34d399',
            data: ingresosMensuales.value.map(m => m.total)
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
        <h3 class="text-xl font-bold mb-2">Ingresos Mensuales (Últimos 6 meses)</h3>
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>
