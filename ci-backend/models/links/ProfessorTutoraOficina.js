const { DataTypes: Sequelize } = require('sequelize');
const { sequelize: db } = require('../../config/MysqlConnection');

const ProfessorTutoraOficina = db.define('professor_tutora_oficina', {
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

    professor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'professores',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },

}, {
    freezeTableName: true,
    tableName: 'professor_tutora_oficina',
    underscored: true,
    timestamps: true,
});

module.exports = { ProfessorTutoraOficina };