import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import StarField from './components/StarField';
import TopBar from './components/UI/TopBar';
import HUD from './components/UI/HUD';
import Notifications from './components/UI/Notifications';
import MainView from './views/MainView';
import CombatView from './components/combat/CombatView';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen text-gray-100 overflow-hidden relative">
        {/* Animated starfield background */}
        <StarField density={0.7} speed={0.3} />
        
        {/* Top navigation bar */}
        <TopBar />
        
        {/* Main game content */}
        <main className="pt-16 pb-4 px-4 h-screen overflow-hidden flex flex-col">
          <MainView />
        </main>
        
        {/* Combat overlay */}
        <CombatView />
        
        {/* HUD overlay */}
        <HUD className="fixed left-4 top-20" />
        
        {/* Notifications */}
        <Notifications />
      </div>
    </GameProvider>
  );
}

export default App;