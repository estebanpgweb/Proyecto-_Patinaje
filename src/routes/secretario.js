const express = require('express');
const router = express.Router();
const Secretario = require('../models/secretario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de secretario
router.post('/register', async (req, res) => {
  const { name, password } = req.body;

  try {
    const lockPassword = await bcrypt.hash(password, 10);
    const newSecretario = new Secretario({ name, password: lockPassword });
    await newSecretario.save();

    const token = jwt.sign(
      { id: newSecretario._id, role: 'secretario' }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.EXPIRED_TIME }
    ); 
    res.status(201).json({ token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Nombre de usuario ya existe' });
    }
    res.status(500).json({ message: 'Error en el registro', error });
  }
});

// Login de secretario
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const secretario = await Secretario.findOne({ name });

    if (!secretario) {
      return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, secretario.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: secretario._id, role: 'secretario' }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.EXPIRED_TIME }
    );
    
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el login', error });
  }
});



module.exports = router;
