<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { Line } from "vue-chartjs";

Chart.register(...registerables);

const props = defineProps(["selectedCategory"]);
const allData = ref([]);
const loading = ref(false); // ✅ Correction de loading
const error = ref(""); // ✅ Correction de error

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Évolution des valeurs",
      borderColor: "#42A5F5",
      backgroundColor: "rgba(66, 165, 245, 0.2)",
      data: [],
      fill: true,
      tension: 0.3
    }
  ]
});

const chartOptions = ref({ // ✅ Correction de chartOptions
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: "top" },
    tooltip: { enabled: true }
  },
  scales: {
    y: { beginAtZero: true }
  }
});

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await axios.get("http://localhost:5000/api/data");
    console.log("📡 Données API reçues (LineChart) :", response.data);

    let validData = response.data.filter(item => item.name && item.value && item.category);

    // 🔥 Normalisation des catégories
    validData = validData.map(item => ({
      ...item,
      category: item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase()
    }));

    allData.value = validData;

    // Filtrage selon la catégorie sélectionnée
    const filteredData = props.selectedCategory
      ? allData.value.filter(item => item.category === props.selectedCategory)
      : allData.value;

    console.log("📊 Données filtrées (LineChart) :", filteredData);

    chartData.value.labels = filteredData.map(item => item.name);
    chartData.value.datasets[0].data = filteredData.map(item => item.value);
  } catch (err) {
    error.value = "❌ Erreur lors de la récupération des données";
    console.error("Erreur API :", err);
  } finally {
    loading.value = false;
  }
};

// 🔄 Mettre à jour lorsque la catégorie change
watch(() => props.selectedCategory, fetchData);
onMounted(fetchData);
</script>

<template>
  <div class="chart-container">
    <h2>📈 Évolution des valeurs</h2>

    <button @click="fetchData" :disabled="loading">
      {{ loading ? "🔄 Chargement..." : "🔄 Actualiser" }}
    </button>

    <p v-if="loading" class="info">⏳ Chargement...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!loading && !error">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
