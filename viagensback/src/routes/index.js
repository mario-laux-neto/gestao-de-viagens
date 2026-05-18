const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const destinoRoutes = require('./destinoRoutes');
const roteiroRoutes = require('./roteiroRoutes');
const atividadeRoutes = require('./atividadeRoutes');

router.get('/', (req, res) => {
  res.json({
    message: 'API Organização de Viagens',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      usuarios: '/api/usuarios',
      destinos: '/api/destinos',
      roteiros: '/api/roteiros',
      atividades: '/api/atividades'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/destinos', destinoRoutes);
router.use('/roteiros', roteiroRoutes);
router.use('/atividades', atividadeRoutes);

module.exports = router;
