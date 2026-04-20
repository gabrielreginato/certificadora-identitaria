const { where } = require('sequelize');
const { Professor } = require('../../models/Professor');

class ProfessorRepository {
    async create(data) {
        return await Professor.create(data);
    }

    async find(data) {
        return await Professor.findAll({ where: data })
    }

    async updateById(id, data) {
        return await Professor.update(data, { where: { id: id } })
    }

    async deleteById(id) {
        return await Professor.destroy({ where: { id: id } });
    }
}

module.exports = { ProfessorRepository };