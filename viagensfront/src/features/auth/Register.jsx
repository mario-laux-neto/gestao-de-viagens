import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Register.css';

export function Register() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: 'transparent', width: '0%' };
    
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) {
      return { label: 'FRACA', color: 'var(--accent)', width: '25%' };
    } else if (score <= 3) {
      return { label: 'MÉDIA', color: 'var(--warn)', width: '60%' };
    } else {
      return { label: 'FORTE', color: 'var(--ok)', width: '100%' };
    }
  };

  const strength = getPasswordStrength(senha);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    if (senha.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await registrar(nome, email, senha);
      toast.success('Conta criada com sucesso! Bem-vindo(a).');
      navigate('/');
    } catch (err) {
      console.error("Erro ao registrar:", err);
      const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
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
                Comece sua<br />
                <em>próxima viagem.</em>
              </h3>
              <p className="pitch-sub">
                Cadastro gratuito. Comece a montar seus roteiros em segundos.
              </p>
            </div>
            <p className="quote">"Quatro CRUDs. Um só lugar."</p>
          </div>
          <div className="auth-form-side">
            <h2>Criar conta</h2>
            <p className="lede">Preencha seus dados para criar uma conta de usuário comum.</p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Nome completo</label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  disabled={loading}
                />
              </div>
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

              <div className="field-row">
                <div className="field">
                  <label>Senha</label>
                  <div className="input-pass">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Senha forte"
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
                    </button>
                  </div>
                  {senha && (
                    <div className="pass-strength-wrap">
                      <div className="pass-strength">
                        <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s ease' }}></div>
                      </div>
                      <div className="pass-strength-row">
                        <span>Força</span>
                        <span style={{ color: strength.color }}>{strength.label}</span>
                      </div>
                    </div>
                  )}
                  <div className="field-hint">Mínimo 8 caracteres</div>
                </div>

                <div className="field">
                  <label>Confirmar senha</label>
                  <div className="input-pass">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      placeholder="Repita a senha"
                      required
                      disabled={loading}
                    />
                    <button 
                      className="pass-toggle" 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      <span className="eye">
                        {showConfirmPassword ? (
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
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn accent block" 
                style={{ marginTop: '16px' }}
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>
            <p className="auth-foot">
              Já tem conta? <Link to="/login">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
