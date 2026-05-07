const { DataTypes: Sequelize } = require('sequelize');
const { sequelize: db } = require('../config/MysqlConnection');

const Usuario = db.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    
    email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
    },

    senha_hash: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },

    tipo: {
        type: Sequelize.ENUM('admin', 'professor', 'aluno'),
        allowNull: false,
        defaultValue: 'aluno'
    },
}, {
    tableName: 'usuarios',
    underscored: true,
    timestamps: true,
});

module.exports = { Usuario };