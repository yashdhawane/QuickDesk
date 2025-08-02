const mongoose = require('mongoose');
const { Role } = require('../model/enums/enum');

const roleRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedRole: {
    type: String,
    enum: Role, // or your role enums
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('RoleRequest', roleRequestSchema);
