import React, { useState } from 'react';
import { X, ShoppingBag, BarChart2, Hammer as Tool, Shield, CreditCard } from 'lucide-react';

// Types for props (should ideally be in types/index.ts)
interface Station {
  id: string;
  name: string;
  type: string;
  faction: string;
}

interface StationViewProps {
  station: Station;
  onClose: () => void;
}

const StationView: React.FC<StationViewProps> = ({ station, onClose }) => {
  const [activeTab, setActiveTab] = useState('market');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gray-900/90 border border-gray-700/50 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-800/50">
          <div className="flex items-center">
            <div className="mr-3 p-2 rounded-full bg-cyan-900/50">
              {station.type === 'trading' ? (
                <ShoppingBag size={20} className="text-cyan-300" />
              ) : station.type === 'military' ? (
                <Shield size={20} className="text-red-300" />
              ) : station.type === 'mining' ? (
                <Tool size={20} className="text-yellow-300" />
              ) : (
                <BarChart2 size={20} className="text-blue-300" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-cyan-300">{station.name}</h2>
              <p className="text-sm text-gray-400">
                {station.type.charAt(0).toUpperCase() + station.type.slice(1)} Station • {station.faction}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        {/* Station Navigation */}
        <div className="flex border-b border-gray-700/50">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'market' ? 'text-cyan-300 border-b-2 border-cyan-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('market')}
          >
            <div className="flex items-center gap-1.5">
              <ShoppingBag size={14} />
              Market
            </div>
          </button>
          
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'missions' ? 'text-cyan-300 border-b-2 border-cyan-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('missions')}
          >
            <div className="flex items-center gap-1.5">
              <BarChart2 size={14} />
              Missions
            </div>
          </button>
          
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'shipyard' ? 'text-cyan-300 border-b-2 border-cyan-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('shipyard')}
          >
            <div className="flex items-center gap-1.5">
              <Tool size={14} />
              Shipyard
            </div>
          </button>
          
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'bank' ? 'text-cyan-300 border-b-2 border-cyan-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('bank')}
          >
            <div className="flex items-center gap-1.5">
              <CreditCard size={14} />
              Bank
            </div>
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-4 h-[calc(90vh-130px)] overflow-y-auto">
          {activeTab === 'market' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Goods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Example market items - these would come from the game state */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-md border border-gray-700/30">
                    <div>
                      <div className="font-medium">
                        {['Fuel Cells', 'Medical Supplies', 'Luxury Goods', 'Food Rations', 'Weapons', 'Rare Minerals'][i % 6]}
                      </div>
                      <div className="text-sm text-gray-400">
                        Stock: {Math.floor(Math.random() * 100) + 10} units
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-yellow-300 font-medium">{(Math.floor(Math.random() * 500) + 100)} cr</div>
                        <div className="text-xs text-gray-400">per unit</div>
                      </div>
                      <button className="px-3 py-1.5 text-sm bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-300 rounded border border-cyan-800/50">
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold my-4">Your Cargo</h3>
              <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/30">
                <p className="text-gray-400 text-sm italic">Your cargo hold is empty.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'missions' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Missions</h3>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-gray-800/50 p-4 rounded-md border border-gray-700/30">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">
                        {[
                          'Delivery to Proxima Station', 
                          'Hunt Down Pirate Vessels', 
                          'Explore Uncharted Region'
                        ][i]}
                      </h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        i === 0 ? 'bg-blue-900/50 text-blue-300 border border-blue-800/30' :
                        i === 1 ? 'bg-red-900/50 text-red-300 border border-red-800/30' :
                        'bg-purple-900/50 text-purple-300 border border-purple-800/30'
                      }`}>
                        {['Delivery', 'Combat', 'Exploration'][i]}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">
                      {[
                        'Transport essential medical supplies to Proxima Station within 3 days.',
                        'Eliminate the pirate vessels that have been terrorizing this sector.',
                        'Map the uncharted region beyond the asteroid belt and report your findings.'
                      ][i]}
                    </p>
                    
                    <div className="text-xs text-gray-400 mb-2">
                      <span className="font-medium">Reward:</span> {1000 * (i + 1)} credits, {200 * (i + 1)} XP
                    </div>
                    
                    <button className="w-full mt-2 text-sm px-3 py-1.5 bg-cyan-900/40 hover:bg-cyan-900/60 transition-colors rounded border border-cyan-800/50">
                      Accept Mission
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'shipyard' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Ship Upgrades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Shield Generator', 'Weapon System', 'Engine Booster', 'Cargo Expansion'].map((upgrade, i) => (
                  <div key={i} className="bg-gray-800/50 p-4 rounded-md border border-gray-700/30">
                    <h4 className="font-medium mb-1">{upgrade} Mk{i+1}</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      {i === 0 ? 'Increases shield capacity by 25%.' :
                       i === 1 ? 'Improves weapon damage by 20%.' :
                       i === 2 ? 'Boosts engine speed by 15%.' :
                       'Adds 10 units to cargo capacity.'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-300 font-medium">{2000 * (i + 1)} cr</span>
                      <button className="px-3 py-1.5 text-sm bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-300 rounded border border-cyan-800/50">
                        Purchase
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold my-4">Ship Repairs</h3>
              <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/30">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Full Ship Repair</h4>
                    <p className="text-sm text-gray-400">Restores ship to 100% condition</p>
                  </div>
                  <button className="px-3 py-1.5 text-sm bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-300 rounded border border-cyan-800/50">
                    Repair (500 cr)
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'bank' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Galactic Bank</h3>
              <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/30 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-400">Your Balance:</span>
                  <span className="text-xl font-bold text-yellow-300">0 cr</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Deposit Amount</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 bg-gray-900/70 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full px-3 py-2 text-sm bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-300 rounded border border-cyan-800/50">
                      Deposit Credits
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Withdraw Amount</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 bg-gray-900/70 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full px-3 py-2 text-sm bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-300 rounded border border-cyan-800/50">
                      Withdraw Credits
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700/30">
                <h4 className="font-medium mb-2">Transaction History</h4>
                <p className="text-sm text-gray-400 italic">No transaction history available.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationView;