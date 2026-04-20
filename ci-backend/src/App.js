const express = require('express');
const cors = require('cors');
const { route: alunoController } = require('./controllers/AlunoController') ;
const { route: professorController } = require('./controllers/ProfessorController');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/alunos', alunoController);
app.use('/professores', professorController)

app.listen(3000);