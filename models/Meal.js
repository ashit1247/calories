const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mealsDB", {
  useNewUrlParser: true
})

const mealSchema = new mongoose.Schema({
  date: String,
  mealName: String,
  calories: Number
})

module.exports = mongoose.model('Meal', mealSchema);
