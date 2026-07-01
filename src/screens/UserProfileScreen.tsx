import { ArrowLeft, User, ShieldCheck, Mail, Calendar, Key, Smartphone, Clock, LogOut, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { buttons, texts, containers, cards } from '../globalStyle';

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

// ─── Props ──────────────────────────────────────────────────────────────────

interface UserProfileScreenProps {
  onBack: () => void;
  onLogout?: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function UserProfileScreen({ onBack, onLogout }: UserProfileScreenProps) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className={containers.screenDashboard}>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">Usuário não encontrado.</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  // Mock data for the profile
  const profileStats = [
    { label: 'Membro desde', value: 'Janeiro de 2026', icon: <Calendar size={18} /> },
    { label: 'Último acesso', value: 'Hoje às 14:32', icon: <Clock size={18} /> },
    { label: 'Dispositivos', value: '2 ativos', icon: <Smartphone size={18} /> },
  ];

  const securityItems = [
    { label: 'Autenticação em dois fatores', status: 'inativo' as const },
    { label: 'Notificações de login', status: 'ativo' as const },
    { label: 'Sessão atual', status: 'ativo' as const },
  ];

  return (
    <div className={containers.screenDashboard}>
      <div className={containers.dashboardWrapper}>
        {/* ── Back ── */}
        <button onClick={onBack} className={buttons.back}>
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* ── Profile Header ── */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-6 md:p-8 rounded-2xl border border-slate-700/50 backdrop-blur-md shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div
                className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getAvatarColor(user.name)} flex items-center justify-center shadow-2xl shadow-black/30`}
              >
                <span className="text-4xl font-bold text-white">{user.avatar}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-slate-800 flex items-center justify-center shadow-lg">
                <CheckCircle size={14} className="text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className={texts.h1Dashboard}>{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span className={texts.badgeStatus}>
                  <ShieldCheck size={14} /> Conta Verificada
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                  <User size={12} />
                  Usuário
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">{user.email}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className={buttons.secondary}>
                <Settings size={16} /> Editar Perfil
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium rounded-lg transition-all border border-red-500/20 flex items-center gap-2"
              >
                <LogOut size={16} /> Sair
              </button>
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className={containers.mainGrid}>
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Details */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-lg">
              <h2 className={texts.h2Section}>
                <User className="text-blue-400" size={20} /> Detalhes da Conta
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/30">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Nome completo</p>
                  <p className="text-sm font-semibold text-slate-100">{user.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/30">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">E-mail</p>
                  <p className="text-sm font-semibold text-slate-100">{user.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/30">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Iniciais do avatar</p>
                  <p className="text-sm font-semibold text-slate-100">{user.avatar}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/30">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Tipo de conta</p>
                  <p className="text-sm font-semibold text-blue-400">Gratuita</p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-lg">
              <h2 className={texts.h2Section}>
                <Key className="text-emerald-400" size={20} /> Segurança
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      <Key size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Senha</p>
                      <p className="text-xs text-slate-500">Última alteração há 30 dias</p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Alterar
                  </button>
                </div>

                {securityItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        item.status === 'ativo' ? 'bg-emerald-500/10' : 'bg-slate-700/50'
                      }`}>
                        {item.status === 'ativo'
                          ? <CheckCircle size={18} className="text-emerald-400" />
                          : <AlertCircle size={18} className="text-slate-400" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{item.label}</p>
                        <p className={`text-xs ${item.status === 'ativo' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {item.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </p>
                      </div>
                    </div>
                    <button className={`text-xs font-medium transition-colors ${
                      item.status === 'ativo'
                        ? 'text-orange-400 hover:text-orange-300'
                        : 'text-blue-400 hover:text-blue-300'
                    }`}>
                      {item.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className={cards.contactInfoCard}>
              <h2 className={texts.h2Section}>
                <Calendar className="text-blue-400" size={20} /> Estatísticas
              </h2>
              <div className="space-y-4">
                {profileStats.map((stat) => (
                  <div key={stat.label} className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-700/50 rounded-lg text-slate-400">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                      <p className="text-sm font-medium text-slate-200">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-lg">
              <h2 className={texts.h2Section}>
                <Smartphone className="text-purple-400" size={20} /> Sessões Ativas
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">Este dispositivo</p>
                    <p className="text-xs text-slate-500">Chrome · Linux · Ativo agora</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                  <div className="w-2 h-2 rounded-full bg-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">Dispositivo móvel</p>
                    <p className="text-xs text-slate-500">Último acesso há 2 dias</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
