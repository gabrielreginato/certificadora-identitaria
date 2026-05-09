const { OficinaService } = require('../services/OficinaService');
const { 
    OficinaSchema, 
    UpdateOficinaSchema, 
    SearchOficinaSchema, 
    InscricaoOficinaSchema,
    SearchVinculosSchema
} = require('../schemas/OficinaSchema');
const { IdentifierSchema } = require('../schemas/IdentifierSchema');
const express = require('express');
const { BusinessError } = require('../errors/BusinessError');
const { body, query } = require('express-validator');
const { z } = require('zod');
const { authMiddleware } = require('../middlewares/Auth');


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

route.post('/', authMiddleware, async (req, res, next) => {
    try {
        const dadosValidados = OficinaSchema.parse(req.body);

        if(req.user.tipo != 'professor') {
            return res.status(403).json({ message: 'Apenas professores podem criar oficinas.' });
        }

        if(req.user.id != dadosValidados.professor_responsavel_id) {
            return res.status(403).json({ message: 'Insira seu próprio ID.' });
        }

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

route.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id: oficinaId } = IdentifierSchema.parse(req.params);
        const dadosValidados = UpdateOficinaSchema.parse(req.body);
        dadosValidados.userId = req.user.id

        if(req.user.tipo != 'professor') {
            return res.status(403).json({ message: 'Apenas professores podem alterar oficinas.' });
        }

        const result = await service.updateById(oficinaId, dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Oficina atualizada com sucesso."
        });
    } catch (error) {
        next(error);
    }
});

route.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id: oficinaId } = IdentifierSchema.parse(req.params);
        const userId = req.user.id;

        if(req.user.tipo != 'professor') {
            return res.status(403).json({ message: 'Apenas professores podem deletar oficinas.' });
        }

        const result = await service.deleteById(userId, oficinaId);
        console.log(result);

        return res.status(204).json({});
    } catch (error) {
        next(error);
    }
});

route.post('/inscricao/professores', authMiddleware, async (req, res, next) => {
    try {
        const dadosValidados = InscricaoOficinaSchema.parse(req.body);
        dadosValidados.user = req.user;

        if(req.user.tipo != 'professor') {
            return res.status(403).json({ message: 'Apenas professores podem se inscrever como tutores.' });
        }

        const result = await service.toLinkProfessores(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Professor inscrito com sucesso.",
            data: result
        });
    } catch(error) {
        next(error);
    }
});

route.delete('/inscricao/professores', authMiddleware, async (req, res, next) => {
    try {
        const dadosValidados = InscricaoOficinaSchema.parse(req.body);
        dadosValidados.user = req.user;

        const result = await service.toUnlinkProfessores(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Professor desinscrito com sucesso.",
        });
    } catch(error) {
        next(error);
    }
});

route.post('/inscricao/alunos', authMiddleware, async (req, res, next) => {
    try {
        const dadosValidados = InscricaoOficinaSchema.parse(req.body);
        dadosValidados.user = req.user;

        if(req.user.tipo != 'aluno') {
            return res.status(403).json({ message: 'Apenas alunos podem se inscrever como participantes.' });
        }

        const result = await service.toLinkAlunos(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Aluno inscrito com sucesso.",
            data: result
        });
    } catch(error) {
        next(error);
    }
});

route.delete('/inscricao/alunos', authMiddleware, async (req, res, next) => {
    try {
        const dadosValidados = InscricaoOficinaSchema.parse(req.body);
        dadosValidados.user = req.user;

        const result = await service.toUnlinkAlunos(dadosValidados);

        console.log(result);

        return res.status(201).json({
            message: "Aluno desinscrito com sucesso.",
        });
    } catch(error) {
        next(error);
    }
});

route.get('/tutores', async (req, res, next) => {
    try {
        const filtros = SearchVinculosSchema.parse(req.query);

        const result = await service.findTutores(filtros);
        console.log(result);

        return res.status(200).json(result);
    } catch(error) {
        next(error);
    }
});

route.get('/participantes', async (req, res, next) => {
    try {
        const filtros = SearchVinculosSchema.parse(req.query);

        const result = await service.findParticipantes(filtros);
        console.log(result);

        return res.status(200).json(result);
    } catch(error) {
        next(error);
    }
});

module.exports = { route };