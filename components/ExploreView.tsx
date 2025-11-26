import React, { useState } from 'react';
import { ExploreItem } from '../types';
import { Search, MapPin, ArrowUpRight, Filter, Star, X, Heart, Plus, ChevronRight, Navigation, Layers, Minus } from 'lucide-react';

interface ExploreViewProps {
  onPlanTrip: (prompt: string) => void;
  onAddItem: (item: ExploreItem) => void;
  onToggleSave: (item: ExploreItem) => void;
  savedItemIds: Set<string>;
}

// Enriched Mock Data with "Map Positions" & Reliable Images
const MOCK_DESTINATIONS: (ExploreItem & { mapPos: { top: string; left: string } })[] = [
  {
    id: '1',
    title: 'Bistro Järva',
    subtitle: 'Nordic Culinary',
    category: 'Restaurant',
    images: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Italian', 'Burgers'],
    rating: 4.8,
    reviewCount: 82,
    priceLevel: '$$',
    address: 'Akallalänken 10, Stockholm',
    description_long: "Bistro Järva is a popular eatery situated within the Järva Disc Golf Park.",
    prompt: "Is Bistro Järva good for large groups?",
    mapPos: { top: '30%', left: '40%' }
  },
  {
    id: '2',
    title: 'ZAN By Pong',
    subtitle: 'Asian Fusion',
    category: 'Restaurant',
    images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Japanese', 'Sushi'],
    rating: 4.1,
    reviewCount: 1100,
    priceLevel: '$$',
    address: 'Kistagången 20',
    description_long: "Modern Asian fusion in the heart of the tech district.",
    prompt: "Book a table at ZAN By Pong.",
    mapPos: { top: '45%', left: '55%' }
  },
  {
    id: '3',
    title: 'Scandic Victoria',
    subtitle: 'Central Stay',
    category: 'Hotel',
    images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Hotel', 'Business'],
    rating: 4.3,
    reviewCount: 3500,
    priceLevel: '$140',
    address: 'Arne Beurlings Torg',
    description_long: "High-rise hotel with sky bar views.",
    prompt: "Check availability for Scandic Victoria.",
    mapPos: { top: '25%', left: '60%' }
  },
  {
    id: '4',
    title: 'Comfort Hotel Solna',
    subtitle: 'Eco Friendly',
    category: 'Hotel',
    images: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80',
    ],
    tags: ['Hotel', 'Modern'],
    rating: 4.0,
    reviewCount: 890,
    priceLevel: '$93',
    address: 'Råsta Strandväg 1',
    description_long: "Zero-carbon hotel with easy access to the arena.",
    prompt: "Details on Comfort Hotel Solna.",
    mapPos: { top: '50%', left: '25%' }
  },
  {
    id: '5',
    title: 'Museum of Natural History',
    subtitle: 'Dino & Nature',
    category: 'Experience',
    images: [
        'https://images.unsplash.com/photo-1518998053901-5348d3969104?auto=format&fit=crop&q=80&w=400',
    ],
    tags: ['Museum', 'Family'],
    rating: 4.7,
    reviewCount: 4200,
    priceLevel: '$15',
    address: 'Frescativägen 40',
    description_long: "Explore the nature of Sweden and the world.",
    prompt: "Opening hours for Natural History Museum.",
    mapPos: { top: '65%', left: '70%' }
  },
  {
    id: '6',
    title: 'Mall of Scandinavia',
    subtitle: 'Shopping & Cinema',
    category: 'Shopping',
    images: [
        'https://images.unsplash.com/photo-1519567241046-7f570eee3c9e?auto=format&fit=crop&q=80&w=400',
    ],
    tags: ['Mall', 'Fashion'],
    rating: 4.5,
    reviewCount: 15000,
    priceLevel: '$$',
    address: 'Stjärntorget 2',
    description_long: "The largest shopping mall in Scandinavia.",
    prompt: "Stores in Mall of Scandinavia.",
    mapPos: { top: '38%', left: '50%' }
  }
];

const CATEGORIES = ["For you", "Restaurants", "Things to do", "Events", "Stays", "Locations"];

