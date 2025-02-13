<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { Pie } from "vue-chartjs";

Chart.register(...registerables);

const props = defineProps(["selectedCategory"]);
const allData = ref([]);
const loading = ref(false); // ✅ Correction de loading
const error = ref(""); // ✅ Correction de error

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Répartition des catégories",
      backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#EC407A", "#AB47BC"],
      data: []
    }
  ]
});

const chartOptions = ref({ // ✅ Correction de chartOptions
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: "top" },
    tooltip: { enabled: true }
  }
});

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await axios.get("http://localhost:5000/api/data");
    console.log("📡 Données API reçues (PieChart) :", response.data);

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

    console.log("📊 Données filtrées (PieChart) :", filteredData);

    // Regrouper les valeurs par catégorie
    const categoryCounts = {};
    filteredData.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + item.value;
    });

    chartData.value.labels = Object.keys(categoryCounts);
    chartData.value.datasets[0].data = Object.values(categoryCounts);
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
    <h2>🥧 Répartition des catégories</h2>

    <button @click="fetchData" :disabled="loading">
      {{ loading ? "🔄 Chargement..." : "🔄 Actualiser" }}
    </button>

    <p v-if="loading" class="info">⏳ Chargement...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!loading && !error">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
