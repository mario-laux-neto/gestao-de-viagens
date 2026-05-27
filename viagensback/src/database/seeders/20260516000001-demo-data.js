'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const senhaAdmin = await bcrypt.hash('admin123', 12);
    const senhaUser = await bcrypt.hash('viajante123', 12);

    await queryInterface.bulkInsert('usuarios', [
      {
        id: 1, nome: 'Administrador', email: 'admin@viagens.com',
        senha_hash: senhaAdmin, perfil: 'admin',
        created_at: new Date(), updated_at: new Date()
      },
      {
        id: 2, nome: 'Viajante Demo', email: 'viajante@viagens.com',
        senha_hash: senhaUser, perfil: 'comum',
        created_at: new Date(), updated_at: new Date()
      }
    ]);

    await queryInterface.bulkInsert('destinos', [
      {
        id: 1, usuario_id: 2, cidade: 'Lisboa', pais: 'Portugal',
        descricao: 'Capital histórica, gastronomia e bondes amarelos.',
        custo_estimado: 8500.00, created_at: new Date(), updated_at: new Date()
      },
      {
        id: 2, usuario_id: 2, cidade: 'Buenos Aires', pais: 'Argentina',
        descricao: 'Tango, arquitetura europeia e parrillas.',
        custo_estimado: 4200.00, created_at: new Date(), updated_at: new Date()
      },
      {
        id: 3, usuario_id: 2, cidade: 'Tóquio', pais: 'Japão',
        descricao: 'Tradição milenar e ultramodernidade.',
        custo_estimado: 14200.00, created_at: new Date(), updated_at: new Date()
      },
      {
        id: 4, usuario_id: 2, cidade: 'Cidade do Cabo', pais: 'África do Sul',
        descricao: 'Praias, montanhas e safáris próximos.',
        custo_estimado: 11000.00, created_at: new Date(), updated_at: new Date()
      }
    ]);

    await queryInterface.bulkInsert('roteiros', [
      {
        id: 1, nome: 'Verão Europeu 2026', destino_id: 1,
        data_ida: '2026-07-12', data_volta: '2026-07-22', status: 'confirmado',
        created_at: new Date(), updated_at: new Date()
      },
      {
        id: 2, nome: 'Aventura Portenha', destino_id: 2,
        data_ida: '2026-09-03', data_volta: '2026-09-09', status: 'planejando',
        created_at: new Date(), updated_at: new Date()
      },
      {
        id: 3, nome: 'Imersão no Japão', destino_id: 3,
        data_ida: '2027-04-01', data_volta: '2027-04-15', status: 'rascunho',
        created_at: new Date(), updated_at: new Date()
      }
    ]);

    await queryInterface.bulkInsert('atividades', [
      {
        id: 1, nome: 'Visita à Torre de Belém', roteiro_id: 1,
        local: 'Torre de Belém, Lisboa',
        horario: new Date('2026-07-13T10:00:00'), custo: 80.00, feito: true,
        created_at: new Date(), updated_at: new Date()
      },
      {
        id: 2, nome: 'Jantar no Bairro Alto', roteiro_id: 1,
        local: 'Bairro Alto, Lisboa',
        horario: new Date('2026-07-13T20:30:00'), custo: 220.00, feito: false,
        created_at: new Date(), updated_at: new Date()
      },
      {
        id: 3, nome: 'Passeio em Sintra', roteiro_id: 1,
        local: 'Palácio da Pena, Sintra',
        horario: new Date('2026-07-15T09:00:00'), custo: 350.00, feito: false,
        created_at: new Date(), updated_at: new Date()
      },
      {
        id: 4, nome: 'Show de Tango em San Telmo', roteiro_id: 2,
        local: 'San Telmo, Buenos Aires',
        horario: new Date('2026-09-04T21:00:00'), custo: 180.00, feito: false,
        created_at: new Date(), updated_at: new Date()
      },
      {
        id: 5, nome: 'Tour pela Recoleta', roteiro_id: 2,
        local: 'Cemitério da Recoleta, Buenos Aires',
        horario: new Date('2026-09-05T14:00:00'), custo: 90.00, feito: false,
        created_at: new Date(), updated_at: new Date()
      },
      {
        id: 6, nome: 'Mercado Tsukiji', roteiro_id: 3,
        local: 'Mercado Tsukiji, Tóquio',
        horario: new Date('2027-04-02T07:30:00'), custo: 0.00, feito: false,
        created_at: new Date(), updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('atividades', null, {});
    await queryInterface.bulkDelete('roteiros', null, {});
    await queryInterface.bulkDelete('destinos', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
