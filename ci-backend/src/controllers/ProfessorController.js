const express = require('express');
const { ProfessorSchema, SearchProfessorSchema, UpdateProfessorSchema } = require('../schemas/ProfessorSchema');
const { IdentifierSchema } = require('../schemas/IdentifierSchema');
const { body, query } = require('express-validator');
const { ProfessorService } = require('../services/ProfessorService');
const { z } = require('zod'); 
const { BusinessError } = require('../errors/BusinessError');

route = express.Router();

const service = new ProfessorService();

route.get('/', async (req, res) => {
    try {
        const filtros = SearchProfessorSchema.parse(req.query);

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
        const dadosValidados = ProfessorSchema.parse(req.body);
        const result = await service.create(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Professor cadastrado com sucesso.",
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
        const dadosValidados = UpdateProfessorSchema.parse(req.body);

        const result = await service.updateById(id, dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Professor atualizado com sucesso."
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
        return res.status(500).json({});
    }
});

route.delete('/:id', async (req, res) => {
    try {
        const { id } = IdentifierSchema.parse(req.params);

        const result = await service.deleteById(id);
        console.log(result);

        return res.status(204).json({ message: "Professor apagado com sucesso." });
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