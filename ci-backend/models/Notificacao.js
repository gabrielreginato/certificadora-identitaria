const { DataTypes: Sequelize } = require('sequelize');
const { sequelize: db } = require('../config/MysqlConnection');

const Notificacao = db.define('notificacao', {
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
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      visto: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
}, {
    tableName: 'notificacoes',
    underscored: true,
    timestamps: true,
});

module.exports = { Notificacao };