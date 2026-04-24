const { EncontroRepository } = require('../repositories/EncontroRepository');
const sequelize = require('sequelize');
const { BusinessError } = require('../errors/BusinessError');
const { Oficina } = require('../../models/Oficina');

class EncontroService {
    constructor() {
        this.repository = new EncontroRepository();
    }

    async find(filtros) {
        const where = {};
        const include = [];
                
        if(filtros.id) where.id = filtros.id;
        if(filtros.data_horario_inicio) where.data_horario_inicio = filtros.data_horario_inicio;
        if(filtros.data_horario_fim) where.data_horario_fim = filtros.data_horario_fim;
        if(filtros.oficina_id) where.oficina_id = filtros.oficina_id;

        if(filtros.oficina_titulo) {
            where['$oficina_titulo$'] = { [sequelize.Op.like]: `%${filtros.oficina_titulo}%` };
        }

        include.push({
            model: Oficina,
            as: 'oficinas'
        });

        return await this.repository.find(where);
    }

    async create(data) {
        try {
            const dataAtual = new Date();
            const dataInico = new Date(data.data_horario_inicio);
            const dataFim = new Date(data.data_horario_fim);

            if(data.data_horario_fim < data.data_horario_inicio) 
                throw new BusinessError("A data de término deve ser posterior à data de início.", 409);

            if(
                data.data_horario_fim < Date.now() ||
                data.data_horario_inicio < Date.now()
            ) 
                throw new BusinessError("Ambas as datas deve ser posteriores à data atual.", 409);

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
        try {
            const dataAtual = (data.data_horario_inicio || data.data_horario_fim) ? new Date() : null;
            const dataInico = data.data_horario_inicio ? new Date(data.data_horario_inicio) : null;
            const dataFim = data.data_horario_fim ? new Date(data.data_horario_fim) : null;

            //Comparação de novas datas de início o fim
            if(data.data_horario_inicio && data.data_horario_fim) {
                if(data.data_horario_fim < data.data_horario_inicio) 
                    throw new BusinessError("A data de término deve ser posterior à data de início.", 409);

                if(
                    data.data_horario_fim < Date.now() ||
                    data.data_horario_inicio < Date.now()
                ) 
                    throw new BusinessError("Ambas as datas deve ser posteriores à data atual.", 409);
            }
            
            //Comparação de nova data de início e atual data de fim
            if(data.data_horario_inicio) {
                const encontro = await this.find({ id: id });
                const encontroDataFim = new Date(encontro[0].data_horario_inicio);

                if(encontroDataFim < dataInico) {
                    throw new BusinessError("A data de término deve ser posterior à data de início.", 409);
                }
            }

            //Comparação de nova data de fim e atual data de início
            if(data.data_horario_fim) {
                const encontro = await this.find({ id: id });
                const encontroDataInicio = new Date(encontro[0].data_horario_inicio);

                if(dataFim < encontroDataInicio) {
                    throw new BusinessError("A data de término deve ser posterior à data de início.", 409);
                }
            }

            return await this.repository.updateById(id, data);
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

    async deleteById(id) {
        const deleted = await this.repository.deleteById(id);

        if(deleted == 0) {
            throw new BusinessError("ID não encontrado.", 404);
        }

        return deleted;
    }
}

module.exports = { EncontroService };