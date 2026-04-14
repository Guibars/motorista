import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, Battery, Loader2, Zap } from 'lucide-react';
import { Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { NavigationModal } from '../components/NavigationModal';

interface RouteViewProps {
  onStartNavigation?: () => void;
}

export function RouteView({ onStartNavigation }: RouteViewProps) {
  const [origin, setOrigin] = useState('São Paulo, SP');
  const [dest, setDest] = useState('Rio de Janeiro, RJ');
  const [isCalculating, setIsCalculating] = useState(false);
  const [route, setRoute] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: -23.5505, lng: -46.6333 });
  
  // Navigation Modal State
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [navDestination, setNavDestination] = useState<{lat: number, lng: number} | null>(null);

  const routesLib = useMapsLibrary('routes');
  const map = useMap();
  
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!routesLib || !map) return;
    directionsService.current = new google.maps.DirectionsService();
    directionsRenderer.current = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#FAB515',
        strokeWeight: 6,
        strokeOpacity: 0.9
      }
    });
  }, [routesLib, map]);

  const handleCalculate = () => {
    if (!dest || !origin || !directionsService.current || !directionsRenderer.current) return;
    setIsCalculating(true);
    setRoute(null);
    
    directionsService.current.route({
      origin: origin,
      destination: dest,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      setIsCalculating(false);
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.current?.setDirections(result);
        
        const routeLeg = result.routes[0].legs[0];
        
        // Generate some mock charging stops along the route based on the result
        const selectedStops = [
          {
            name: 'Eletroposto Graal (Simulado)',
            lat: routeLeg.steps[Math.floor(routeLeg.steps.length * 0.3)]?.end_location.lat() || -23.2237,
            lng: routeLeg.steps[Math.floor(routeLeg.steps.length * 0.3)]?.end_location.lng() || -45.9009,
            arrival: '22%',
            target: '80%',
            time: '35 min',
            cost: 'R$ 45,00'
          },
          {
            name: 'Posto Shell Recharge (Simulado)',
            lat: routeLeg.steps[Math.floor(routeLeg.steps.length * 0.7)]?.end_location.lat() || -22.9068,
            lng: routeLeg.steps[Math.floor(routeLeg.steps.length * 0.7)]?.end_location.lng() || -43.1729,
            arrival: '15%',
            target: '80%',
            time: '45 min',
            cost: 'R$ 62,00'
          }
        ];

        setRoute({
          distance: routeLeg.distance?.text || '435 km',
          duration: routeLeg.duration?.text || '5h 45m',
          arrivalBattery: '12%',
          stops: selectedStops,
          finalDestLat: routeLeg.end_location.lat(),
          finalDestLng: routeLeg.end_location.lng()
        });
      } else {
        alert('Não foi possível calcular a rota. Verifique os endereços e tente novamente.');
      }
    });
  };

  const handleNavigate = () => {
    if (route) {
      setNavDestination({ lat: route.finalDestLat, lng: route.finalDestLng });
      setIsNavModalOpen(true);
    }
  };

  return (
    <div className="pt-[5.5rem] px-4 pb-28 h-full overflow-y-auto relative z-10 no-scrollbar">
      <NavigationModal 
        isOpen={isNavModalOpen} 
        onClose={() => setIsNavModalOpen(false)} 
        destination={navDestination} 
      />

      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e7e7e7] to-[#b0b0b0] mb-8 tracking-tight drop-shadow-md">Planejar Rota</h2>

      <div className="liquid-glass rounded-[2rem] p-6 mb-8 relative">
        <div className="absolute left-9 top-14 bottom-14 w-0.5 bg-white/10"></div>
        
        <div className="flex items-center space-x-4 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
          <input 
            type="text" 
            placeholder="Localização atual" 
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="flex-1 liquid-glass rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#FAB515] transition-all shadow-inner placeholder-gray-400"
          />
        </div>

        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            <MapPin size={18} className="text-red-500" />
          </div>
          <input 
            type="text" 
            placeholder="Destino" 
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="flex-1 liquid-glass rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#FAB515] transition-all shadow-inner placeholder-gray-400"
          />
        </div>
      </div>

      <div className="h-64 w-full rounded-[2rem] overflow-hidden mb-8 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
        <Map
          center={mapCenter}
          zoom={10}
          mapId="bf51a910020fa25a"
          disableDefaultUI={true}
          gestureHandling="greedy"
        >
          {route && route.stops.map((stop: any, idx: number) => (
            <AdvancedMarker key={idx} position={{ lat: stop.lat, lng: stop.lng }}>
              <div className="w-6 h-6 bg-[#FAB515] rounded-full border-2 border-[#0D518E] shadow-[0_0_15px_rgba(250,181,21,0.8)] flex items-center justify-center">
                <Zap size={12} className="text-white" />
              </div>
            </AdvancedMarker>
          ))}
          {route && (
            <AdvancedMarker position={{ lat: route.finalDestLat, lng: route.finalDestLng }}>
              <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(239,68,68,0.8)] flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>
            </AdvancedMarker>
          )}
        </Map>
      </div>

      <button 
        onClick={handleCalculate}
        disabled={isCalculating || !dest || !origin}
        className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold text-lg hover:shadow-[0_8px_30px_rgba(13,81,142,0.6)] transition-all mb-8 shadow-[0_8px_24px_0_rgba(13,81,142,0.4)] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
      >
        {isCalculating ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Calculando...
          </>
        ) : (
          'Calcular Rota Inteligente'
        )}
      </button>

      {/* Route Result */}
      {route && (
        <div className="liquid-glass rounded-[2rem] p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-6 pb-5 border-b border-white/10">
            <div>
              <h3 className="text-xl font-bold text-[#e7e7e7]">Rota Sugerida</h3>
              <p className="text-sm text-[#b0b0b0] mt-1">{route.distance} • {route.duration}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#b0b0b0] block mb-1">Chegada est.</span>
              <span className="text-xl font-bold text-[#FAB515] drop-shadow-[0_0_8px_rgba(250,181,21,0.5)]">{route.arrivalBattery} <Battery size={18} className="inline ml-1" /></span>
            </div>
          </div>

          <h4 className="text-xs font-bold text-[#b0b0b0] mb-5 uppercase tracking-widest">Paradas Recomendadas</h4>
          
          <div className="space-y-5 relative">
            <div className="absolute left-6 top-5 bottom-5 w-0.5 bg-white/10"></div>
            
            {route.stops.map((stop: any, idx: number) => (
              <div key={idx} className="flex items-start space-x-4 relative z-10">
                <div className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(250,181,21,0.2)]">
                  <Zap size={20} className="text-[#FAB515]" />
                </div>
                <div className="flex-1 liquid-glass rounded-2xl p-4 liquid-glass-hover">
                  <p className="font-bold text-white text-base mb-1">{stop.name}</p>
                  <p className="text-xs text-gray-300 mb-3">Chegada com {stop.arrival} • Recarregar até {stop.target}</p>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg">{stop.time}</span>
                    <span className="text-[#FAB515] bg-[#FAB515]/10 border border-[#FAB515]/20 px-3 py-1.5 rounded-lg">{stop.cost} est.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleNavigate}
            className="w-full mt-8 bg-gradient-to-r from-[#0D518E] to-[#0b4275] hover:shadow-[0_8px_30px_rgba(13,81,142,0.6)] border border-white/10 text-[#e7e7e7] py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg backdrop-blur-md hover:scale-[1.02]"
          >
            <Navigation size={20} className="text-[#FAB515]" />
            <span>Iniciar Navegação</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ZapIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAB515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
}
