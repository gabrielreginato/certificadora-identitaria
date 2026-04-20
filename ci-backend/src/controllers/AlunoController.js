const express = require('express');
const { AlunoService } = require('../services/AlunoService')
const { body, query } = require('express-validator');
const { z } = require('zod');
const { AlunoSchema, UpdateAlunoSchema, SearchAlunoSchema } = require('../schemas/AlunoSchema');
const { IdentifierSchema } = require('../schemas/IdentifierSchema');
const { BusinessError } = require('../errors/BusinessError');

const route = express.Router();

const service = new AlunoService();

route.get('/', async (req, res) => {
    try {
        const filtros = SearchAlunoSchema.parse(req.query);

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
        const dadosValidados = AlunoSchema.parse(req.body);
        const result = await service.create(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Aluno cadastrado com sucesso.",
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
        const dadosValidados = UpdateAlunoSchema.parse(req.body);

        const result = await service.updateById(id, dadosValidados);

        console.log(result);

        return res.status(202).json({
            message: "Aluno atualizado com sucesso."
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
        return res.status(500).json({ message: "Erro interno do servidor."});
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

module.exports = { route }