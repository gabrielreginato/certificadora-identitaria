const express = require('express');
const cors = require('cors');
const { route: alunoController } = require('./controllers/AlunoController') ;
const { route: professorController } = require('./controllers/ProfessorController');
const { route: oficinaController } = require('./controllers/OficinaController');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/alunos', alunoController);
app.use('/professores', professorController);
app.use('/oficinas', oficinaController);

app.listen(3000);