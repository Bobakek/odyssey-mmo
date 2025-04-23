import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { X, Bell, AlertCircle, Info, Check, AlertTriangle } from 'lucide-react';

const Notifications: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Calculate unread notifications
  useEffect(() => {
    const count = state.notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [state.notifications]);
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    dispatch({
      type: 'READ_NOTIFICATION',
      payload: { id }
    });
  };
  
  // Get icon based on notification type
  const getIcon = (type: 'info' | 'warning' | 'danger' | 'success') => {
    switch (type) {
      case 'info':
        return <Info size={14} className="text-blue-400" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-yellow-400" />;
      case 'danger':
        return <AlertCircle size={14} className="text-red-400" />;
      case 'success':
        return <Check size={14} className="text-green-400" />;
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-30">
      {/* Bell icon with notification count */}
      <button 
        className="w-10 h-10 bg-gray-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-700/80 transition-all shadow-lg border border-gray-700/50 relative"
        onClick={() => setShowPanel(!showPanel)}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification panel */}
      {showPanel && (
        <div className="absolute bottom-12 right-0 w-80 max-h-96 overflow-y-auto bg-gray-900/90 backdrop-blur-md rounded-md border border-gray-700/50 shadow-2xl">
          <div className="p-3 border-b border-gray-700/50 flex items-center justify-between">
            <h3 className="text-gray-200 font-semibold">Notifications</h3>
            <button 
              className="text-gray-400 hover:text-gray-200"
              onClick={() => setShowPanel(false)}
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="p-2">
            {state.notifications.length === 0 ? (
              <div className="text-center text-gray-400 py-4">No notifications</div>
            ) : (
              state.notifications.map(notif => (
                <div 
                  key={notif.id}
                  className={`px-3 py-2 mb-2 rounded ${notif.read ? 'bg-gray-800/30' : 'bg-gray-800/60 border border-gray-700/50'}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getIcon(notif.type)}
                    <span className="text-xs text-gray-400">{formatTime(notif.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-200">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;