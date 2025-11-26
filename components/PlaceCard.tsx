import React from 'react';
import { PlaceDetails } from '../types';
import { MapPin, Star, Plus, Check } from 'lucide-react';

interface PlaceCardProps {
  details: PlaceDetails;
  compact?: boolean;
  onAdd?: (place: PlaceDetails) => void;
  isAdded?: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ details, compact = false, onAdd, isAdded = false }) => {
  const getReliableImage = (category?: string, name?: string) => {
    if (details.imageUrl && !details.imageUrl.includes('pollinations')) return details.imageUrl;
    const cat = (category || '').toLowerCase();
    const nam = (name || '').toLowerCase();

    if (cat.includes('hotel') || nam.includes('hotel')) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('dining')) return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('museum') || cat.includes('art')) return 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('park') || cat.includes('nature')) return 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('shop')) return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80';
    
    return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80';
  };

  const bgImage = getReliableImage(details.category, details.name);

  return (
    <div className={`group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300 ${compact ? 'flex h-20' : 'flex flex-col h-full'}`}>
      <div 
        className={`${compact ? 'w-20 h-full' : 'h-40'} bg-gray-100 bg-cover bg-center shrink-0 relative`}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {!compact && (
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 to-transparent opacity-60"></div>
        )}
        
        {/* Category Badge */}
        {!compact && details.category && (
            <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-midnight text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide shadow-sm">
                {details.category}
            </span>
        )}
      </div>

      <div className={`flex flex-col ${compact ? 'p-3 justify-center w-full' : 'p-5 flex-1'}`}>
        <div className="flex justify-between items-start gap-2">
          <h4 className={`font-bold text-midnight leading-tight font-serif ${compact ? 'text-sm' : 'text-lg'}`}>{details.name}</h4>
          {details.priceLevel && (
             <span className="text-[10px] font-bold text-gray-500 shrink-0 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{details.priceLevel}</span>
          )}
        </div>

        {details.rating && (
          <div className="flex items-center mt-1.5 text-xs text-slate-500">
            <Star size={12} fill="currentColor" className="text-gold-500 mr-1" />
            <span className="font-bold text-midnight">{details.rating}</span>
            {details.user_ratings_total && (
                 <span className="ml-1 text-gray-400">({details.user_ratings_total})</span>
            )}
          </div>
        )}
        
        {!compact && (
          <>
            <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed font-normal">{details.description}</p>
            
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-100">
               {details.address && (
                <div className="flex items-center text-[11px] text-gray-400 max-w-[60%] font-medium">
                    <MapPin size={12} className="mr-1.5 shrink-0" />
                    <span className="truncate">{details.address}</span>
                </div>
               )}
               
               {onAdd && (
                 <button 
                    onClick={() => !isAdded && onAdd(details)}
                    disabled={isAdded}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                        isAdded 
                        ? 'bg-gray-100 text-gray-400 cursor-default border border-gray-200'
                        : 'bg-midnight text-white hover:bg-slate-800 hover:shadow-md border border-midnight'
                    }`}
                 >
                    {isAdded ? <Check size={12} /> : <Plus size={12} />}
                    {isAdded ? 'Added' : 'Add'}
                 </button>
               )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};