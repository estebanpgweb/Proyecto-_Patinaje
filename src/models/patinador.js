
const mongoose = require("mongoose");
const patinadorSchema = mongoose.Schema({

  numero_competencia: {
    type: Number,
    requiered: false,
  },
    number_ID: {
    type: Number,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  second_name: {
    type: String,
    required: false,
  },
  first_surname: {
    type: String,
    required: true,
  },
  second_surname: {
    type: String,
    required: false,
  },
  birth_date: {
    type: String, 
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
      },
      message: props => `${props.value} no es un formato de fecha válido! Debe ser dd/mm/aa.`
    }
  },
  branch: {
    type: String,
    required: true,
    enum: ['Femenino', 'Masculino'] 
  },
  estado: {
    type: String,
    required: true,
    enum: ['Afiliado', 'Nuevo']
  },
  categoria: {
    type: String,
    required: false,
  },
  
});



module.exports = mongoose.model('Patinadores', patinadorSchema);
