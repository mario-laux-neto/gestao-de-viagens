const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Destino = sequelize.define('Destino', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' }
    },
    cidade: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    pais: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    },
    custo_estimado: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  }, {
    tableName: 'destinos'
  });

  Destino.associate = (models) => {
    Destino.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });
    Destino.hasMany(models.Roteiro, {
      foreignKey: 'destino_id',
      as: 'roteiros'
    });
  };

  return Destino;
};
