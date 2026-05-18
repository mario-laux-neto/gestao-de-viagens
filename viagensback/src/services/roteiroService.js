const { Op } = require('sequelize');
const { Roteiro, Destino, Atividade } = require('../models');
const { AppError } = require('../utils/errorHandler');

const verificarOwnership = async (roteiro, userId, isAdmin) => {
  if (isAdmin) return;
  const destino = await Destino.findByPk(roteiro.destino_id);
  if (!destino || destino.usuario_id !== userId) {
    throw new AppError('Sem permissão para acessar este roteiro', 403);
  }
};

const listar = async (query, userId, isAdmin) => {
  const where = {};

  if (query.busca) {
    where.nome = { [Op.iLike]: `%${query.busca}%` };
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.destino_id) {
    where.destino_id = query.destino_id;
  }

  const includeDestino = {
    model: Destino,
    as: 'destino',
    attributes: ['id', 'cidade', 'pais', 'usuario_id'],
    ...(!isAdmin && { where: { usuario_id: userId } })
  };

  const ordenacao = query.ordenar === 'recentes' ? [['created_at', 'DESC']] : [['data_ida', 'ASC']];

  const roteiros = await Roteiro.findAll({
    where,
    include: [
      includeDestino,
      {
        model: Atividade,
        as: 'atividades',
        attributes: ['id', 'feito', 'custo']
      }
    ],
    order: ordenacao
  });

  return roteiros.map(r => {
    const json = r.toJSON();
    json.total_atividades = json.atividades ? json.atividades.length : 0;
    json.atividades_concluidas = json.atividades ? json.atividades.filter(a => a.feito).length : 0;
    json.custo_total = json.atividades ? json.atividades.reduce((s, a) => s + parseFloat(a.custo || 0), 0) : 0;
    delete json.atividades;
    delete json.destino.usuario_id;
    return json;
  });
};

const buscarPorId = async (id, userId, isAdmin) => {
  const roteiro = await Roteiro.findByPk(id, {
    include: [
      { model: Destino, as: 'destino', attributes: ['id', 'cidade', 'pais', 'usuario_id'] },
      { model: Atividade, as: 'atividades' }
    ]
  });
  if (!roteiro) throw new AppError('Roteiro não encontrado', 404);
  await verificarOwnership(roteiro, userId, isAdmin);

  const json = roteiro.toJSON();
  json.custo_total = json.atividades.reduce((s, a) => s + parseFloat(a.custo || 0), 0);
  return json;
};

const criar = async (dados, userId, isAdmin) => {
  const destino = await Destino.findByPk(dados.destino_id);
  if (!destino) throw new AppError('Destino não encontrado', 404);
  if (!isAdmin && destino.usuario_id !== userId) {
    throw new AppError('Sem permissão para criar roteiro neste destino', 403);
  }
  return Roteiro.create(dados);
};

const atualizar = async (id, dados, userId, isAdmin) => {
  const roteiro = await Roteiro.findByPk(id);
  if (!roteiro) throw new AppError('Roteiro não encontrado', 404);
  await verificarOwnership(roteiro, userId, isAdmin);

  if (dados.destino_id) {
    const destino = await Destino.findByPk(dados.destino_id);
    if (!destino) throw new AppError('Destino não encontrado', 404);
    if (!isAdmin && destino.usuario_id !== userId) {
      throw new AppError('Sem permissão para vincular a este destino', 403);
    }
  }

  const dataIda = dados.data_ida || roteiro.data_ida;
  const dataVolta = dados.data_volta || roteiro.data_volta;
  if (new Date(dataVolta) < new Date(dataIda)) {
    throw new AppError('Data de volta deve ser igual ou posterior à data de ida', 400);
  }

  await roteiro.update(dados);
  return roteiro;
};

const excluir = async (id, userId, isAdmin) => {
  const roteiro = await Roteiro.findByPk(id);
  if (!roteiro) throw new AppError('Roteiro não encontrado', 404);
  await verificarOwnership(roteiro, userId, isAdmin);
  await roteiro.destroy();
};

const resumo = async (id, userId, isAdmin) => {
  const roteiro = await Roteiro.findByPk(id, {
    include: [
      { model: Destino, as: 'destino', attributes: ['usuario_id'] },
      { model: Atividade, as: 'atividades' }
    ]
  });
  if (!roteiro) throw new AppError('Roteiro não encontrado', 404);
  await verificarOwnership(roteiro, userId, isAdmin);

  const atividades = roteiro.atividades;
  const total = atividades.length;
  const concluidas = atividades.filter(a => a.feito).length;
  const custoTotal = atividades.reduce((s, a) => s + parseFloat(a.custo || 0), 0);

  return {
    roteiro_id: roteiro.id,
    nome: roteiro.nome,
    total_atividades: total,
    concluidas,
    percentual: total > 0 ? Math.round((concluidas / total) * 100) : 0,
    custo_total: custoTotal
  };
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir, resumo };
