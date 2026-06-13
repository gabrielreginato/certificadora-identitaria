const { DataTypes: Sequelize } = require('sequelize');
const { sequelize: db } = require('../config/MysqlConnection');

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
        type: Sequelize.STRING,
        allowNull: false,
    },
    tema: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    professor_responsavel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: true,
    }
}, {
    tableName: 'oficinas',
    underscored: true,
    timestamps: true,
});

module.exports = { Oficina };