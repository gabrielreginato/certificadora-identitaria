const { Aluno } = require('../../models/index');

class AlunoRepository {
    async create(data) {
        return await Aluno.create(data);
    }

    async find(data) {
        return await Aluno.findAll({
            where: data
        });
    }

    async updateById(id, data) {
        return await Aluno.update(data, { where: { id: id } });
    }

    async deleteById(id) {
        return await Aluno.destroy({ where: { id: id }});
    }
}

module.exports = { AlunoRepository }