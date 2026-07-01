import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, LogOut, Settings, LogIn, X, ShieldCheck, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle, Sun, Moon, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';

// ─── Color palette for avatar backgrounds ───────────────────────────────────

const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Types ──────────────────────────────────────────────────────────────────

type ModalMode = 'login' | 'register' | 'forgotPassword';

// ─── Props ──────────────────────────────────────────────────────────────────

interface UserProfileMenuProps {
  onProfileClick?: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function UserProfileMenu({ onProfileClick }: UserProfileMenuProps) {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const { preferences, toggleTheme, setCompactView } = usePreferences();
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('login');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ── Login form state ──
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ── Register form state ──
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowConfirm, setRegShowConfirm] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // ── Forgot password form state ──
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Close menu on click outside
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Close on Escape
  useEffect(() => {
    if (!showMenu) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMenu(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showMenu]);

  // ── Reset form state when modal opens/mode changes ──
  useEffect(() => {
    if (!showAuthModal) return;
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegError('');
    setRegSuccess('');
    setForgotEmail('');
    setForgotError('');
    setForgotSuccess('');
  }, [showAuthModal, modalMode]);

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setShowAuthModal(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Preencha todos os campos.');
      return;
    }

    const success = login(loginEmail.trim(), loginPassword);
    if (success) {
      setLoginEmail('');
      setLoginPassword('');
      setShowAuthModal(false);
    } else {
      setLoginError('E-mail ou senha inválidos.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    // Validações
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setRegError('Preencha todos os campos.');
      return;
    }

    if (regName.trim().length < 2) {
      setRegError('O nome deve ter pelo menos 2 caracteres.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('As senhas não conferem.');
      return;
    }

    const success = register(regName.trim(), regEmail.trim(), regPassword);
    if (success) {
      setRegSuccess('Conta criada com sucesso!');
      // Redireciona para o formulário de login após 1.5s
      setTimeout(() => {
        setModalMode('login');
        setRegSuccess('');
      }, 1500);
    } else {
      setRegError('Este e-mail já está cadastrado. Tente outro ou faça login.');
    }
  };

  const handleLogout = () => {
    logout();
    setShowMenu(false);
  };

  const switchMode = () => {
    setModalMode((prev) => {
      if (prev === 'forgotPassword') return 'login';
      return prev === 'login' ? 'register' : 'login';
    });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.trim()) {
      setForgotError('Informe seu e-mail.');
      return;
    }

    // Simula envio de e-mail de recuperação
    const stored = localStorage.getItem('pega-corrupcao-users');
    if (!stored) {
      setForgotError('Nenhuma conta encontrada com este e-mail.');
      return;
    }
    const users = JSON.parse(stored);
    const found = Array.isArray(users) && users.some((u: any) => u.email?.toLowerCase() === forgotEmail.trim().toLowerCase());

    if (found) {
      setForgotSuccess(`Enviamos um link de recuperação para ${forgotEmail.trim()}. Verifique sua caixa de entrada.`);
    } else {
      setForgotError('Nenhuma conta encontrada com este e-mail.');
    }
  };

  const inputClasses = "w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all";
  const inputErrorClasses = "w-full bg-slate-900/60 border border-red-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all";

  return (
    <div className="relative flex-shrink-0">
      {/* ── Avatar / Login Button ── */}
      {isAuthenticated && user ? (
        <button
          ref={buttonRef}
          onClick={() => setShowMenu(!showMenu)}
          className={`flex items-center gap-2 p-1 rounded-xl transition-all ${
            showMenu
              ? 'bg-blue-600/20 ring-2 ring-blue-500/50'
              : 'hover:bg-slate-700/70 hover:ring-2 hover:ring-slate-600/50'
          }`}
          aria-label="Menu do usuário"
          aria-expanded={showMenu}
        >
          <div
            className={`w-9 h-9 rounded-lg bg-gradient-to-br ${getAvatarColor(user.name)} flex items-center justify-center shadow-lg shadow-black/20`}
          >
            <span className="text-sm font-bold text-white">{user.avatar}</span>
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-300 max-w-[100px] truncate">
            {user.name.split(' ')[0]}
          </span>
        </button>      ) : (
        <button
          onClick={() => openModal('login')}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all group"
          title="Fazer login"
          aria-label="Fazer login">
          <div className="w-5 h-5 rounded-md bg-slate-700 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
            <User size={14} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
          </div>
        </button>
      )}

      {/* ── Dropdown Menu (authenticated) ── */}
      {showMenu && isAuthenticated && user && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* User info header */}
          <div className="px-5 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(user.name)} flex items-center justify-center shadow-lg shadow-black/20 flex-shrink-0`}
              >
                <span className="text-lg font-bold text-white">{user.avatar}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-100 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <ShieldCheck size={10} />
                  Conta verificada
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2 px-2">
            <button
              onClick={() => {
                setShowMenu(false);
                onProfileClick?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
                <User size={16} />
              </div>
              <div className="text-left">
                <p className="font-medium">Meu Perfil</p>
                <p className="text-xs text-slate-500">Informações da conta</p>
              </div>
            </button>

            {/* ── Theme Toggle ── */}
            <button
              onClick={() => {
                toggleTheme();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all">
                {preferences.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </div>
              <div className="text-left">
                <p className="font-medium">
                  {preferences.theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                </p>
                <p className="text-xs text-slate-500">Alternar tema da interface</p>
              </div>
            </button>

            {/* ── Compact View Toggle ── */}
            <button
              onClick={() => {
                setCompactView(!preferences.compactView);
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-all">
                <Settings size={16} />
              </div>
              <div className="text-left">
                <p className="font-medium">
                  {preferences.compactView ? 'Visão Normal' : 'Visão Compacta'}
                </p>
                <p className="text-xs text-slate-500">Densidade da interface</p>
              </div>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-700/50 px-2 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                <LogOut size={16} />
              </div>
              <div className="text-left">
                <p className="font-medium">Sair</p>
                <p className="text-xs text-slate-500">Desconectar da conta</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── Auth Modal (Login / Register) — renderizado via portal no body ── */}
      {showAuthModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuthModal(false);
          }}
        >
          <div className="relative w-full max-w-md mx-4 sm:mx-auto bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl shadow-black/50 my-8 max-h-[calc(100vh-4rem)] flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-all z-10"
            >
              <X size={18} />
            </button>

            {/* ── Header ── */}
            <div className="px-6 sm:px-8 pt-5 pb-4 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-700/50 flex-shrink-0">
              <h2 className="text-lg font-semibold text-white">
                {modalMode === 'login' ? 'Entrar' : modalMode === 'register' ? 'Criar Conta' : 'Recuperar Senha'}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {modalMode === 'login'
                  ? 'Acesse sua conta para continuar'
                  : modalMode === 'register'
                  ? 'Cadastre-se para começar a usar'
                  : 'Receba um link para redefinir sua senha'
                }
              </p>
            </div>

            {/* ── Forms ── */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto overscroll-contain flex-1">
              {/* ── Login Form ── */}
              {modalMode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                      placeholder="seu@email.com"
                      className={loginError ? inputErrorClasses : inputClasses}
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={loginShowPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
                        placeholder="Sua senha"
                        className={`${loginError ? inputErrorClasses : inputClasses} pr-11`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setLoginShowPassword(!loginShowPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        tabIndex={-1}
                      >
                        {loginShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {loginError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                      <span className="text-sm text-red-400">{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    <LogIn size={18} />
                    Entrar
                  </button>

                  {/* Forgot password link */}
                  <div className="text-center -mt-1">
                    <button
                      type="button"
                      onClick={() => setModalMode('forgotPassword')}
                      className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  </div>

                  {/* Switch to register */}
                  <div className="text-center pt-1">
                    <p className="text-sm text-slate-400">
                      Não tem uma conta?{' '}
                      <button
                        type="button"
                        onClick={switchMode}
                        className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                      >
                        Cadastre-se
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* ── Forgot Password Form ── */}
              {modalMode === 'forgotPassword' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {!forgotSuccess ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                          E-mail cadastrado
                        </label>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => { setForgotEmail(e.target.value); setForgotError(''); }}
                          placeholder="seu@email.com"
                          className={forgotError ? inputErrorClasses : inputClasses}
                          required
                          autoFocus
                        />
                      </div>

                      {forgotError && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                          <span className="text-sm text-red-400">{forgotError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-2"
                      >
                        <Send size={18} />
                        Enviar link de recuperação
                      </button>
                    </>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-emerald-400">E-mail enviado!</p>
                          <p className="text-xs text-emerald-400/70 mt-1">{forgotSuccess}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 text-center">
                        Não recebeu o e-mail? Verifique sua caixa de spam ou{' '}
                        <button
                          type="button"
                          onClick={() => { setForgotSuccess(''); setForgotEmail(''); }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          tente novamente
                        </button>.
                      </p>
                    </div>
                  )}

                  {/* Back to login */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setModalMode('login')}
                      className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <ArrowLeft size={14} />
                      Voltar para o login
                    </button>
                  </div>
                </form>
              )}

              {/* ── Register Form ── */}
              {modalMode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => { setRegName(e.target.value); setRegError(''); }}
                      placeholder="Seu nome"
                      className={regError ? inputErrorClasses : inputClasses}
                      required
                      minLength={2}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => { setRegEmail(e.target.value); setRegError(''); }}
                      placeholder="seu@email.com"
                      className={regError ? inputErrorClasses : inputClasses}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => { setRegPassword(e.target.value); setRegError(''); }}
                        placeholder="Mínimo 6 caracteres"
                        className={`${regError ? inputErrorClasses : inputClasses} pr-11`}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowPassword(!regShowPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        tabIndex={-1}
                      >
                        {regShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Confirmar senha
                    </label>
                    <div className="relative">
                      <input
                        type={regShowConfirm ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => { setRegConfirmPassword(e.target.value); setRegError(''); }}
                        placeholder="Repita a senha"
                        className={`${regError ? inputErrorClasses : inputClasses} pr-11`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowConfirm(!regShowConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        tabIndex={-1}
                      >
                        {regShowConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {regError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                      <span className="text-sm text-red-400">{regError}</span>
                    </div>
                  )}

                  {/* Success */}
                  {regSuccess && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-emerald-400">{regSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                  >
                    <UserPlus size={18} />
                    Criar Conta
                  </button>

                  {/* Switch to login */}
                  <div className="text-center pt-2">
                    <p className="text-sm text-slate-400">
                      Já tem uma conta?{' '}
                      <button
                        type="button"
                        onClick={switchMode}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        Fazer login
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
