const { Op } = require('sequelize');
const { Destino, Roteiro, Atividade } = require('../models');

const obterDashboard = async (userId, isAdmin) => {
  const whereDest = isAdmin ? {} : { usuario_id: userId };

  const destinos = await Destino.findAll({ where: whereDest, attributes: ['id'] });
  const destinoIds = destinos.map(d => d.id);

  const totalDestinos = destinos.length;
  const totalRoteiros = await Roteiro.count({ where: { destino_id: { [Op.in]: destinoIds } } });

  const roteiros = await Roteiro.findAll({
    where: { destino_id: { [Op.in]: destinoIds } },
    include: [
      { model: Destino, as: 'destino', attributes: ['id', 'cidade', 'pais'] },
      { model: Atividade, as: 'atividades', attributes: ['id', 'feito', 'custo', 'horario', 'nome', 'local'] }
    ],
    order: [['data_ida', 'ASC']]
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const proximaViagem = roteiros.find(r => new Date(r.data_ida) >= hoje);

  const outrosRoteiros = roteiros
    .filter(r => !proximaViagem || r.id !== proximaViagem.id)
    .slice(0, 5)
    .map(r => {
      const json = r.toJSON();
      json.total_atividades = json.atividades.length;
      json.custo_total = json.atividades.reduce((s, a) => s + parseFloat(a.custo || 0), 0);
      delete json.atividades;
      return json;
    });

  const todasAtividades = roteiros.flatMap(r =>
    r.atividades.map(a => ({ ...a.toJSON(), roteiro_nome: r.nome }))
  );

  const proximasAtividades = todasAtividades
    .filter(a => !a.feito && new Date(a.horario) >= hoje)
    .sort((a, b) => new Date(a.horario) - new Date(b.horario))
    .slice(0, 5);

  const totalAtividades = todasAtividades.length;
  const atividadesConcluidas = todasAtividades.filter(a => a.feito).length;
  const custoTotal = todasAtividades.reduce((s, a) => s + parseFloat(a.custo || 0), 0);

  return {
    totais: {
      destinos: totalDestinos,
      roteiros: totalRoteiros,
      atividades: totalAtividades,
      atividades_concluidas: atividadesConcluidas,
      custo_total: custoTotal
    },
    proxima_viagem: proximaViagem ? {
      id: proximaViagem.id,
      nome: proximaViagem.nome,
      data_ida: proximaViagem.data_ida,
      data_volta: proximaViagem.data_volta,
      status: proximaViagem.status,
      destino: proximaViagem.destino,
      total_atividades: proximaViagem.atividades.length,
      atividades_concluidas: proximaViagem.atividades.filter(a => a.feito).length,
      custo_total: proximaViagem.atividades.reduce((s, a) => s + parseFloat(a.custo || 0), 0)
    } : null,
    outros_roteiros: outrosRoteiros,
    proximas_atividades: proximasAtividades
  };
};

module.exports = { obterDashboard };
