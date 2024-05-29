<script setup>
import CurrentBitcoinPrice from "./components/CurrentBitcoinPrice.vue";
import PriceAtMomentCard from "./components/PriceAtMomentCard.vue";
import * as d3 from "d3";
import { ref, watch, onMounted, onUnmounted, reactive } from "vue";

import "@vueform/slider/themes/default.css";
import VueSlider from "@vueform/slider";
import { fetchData, fetchBitcoinPriceAtMoment } from "./api/fetch.js";

const width = ref(window.innerWidth * 0.95);
let resizeListener, formattedData;

const svgRef = ref(null);
const days = ref(1);
const marks = ref({
  // "-1": "All Time", // only paid API subscription allows all time data
  1: "1 Day",
  365: "365 Days",
});
const isLoading = ref(false);
const selectedDateTime = ref(null);
const selectedCoin = ref("bitcoin");
const showPriceAtMoment = ref(false);
const bitcoinData = reactive({
  current_price: 0,
  market_cap: 0,
  total_volume: 0,
});

const drawGraph = (formattedData) => {
  d3.select(svgRef.value)?.selectAll("g")?.remove();

  const svg = d3.select(svgRef.value);
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const graphWidth = width.value - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;
  const g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3.scaleTime().rangeRound([0, graphWidth]);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  // Downsample the data based on the screen width
  const downsampleFactor = Math.ceil(formattedData.length / graphWidth);
  const downsampledData = formattedData.filter(
    (_, i) => i % downsampleFactor === 0
  );

  x.domain(d3.extent(downsampledData, (d) => d.date));
  y.domain(d3.extent(formattedData, (d) => d.value));

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(0)")
    .attr("y", -15)
    .attr("dy", "0.9em")
    .attr("text-anchor", "middle")
    .text("Price ($)");

  g.append("path")
    .datum(downsampledData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
};

const fetchAndUpdateData = async () => {
  isLoading.value = true;
  try {
    const data = await fetchData(selectedCoin.value, days.value);
    formattedData = data.map(([timestamp, price]) => ({
      date: new Date(timestamp),
      value: price,
    }));

    drawGraph(formattedData);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

async function fetchAndShowPriceAtMoment() {
  const isValidDate = !isNaN(Date.parse(selectedDateTime.value));

  if (!isValidDate) {
    alert("Please select a valid date and time");
    return;
  }

  isLoading.value = true;

  try {
    const result = await fetchBitcoinPriceAtMoment(selectedDateTime.value);

    if (result?.market_data?.current_price.usd) {
      bitcoinData.current_price = parseFloat(
        result.market_data.current_price.usd
      ).toFixed(2);
      bitcoinData.market_cap = parseFloat(
        result.market_data.market_cap.usd
      ).toFixed(2);
      bitcoinData.total_volume = parseFloat(
        result.market_data.total_volume.usd
      ).toFixed(2);
      showPriceAtMoment.value = true;
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
}

watch(days, fetchAndUpdateData, { immediate: true });

watch(selectedCoin, (newCoin, oldCoin) => {
  if (oldCoin !== newCoin) {
    fetchAndUpdateData();
  }
});

onMounted(() => {
  fetchAndUpdateData();

  resizeListener = () => {
    width.value = window.innerWidth * 0.95;
    drawGraph(formattedData);
  };
  window.addEventListener("resize", resizeListener);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeListener);
});

</script>

<template>
  <div>
    <div class="w-4/5 mx-auto mt-20 mb-10">
      
      <PriceAtMomentCard
        :showPriceAtMoment="showPriceAtMoment"
        :bitcoinData="bitcoinData"
        :timestamp="selectedDateTime"
        @hideModal="showPriceAtMoment = false"
      />

      <label for="datetime" class="block text-sm font-medium text-gray-700"
        >Select a date and time:</label
      >
      <input
        id="datetime"
        type="datetime-local"
        v-model="selectedDateTime"
        class="block w-full px-3 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />

      <button
        @click="fetchAndShowPriceAtMoment"
        class="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Fetch Bitcoin Price
      </button>
      <div class="flex flex-col items-start mb-4">
        <label for="coin-select" class="mb-2 text-lg font-bold text-gray-700"
          >Choose a coin:</label
        >
        <select
          id="coin-select"
          v-model="selectedCoin"
          class="w-full px-3 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="bitcoin">Bitcoin</option>
          <option value="dacxi">DACXI</option>
          <option value="ethereum">Ethereum</option>
          <option value="cosmos">Cosmos</option>
        </select>
      </div>

      <template v-if="!showPriceAtMoment">
        <p class="text-center text-lg font-medium mb-8">
          Use the slider to select a range between 1 day and 1 year
        </p>
        <VueSlider v-model="days" :min="1" :max="365" :marks="marks"></VueSlider>
      </template>
    </div>
    <div
      v-show="isLoading"
      class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 fixed top-1/2 left-[42%] sm:left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    ></div>
    <div v-show="!isLoading">
      <CurrentBitcoinPrice />
      <div class="flex flex-col justify-center">
        <h1 class="flex justify-center capitalize">Historic data of selected coin: {{ selectedCoin }}</h1>
        <svg :width="width" height="500" ref="svgRef"></svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader {
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}
</style>
