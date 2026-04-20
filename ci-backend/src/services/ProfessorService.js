const { ProfessorRepositor, ProfessorRepository } = require('../repositories/ProfessorRepository');
const sequelize = require('sequelize');
const { BusinessError } = require('../errors/BusinessError');
const { verifyEmailDuplicate } = require('../utils/EmailDuplicatesCheck');

class ProfessorService {
    constructor() {
        this.repository = new ProfessorRepository();
    }

    async find(filtros) {
        const where = {};

        if(filtros.nome) where.nome = { [sequelize.Op.like]: `%${filtros.nome}%` };
        if(filtros.email) where.email = filtros.email;

        return await this.repository.find(where);
    }

    async create(data) {
        try {
            if(verifyEmailDuplicate(data.email)) throw new BusinessError("Este e-mail já está em uso.", 409);

            return await this.repository.create(data);
        } catch(error) {
            /*if(error instanceof sequelize.UniqueConstraintError) {
                const messages = {
                    email: "Este e-mail já pertence a outro professor.",
                }

                throw new BusinessError(messages[error.errors[0].path], 409);
            }*/

            throw error;
        }
    }

    async updateById(id, data) {
        try {
            const professor = await this.repository.find({ id: id });

            if(!professor || professor.length === 0) throw new BusinessError("ID não encontrado", 404);
            if(verifyEmailDuplicate(data.email)) throw new BusinessError("Este e-mail já está em uso.", 409);
            
            return await this.repository.updateById(id, data);
        } catch(error) {
            /*if(error instanceof sequelize.UniqueConstraintError) {
                const messages = {
                    email: "Este e-mail já pertence a outro professor.",
                }

                throw new BusinessError(messages[error.errors[0].path], 409);
            }*/

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

module.exports = { ProfessorService };