
import React, { useState, useEffect } from 'react';
import { ChatMessage, TripItinerary, AppState, PlaceDetails, Page } from './types';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { ItineraryView } from './components/ItineraryView';
import { ExploreView } from './components/ExploreView';
import { SavedView } from './components/SavedView';
import { TripsView } from './components/TripsView';
import { InspirationView } from './components/InspirationView';
import { CreateView } from './components/CreateView';
import { createTravelChat, generateItineraryJson, parseModelResponse } from './services/gemini';
import { ChatSession } from '@google/genai';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [activePage, setActivePage] = useState<Page>('chat');
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  
  // Modal State lifted up so it can be triggered from Sidebar/Updates
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);

  // Canvas items are "Added to Trip" items from the chat
  const [canvasItems, setCanvasItems] = useState<PlaceDetails[]>([]);

  // Saved items are "Hearted" items from Explore/Chat
  const [savedItems, setSavedItems] = useState<PlaceDetails[]>([]);

  const [state, setState] = useState<AppState>({
    currentView: 'split',
    itinerary: { 
        title: "", 
        destination: "", 
        durationDays: 0, 
        days: [], 
        travelers: "" 
    },
    messages: [{
      id: 'welcome',
      role: 'model',
      text: 'Welcome to DMC Suite. I am your specialized AI travel consultant. Where would you like to plan a trip to today?',
      timestamp: new Date()
    }],
    isGenerating: false
  });

  const [mobileTab, setMobileTab] = useState<'chat' | 'itinerary'>('chat');

  useEffect(() => {
    try {
      const chat = createTravelChat();
      setChatSession(chat);
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!chatSession) return;

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    };
    
    setState(prev => ({ 
      ...prev, 
      messages: [...prev.messages, userMsg],
      isGenerating: true 
    }));

    try {
      // 2. Send to Gemini
      const response = await chatSession.sendMessage(text);
      const fullText = response.text || "I'm checking the database...";
      
      // 3. Parse Response for Rich Content (Places)
      const { cleanText, places } = parseModelResponse(fullText);

      // 4. Extract Grounding (Maps)
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const groundingSources = groundingChunks
        ?.filter(chunk => chunk.web?.uri || chunk.web?.title)
        .map(chunk => ({
           title: chunk.web?.title || 'Map Link',
           uri: chunk.web?.uri || '#'
        })) || [];

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: fullText, 
        richContent: {
            text: cleanText,
            places: places
        },
        timestamp: new Date(),
        groundingSources
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, modelMsg],
        isGenerating: false
      }));

    } catch (error) {
      console.error(error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        messages: [...prev.messages, {
          id: Date.now().toString(),
          role: 'model',
          text: "I encountered an error. Please try again.",
          timestamp: new Date()
        }]
      }));
    }
  };

  const handleAddPlaceToCanvas = (place: PlaceDetails) => {
    setCanvasItems(prev => {
        if (prev.find(p => p.name === place.name)) return prev;
        return [...prev, place];
    });
  };

  const handleRemoveCanvasItem = (name: string) => {
    setCanvasItems(prev => prev.filter(p => p.name !== name));
  };

  const handleToggleSave = (place: PlaceDetails) => {
    setSavedItems(prev => {
      const exists = prev.find(p => p.id === place.id || p.name === place.name);
      if (exists) {
        return prev.filter(p => (p.id !== place.id) && (p.name !== place.name));
      }
      return [...prev, { ...place, id: place.id || place.name }];
    });
  };

  const handleGenerateItinerary = async () => {
    if (state.messages.length < 2) return;
    
    setState(prev => ({ ...prev, isGenerating: true }));
    setMobileTab('itinerary'); // Switch view so they see the loading state
    
    try {
      const history = state.messages.map(m => {
          const txt = m.richContent ? m.richContent.text : m.text;
          return `${m.role.toUpperCase()}: ${txt}`;
      }).join('\n');

      const itinerary = await generateItineraryJson(
          history, 
          "Create a structured itinerary based on our conversation.",
          canvasItems 
      );
      
      setState(prev => ({
        ...prev,
        itinerary,
        isGenerating: false,
      }));
      
    } catch (error) {
      console.error("Itinerary gen failed", error);
       setState(prev => ({
        ...prev,
        isGenerating: false,
        messages: [...prev.messages, {
          id: Date.now().toString(),
          role: 'model',
          text: "I couldn't generate the final plan just yet. Please try asking for specific days.",
          timestamp: new Date()
        }]
      }));
    }
  };

  const handlePlanTrip = (prompt: string) => {
    setActivePage('chat');
    setIsUpdatesOpen(false);
    setIsChatsOpen(false);
    setIsCreateTripModalOpen(false);
    handleSendMessage(prompt);
  };

  // Triggered by "Create a trip" buttons in Sidebar, Trips View, or Updates Drawer
  const handleOpenCreateTripModal = () => {
    setActivePage('trips');
    setIsCreateTripModalOpen(true);
    setIsUpdatesOpen(false);
    setIsChatsOpen(false);
  };
  
  // Chat Actions
  const handleNewChat = () => {
      setState(prev => ({
        ...prev,
        messages: [{
          id: 'welcome-' + Date.now(),
          role: 'model',
          text: 'Welcome back. I am ready to start a new plan. Where are we heading?',
          timestamp: new Date()
        }],
        itinerary: { title: "", destination: "", durationDays: 0, days: [], travelers: "" }
      }));
      setCanvasItems([]);
      setActivePage('chat');
  };

  const handleSelectChat = (id: string) => {
      // Simulate loading a chat history
      setState(prev => ({
        ...prev,
        messages: [
           {
            id: 'hist-1',
            role: 'model',
            text: 'This is a history view of your chat about Paris. (Simulated)',
            timestamp: new Date()
           },
           {
             id: 'hist-2',
             role: 'user',
             text: 'Show me hotels in Le Marais.',
             timestamp: new Date()
           }
        ]
      }));
      setActivePage('chat');
  };

  // -- Views --

  const renderContent = () => {
    if (activePage === 'explore') {
      return (
        <ExploreView 
            onPlanTrip={handlePlanTrip} 
            onAddItem={(item) => handleAddPlaceToCanvas({
                name: item.title,
                description: item.subtitle,
                imageUrl: item.images[0],
                rating: item.rating,
                priceLevel: item.priceLevel,
                address: item.address,
                category: undefined 
            })}
            onToggleSave={(item) => handleToggleSave({
              id: item.id,
              name: item.title,
              description: item.subtitle,
              imageUrl: item.images[0],
              rating: item.rating,
              priceLevel: item.priceLevel,
              address: item.address
            })}
            savedItemIds={new Set(savedItems.map(i => i.id || i.name))}
        />
      );
    }

    if (activePage === 'saved') {
      return (
        <SavedView 
          savedItems={savedItems} 
          onNavigate={setActivePage} 
          onRemove={(id) => setSavedItems(prev => prev.filter(i => (i.id || i.name) !== id))}
        />
      );
    }

    if (activePage === 'trips') {
      return (
        <TripsView 
          currentItinerary={state.itinerary}
          onNavigate={setActivePage}
          onPlanTrip={handlePlanTrip}
          // Controlled Modal
          isOpen={isCreateTripModalOpen}
          onClose={() => setIsCreateTripModalOpen(false)}
          onOpen={handleOpenCreateTripModal}
        />
      );
    }

    if (activePage === 'inspiration') {
      return (
        <InspirationView 
          onPlanTrip={handlePlanTrip}
          onAddItem={handleAddPlaceToCanvas}
        />
      );
    }

    if (activePage === 'create') {
      return <CreateView />;
    }
    
    // Default: Chat View
    const hasUserMessages = state.messages.some(m => m.role === 'user');

    return (
      <>
        {/* Mobile Header for Chat View - Only shown when active conversation */}
        <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30 relative shrink-0">
          <span className="font-bold text-gray-800">DMC Suite</span>
          {hasUserMessages && (
            <div className="flex gap-2">
              <button 
                onClick={() => setMobileTab('chat')} 
                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide transition-colors ${mobileTab === 'chat' ? 'bg-slate-900 text-white' : 'text-gray-500'}`}
              >
                Chat
              </button>
              <button 
                onClick={() => setMobileTab('itinerary')} 
                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide transition-colors ${mobileTab === 'itinerary' ? 'bg-slate-900 text-white' : 'text-gray-500'}`}
              >
                Canvas {canvasItems.length > 0 && <span className="ml-1 bg-teal-500 text-white px-1.5 rounded-full">{canvasItems.length}</span>}
              </button>
            </div>
          )}
        </div>

        <div className="flex h-full relative overflow-hidden">
          {/* Chat Panel - Full width on Landing Page, Split on Conversation */}
          <div className={`
            absolute md:relative z-10 h-full bg-white border-r border-gray-200 transition-all duration-300
            ${mobileTab === 'chat' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${hasUserMessages ? 'w-full md:w-[450px] lg:w-[500px]' : 'w-full'}
          `}>
            <ChatInterface 
              messages={state.messages} 
              onSendMessage={handleSendMessage}
              isGenerating={state.isGenerating}
              onGenerateItinerary={handleGenerateItinerary}
              onCreateTrip={handleOpenCreateTripModal}
              onAddPlace={handleAddPlaceToCanvas}
              addedPlaceIds={new Set(canvasItems.map(p => p.name))}
            />
          </div>

          {/* Itinerary Panel - Only visible when user has started chatting */}
          {hasUserMessages && (
            <div className={`
              absolute md:relative z-0 w-full md:flex-1 h-full bg-gray-50 transition-transform duration-300
              ${mobileTab === 'itinerary' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
              {state.isGenerating && (!state.itinerary || state.itinerary.days.length === 0) ? (
                 <div className="h-full flex flex-col items-center justify-center p-8">
                    <div className="relative mb-8">
                      <div className="w-20 h-20 rounded-full border-4 border-teal-100 animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Crafting Itinerary</h3>
                    <p className="text-gray-500 text-sm mt-3 max-w-sm text-center">
                       Optimizing routes, checking opening hours, and calculating costs based on your selected preferences...
                    </p>
                 </div>
              ) : (
                <ItineraryView 
                    itinerary={state.itinerary} 
                    canvasItems={canvasItems}
                    onRemoveCanvasItem={handleRemoveCanvasItem}
                />
              )}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Layout 
      activePage={activePage} 
      onNavigate={setActivePage}
      isUpdatesOpen={isUpdatesOpen}
      onToggleUpdates={() => setIsUpdatesOpen(!isUpdatesOpen)}
      isChatsOpen={isChatsOpen}
      onToggleChats={() => setIsChatsOpen(!isChatsOpen)}
      onCreateTrip={handleOpenCreateTripModal}
      onNewChat={handleNewChat}
      onSelectChat={handleSelectChat}
    >
       {renderContent()}
    </Layout>
  );
}
