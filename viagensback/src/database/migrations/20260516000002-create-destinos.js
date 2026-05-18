'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('destinos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      cidade: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      pais: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT
      },
      custo_estimado: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
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
    await queryInterface.dropTable('destinos');
  }
};
