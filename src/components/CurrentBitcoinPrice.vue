<script setup>
import { ref, onMounted } from "vue";

const currentPrice = ref(0);

const fetchCurrentPrice = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_cg_demo_api_key=CG-FE1QgAQty3ZF89P1VdhEFPPT"
  );
  const data = await response.json();
  currentPrice.value = data.bitcoin.usd;
};

onMounted(() => {
  fetchCurrentPrice();
  setInterval(fetchCurrentPrice, 10000); // Fetch the price every 10 seconds
});
</script>

<template>
  <div id="price" class="text-2xl font-semibold text-center text-blue-600 my-4">
  Current Bitcoin Price: ${{ currentPrice }}
</div>
</template>

<style scoped></style>
