import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '../../components/Button';
import './ResetPassword.css';

export function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados de Validação do Token
    const [validando, setValidando] = useState(true);
    const [tokenValido, setTokenValido] = useState(false);
    const [expirado, setExpirado] = useState(false);
    const [emailOculto, setEmailOculto] = useState('');

    // Valida o token no carregamento da página
    useEffect(() => {
        async function verificarToken() {
            if (!token) {
                setValidando(false);
                return;
            }
            try {
                const res = await api.post('/auth/validar-token', { token });
                if (res.data?.data?.valido) {
                    setTokenValido(true);
                } else if (res.data?.data?.expirado) {
                    setExpirado(true);
                    setEmailOculto(res.data.data.email);
                }
            } catch (err) {
                console.error('Erro ao validar token:', err);
                setTokenValido(false);
            } finally {
                setValidando(false);
            }
        }
        verificarToken();
    }, [token]);

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

        if (!token) {
            toast.error('Token de redefinição não encontrado na URL.');
            return;
        }

        if (!senha || !confirmarSenha) {
            toast.error('Preencha todos os campos obrigatórios.');
            return;
        }

        if (senha.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            toast.error('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/redefinir-senha', { token, senha });
            toast.success('Senha redefinida com sucesso! Faça login com sua nova senha.');
            navigate('/login');
        } catch (err) {
            console.error('Erro ao redefinir senha:', err);
            const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Token inválido ou expirado.';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    if (validando) {
        return (
            <div className="auth-container">
                <div className="auth-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--ink-soft)' }}>
                        Verificando link de recuperação...
                    </p>
                </div>
            </div>
        );
    }

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
                                Defina uma<br />
                                <em>nova senha.</em>
                            </h3>
                            <p className="pitch-sub">
                                Crie uma senha forte e única. Você poderá acessar imediatamente depois de salvar.
                            </p>
                        </div>
                        <p className="quote">"Boas senhas têm 12+ caracteres."</p>
                    </div>
                    <div className="auth-form-side">
                        <h2>Nova senha</h2>

                        {!token ? (
                            <div className="token-error">
                                <p>Nenhum token de redefinição válido foi detectado na URL.</p>
                                <Link to="/esqueci-senha" className="btn-retry" style={{ display: 'block', marginTop: '16px', textDecoration: 'none', background: 'var(--accent)', color: 'white', padding: '10px 20px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>
                                    Solicitar novo link
                                </Link>
                            </div>
                        ) : expirado ? (
                            <div className="token-error" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏰</div>
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--accent)', marginBottom: '8px' }}>Link de Recuperação Expirado</h3>
                                <p style={{ color: 'var(--ink-soft)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                                    Este link de recuperação expirou (ele é válido por 30 minutos).
                                </p>
                                <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--line)', borderRadius: '6px', padding: '14px', marginBottom: '20px', fontSize: '13.5px', color: 'var(--accent)', lineHeight: '1.5', textAlign: 'left' }}>
                                    📧 <strong>Novo e-mail enviado!</strong><br />
                                    Geramos automaticamente um novo link e enviamos para o e-mail cadastrado: <strong>{emailOculto}</strong>.
                                </div>
                                <Link to="/login" className="btn-retry" style={{ display: 'block', textDecoration: 'none', background: 'var(--ink)', color: 'white', padding: '10px 20px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>
                                    Voltar para o Login
                                </Link>
                            </div>
                        ) : !tokenValido ? (
                            <div className="token-error" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', marginBottom: '16px' }}>❌</div>
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--accent)', marginBottom: '8px' }}>Link Inválido</h3>
                                <p style={{ color: 'var(--ink-soft)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                    O link que você acessou é inválido ou já foi utilizado.
                                </p>
                                <Link to="/esqueci-senha" className="btn-retry" style={{ display: 'block', textDecoration: 'none', background: 'var(--accent)', color: 'white', padding: '10px 20px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>
                                    Solicitar Novo Link
                                </Link>
                            </div>
                        ) : (
                            <>
                                <p className="lede">Você está definindo uma nova senha de acesso.</p>
                                <form onSubmit={handleSubmit}>
                                    <PasswordInput
                                        id="senha"
                                        label="Nova senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        placeholder="Sua nova senha"
                                        required
                                        disabled={loading}
                                        showToggleText={true}
                                    />

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

                                    <div className="field-hint" style={{ marginBottom: '16px', marginTop: senha ? '-4px' : '6px' }}>
                                        Mínimo 6 caracteres
                                    </div>

                                    <PasswordInput
                                        id="confirmarSenha"
                                        label="Confirmar nova senha"
                                        value={confirmarSenha}
                                        onChange={(e) => setConfirmarSenha(e.target.value)}
                                        placeholder="Repita a nova senha"
                                        required
                                        disabled={loading}
                                        showToggleText={false}
                                    />

                                    <Button
                                        type="submit"
                                        variant="accent"
                                        className="block"
                                        style={{ marginTop: '24px' }}
                                        loading={loading}
                                        disabled={loading}
                                    >
                                        Salvar nova senha
                                    </Button>
                                </form>
                            </>
                        )}

                        <p className="auth-foot">
                            Lembrou da senha? <Link to="/login">Entrar</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
