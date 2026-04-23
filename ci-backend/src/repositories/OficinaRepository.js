const { Oficina } = require('../../models/Oficina');

class OficinaRepository {
    async create(data) {
        return await Oficina.create(data);
    }

    async find(data, include = []) {
        return await Oficina.findAll({
            where: data,
            include: include
        });
    }

    async updateById(id, data) {
        return await Oficina.update(data, { where: { id: id } });
    }

    async deleteById(id) {
        return await Oficina.destroy({ where: { id: id }});
    }
}

module.exports = { OficinaRepository }