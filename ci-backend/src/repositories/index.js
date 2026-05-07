const { UsuarioRepository } = require('./UsuarioRepository');
const { AlunoRepository } = require('./AlunoRepository');
const { ProfessorRepository } = require('./ProfessorRepository');
const { OficinaRepository } = require('./OficinaRepository');
const { EncontroRepository } = require('./EncontroRepository');
const { VinculoAlunoOficinaRepository } = require('./links/VinculoAlunoOficinaRepository');
const { VinculoProfessorOficinaRepository } = require('./links/VinculoProfessorOficinaRepository');


module.exports = {
    UsuarioRepository,
    AlunoRepository,
    ProfessorRepository,
    OficinaRepository,
    EncontroRepository,
    VinculoAlunoOficinaRepository,
    VinculoProfessorOficinaRepository
};