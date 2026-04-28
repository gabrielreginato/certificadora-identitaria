const { VinculoAlunoOficinaRepository } = require('../../repositories/links/VinculoAlunoOficinaRepository');
const { AlunoRepository } = require('../../repositories/AlunoRepository');
const { OficinaRepository } = require('../../repositories/OficinaRepository');
const { BusinessError } = require('../../errors/BusinessError');

class VinculoAlunoOficinaService {
    constructor() {
        this.repository = new VinculoAlunoOficinaRepository();
        this.alunoRepository = new AlunoRepository();
        this.oficinaRepository = new OficinaRepository();
    }

    async find(filtros) {
        const where = {};
                
        if(filtros.id) where.id = filtros.id;
        if(filtros.oficina_id) where.oficina_id = filtros.oficina_id;
        if(filtros.aluno_id) where.aluno_id = filtros.aluno_id;

        return await this.repository.find(where);
    }

    async create(data) {
        try {
            const aluno = await this.alunoRepository.find({ id: data.aluno_id });
            if(aluno.length === 0) throw new BusinessError("ID de aluno não encontrado.", 409);

            const oficina = await this.oficinaRepository.find({ id: data.oficina_id });
            if(oficina.length === 0) throw new BusinessError("ID de oficina não encontrado.", 409);

            const vinculo = await this.find(data);

            if(vinculo.length > 0) throw new BusinessError("Este aluno já está cadastrado nesta oficina.", 409);

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

module.exports = { VinculoAlunoOficinaService };