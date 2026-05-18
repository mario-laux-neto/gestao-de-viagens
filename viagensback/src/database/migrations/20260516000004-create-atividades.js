'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('atividades', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      roteiro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'roteiros', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      local: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      horario: {
        type: Sequelize.DATE,
        allowNull: false
      },
      custo: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      feito: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('atividades');
  }
};
