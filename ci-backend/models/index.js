const { Usuario } = require('./Usuario');
const { Aluno } = require('./Aluno');
const { Oficina } = require('./Oficina');
const { Encontro } = require('./Encontro');
const { Professor } = require('./Professor');
const { AlunoParticipaOficina } = require('./links/AlunoParticipaOficina');
const { ProfessorTutoraOficina } = require('./links/ProfessorTutoraOficina'); 

//Relação Professor-Aluno/Usuario
Aluno.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
});

Professor.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
});

Usuario.hasOne(Aluno, { 
    foreignKey: 'usuario_id', 
    as: 'perfil_aluno' 
});

Usuario.hasOne(Professor, { 
    foreignKey: 'usuario_id', 
    as: 'perfil_professor' 
});

//Relação Aluno/Oficina
Aluno.belongsToMany(Oficina, {
    through: AlunoParticipaOficina,
    foreignKey: 'aluno_id',
    as: 'oficinas'
});

Oficina.belongsToMany(Aluno, {
    through: AlunoParticipaOficina,
    foreignKey: 'oficina_id',
    as: 'alunos'
});

//Relações Professor/Oficina
Oficina.belongsTo(Professor, {
    foreignKey: 'professor_responsavel_id',
    as: 'professor'
});

Professor.belongsToMany(Oficina, {
    through: ProfessorTutoraOficina,
    foreignKey: 'professor_id',
    as: 'oficinas'
});

Oficina.belongsToMany(Professor, {
    through: ProfessorTutoraOficina,
    foreignKey: 'oficina_id',
    as: { 
        singular: 'professor', 
        plural: 'professores' 
    }
});

//Relação Encontro/Oficina
Encontro.belongsTo(Oficina, {
    foreignKey: 'oficina_id',
    as: 'oficina'
});

/*Relacionamentos opcionais da tabela intermediária
AlunoParticipaOficina.belongsTo(Oficina, {
    foreignKey: 'oficina_id',
    as: 'oficina'
})

AlunoParticipaOficina.belongsTo(Aluno, {
    foreignKey: 'aluno_id',
    as: 'aluno'
})*/

module.exports = {
    Usuario,
    Aluno,
    Oficina,
    Encontro,
    Professor,
    AlunoParticipaOficina,
    ProfessorTutoraOficina
};