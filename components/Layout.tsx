
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
  Sparkles,
  User,
  MoreHorizontal,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Crown
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
    <div className="flex h-full w-full bg-gray-50 text-midnight font-sans">
      
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-midnight text-white rounded-lg shadow-md border border-gray-700"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation - MIDNIGHT THEME */}
      <aside 
        className={`
          fixed md:relative z-50 h-full w-[280px] bg-midnight border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out text-gray-300
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header / Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNav('chat')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-midnight shadow-glow">
              <Crown size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-wide text-white font-serif">DMC Suite</span>
          </div>
        </div>

        {/* Scrollable Nav Content */}
        <div className="flex-1 overflow-y-auto px-4 space-y-8">
          
          {/* Main Links */}
          <nav className="space-y-1.5">
            <NavItem 
              icon={<MessageCircle size={18} />} 
              label="Chats" 
              badge="1" 
              active={(activePage === 'chat' && !isUpdatesOpen) || isChatsOpen} 
              onClick={() => handleNav('chat')}
            />
            <NavItem 
              icon={<Search size={18} />} 
              label="Explore" 
              active={activePage === 'explore' && !isUpdatesOpen && !isChatsOpen}
              onClick={() => handleNav('explore')}
            />
            <NavItem 
              icon={<Heart size={18} />} 
              label="Saved" 
              active={activePage === 'saved' && !isUpdatesOpen && !isChatsOpen}
              onClick={() => handleNav('saved')}
            />
            <NavItem 
              icon={<Briefcase size={18} />} 
              label="Itineraries" 
              active={activePage === 'trips' && !isUpdatesOpen && !isChatsOpen}
              onClick={() => handleNav('trips')}
            />
            <NavItem 
              icon={<Bell size={18} />} 
              label="Updates" 
              active={isUpdatesOpen}
              onClick={() => handleNav('updates')}
            />
            <NavItem 
              icon={<Compass size={18} />} 
              label="Inspiration" 
              active={activePage === 'inspiration' && !isUpdatesOpen && !isChatsOpen}
              onClick={() => handleNav('inspiration')}
            />
            <NavItem 
              icon={<PlusSquare size={18} />} 
              label="Create" 
              active={activePage === 'create' && !isUpdatesOpen && !isChatsOpen}
              onClick={() => handleNav('create')}
            />
          </nav>

          {/* New Chat CTA */}
          <div>
            <button 
              onClick={() => {
                onNewChat();
                if (isChatsOpen) onToggleChats();
                onNavigate('chat');
              }}
              className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 font-medium rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <Sparkles size={16} className="text-gold-500 group-hover:text-gold-400" />
              <span>New Request</span>
            </button>
          </div>

          {/* Promo Card - "Enterprise Status" */}
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-5 mt-auto">
             <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-gold-500" size={18} />
                <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">Enterprise</span>
             </div>
             <h3 className="font-bold text-white text-sm mb-1">Platinum Partner</h3>
             <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-3">
               Full access to API, white-label exports, and 24/7 priority support.
             </p>
             <button className="text-[10px] font-bold text-white bg-white/10 px-3 py-1.5 rounded hover:bg-white/20 transition-colors">
               Manage Plan
             </button>
          </div>
        </div>

        {/* Footer / Profile */}
        <div className="p-4 mt-auto border-t border-gray-800" ref={profileMenuRef}>
          {/* Profile Menu Popup */}
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in zoom-in-95 duration-200 origin-bottom-left">
              
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
                 <div className="w-10 h-10 rounded-lg bg-midnight text-white flex items-center justify-center">
                   <User size={20} strokeWidth={2} />
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-midnight leading-none">Traveler</h4>
                   <span className="text-xs text-gray-500 font-medium">View profile</span>
                 </div>
                 <ChevronRight size={16} className="text-gray-400" />
              </div>

              {/* Menu Items */}
              <div className="py-2">
                 <button className="w-full text-left px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Account settings
                 </button>
                 <button className="w-full text-left px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Team Members
                 </button>
                 <button className="w-full text-left px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Billing & Invoices
                 </button>
              </div>

              <div className="h-px bg-gray-100 mx-5 my-1"></div>

              {/* Log in */}
              <div className="py-2 pb-3">
                 <button className="w-full text-left px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-gray-50 transition-colors">
                    Log out
                 </button>
              </div>
            </div>
          )}

          <div 
            className={`flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group relative ${isProfileMenuOpen ? 'bg-white/5' : ''}`}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 group-hover:text-white border border-gray-600">
              <User size={18} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white">Traveler</h4>
            </div>
            <MoreHorizontal size={16} className="text-gray-500 group-hover:text-white" />
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
          className="fixed inset-0 bg-midnight/20 backdrop-blur-[1px] z-20 md:left-[280px]"
          onClick={() => {
              if (isUpdatesOpen) onToggleUpdates();
              if (isChatsOpen) onToggleChats();
          }}
        />
      )}
      
      {/* Main Application Area */}
      <main className="flex-1 h-full overflow-hidden relative bg-gray-50">
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
      w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group relative overflow-hidden
      ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
    `}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500 rounded-r-full"></div>}
    
    <div className="flex items-center gap-3 pl-2">
      <span className={`${active ? 'text-gold-500' : 'text-gray-500 group-hover:text-gray-300'}`}>
        {icon}
      </span>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </div>
    {badge && (
      <span className="min-w-[1.25rem] h-5 flex items-center justify-center bg-gold-500 text-midnight text-[10px] font-bold rounded-md px-1">
        {badge}
      </span>
    )}
  </button>
);
