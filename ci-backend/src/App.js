const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middlewares/ErrorHandler');

const { 
    UsuarioController,
    AlunoController,
    ProfessorController,
    OficinaController,
    EncontroController,
} = require('./controllers/index');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/usuarios', UsuarioController);

// Agora a manipulação das tabelas de 'Alunos' e 'Professores' é feita através da rota '/usuarios' 
//app.use('/alunos', AlunoController);
//app.use('/professores', ProfessorController);

app.use('/oficinas', OficinaController);
app.use('/encontros', EncontroController);

app.use(errorHandler);

app.listen(3000);