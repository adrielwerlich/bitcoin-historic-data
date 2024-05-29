<script setup>
import { defineProps, defineEmits } from 'vue';

const { showPriceAtMoment, bitcoinData, timestamp } = defineProps(['showPriceAtMoment', 'bitcoinData', 'timestamp']);

const emit = defineEmits(['hideModal']);

</script>

<template>
   <div v-if="showPriceAtMoment" class="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
      <div class="w-1/2 p-4 bg-white rounded">
        <h2 class="text-2xl font-bold">Bitcoin Price at {{ new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(timestamp)) }}</h2>
        <p class="mt-2">Price: {{ bitcoinData.current_price }} USD</p>
        <p class="mt-2">Market Cap: {{ bitcoinData.market_cap }} USD</p>
        <p class="mt-2">Total Volume: {{ bitcoinData.total_volume }} USD</p>
        <button @click="emit('hideModal')" class="mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700">Close</button>
      </div>
    </div>
</template>