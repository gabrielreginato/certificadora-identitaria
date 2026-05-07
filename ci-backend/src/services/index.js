const { UsuarioService } = require('./UsuarioService');
const { AlunoService } = require('./AlunoService');
const { ProfessorService } = require('./ProfessorService');
const { OficinaService } = require('./OficinaService');
const { EncontroService } = require('./EncontroService');
const { VinculoAlunoOficinaService } = require('./links/VinculoAlunoOficinaService');
const { VinculoProfessorOficinaService } = require('./links/VinculoProfessorOficinaService');

module.exports = {
    UsuarioService,
    AlunoService,
    ProfessorService,
    OficinaService,
    EncontroService,
    VinculoAlunoOficinaService,
    VinculoProfessorOficinaService
};