const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  taxpayerNumber: {
    type: Number,
    required: true
  }, 
  isAdmin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    required: true,
    default: 'active'
  },
}, {
    timestamps: true,
});


const userModel = mongoose.model("users", userSchema);

module.exports = userModel;