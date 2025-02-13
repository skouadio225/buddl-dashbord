<script setup>
import { ref } from "vue";
import Charts from "./components/Charts.vue";
import LineChart from "./components/LineChart.vue";
import PieChart from "./components/PieChart.vue";
import AddData from "./components/AddData.vue";

const selectedCategory = ref("");
const isDarkMode = ref(false);

// Mise à jour du filtre
const updateCategory = (newCategory) => {
  selectedCategory.value = newCategory;
};

// Basculer le mode sombre
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle("dark-mode", isDarkMode.value);
};
</script>

<template>
  <div id="app">
    <img src="./assets/buddl.jpeg" alt="Buddl Logo" class="logo" />
    
    <h1>📊 Buddl Dashbord </h1>

    <button @click="toggleDarkMode">
      {{ isDarkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre" }}
    </button>

    <div class="filter-container">
      <label for="category">Filtrer par catégorie :</label>
      <select @change="updateCategory($event.target.value)">
        <option value="">Toutes</option>
        <option v-for="category in ['Ventes', 'Marketing', 'Téléphone']" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <AddData />
    <Charts :selectedCategory="selectedCategory" />
    <LineChart :selectedCategory="selectedCategory" />
    <PieChart :selectedCategory="selectedCategory" />
  </div>
</template>

<style>
/* Mode sombre */
.dark-mode {
  background-color: #121212;
  color: white;
}

/* Style général */
#app {
  text-align: center;
  padding: 20px;
}

.logo {
  width: 120px;
  margin-bottom: 10px;
}

button {
  background: #0066FF;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
}

.filter-container {
  margin-bottom: 20px;
}
</style>
