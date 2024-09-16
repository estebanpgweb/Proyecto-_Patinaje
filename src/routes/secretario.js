const express = require('express');
const router = express.Router();
const Secretario = require('../models/secretario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de secretario
/**
 * @swagger
 * components:
 *   schemas:
 *     Secretario:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre único del secretario
 *         password:
 *           type: string
 *           description: Contraseña del secretario
 *       required:
 *         - name
 *         - password
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo secretario
 *     tags: [Secretarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del secretario
 *               password:
 *                 type: string
 *                 description: Contraseña del secretario
 *             required:
 *               - name
 *               - password
 *     responses:
 *       201:
 *         description: Secretario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *       400:
 *         description: Error al registrar el secretario
 *       500:
 *         description: Error en el servidor
 */
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión como secretario
 *     tags: [Secretario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del secretario
 *               password:
 *                 type: string
 *                 description: Contraseña del secretario
 *             required:
 *               - name
 *               - password
 *     responses:
 *       200:
 *         description: Login exitoso y token JWT devuelto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT generado para el secretario
 *       401:
 *         description: Nombre de usuario o contraseña incorrectos.
 *       500:
 *         description: Error en el proceso de login.
 */

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
