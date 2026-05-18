const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Roteiro = sequelize.define('Roteiro', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    destino_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'destinos', key: 'id' }
    },
    data_ida: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    data_volta: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('rascunho', 'planejando', 'confirmado', 'concluido'),
      allowNull: false,
      defaultValue: 'rascunho'
    }
  }, {
    tableName: 'roteiros'
  });

  Roteiro.associate = (models) => {
    Roteiro.belongsTo(models.Destino, {
      foreignKey: 'destino_id',
      as: 'destino'
    });
    Roteiro.hasMany(models.Atividade, {
      foreignKey: 'roteiro_id',
      as: 'atividades',
      onDelete: 'CASCADE',
      hooks: true
    });
  };

  return Roteiro;
};
