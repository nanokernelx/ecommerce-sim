const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true,
    unique: true
  },
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  inventory: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  }
}, { _id: false });

module.exports = mongoose.model('Product', productSchema);