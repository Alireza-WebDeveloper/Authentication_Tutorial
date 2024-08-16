// !! Packages
const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');

// User Model Schema
const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      trim: true,
      // maxlength: 50,
    },
    username: {
      type: String,
      required: [true, 'Username is required!'],
      unique: true,
      trim: true,
      // minlength: 3,
      // maxlength: 20,
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      // minlength: 8,
    },
  },
  {
    collection: 'Users',
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
