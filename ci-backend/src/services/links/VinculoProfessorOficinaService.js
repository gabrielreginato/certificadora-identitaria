const { VinculoProfessorOficinaRepository } = require('../../repositories/links/VinculoProfessorOficinaRepository');
const { ProfessorRepository } = require('../../repositories/ProfessorRepository');
const { OficinaRepository } = require('../../repositories/OficinaRepository');
const { BusinessError } = require('../../errors/BusinessError');

class VinculoProfessorOficinaService {
    constructor() {
        this.repository = new VinculoProfessorOficinaRepository();
        this.professorRepository = new ProfessorRepository();
        this.oficinaRepository = new OficinaRepository();
    }

    async find(filtros) {
        const where = {};
                
        if(filtros.id) where.id = filtros.id;
        if(filtros.oficina_id) where.oficina_id = filtros.oficina_id;
        if(filtros.professor_id) where.professor_id = filtros.professor_id;

        return await this.repository.find(where);
    }

    async create(data) {
        try {
            const professor = await this.professorRepository.find({ id: data.professor_id });
            if(professor.length === 0) 
                throw new BusinessError("ID de professor não encontrado.", 409);

            const oficina = await this.oficinaRepository.find({ id: data.oficina_id });
            if(oficina.length === 0) 
                throw new BusinessError("ID de oficina não encontrado.", 409);

            if(oficina[0].dataValues.professor_responsavel_id == data.professor_id)
                throw new BusinessError("Este professor já é responsável por esta oficina, portanto não pode se inscrever como tutor.", 409);

            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
            console.log(oficina[0].dataValues)
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')

            const vinculo = await this.find(data);

            if(vinculo.length > 0) throw new BusinessError("Este professor já está cadastrado nesta oficina.", 409);

            this.repository.create(data);
        } catch (error) {
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

module.exports = { VinculoProfessorOficinaService };