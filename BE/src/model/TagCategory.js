const mongoose = require('mongoose');

const tagCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('TagCategory', tagCategorySchema);
