
import React, { useState } from 'react';
import { InspirationGuide, PlaceDetails, ActivityType } from '../types';
import { Search, Heart, Plus, MapPin, X, ArrowRight, Share2, Sparkles, User, Info, Star } from 'lucide-react';
import { PlaceCard } from './PlaceCard';

interface InspirationViewProps {
  onPlanTrip: (prompt: string) => void;
  onAddItem: (item: PlaceDetails) => void;
}

// Mock Data for Inspiration Guides
const INSPIRATION_GUIDES: InspirationGuide[] = [
  {
    id: '1',
    title: 'Cape Town & Beyond: The Ultimate Adventure & Escape Guide',
    location: 'Cape Town, South Africa',
    author: {
      name: 'connievz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e27?auto=format&fit=crop&w=1200&q=80',
    placeCount: 8,
    days: 5,
    description: "Discover the soul of South Africa's Mother City — where rugged mountains meet turquoise seas and vineyards roll into wild coastlines. This guide curates the best experiences in and around Cape Town, from iconic landmarks like Table Mountain and Boulders Beach to hidden gems in the winelands and beyond.",
    places: [
      { name: 'Table Mountain', category: ActivityType.SIGHTSEEING, description: 'Iconic flat-topped mountain overlooking Cape Town.', rating: 4.9, priceLevel: '$$' },
      { name: 'Kirstenbosch National Botanical Garden', category: ActivityType.LEISURE, description: 'Acclaimed botanical garden nestled at the eastern foot of Table Mountain.', rating: 4.8, priceLevel: '$' },
      { name: 'Boulders Beach', category: ActivityType.SIGHTSEEING, description: 'Sheltered beach made up of inlets between granite boulders, home to penguins.', rating: 4.7, priceLevel: '$' },
      { name: 'V&A Waterfront', category: ActivityType.SHOPPING, description: 'Shopping and dining destination with harbor views.', rating: 4.6, priceLevel: '$$$' },
    ]
  },
  {
    id: '2',
    title: 'A 4-Day Mendoza Itinerary You’ll Love',
    location: 'Mendoza, Argentina',
    author: {
      name: 'cavernsaga',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1534234828563-02597284b80e?auto=format&fit=crop&w=1200&q=80',
    placeCount: 12,
    days: 4,
    description: "Malbec, mountains, and magic. This itinerary takes you through the heart of Argentina's wine country.",
    places: [
       { name: 'Bodega Catena Zapata', category: ActivityType.DINING, description: 'Iconic winery with pyramid architecture.', rating: 4.9, priceLevel: '$$$$' },
       { name: 'Park Hyatt Mendoza', category: ActivityType.ACCOMMODATION, description: 'Luxury hotel in a restored 19th-century facade.', rating: 4.7, priceLevel: '$$$' }
    ]
  },
  {
    id: '3',
    title: 'Budapest, Vienna & Prague 🌟 Your Guide to Central Europe! 🌟',
    location: 'Prague, Czech Republic',
    author: {
      name: 'whereissibley',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1541336318489-08459429658f?auto=format&fit=crop&w=1200&q=80',
    placeCount: 96,
    days: 10,
    description: "The ultimate tri-city tour of Central Europe's jewels. History, architecture, and nightlife.",
    places: []
  },
  {
    id: '4',
    title: 'Prague: food guide by neighborhood',
    location: 'Prague, Czech Republic',
    author: {
      name: 'vanessa.eats.prague',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    placeCount: 27,
    days: 1,
    description: "Eat your way through Prague's distinct neighborhoods with this foodie guide.",
    places: []
  },
    {
    id: '5',
    title: 'Tokyo Coffee Scene: The best beans in town',
    location: 'Tokyo, Japan',
    author: {
      name: 'coffeedude',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?auto=format&fit=crop&w=1200&q=80',
    placeCount: 15,
    days: 2,
    description: "From Kissaten to third-wave roasters, explore Tokyo's deep coffee culture.",
    places: []
  }
];

export const InspirationView: React.FC<InspirationViewProps> = ({ onPlanTrip, onAddItem }) => {
  const [selectedGuide, setSelectedGuide] = useState<InspirationGuide | null>(null);

  const handleCreateTrip = () => {
    if (!selectedGuide) return;
    const prompt = `Help me plan a ${selectedGuide.days}-day trip to ${selectedGuide.location}, inspired by the guide "${selectedGuide.title}". Include these places: ${selectedGuide.places?.map(p => p.name).join(', ')}.`;
    onPlanTrip(prompt);
  };

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      
      {!selectedGuide ? (
        <>
          {/* Main List View */}
          <div className="px-8 pt-12 pb-6 bg-white z-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Inspiration</h1>
            
            {/* Tabs */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2 no-scrollbar">
              <button className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-bold whitespace-nowrap">All</button>
              <button className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-full text-sm font-medium hover:bg-gray-50 whitespace-nowrap">Itineraries</button>
              <button className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-full text-sm font-medium hover:bg-gray-50 whitespace-nowrap">Lists</button>
            </div>

            {/* Search */}
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
               <input 
                 type="text" 
                 placeholder="Search for location or username" 
                 className="w-full pl-12 pr-12 py-4 bg-gray-100 rounded-2xl text-slate-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-400">
                  <Search size={16} />
               </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Featured guides</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {INSPIRATION_GUIDES.map((guide) => (
                <div 
                  key={guide.id} 
                  className="group cursor-pointer flex flex-col"
                  onClick={() => setSelectedGuide(guide)}
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-3">
                     <img 
                       src={guide.coverImage} 
                       alt={guide.title} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
                     
                     <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900">
                        {guide.placeCount} places
                     </div>

                     <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur rounded-full text-white">
                            <Heart size={14} />
                        </button>
                        <button className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur rounded-full text-white">
                            <Plus size={14} />
                        </button>
                     </div>

                     <div className="absolute bottom-4 right-4">
                         <Info className="text-white/80" size={18} />
                     </div>
                  </div>

                  <h3 className="font-bold text-slate-900 leading-tight mb-2 line-clamp-2">{guide.title}</h3>
                  
                  <div className="flex items-center gap-2 mt-auto">
                    <img 
                      src={guide.author.avatar} 
                      alt={guide.author.name}
                      className="w-5 h-5 rounded-full object-cover" 
                    />
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                       <span className="font-medium text-slate-700">{guide.author.name}</span>
                       <span className="text-gray-300">•</span>
                       <MapPin size={10} />
                       <span className="truncate max-w-[120px]">{guide.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Detailed Guide View */
        <div className="flex-1 flex flex-col md:flex-row relative animate-in slide-in-from-right duration-300">
          
          {/* Left Panel: Content */}
          <div className="w-full md:w-1/2 h-full flex flex-col bg-white overflow-y-auto">
            {/* Nav Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-transparent absolute text-white">
               <div className="flex gap-2">
                 <button 
                   onClick={() => setSelectedGuide(null)} 
                   className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-colors"
                 >
                   <ArrowLeftIcon />
                 </button>
                 <button className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-colors">
                   <ListIcon />
                 </button>
               </div>
               <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full font-bold text-sm hover:bg-black/40 transition-colors">
                    <Heart size={16} /> Save
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full font-bold text-sm hover:bg-black/40 transition-colors">
                    <Plus size={16} /> Add to trip
                 </button>
                 <button className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-colors">
                   <Share2 size={18} />
                 </button>
               </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[50vh] shrink-0">
               <img src={selectedGuide.coverImage} className="w-full h-full object-cover" alt="Cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
               
               <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight shadow-sm">{selectedGuide.title}</h1>
                  <div className="flex items-center gap-3">
                     <img src={selectedGuide.author.avatar} className="w-8 h-8 rounded-full border border-white/50" alt="Author" />
                     <span className="font-bold">{selectedGuide.author.name}</span>
                     <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                     <span>{selectedGuide.placeCount} places</span>
                  </div>
               </div>
            </div>

            {/* Content Body */}
            <div className="p-8">
               <div className="flex flex-wrap gap-2 mb-6">
                 <button 
                    onClick={handleCreateTrip}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-bold text-slate-900 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
                 >
                    <Sparkles size={16} className="text-teal-500" /> Plan a trip
                 </button>
                  <div className="text-xs font-medium text-gray-400 flex items-center px-2">Updated: 4h ago</div>
               </div>

               <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
               <p className="text-slate-600 leading-relaxed text-lg mb-12">
                 {selectedGuide.description}
               </p>

               <div className="space-y-6">
                 {selectedGuide.places?.map((place, idx) => (
                    <div key={idx} className="flex gap-4 group">
                       <div className="w-8 flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                             {idx + 1}
                          </div>
                          {idx < (selectedGuide.places?.length || 0) - 1 && <div className="w-0.5 flex-1 bg-gray-100 my-1 group-hover:bg-gray-200 transition-colors"></div>}
                       </div>
                       <div className="flex-1 pb-8">
                          <PlaceCard details={place} onAdd={onAddItem} />
                       </div>
                    </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Panel: Map */}
          <div className="hidden md:block w-1/2 bg-blue-50 relative">
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-100"
                style={{
                    backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/e/ec/Stockholm_map.png")', 
                    filter: 'grayscale(20%) contrast(90%) brightness(110%) hue-rotate(190deg)'
                }}
             ></div>
             
             {/* Simulated Guide Markers */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                 <div className="relative">
                    <div className="absolute -top-20 -left-10 bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold whitespace-nowrap flex items-center gap-2">
                       <MapPin size={12} /> {selectedGuide.places?.[0]?.name || "Point of Interest"}
                    </div>
                    <div className="w-4 h-4 bg-slate-900 rounded-full border-2 border-white shadow-md"></div>
                 </div>
             </div>
             
             <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                 <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 text-slate-900">
                    <Plus size={20} />
                 </button>
                 <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 text-slate-900">
                    <div className="w-3 h-0.5 bg-slate-900"></div>
                 </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Icons helper
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
