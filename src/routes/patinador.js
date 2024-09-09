const express = require("express");
const patinadorSchema = require("../models/patinador");

const router = express.Router();

// Crear múltiples patinadores
router.post("/patinadores", async (req, res) => {
  try {
    const patinadores = req.body;

    const results = await Promise.all(
      patinadores.map(async (patinador) => {
        const existingPatinador = await patinadorSchema.findOne({
          number_ID: patinador.number_ID,
        });
        if (existingPatinador) {
          existingPatinador.estado = "Afiliado";
          await existingPatinador.save();
          return existingPatinador;
        } else {
          const newPatinador = new patinadorSchema({
            ...patinador,
            estado: "Nuevo",
          });
          return await newPatinador.save();
        }
      })
    );

    res.json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// obtener todos los patinadores
router.get("/patinadores", (req, res) => {
  patinadorSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// obtener patinador por ID
router.get("/patinadores/:number_ID", (req, res) => {
  const { number_ID } = req.params;
  patinadorSchema
    .findOne({ number_ID: parseInt(number_ID) })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// eliminar patinador
router.delete("/patinadores/:number_ID", (req, res) => {
  const { number_ID } = req.params;
  patinadorSchema
    .deleteOne({ number_ID: parseInt(number_ID) })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// actualizar patinador
router.put("/patinadores/:number_ID", (req, res) => {
  const { number_ID } = req.params;
  const {
    first_name,
    second_name,
    first_surname,
    second_surname,
    birth_date,
    branch,
  } = req.body;

  patinadorSchema
    .updateOne(
      { number_ID: parseInt(number_ID) }, // Buscar por number_ID en lugar de _id
      {
        $set: {
          first_name,
          second_name,
          first_surname,
          second_surname,
          birth_date,
          branch,
        },
      }, // Excluir "estado"
      { new: true } // Esto asegura que obtienes el documento actualizado si es necesario
    )
    .then((data) => {
      if (data.nModified > 0) {
        res.json({ message: "patinador actualizado exitosamente" });
      } else {
        console.log(data);
        res
          .status(404)
          .json({ message: `patinador no encontrado o sin cambios ${data}` });
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports = router;
