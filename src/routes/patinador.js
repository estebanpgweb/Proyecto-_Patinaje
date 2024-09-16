const express = require("express");
const patinadorSchema = require("../models/patinador");

const router = express.Router();

// Crear múltiples patinadores

/**
 * @swagger
 * components:
 *  schemas:
 *    Patinador:
 *      type: object
 *      properties:
 *        number_ID:
 *          type: number
 *          description: Número de identificación del patinador
 *        first_name:
 *          type: string
 *          description: Nombre del patinador
 *        second_name:
 *          type: string
 *          description: Segundo nombre del patinador
 *        first_surname:
 *          type: string
 *          description: Primer apellido del patinador
 *        second_surname:
 *          type: string
 *          description: Segundo apellido del patinador
 *        birth_date:
 *          type: string
 *          description: Fecha de nacimiento en formato dd/mm/aaaa
 *        branch:
 *          type: string
 *          enum: [Femenino, Masculino]
 *          description: Rama del patinador
 *        estado:
 *          type: string
 *          enum: [Afiliado, Nuevo]
 *          description: Estado del patinador
 *        categoria:
 *          type: string
 *          description: Categoría del patinador
 *      required:
 *        - number_ID
 *        - first_name
 *        - first_surname
 *        - birth_date
 *        - branch
 *        - estado
 */


/**
 * @swagger
 * /api/patinadores:
 *  post:
 *    summary: Crear múltiples patinadores
 *    tags: [Patinador]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Patinador'
 *    responses:
 *      200:
 *        description: Listado de patinadores creados exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Patinador'
 */
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


/**
 * @swagger
 * /api/patinadores:
 *  get:
 *    summary: Obtener todos los patinadores
 *    tags: [Patinador]
 *    responses:
 *      200:
 *        description: Lista de patinadores
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Patinador'
 */


// obtener todos los patinadores
router.get("/patinadores", (req, res) => {
  patinadorSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// obtener patinador por ID

/**
 * @swagger
 * /api/patinadores/{number_ID}:
 *  get:
 *    summary: Obtener patinador por número de identificación
 *    tags: [Patinador]
 *    parameters:
 *      - in: path
 *        name: number_ID
 *        schema:
 *          type: number
 *        required: true
 *        description: Número de identificación del patinador
 *    responses:
 *      200:
 *        description: Patinador encontrado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Patinador'
 *      404:
 *        description: Patinador no encontrado
 */
router.get("/patinadores/:number_ID", (req, res) => {
  const { number_ID } = req.params;
  patinadorSchema
    .findOne({ number_ID: parseInt(number_ID) })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// eliminar patinador
/**
 * @swagger
 * /api/patinadores/{number_ID}:
 *  delete:
 *    summary: Eliminar un patinador por número de identificación
 *    tags: [Patinador]
 *    parameters:
 *      - in: path
 *        name: number_ID
 *        schema:
 *          type: number
 *        required: true
 *        description: Número de identificación del patinador
 *    responses:
 *      200:
 *        description: Patinador eliminado
 *      404:
 *        description: Patinador no encontrado
 */
router.delete("/patinadores/:number_ID", (req, res) => {
  const { number_ID } = req.params;
  patinadorSchema
    .deleteOne({ number_ID: parseInt(number_ID) })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// actualizar patinador


/**
 * @swagger
 * /api/patinadores/{number_ID}:
 *  put:
 *    summary: Actualizar un patinador
 *    tags: [Patinador]
 *    parameters:
 *      - in: path
 *        name: number_ID
 *        schema:
 *          type: number
 *        required: true
 *        description: Número de identificación del patinador
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Patinador'
 *    responses:
 *      200:
 *        description: Patinador actualizado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Patinador'
 *      404:
 *        description: Patinador no encontrado
 */
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

  // Buscar y actualizar el documento
  patinadorSchema
    .findOneAndUpdate(
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
      },
      { new: true, runValidators: true } // Obtener el documento actualizado y validar el esquema
    )
    .then((data) => {
      if (data) {
        res.json({ message: "patinador actualizado exitosamente", data });
      } else {
        res.status(404).json({ message: `Patinador no encontrado` });
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});
module.exports = router;
