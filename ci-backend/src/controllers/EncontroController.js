const { IdentifierSchema } = require('../schemas/IdentifierSchema');
const express = require('express');
const { BusinessError } = require('../errors/BusinessError');
const { body, query } = require('express-validator');
const { z } = require('zod');
const { EncontroSchema } = require('../schemas/EncontroSchema');
const { EncontroService } = require('../services/EncontroService');

const route = express.Router();

const service = new EncontroService();

route.get('/', async (req, res) => {

});

route.post('/', async (req, res) => {
    try {
        const dadosValidados = EncontroSchema.parse(req.body);
        const result = await service.create(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Encontro criado com sucesso.",
            data: result
        });
    } catch (error) {
        if(error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Dados de entrada inválidos.",
                errors: error.issues.map(err => ({
                    field: err.path[0],
                    message: err.message
                }))
            });
        }

        if(error instanceof BusinessError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor."})
    }
});

route.put('/:id', async (req, res) => {

});

route.delete('/:id', async (req, res) => {

});

module.exports = { route };