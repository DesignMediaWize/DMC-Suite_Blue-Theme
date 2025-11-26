import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PlaceDetails } from '../types';
import { Loader2, Bot, Plus, Mic, ArrowRight, MapPin, Briefcase, Map, Sparkles, Compass } from 'lucide-react';
import { PlaceCard } from './PlaceCard';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  onGenerateItinerary: () => void;
  onCreateTrip: () => void;
  onAddPlace: (place: PlaceDetails) => void;
  addedPlaceIds: Set<string>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isGenerating,
  onGenerateItinerary,
  onCreateTrip,
  onAddPlace,
  addedPlaceIds
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const hasUserMessages = messages.some(m => m.role === 'user');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (hasUserMessages) scrollToBottom();
  }, [messages, isGenerating, hasUserMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input);
    setInput('');
  };

  const LandingPageSplit = () => (
    <div className="flex h-full w-full">
        
        {/* LEFT PANEL (70%) - Hero & Input */}
        <div className="flex-1 relative flex flex-col bg-white">
            
            {/* Header Actions (Top Right of Left Panel) */}
            <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={onCreateTrip} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Briefcase size={14} />
                  <span>Create a trip</span>
                </button>
            </div>

            {/* Hero Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center p-12 pb-32 text-center">
                 {/* 3D Collage */}
                 <div className="relative w-72 h-72 mb-10 group">
                    <img 
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400" 
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-60 object-cover rounded-2xl shadow-2xl rotate-[-6deg] z-10 border-4 border-white transition-transform duration-700 group-hover:rotate-[-8deg] group-hover:scale-105"
                        alt="Travel 1"
                    />
                    <img 
                        src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=400" 
                        className="absolute top-12 left-1/2 -translate-x-[15%] w-40 h-40 object-cover rounded-full shadow-xl z-20 border-4 border-white transition-transform duration-700 group-hover:rotate-[5deg] group-hover:scale-105"
                        alt="Travel 2"
                    />
                    <div className="absolute -top-4 right-8 bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg animate-bounce duration-[3s]">
                        <MapPin className="text-rose-500 fill-current" size={24} />
                    </div>
                 </div>

                 <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">
                    Where to today?
                 </h1>
                 <p className="text-slate-500 text-lg max-w-md leading-relaxed font-medium">
                    Hey there, I’m here to assist you in planning your experience. Ask me anything travel related.
                 </p>
            </div>

            {/* Input Bar - Anchored to Bottom of Left Panel */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="max-w-2xl mx-auto">
                     {/* Helper Pill */}
                     <div className="flex justify-center mb-4">
                         <button className="px-5 py-2 bg-white border border-gray-100 text-xs font-bold text-slate-600 rounded-full hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
                            What can I ask DMC Suite?
                         </button>
                     </div>

                     <form onSubmit={handleSubmit} className="relative group">
                         <div className="absolute inset-0 bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-200 group-focus-within:border-slate-300 group-focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300"></div>
                         
                         <div className="relative flex items-center px-4 py-3">
                             <button type="button" className="p-2.5 bg-gray-50 rounded-full text-slate-900 hover:bg-gray-100 transition-colors">
                                <Plus size={20} strokeWidth={2.5} />
                             </button>
                             
                             <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-lg px-4 text-slate-900 placeholder-gray-400 font-medium"
                                disabled={isGenerating}
                             />

                             <div className="flex items-center gap-2">
                                {!input && (
                                     <button type="button" className="p-2 text-gray-400 hover:text-slate-900 transition-colors">
                                        <Mic size={20} />
                                     </button>
                                )}
                                <button 
                                    type="submit" 
                                    disabled={!input.trim() || isGenerating}
                                    className={`p-2.5 rounded-full transition-all duration-300 ${
                                        input.trim() 
                                        ? 'bg-slate-900 text-white shadow-md transform hover:scale-105' 
                                        : 'bg-gray-100 text-gray-300'
                                    }`}
                                >
                                    <ArrowRight size={20} strokeWidth={2.5} />
                                </button>
                             </div>
                         </div>
                     </form>
                     
                     <div className="text-center mt-4 text-[10px] text-gray-400 font-bold tracking-wide flex items-center justify-center gap-1.5 opacity-60">
                         DMC Suite can make mistakes. Check important info.
                     </div>
                </div>
            </div>
        </div>

        {/* RIGHT PANEL (30%) - Suggestions */}
        <div className="w-[400px] bg-gray-50 border-l border-gray-200 h-full overflow-y-auto hidden xl:block">
            <div className="p-8 space-y-10">
                
                {/* Section 1: For You */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            For you in <span className="underline decoration-slate-300 decoration-dotted underline-offset-4">Rinkeby-Kista</span>
                        </h3>
                    </div>
                    
                    <div className="space-y-3">
                        {/* Card 1 */}
                        <div className="h-40 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Hotel" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">Nov 28</div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <h4 className="font-bold text-sm leading-tight mb-0.5">Stallmästaregården</h4>
                                <div className="flex items-center gap-1 text-[10px] opacity-90"><Briefcase size={10} /> Hotel</div>
                            </div>
                        </div>
                         {/* Card 2 */}
                         <div className="h-40 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1590073242678-cfe4f25c65f5?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Hotel" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <h4 className="font-bold text-sm leading-tight mb-0.5">Blique by Nobis</h4>
                                <div className="flex items-center gap-1 text-[10px] opacity-90"><Briefcase size={10} /> Hotel</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Get Started */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm">Get started</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="aspect-square rounded-2xl relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1565538563729-2df807e324c4?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" alt="Quiz" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white font-bold text-xs leading-tight">Take our travel quiz</div>
                        </div>
                        <div className="aspect-square rounded-2xl relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                             <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" alt="Tools" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white font-bold text-xs leading-tight">Creator tools</div>
                        </div>
                    </div>
                </div>

                 {/* Section 3: Get Inspired */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">Get inspired</h3>
                        <button className="text-xs font-bold text-slate-400 hover:text-slate-900">See all</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="aspect-[4/5] rounded-2xl relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Skye" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full border border-white overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=50" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 text-white font-bold text-xs leading-tight">Isle of Skye Road Trip</div>
                        </div>
                        <div className="aspect-[4/5] rounded-2xl relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                             <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Paris" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full border border-white overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=50" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 text-white font-bold text-xs leading-tight">Things to Do in Paris</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white font-sans">
      
      {/* Active Chat Header */}
      {hasUserMessages && (
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-20">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                    <Bot size={16} />
                </div>
                <h2 className="font-bold text-gray-900">DMC Assistant</h2>
             </div>
             <button 
                onClick={onCreateTrip} 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-900 text-xs font-bold rounded-full hover:bg-gray-50 transition-all shadow-sm"
              >
                <Briefcase size={14} />
                <span>Create a trip</span>
              </button>
          </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white scroll-smooth relative">
        
        {!hasUserMessages ? (
             <LandingPageSplit />
        ) : (
             <div className="max-w-3xl mx-auto space-y-8 px-6 py-6 pb-32">
                 {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        {msg.role === 'model' && (
                             <div className="flex items-center gap-2 mb-2 px-2">
                                <Bot size={16} className="text-teal-600" />
                                <span className="text-xs font-bold text-gray-500">Mindtrip</span>
                             </div>
                        )}

                        <div className={`max-w-[90%] lg:max-w-[85%] ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-2xl rounded-tr-none shadow-md' : 'text-slate-900'}`}>
                        
                            <div className={`p-4 text-sm leading-relaxed ${msg.role === 'user' ? '' : ''}`}>
                                <div className="whitespace-pre-wrap">{msg.richContent ? msg.richContent.text : msg.text}</div>
                            </div>

                            {/* Generative UI: Place Cards */}
                            {msg.richContent?.places && msg.richContent.places.length > 0 && (
                                <div className="mt-2 px-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                                    {msg.richContent.places.map((place, idx) => (
                                    <div key={idx} className="w-full">
                                        <PlaceCard 
                                            details={place} 
                                            onAdd={onAddPlace}
                                            isAdded={addedPlaceIds.has(place.name)}
                                        />
                                    </div>
                                    ))}
                                </div>
                                </div>
                            )}
                             {/* Grounding Sources */}
                            {msg.groundingSources && msg.groundingSources.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 px-4 pb-4">
                                {msg.groundingSources.map((source, idx) => (
                                    <a 
                                    key={idx}
                                    href={source.uri}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-semibold text-gray-600 hover:text-teal-600 hover:border-teal-200 transition-all"
                                    >
                                    <Map size={12} />
                                    {source.title.replace('Map Link', 'View on Google Maps')}
                                    </a>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>
                 ))}
                 
                 {isGenerating && (
                    <div className="flex justify-start w-full">
                        <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
                        <Loader2 className="animate-spin text-teal-600" size={18} />
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Thinking...</span>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
             </div>
        )}
      </div>

      {/* Floating Input Area - ONLY for Active Chat Mode (Landing Page has its own) */}
      {hasUserMessages && (
          <div className="fixed bottom-0 left-0 md:left-[280px] right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-30">
             <div className="max-w-3xl mx-auto pointer-events-auto">
                 <form onSubmit={handleSubmit} className="relative group">
                     <div className="absolute inset-0 bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200 group-focus-within:border-gray-400 transition-colors"></div>
                     
                     <div className="relative flex items-center px-4 py-3">
                         <button type="button" className="p-2 bg-gray-100 rounded-full text-slate-900 hover:bg-gray-200 transition-colors">
                            <Plus size={20} />
                         </button>
                         
                         <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-lg px-4 text-slate-900 placeholder-gray-400"
                            disabled={isGenerating}
                         />
    
                         <div className="flex items-center gap-2">
                            {!input && (
                                 <button type="button" className="p-2 text-gray-400 hover:text-slate-900 transition-colors">
                                    <Mic size={20} />
                                 </button>
                            )}
                            <button 
                                type="submit" 
                                disabled={!input.trim() || isGenerating}
                                className={`p-2 rounded-full transition-all ${
                                    input.trim() 
                                    ? 'bg-slate-900 text-white shadow-md transform hover:scale-105' 
                                    : 'bg-gray-100 text-gray-300'
                                }`}
                            >
                                <ArrowRight size={20} />
                            </button>
                         </div>
                     </div>
                 </form>
             </div>
          </div>
      )}
    </div>
  );
};