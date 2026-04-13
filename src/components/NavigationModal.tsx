import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Map as MapIcon, Navigation } from 'lucide-react';

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: { lat: number; lng: number } | null;
}

export function NavigationModal({ isOpen, onClose, destination }: NavigationModalProps) {
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (isOpen && destination) {
      const savedApp = localStorage.getItem('preferredNavApp');
      if (savedApp) {
        openApp(savedApp, destination.lat, destination.lng);
      }
    }
  }, [isOpen, destination]);

  const openApp = (app: string, lat: number, lng: number) => {
    let url = '';
    
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (app === 'waze') {
      url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    } else if (app === 'google') {
      url = isIOS ? `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving` : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else if (app === 'apple') {
      url = `http://maps.apple.com/?daddr=${lat},${lng}`;
    }

    if (remember) {
      localStorage.setItem('preferredNavApp', app);
    }

    // Try to open the app, fallback to web if possible
    window.open(url, '_blank');
    onClose();
  };

  if (!isOpen || !destination) return null;

  // If already saved, don't render the modal (it auto-opens in useEffect)
  if (localStorage.getItem('preferredNavApp')) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#1a1a1a] border border-white/10 rounded-[2rem] p-6 max-w-sm w-full shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          
          <h2 className="text-xl font-bold text-white mb-6 text-center">Escolha o Aplicativo</h2>
          
          <div className="space-y-3 mb-6">
            <button onClick={() => openApp('waze', destination.lat, destination.lng)} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center space-x-4 transition-colors">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                <Navigation size={20} />
              </div>
              <span className="text-white font-medium text-lg">Waze</span>
            </button>
            <button onClick={() => openApp('google', destination.lat, destination.lng)} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center space-x-4 transition-colors">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                <MapIcon size={20} />
              </div>
              <span className="text-white font-medium text-lg">Google Maps</span>
            </button>
            <button onClick={() => openApp('apple', destination.lat, destination.lng)} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center space-x-4 transition-colors">
              <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center text-gray-400">
                <MapIcon size={20} />
              </div>
              <span className="text-white font-medium text-lg">Apple Maps</span>
            </button>
          </div>

          <label className="flex items-center space-x-3 cursor-pointer mb-4 px-2">
            <input 
              type="checkbox" 
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-black/50 text-[#FAB515] focus:ring-[#FAB515]"
            />
            <span className="text-sm text-gray-300">Lembrar da minha escolha</span>
          </label>
          
          <p className="text-xs text-gray-500 text-center px-4">
            Você pode alterar o aplicativo padrão posteriormente na aba de Perfil.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
