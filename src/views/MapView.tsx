import React, { useState, useEffect, useCallback } from 'react';
import {
  Map,
  useMap,
  useMapsLibrary,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { Station, ConnectorType } from '../types';
import { REALISTIC_STATIONS } from '../data/stations';
import {
  Navigation, Zap, LocateFixed, RefreshCw, X, Plus, Minus,
  Search, Loader2, Filter, MapPin, Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationModal } from '../components/NavigationModal';

interface MapViewProps {
  isNavigating?: boolean;
  setIsNavigating?: (nav: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapOcmConnector(title: string): ConnectorType {
  const t = title.toLowerCase();
  if (t.includes('ccs') || t.includes('combo')) return 'CCS2';
  if (t.includes('chademo')) return 'CHAdeMO';
  if (t.includes('gb/t') || t.includes('gb\\t')) return 'GB/T';
  return 'Type 2';
}

/* ------------------------------------------------------------------ */
/*  Open Charge Map API                                                */
/* ------------------------------------------------------------------ */

async function fetchFromOpenChargeMap(
  lat: number,
  lng: number,
): Promise<Station[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);

  try {
    const params = new URLSearchParams({
      output: 'json',
      latitude: lat.toString(),
      longitude: lng.toString(),
      distance: '15',
      distanceunit: 'KM',
      maxresults: '80',
      compact: 'true',
      verbose: 'false',
    });

    const res = await fetch(
      `https://api.openchargemap.org/v3/poi/?${params}`,
      { signal: ctrl.signal },
    );
    clearTimeout(timer);
    if (!res.ok) throw new Error(`OCM ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter((p: any) => p.AddressInfo?.Latitude && p.AddressInfo?.Longitude)
      .map((p: any) => {
        const conns = (p.Connections || [])
          .filter((c: any) => c.ConnectionType)
          .map((c: any) => ({
            type: mapOcmConnector(c.ConnectionType?.Title || ''),
            power: c.PowerKW ? `${c.PowerKW} kW` : 'N/A',
            available: p.StatusType?.IsOperational !== false,
            price: c.PowerKW && c.PowerKW >= 50 ? 2.1 : 1.5,
          }));

        const a = p.AddressInfo;
        return {
          id: `ocm-${p.ID}`,
          name: a.Title || p.OperatorInfo?.Title || 'Eletroposto',
          address: [a.AddressLine1, a.Town, a.StateOrProvince]
            .filter(Boolean)
            .join(', ') || 'Endereço não disponível',
          lat: a.Latitude,
          lng: a.Longitude,
          network: p.OperatorInfo?.Title || 'Rede independente',
          connectors:
            conns.length > 0
              ? conns
              : [{ type: 'Type 2' as ConnectorType, power: 'N/A', available: true, price: 1.5 }],
          distance: haversineKm(lat, lng, a.Latitude, a.Longitude).toFixed(1) + ' km',
        };
      });
  } catch (err) {
    clearTimeout(timer);
    console.warn('Open Charge Map fetch failed:', err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Static / Google helpers                                            */
/* ------------------------------------------------------------------ */

function nearbyStatic(lat: number, lng: number, radiusKm = 25): Station[] {
  return REALISTIC_STATIONS.map((s) => ({
    ...s,
    distance: haversineKm(lat, lng, s.lat, s.lng).toFixed(1) + ' km',
  })).filter((s) => parseFloat(s.distance!) <= radiusKm);
}

function dedup(stations: Station[]): Station[] {
  const out: Station[] = [];
  for (const s of stations) {
    if (!out.some((e) => haversineKm(e.lat, e.lng, s.lat, s.lng) < 0.15)) {
      out.push(s);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MapView({ isNavigating = false, setIsNavigating }: MapViewProps) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const geocodingLib = useMapsLibrary('geocoding');

  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: -23.6, lng: -46.68 });
  const [mapZoom, setMapZoom] = useState(13);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sourceLabel, setSourceLabel] = useState('');

  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [navDestination, setNavDestination] = useState<{ lat: number; lng: number } | null>(null);

  /* ---------- fetch from all sources ---------- */
  const fetchStations = useCallback(
    async (loc: google.maps.LatLngLiteral) => {
      setIsRefreshing(true);
      try {
        // 1. Open Charge Map (real chargers)
        const ocm = await fetchFromOpenChargeMap(loc.lat, loc.lng);

        // 2. Curated Fotus stations nearby
        const fotus = nearbyStatic(loc.lat, loc.lng, 30);

        // 3. Google Places (supplemental)
        let gp: Station[] = [];
        if (placesLib && map) {
          gp = await new Promise<Station[]>((resolve) => {
            const svc = new google.maps.places.PlacesService(map);
            svc.nearbySearch(
              {
                location: new google.maps.LatLng(loc.lat, loc.lng),
                radius: 10000,
                type: 'electric_vehicle_charging_station',
              },
              (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                  resolve(
                    results.map((r) => ({
                      id: `gp-${r.place_id}`,
                      name: r.name || 'Eletroposto',
                      address: r.vicinity || 'Endereço não informado',
                      lat: r.geometry?.location?.lat() || 0,
                      lng: r.geometry?.location?.lng() || 0,
                      network: 'Google Places',
                      distance: '',
                      connectors: [
                        { type: 'CCS2' as ConnectorType, power: '50 kW', available: true, price: 2.1 },
                        { type: 'Type 2' as ConnectorType, power: '22 kW', available: true, price: 1.5 },
                      ],
                    })),
                  );
                } else resolve([]);
              },
            );
          });
        }

        const merged = dedup([...ocm, ...fotus, ...gp]);

        const parts: string[] = [];
        if (ocm.length) parts.push(`OCM: ${ocm.length}`);
        if (fotus.length) parts.push(`Fotus: ${fotus.length}`);
        if (gp.length) parts.push(`Google: ${gp.length}`);
        setSourceLabel(parts.join(' · '));

        setStations(merged);
      } catch {
        const fb = nearbyStatic(loc.lat, loc.lng, 100);
        setStations(fb);
        setSourceLabel(`Dados salvos: ${fb.length}`);
      } finally {
        setIsRefreshing(false);
        setIsLoading(false);
      }
    },
    [placesLib, map],
  );

  /* ---------- geolocation ---------- */
  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      fetchStations(mapCenter);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(p);
        setMapCenter(p);
        setMapZoom(15);
        fetchStations(p);
      },
      () => fetchStations(mapCenter),
    );
  }, [fetchStations, mapCenter]);

  useEffect(() => {
    handleLocate();
  }, []);

  // Re-fetch when Google Places lib loads for supplemental data
  useEffect(() => {
    if (placesLib && userLocation) fetchStations(userLocation);
  }, [placesLib]);

  /* ---------- search / refresh / navigate ---------- */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geocodingLib || !map || !searchQuery) return;
    setIsSearching(true);
    new geocodingLib.Geocoder().geocode({ address: searchQuery }, (results, status) => {
      setIsSearching(false);
      if (status === 'OK' && results?.[0]) {
        const l = results[0].geometry.location;
        const p = { lat: l.lat(), lng: l.lng() };
        setMapCenter(p);
        setMapZoom(14);
        fetchStations(p);
      }
    });
  };

  const handleRefresh = () => {
    if (!map) return;
    const c = map.getCenter();
    if (c) fetchStations({ lat: c.lat(), lng: c.lng() });
  };

  const handleNavigate = () => {
    if (!selectedStation) return;
    setNavDestination({ lat: selectedStation.lat, lng: selectedStation.lng });
    setIsNavModalOpen(true);
  };

  const availableCount = stations.filter((s) => s.connectors.some((c) => c.available)).length;

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="relative w-full h-full">
      <NavigationModal
        isOpen={isNavModalOpen}
        onClose={() => setIsNavModalOpen(false)}
        destination={navDestination}
      />

      {/* -------- Search Bar (below header) -------- */}
      <div className="absolute top-[5.5rem] left-3 right-3 z-[400] flex space-x-2">
        <form
          onSubmit={handleSearch}
          className="flex-1 liquid-glass rounded-2xl flex items-center px-4 py-3"
        >
          <Search size={17} className="text-gray-500 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar endereço ou região..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm placeholder-gray-500"
          />
          {isSearching ? (
            <Loader2 size={17} className="text-[#FAB515] animate-spin ml-2 flex-shrink-0" />
          ) : (
            searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-white ml-2 flex-shrink-0"
              >
                <X size={15} />
              </button>
            )
          )}
        </form>
        <button className="w-11 h-11 liquid-glass rounded-2xl flex items-center justify-center text-white liquid-glass-hover flex-shrink-0">
          <Filter size={17} />
        </button>
      </div>

      {/* -------- Filter Chips -------- */}
      <div className="absolute top-[8.5rem] left-3 right-3 z-[400] flex space-x-2 overflow-x-auto no-scrollbar">
        <button className="px-4 py-2 liquid-glass rounded-full text-xs font-medium whitespace-nowrap text-white liquid-glass-hover">
          Todos os Conectores
        </button>
        <button className="px-4 py-2 liquid-glass rounded-full text-xs font-medium whitespace-nowrap text-white liquid-glass-hover">
          Potência &gt; 50kW
        </button>
        {stations.length > 0 && (
          <div className="px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap text-[#FAB515] bg-[#FAB515]/10 border border-[#FAB515]/20 flex items-center space-x-1.5">
            <Zap size={11} />
            <span>{availableCount} disponíveis</span>
          </div>
        )}
      </div>

      {/* -------- Refresh Button -------- */}
      <div className="absolute top-[11rem] left-1/2 -translate-x-1/2 z-[400]">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-5 py-2.5 liquid-glass rounded-full text-xs font-bold text-white flex items-center space-x-2 liquid-glass-hover shadow-lg disabled:opacity-50"
        >
          <RefreshCw
            size={13}
            className={isRefreshing ? 'animate-spin text-[#FAB515]' : 'text-[#FAB515]'}
          />
          <span>{isRefreshing ? 'Buscando...' : 'Buscar nesta área'}</span>
        </button>
      </div>

      {/* -------- Right Controls -------- */}
      <div className="absolute bottom-[7rem] right-3 z-[400] flex flex-col space-y-2">
        <button
          onClick={() => setMapZoom((z) => Math.min(z + 1, 20))}
          className="w-11 h-11 liquid-glass rounded-2xl flex items-center justify-center text-white liquid-glass-hover"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={() => setMapZoom((z) => Math.max(z - 1, 1))}
          className="w-11 h-11 liquid-glass rounded-2xl flex items-center justify-center text-white liquid-glass-hover"
        >
          <Minus size={18} />
        </button>
        <button
          onClick={handleLocate}
          className="w-11 h-11 liquid-glass rounded-2xl flex items-center justify-center text-[#FAB515] liquid-glass-hover"
        >
          <LocateFixed size={18} />
        </button>
      </div>

      {/* -------- Source indicator -------- */}
      {sourceLabel && !selectedStation && (
        <div className="absolute bottom-[7rem] left-3 z-[400]">
          <div className="px-3 py-1.5 liquid-glass rounded-full text-[10px] text-gray-400 flex items-center space-x-1.5">
            <Globe size={10} />
            <span>{sourceLabel}</span>
          </div>
        </div>
      )}

      {/* -------- Loading overlay -------- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[350] flex items-center justify-center pointer-events-none"
          >
            <div className="liquid-glass rounded-2xl px-6 py-4 flex items-center space-x-3">
              <Loader2 size={20} className="text-[#FAB515] animate-spin" />
              <span className="text-sm text-white font-medium">Carregando carregadores...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================ */}
      {/*  MAP — full-screen edge-to-edge (Apple Maps style)               */}
      {/* ================================================================ */}
      <Map
        center={mapCenter}
        zoom={mapZoom}
        mapId="bf51a910020fa25a"
        disableDefaultUI
        className="w-full h-full"
        onCenterChanged={(e) => setMapCenter(e.detail.center)}
        onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
        gestureHandling="greedy"
      >
        {/* User location */}
        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <div className="relative">
              <div className="w-4 h-4 bg-[#FAB515] rounded-full border-[3px] border-[#0D518E] shadow-[0_0_12px_rgba(250,181,21,0.8)]" />
              <div className="absolute inset-0 w-4 h-4 bg-[#FAB515]/30 rounded-full animate-ping" />
            </div>
          </AdvancedMarker>
        )}

        {/* Station markers */}
        {stations.map((station) => {
          const ok = station.connectors.some((c) => c.available);
          const sel = selectedStation?.id === station.id;
          return (
            <AdvancedMarker
              key={station.id}
              position={{ lat: station.lat, lng: station.lng }}
              onClick={() => setSelectedStation(station)}
            >
              <div
                className={`
                  w-9 h-9 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${
                    sel
                      ? 'border-[#FAB515] bg-[#FAB515] scale-125 shadow-[0_0_20px_rgba(250,181,21,0.8)]'
                      : ok
                        ? 'border-[#FAB515]/80 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                        : 'border-gray-500 bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                  }
                `}
              >
                <Zap size={15} className={sel ? 'text-[#121212]' : 'text-white'} />
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>

      {/* ================================================================ */}
      {/*  Station Detail Bottom Sheet                                     */}
      {/* ================================================================ */}
      <AnimatePresence>
        {selectedStation && (
          <motion.div
            initial={{ y: 400, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute bottom-[6.5rem] left-3 right-3 z-[400] liquid-glass-strong rounded-[1.75rem] overflow-hidden"
          >
            {/* Top highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="px-5 pb-5">
              {/* Header row */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 mr-3">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {selectedStation.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center">
                    <MapPin size={10} className="mr-1 flex-shrink-0" />
                    {selectedStation.address}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedStation.network && (
                      <span className="px-2.5 py-0.5 bg-[#0D518E]/30 border border-[#0D518E]/40 text-[#FAB515] text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {selectedStation.network}
                      </span>
                    )}
                    {selectedStation.distance && (
                      <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium rounded-full">
                        {selectedStation.distance}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="p-2 bg-white/8 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/15 transition-all flex-shrink-0"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Connectors */}
              <div className="space-y-2 mb-4 max-h-[28vh] overflow-y-auto no-scrollbar">
                {selectedStation.connectors.map((c, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      c.available
                        ? 'bg-green-500/5 border-green-500/15'
                        : 'bg-red-500/5 border-red-500/15 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          c.available
                            ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]'
                            : 'bg-red-400'
                        }`}
                      />
                      <div>
                        <p className="font-bold text-white text-sm">{c.type}</p>
                        <p className="text-[11px] text-gray-400">
                          {c.power}
                          {c.price > 0 ? ` · R$ ${c.price.toFixed(2)}/kWh` : ''}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        c.available
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {c.available ? 'Livre' : 'Ocupado'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Navigate button */}
              <button
                onClick={handleNavigate}
                className="w-full bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-[0_8px_24px_rgba(13,81,142,0.4)] hover:shadow-[0_8px_32px_rgba(13,81,142,0.6)] transition-all active:scale-[0.98]"
              >
                <Navigation size={16} className="text-[#FAB515]" />
                <span>Traçar Rota</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
