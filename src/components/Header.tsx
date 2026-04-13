import { User, Bell, LogOut, Menu, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onProfileClick: () => void;
  onLogout: () => void;
  onTipsClick?: () => void;
}

export function Header({ onProfileClick, onLogout, onTipsClick }: HeaderProps) {
  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-[40px] border border-white/20 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-20 px-4 flex items-center justify-between relative overflow-hidden">
        {/* Liquid Glass Highlight Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

        <div className="flex items-center relative z-10 pl-2">
          <img 
            src="https://res.cloudinary.com/ddtpuucfi/image/upload/v1776089289/CHARGE_3_afxm8u.png" 
            alt="Fotus Charge" 
            className="h-20 md:h-24 scale-150 origin-left object-contain drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center space-x-3 relative z-10">
          {onTipsClick && (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onTipsClick}
              className="relative p-2 text-[#FAB515] hover:text-[#e5a313] transition-colors"
              title="Dicas"
            >
              <Lightbulb size={20} />
            </motion.button>
          )}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 text-[#b0b0b0] hover:text-[#e7e7e7] transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FAB515] rounded-full shadow-[0_0_8px_#FAB515]"></span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onProfileClick}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:border-[#FAB515] hover:bg-white/20 transition-all duration-300 shadow-inner"
          >
            <User size={18} className="text-[#e7e7e7]" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onLogout}
            className="w-10 h-10 rounded-full bg-red-500/10 backdrop-blur-md flex items-center justify-center border border-red-500/20 hover:border-red-500 hover:bg-red-500/20 transition-all duration-300 ml-1 shadow-inner"
            title="Sair da Conta"
          >
            <LogOut size={18} className="text-red-500" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
