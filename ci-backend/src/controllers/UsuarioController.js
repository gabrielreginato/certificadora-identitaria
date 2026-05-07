const express = require('express');
const { UsuarioService } = require('../services/index');
const { body, query } = require('express-validator');
const { z } = require('zod');
const { UsuarioLoginSchema } = require('../schemas/UsuarioSchema');
const { AlunoSchema, UpdateAlunoSchema, SearchAlunoSchema } = require('../schemas/AlunoSchema');
const { ProfessorSchema, UpdateProfessorSchema, SearchProfessorSchema } = require('../schemas/ProfessorSchema');
const { IdentifierSchema } = require('../schemas/IdentifierSchema');
const { BusinessError } = require('../errors/BusinessError');
const { authMiddleware } = require('../middlewares/Auth');

const route = express.Router();

const service = new UsuarioService();

route.post('/alunos/signin', async (req, res, next) => {
    try {
        const dadosValidados = AlunoSchema.parse(req.body);
        dadosValidados.role = 'aluno';
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

route.post('/professores/signin', async (req, res, next) => {
    try {
        const dadosValidados = ProfessorSchema.parse(req.body);
        dadosValidados.role = 'professor';
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

route.post('/login', async (req, res, next) => {
    try {
        const dadosValidados = UsuarioLoginSchema.parse(req.body);

        const result = await service.login(dadosValidados);

        return res.status(200).json({
            message: 'Login realizado com sucesso.',
            ...result
        });
    } catch(error) {
        next(error);
    }
});

route.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = IdentifierSchema.parse(req.params);

        if(req.user.id != id) {
            return res.status(403).json({ message: 'Apenas a própria conta pode ser deletada.' });
        }

        const result = await service.deleteById(id);
        console.log(result);

        return res.status(204).json({});
    } catch (error) {
        next(error);
    }
});

module.exports = { route }