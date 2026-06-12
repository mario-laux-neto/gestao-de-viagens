import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import './ForgotPassword.css';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [devLink, setDevLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Informe o e-mail cadastrado.');
            return;
        }

        setLoading(true);
        setDevLink('');
        try {
            const response = await api.post('/auth/esqueci-senha', { email });
            toast.success('Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.');

            // Atalho de desenvolvimento: se o back-end retornar o token gerado, exibe na tela para facilitar testes
            if (response.data?.data?.reset_token) {
                const token = response.data.data.reset_token;
                setDevLink(`/redefinir-senha?token=${token}`);
            }
        } catch (err) {
            console.error('Erro ao solicitar recuperação:', err);
            const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Erro ao processar solicitação.';
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
                                Recuperar<br />
                                <em>sua conta.</em>
                            </h3>
                            <p className="pitch-sub">
                                Em poucos passos você volta para o planejamento sem perder nenhum roteiro.
                            </p>
                        </div>
                        <p className="quote">"A senha vai e volta. Sua viagem fica."</p>
                    </div>
                    <div className="auth-form-side">
                        <Link to="/login" className="back-link">
                            ← Voltar para o login
                        </Link>
                        <h2>Esqueci a senha</h2>
                        <p className="lede">Informe seu e-mail. Enviaremos um link de redefinição válido por 30 minutos.</p>

                        <form onSubmit={handleSubmit}>
                            <Input
                                id="email"
                                label="E-mail cadastrado"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemplo@email.com"
                                required
                                disabled={loading}
                            />
                            <div className="field-hint">
                                Verifique também a caixa de spam após o envio.
                            </div>

                            <Button
                                type="submit"
                                variant="accent"
                                className="block"
                                style={{ marginTop: '16px' }}
                                loading={loading}
                                disabled={loading}
                            >
                                Enviar link de redefinição
                            </Button>
                        </form>

                        {devLink && (
                            <div className="dev-helper">
                                <p><strong>[Modo Dev] Link de recuperação gerado:</strong></p>
                                <Link to={devLink} className="dev-link">
                                    Clique aqui para ir direto redefinir a senha
                                </Link>
                            </div>
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
