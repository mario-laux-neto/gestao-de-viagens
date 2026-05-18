const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Atividade = sequelize.define('Atividade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    roteiro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'roteiros', key: 'id' }
    },
    local: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    horario: {
      type: DataTypes.DATE,
      allowNull: false
    },
    custo: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    feito: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'atividades'
  });

  Atividade.associate = (models) => {
    Atividade.belongsTo(models.Roteiro, {
      foreignKey: 'roteiro_id',
      as: 'roteiro'
    });
  };

  return Atividade;
};
