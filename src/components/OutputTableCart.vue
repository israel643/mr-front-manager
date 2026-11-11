<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { IconX, IconMinus, IconPlus } from '@tabler/icons-vue'
import { useOutputStore } from '@/stores/outputStore';

const emit = defineEmits(['openConfirm']);
const store = useOutputStore();
const { cart } = storeToRefs(store);

// Disminuir
const minusCartItem = (id) => {
    const item = cart.value.find((a) => a.articleId === id);
    if (item) {
        item.quantity--;
        item.subtotal = item.quantity * item.price;
    }
}

// Aumentar
const plusCartItem = (id) => {
    const item = cart.value.find((a) => a.articleId == id)
    if (item) {
        item.quantity++;
        item.subtotal = item.quantity * item.price;
    }
}

// Remover del carrito
const removeCartItem = (id) => {
    cart.value = cart.value.filter((a) => a.articleId !== id);
};

// Calcular el total
const totalPrice = computed(() => {
    const sumatory = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return sumatory.toFixed(2);
});
</script>

<template>
    <div class="overflow-x-auto w-full">
        <table class="table table-md table-zebra w-full">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cart" :key="item.id">
                    <td class="min-w-[15rem] md:min-w-[10rem] max-w-[16rem]">
                        <p class="font-semibold">{{ item.name }}</p>
                        <p>{{ item.description }}</p>
                    </td>
                    <td>
                        <div class="join">
                            <button class="join-item btn btn-soft btn-square btn-sm"
                                @click="minusCartItem(item.articleId)" :disabled="item.quantity == 1">
                                <IconMinus class="w-4 h-4 opacity-80" />
                            </button>
                            <div class="join-item btn btn-sm">{{ item.quantity }}</div>
                            <button class="join-item btn btn-soft btn-square btn-sm"
                                @click="plusCartItem(item.articleId)">
                                <IconPlus class="w-4 h-4 opacity-80" />
                            </button>
                        </div>
                    </td>
                    <td>
                        <p>${{ item.price }}</p>
                    </td>
                    <td>
                        <p>${{ (item.quantity * item.price).toFixed(2) }}</p>
                    </td>
                    <td>
                        <button class="btn btn-soft btn-square btn-sm btn-error"
                            @click="removeCartItem(item.articleId)">
                            <IconX class="w-4 h-4 opacity-80" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="divider"></div>
    <button v-show="cart.length > 0" class="flex justify-between items-center w-full btn btn-secondary p-8"
        @click="$emit('openConfirm')">
        <div>
            <p class="text-lg">{{ cart.length }} {{ cart.length === 1 ? 'artículo' : 'artículos' }} por pagar</p>
        </div>
        <div>
            <p class="font-bold text-2xl">${{ totalPrice }}</p>
        </div>
    </button>
</template>