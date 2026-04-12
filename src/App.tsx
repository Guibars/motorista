import { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './components/LoginScreen';
import { MapView } from './views/MapView';
import { RouteView } from './views/RouteView';
import { ChargeView } from './views/ChargeView';
import { VehicleView } from './views/VehicleView';
import { WalletView } from './views/WalletView';
import { ProfileView } from './views/ProfileView';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('map');
  const [isNavigating, setIsNavigating] = useState(false);

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  const handleLogout = () => {
    setUser(null);
  };

  const handleStartNavigation = () => {
    setActiveTab('map');
    setIsNavigating(true);
  };

  const renderView = () => {
    switch (activeTab) {
      case 'map': return <MapView isNavigating={isNavigating} setIsNavigating={setIsNavigating} />;
      case 'route': return <RouteView onStartNavigation={handleStartNavigation} />;
      case 'charge': return <ChargeView />;
      case 'vehicle': return <VehicleView />;
      case 'wallet': return <WalletView />;
      case 'profile': return <ProfileView user={user} onLogout={handleLogout} />;
      default: return <MapView isNavigating={isNavigating} setIsNavigating={setIsNavigating} />;
    }
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
      <div className="h-screen w-full bg-[#000000] text-[#e7e7e7] overflow-hidden flex flex-col relative">
        {/* Global Liquid Glass Background Orbs - iOS 26.4 Style */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[#0D518E]/30 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-[#FAB515]/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[30%] w-[50vw] h-[50vw] bg-[#4A90E2]/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative z-10 flex flex-col h-full w-full">
          {!isNavigating && <Header onProfileClick={() => setActiveTab('profile')} onLogout={handleLogout} />}
          
          <main className="flex-1 relative">
            {renderView()}
          </main>

          {!isNavigating && <BottomNav activeTab={activeTab} onChange={setActiveTab} />}
        </div>
      </div>
    </APIProvider>
  );
}


