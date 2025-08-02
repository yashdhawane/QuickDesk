const mongoose = require('mongoose');
const { Role, Language } = require('./enums');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  interest: [{
    type: String
  }],
  language: {
    type: String,
    enum: Object.values(Language),
  },
  profilePic: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
