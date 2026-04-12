import { MapPin, Zap, Wallet, Car, Route } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'map', icon: MapPin, label: 'Mapa' },
    { id: 'route', icon: Route, label: 'Rotas' },
    { id: 'charge', icon: Zap, label: 'Recarga' },
    { id: 'vehicle', icon: Car, label: 'Veículo' },
    { id: 'wallet', icon: Wallet, label: 'Carteira' },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[1000]">
      <div className="bg-white/10 backdrop-blur-[40px] border border-white/20 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-2 flex justify-between items-center relative overflow-hidden">
        {/* Liquid Glass Highlight Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-14 z-10 group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white/20 rounded-[1.5rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "relative z-10 flex flex-col items-center justify-center transition-colors duration-300",
                  isActive ? "text-[#FAB515] drop-shadow-[0_0_8px_rgba(250,181,21,0.8)]" : "text-[#b0b0b0] group-hover:text-[#e7e7e7]"
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium mt-1">{tab.label}</span>
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
