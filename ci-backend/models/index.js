const { Aluno } = require('./Aluno');
const { Professor } = require('./Professor');
const { Oficina } = require('./Oficina');
const { Encontro } = require('./Encontro');
const { AlunoParticipaOficina } = require('./links/AlunoParticipaOficina');
const { ProfessorTutoraOficina } = require('./links/ProfessorTutoraOficina'); 

Aluno.belongsToMany(Oficina, {
    through: AlunoParticipaOficina,
    foreignKey: 'aluno_id',
    as: 'oficinas'
});

Professor.belongsToMany(Oficina, {
    through: ProfessorTutoraOficina,
    foreignKey: 'professor_id',
    as: 'oficinas'
});

Oficina.belongsTo(Professor, {
    foreignKey: 'professor_responsavel_id',
    as: 'professor'
});

Oficina.belongsToMany(Aluno, {
    through: AlunoParticipaOficina,
    foreignKey: 'oficina_id',
    as: 'alunos'
});

Oficina.belongsToMany(Professor, {
    through: ProfessorTutoraOficina,
    foreignKey: 'oficina_id',
    as: { singular: 'professor', plural: 'professores' }
});

Encontro.belongsTo(Oficina, {
    foreignKey: 'oficina_id',
    as: 'oficina'
});

/*AlunoParticipaOficina.belongsTo(Oficina, {
    foreignKey: 'oficina_id',
    as: 'oficina'
})

AlunoParticipaOficina.belongsTo(Aluno, {
    foreignKey: 'aluno_id',
    as: 'aluno'
})*/

module.exports = {
    Aluno,
    Professor,
    Oficina,
    Encontro,
    AlunoParticipaOficina,
    ProfessorTutoraOficina
}