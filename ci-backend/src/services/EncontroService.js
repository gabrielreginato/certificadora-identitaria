const { EncontroRepository, UsuarioRepository, OficinaRepository } = require('../repositories/index');
const sequelize = require('sequelize');
const { BusinessError } = require('../errors/BusinessError');
const { Oficina } = require('../../models/index');

class EncontroService {
    constructor() {
        this.encontroRepository = new EncontroRepository();
        this.usuarioRepository = new UsuarioRepository();
        this.oficinaRepository = new OficinaRepository();
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

        return await this.encontroRepository.find(where);
    }

    async create(data) {
        try {
            const oficina = await this.oficinaRepository.find({ id: data.oficina_id });
            if(!oficina || oficina.length == 0) throw new BusinessError('Oficina não encontrada.', 409);

            if(oficina[0].professor_responsavel_id != data.user.id) throw new BusinessError('Professores podem adicionar encontros apenas às próprias oficinas.');

            delete data.user;

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

            return await this.encontroRepository.create(data);
        } catch(error) {
            /*if(error instanceof sequelize.ForeignKeyConstraintError) {
                const messages = {
                    oficina_id: "ID de oficina não encontrado.",
                }

                throw new BusinessError(messages[error.fields[0]], 409);
            }*/

            throw error;
        }
    }

    /*async updateById(id, data) {
        try {
            const encontro = await this.encontroRepository.find({ id: id });
            if(!encontro || encontro.length == 0) throw new BusinessError('Encontro não encontrado.', 409);

            const oficina = await this.oficinaRepository.find({ id: encontro[0].oficina_id });
            //Improvável
            //if(!oficina || oficina.length == 0) throw new BusinessError('Oficina não encontrada.', 409);

            if(oficina[0].professor_responsavel_id != data.user.id) throw new BusinessError('Professores podem alterar apenas encontros das próprias oficinas.');

            delete data.user;

            //const dataAtual = (data.data_horario_inicio || data.data_horario_fim) ? new Date() : null;
            const dataInicio = data.data_horario_inicio ? new Date(data.data_horario_inicio) : null;
            const dataFim = data.data_horario_fim ? new Date(data.data_horario_fim) : null;

            //Comparação de novas datas de início o fim
            if(dataInicio && dataFim) {
                if(dataFim.getTime() <= dataInicio.getTime()) {
                    throw new BusinessError("A data de término deve ser posterior à data de início.", 409);
                }
                    
                if(
                    dataFim.getTime() < Date.now() ||
                    dataInicio.getTime() < Date.now()
                ) 
                    throw new BusinessError("Ambas as datas deve ser posteriores à data atual.", 409);
            }
            
            //Comparação de nova data de início e atual data de fim
            if(dataInicio) {
                const encontro = await this.find({ id: id });
                const encontroDataFim = new Date(encontro[0].data_horario_fim).getTime();

                if(encontroDataFim < dataInicio.getTime()) {
                    throw new BusinessError("A data de término deve ser posterior à data de início.", 409);
                }
            }

            //Comparação de nova data de fim e atual data de início
            if(dataFim) {
                const encontro = await this.find({ id: id });
                const encontroDataInicio = new Date(encontro[0].data_horario_inicio).getTime();

                if(dataFim.getTime() < encontroDataInicio) {
                    throw new BusinessError("A data de término deve ser posterior à data de início.", 409);
                }
            }

            return await this.encontroRepository.updateById(id, data);
        } catch(error) {
            throw error;
        }
    }*/

    async updateById(id, data) {
        try {
            const encontro = await this.encontroRepository.find({ id: id });
            if(!encontro || encontro.length == 0) throw new BusinessError('Encontro não encontrado.', 409);

            const oficina = await this.oficinaRepository.find({ id: encontro[0].oficina_id });
            //Improvável
            //if(!oficina || oficina.length == 0) throw new BusinessError('Oficina não encontrada.', 409);

            if(oficina[0].professor_responsavel_id != data.user.id) throw new BusinessError('Professores podem alterar apenas encontros das próprias oficinas.');

            delete data.user;

            //const dataAtual = (data.data_horario_inicio || data.data_horario_fim) ? new Date() : null;
            const dataInicio = data.data_horario_inicio ? new Date(data.data_horario_inicio) : null;
            const dataFim = data.data_horario_fim ? new Date(data.data_horario_fim) : null;

            //Comparação de novas datas de início o fim
            if(dataInicio && dataFim) {
                if(dataFim.getTime() <= dataInicio.getTime()) {
                    throw new BusinessError("A data de término deve ser posterior à data de início.", 409);
                }
                    
                if(
                    dataFim.getTime() < Date.now() ||
                    dataInicio.getTime() < Date.now()
                ) 
                    throw new BusinessError("Ambas as datas deve ser posteriores à data atual.", 409);
            }
            
            //Comparação de nova data de início e atual data de fim
            if(dataInicio) {
                const encontro = await this.find({ id: id });
                const encontroDataFim = new Date(encontro[0].data_horario_fim).getTime();

                if(encontroDataFim < dataInicio.getTime()) {
                    throw new BusinessError("A data de término deve ser posterior à data de início.", 409);
                }
            }

            //Comparação de nova data de fim e atual data de início
            if(dataFim) {
                const encontro = await this.find({ id: id });
                const encontroDataInicio = new Date(encontro[0].data_horario_inicio).getTime();

                if(dataFim.getTime() < encontroDataInicio) {
                    throw new BusinessError("A data de término deve ser posterior à data de início.", 409);
                }
            }

            return await this.encontroRepository.updateById(id, data);
        } catch(error) {
            throw error;
        }
    }

    async deleteById(userId, encontroId) {
        try {
            const encontro = await this.encontroRepository.find({ id: encontroId });
            if(!encontro || encontro.length == 0) throw new BusinessError('Encontro não encontrado.', 409);

            const oficina = await this.oficinaRepository.find({ id: encontro[0].oficina_id });
            //Improvável
            //if(!oficina || oficina.length == 0) throw new BusinessError('Oficina não encontrada.', 409);

            if(oficina[0].professor_responsavel_id != userId) throw new BusinessError('Professores podem deletar apenas encontros das próprias oficinas.');

            const deleted = await this.encontroRepository.deleteById(encontroId);

            if(deleted == 0) {
                throw new BusinessError("ID não encontrado.", 404);
            }

            return deleted;
        } catch(error) {
            throw(error);
        }
    }
}

module.exports = { EncontroService };