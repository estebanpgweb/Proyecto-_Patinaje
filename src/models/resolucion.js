
const mongoose = require("mongoose");
const resolucionSchema = mongoose.Schema({

    name_event:{
    type: String,
    required: true,
},
    date_start: {
    type: String, 
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
      },
      message: props => `${props.value} no es un formato de fecha válido! Debe ser dd/mm/aa.`
    }
}, 
date_end: {
    type: String, 
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
      },
      message: props => `${props.value} no es un formato de fecha válido! Debe ser dd/mm/aa.`
    }
}, 
    place_event:{
        type: String,
        required:true,
},
    value_new_patinador: {
        type: Number,
        required: true,
 },
      value_patinador: {
        type: Number,
        required: true,
},  
    categories_date: {
        type: String, 
        required: true,
        validate: {
        validator: function (v) {
            return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
        },
        message: props => `${props.value} no es un formato de fecha válido! Debe ser dd/mm/aa.`
        }
    }, 
});

module.exports= mongoose.model('Resolucion', resolucionSchema);