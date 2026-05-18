const { Op } = require('sequelize');
const { Destino, Roteiro } = require('../models');
const { AppError } = require('../utils/errorHandler');

const listar = async (query, userId, isAdmin) => {
  const where = isAdmin ? {} : { usuario_id: userId };

  if (query.busca) {
    where[Op.or] = [
      { cidade: { [Op.iLike]: `%${query.busca}%` } },
      { pais: { [Op.iLike]: `%${query.busca}%` } }
    ];
  }

  if (query.pais) {
    where.pais = { [Op.iLike]: `%${query.pais}%` };
  }

  if (query.custo_min) {
    where.custo_estimado = { ...where.custo_estimado, [Op.gte]: parseFloat(query.custo_min) };
  }

  if (query.custo_max) {
    where.custo_estimado = { ...where.custo_estimado, [Op.lte]: parseFloat(query.custo_max) };
  }

  return Destino.findAll({ where, order: [['created_at', 'DESC']] });
};

const buscarPorId = async (id, userId, isAdmin) => {
  const destino = await Destino.findByPk(id);
  if (!destino) throw new AppError('Destino não encontrado', 404);
  if (!isAdmin && destino.usuario_id !== userId) {
    throw new AppError('Sem permissão para acessar este destino', 403);
  }
  return destino;
};

const criar = async (dados, userId) => {
  return Destino.create({ ...dados, usuario_id: userId });
};

const atualizar = async (id, dados, userId, isAdmin) => {
  const destino = await buscarPorId(id, userId, isAdmin);
  await destino.update(dados);
  return destino;
};

const excluir = async (id, userId, isAdmin) => {
  const destino = await buscarPorId(id, userId, isAdmin);
  const roteiros = await Roteiro.count({ where: { destino_id: id } });
  if (roteiros > 0) {
    throw new AppError('Não é possível excluir destino com roteiros vinculados', 409);
  }
  await destino.destroy();
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
