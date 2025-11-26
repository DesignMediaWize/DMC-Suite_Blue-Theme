
import React, { useState } from 'react';
import { TripItinerary, Page } from '../types';
import { Briefcase, Plus, Calendar, MapPin, ChevronDown, Check, X, Users, DollarSign, Clock, Sparkles, Plane } from 'lucide-react';

interface TripsViewProps {
  currentItinerary: TripItinerary;
  onNavigate: (page: Page) => void;
  onPlanTrip: (prompt: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

export const TripsView: React.FC<TripsViewProps> = ({ currentItinerary, onNavigate, onPlanTrip, isOpen, onClose, onOpen }) => {
  const [showBookedOnly, setShowBookedOnly] = useState(false);
  
  // Form State
  const [tripName, setTripName] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('5 days');
  const [travelers, setTravelers] = useState('2 travelers');
  const [budget, setBudget] = useState('Flexible budget');

  // We consider the current session's itinerary as a "Trip" if it has content
  const hasTrip = currentItinerary.days.length > 0;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    const prompt = `Plan a trip to ${location} for ${duration} for ${travelers}. Budget is ${budget}. Trip Name: ${tripName}`;
    onPlanTrip(prompt);
    onClose();
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-teal-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-teal-50 to-white border border-white shadow-xl shadow-teal-100/50 flex items-center justify-center">
          <Briefcase className="text-teal-600 drop-shadow-sm" size={32} strokeWidth={1.5} />
        </div>
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm rotate-12">
          New
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">No trips yet? No problem.</h2>
      <p className="text-slate-500 mb-10 font-medium max-w-sm mx-auto leading-relaxed">
        Start a new journey with our AI architect. Your itineraries will be safely stored here.
      </p>
      <button 
        onClick={onOpen}
        className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        <Sparkles size={18} className="text-teal-400" />
        Create a trip
      </button>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden relative">
      {/* Top Bar */}
      <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <span className="font-semibold text-slate-900 tracking-tight">Trips</span>
        <button 
          onClick={onOpen} 
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-all shadow-md shadow-gray-200"
        >
          <Plus size={14} /> New trip
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-end justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Your trips</h1>
            
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-white px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-gray-200 hover:shadow-sm">
              All <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>

          <div className="mb-12">
            <label className="flex items-center gap-3 cursor-pointer group w-fit select-none">
              <div 
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-spring ${showBookedOnly ? 'bg-teal-600' : 'bg-gray-200'}`}
                onClick={() => setShowBookedOnly(!showBookedOnly)}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${showBookedOnly ? 'translate-x-5' : ''}`}></div>
              </div>
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Booked only</span>
            </label>
          </div>

          {!hasTrip ? (
             renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
               <div 
                 onClick={() => onNavigate('chat')} 
                 className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
               >
                  <div className="h-56 bg-gray-200 relative overflow-hidden">
                    <img 
                       src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800"
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                       alt="Trip Cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30 uppercase tracking-wide">
                        Draft
                    </div>
                    <div className="absolute bottom-4 left-6 right-6">
                        <h3 className="text-2xl font-bold text-white mb-1 shadow-sm truncate">{currentItinerary.title || currentItinerary.destination || "New Adventure"}</h3>
                        <div className="flex items-center gap-4 text-white/90 text-xs font-medium">
                            <span className="flex items-center gap-1.5 backdrop-blur-sm bg-black/10 px-2 py-1 rounded-md">
                                <Calendar size={12} />
                                {currentItinerary.durationDays ? `${currentItinerary.durationDays} Days` : "Dates TBD"}
                            </span>
                            <span className="flex items-center gap-1.5 backdrop-blur-sm bg-black/10 px-2 py-1 rounded-md">
                                <Users size={12} />
                                {currentItinerary.travelers || "Travelers TBD"}
                            </span>
                        </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Destination</span>
                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-teal-500" />
                                    {currentItinerary.destination || "Not set yet"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Est. Budget</span>
                                <span className="text-sm font-semibold text-slate-700">
                                    {currentItinerary.totalEstimatedCost ? `$${currentItinerary.totalEstimatedCost}` : "Calculating..."}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                         <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs font-bold text-teal-800 shadow-sm">You</div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-xs text-gray-400 shadow-sm"><Plus size={12} /></div>
                         </div>
                         <button className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition-colors flex items-center gap-1">
                            Continue planning <ChevronDown size={12} className="-rotate-90" />
                         </button>
                    </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>

      {/* Create Trip Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose} // Backdrop click to close
        >
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
            className="bg-white md:rounded-[2rem] shadow-2xl w-full max-w-5xl h-full md:h-[650px] overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300 ring-1 ring-white/50"
          >
            
            {/* Close Button - Updated for visibility on white background */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-50 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all"
            >
              <X size={20} />
            </button>

            {/* Left Side: Visual */}
            <div className="w-full md:w-5/12 relative overflow-hidden hidden md:block bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800" 
                alt="Travel Collage" 
                className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[20s] hover:scale-110 ease-linear"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
              
              <div className="absolute bottom-10 left-8 right-8 text-white">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wide mb-4">
                    <Sparkles size={12} /> AI Powered
                 </div>
                 <h2 className="text-3xl font-extrabold mb-3 leading-tight">Where will your imagination take you?</h2>
                 <p className="text-white/80 text-sm leading-relaxed font-medium">
                   Tell us the basics, and we'll handle the logistics, bookings, and hidden gems.
                 </p>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white pt-20 md:pt-12">
               <div className="max-w-md mx-auto h-full flex flex-col">
                   <div className="mb-8">
                     <h2 className="text-2xl font-bold text-slate-900 mb-1">Create a new trip</h2>
                     <p className="text-slate-500 text-sm">Fill in the details below to start planning.</p>
                   </div>
                   
                   <form onSubmit={handleCreateSubmit} className="space-y-6 flex-1">
                     
                     <div className="group">
                        <input 
                          type="text" 
                          placeholder="Name your trip..."
                          className="w-full px-0 py-3 border-b-2 border-gray-100 focus:border-slate-900 focus:outline-none transition-all placeholder-gray-300 text-2xl font-bold text-slate-900 bg-transparent"
                          value={tripName}
                          onChange={(e) => setTripName(e.target.value)}
                          autoFocus
                        />
                     </div>

                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Destination</label>
                       <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                          <input 
                            type="text" 
                            placeholder="e.g. Paris, Tokyo, Bali"
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-100 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all font-medium text-slate-900 placeholder-gray-400"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                           <div className="relative group">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                              <select 
                                className="w-full pl-11 pr-8 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-100 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                              >
                                 <option>3 days</option>
                                 <option>5 days</option>
                                 <option>7 days</option>
                                 <option>10 days</option>
                                 <option>2 weeks</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                           </div>
                         </div>

                         <div className="space-y-1.5">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Travelers</label>
                           <div className="relative group">
                              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                              <select 
                                className="w-full pl-11 pr-8 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-100 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                                value={travelers}
                                onChange={(e) => setTravelers(e.target.value)}
                              >
                                 <option>Solo</option>
                                 <option>Couple</option>
                                 <option>2 People</option>
                                 <option>Family (4)</option>
                                 <option>Group (5+)</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                           </div>
                         </div>
                     </div>

                     <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Budget</label>
                       <div className="relative group">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                          <select 
                            className="w-full pl-11 pr-8 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-100 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                          >
                             <option>Flexible budget</option>
                             <option>Budget friendly</option>
                             <option>Mid-range</option>
                             <option>Luxury</option>
                             <option>Ultra High-End</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                       </div>
                     </div>

                     <div className="pt-8 mt-auto">
                        <button 
                          type="submit"
                          disabled={!location}
                          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                        >
                          {location ? 'Start Planning' : 'Enter a destination'} <Plane size={18} className={location ? "animate-pulse" : ""} />
                        </button>
                     </div>
                   </form>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};