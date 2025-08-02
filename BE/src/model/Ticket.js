const mongoose = require('mongoose');
const { Status } = require('./enums/enum');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  tag: [String],
  assignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attachment: String,
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.OPEN,
  },
  vote: {
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 },
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
