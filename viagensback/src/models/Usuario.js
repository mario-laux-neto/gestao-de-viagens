const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    perfil: {
      type: DataTypes.ENUM('admin', 'comum'),
      allowNull: false,
      defaultValue: 'comum'
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_token_expira: {
      type: DataTypes.DATE,
      allowNull: true
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'usuarios'
  });

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Destino, {
      foreignKey: 'usuario_id',
      as: 'destinos'
    });
  };

  return Usuario;
};
