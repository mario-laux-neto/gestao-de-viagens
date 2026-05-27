import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Login.css';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
              <div className="field">
                <label>E-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  required
                  disabled={loading}
                />
              </div>
              <div className="field">
                <label>Senha</label>
                <div className="input-pass">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Sua senha"
                    required
                    disabled={loading}
                  />
                  <button 
                    className="pass-toggle" 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    <span className="eye">
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </span>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>
              <div className="row-flex" style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
                <label className="checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={keepConnected} 
                    onChange={(e) => setKeepConnected(e.target.checked)}
                  />
                  Manter conectado
                </label>
                <a 
                  href="#" 
                  onClick={(e) => handleNotImplemented(e, 'Recuperação de Senha')}
                  style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}
                >
                  Esqueci a senha
                </a>
              </div>
              <button 
                type="submit" 
                className="btn accent block" 
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            <p className="auth-foot">
              Não tem conta?{' '}
              <a 
                href="#" 
                onClick={(e) => handleNotImplemented(e, 'Cadastro')}
              >
                Cadastrar-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
