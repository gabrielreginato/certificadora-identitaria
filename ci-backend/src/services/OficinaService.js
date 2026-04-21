const { OficinaRepository } = require('../repositories/OficinaRepository');
const sequelize = require('sequelize');
const { BusinessError } = require('../errors/BusinessError');

class OficinaService {
    constructor() {
        this.repository = new OficinaRepository();
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
                    professor_responsavel: "ID de professor não encontrado.",
                }

                throw new BusinessError(messages[error.fields[0]], 409);
            }

            throw error;
        }
    }

    async updateById(id, data) {
        try {
            const oficina = await this.repository.find({ id: id });

            if(!oficina || oficina.length === 0) throw new BusinessError("ID não encontrado", 404);
            
            return await this.repository.updateById(id, data);
        } catch(error) {
            if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    professor_responsavel: "ID de professor não encontrado.",
                }

                throw new BusinessError(messages[error.fields[0]], 409);
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

module.exports = { OficinaService };