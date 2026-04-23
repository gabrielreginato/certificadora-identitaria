const { EncontroRepository } = require('../repositories/EncontroRepository');
const sequelize = require('sequelize');
const { BusinessError } = require('../errors/BusinessError');

class EncontroService {
    constructor() {
        this.repository = new EncontroRepository();
    }

    async find(filtros) {
        const where = {};
                
        if(filtros.titulo) where.titulo = { [sequelize.Op.like]: `%${filtros.titulo}%` };
        if(filtros.tema) where.tema = { [sequelize.Op.like]: `%${filtros.tema}%` };

        return await this.repository.find(where);
    }

    async create(data) {
        try {
            return await this.repository.create(data);
        } catch(error) {
            if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    oficina_id: "ID de oficina não encontrado.",
                }

                throw new BusinessError(messages[error.fields[0]], 409);
            }

            throw error;
        }
    }

    async updateById(id, data) {

    }

    async deleteById(id) {
        const deleted = await this.repository.deleteById(id);

        if(deleted == 0) {
            throw new BusinessError("ID não encontrado.", 404);
        }

        return deleted;
    }
}

module.exports = { EncontroService };