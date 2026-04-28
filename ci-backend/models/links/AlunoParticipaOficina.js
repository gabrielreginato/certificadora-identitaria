const { DataTypes: Sequelize } = require('sequelize');
const { sequelize: db } = require('../../config/MysqlConnection');

const AlunoParticipaOficina = db.define('aluno_participa_oficina', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    oficina_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'oficinas',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },

    aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'alunos',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },

}, {
    freezeTableName: true, // O modelo vai buscar por 'aluno_participa_oficina' e não por 'aluno_participa_oficinas'
    tableName: 'aluno_participa_oficina',
    underscored: true,
    timestamps: true,
});

module.exports = { AlunoParticipaOficina };