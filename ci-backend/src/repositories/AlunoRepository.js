const { Aluno } = require('../../models/index');

class AlunoRepository {
    async create(data, options) {
        return await Aluno.create(data, options);
    }

    async find(data) {
        return await Aluno.findAll({
            where: data
        });
    }

    async updateById(id, data) {
        return await Aluno.update(data, { where: { id: id } });
    }

    async deleteById(id, options = {}) {
        return await Aluno.destroy({ where: { id: id }, ...options});
    }
}

module.exports = { AlunoRepository }