import { useState } from 'react';
import { User, Settings, Bell, Shield, CircleHelp, LogOut, Moon, Smartphone, X } from 'lucide-react';

interface ProfileViewProps {
  user: any;
  onLogout: () => void;
}

export function ProfileView({ user, onLogout }: ProfileViewProps) {
  const [userData, setUserData] = useState<any>(user);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editName, setEditName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveName = async () => {
    if (!editName) return;
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUserData({ ...userData, name: editName });
      setActiveModal(null);
    } catch (error) {
      console.error("Error updating name:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { id: 'data', icon: User, label: 'Meus Dados', value: userData?.name || 'Usuário' },
    { id: 'prefs', icon: Settings, label: 'Preferências de Recarga', value: 'CCS2, Tipo 2' },
    { id: 'notif', icon: Bell, label: 'Notificações', value: 'Ativadas' },
    { id: 'car', icon: Smartphone, label: 'Integração Veicular', value: 'CarPlay / Android Auto' },
    { id: 'theme', icon: Moon, label: 'Modo Escuro', value: 'Ativado' },
    { id: 'privacy', icon: Shield, label: 'Privacidade e Segurança', value: '' },
    { id: 'help', icon: CircleHelp, label: 'Ajuda e Suporte', value: '' },
  ];

  return (
    <div className="pt-[5.5rem] px-4 pb-28 h-full overflow-y-auto relative z-10 no-scrollbar">
      <div className="flex items-center space-x-5 mb-10 animate-in fade-in slide-in-from-top-4">
        <div className="w-20 h-20 liquid-glass rounded-full flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(250,181,21,0.3)]">
          {userData?.photoURL ? (
            <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User size={40} className="text-[#FAB515]" />
          )}
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e7e7e7] to-[#b0b0b0] tracking-tight drop-shadow-md">{userData?.name || 'Usuário'}</h2>
          <p className="text-sm font-medium text-[#b0b0b0] mb-2">{userData?.email || 'usuario@exemplo.com'}</p>
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#0D518E]/40 to-[#0b4275]/40 backdrop-blur-md text-[#FAB515] rounded-full text-xs font-bold border border-[#0D518E]/50 shadow-inner">
            Membro Premium
          </span>
        </div>
      </div>

      <div className="liquid-glass rounded-[2rem] overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button 
              key={item.id}
              onClick={() => setActiveModal(item.id)}
              className={`w-full flex items-center justify-between p-5 hover:bg-white/10 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#FAB515] shadow-inner">
                  <Icon size={20} />
                </div>
                <span className="font-bold text-[#e7e7e7]">{item.label}</span>
              </div>
              {item.value && (
                <span className="text-xs font-medium text-[#b0b0b0]">{item.value}</span>
              )}
            </button>
          );
        })}
      </div>

      <button 
        onClick={onLogout}
        className="w-full liquid-glass py-5 rounded-[2rem] font-bold text-red-400 flex items-center justify-center space-x-3 hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-bottom-8 liquid-glass-hover"
      >
        <LogOut size={20} />
        <span>Sair da Conta</span>
      </button>
      
      <p className="text-center text-xs font-medium text-[#b0b0b0] mt-8 tracking-widest uppercase">
        Fotus Charge v1.0.0 • Conectado
      </p>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[500] flex items-center justify-center p-4 animate-in fade-in">
          <div className="liquid-glass border border-white/20 rounded-[2rem] p-8 w-full max-w-sm relative shadow-[0_16px_40px_rgba(0,0,0,0.5)] animate-in zoom-in-95">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 text-[#b0b0b0] hover:text-[#e7e7e7] bg-white/5 rounded-full p-2 hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            {activeModal === 'data' && (
              <div>
                <h3 className="text-2xl font-extrabold text-[#e7e7e7] mb-6">Meus Dados</h3>
                <label className="block text-xs font-bold text-[#b0b0b0] mb-2 uppercase tracking-widest">Nome Completo</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#e7e7e7] focus:outline-none focus:border-[#FAB515] focus:bg-white/10 transition-all backdrop-blur-md mb-6"
                />
                <button 
                  onClick={handleSaveName}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold hover:shadow-[0_8px_30px_rgba(13,81,142,0.6)] transition-all disabled:opacity-50 shadow-[0_8px_24px_rgba(13,81,142,0.4)]"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            )}

            {activeModal === 'prefs' && (
              <div>
                <h3 className="text-2xl font-extrabold text-[#e7e7e7] mb-4">Preferências</h3>
                <p className="text-[#b0b0b0] text-sm mb-6 leading-relaxed">Filtre os postos no mapa apenas para os conectores compatíveis com seu veículo.</p>
                <div className="space-y-3 mb-8">
                  {['CCS2', 'Type 2', 'CHAdeMO'].map(plug => (
                    <label key={plug} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#FAB515] rounded" />
                      <span className="font-bold text-[#e7e7e7]">{plug}</span>
                    </label>
                  ))}
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold hover:shadow-[0_8px_30px_rgba(13,81,142,0.6)] transition-all shadow-[0_8px_24px_rgba(13,81,142,0.4)]">Salvar</button>
              </div>
            )}

            {activeModal === 'notif' && (
              <div>
                <h3 className="text-2xl font-extrabold text-[#e7e7e7] mb-6">Notificações</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="font-bold text-[#e7e7e7]">Fim de Recarga</span>
                    <input type="checkbox" defaultChecked className="toggle-checkbox accent-[#FAB515] w-6 h-6" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="font-bold text-[#e7e7e7]">Promoções</span>
                    <input type="checkbox" className="toggle-checkbox accent-[#FAB515] w-6 h-6" />
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold hover:shadow-[0_8px_30px_rgba(13,81,142,0.6)] transition-all shadow-[0_8px_24px_rgba(13,81,142,0.4)]">Concluído</button>
              </div>
            )}

            {activeModal === 'car' && (
              <div className="text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
                  <Smartphone size={40} className="text-[#FAB515]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#e7e7e7] mb-3">Integração Veicular</h3>
                <p className="text-[#b0b0b0] text-sm mb-8 leading-relaxed">Conecte o Fotus Charge ao painel do seu carro via Apple CarPlay ou Android Auto.</p>
                <button onClick={() => setActiveModal(null)} className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold hover:shadow-[0_8px_30px_rgba(13,81,142,0.6)] transition-all shadow-[0_8px_24px_rgba(13,81,142,0.4)]">Configurar Agora</button>
              </div>
            )}

            {activeModal === 'theme' && (
              <div>
                <h3 className="text-2xl font-extrabold text-[#e7e7e7] mb-6">Aparência</h3>
                <div className="space-y-3 mb-8">
                  <label className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl border border-[#FAB515]/50 cursor-pointer shadow-inner">
                    <input type="radio" name="theme" defaultChecked className="accent-[#FAB515] w-5 h-5" />
                    <span className="font-bold text-[#e7e7e7]">Modo Escuro (Padrão)</span>
                  </label>
                  <label className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5 opacity-50 cursor-not-allowed">
                    <input type="radio" name="theme" disabled className="accent-[#FAB515] w-5 h-5" />
                    <span className="font-bold text-[#e7e7e7]">Modo Claro (Em breve)</span>
                  </label>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold hover:shadow-[0_8px_30px_rgba(13,81,142,0.6)] transition-all shadow-[0_8px_24px_rgba(13,81,142,0.4)]">Fechar</button>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div>
                <h3 className="text-2xl font-extrabold text-[#e7e7e7] mb-4">Privacidade</h3>
                <p className="text-[#b0b0b0] text-sm mb-8 leading-relaxed">Gerencie como seus dados são utilizados.</p>
                <button className="w-full text-left p-4 text-red-400 font-bold hover:bg-white/10 rounded-2xl transition-colors mb-4 border border-red-500/20">
                  Excluir minha conta
                </button>
                <button onClick={() => setActiveModal(null)} className="w-full bg-white/10 text-[#e7e7e7] py-4 rounded-2xl font-bold hover:bg-white/20 transition-colors">Voltar</button>
              </div>
            )}

            {activeModal === 'help' && (
              <div className="text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
                  <CircleHelp size={40} className="text-[#FAB515]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#e7e7e7] mb-3">Precisa de ajuda?</h3>
                <p className="text-[#b0b0b0] text-sm mb-8 leading-relaxed">Nossa equipe de suporte está disponível 24/7 para ajudar com suas recargas.</p>
                <button onClick={() => setActiveModal(null)} className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold mb-3 hover:shadow-[0_8px_30px_rgba(13,81,142,0.6)] transition-all shadow-[0_8px_24px_rgba(13,81,142,0.4)]">Falar com Suporte</button>
                <button onClick={() => setActiveModal(null)} className="w-full bg-white/10 text-[#e7e7e7] py-4 rounded-2xl font-bold hover:bg-white/20 transition-colors">FAQ</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
