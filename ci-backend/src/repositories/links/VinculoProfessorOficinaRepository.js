const {
  Professor,
  Oficina,
  ProfessorTutoraOficina,
} = require("../../../models/index");

class VinculoProfessorOficinaRepository {
  async create(data) {
    const professor = await Professor.findByPk(data.professor_id);
    const oficina = await Oficina.findByPk(data.oficina_id);

    return oficina.addProfessor(professor);
  }

  async find(where, options = {}) {
    return await ProfessorTutoraOficina.findAll({
      where,
      ...options,
    });
  }

  async deleteById(id, options = {}) {
    return await ProfessorTutoraOficina.destroy({
      where: { id: id },
      ...options,
    });
  }
}

module.exports = { VinculoProfessorOficinaRepository };
