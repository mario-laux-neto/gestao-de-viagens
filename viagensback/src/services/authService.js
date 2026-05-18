const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Usuario } = require('../models');
const { AppError } = require('../utils/errorHandler');

const SALT_ROUNDS = 12;

const gerarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, perfil: usuario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const registro = async ({ nome, email, senha }) => {
  const existe = await Usuario.findOne({ where: { email } });
  if (existe) throw new AppError('Email já cadastrado', 409);

  const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);
  const usuario = await Usuario.create({ nome, email, senha_hash });

  const token = gerarToken(usuario);

  return {
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
    token
  };
};

const login = async ({ email, senha }) => {
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) throw new AppError('Email ou senha incorretos', 401);

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) throw new AppError('Email ou senha incorretos', 401);

  const token = gerarToken(usuario);

  return {
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
    token
  };
};

const esqueciSenha = async ({ email }) => {
  const usuario = await Usuario.findOne({ where: { email } });

  // Retorna sempre sucesso para não revelar se email existe
  if (!usuario) {
    return { message: 'Se o email estiver cadastrado, você receberá instruções para redefinir a senha' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  await usuario.update({
    reset_token: resetTokenHash,
    reset_token_expira: new Date(Date.now() + 30 * 60 * 1000)
  });

  const resposta = { message: 'Se o email estiver cadastrado, você receberá instruções para redefinir a senha' };

  if (process.env.NODE_ENV === 'development') {
    resposta.reset_token = resetToken;
  }

  return resposta;
};

const redefinirSenha = async ({ token, senha }) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const usuario = await Usuario.findOne({
    where: { reset_token: tokenHash }
  });

  if (!usuario || !usuario.reset_token_expira || usuario.reset_token_expira < new Date()) {
    throw new AppError('Token inválido ou expirado', 400);
  }

  const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);

  await usuario.update({
    senha_hash,
    reset_token: null,
    reset_token_expira: null
  });

  return { message: 'Senha redefinida com sucesso' };
};

module.exports = { registro, login, esqueciSenha, redefinirSenha };
