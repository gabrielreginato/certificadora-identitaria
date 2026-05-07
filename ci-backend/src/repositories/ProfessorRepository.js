const { where } = require('sequelize');
const { Professor } = require('../../models/index');

class ProfessorRepository {
    async create(data, options) {
        return await Professor.create(data, options);
    }

    async find(data) {
        return await Professor.findAll({ where: data })
    }

    async updateById(id, data) {
        return await Professor.update(data, { where: { id: id } })
    }

    async deleteById(id, options = {}) {
        return await Professor.destroy({ where: { id: id }, ...options});
    }
}

module.exports = { ProfessorRepository };