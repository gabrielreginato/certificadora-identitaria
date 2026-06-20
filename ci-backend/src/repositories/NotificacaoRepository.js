const { Usuario, Notificacao } = require("../../models/index");

class NotificacaoRepository {
  async create(data) {
    return await Notificacao.create(data);
  }

  async find(data, include = []) {
    return await Notificacao.findAll({
        where: data,
        include: {
            model: Usuario,
            as: 'usuario',
            attributes: ["id", "email"],
        }
    })
  }

  async updateById(id, data) {
    return await Notificacao.update(data, { where: { id: id } });
  }

  async deleteById(id) {
    return await Notificacao.destroy({ where: { id: id } });
  }
}

module.exports = { NotificacaoRepository };
