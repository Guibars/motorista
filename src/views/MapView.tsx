import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Map, 
  Marker, 
  InfoWindow, 
  useMap, 
  useMapsLibrary,
  AdvancedMarker,
  Pin
} from '@vis.gl/react-google-maps';
import { Station } from '../types';
import { Navigation, Zap, Info, LocateFixed, RefreshCw, X, ArrowUpRight, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MapViewProps {
  isNavigating?: boolean;
  setIsNavigating?: (nav: boolean) => void;
}

export function MapView({ isNavigating = false, setIsNavigating }: MapViewProps) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');
  
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [routeLine, setRouteLine] = useState<google.maps.LatLngLiteral[] | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: -23.6000, lng: -46.6800 });
  
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);

  // Initialize Directions Service
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
        // Fallback to dynamic stations if Google Places fails
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

  const fetchRoute = useCallback(async (start: google.maps.LatLngLiteral, end: {lat: number, lng: number}) => {
    if (!directionsService.current || !directionsRenderer.current) return;

    directionsService.current.route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.current?.setDirections(result);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedStation && userLocation) {
      fetchRoute(userLocation, selectedStation);
    } else {
      directionsRenderer.current?.setDirections({ routes: [] } as any);
    }
  }, [selectedStation, userLocation, fetchRoute]);

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

  const handleRefresh = () => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        fetchStations({ lat: center.lat(), lng: center.lng() });
      }
    }
  };

  const handleNavigate = () => {
    if (setIsNavigating) {
      setIsNavigating(true);
      if (map && userLocation) {
        map.setZoom(18);
        map.setTilt(60);
        map.panTo(userLocation);
      }
      setSelectedStation(null);
    }
  };

  const handleExitNavigation = () => {
    if (setIsNavigating) {
      setIsNavigating(false);
      if (map && userLocation) {
        map.setTilt(0);
        map.setZoom(13);
        map.panTo(userLocation);
      }
    }
  };

  return (
    <div className={`relative w-full ${isNavigating ? 'h-screen' : 'h-[calc(100vh-4rem)] pt-16'}`}>
      
      {/* In-App Navigation UI */}
      <AnimatePresence>
        {isNavigating && (
          <>
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-12 left-4 right-4 z-[500] liquid-glass rounded-[2rem] p-4 flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-[#0D518E]/30 rounded-full flex items-center justify-center border border-[#0D518E]/50">
                <ArrowUpRight size={28} className="text-[#FAB515]" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-extrabold text-[#e7e7e7] tracking-tight">Siga em frente</p>
                <p className="text-sm text-[#b0b0b0] font-medium">na rota em tempo real</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#FAB515]">12 min</p>
                <p className="text-xs text-[#b0b0b0]">4.5 km</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[500]"
            >
              <button 
                onClick={handleExitNavigation}
                className="px-8 py-4 bg-red-500/20 backdrop-blur-[40px] border border-red-500/30 rounded-full text-red-500 font-bold shadow-[0_8px_32px_rgba(239,68,68,0.3)] hover:bg-red-500/30 transition-colors flex items-center space-x-2"
              >
                <X size={20} />
                <span>Sair da Navegação</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isNavigating && (
        <>
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[400]">
            <button 
              onClick={handleRefresh}
              className="px-5 py-2.5 liquid-glass rounded-full text-sm font-bold text-[#e7e7e7] flex items-center space-x-2 liquid-glass-hover"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-[#FAB515]' : 'text-[#FAB515]'} />
              <span>Buscar nesta área</span>
            </button>
          </div>

          <div className="absolute top-36 left-4 right-4 z-[400] flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            <button className="px-4 py-2 liquid-glass rounded-full text-sm font-medium whitespace-nowrap text-[#e7e7e7] liquid-glass-hover">
              Todos os Conectores
            </button>
            <button className="px-4 py-2 liquid-glass rounded-full text-sm font-medium whitespace-nowrap text-[#e7e7e7] liquid-glass-hover">
              Potência &gt; 50kW
            </button>
          </div>

          <div className="absolute bottom-48 right-4 z-[400] flex flex-col space-y-2">
            <button 
              onClick={() => map?.setZoom((map.getZoom() || 13) + 1)}
              className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center text-[#e7e7e7] liquid-glass-hover"
            >
              <Plus size={24} />
            </button>
            <button 
              onClick={() => map?.setZoom((map.getZoom() || 13) - 1)}
              className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center text-[#e7e7e7] liquid-glass-hover"
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
        </>
      )}

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
            onClick={() => !isNavigating && setSelectedStation(station)}
          >
            <div className={`w-8 h-8 rounded-full border-2 border-[#FAB515] flex items-center justify-center shadow-lg ${station.connectors.some(c => c.available) ? 'bg-green-500' : 'bg-red-500'}`}>
              <Zap size={16} className="text-white" />
            </div>
          </AdvancedMarker>
        ))}
      </Map>

      {/* Station Details Bottom Sheet */}
      <AnimatePresence>
        {selectedStation && !isNavigating && (
          <motion.div 
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            className="absolute bottom-28 left-4 right-4 z-[400] liquid-glass rounded-[2rem] p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-extrabold text-[#e7e7e7] tracking-tight">{selectedStation.name}</h3>
                <p className="text-sm text-[#b0b0b0]">{selectedStation.address}</p>
              </div>
              <button onClick={() => setSelectedStation(null)} className="p-2 bg-white/10 rounded-full border border-white/10 text-[#b0b0b0]">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3 mb-5 max-h-[35vh] overflow-y-auto no-scrollbar">
              {selectedStation.connectors.map((connector, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 bg-white/5 rounded-2xl border ${connector.available ? 'border-green-500/30' : 'border-red-500/30 opacity-70'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${connector.available ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500'}`} />
                    <div>
                      <p className="font-bold text-[#e7e7e7]">{connector.type}</p>
                      <p className="text-xs text-[#b0b0b0]">{connector.power} • R$ {connector.price.toFixed(2)}/kWh</p>
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
              className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg"
            >
              <Navigation size={18} className="text-[#FAB515]" />
              <span>Iniciar Navegação</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
