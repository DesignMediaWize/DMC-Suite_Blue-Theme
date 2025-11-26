import React, { useState } from 'react';
import { Search, Edit, Briefcase, Plus, MessageSquare } from 'lucide-react';

interface ChatSessionSummary {
  id: string;
  title: string;
  preview: string;
  time: string;
}

interface ChatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onNewTrip: () => void;
  activeChatId?: string;
}

const MOCK_HISTORY: ChatSessionSummary[] = [
  { id: '1', title: 'Trip to Paris', preview: 'Looking for boutique hotels in Le Marais...', time: '2h ago' },
  { id: '2', title: 'Tokyo Itinerary', preview: '3-day plan including Tsukiji market...', time: '1d ago' },
  { id: '3', title: 'Weekend in Napa', preview: 'Wineries that allow dogs...', time: '3d ago' },
];

export const ChatsDrawer: React.FC<ChatsDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onSelectChat, 
  onNewChat, 
  onNewTrip,
  activeChatId 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = MOCK_HISTORY.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={`
        fixed top-0 bottom-0 left-[280px] w-[350px] bg-white border-r border-gray-200 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="p-6 pb-2">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Chats</h2>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search chats..." 
            className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-slate-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Primary Actions */}
        <div className="space-y-1 mb-8">
          <button 
            onClick={() => {
                onNewChat();
                onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-slate-700 transition-colors group text-left"
          >
            <Edit size={18} className="text-slate-400 group-hover:text-slate-900" />
            <span className="text-sm font-semibold">New chat</span>
          </button>
          
          <button 
            onClick={() => {
                onNewTrip();
                onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-slate-700 transition-colors group text-left"
          >
            <Briefcase size={18} className="text-slate-400 group-hover:text-slate-900" />
            <span className="text-sm font-semibold">New trip</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="mb-2 px-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recent</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-1">
            {filteredChats.length > 0 ? (
                filteredChats.map(chat => (
                    <button
                        key={chat.id}
                        onClick={() => {
                            onSelectChat(chat.id);
                            onClose();
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all border ${
                            activeChatId === chat.id 
                            ? 'bg-teal-50 border-teal-100' 
                            : 'bg-white border-transparent hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-sm font-bold truncate pr-2 ${activeChatId === chat.id ? 'text-teal-900' : 'text-slate-900'}`}>
                                {chat.title}
                            </span>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">{chat.time}</span>
                        </div>
                        <p className={`text-xs truncate ${activeChatId === chat.id ? 'text-teal-700' : 'text-gray-500'}`}>
                            {chat.preview}
                        </p>
                    </button>
                ))
            ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                    No chats found
                </div>
            )}
        </div>
      </div>
    </div>
  );
};