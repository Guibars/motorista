import { motion, AnimatePresence } from 'motion/react';
import { X, Lightbulb, Zap, ParkingCircle, BatteryCharging } from 'lucide-react';

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TipsModal({ isOpen, onClose }: TipsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 bg-[#1a1a1a] border border-white/10 rounded-[2rem] p-6 z-50 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#FAB515]/20 rounded-full flex items-center justify-center border border-[#FAB515]/30">
                  <Lightbulb size={20} className="text-[#FAB515]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Dicas Fotus</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <ParkingCircle size={20} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Libere a vaga</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Após finalizar o carregamento, libere a vaga o mais rápido possível para que outros usuários possam utilizar o eletroposto.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Zap size={20} className="text-green-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Carga Rápida (DC)</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Em carregadores rápidos, é recomendado carregar apenas até 80%. A partir desse ponto, a velocidade de carregamento cai drasticamente para proteger a bateria.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#FAB515]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <BatteryCharging size={20} className="text-[#FAB515]" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Saúde da Bateria</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Para o dia a dia, mantenha a bateria entre 20% e 80% para prolongar sua vida útil. Deixe os 100% apenas para viagens longas.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full mt-6 bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition-colors"
            >
              Entendi
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
