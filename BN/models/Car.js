const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  priceNum: { type: Number, required: true },
  engine: { type: String, required: true },
  horsepower: { type: Number, required: true },
  topSpeed: { type: String, required: true },
  acceleration: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Car', carSchema);
