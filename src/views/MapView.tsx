import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Map, 
  useMap, 
  useMapsLibrary,
  AdvancedMarker
} from '@vis.gl/react-google-maps';
import { Station } from '../types';
import { Navigation, Zap, LocateFixed, RefreshCw, X, Plus, Minus, Search, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationModal } from '../components/NavigationModal';

interface MapViewProps {
  isNavigating?: boolean;
  setIsNavigating?: (nav: boolean) => void;
}

export function MapView({ isNavigating = false, setIsNavigating }: MapViewProps) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const geocodingLib = useMapsLibrary('geocoding');
  
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: -23.6000, lng: -46.6800 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Navigation Modal State
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [navDestination, setNavDestination] = useState<{lat: number, lng: number} | null>(null);

  const fetchStations = useCallback(async (location: google.maps.LatLngLiteral) => {
    if (!placesLib || !map) return;
    setIsRefreshing(true);

    const service = new google.maps.places.PlacesService(map);
    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 5000,
      type: 'electric_vehicle_charging_station'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const mappedStations: Station[] = results.map(place => ({
          id: place.place_id || Math.random().toString(),
          name: place.name || 'Eletroposto',
          address: place.vicinity || 'Endereço não informado',
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0,
          network: 'Rede Google',
          distance: '',
          connectors: [
            { type: 'CCS2', power: '50 kW', available: true, price: 2.10 },
            { type: 'Type 2', power: '22 kW', available: true, price: 1.50 }
          ]
        }));
        setStations(mappedStations);
      } else {
        setStations(generateDynamicStations(location.lat, location.lng));
      }
      setIsRefreshing(false);
    });
  }, [placesLib, map]);

  const generateDynamicStations = (centerLat: number, centerLng: number): Station[] => {
    const stations: Station[] = [];
    const networks = ['Fotus Charge', 'Tupinamba', 'Volvo', 'Shell Recharge', 'EZVolt', 'Zletric'];
    for (let i = 0; i < 8; i++) {
      const latOffset = (Math.random() - 0.5) * 0.05;
      const lngOffset = (Math.random() - 0.5) * 0.05;
      stations.push({
        id: `dynamic-${Date.now()}-${i}`,
        name: `Eletroposto ${networks[Math.floor(Math.random() * networks.length)]}`,
        address: 'Endereço aproximado',
        lat: centerLat + latOffset,
        lng: centerLng + lngOffset,
        network: networks[Math.floor(Math.random() * networks.length)],
        distance: (Math.random() * 8 + 1).toFixed(1) + ' km',
        connectors: [{ type: 'CCS2', power: '50 kW', available: Math.random() > 0.3, price: 2.10 }]
      });
    }
    return stations;
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(pos);
        setMapCenter(pos);
        fetchStations(pos);
      });
    }
  };

  useEffect(() => {
    handleLocate();
  }, [placesLib]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geocodingLib || !map || !searchQuery) return;
    
    setIsSearching(true);
    const geocoder = new geocodingLib.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      setIsSearching(false);
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const pos = { lat: location.lat(), lng: location.lng() };
        setMapCenter(pos);
        map.panTo(pos);
        map.setZoom(14);
        fetchStations(pos);
      } else {
        alert('Local não encontrado. Tente outro termo.');
      }
    });
  };

  const handleRefresh = () => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        fetchStations({ lat: center.lat(), lng: center.lng() });
      }
    }
  };

  const handleNavigate = () => {
    if (selectedStation) {
      setNavDestination({ lat: selectedStation.lat, lng: selectedStation.lng });
      setIsNavModalOpen(true);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] pt-16">
      <NavigationModal 
        isOpen={isNavModalOpen} 
        onClose={() => setIsNavModalOpen(false)} 
        destination={navDestination} 
      />

      {/* Top Search Bar - Pill Shaped */}
      <div className="absolute top-20 left-4 right-4 z-[400] flex space-x-2">
        <form onSubmit={handleSearch} className="flex-1 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 rounded-full shadow-lg flex items-center px-4 py-3">
          <Search size={20} className="text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Buscar endereço ou região..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm"
          />
          {isSearching ? (
            <Loader2 size={20} className="text-[#FAB515] animate-spin ml-2" />
          ) : (
            searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white ml-2">
                <X size={16} />
              </button>
            )
          )}
        </form>
        <button className="w-12 h-12 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-white/10 transition-colors">
          <Filter size={20} />
        </button>
      </div>

      <div className="absolute top-36 left-4 right-4 z-[400] flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
        <button className="px-4 py-2 liquid-glass rounded-full text-sm font-medium whitespace-nowrap text-white liquid-glass-hover">
          Todos os Conectores
        </button>
        <button className="px-4 py-2 liquid-glass rounded-full text-sm font-medium whitespace-nowrap text-white liquid-glass-hover">
          Potência &gt; 50kW
        </button>
      </div>

      <div className="absolute top-48 left-1/2 -translate-x-1/2 z-[400]">
        <button 
          onClick={handleRefresh}
          className="px-5 py-2.5 liquid-glass rounded-full text-sm font-bold text-white flex items-center space-x-2 liquid-glass-hover shadow-lg"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-[#FAB515]' : 'text-[#FAB515]'} />
          <span>Buscar nesta área</span>
        </button>
      </div>

      <div className="absolute bottom-48 right-4 z-[400] flex flex-col space-y-2">
        <button 
          onClick={() => map?.setZoom((map.getZoom() || 13) + 1)}
          className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center text-white liquid-glass-hover"
        >
          <Plus size={24} />
        </button>
        <button 
          onClick={() => map?.setZoom((map.getZoom() || 13) - 1)}
          className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center text-white liquid-glass-hover"
        >
          <Minus size={24} />
        </button>
      </div>

      <button 
        onClick={handleLocate}
        className="absolute bottom-32 right-4 z-[400] w-12 h-12 liquid-glass rounded-full flex items-center justify-center text-[#FAB515] liquid-glass-hover"
      >
        <LocateFixed size={24} />
      </button>

      <Map
        center={mapCenter}
        zoom={13}
        mapId="bf51a910020fa25a" // Use a dark mode map ID if available
        disableDefaultUI={true}
        className="w-full h-full"
        onCenterChanged={(e) => setMapCenter(e.detail.center)}
        gestureHandling="greedy"
      >
        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <div className="w-5 h-5 bg-[#FAB515] rounded-full border-4 border-[#0D518E] shadow-[0_0_15px_rgba(250,181,21,0.8)]" />
          </AdvancedMarker>
        )}

        {stations.map((station) => (
          <AdvancedMarker 
            key={station.id} 
            position={{ lat: station.lat, lng: station.lng }}
            onClick={() => setSelectedStation(station)}
          >
            <div className={`w-8 h-8 rounded-full border-2 border-[#FAB515] flex items-center justify-center shadow-lg ${station.connectors.some(c => c.available) ? 'bg-green-500' : 'bg-red-500'}`}>
              <Zap size={16} className="text-white" />
            </div>
          </AdvancedMarker>
        ))}
      </Map>

      {/* Station Details Bottom Sheet */}
      <AnimatePresence>
        {selectedStation && (
          <motion.div 
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            className="absolute bottom-28 left-4 right-4 z-[400] liquid-glass rounded-[2rem] p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">{selectedStation.name}</h3>
                <p className="text-sm text-gray-300">{selectedStation.address}</p>
              </div>
              <button onClick={() => setSelectedStation(null)} className="p-2 bg-white/10 rounded-full border border-white/10 text-gray-300">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3 mb-5 max-h-[35vh] overflow-y-auto no-scrollbar">
              {selectedStation.connectors.map((connector, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 bg-white/5 rounded-2xl border ${connector.available ? 'border-green-500/30' : 'border-red-500/30 opacity-70'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${connector.available ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500'}`} />
                    <div>
                      <p className="font-bold text-white">{connector.type}</p>
                      <p className="text-xs text-gray-300">{connector.power} • R$ {connector.price.toFixed(2)}/kWh</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${connector.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                    {connector.available ? 'Livre' : 'Ocupado'}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleNavigate}
              className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg"
            >
              <Navigation size={18} className="text-[#FAB515]" />
              <span>Traçar Rota</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
