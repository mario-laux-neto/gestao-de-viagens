const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env] || config['production'];

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: env === 'development' ? console.log : false,
    timezone: '-03:00',
    define: { timestamps: true, underscored: true, freezeTableName: false },
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  });
} else if (dbConfig && dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

const db = { sequelize, Sequelize };

db.Usuario = require('./Usuario')(sequelize);
db.Destino = require('./Destino')(sequelize);
db.Roteiro = require('./Roteiro')(sequelize);
db.Atividade = require('./Atividade')(sequelize);

Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

module.exports = db;
