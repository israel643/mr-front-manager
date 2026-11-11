<script setup>
import { computed, ref } from 'vue'
import { PolarArea } from 'vue-chartjs'
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

// 🔹 Datos ficticios
const categoriasRentables = ref([
    { nombre: 'Ferretería', rentabilidad: 40000 },
    { nombre: 'Electricidad', rentabilidad: 25000 },
    { nombre: 'Pintura', rentabilidad: 15000 },
    { nombre: 'Plomería', rentabilidad: 10000 },
    { nombre: 'Herramientas', rentabilidad: 30000 },
])

const chartData = computed(() => ({
    labels: categoriasRentables.value.map(c => c.nombre),
    datasets: [
        {
            label: 'Rentabilidad (MXN)',
            backgroundColor: ['#93c5fd', '#86efac', '#fde68a', '#fca5a5', '#c4b5fd'],
            data: categoriasRentables.value.map(c => c.rentabilidad)
        }
    ]
}))

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true }
    }
}
</script>

<template>
    <!-- Visualizar qué categorías generan más ganancia relativa. -->
    <div class="bg-base-100 p-4 rounded shadow">
        <h3 class="text-xl font-bold mb-2">Rentabilidad por Categoría</h3>
        <PolarArea :data="chartData" :options="chartOptions" />
    </div>
</template>
