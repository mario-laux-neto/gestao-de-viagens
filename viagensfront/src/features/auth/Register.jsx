import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '../../components/Button';
import './Register.css';

export function Register() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
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
              <Input
                id="nome"
                label="Nome completo"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                required
                disabled={loading}
              />
              
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

              <div className="field-row">
                <PasswordInput
                  id="senha"
                  label="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Senha forte"
                  required
                  disabled={loading}
                  showToggleText={false}
                />

                <PasswordInput
                  id="confirmarSenha"
                  label="Confirmar senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a senha"
                  required
                  disabled={loading}
                  showToggleText={false}
                />
              </div>

              {senha && (
                <div className="pass-strength-wrap" style={{ marginTop: '6px', marginBottom: '12px' }}>
                  <div className="pass-strength">
                    <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s ease' }}></div>
                  </div>
                  <div className="pass-strength-row">
                    <span>Força</span>
                    <span style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                </div>
              )}
              
              <div className="field-hint" style={{ marginBottom: '16px', marginTop: senha ? '-4px' : '6px' }}>Mínimo 8 caracteres</div>

              <Button
                type="submit"
                variant="accent"
                className="block"
                style={{ marginTop: '16px' }}
                loading={loading}
                disabled={loading}
              >
                Cadastrar
              </Button>
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
