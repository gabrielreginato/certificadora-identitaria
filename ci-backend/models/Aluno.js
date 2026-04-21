const { DataTypes: Sequelize } = require('sequelize');
const { sequelize: db } = require('../config/MysqlConnection');

const Aluno = db.define('aluno', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    
    email: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    ra: {
        type: Sequelize.STRING(10),
        allowNull: false,
    }
}, {
    tableName: 'alunos',
    underscored: true,
    timestamps: true,
});

module.exports = { Aluno };