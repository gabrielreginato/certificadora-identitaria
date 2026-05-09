const { route : UsuarioController } = require('./UsuarioController');
const { route : AlunoController } = require('./AlunoController');
const { route : ProfessorController } = require('./ProfessorController');
const { route : OficinaController } = require('./OficinaController');
const { route : EncontroController } = require('./EncontroController');

module.exports = {
    UsuarioController,
    AlunoController,
    ProfessorController,
    OficinaController,
    EncontroController,
};