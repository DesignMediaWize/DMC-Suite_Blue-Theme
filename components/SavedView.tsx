import React, { useState } from 'react';
import { PlaceDetails, Page } from '../types';
import { Heart } from 'lucide-react';
import { PlaceCard } from './PlaceCard';

interface SavedViewProps {
  savedItems: PlaceDetails[];
  onNavigate: (page: Page) => void;
  onRemove: (id: string) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({ savedItems, onNavigate, onRemove }) => {
  const [activeTab, setActiveTab] = useState<'places' | 'collections' | 'guides'>('places');

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-rose-500 rounded-full flex items-center justify-center shadow-xl shadow-rose-200 mb-8">
        <Heart className="text-white fill-current" size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-3">No places saved.</h2>
      <p className="text-slate-500 max-w-md leading-relaxed mb-8">
        Tap "Save" <Heart className="inline text-slate-400 mx-1" size={14} /> next time someplace cool catches your eye in a <button onClick={() => onNavigate('chat')} className="underline decoration-slate-300 hover:text-slate-900 hover:decoration-slate-900 transition-all">chat</button>, a guide or on the <button onClick={() => onNavigate('explore')} className="underline decoration-slate-300 hover:text-slate-900 hover:decoration-slate-900 transition-all">explore</button> page.
      </p>
      <button 
        onClick={() => onNavigate('explore')}
        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:shadow-xl active:scale-95"
      >
        Start exploring
      </button>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-12 pb-4 border-b border-gray-100 bg-white z-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Your saved places</h1>
        
        {/* Tabs */}
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('places')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'places' 
                ? 'text-slate-900 border-slate-900' 
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            Places
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'places' ? 'bg-slate-100' : 'bg-gray-50'}`}>
              {savedItems.length}
            </span>
          </button>
          
          <button 
            onClick={() => setActiveTab('collections')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'collections' 
                ? 'text-slate-900 border-slate-900' 
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            Collections
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400">0</span>
          </button>

          <button 
            onClick={() => setActiveTab('guides')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'guides' 
                ? 'text-slate-900 border-slate-900' 
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            Guides
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400">0</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'places' && (
            <>
              {savedItems.length === 0 ? (
                renderEmptyState()
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                  {savedItems.map((place, idx) => (
                    <div key={idx} className="relative group">
                      <PlaceCard details={place} />
                      <button 
                        onClick={() => onRemove(place.id || place.name)}
                        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-rose-500 hover:bg-rose-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                        title="Remove from saved"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab !== 'places' && (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p>This feature is coming soon.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};