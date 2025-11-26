
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Search, 
  Heart, 
  Briefcase, 
  Bell, 
  Compass, 
  PlusSquare, 
  ChevronLeft, 
  Crown,
  User,
  MoreHorizontal,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Page } from '../types';
import { UpdatesDrawer } from './UpdatesDrawer';
import { ChatsDrawer } from './ChatsDrawer';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
  isUpdatesOpen: boolean;
  onToggleUpdates: () => void;
  isChatsOpen: boolean;
  onToggleChats: () => void;
  onCreateTrip: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activePage, 
  onNavigate, 
  isUpdatesOpen, 
  onToggleUpdates,
  isChatsOpen,
  onToggleChats,
  onCreateTrip,
  onNewChat,
  onSelectChat
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const handleNav = (page: Page) => {
    if (page === 'updates') {
      if (isChatsOpen) onToggleChats();
      onToggleUpdates();
    } else if (page === 'chat') {
      if (activePage === 'chat') {
          if (isUpdatesOpen) onToggleUpdates();
          onToggleChats();
      } else {
          onNavigate('chat');
      }
    } else {
      if (isUpdatesOpen) onToggleUpdates();
      if (isChatsOpen) onToggleChats();
      onNavigate(page);
    }
    setIsMobileOpen(false);
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-200 font-sans">
      
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-slate-900 rounded-full shadow-md border border-slate-700 text-white"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed md:relative z-50 h-full w-[280px] bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header / Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('chat')}>
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 shadow-glow">
                <Crown size={20} strokeWidth={2.5} fill="currentColor" className="text-slate-900" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-serif">DMC Suite</span>
          </div>
        </div>

        {/* Scrollable Nav Content */}
        <div className="flex-1 overflow-y-auto px-3 space-y-6">
          
          {/* Main Links */}
          <nav className="space-y-1">
            <NavItem 
              icon={<MessageCircle size={20} />} 
              label="Chats" 
              badge="1" 
              active={(activePage === 'chat' && !isUpdatesOpen) || isChatsOpen} 
              onClick={() => handleNav('chat')}
            />
            <NavItem 
              icon={<Search size={20} />} 
              label="Explore" 
              active={activePage === 'explore' && !isUpdatesOpen && !isChatsOpen}
              onClick={() => handleNav('explore')}
            />
            <NavItem 
              icon={<Heart size={20} />} 
              label="Saved" 
              active={activePage === 'saved' && !isUpdatesOpen && !isChatsOpen}
              onClick={() => handleNav('saved')}
            />
            <NavItem 
              icon={<Briefcase size={20} />} 
              label="Itineraries" 
              active={activePage === 'trips' && !isUpdatesOpen && !isChatsOpen}
              onClick={() => handleNav('trips')}
            />
            <NavItem 
              icon={<Bell size={20} />} 
              label="Updates" 
              active={isUpdatesOpen}
              onClick={() => handleNav('updates')}
            />
            <NavItem 
              icon={<Compass size={20} />} 
              label="Inspiration" 
              active={activePage === 'inspiration' && !isUpdatesOpen && !isChatsOpen}
              onClick={() => handleNav('inspiration')}
            />
            <NavItem 
              icon={<PlusSquare size={20} />} 
              label="Create" 
              active={activePage === 'create' && !isUpdatesOpen && !isChatsOpen}
              onClick={() => handleNav('create')}
            />
          </nav>

          {/* New Request CTA */}
          <div className="px-1">
            <button 
              onClick={() => {
                onNewChat();
                if (isChatsOpen) onToggleChats();
                onNavigate('chat');
              }}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-semibold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <Sparkles size={16} className="group-hover:animate-pulse" />
              New Request
            </button>
          </div>

          {/* Enterprise Promo Card */}
          <div className="relative overflow-hidden rounded-xl bg-slate-800/50 border border-slate-700 p-4 mt-auto mx-1">
             <div className="flex items-center gap-2 mb-2 text-amber-500">
                <Briefcase size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise</span>
             </div>
             <h3 className="font-bold text-white text-sm mb-1">Platinum Partner</h3>
             <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
               Full access to API, white-label exports, and 24/7 priority support.
             </p>
             <button className="text-[10px] font-bold bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md transition-colors">
               Manage Plan
             </button>
          </div>
        </div>

        {/* Footer / Profile */}
        <div className="p-4 mt-auto border-t border-slate-800" ref={profileMenuRef}>
          {/* Profile Menu Popup */}
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-in zoom-in-95 duration-200 origin-bottom-left">
              <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-200">
                   <User size={20} strokeWidth={2} />
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-white text-sm">Traveler</h4>
                   <span className="text-xs text-slate-400">Pro Account</span>
                 </div>
              </div>
              <div className="py-2">
                 <button className="w-full text-left px-5 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">Settings</button>
                 <button className="w-full text-left px-5 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">Billing</button>
                 <button className="w-full text-left px-5 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">Log out</button>
              </div>
            </div>
          )}

          <div 
            className={`flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors group relative ${isProfileMenuOpen ? 'bg-slate-800' : ''}`}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
              <User size={18} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white">Traveler</h4>
            </div>
            <MoreHorizontal size={16} className="text-slate-500 group-hover:text-slate-300" />
          </div>
        </div>
      </aside>

      {/* Updates Drawer */}
      <UpdatesDrawer 
        isOpen={isUpdatesOpen} 
        onClose={onToggleUpdates}
        onCreateTrip={onCreateTrip}
      />

      {/* Chats Drawer */}
      <ChatsDrawer 
        isOpen={isChatsOpen}
        onClose={onToggleChats}
        onNewChat={onNewChat}
        onSelectChat={onSelectChat}
        onNewTrip={onCreateTrip}
        activeChatId={'current'}
      />

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Background Overlay */}
      {(isUpdatesOpen || isChatsOpen) && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-20 md:left-[280px]"
          onClick={() => {
              if (isUpdatesOpen) onToggleUpdates();
              if (isChatsOpen) onToggleChats();
          }}
        />
      )}
      
      {/* Main Application Area */}
      <main className="flex-1 h-full overflow-hidden relative bg-white rounded-l-2xl shadow-2xl md:my-2 md:mr-2 md:border md:border-gray-200 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, badge, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group
      ${active ? 'bg-slate-800 text-white shadow-sm border border-slate-700/50' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
    `}
  >
    <div className="flex items-center gap-3">
      <span className={`${active ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && (
      <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-md ${active ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-500'}`}>
        {badge}
      </span>
    )}
  </button>
);
