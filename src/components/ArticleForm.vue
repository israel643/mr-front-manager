<script setup>
import { reactive, watch, computed, ref, onMounted } from 'vue';
import useVuelidate from '@vuelidate/core';

import { Article } from '@/models/Article';
import { articleRules } from '@/validators/articleRules';
import { getValidationError } from '@/composables/useValidationMessages';
import { useCatalogStore } from '@/stores/catalogStore';
import { storeToRefs } from 'pinia';

import BaseCloseModalButton from '@/components/BaseCloseModalButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseTextarea from '@/components/BaseTextarea.vue';
import BaseFormContainerActions from '@/components/BaseFormContainerActions.vue';

const props = defineProps(['open', 'isEditing', 'initialArticle']);
const emit = defineEmits(['save', 'close']);

const catalogStore = useCatalogStore();
const { categories, brands, measurements, loaded } = storeToRefs(catalogStore);

const baseArticle = new Article();
const article = reactive({ ...baseArticle });
const imageFile = ref(null);

watch(() => props.initialArticle, (newVal) => {
    Object.assign(article, newVal || baseArticle)
}, { immediate: true });

const $v = useVuelidate(articleRules, article);
const isFormValid = computed(() => !$v.value.$invalid);

const nameError = computed(() =>
    getValidationError($v.value.name, {
        required: 'Campo obligatorio'
    })
);

const descriptionError = computed(() =>
    getValidationError($v.value.description, {
        required: 'Campo obligatorio'
    })
);

const categoryError = computed(() =>
    getValidationError($v.value.categoryId, {
        required: 'Campo obligatorio'
    })
);

const brandError = computed(() =>
    getValidationError($v.value.brandId, {
        required: 'Campo obligatorio'
    })
);

const measurementError = computed(() =>
    getValidationError($v.value.measurementId, {
        required: 'Campo obligatorio'
    })
);

const purchaseError = computed(() =>
    getValidationError($v.value.purchasePrice, {
        required: 'Campo obligatorio',
        minValue: 'Defina un valor mayor a 0'
    })
);

const saleError = computed(() =>
    getValidationError($v.value.salePrice, {
        required: 'Campo obligatorio',
        minValue: 'Defina un valor mayor a 0'
    })
);

const stockError = computed(() =>
    getValidationError($v.value.stock, {
        required: 'Campo obligatorio',
        minValue: 'Defina un valor mayor o igual a 0'
    })
);

const handleImage = (e) => {
    imageFile.value = e.target.files[0];
};

function closeForm() {
    $v.value.$reset();
    emit('close')
}

function saveData() {
    $v.value.$touch();
    if (!$v.value.$invalid) {
        const formData = new FormData();
        if (article.id) formData.append('id', article.id);
        formData.append('name', article.name);
        formData.append('description', article.description);
        formData.append('categoryId', article.categoryId);
        formData.append('brandId', article.brandId);
        formData.append('measurementId', article.measurementId);
        formData.append('salePrice', article.salePrice);
        formData.append('purchasePrice', article.purchasePrice);
        formData.append('stock', article.stock);
        formData.append('active', article.active);
        if (imageFile.value) formData.append('image', imageFile.value);
        emit('save', { formData });
        $v.value.$reset();
    }
}

onMounted(() => {
    catalogStore.loadCatalogs();
});
</script>

<template>
    <dialog class="modal" :open="open">
        <div class="modal-box max-w-2xl">
            <h2 class="text-2xl font-bold mb-4">
                {{ `${isEditing ? 'Editar' : 'Agregar'} articulo` }}
            </h2>
            <BaseCloseModalButton @close="closeForm" />

            <!-- Oculto (Id, Status) -->
            <input type="hidden" v-model="article.id" />
            <input type="hidden" v-model="article.active" />

            <!-- Nombre -->
            <BaseInput v-model="article.name" label="Nombre" placeholder="Articulo" :error="nameError"
                @blur="$v.name.$touch()" />

            <!-- Descripcion -->
            <BaseTextarea v-model="article.description" label="Descripción" placeholder="Descripción del artículo"
                :error="descriptionError" @blur="$v.description.$touch()" />

            <!-- Categoria -->
            <BaseSelect v-model="article.categoryId" label="Categoría" :options="categories" :disabled="!loaded"
                placeholder="Selecciona una categoría" :error="categoryError" @blur="$v.categoryId.$touch()" />

            <!-- Marca -->
            <BaseSelect v-model="article.brandId" label="Marca" :options="brands" :disabled="!loaded"
                placeholder="Selecciona una marca" :error="brandError" @blur="$v.brandId.$touch()" />

            <!-- Medida -->
            <BaseSelect v-model="article.measurementId" label="Unidad de medida" :options="measurements"
                :disabled="!loaded" placeholder="Selecciona una medida" :error="measurementError"
                @blur="$v.measurementId.$touch()" />

            <div class="w-full flex flex-col sm:flex-row gap-x-4 gap-y-1">
                <div class="flex-1">
                    <BaseInput v-model="article.salePrice" label="Precio de venta" type="number" :min="0" :step="0.01"
                        placeholder="0.00" :error="saleError" @blur="$v.salePrice.$touch()" />
                </div>
                <div class="flex-1">
                    <BaseInput v-model="article.purchasePrice" label="Costo de compra" type="number" :min="0"
                        :step="0.01" placeholder="0.00" :error="purchaseError" @blur="$v.purchasePrice.$touch()" />
                </div>
                <div class="flex-1">
                    <BaseInput v-model="article.stock" label="Stock" type="number" :min="0" :step="1"
                        placeholder="Cantidad en stock" :error="stockError" @blur="$v.stock.$touch()" />
                </div>
            </div>

            <!-- Image -->
            <input type="file" @change="handleImage" class="file-input file-input-bordered w-full max-w-xs" />

            <!-- Botones -->
            <BaseFormContainerActions @close="closeForm" @save="saveData" :is-editing="isEditing"
                :is-form-valid="isFormValid" />
        </div>
    </dialog>
</template>