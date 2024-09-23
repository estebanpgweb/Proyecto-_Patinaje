const express = require('express');
const router = express.Router();
const Secretario = require('../models/usuarios.js');
const bcrypt = require('bcryptjs');
const usuarios = require('../models/usuarios.js');

/**
 * @swagger
 * /entrenador/register:
 *   post:
 *     summary: Registrar un nuevo entrenador
 *     tags:
 *       - Entrenador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre único del entrenador
 *                 example: Juan
 *               email:
 *                 type: string
 *                 description: Correo electrónico del entrenador
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 description: Contraseña del entrenador
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Entrenador registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: entrenador registrado exitosamente
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Juan
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *                     password:
 *                       type: string
 *                       description: Contraseña encriptada del usuario
 *                       example: $2a$10$wxyz... (contraseña encriptada)
 *       400:
 *         description: Faltan campos o el usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El usuario ya existe
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al registrar el usuario
 */

// registrar un entrenador
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor llene los campos faltantes' });
  }
  try {
    const existingUser = await usuarios.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya se encuentra registrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new usuarios({
      name,
      email,
      password: hashedPassword, 
    });

    await newUser.save();

    res.status(201).json({ message: 'Entrenador registrado exitosamente', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});


/**
 * @swagger
 * /entrenador/login:
 *   post:
 *     summary: Iniciar sesión de un entrenador
 *     tags:
 *       - Entrenador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI... (JWT token)
 *       400:
 *         description: Usuario no existe o contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña incorrecta
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error en el servidor
 */

//  login de entrenador
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor ingrese todos los campos' });
    }
  
    try {
      
      const user = await usuarios.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'El usuario no se encuentra registrado' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }
  
    
      res.json({ message: 'Inicio de sesión exitoso', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });
  
module.exports = router;
