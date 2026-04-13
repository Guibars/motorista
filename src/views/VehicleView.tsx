import React, { useState } from 'react';
import { Car, Battery, Zap, Plus, Trash2, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Vehicle {
  id: string;
  type: string;
  brand: string;
  model: string;
  plate: string;
  chassis: string;
  capacity: string;
  autonomy: string;
}

const MOCK_BRANDS = ['Audi', 'BMW', 'BYD', 'Chevrolet', 'Fiat', 'Ford', 'GWM', 'Hyundai', 'JAC', 'Kia', 'Mercedes-Benz', 'Mini', 'Nissan', 'Peugeot', 'Porsche', 'Renault', 'Volvo'];
const MOCK_MODELS: Record<string, string[]> = {
  'BYD': ['Dolphin', 'Dolphin Plus', 'Dolphin Mini', 'Seal', 'Yuan Plus', 'Han', 'Tan', 'D1'],
  'Volvo': ['EX30', 'XC40 Recharge', 'C40 Recharge'],
  'GWM': ['Ora 03 Skin', 'Ora 03 GT', 'Haval H6 PHEV'],
  'Nissan': ['Leaf'],
  'Renault': ['Kwid E-Tech', 'Zoe', 'Megane E-Tech'],
  'Chevrolet': ['Bolt EV', 'Bolt EUV'],
  'Fiat': ['500e'],
  'Peugeot': ['e-208 GT', 'e-2008'],
  'BMW': ['i3', 'iX3', 'i4', 'iX'],
  'Audi': ['e-tron', 'e-tron GT', 'Q8 e-tron'],
  'Porsche': ['Taycan'],
  'Mini': ['Cooper SE'],
  'JAC': ['E-JS1', 'E-JS4', 'E-J7'],
  'Ford': ['Mustang Mach-E'],
  'Kia': ['EV6', 'Niro EV'],
  'Hyundai': ['Kona EV', 'Ioniq 5'],
  'Mercedes-Benz': ['EQA', 'EQB', 'EQC', 'EQE', 'EQS']
};

export function VehicleView() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [type, setType] = useState('100% Elétrico');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [chassis, setChassis] = useState('');
  const [capacity, setCapacity] = useState('');
  const [autonomy, setAutonomy] = useState('');

  // Dropdown State
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');

  const filteredBrands = MOCK_BRANDS.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));
  const availableModels = brand && MOCK_MODELS[brand] ? MOCK_MODELS[brand] : [];
  const filteredModels = availableModels.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase()));

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !plate) return;

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      type,
      brand,
      model,
      plate: plate.toUpperCase(),
      chassis: chassis.toUpperCase(),
      capacity,
      autonomy
    };

    setVehicles([...vehicles, newVehicle]);
    setIsAdding(false);
    
    // Reset form
    setType('100% Elétrico');
    setBrand('');
    setModel('');
    setPlate('');
    setChassis('');
    setCapacity('');
    setAutonomy('');
  };

  const removeVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="pt-24 px-4 pb-32 h-full overflow-y-auto relative z-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e7e7e7] to-[#b0b0b0] tracking-tight drop-shadow-md">Meus Veículos</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 bg-[#FAB515] text-[#121212] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(250,181,21,0.5)] hover:scale-110 transition-transform"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div 
            key="add-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="liquid-glass rounded-[2rem] p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Adicionar Veículo</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Veículo</label>
                <div className="flex space-x-2">
                  <button 
                    type="button"
                    onClick={() => setType('100% Elétrico')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${type === '100% Elétrico' ? 'bg-[#FAB515] text-[#121212]' : 'bg-white/5 text-white border border-white/10'}`}
                  >
                    100% Elétrico
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType('Híbrido Plug-in')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${type === 'Híbrido Plug-in' ? 'bg-[#FAB515] text-[#121212]' : 'bg-white/5 text-white border border-white/10'}`}
                  >
                    Híbrido Plug-in
                  </button>
                </div>
              </div>

              {/* Brand Select */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Marca</label>
                <div 
                  onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white cursor-pointer flex justify-between items-center"
                >
                  <span>{brand || 'Selecione a marca'}</span>
                </div>
                
                {showBrandDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    <div className="p-2 sticky top-0 bg-[#1a1a1a] border-b border-white/10">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Buscar marca..." 
                          value={brandSearch}
                          onChange={(e) => setBrandSearch(e.target.value)}
                          className="w-full bg-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    {filteredBrands.map(b => (
                      <div 
                        key={b} 
                        className="px-4 py-3 hover:bg-white/5 cursor-pointer text-white text-sm"
                        onClick={() => {
                          setBrand(b);
                          setModel(''); // Reset model when brand changes
                          setShowBrandDropdown(false);
                          setBrandSearch('');
                        }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Model Select */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
                <div 
                  onClick={() => brand && setShowModelDropdown(!showModelDropdown)}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white flex justify-between items-center ${!brand ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span>{model || 'Selecione o modelo'}</span>
                </div>
                
                {showModelDropdown && brand && (
                  <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    <div className="p-2 sticky top-0 bg-[#1a1a1a] border-b border-white/10">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Buscar modelo..." 
                          value={modelSearch}
                          onChange={(e) => setModelSearch(e.target.value)}
                          className="w-full bg-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    {filteredModels.length > 0 ? filteredModels.map(m => (
                      <div 
                        key={m} 
                        className="px-4 py-3 hover:bg-white/5 cursor-pointer text-white text-sm"
                        onClick={() => {
                          setModel(m);
                          setShowModelDropdown(false);
                          setModelSearch('');
                        }}
                      >
                        {m}
                      </div>
                    )) : (
                      <div className="px-4 py-3 text-gray-400 text-sm">
                        <input 
                          type="text" 
                          placeholder="Digite o modelo..." 
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full bg-transparent focus:outline-none text-white"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Placa</label>
                  <input 
                    type="text" 
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    placeholder="ABC-1234"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FAB515] uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chassi (Opcional)</label>
                  <input 
                    type="text" 
                    value={chassis}
                    onChange={(e) => setChassis(e.target.value)}
                    placeholder="17 caracteres"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FAB515] uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bateria (kWh)</label>
                  <input 
                    type="number" 
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Ex: 60"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FAB515]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Autonomia (km)</label>
                  <input 
                    type="number" 
                    value={autonomy}
                    onChange={(e) => setAutonomy(e.target.value)}
                    placeholder="Ex: 400"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FAB515]"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-[#FAB515] text-[#121212] py-4 rounded-xl font-bold hover:bg-[#e5a313] transition-colors shadow-[0_0_20px_rgba(250,181,21,0.3)]"
              >
                Salvar Veículo
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="vehicle-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {vehicles.length === 0 ? (
              <div className="liquid-glass rounded-[2rem] p-10 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                  <Car size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nenhum veículo</h3>
                <p className="text-gray-400 mb-6">Adicione seu veículo elétrico para uma experiência personalizada.</p>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="bg-[#FAB515] text-[#121212] px-6 py-3 rounded-xl font-bold hover:bg-[#e5a313] transition-colors shadow-[0_0_15px_rgba(250,181,21,0.3)]"
                >
                  Adicionar Veículo
                </button>
              </div>
            ) : (
              vehicles.map(vehicle => (
                <div key={vehicle.id} className="liquid-glass rounded-[2rem] p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-[#FAB515]/20 rounded-full flex items-center justify-center border border-[#FAB515]/30 shadow-[0_0_15px_rgba(250,181,21,0.2)]">
                        <Car size={28} className="text-[#FAB515]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{vehicle.brand} {vehicle.model}</h3>
                        <p className="text-sm text-[#FAB515] font-medium">{vehicle.type}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeVehicle(vehicle.id)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center space-x-2 text-gray-400 mb-1">
                        <Battery size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider">Bateria</span>
                      </div>
                      <p className="text-lg font-bold text-white">{vehicle.capacity ? `${vehicle.capacity} kWh` : 'N/A'}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center space-x-2 text-gray-400 mb-1">
                        <Zap size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider">Autonomia</span>
                      </div>
                      <p className="text-lg font-bold text-white">{vehicle.autonomy ? `${vehicle.autonomy} km` : 'N/A'}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-400 relative z-10">
                    <span>Placa: <span className="text-white font-bold">{vehicle.plate}</span></span>
                    {vehicle.chassis && <span>Chassi: <span className="text-white font-bold">{vehicle.chassis}</span></span>}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
