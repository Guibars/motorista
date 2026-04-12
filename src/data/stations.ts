import { Station } from '../types';

export const REALISTIC_STATIONS: Station[] = [
  // São Paulo
  {
    id: 'sp-1',
    name: 'Fotus Fast Charge - Shopping Morumbi',
    address: 'Av. Roque Petroni Júnior, 1089 - São Paulo, SP',
    lat: -23.6231,
    lng: -46.6983,
    network: 'Fotus',
    distance: '2.5 km',
    connectors: [
      { type: 'CCS2', power: '150 kW', available: true, price: 1.95 },
      { type: 'Type 2', power: '22 kW', available: false, price: 1.50 }
    ]
  },
  {
    id: 'sp-2',
    name: 'Eletroposto Ibirapuera',
    address: 'Av. Pedro Álvares Cabral - São Paulo, SP',
    lat: -23.5874,
    lng: -46.6576,
    network: 'Parceiro',
    distance: '5.1 km',
    connectors: [
      { type: 'CCS2', power: '50 kW', available: true, price: 2.10 }
    ]
  },
  {
    id: 'sp-3',
    name: 'Fotus Ultra - Marginal Pinheiros',
    address: 'Av. das Nações Unidas, 12901 - São Paulo, SP',
    lat: -23.6091,
    lng: -46.6968,
    network: 'Fotus',
    distance: '3.8 km',
    connectors: [
      { type: 'CCS2', power: '350 kW', available: false, price: 2.50 },
      { type: 'CCS2', power: '350 kW', available: true, price: 2.50 }
    ]
  },
  {
    id: 'sp-4',
    name: 'Graal Resende (Dutra)',
    address: 'Rod. Pres. Dutra, km 304 - Resende, RJ',
    lat: -22.4684,
    lng: -44.4481,
    network: 'Fotus',
    distance: '250 km',
    connectors: [
      { type: 'CCS2', power: '150 kW', available: true, price: 2.10 },
      { type: 'CHAdeMO', power: '50 kW', available: true, price: 2.10 }
    ]
  },
  {
    id: 'sp-5',
    name: 'Graal Piraí (Dutra)',
    address: 'Rod. Pres. Dutra, km 238 - Piraí, RJ',
    lat: -22.6289,
    lng: -43.8981,
    network: 'Fotus',
    distance: '320 km',
    connectors: [
      { type: 'CCS2', power: '150 kW', available: true, price: 2.10 }
    ]
  },
  // Rio de Janeiro
  {
    id: 'rj-1',
    name: 'Fotus Charge - Barra Shopping',
    address: 'Av. das Américas, 4666 - Barra da Tijuca, RJ',
    lat: -22.9997,
    lng: -43.3498,
    network: 'Fotus',
    distance: '400 km',
    connectors: [
      { type: 'CCS2', power: '50 kW', available: true, price: 1.90 },
      { type: 'Type 2', power: '22 kW', available: true, price: 1.50 }
    ]
  },
  {
    id: 'rj-2',
    name: 'Posto Ipiranga - Copacabana',
    address: 'Av. Atlântica, 3200 - Copacabana, RJ',
    lat: -22.9754,
    lng: -43.1867,
    network: 'Parceiro',
    distance: '415 km',
    connectors: [
      { type: 'CCS2', power: '50 kW', available: false, price: 2.20 }
    ]
  },
  // Minas Gerais
  {
    id: 'mg-1',
    name: 'Fotus Charge - BH Shopping',
    address: 'BR-356, 3049 - Belvedere, Belo Horizonte, MG',
    lat: -19.9744,
    lng: -43.9451,
    network: 'Fotus',
    distance: '580 km',
    connectors: [
      { type: 'CCS2', power: '150 kW', available: true, price: 1.95 }
    ]
  },
  {
    id: 'mg-2',
    name: 'Graal Perdões (Fernão Dias)',
    address: 'Rod. Fernão Dias, km 674 - Perdões, MG',
    lat: -21.0911,
    lng: -45.0922,
    network: 'Fotus',
    distance: '380 km',
    connectors: [
      { type: 'CCS2', power: '150 kW', available: true, price: 2.10 }
    ]
  },
  // Paraná
  {
    id: 'pr-1',
    name: 'Fotus Charge - ParkShoppingBarigüi',
    address: 'R. Prof. Pedro Viriato Parigot de Souza, 600 - Curitiba, PR',
    lat: -25.4382,
    lng: -49.3061,
    network: 'Fotus',
    distance: '400 km',
    connectors: [
      { type: 'CCS2', power: '150 kW', available: true, price: 1.95 },
      { type: 'Type 2', power: '22 kW', available: true, price: 1.50 }
    ]
  },
  {
    id: 'pr-2',
    name: 'Graal Petropen (Régis Bittencourt)',
    address: 'BR-116, km 461 - Pariquera-Açu, SP',
    lat: -24.7161,
    lng: -47.8822,
    network: 'Fotus',
    distance: '210 km',
    connectors: [
      { type: 'CCS2', power: '150 kW', available: true, price: 2.10 }
    ]
  },
  // Santa Catarina
  {
    id: 'sc-1',
    name: 'Fotus Charge - Beiramar Shopping',
    address: 'R. Bocaiúva, 2468 - Centro, Florianópolis, SC',
    lat: -27.5844,
    lng: -48.5451,
    network: 'Fotus',
    distance: '700 km',
    connectors: [
      { type: 'CCS2', power: '50 kW', available: true, price: 1.95 }
    ]
  },
  // Rio Grande do Sul
  {
    id: 'rs-1',
    name: 'Fotus Charge - Iguatemi Porto Alegre',
    address: 'Av. João Wallig, 1800 - Passo d\'Areia, Porto Alegre, RS',
    lat: -30.0277,
    lng: -51.1631,
    network: 'Fotus',
    distance: '1100 km',
    connectors: [
      { type: 'CCS2', power: '150 kW', available: true, price: 1.95 }
    ]
  },
  // Brasília
  {
    id: 'df-1',
    name: 'Fotus Charge - ParkShopping',
    address: 'SMAS Trecho 1 - Guará, Brasília, DF',
    lat: -15.8344,
    lng: -47.9521,
    network: 'Fotus',
    distance: '1000 km',
    connectors: [
      { type: 'CCS2', power: '150 kW', available: true, price: 1.95 }
    ]
  },
  // Bahia
  {
    id: 'ba-1',
    name: 'Fotus Charge - Salvador Shopping',
    address: 'Av. Tancredo Neves, 3133 - Caminho das Árvores, Salvador, BA',
    lat: -12.9781,
    lng: -38.4551,
    network: 'Fotus',
    distance: '1900 km',
    connectors: [
      { type: 'CCS2', power: '50 kW', available: true, price: 1.95 }
    ]
  },
  // Pernambuco
  {
    id: 'pe-1',
    name: 'Fotus Charge - RioMar Recife',
    address: 'Av. República do Líbano, 251 - Pina, Recife, PE',
    lat: -8.0861,
    lng: -34.8941,
    network: 'Fotus',
    distance: '2600 km',
    connectors: [
      { type: 'CCS2', power: '50 kW', available: true, price: 1.95 }
    ]
  },
  // Ceará
  {
    id: 'ce-1',
    name: 'Fotus Charge - Iguatemi Bosque',
    address: 'Av. Washington Soares, 85 - Edson Queiroz, Fortaleza, CE',
    lat: -3.7571,
    lng: -38.4891,
    network: 'Fotus',
    distance: '3100 km',
    connectors: [
      { type: 'CCS2', power: '50 kW', available: true, price: 1.95 }
    ]
  }
];
