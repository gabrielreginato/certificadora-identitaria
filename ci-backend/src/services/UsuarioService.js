require('dotenv').config();
const { BusinessError } = require('../errors/BusinessError');
const { 
    UsuarioRepository, 
    AlunoRepository, 
    ProfessorRepository 
} = require('../repositories/index');
const sequelize = require('sequelize');
const { sequelize: dbConnection } = require('../../config/MysqlConnection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const { verifyEmailDuplicate } = require('../utils/EmailDuplicatesCheck');


class UsuarioService {
    constructor() {
        this.usuarioRepository = new UsuarioRepository();
        this.alunoRepository = new AlunoRepository();
        this.professorRepository = new ProfessorRepository();
    }

    async find(filtros) {
        const where = {};

        if(filtros.id) where.id = filtros.id;
        //if(filtros.email) where.email = filtros.email;

        /*const res = await this.usuarioRepository.find(where);
        res.forEach(user => {
            delete user.senha_hash;
        });

        return res;*/

        return await this.usuarioRepository.find(where);
    }

    async create(data) {
        const t = await dbConnection.transaction();

        try {
            const authData = {
                email: data.email,
                senha_hash: await bcrypt.hash(data.senha, 10),
                tipo: data.role
            };

            const novoUsuario = await this.usuarioRepository.create(authData, { transaction: t });

            if(data.role === 'aluno') {
                await this.alunoRepository.create({
                    nome: data.nome,
                    ra: data.ra,
                    usuario_id: novoUsuario.id
                }, { transaction: t });
            } else if (data.role === 'professor') {
                await this.professorRepository.create({
                    nome: data.nome,
                    usuario_id: novoUsuario.id
                }, { transaction: t });
            }

            await t.commit();

            console.log(data);

            const resultado = novoUsuario.toJSON();
            delete resultado.senha_hash;


            return resultado;
        } catch(error) {
            await t.rollback();

            if(error instanceof sequelize.UniqueConstraintError) {
                const path = error.errors[0].path.split('.').pop();

                const messages = {
                    email: "Este e-mail já pertence a outro usuário.",
                    ra: "Este RA já pertence a outro aluno.",
                    usuario_id: "Este usuário já possui um perfil cadastrado."
                }

                throw new BusinessError(messages[path] || "Dado duplicado detectado.", 409);
            }

            throw error;
        }
    }

    async login(data) {
        const usuario = await this.usuarioRepository.findByEmailWithProfile(data.email);

        if(!usuario) throw new BusinessError("E-mail ou senha incorretos.", 401);

        const senhaValida = await bcrypt.compare(data.senha, usuario.senha_hash);

        if(!senhaValida) throw new BusinessError("E-mail ou senha incorretos.", 401);

        const payload = {
            id: usuario.id,
            tipo: usuario.tipo
        };

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        const usuarioJson = usuario.toJSON();
        delete usuarioJson.senha_hash;

        return {
            usuario: usuarioJson,
            token
        };
    }

    async updateById(id, data) {
        const t = await dbConnection.transaction();

        try {
            const usuarioExistente = await this.usuarioRepository.findByIdWithProfile(id);

            if (!usuarioExistente) {
                throw new BusinessError("Usuário não encontrado.", 404);
            }

            const authData = {
                email: data.email || usuarioExistente.email
            };

            if(data.senha) {
                authData.senha_hash = await bcrypt.hash(data.senha, 10) || usuario.senha_hash;
            }

            await this.usuarioRepository.updateById(id, authData, { transaction: t });

            if (usuarioExistente.tipo === 'aluno') {
                await this.alunoRepository.updateByUserId(id, {
                    nome: data.nome || usuarioExistente.perfil_aluno.nome,
                    ra: data.ra || usuarioExistente.perfil_aluno.ra
                }, { transaction: t });
            } else if (usuarioExistente.tipo === 'professor') {
                await this.professorRepository.updateByUserId(id, {
                    nome: data.nome || usuarioExistente.perfil_professor.nome
                }, { transaction: t });
            }

            await t.commit();

            console.log(data);

            const usuarioAtualizado = await this.usuarioRepository.findByIdWithProfile(id);
            const resultado = usuarioAtualizado.toJSON();
            delete resultado.senha_hash;

            return resultado;
        } catch(error) {
            await t.rollback(); 

            if(error instanceof sequelize.UniqueConstraintError) {
                const path = error.errors[0].path.split('.').pop();

                const messages = {
                    email: "Este e-mail já pertence a outro usuário.",
                    ra: "Este RA já pertence a outro aluno.",
                    usuario_id: "Este usuário já possui um perfil cadastrado."
                }

                throw new BusinessError(messages[path] || "Dado duplicado detectado.", 409);
            }

            throw error;
        }
    }

    /*async updateById(id, data) {
        try {
            const usuario = await this.repository.find({ id: id });

            if(!usuario || usuario.length === 0) throw new BusinessError("ID não encontrado", 404);
           if(data.email) {
                if(await verifyEmailDuplicate(data.email)) throw new BusinessError("Este e-mail já está em uso.", 409);
            }

            return await this.repository.updateById(id, data);
        } catch(error) {
            if(error instanceof sequelize.UniqueConstraintError) {
                const messages = {
                    email: "Este e-mail já pertence a outro usuário.",
                    ra: "Este RA já pertence a outro aluno."
                }

                throw new BusinessError(messages[error.errors[0].path], 409);
            }

            throw error;
        }
    }*/

    async deleteById(id) {
        const t = await dbConnection.transaction();

        try {
            const deleted = await this.usuarioRepository.deleteById(id, { transaction: t });

            if(deleted == 0) {
                throw new BusinessError("ID não encontrado.", 404);
            }

            await t.commit()

            return deleted;
        } catch(error) {
            await t.rollback();
            throw(error);
        }
        
    }
}

module.exports = { UsuarioService }