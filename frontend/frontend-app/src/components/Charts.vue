<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { Bar } from "vue-chartjs";

// Enregistrement des modules Chart.js
Chart.register(...registerables);

const allData = ref([]); // Stocke toutes les données récupérées
const selectedCategory = ref(""); // Stocke la catégorie sélectionnée

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Valeurs",
      backgroundColor: "#42A5F5",
      data: []
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
    easing: "easeInOutQuart"
  },
  plugins: {
    legend: { display: true, position: "top" },
    tooltip: { enabled: true }
  }
});


const loading = ref(false);
const error = ref("");

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await axios.get("http://localhost:5000/api/data");
    let validData = response.data.filter(item => item.name && item.value && item.category);

    // 🔥 Normaliser les catégories (Majuscule au début pour éviter les erreurs)
    validData = validData.map(item => ({
      ...item,
      category: item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase()
    }));

    allData.value = validData;
    updateChart();
  } catch (err) {
    error.value = "❌ Erreur lors de la récupération des données";
    console.error("Erreur API :", err);
  } finally {
    loading.value = false;
  }
};


// Fonction pour filtrer les données en fonction de la catégorie sélectionnée
const updateChart = () => {
  const filteredData = selectedCategory.value
    ? allData.value.filter(item => item.category === selectedCategory.value)
    : allData.value;

  chartData.value.labels = filteredData.map(item => item.name);
  chartData.value.datasets[0].data = filteredData.map(item => item.value);
};

// Liste des catégories disponibles
const categories = computed(() => [...new Set(allData.value.map(item => item.category))]);


onMounted(fetchData);
</script>

<template>
  <div class="chart-container">
    <h2>📊 Graphique des données</h2>

    <div class="controls">
      <label for="category">Filtrer par catégorie :</label>
      <select v-model="selectedCategory" @change="updateChart">
        <option value="">Toutes</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      <button @click="fetchData" :disabled="loading">
        {{ loading ? "🔄 Chargement..." : "🔄 Actualiser" }}
      </button>
    </div>

    <p v-if="loading" class="info">⏳ Chargement des données...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!loading && !error">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 80%;
  max-width: 650px;
  margin: auto;
  padding: 20px;
  background: #ffffff;
  border: 2px solid #ddd;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
}

button {
  background: #42A5F5;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}

button:hover {
  background: #1E88E5;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.info, .error {
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
}

.error {
  color: red;
}
</style>
