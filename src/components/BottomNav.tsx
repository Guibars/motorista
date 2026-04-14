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
    <div className="fixed bottom-4 left-3 right-3 z-[1000]">
      <div className="liquid-glass-strong rounded-[1.75rem] p-1.5 flex justify-between items-center relative overflow-hidden">
        {/* Top highlight - Apple glass reflection */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

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
                  className="absolute inset-0 bg-white/12 rounded-[1.25rem] shadow-[inset_0_0_16px_rgba(255,255,255,0.06)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={cn(
                  'relative z-10 flex flex-col items-center justify-center transition-colors duration-200',
                  isActive
                    ? 'text-[#FAB515] drop-shadow-[0_0_8px_rgba(250,181,21,0.6)]'
                    : 'text-[#808080] group-hover:text-[#b0b0b0]'
                )}
              >
                <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
