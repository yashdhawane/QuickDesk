const mongoose = require('mongoose');

const tagCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  }
});

module.exports = mongoose.model('TagCategory', tagCategorySchema);
