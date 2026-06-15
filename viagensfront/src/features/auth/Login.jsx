import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '../../components/Button';
import './Login.css';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [keepConnected, setKeepConnected] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await login(email, senha);
      toast.success('Bem-vindo(a) de volta!');
      navigate('/');
    } catch (err) {
      console.error("Erro ao autenticar:", err);
      const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Email ou senha incorretos';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleNotImplemented = (e, screenName) => {
    e.preventDefault();
    toast.error(`A tela de ${screenName} não está implementada nesta versão.`);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-screen">
          <div className="auth-side">
            <div className="brand-big">
              <span className="ov">OV</span>
              Organiza Viagens
            </div>
            <div>
              <h3 className="pitch">
                Sua viagem,<br />
                <em>do sonho ao check-in.</em>
              </h3>
              <p className="pitch-sub">
                Centralize destinos, monte roteiros e acompanhe atividades em um só lugar.
              </p>
            </div>
            <p className="quote">"Tirar a viagem da cabeça e da bagunça das abas."</p>
          </div>
          <div className="auth-form-side">
            <h2>Entrar</h2>
            <p className="lede">Acesse sua conta para continuar planejando.</p>

            <form onSubmit={handleSubmit}>
              <Input
                id="email"
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                required
                disabled={loading}
              />

              <PasswordInput
                id="senha"
                label="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                required
                disabled={loading}
                showToggleText={true}
              />

              <div className="row-flex" style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={keepConnected}
                    onChange={(e) => setKeepConnected(e.target.checked)}
                  />
                  Manter conectado
                </label>
                <Link
                  to="/esqueci-senha"
                  style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}
                >
                  Esqueci a senha
                </Link>


              </div>

              <Button
                type="submit"
                variant="accent"
                className="block"
                loading={loading}
                disabled={loading}
              >
                Entrar
              </Button>
            </form>
            <p className="auth-foot">
              Não tem conta? <Link to="/cadastro">Cadastrar-se</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
