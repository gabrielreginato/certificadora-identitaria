const { Encontro } = require('../../models/index');

class EncontroRepository {
    async create(data) {
        return await Encontro.create(data);
    }

    async find(data) {
        return await Encontro.findAll({
            where: data
        });
    }

    async updateById(id, data) {
        return await Encontro.update(data, { where: { id: id } });
    }

    async deleteById(id) {
        return await Encontro.destroy({ where: { id: id }});
    }
}

module.exports = { EncontroRepository }