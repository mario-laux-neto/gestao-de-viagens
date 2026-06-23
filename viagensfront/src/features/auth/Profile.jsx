import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { LogOut, Trash2, Eye, EyeOff } from 'lucide-react';
import './Profile.css';

export function Profile() {
  const { usuario, logout, atualizarUsuario } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState('comum');
  
  const [fotoArquivo, setFotoArquivo] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(usuario?.foto || null);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvandoDados, setSalvandoDados] = useState(false);
  const [salvandoFoto, setSalvandoFoto] = useState(false);

  const temFotoAlterada = fotoPreview !== (usuario?.foto || null);

  useEffect(() => {
    carregarPerfilCompleto();
  }, []);

  const carregarPerfilCompleto = async () => {
    try {
      setCarregandoDados(true);
      const response = await api.get('/usuarios/perfil');
      const dadosUsuario = response.data.data;
      setNome(dadosUsuario.nome);
      setEmail(dadosUsuario.email);
      setPerfil(dadosUsuario.perfil || 'comum');
      setFotoPreview(dadosUsuario.foto || null);
      atualizarUsuario({
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        foto: dadosUsuario.foto || null
      });
    } catch (err) {
      console.error("Erro ao carregar dados de perfil do backend:", err);
      toast.error("Não foi possível carregar as informações do seu perfil.");
      if (usuario) {
        setNome(usuario.nome || '');
        setEmail(usuario.email || '');
        setPerfil(usuario.perfil || 'comum');
        setFotoPreview(usuario.foto || null);
      }
    } finally {
      setCarregandoDados(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!nome || !email) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (senhaAtual || novaSenha) {
      if (!senhaAtual || !novaSenha) {
        toast.error("Para alterar sua senha, preencha tanto a senha atual quanto a nova senha.");
        return;
      }
      if (novaSenha.length < 8) {
        toast.error("A nova senha deve ter no mínimo 8 caracteres.");
        return;
      }
    }

    setSalvandoDados(true);
    try {
      const response = await api.put(`/usuarios/${usuario.id}`, {
        nome,
        email
      });
      
      const dadosUsuarioAtualizado = response.data.data;
      
      if (senhaAtual && novaSenha) {
        await api.put('/usuarios/trocar-senha', {
          senha_atual: senhaAtual,
          nova_senha: novaSenha
        });
        setSenhaAtual('');
        setNovaSenha('');
      }

      atualizarUsuario({ 
        nome: dadosUsuarioAtualizado.nome, 
        email: dadosUsuarioAtualizado.email,
        foto: dadosUsuarioAtualizado.foto || null
      });
      
      toast.success("Dados atualizados com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      toast.error(err.response?.data?.error?.message || "Erro ao salvar alterações. O e-mail pode estar em uso.");
    } finally {
      setSalvandoDados(false);
    }
  };

  const handleCancel = () => {
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
      setFotoPreview(usuario.foto || null);
      setFotoArquivo(null);
    }
    setSenhaAtual('');
    setNovaSenha('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success("Alterações descartadas.");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Selecione um arquivo de imagem válido.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoArquivo(file);
      setFotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoDelete = (e) => {
    e.stopPropagation();
    setFotoArquivo(null);
    setFotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success("Foto removida da visualização. Salve para confirmar.");
  };

  const handleSavePhoto = async () => {
    setSalvandoFoto(true);
    try {
      const response = await api.put(`/usuarios/${usuario.id}`, {
        foto: fotoPreview
      });
      
      const dadosUsuarioAtualizado = response.data.data;
      
      atualizarUsuario({ 
        foto: dadosUsuarioAtualizado.foto || null
      });
      
      setFotoArquivo(null);
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar foto de perfil:", err);
      toast.error("Erro ao salvar foto de perfil.");
    } finally {
      setSalvandoFoto(false);
    }
  };

  const handleCancelPhoto = () => {
    setFotoPreview(usuario?.foto || null);
    setFotoArquivo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success("Alterações de foto descartadas.");
  };

  const handleLogout = () => {
    logout();
    toast.success("Sessão encerrada!");
    navigate('/login');
  };

  const getFotoUrl = (foto) => {
    if (!foto) return null;
    if (foto.startsWith('data:') || foto.startsWith('blob:') || foto.startsWith('http')) {
      return foto;
    }
    return `http://localhost:3000${foto}`;
  };

  const firstLetter = nome ? nome.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-container">
      <nav className="breadcrumb">
        <Link to="/">Início</Link>
        <span className="sep">/</span>
        <span>Meu perfil</span>
      </nav>

      <header className="page-h">
        <div>
          <div className="eyebrow">Conta</div>
          <h1 className="page-title">Meu perfil</h1>
          <p className="page-sub">Atualize seus dados pessoais e credenciais de acesso.</p>
        </div>
      </header>

      {carregandoDados ? (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-serif)', color: 'var(--ink-soft)' }}>
          Carregando dados cadastrais...
        </div>
      ) : (
        <div className="profile-grid">
          <aside className="profile-side">
            <div className="avatar-container">
              <div className="profile-avatar">
                {fotoPreview ? (
                  <img src={getFotoUrl(fotoPreview)} alt={nome} />
                ) : (
                  firstLetter
                )}
              </div>
              {fotoPreview && (
                <button 
                  type="button" 
                  className="avatar-delete-badge" 
                  onClick={handlePhotoDelete}
                  title="Excluir foto"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <h2 className="profile-name">{nome}</h2>
            <p className="profile-email">{email}</p>
            
            <div style={{ margin: '14px 0' }}>
              <span className={`perfil-tag ${perfil === 'admin' ? 'admin' : 'comum'}`}>
                {perfil === 'admin' ? 'Administrador' : 'Usuário comum'}
              </span>
            </div>

            <hr className="divider-vertical" />
            
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handlePhotoUpload} 
            />

            {temFotoAlterada ? (
              <div className="avatar-actions-row">
                <button 
                  type="button" 
                  className="btn-cancel-photo"
                  onClick={handleCancelPhoto}
                  disabled={salvandoFoto}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn-save-photo"
                  onClick={handleSavePhoto}
                  disabled={salvandoFoto}
                >
                  {salvandoFoto ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            ) : (
              <>
                <button 
                  type="button"
                  className="btn-change-photo"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Trocar foto
                </button>

                <button 
                  type="button"
                  onClick={handleLogout} 
                  className="btn-signout-link"
                  title="Encerrar sessão"
                >
                  Sair da conta
                </button>
              </>
            )}
          </aside>

          <section className="profile-forms">
            <div className="card">
              <form onSubmit={handleUpdateProfile}>
                <h3>Dados pessoais</h3>
                
                <div className="field">
                  <label htmlFor="nome">Nome completo *</label>
                  <input 
                    id="nome"
                    type="text" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    disabled={salvandoDados}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="email">E-mail corporativo *</label>
                  <input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    disabled={salvandoDados}
                    required
                  />
                </div>

                <hr className="divider-horizontal" />

                <h3>Trocar senha</h3>

                <div className="password-row">
                  <div className="field">
                    <label htmlFor="senhaAtual">Senha atual</label>
                    <div className="input-pass">
                      <input 
                        id="senhaAtual"
                        type={showSenhaAtual ? "text" : "password"} 
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        placeholder="Senha atual"
                        disabled={salvandoDados}
                      />
                      <button 
                        type="button" 
                        className="pass-toggle"
                        onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                      >
                        {showSenhaAtual ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showSenhaAtual ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="novaSenha">Nova senha</label>
                    <div className="input-pass">
                      <input 
                        id="novaSenha"
                        type={showNovaSenha ? "text" : "password"} 
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        disabled={salvandoDados}
                      />
                      <button 
                        type="button" 
                        className="pass-toggle"
                        onClick={() => setShowNovaSenha(!showNovaSenha)}
                      >
                        {showNovaSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showNovaSenha ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                    <span className="field-hint">Mínimo 8 caracteres</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={handleCancel}
                    disabled={salvandoDados}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={salvandoDados}
                  >
                    Salvar alterações
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
