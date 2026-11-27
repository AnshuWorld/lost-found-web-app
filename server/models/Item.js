const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    postedBy: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
