const { DataTypes: Sequelize } = require('sequelize');
const { sequelize: db } = require('../config/MysqlConnection');
const { Professor } = require('./Professor');

const Oficina = db.define('oficina', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    tema: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    professor_responsavel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'professores',
          key: 'id'
        },
    }
}, {
    tableName: 'oficinas',
    underscored: true,
    timestamps: true,
});

Oficina.belongsTo(Professor, {
    foreignKey: 'professor_responsavel',
})

module.exports = { Oficina };