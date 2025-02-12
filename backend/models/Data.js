const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  name: String,
  value: Number,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Data", DataSchema);
