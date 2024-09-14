const express = require('express');
const router = express.Router();
const Resolucion = require('../models/resolucion');
const verifySecretarioRole = require('../verifySecretarioRole');


// Ejemplo de endpoint protegido
router.get('/protected', verifySecretarioRole, (req, res) => {
  res.status(200).json({ message: 'Acceso concedido a ruta protegida' });
});

// Crear nueva resolución
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
router.get('/resoluciones', verifySecretarioRole, async (req, res) => {
    try {
        const resoluciones = await Resolucion.find();
        res.status(200).json(resoluciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las resoluciones', error });
    }
});

// Obtener una resolución por name_event
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
