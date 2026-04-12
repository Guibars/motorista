import { useState, useEffect } from 'react';
import { Zap, BatteryCharging, Clock, CreditCard, AlertCircle, QrCode } from 'lucide-react';

export function ChargeView() {
  const [isScanning, setIsScanning] = useState(false);
  const [session, setSession] = useState<any | null>(null);

  // Simulate an active session after scanning
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSession({
        id: 'sim-123',
        batteryCurrent: 45,
        currentPower: 48.5,
        kwhAdded: 12.4,
        estimatedTimeRemaining: 25,
        cost: 18.60
      });
    }, 2000);
  };

  const handleStopCharging = () => {
    setSession(null);
  };

  if (!session) {
    return (
      <div className="pt-24 px-4 pb-32 h-full overflow-y-auto relative z-10">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e7e7e7] to-[#b0b0b0] mb-8 tracking-tight drop-shadow-md">Recarga</h2>

        {/* QR Code Scanner Placeholder */}
        <div className="liquid-glass rounded-[2rem] p-8 flex flex-col items-center justify-center mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D518E]/10 to-transparent pointer-events-none"></div>
          <div className="w-32 h-32 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(13,81,142,0.3)] relative">
            <div className={`absolute inset-0 border-2 border-[#FAB515] rounded-[2rem] ${isScanning ? 'animate-ping' : 'animate-pulse'} opacity-50`}></div>
            <QrCode size={64} className="text-[#FAB515]" />
          </div>
          <h3 className="text-2xl font-bold text-[#e7e7e7] mb-2">Escanear QR Code</h3>
          <p className="text-[#b0b0b0] text-sm mb-8 max-w-[200px]">Aponte a câmera para o QR Code no eletroposto para iniciar.</p>
          
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] px-8 py-4 rounded-full font-bold shadow-[0_8px_24px_0_rgba(13,81,142,0.4)] hover:shadow-[0_8px_32px_0_rgba(13,81,142,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {isScanning ? 'Conectando...' : 'Abrir Câmera'}
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-[#b0b0b0] text-sm font-medium uppercase tracking-widest">Ou insira o código</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <div className="flex space-x-3 mb-10">
          <input 
            type="text" 
            placeholder="Ex: BR-FOT-1234" 
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#e7e7e7] focus:outline-none focus:border-[#FAB515] focus:bg-white/10 transition-all backdrop-blur-md uppercase text-center font-mono tracking-wider"
          />
          <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-[#FAB515] px-6 rounded-2xl font-bold transition-all shadow-lg backdrop-blur-md">
            OK
          </button>
        </div>

        <h3 className="text-xl font-bold text-[#e7e7e7] mb-5">Sessões Recentes</h3>
        
        <div className="space-y-4">
          {[1, 2].map((_, i) => (
            <div key={i} className="liquid-glass rounded-2xl p-5 flex items-center justify-between liquid-glass-hover">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#0D518E]/20 flex items-center justify-center border border-[#0D518E]/30">
                  <BatteryCharging size={20} className="text-[#FAB515]" />
                </div>
                <div>
                  <p className="font-bold text-[#e7e7e7]">Eletroposto Fotus {i + 1}</p>
                  <p className="text-xs text-[#b0b0b0] mt-1">Hoje, 14:30 • 45 min</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#FAB515]">R$ 32,50</p>
                <p className="text-xs text-[#b0b0b0] mt-1">22 kWh</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 pb-32 h-full overflow-y-auto relative z-10">
      <div className="liquid-glass rounded-[2rem] p-6 mb-6 relative overflow-hidden animate-in fade-in zoom-in-95">
        {/* Animated Background Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#0D518E]/30 blur-3xl rounded-full pointer-events-none animate-pulse"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h2 className="text-[#b0b0b0] text-sm font-medium uppercase tracking-widest">Fotus Fast Charge</h2>
            <p className="text-[#e7e7e7] font-extrabold text-xl">Sessão Ativa</p>
          </div>
          <div className="px-3 py-1.5 bg-[#0D518E]/30 border border-[#0D518E]/50 text-[#FAB515] rounded-full text-xs font-bold animate-pulse flex items-center space-x-1.5 shadow-[0_0_15px_rgba(13,81,142,0.5)]">
            <div className="w-2 h-2 bg-[#FAB515] rounded-full shadow-[0_0_8px_#FAB515]"></div>
            <span>Carregando</span>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="relative w-56 h-56">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(250,181,21,0.3)]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#FAB515" strokeWidth="6" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * session.batteryCurrent) / 100}
                className="transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-[#e7e7e7] tracking-tighter">{Math.floor(session.batteryCurrent)}%</span>
              <span className="text-[#b0b0b0] text-sm font-medium flex items-center mt-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Zap size={14} className="text-[#FAB515] mr-1" />
                {session.currentPower.toFixed(1)} kW
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 shadow-inner">
            <BatteryCharging size={24} className="text-[#FAB515] mx-auto mb-2 drop-shadow-[0_0_8px_rgba(250,181,21,0.5)]" />
            <p className="text-xl font-extrabold text-[#e7e7e7]">{session.kwhAdded.toFixed(2)}</p>
            <p className="text-xs text-[#b0b0b0] font-medium mt-1">kWh</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 shadow-inner">
            <Clock size={24} className="text-[#FAB515] mx-auto mb-2 drop-shadow-[0_0_8px_rgba(250,181,21,0.5)]" />
            <p className="text-xl font-extrabold text-[#e7e7e7]">{session.estimatedTimeRemaining || '--'}</p>
            <p className="text-xs text-[#b0b0b0] font-medium mt-1">min rest.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 shadow-inner">
            <CreditCard size={24} className="text-[#FAB515] mx-auto mb-2 drop-shadow-[0_0_8px_rgba(250,181,21,0.5)]" />
            <p className="text-xl font-extrabold text-[#e7e7e7]">R$ {session.cost.toFixed(2)}</p>
            <p className="text-xs text-[#b0b0b0] font-medium mt-1">Custo</p>
          </div>
        </div>
      </div>

      <div className="liquid-glass rounded-2xl p-5 mb-8 flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-[#FAB515]/20 flex items-center justify-center flex-shrink-0 border border-[#FAB515]/30">
          <AlertCircle size={20} className="text-[#FAB515]" />
        </div>
        <p className="text-sm text-[#e7e7e7] leading-relaxed">
          Você será notificado quando a recarga atingir <strong className="text-[#FAB515]">80%</strong> ou for concluída.
        </p>
      </div>

      <button 
        onClick={handleStopCharging}
        className="w-full bg-red-500/20 backdrop-blur-md text-red-500 border border-red-500/30 py-4 rounded-2xl font-bold text-lg hover:bg-red-500/30 transition-all shadow-[0_8px_24px_rgba(239,68,68,0.2)] hover:shadow-[0_8px_32px_rgba(239,68,68,0.3)]"
      >
        Parar Recarga
      </button>
    </div>
  );
}
