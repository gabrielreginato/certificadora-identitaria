const { OficinaService } = require('../services/OficinaService');
const { OficinaSchema, UpdateOficinaSchema, SearchOficinaSchema } = require('../schemas/OficinaSchema');
const { IdentifierSchema } = require('../schemas/IdentifierSchema');
const express = require('express');
const { BusinessError } = require('../errors/BusinessError');
const { body, query } = require('express-validator');
const { z } = require('zod');


const route = express.Router();

const service = new OficinaService();

route.get('/', async (req, res, next) => {
    try {
        const filtros = SearchOficinaSchema.parse(req.query);

        const result = await service.find(filtros);
        console.log(result);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

route.post('/', async (req, res, next) => {
    try {
        const dadosValidados = OficinaSchema.parse(req.body);
        const result = await service.create(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Oficina criada com sucesso.",
            data: result
        });
    } catch (error) {
        next(error);
    }
});

route.put('/:id', async (req, res, next) => {
    try {
        const { id } = IdentifierSchema.parse(req.params);
        const dadosValidados = UpdateOficinaSchema.parse(req.body);

        const result = await service.updateById(id, dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Oficina atualizada com sucesso."
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