export const ExploreView: React.FC<ExploreViewProps> = ({ onPlanTrip, onAddItem, onToggleSave, savedItemIds }) => {
  const [activeCategory, setActiveCategory] = useState("For you");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ExploreItem | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'location'>('overview');
  const [chatInput, setChatInput] = useState("");

  const filteredItems = MOCK_DESTINATIONS.filter(item => {
    if (activeCategory === "Restaurants" && item.category !== 'Restaurant') return false;
    if (activeCategory === "Stays" && item.category !== 'Hotel') return false;
    return item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const fullPrompt = `Regarding ${selectedItem?.title}: ${chatInput}`;
    onPlanTrip(fullPrompt);
  };

  return (
    <div className="h-full relative bg-gray-50 flex overflow-hidden font-sans">
      
      {/* Left Panel: Filters & List */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col h-full bg-white border-r border-gray-200 z-10 shadow-xl lg:shadow-none">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white z-20">
          <div className="flex items-center gap-2 mb-4">
             <h1 className="text-xl font-bold text-midnight font-serif">Discovery</h1>
             <ChevronRight className="rotate-90 text-gray-400" size={16} />
          </div>

          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                type="text" 
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-midnight focus:border-midnight focus:bg-white transition-all text-sm font-medium text-midnight"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-colors">
                <Filter size={16} /> Filters
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-colors uppercase tracking-wide ${
                  activeCategory === cat 
                  ? 'bg-midnight text-white' 
                  : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{activeCategory}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                {filteredItems.map(item => (
                <div 
                    key={item.id} 
                    className={`group bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border
                        ${hoveredItemId === item.id ? 'shadow-xl border-gray-300 ring-1 ring-gray-200 transform -translate-y-1' : 'shadow-sm border-gray-200'}
                    `}
                    onClick={() => setSelectedItem(item)}
                    onMouseEnter={() => setHoveredItemId(item.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                >
                    <div className="h-44 overflow-hidden relative">
                        <img 
                            src={item.images[0]} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <button className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white backdrop-blur-md rounded text-midnight transition-colors shadow-sm">
                            <Heart size={14} fill={savedItemIds.has(item.id) ? "currentColor" : "none"} />
                        </button>
                         <button className="absolute top-2 right-10 p-1.5 bg-white/90 hover:bg-white backdrop-blur-md rounded text-midnight transition-colors shadow-sm">
                            <Plus size={14} />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-midnight/80 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase tracking-wide border border-white/10">
                            {item.category}
                        </div>
                    </div>
                    
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-midnight leading-tight text-lg font-serif">{item.title}</h3>
                            <div className="flex items-center gap-1 text-xs font-bold text-midnight">
                                <Star size={12} fill="currentColor" className="text-gold-500" />
                                {item.rating}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-2 font-medium">{item.subtitle} • {item.priceLevel}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="hidden lg:block flex-1 bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-100">
             <div 
                className="w-[150%] h-[150%] bg-cover bg-center absolute -top-[20%] -left-[20%]"
                style={{
                    backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/e/ec/Stockholm_map.png")', 
                    filter: 'grayscale(20%) contrast(90%) brightness(105%) opacity(0.8)',
                    backgroundBlendMode: 'multiply'
                }}
             ></div>
             
             {/* Markers */}
             {MOCK_DESTINATIONS.map((item) => {
                 const isActive = hoveredItemId === item.id || selectedItem?.id === item.id;
                 return (
                    <div 
                        key={item.id}
                        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 
                            ${isActive ? 'scale-110 z-20' : 'hover:scale-105'}
                        `}
                        style={{ top: item.mapPos.top, left: item.mapPos.left }}
                        onMouseEnter={() => setHoveredItemId(item.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                        onClick={() => setSelectedItem(item)}
                    >
                        <div className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded shadow-lg font-bold text-xs border transition-colors
                            ${isActive 
                                ? 'bg-midnight text-white border-midnight' 
                                : 'bg-white text-midnight border-gray-200 hover:bg-gray-50'
                            }
                        `}>
                            {item.category === 'Restaurant' ? '🍴' : '📍'}
                            <span className={isActive ? 'text-gold-400' : ''}>{item.priceLevel}</span>
                        </div>
                        <div className={`
                            w-2 h-2 absolute left-1/2 -translate-x-1/2 -bottom-1 rotate-45 border-r border-b
                            ${isActive ? 'bg-midnight border-midnight' : 'bg-white border-gray-200'}
                        `}></div>
                    </div>
                 );
             })}
        </div>
        
        <div className="absolute top-4 left-4 z-10">
            <button className="px-4 py-2 bg-white rounded shadow-soft text-sm font-semibold hover:bg-gray-50 text-midnight border border-gray-200">
                Search this area
            </button>
        </div>

        <div className="absolute bottom-8 right-4 z-10 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded shadow-soft flex items-center justify-center text-gray-600 hover:text-midnight border border-gray-200">
                <Navigation size={18} />
            </button>
            <div className="bg-white rounded shadow-soft border border-gray-200 flex flex-col">
                <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-midnight border-b border-gray-100">
                    <Plus size={18} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-midnight">
                    <Minus size={18} />
                </button>
            </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
             <button className="w-10 h-10 bg-white rounded shadow-soft flex items-center justify-center text-gray-600 hover:text-midnight border border-gray-200">
                <Layers size={18} />
            </button>
        </div>
      </div>

      {/* Sliding Detail Panel */}
      <div 
        className={`
          fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-100
          ${selectedItem ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {selectedItem && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-gray-100 rounded transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => onToggleSave(selectedItem)}
                  className={`px-4 py-2 rounded border text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${
                    savedItemIds.has(selectedItem.id)
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'border-gray-200 hover:bg-gray-50 text-slate-700'
                  }`}
                >
                  <Heart size={14} fill={savedItemIds.has(selectedItem.id) ? "currentColor" : "none"} /> 
                  Save
                </button>
                <button 
                    onClick={() => onAddItem(selectedItem)}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-midnight text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 shadow-sm border border-midnight"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-8 pb-32">
                
                <h1 className="text-3xl font-bold text-midnight mb-2 font-serif">{selectedItem.title}</h1>
                <p className="text-slate-500 text-lg mb-6">{selectedItem.subtitle}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-100">
                    <span className="flex items-center gap-1 font-bold text-midnight"><Star fill="currentColor" className="text-gold-500" size={14} /> {selectedItem.rating}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-bold text-slate-600 uppercase tracking-wide">{selectedItem.category}</span>
                    <span className="font-serif italic">{selectedItem.priceLevel}</span>
                </div>

                <div className="aspect-video w-full rounded-lg overflow-hidden mb-8 relative bg-gray-100 group shadow-md border border-gray-100">
                    <img src={selectedItem.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main" />
                </div>

                <div className="flex gap-8 border-b border-gray-100 mb-6">
                    {(['overview', 'reviews', 'location'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                                activeTab === tab 
                                ? 'text-midnight border-midnight' 
                                : 'text-gray-400 border-transparent hover:text-gray-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="animate-in fade-in duration-300">
                    {activeTab === 'overview' && (
                        <div>
                            <p className="text-slate-600 leading-relaxed mb-8 font-normal text-base">
                                {selectedItem.description_long}
                            </p>
                            <div className="p-5 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                                <h4 className="font-bold text-xs uppercase text-slate-400 mb-3 tracking-wider">Address</h4>
                                <div className="flex items-center text-sm text-slate-700 font-medium">
                                    <MapPin size={16} className="mr-2 text-gold-500" /> {selectedItem.address}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-20">
               <form 
                 onSubmit={handleChatSubmit}
                 className="bg-white p-2 rounded-lg shadow-2xl border border-gray-100 flex items-center gap-2 ring-1 ring-black/5"
               >
                  <input 
                    type="text" 
                    placeholder={`Inquire about this venue...`}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-400 ml-3"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="w-8 h-8 flex items-center justify-center bg-midnight rounded text-white hover:bg-slate-800 transition-all disabled:opacity-50"
                    disabled={!chatInput.trim()}
                  >
                    <ArrowUpRight size={16} />
                  </button>
               </form>
            </div>
          </>
        )}
      </div>
      
      {selectedItem && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};