<script setup>
import { computed, ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

// 🔹 Datos ficticios
const categorias = ref([
    { nombre: 'Ferretería', cantidad: 1500 },
    { nombre: 'Electricidad', cantidad: 800 },
    { nombre: 'Pintura', cantidad: 600 },
    { nombre: 'Plomería', cantidad: 400 },
    { nombre: 'Herramientas', cantidad: 700 },
])

const chartData = computed(() => ({
    labels: categorias.value.map(c => c.nombre),
    datasets: [
        {
            label: 'Cantidad en Inventario',
            backgroundColor: ['#60a5fa', '#34d399', '#fcd34d', '#f87171', '#a78bfa'],
            data: categorias.value.map(c => c.cantidad),
        }
    ]
}))

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true },
    }
}
</script>

<template>
    <!-- Mostrar qué porcentaje del inventario pertenece a cada categoría. -->
    <div class="bg-base-100 p-4 rounded shadow">
        <h3 class="text-xl font-bold mb-2">Inventario por Categoría</h3>
        <Doughnut :data="chartData" :options="chartOptions" />
    </div>
</template>
