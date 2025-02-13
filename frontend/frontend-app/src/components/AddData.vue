<script setup>
import { ref, defineEmits } from "vue";
import axios from "axios";

const emit = defineEmits(["dataAdded"]);

const newData = ref({
  name: "",
  value: "",
  category: ""
});

const message = ref("");

const addData = async () => {
  try {
    await axios.post("http://localhost:5000/api/data", newData.value);
    message.value = "Donnée ajoutée avec succès ! 🎉";

    // Réinitialiser le formulaire
    newData.value = { name: "", value: "", category: "" };

    // Émettre un événement pour informer App.vue de mettre à jour le graphique
    emit("dataAdded");
  } catch (error) {
    message.value = "Erreur lors de l'ajout des données ❌";
    console.error("Erreur :", error);
  }
};
</script>

<template>
    <div class="form-container">
      <h2>Ajouter une nouvelle donnée</h2>
      <input v-model="newData.name" name="name" id="name" placeholder="Nom" required autocomplete="off" />
      <input v-model="newData.value" name="value" id="value" type="number" placeholder="Valeur" required autocomplete="off" />
      <input v-model="newData.category" name="category" id="category" placeholder="Catégorie" required autocomplete="off" />
      <button @click="addData">Ajouter</button>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  

<style scoped>
.form-container {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;
}

input {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  padding: 10px 15px;
  background: #42A5F5;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 3px;
}

button:hover {
  background: #1E88E5;
}
</style>
