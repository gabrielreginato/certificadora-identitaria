const { BusinessError } = require('../errors/BusinessError');
const { AlunoRepository } = require('../repositories/AlunoRepository');
const sequelize = require('sequelize');
const { verifyEmailDuplicate } = require('../utils/EmailDuplicatesCheck');

class AlunoService {
    constructor() {
        this.repository = new AlunoRepository();
    }

    async find(filtros) {
        const where = {};

        if(filtros.nome) where.nome = { [sequelize.Op.like]: `%${filtros.nome}%` };
        if(filtros.ra) where.ra = filtros.ra;
        if(filtros.email) where.email = filtros.email;

        return await this.repository.find(where);
    }

    async create(data) {
        try {
            console.log(data)
            if(await verifyEmailDuplicate(data.email)) throw new BusinessError("Este e-mail já está em uso.", 409);

            const result = await this.repository.create(data);
        } catch(error) {
            if(error instanceof sequelize.UniqueConstraintError) {
                const messages = {
                    email: "Este e-mail já pertence a outro aluno.",
                    ra: "Este RA já pertence a outro aluno."
                }

                throw new BusinessError(messages[error.errors[0].path], 409);
            }

            throw error;
        }
    }

    async updateById(id, data) {
        try {
            const aluno = await this.repository.find({ id: id });

            if(!aluno || aluno.length === 0) throw new BusinessError("ID não encontrado", 404);
            if(data.email) {
                if(await verifyEmailDuplicate(data.email)) throw new BusinessError("Este e-mail já está em uso.", 409);
            }

            return await this.repository.updateById(id, data);
        } catch(error) {
            if(error instanceof sequelize.UniqueConstraintError) {
                const messages = {
                    email: "Este e-mail já pertence a outro aluno.",
                    ra: "Este RA já pertence a outro aluno."
                }

                throw new BusinessError(messages[error.errors[0].path], 409);
            }

            throw error;
        }
    }

    async deleteById(id) {
        const deleted = await this.repository.deleteById(id);

        if(deleted == 0) {
            throw new BusinessError("ID não encontrado.", 404);
        }
        return deleted;
    }
}

module.exports = { AlunoService }