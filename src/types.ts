export type ConnectorType = 'Type 2' | 'CCS2' | 'CHAdeMO' | 'GB/T';

export interface Station {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  network: string;
  connectors: {
    type: ConnectorType;
    power: string; // e.g., "50 kW"
    available: boolean;
    price: number; // per kWh
  }[];
  distance?: string;
}

export interface ChargingSession {
  id: string;
  stationId: string;
  startTime: Date;
  status: 'active' | 'completed';
  kwhAdded: number;
  currentPower: number;
  cost: number;
  estimatedTimeRemaining?: number; // in minutes
  batteryStart: number;
  batteryCurrent: number;
}

export interface Vehicle {
  model: string;
  batteryCapacity: number; // kWh
  currentBattery: number; // percentage
  estimatedRange: number; // km
  plugType: ConnectorType;
}
