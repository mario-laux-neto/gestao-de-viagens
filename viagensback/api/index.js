// Entrypoint serverless da Vercel: reaproveita o app Express (sem app.listen).
// Em produção, as variáveis de ambiente vêm do painel da Vercel.
require('dotenv').config();

module.exports = require('../src/app');
