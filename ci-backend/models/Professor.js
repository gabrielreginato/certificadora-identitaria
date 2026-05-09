const { DataTypes: Sequelize } = require('sequelize');
const { sequelize: db } = require('../config/MysqlConnection');

const Professor = db.define('professor', {
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
    
    usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        field: 'usuario_id',
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'professores',
    underscored: true,
    timestamps: true,
});

module.exports = { Professor };