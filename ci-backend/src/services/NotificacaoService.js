const { BusinessError } = require('../errors/BusinessError');
const { NotificacaoRepository } = require('../repositories/index');
const sequelize = require('sequelize');

class NotificacaoService {
    constructor() {
        this.repository = new NotificacaoRepository();
    }

    async find(filtros) {
        const where = {};

        if(filtros.id) where.id = filtros.id;
        if(filtros.usuario_id) where.usuario_id = filtros.usuario_id;

        return await this.repository.find(where);
    }

    async create(data) {
        try {

            return await this.repository.create(data);
        } catch(error) {
            /*if(error instanceof sequelize.UniqueConstraintError) {
                const messages = {
                    email: "Este e-mail já pertence a outro aluno.",
                    ra: "Este RA já pertence a outro aluno."
                }

                throw new BusinessError(messages[error.errors[0].path], 409);
            }*/

            throw error;
        }
    }

    async updateById(id, data) {
        try {
            const notificacao = await this.repository.find({ id: id });

            if(!notificacao || notificacao.length === 0) throw new BusinessError("ID não encontrado", 404);

            return await this.repository.updateById(id, data);
        } catch(error) {
            throw error;
            return {};
        }
    }

    async deleteById(id) {
        const deleted = await this.repository.deleteById(id);

        if(deleted == 0) {d
            throw new BusinessError("ID não encontrado.", 404);
        }
        return deleted;
    }
}

module.exports = { NotificacaoService }