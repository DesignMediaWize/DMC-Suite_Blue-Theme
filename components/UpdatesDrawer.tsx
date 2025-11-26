import React, { useState } from 'react';
import { Bell, Briefcase } from 'lucide-react';

interface UpdatesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTrip: () => void;
}

export const UpdatesDrawer: React.FC<UpdatesDrawerProps> = ({ isOpen, onClose, onCreateTrip }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mentions' | 'actions'>('all');

  return (
    <div 
      className={`
        fixed top-0 bottom-0 left-[280px] w-[400px] bg-white border-r border-gray-200 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-slate-900">Updates</h2>
          <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">0</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100">
          {(['all', 'mentions', 'actions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-all border-b-2 ${
                activeTab === tab
                  ? 'text-slate-900 border-slate-900'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'mentions' ? '@mentions' : 'Actions'}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
        
        {/* Empty State */}
        <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-100 mb-6 animate-in zoom-in duration-300">
          <Bell className="text-white" size={32} />
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2">No updates yet. Let's fix that.</h3>
        <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed mb-8">
          You'll get alerts when you invite someone to your trip or follow a DMC Suite Creator.
        </p>

        <button 
          onClick={() => {
            onCreateTrip();
            onClose();
          }}
          className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
        >
          Create a trip
        </button>

      </div>
    </div>
  );
};