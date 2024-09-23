
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Por favor ingrese un correo válido']
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
  },
});

module.exports = mongoose.model('usuario', usuarioSchema);
