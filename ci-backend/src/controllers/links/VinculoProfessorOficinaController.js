const { IdentifierSchema } = require('../../schemas/IdentifierSchema');
const express = require('express');
const { BusinessError } = require('../../errors/BusinessError');
const { body, query, param } = require('express-validator');
const { z } = require('zod');
const { VinculoProfessorOficinaSchema, SearchVinculoProfessorOficinaSchema } = require('../../schemas/links/VinculoProfessorOficinaSchema');
const { VinculoProfessorOficinaService } = require('../../services/links/VinculoProfessorOficinaService');

const route = express.Router();

const service = new VinculoProfessorOficinaService();

route.get('/', async (req, res, next) => {
    try {
        const filtros = SearchVinculoProfessorOficinaSchema.parse(req.query);

        const result = await service.find(filtros);
        console.log(result);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

route.post('/', async (req, res, next) => {
    try {
        const dadosValidados = VinculoProfessorOficinaSchema.parse(req.body);
        
        const result = await service.create(dadosValidados);

        console.log(result);
        return res.status(201).json({
            message: "Inscrição de professor realizada com sucesso.",
            data: result
        });
    } catch (error) {
        next(error);
    }
});


route.delete('/:id', async (req, res, next) => {
    try {
        const { id } = IdentifierSchema.parse(req.params);

        const result = await service.deleteById(id);
        console.log(result);

        return res.status(204).json({});
    } catch (error) {
        next(error);
    }
});

module.exports = { route };