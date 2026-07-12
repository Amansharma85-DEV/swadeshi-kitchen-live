const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  images: [{ type: String }],
  status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  tag: { type: String } // e.g. 'Popular', 'New'
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
