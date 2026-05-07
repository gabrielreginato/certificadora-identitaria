const express = require('express');
const { AlunoService } = require('../services/AlunoService')
const { body, query } = require('express-validator');
const { z } = require('zod');
const { AlunoSchema, UpdateAlunoSchema, SearchAlunoSchema } = require('../schemas/AlunoSchema');
const { IdentifierSchema } = require('../schemas/IdentifierSchema');
const { BusinessError } = require('../errors/BusinessError');

const route = express.Router();

const service = new AlunoService();

route.get('/', async (req, res, next) => {
    try {
        const filtros = SearchAlunoSchema.parse(req.query);

        const result = await service.find(filtros);
        console.log(result);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
    
});

route.post('/', async (req, res, next) => {
    try {
        const dadosValidados = AlunoSchema.parse(req.body);
        const result = await service.create(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Aluno cadastrado com sucesso.",
            data: result
        });
    } catch (error) {
        next(error);
    }
});

route.put('/:id', async (req, res, next) => {
    try {
        const { id } = IdentifierSchema.parse(req.params);
        const dadosValidados = UpdateAlunoSchema.parse(req.body);

        const result = await service.updateById(id, dadosValidados);

        console.log(result);

        return res.status(202).json({
            message: "Aluno atualizado com sucesso."
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