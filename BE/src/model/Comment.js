const mongoose = require('mongoose');

const commentSubSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comm: {
    type: String,
    required: true,
  },
  vote: {
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 },
  },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  comments: [commentSubSchema]
});

module.exports = mongoose.model('Comment', commentSchema);
