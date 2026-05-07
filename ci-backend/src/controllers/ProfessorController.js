const express = require('express');
const { ProfessorSchema, SearchProfessorSchema, UpdateProfessorSchema } = require('../schemas/ProfessorSchema');
const { IdentifierSchema } = require('../schemas/IdentifierSchema');
const { body, query } = require('express-validator');
const { ProfessorService } = require('../services/ProfessorService');
const { z } = require('zod'); 
const { BusinessError } = require('../errors/BusinessError');

route = express.Router();

const service = new ProfessorService();

route.get('/', async (req, res, next) => {
    try {
        const filtros = SearchProfessorSchema.parse(req.query);

        const result = await service.find(filtros);
        console.log(result);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

route.post('/', async (req, res, next) => {
    try {
        const dadosValidados = ProfessorSchema.parse(req.body);
        const result = await service.create(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Professor cadastrado com sucesso.",
            data: result
        });
    } catch (error) {
        next(error);
    }
});

route.put('/:id', async (req, res, next) => {
    try {
        const { id } = IdentifierSchema.parse(req.params);
        const dadosValidados = UpdateProfessorSchema.parse(req.body);

        const result = await service.updateById(id, dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Professor atualizado com sucesso."
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

        return res.status(204).json({ message: "Professor apagado com sucesso." });
    } catch (error) {
        next(error);
    }
});

module.exports = { route };