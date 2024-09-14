
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const secretarioSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('secretario', secretarioSchema);
