const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
  },
  body: {
    type: String,
    required: [true, "Can't leave it blank"],
  },
}, { timestamps: true });
const model = new mongoose.Model('log', Schema);
module.exports = model;
