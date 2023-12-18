const mongoose = require('mongoose');

const prodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
   type: String
  },
  img: {
    type: String
   },
  
});

// Create a model using the schema
const Prod = mongoose.model('prod', prodSchema);

module.exports = Prod;
