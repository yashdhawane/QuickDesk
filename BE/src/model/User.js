const mongoose = require('mongoose');
const { Role, Language } = require('../model/enums/enum');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: Object.values(Role),default: Role.USER,
    required: true,
  },
  name:{
    type: String,
    required: true,
  }
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
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/** 🔐 Static method to compare passwords */
userSchema.statics.comparePassword = async function (plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = mongoose.model('User', userSchema);
