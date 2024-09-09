const express = require("express");
const userSchema = require("../models/user");

const router = express.Router();

// Crear múltiples patinadores
router.post("/users", async (req, res) => {
  try {
    const users = req.body;

    const results = await Promise.all(users.map(async (user) => {
      const existingUser = await userSchema.findOne({ number_ID: user.number_ID });
      if (existingUser) {
        
        existingUser.estado = 'Afiliado';
        await existingUser.save();
        return existingUser;
      } else {
        
        const newUser = new userSchema({ ...user, estado: 'Nuevo' });
        return await newUser.save();
      }
    }));

    res.json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
  
// obtener todos los patinadores
router.get("/users", (req, res) => {
  userSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// obtener patinador por ID
router.get("/users/:number_ID", (req, res) => {
  const { number_ID } = req.params;
  userSchema
    .findOne({ number_ID: parseInt(number_ID) })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// eliminar patinador
router.delete('/users/:number_ID', (req, res) => {
  const { number_ID } = req.params;
  userSchema
    .deleteOne({ number_ID: parseInt(number_ID) })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// actualizar patinador
router.put("/users/:number_ID", (req, res) => {
  const { number_ID } = req.params;
  const { first_name, second_name, first_surname, second_surname, birth_date, branch } = req.body;

  userSchema
    .updateOne(
      { number_ID: parseInt(number_ID) },  // Buscar por number_ID en lugar de _id
      { $set: { first_name, second_name, first_surname, second_surname, birth_date, branch } },  // Excluir "estado"
      { new: true }  // Esto asegura que obtienes el documento actualizado si es necesario
    )
    .then((data) => {
      if (data.nModified > 0) {
        res.json({ message: 'Usuario actualizado exitosamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado o sin cambios' });
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});


module.exports = router;
