'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('professor_tutora_oficina', { 
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
    });

    await queryInterface.addIndex('professor_tutora_oficina', ['oficina_id', 'professor_id'], {
      unique: true,
      name: 'unique_professor_oficina'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('professor_tutora_oficina');
  }
};
