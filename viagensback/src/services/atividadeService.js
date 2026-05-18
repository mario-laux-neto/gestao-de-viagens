const { Op } = require('sequelize');
const { Atividade, Roteiro, Destino } = require('../models');
const { AppError } = require('../utils/errorHandler');

const verificarOwnership = async (atividade, userId, isAdmin) => {
  if (isAdmin) return;
  const roteiro = await Roteiro.findByPk(atividade.roteiro_id, {
    include: [{ model: Destino, as: 'destino', attributes: ['usuario_id'] }]
  });
  if (!roteiro || roteiro.destino.usuario_id !== userId) {
    throw new AppError('Sem permissão para acessar esta atividade', 403);
  }
};

const verificarRoteiroOwnership = async (roteiroId, userId, isAdmin) => {
  const roteiro = await Roteiro.findByPk(roteiroId, {
    include: [{ model: Destino, as: 'destino', attributes: ['usuario_id'] }]
  });
  if (!roteiro) throw new AppError('Roteiro não encontrado', 404);
  if (!isAdmin && roteiro.destino.usuario_id !== userId) {
    throw new AppError('Sem permissão para acessar este roteiro', 403);
  }
  return roteiro;
};

const listar = async (query, userId, isAdmin) => {
  const where = {};

  if (query.roteiro_id) {
    await verificarRoteiroOwnership(query.roteiro_id, userId, isAdmin);
    where.roteiro_id = query.roteiro_id;
  }

  if (query.busca) {
    where[Op.or] = [
      { nome: { [Op.iLike]: `%${query.busca}%` } },
      { local: { [Op.iLike]: `%${query.busca}%` } }
    ];
  }

  if (query.feito !== undefined) {
    where.feito = query.feito === 'true';
  }

  if (query.data_inicio) {
    where.horario = { ...where.horario, [Op.gte]: new Date(query.data_inicio) };
  }

  if (query.data_fim) {
    where.horario = { ...where.horario, [Op.lte]: new Date(query.data_fim) };
  }

  const include = [{
    model: Roteiro,
    as: 'roteiro',
    attributes: ['id', 'nome'],
    include: [{
      model: Destino,
      as: 'destino',
      attributes: ['id', 'cidade', 'pais', 'usuario_id'],
      ...(!isAdmin && !query.roteiro_id && { where: { usuario_id: userId } })
    }]
  }];

  const atividades = await Atividade.findAll({ where, include, order: [['horario', 'ASC']] });
  return atividades.filter(a => a.roteiro && a.roteiro.destino);
};

const buscarPorId = async (id, userId, isAdmin) => {
  const atividade = await Atividade.findByPk(id, {
    include: [{
      model: Roteiro,
      as: 'roteiro',
      attributes: ['id', 'nome'],
      include: [{ model: Destino, as: 'destino', attributes: ['id', 'cidade', 'pais'] }]
    }]
  });
  if (!atividade) throw new AppError('Atividade não encontrada', 404);
  await verificarOwnership(atividade, userId, isAdmin);
  return atividade;
};

const criar = async (dados, userId, isAdmin) => {
  await verificarRoteiroOwnership(dados.roteiro_id, userId, isAdmin);
  return Atividade.create(dados);
};

const atualizar = async (id, dados, userId, isAdmin) => {
  const atividade = await Atividade.findByPk(id);
  if (!atividade) throw new AppError('Atividade não encontrada', 404);
  await verificarOwnership(atividade, userId, isAdmin);

  if (dados.roteiro_id) {
    await verificarRoteiroOwnership(dados.roteiro_id, userId, isAdmin);
  }

  await atividade.update(dados);
  return atividade;
};

const toggle = async (id, userId, isAdmin) => {
  const atividade = await Atividade.findByPk(id);
  if (!atividade) throw new AppError('Atividade não encontrada', 404);
  await verificarOwnership(atividade, userId, isAdmin);
  await atividade.update({ feito: !atividade.feito });
  return atividade;
};

const excluir = async (id, userId, isAdmin) => {
  const atividade = await Atividade.findByPk(id);
  if (!atividade) throw new AppError('Atividade não encontrada', 404);
  await verificarOwnership(atividade, userId, isAdmin);
  await atividade.destroy();
};

module.exports = { listar, buscarPorId, criar, atualizar, toggle, excluir };
