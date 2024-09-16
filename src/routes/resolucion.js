const express = require('express');
const router = express.Router();
const Resolucion = require('../models/resolucion');
const verifySecretarioRole = require('../verifySecretarioRole');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Resolucion:
 *       type: object
 *       properties:
 *         name_event:
 *           type: string
 *           description: Nombre del evento
 *         date_start:
 *           type: string
 *           description: Fecha de inicio del evento en formato dd/mm/aaaa
 *         date_end:
 *           type: string
 *           description: Fecha de fin del evento en formato dd/mm/aaaa
 *         place_event:
 *           type: string
 *           description: Lugar del evento
 *         value_new_patinador:
 *           type: number
 *           description: Valor para patinadores nuevos
 *         value_patinador:
 *           type: number
 *           description: Valor para patinadores antiguos
 *         categories_date:
 *           type: string
 *           description: Fecha de cálculo de las categorías en formato dd/mm/aaaa
 *       required:
 *         - name_event
 *         - date_start
 *         - date_end
 *         - place_event
 *         - value_new_patinador
 *         - value_patinador
 *         - categories_date
 */


/**
 * @swagger
 * tags:
 *   name: Resoluciones
 *   description: Gestión de resoluciones de eventos
 */



// Crear nueva resolución

/**
 * @swagger
 * /resolucion/resoluciones:
 *   post:
 *     summary: Crear una nueva resolución
 *     tags: [Resoluciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resolucion'
 *     responses:
 *       201:
 *         description: Resolución creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resolucion'
 *       400:
 *         description: Error al crear la resolución
 */

router.post('/resoluciones', verifySecretarioRole, async (req, res) => {
    const { name_event, date_start, date_end, place_event, value_new_patinador, value_patinador, categories_date } = req.body;

    try {
        const newResolucion = new Resolucion({
            name_event,
            date_start,
            date_end,
            place_event,
            value_new_patinador,
            value_patinador,
            categories_date
        });
        await newResolucion.save();
        res.status(201).json(newResolucion);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la resolución', error });
    }
});

// Obtener todas las resoluciones
/**
 * @swagger
 * /resolucion/resoluciones:
 *   get:
 *     summary: Obtener todas las resoluciones
 *     tags: [Resoluciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de resoluciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resolucion'
 *       500:
 *         description: Error al obtener las resoluciones
 */

router.get('/resoluciones', verifySecretarioRole, async (req, res) => {
    try {
        const resoluciones = await Resolucion.find();
        res.status(200).json(resoluciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las resoluciones', error });
    }
});

// Obtener una resolución por name_event
/**
 * @swagger
 * /resolucion/resoluciones/{name_event}:
 *   get:
 *     summary: Obtener una resolución por nombre de evento
 *     tags: [Resoluciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name_event
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del evento
 *     responses:
 *       200:
 *         description: Resolución encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resolucion'
 *       404:
 *         description: Resolución no encontrada
 *       500:
 *         description: Error al obtener la resolución
 */

router.get('/resoluciones/:name_event', verifySecretarioRole, async (req, res) => {
    const { name_event } = req.params;

    try {
        const resolucion = await Resolucion.findOne({ name_event });

        if (!resolucion) {
            return res.status(404).json({ message: 'Resolución no encontrada' });
        }

        res.status(200).json(resolucion);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la resolución', error });
    }
});

// Actualizar una resolución por name_event
/**
 * @swagger
 * /resolucion/resoluciones/{name_event}:
 *   put:
 *     summary: Actualizar una resolución por nombre de evento
 *     tags: [Resoluciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name_event
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resolucion'
 *     responses:
 *       200:
 *         description: Resolución actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resolucion'
 *       404:
 *         description: Resolución no encontrada
 *       400:
 *         description: Error al actualizar la resolución
 */

router.put('/resoluciones/:name_event', verifySecretarioRole, async (req, res) => {
    const { name_event } = req.params;
    const { date_start, date_end, place_event, value_new_patinador, value_patinador, categories_date } = req.body;

    try {
        const resolucion = await Resolucion.findOneAndUpdate({ name_event }, {
            date_start,
            date_end,
            place_event,
            value_new_patinador,
            value_patinador,
            categories_date
        }, { new: true });

        if (!resolucion) {
            return res.status(404).json({ message: 'Resolución no encontrada' });
        }

        res.status(200).json(resolucion);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la resolución', error });
    }
});

// Eliminar una resolución por name_event
/**
 * @swagger
 * /resoluciones/{name_event}:
 *   delete:
 *     summary: Eliminar una resolución por nombre de evento
 *     tags: [Resoluciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name_event
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del evento
 *     responses:
 *       200:
 *         description: Resolución eliminada exitosamente
 *       404:
 *         description: Resolución no encontrada
 *       500:
 *         description: Error al eliminar la resolución
 */
router.delete('/resoluciones/:name_event', verifySecretarioRole, async (req, res) => {
    const { name_event } = req.params;

    try {
        const resolucion = await Resolucion.findOneAndDelete({ name_event });

        if (!resolucion) {
            return res.status(404).json({ message: 'Resolución no encontrada' });
        }

        res.status(200).json({ message: 'Resolución eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la resolución', error });
    }
});

module.exports = router;
