const { OficinaService } = require('../services/OficinaService');
const { OficinaSchema, UpdateOficinaSchema, SearchOficinaSchema } = require('../schemas/OficinaSchema');
const { IdentifierSchema } = require('../schemas/IdentifierSchema');
const express = require('express');
const { BusinessError } = require('../errors/BusinessError');
const { body, query } = require('express-validator');
const { z } = require('zod');


const route = express.Router();

const service = new OficinaService();

route.get('/', async (req, res) => {
    try {
        const filtros = SearchOficinaSchema.parse(req.query);

        const result = await service.find(filtros);
        console.log(result);

        return res.status(200).json(result);
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
        console.log(error);
        return res.status(500).json({ message: "Erro interno do servidor."})
    }
});

route.post('/', async (req, res) => {
    try {
        const dadosValidados = OficinaSchema.parse(req.body);
        const result = await service.create(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Oficina criada com sucesso.",
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
    try {
        const { id } = IdentifierSchema.parse(req.params);
        const dadosValidados = UpdateOficinaSchema.parse(req.body);

        const result = await service.updateById(id, dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Oficina atualizada com sucesso."
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

        console.log(error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});

route.delete('/:id', async (req, res) => {
    try {
        const { id } = IdentifierSchema.parse(req.params);

        const result = await service.deleteById(id);
        console.log(result);

        return res.status(204).json({});
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

        console.log(error);
        return res.status(500).json({ message: "Erro interno do servidor."});
    }
});

module.exports = { route };