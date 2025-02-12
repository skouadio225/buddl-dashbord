const express = require("express");
const router = express.Router();
const Data = require("../models/Data");

// Route GET pour récupérer toutes les données
router.get("/data", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route POST pour ajouter une nouvelle donnée
router.post("/data", async (req, res) => {
  try {
    const newData = new Data(req.body);
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
