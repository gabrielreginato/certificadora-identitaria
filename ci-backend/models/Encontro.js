const { DataTypes: Sequelize } = require('sequelize');
const { sequelize: db } = require('../config/MysqlConnection');

const Encontro = db.define('encontro', {
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

    data_horario_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
    },

    data_horario_fim: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            isAfter(value) {
                if(value <= this.data_horario_inicio) {
                    throw new BusinessError("A data e horário de término deve ser após a data e horário de início.");
                }
            }
        }
    }, 

}, {
    tableName: 'encontros',
    underscored: true,
    timestamps: true,
});

module.exports = { Encontro };