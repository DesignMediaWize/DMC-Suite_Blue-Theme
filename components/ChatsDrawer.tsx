
import React, { useState } from 'react';
import { Search, SquarePen, Briefcase } from 'lucide-react';

interface ChatSessionSummary {
  id: string;
  title: string;
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
  { id: '1', title: 'Untitled' },
  { id: '2', title: 'Untitled' },
  { id: '3', title: 'Trip to Paris' },
  { id: '4', title: 'Untitled' },
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
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={`
        fixed top-0 bottom-0 left-[280px] w-[320px] bg-white border-r border-gray-200 shadow-xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Chats</h2>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search chats..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-slate-900 placeholder-gray-500 focus:bg-gray-50 focus:ring-0 focus:outline-none transition-all"
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
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 text-slate-700 transition-colors group text-left"
          >
            <SquarePen size={20} strokeWidth={1.5} className="text-slate-900" />
            <span className="text-sm font-medium text-slate-900">New chat</span>
          </button>
          
          <button 
            onClick={() => {
                onNewTrip();
                onClose();
            }}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 text-slate-700 transition-colors group text-left"
          >
            <Briefcase size={20} strokeWidth={1.5} className="text-slate-900" />
            <span className="text-sm font-medium text-slate-900">New trip</span>
          </button>
        </div>

        {/* Chat List Header */}
        <div className="mb-2 px-2">
            <h3 className="text-xs text-gray-500 font-medium">Chats</h3>
        </div>
      
        {/* Chat List */}
        <div className="space-y-0.5">
            {filteredChats.length > 0 ? (
                filteredChats.map(chat => (
                    <button
                        key={chat.id}
                        onClick={() => {
                            onSelectChat(chat.id);
                            onClose();
                        }}
                        className={`w-full text-left px-2 py-2.5 rounded-lg transition-all ${
                            activeChatId === chat.id 
                            ? 'bg-gray-100' 
                            : 'hover:bg-gray-50'
                        }`}
                    >
                        <span className={`text-sm font-medium ${activeChatId === chat.id ? 'text-slate-900' : 'text-slate-700'}`}>
                            {chat.title}
                        </span>
                    </button>
                ))
            ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                    No chats found
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
