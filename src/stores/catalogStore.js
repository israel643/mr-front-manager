import { defineStore } from "pinia";
import { ref } from "vue";
import { Brand } from "@/models/Brand";
import { Measurement } from "@/models/Measurement";
import { Category } from "@/models/Category";
import api from "@/services/api";

export const useCatalogStore = defineStore("catalog", () => {
    const categories = ref([]);
    const brands = ref([]);
    const measurements = ref([]);
    const loaded = ref(false);

    async function loadCatalogs() {
        if (loaded.value) return;

        const [categoriesResponse, brandResponse, measurementsResponse] = await Promise.all([
            api.get("/category/active"),
            api.get("/brand/active"),
            api.get("/measurement/active"),
        ]);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        categories.value = categoriesResponse.data.map((c) => new Category(c));
        brands.value = brandResponse.data.map((b) => new Brand(b));
        measurements.value = measurementsResponse.data.map((m) => new Measurement(m));
        loaded.value = true;
    }

    return {
        categories,
        brands,
        measurements,
        loadCatalogs,
        loaded,
    };
})