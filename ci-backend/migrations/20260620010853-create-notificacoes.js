'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('notificacoes', { 
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

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('notificacoes');
  }
};
