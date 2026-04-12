import React, { useState } from 'react';
import { Zap } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'fotus' && password === 'novosprodutos') {
      onLogin({ 
        uid: 'fotus_admin',
        name: 'Fotus', 
        email: 'admin@fotus.com.br',
        photoURL: null
      });
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Liquid Glass Animated Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#0D518E]/40 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#FAB515]/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Liquid Glass Card */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <img 
          src="https://i.postimg.cc/zfh3tqwd/LOGO-Fotus-2A-1024x272.png" 
          alt="Fotus Charge" 
          className="h-16 object-contain mb-6 drop-shadow-lg"
          referrerPolicy="no-referrer"
        />
        
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e7e7e7] to-[#b0b0b0] mb-8 text-center tracking-tight">
          Fotus Charge
        </h1>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl text-center backdrop-blur-md">
              {error}
            </div>
          )}
          
          <div>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-[#e7e7e7] placeholder-[#b0b0b0] focus:outline-none focus:border-[#FAB515] transition-colors backdrop-blur-sm"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-[#e7e7e7] placeholder-[#b0b0b0] focus:outline-none focus:border-[#FAB515] transition-colors backdrop-blur-sm"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#FAB515] text-[#121212] py-4 rounded-2xl font-bold text-lg hover:bg-[#e5a313] transition-all duration-300 shadow-[0_0_20px_rgba(250,181,21,0.3)] hover:shadow-[0_0_30px_rgba(250,181,21,0.5)] transform hover:-translate-y-1 mt-4"
          >
            Acessar Conta
          </button>
        </form>
      </div>
    </div>
  );
}
