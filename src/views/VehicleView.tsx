import { useState } from 'react';
import { Car, Battery, MapPin, Settings2, Plus } from 'lucide-react';

export function VehicleView() {
  const [vehicles, setVehicles] = useState<any[]>([
    { id: 1, model: 'BYD Dolphin', plate: 'ABC-1234', currentBattery: 65, plugType: 'CCS2 / Type 2' }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ model: '', plate: '', capacity: '', plug: 'CCS2' });

  const handleAddVehicle = () => {
    if (!newVehicle.model || !newVehicle.plate || !newVehicle.capacity) return;
    setVehicles([...vehicles, {
      id: Date.now(),
      model: newVehicle.model,
      plate: newVehicle.plate,
      currentBattery: 100,
      plugType: newVehicle.plug
    }]);
    setIsAdding(false);
    setNewVehicle({ model: '', plate: '', capacity: '', plug: 'CCS2' });
  };

  if (isAdding) {
    return (
      <div className="pt-24 px-4 pb-32 h-full overflow-y-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e7e7e7] to-[#b0b0b0] tracking-tight drop-shadow-md">Adicionar Veículo</h2>
          <button 
            onClick={() => setIsAdding(false)}
            className="text-[#b0b0b0] hover:text-[#e7e7e7] font-bold"
          >
            Cancelar
          </button>
        </div>

        <div className="liquid-glass rounded-[2rem] p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4">
          <div>
            <label className="block text-sm font-bold text-[#b0b0b0] mb-2 uppercase tracking-widest">Modelo do Veículo</label>
            <input 
              type="text" 
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
              placeholder="Ex: BYD Dolphin"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#e7e7e7] focus:outline-none focus:border-[#FAB515] focus:bg-white/10 transition-all backdrop-blur-md"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#b0b0b0] mb-2 uppercase tracking-widest">Placa</label>
            <input 
              type="text" 
              value={newVehicle.plate}
              onChange={(e) => setNewVehicle({...newVehicle, plate: e.target.value})}
              placeholder="ABC-1234"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#e7e7e7] focus:outline-none focus:border-[#FAB515] focus:bg-white/10 transition-all backdrop-blur-md"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#b0b0b0] mb-2 uppercase tracking-widest">Capacidade da Bateria (kWh)</label>
            <input 
              type="number" 
              value={newVehicle.capacity}
              onChange={(e) => setNewVehicle({...newVehicle, capacity: e.target.value})}
              placeholder="Ex: 44.9"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#e7e7e7] focus:outline-none focus:border-[#FAB515] focus:bg-white/10 transition-all backdrop-blur-md"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#b0b0b0] mb-2 uppercase tracking-widest">Tipo de Conector</label>
            <select 
              value={newVehicle.plug}
              onChange={(e) => setNewVehicle({...newVehicle, plug: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#e7e7e7] focus:outline-none focus:border-[#FAB515] focus:bg-white/10 transition-all backdrop-blur-md appearance-none"
            >
              <option value="CCS2" className="bg-[#363535]">CCS2</option>
              <option value="Type 2" className="bg-[#363535]">Type 2</option>
              <option value="CHAdeMO" className="bg-[#363535]">CHAdeMO</option>
            </select>
          </div>

          <button 
            onClick={handleAddVehicle}
            disabled={!newVehicle.model || !newVehicle.plate || !newVehicle.capacity}
            className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold mt-6 hover:scale-[1.02] transition-transform shadow-[0_8px_24px_0_rgba(13,81,142,0.4)] disabled:opacity-50 disabled:hover:scale-100"
          >
            Salvar Veículo
          </button>
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="pt-24 px-4 pb-32 h-full flex flex-col items-center justify-center text-center relative z-10">
        <div className="w-28 h-28 liquid-glass rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(250,181,21,0.2)]">
          <Car size={48} className="text-[#FAB515]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#e7e7e7] mb-3">Nenhum veículo cadastrado</h2>
        <p className="text-[#b0b0b0] mb-10 max-w-xs leading-relaxed">Adicione seu veículo elétrico para estimar rotas e ver postos compatíveis.</p>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full max-w-xs bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-[0_8px_24px_0_rgba(13,81,142,0.4)] hover:scale-[1.02] transition-transform"
        >
          <Plus size={20} />
          <span>Adicionar Veículo</span>
        </button>
      </div>
    );
  }

  const vehicle = vehicles[0]; // Show first vehicle for now

  return (
    <div className="pt-24 px-4 pb-32 h-full overflow-y-auto relative z-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e7e7e7] to-[#b0b0b0] tracking-tight drop-shadow-md">Meu Veículo</h2>
        <button className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center text-[#b0b0b0] hover:text-[#e7e7e7] liquid-glass-hover">
          <Settings2 size={24} />
        </button>
      </div>

      <div className="liquid-glass rounded-[2rem] p-6 mb-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Placeholder for Car Image */}
          <div className="w-56 h-28 mb-8 relative">
            <div className="absolute inset-x-0 bottom-0 h-6 bg-black/50 blur-xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=400&h=200" 
              alt={vehicle.model} 
              className="w-full h-full object-cover rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
            />
          </div>

          <h3 className="text-2xl font-extrabold text-[#e7e7e7] mb-1 tracking-tight">{vehicle.model}</h3>
          <p className="text-[#b0b0b0] text-sm mb-8 font-medium">Placa: {vehicle.plate} • Conector: {vehicle.plugType}</p>

          <div className="w-full bg-white/5 backdrop-blur-md rounded-[2rem] p-5 border border-white/10 shadow-inner">
            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center space-x-3">
                <Battery className="text-[#FAB515] drop-shadow-[0_0_8px_rgba(250,181,21,0.5)]" size={28} />
                <span className="text-3xl font-extrabold text-[#e7e7e7]">{vehicle.currentBattery}%</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#b0b0b0] uppercase tracking-widest">Alcance Est.</span>
                <p className="text-2xl font-extrabold text-[#e7e7e7]">{Math.round((vehicle.currentBattery / 100) * 350)} <span className="text-sm font-medium text-[#b0b0b0]">km</span></p>
              </div>
            </div>
            
            <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden mt-5 shadow-inner border border-white/5">
              <div className="h-full bg-gradient-to-r from-[#FAB515] to-[#fcd34d] rounded-full shadow-[0_0_10px_rgba(250,181,21,0.8)]" style={{ width: `${vehicle.currentBattery}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#e7e7e7] mb-5">Postos no seu alcance</h3>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="liquid-glass rounded-2xl p-5 flex items-center justify-between liquid-glass-hover">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-[#FAB515] shadow-inner">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-bold text-[#e7e7e7]">Eletroposto {i === 1 ? 'Ibirapuera' : 'Paulista'}</p>
                <p className="text-xs text-[#b0b0b0] mt-1 font-medium">{i === 1 ? '5.1 km' : '8.3 km'} • Chegará com {i === 1 ? vehicle.currentBattery - 3 : vehicle.currentBattery - 5}%</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-[#e7e7e7] rounded-xl text-sm font-bold hover:bg-white/20 transition-colors shadow-md">
              Rotas
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
