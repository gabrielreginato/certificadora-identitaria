const { route : UsuarioController } = require('./UsuarioController');
const { route : AlunoController } = require('./AlunoController');
const { route : ProfessorController } = require('./ProfessorController');
const { route : OficinaController } = require('./OficinaController');
const { route : EncontroController } = require('./EncontroController');
const { route : VinculoAlunoOficinaController } = require('./links/VinculoAlunoOficinaController');
const { route : VinculoProfessorOficinaController } = require('./links/VinculoProfessorOficinaController');

module.exports = {
    UsuarioController,
    AlunoController,
    ProfessorController,
    OficinaController,
    EncontroController,
    VinculoAlunoOficinaController,
    VinculoProfessorOficinaController
};