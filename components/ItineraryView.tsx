import React, { useState } from 'react';
import { TripItinerary, ActivityType, PlaceDetails } from '../types';
import { Calendar, MapPin, Coffee, Bed, Camera, Bus, User, Download, Share2, Edit3, DollarSign, Plus, Trash2 } from 'lucide-react';
import { PlaceCard } from './PlaceCard';

interface ItineraryViewProps {
  itinerary: TripItinerary;
  canvasItems: PlaceDetails[];
  onRemoveCanvasItem: (name: string) => void;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case ActivityType.DINING: return <Coffee className="text-orange-500" size={18} />;
    case ActivityType.ACCOMMODATION: return <Bed className="text-indigo-500" size={18} />;
    case ActivityType.SIGHTSEEING: return <Camera className="text-emerald-500" size={18} />;
    case ActivityType.TRANSPORT: return <Bus className="text-blue-500" size={18} />;
    default: return <MapPin className="text-gray-500" size={18} />;
  }
};

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, canvasItems, onRemoveCanvasItem }) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const isEmpty = itinerary.days.length === 0 && canvasItems.length === 0;

  if (isEmpty) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 p-8 text-center border-l border-gray-200">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
          <MapPin className="text-gray-300" size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Trip Canvas</h2>
        <p className="text-gray-500 max-w-xs text-sm">
          Items you add from the chat will appear here. Once you have a few, click "Build Itinerary" to organize them.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 overflow-hidden border-l border-gray-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm z-10 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{itinerary.title || "New Trip"}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1"><MapPin size={14} /> {itinerary.destination || "Not set"}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {itinerary.durationDays || "?"} Days</span>
              {itinerary.totalEstimatedCost && (
                <span className="flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <DollarSign size={14} /> Est. ${itinerary.totalEstimatedCost.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="Share">
              <Share2 size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-sm font-medium">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Day Selector (only if we have days) */}
        {itinerary.days.length > 0 && (
          <div className="flex gap-2 mt-6 overflow-x-auto pb-1 no-scrollbar">
            {itinerary.days.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDay(day.dayNumber)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                  activeDay === day.dayNumber
                    ? 'bg-slate-800 border-slate-800 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
        
        {/* Drafts Section - Items added from chat but not yet scheduled */}
        {canvasItems.length > 0 && (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus size={14} /> Unscheduled Items
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {canvasItems.map((place, idx) => (
                <div key={idx} className="relative group">
                   <PlaceCard details={place} compact />
                   <button 
                     onClick={() => onRemoveCanvasItem(place.name)}
                     className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100"
                   >
                     <Trash2 size={12} />
                   </button>
                </div>
              ))}
            </div>
            <div className="my-8 border-b border-gray-200 border-dashed"></div>
          </div>
        )}

        {/* Generated Itinerary */}
        {itinerary.days
          .filter(d => d.dayNumber === activeDay)
          .map((day) => (
            <div key={day.dayNumber} className="max-w-4xl mx-auto animate-in fade-in duration-300">
              <div className="mb-6 flex items-baseline justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                    <span className="text-teal-600 mr-2">Day {day.dayNumber}</span>
                    {day.title}
                </h3>
              </div>

              <div className="space-y-6 relative">
                 {/* Vertical Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                {day.activities.map((activity) => (
                  <div key={activity.id} className="relative pl-12 group">
                    {/* Time Bubble */}
                    <div className="absolute left-0 top-0 w-8 h-8 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center shadow-sm z-10 group-hover:border-teal-500 transition-colors">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    {/* Activity Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-teal-600 tracking-wide uppercase mb-1">{activity.time}</span>
                          <h4 className="text-lg font-semibold text-gray-900">{activity.title}</h4>
                        </div>
                        {activity.estimatedCost && (
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            ~${activity.estimatedCost}
                          </span>
                        )}
                      </div>
                      
                      {activity.notes && (
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{activity.notes}</p>
                      )}

                      {activity.details && (
                        <div className="mt-3">
                          <PlaceCard details={activity.details} compact />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};
