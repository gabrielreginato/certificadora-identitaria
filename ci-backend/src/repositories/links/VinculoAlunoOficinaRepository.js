const { Aluno, Oficina, AlunoParticipaOficina } = require('../../../models/index');

class VinculoAlunoOficinaRepository {
    async create(data) {
        const aluno = await Aluno.findByPk(data.aluno_id);
        const oficina = await Oficina.findByPk(data.oficina_id);
        
        //return await AlunoParticipaOficina.create(data);
        return oficina.addAluno(aluno);
    }

    async find(data) {
        return await AlunoParticipaOficina.findAll({
            where: data,
        });
    }

    async deleteById(id) {
        return await AlunoParticipaOficina.destroy({ where: { id: id }});
    }
}

module.exports = { VinculoAlunoOficinaRepository };