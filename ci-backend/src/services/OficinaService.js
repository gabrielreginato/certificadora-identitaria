const { OficinaRepository } = require('../repositories/OficinaRepository');
const sequelize = require('sequelize');
const { BusinessError } = require('../errors/BusinessError');
const { Professor } = require('../../models/Professor');

class OficinaService {
    constructor() {
        this.repository = new OficinaRepository();
    }
    
    async find(filtros) {
        const where = {};
        const include = [];
        
        if(filtros.titulo) where.titulo = { [sequelize.Op.like]: `%${filtros.titulo}%` };
        if(filtros.tema) where.tema = { [sequelize.Op.like]: `%${filtros.tema}%` };
        if(filtros.professor_responsavel_id) where.professor_responsavel_id = filtros.professor_responsavel_id;

        if(filtros.professor_responsavel_nome) {
            where['$professor.nome$'] = { [sequelize.Op.like]: `%${filtros.professor_responsavel_nome}%` };
        }

        include.push({
            model: Professor,
            as: 'professor'
        });

        return await this.repository.find(where, include);
    }

    async create(data) {
        try {
            return await this.repository.create(data);
        } catch(error) {
            if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    professor_responsavel_id: "ID de professor não encontrado.",
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
                    professor_responsavel_id: "ID de professor não encontrado.",
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