import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginScreenProps {
  onLogin: (user: any) => void;
  onGuest: () => void;
}

export function LoginScreen({ onLogin, onGuest }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          onLogin(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          onLogin(data.user);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccept = () => {
    setShowTerms(false);
    onGuest();
  };

  return (
    <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Liquid Glass Animated Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#0D518E]/40 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#FAB515]/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Liquid Glass Card */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <img 
          src="https://res.cloudinary.com/ddtpuucfi/image/upload/v1776089289/CHARGE_3_afxm8u.png" 
          alt="Fotus Charge" 
          className="h-28 md:h-32 object-contain mb-6 drop-shadow-lg"
          referrerPolicy="no-referrer"
        />
        
        <h1 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#e7e7e7] to-[#b0b0b0] mb-8 text-center tracking-wide">
          Bem-Vindo(a) à Fotus Charge
        </h1>

        <form onSubmit={handleAuth} className="w-full space-y-4">
          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl text-center backdrop-blur-md">
              {error}
            </div>
          )}
          
          <div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-[#e7e7e7] placeholder-[#b0b0b0] focus:outline-none focus:border-[#FAB515] transition-colors backdrop-blur-sm"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-[#e7e7e7] placeholder-[#b0b0b0] focus:outline-none focus:border-[#FAB515] transition-colors backdrop-blur-sm"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#FAB515] text-[#121212] py-4 rounded-2xl font-bold text-lg hover:bg-[#e5a313] transition-all duration-300 shadow-[0_0_20px_rgba(250,181,21,0.3)] hover:shadow-[0_0_30px_rgba(250,181,21,0.5)] transform hover:-translate-y-1 mt-2 flex items-center justify-center disabled:opacity-70 disabled:transform-none"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (isSignUp ? 'Criar Conta' : 'Acessar Conta')}
          </button>
        </form>

        <div className="mt-6 w-full flex flex-col items-center space-y-3">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-[#b0b0b0] hover:text-white transition-colors"
          >
            {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Cadastre-se'}
          </button>
          
          <div className="w-full h-px bg-white/10 my-2"></div>
          
          <button 
            onClick={() => setShowTerms(true)}
            className="text-sm font-medium text-[#FAB515] hover:text-[#e5a313] transition-colors"
          >
            Entrar como Convidado
          </button>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <AnimatePresence>
        {showTerms && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowTerms(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-4">Termos e Condições</h2>
              
              <div className="text-sm text-gray-300 space-y-3 max-h-60 overflow-y-auto pr-2 mb-6">
                <p>
                  Ao entrar como convidado, você concorda com os seguintes termos de uso do aplicativo Fotus Charge:
                </p>
                <p>
                  1. O modo convidado oferece acesso limitado às funcionalidades do aplicativo.
                </p>
                <p>
                  2. Para realizar recargas, pagamentos ou salvar veículos, será necessário criar uma conta.
                </p>
                <p>
                  3. Seus dados de navegação poderão ser utilizados para melhorar a experiência do aplicativo.
                </p>
                <p>
                  4. A Fotus Charge não se responsabiliza por informações perdidas durante a sessão de convidado.
                </p>
              </div>
              
              <button 
                onClick={handleGuestAccept}
                className="w-full bg-[#FAB515] text-[#121212] py-3.5 rounded-xl font-bold hover:bg-[#e5a313] transition-colors"
              >
                Tomei Conhecimento
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
