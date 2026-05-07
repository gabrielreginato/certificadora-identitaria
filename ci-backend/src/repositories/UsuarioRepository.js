const { Usuario, Aluno, Professor } = require('../../models/index');

class UsuarioRepository {
    async create(data, options = {}) {
        return await Usuario.create(data, options);
    }

    async find(data) {
        return await Usuario.findAll({
            where: data
        });
    }

    async findByEmailWithProfile(email) {
        return await Usuario.findOne({
            where: { email },
            include: [
                { model: Aluno, as: 'perfil_aluno' },
                { model: Professor, as: 'perfil_professor'}
            ]
        });
    }

    async updateById(id, data) {
        return await Usuario.update(data, { where: { id: id } });
    }

    async deleteById(id, options = {}) {
        return await Usuario.destroy({ where: { id: id }, ...options});
    }
}

module.exports = { UsuarioRepository }