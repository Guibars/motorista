import { User, Bell, LogOut, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onProfileClick: () => void;
  onLogout: () => void;
  onTipsClick?: () => void;
}

export function Header({ onProfileClick, onLogout, onTipsClick }: HeaderProps) {
  return (
    <header className="fixed top-3 left-3 right-3 z-50">
      <div className="liquid-glass-strong rounded-[1.75rem] h-16 px-4 flex items-center justify-between relative overflow-hidden">
        {/* Top highlight line - Apple glass reflection */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex items-center relative z-10 pl-1">
          <img
            src="https://res.cloudinary.com/ddtpuucfi/image/upload/v1776089289/CHARGE_3_afxm8u.png"
            alt="Fotus Charge"
            className="h-16 md:h-20 scale-[1.35] origin-left object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center space-x-1.5 relative z-10">
          {onTipsClick && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onTipsClick}
              className="relative p-2 text-[#FAB515] hover:text-[#e5a313] transition-colors"
              title="Dicas"
            >
              <Lightbulb size={19} />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 text-[#b0b0b0] hover:text-[#e7e7e7] transition-colors"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FAB515] rounded-full shadow-[0_0_6px_#FAB515]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onProfileClick}
            className="w-9 h-9 rounded-full bg-white/8 backdrop-blur-md flex items-center justify-center border border-white/15 hover:border-[#FAB515]/50 hover:bg-white/15 transition-all duration-300"
          >
            <User size={17} className="text-[#e7e7e7]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onLogout}
            className="w-9 h-9 rounded-full bg-red-500/10 backdrop-blur-md flex items-center justify-center border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/20 transition-all duration-300"
            title="Sair da Conta"
          >
            <LogOut size={17} className="text-red-400" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
