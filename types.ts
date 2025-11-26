// Data structures for the Itinerary
export enum ActivityType {
  SIGHTSEEING = 'Sightseeing',
  DINING = 'Dining',
  TRANSPORT = 'Transport',
  ACCOMMODATION = 'Accommodation',
  LEISURE = 'Leisure',
  SHOPPING = 'Shopping',
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceDetails {
  id?: string;
  name: string;
  address?: string;
  rating?: number;
  user_ratings_total?: number;
  priceLevel?: string; // e.g., "$$$"
  description?: string;
  coordinates?: Coordinates;
  imageUrl?: string;
  websiteUri?: string;
  category?: ActivityType;
}

export interface Activity {
  id: string;
  time: string; // e.g., "10:00 AM" or "Morning"
  type: ActivityType;
  title: string;
  details?: PlaceDetails;
  notes?: string;
  estimatedCost?: number;
}

export interface DayPlan {
  dayNumber: number;
  date?: string;
  title: string; // e.g., "Arrival in Tokyo"
  activities: Activity[];
}

export interface TripItinerary {
  title: string;
  destination: string;
  startDate?: string;
  durationDays: number;
  travelers: string; // e.g., "2 Adults, Honeymoon"
  days: DayPlan[];
  totalEstimatedCost?: number;
  // Canvas items are things added from chat but not yet scheduled
  canvasItems?: PlaceDetails[];
}

// Chat Interfaces
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string; // Raw text logic
  richContent?: {
    text: string;
    places?: PlaceDetails[]; // Structured places found in this turn
  };
  timestamp: Date;
  isThinking?: boolean;
  groundingSources?: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AppState {
  currentView: 'chat' | 'itinerary' | 'split';
  itinerary: TripItinerary;
  messages: ChatMessage[];
  isGenerating: boolean;
}

// Navigation
export type Page = 'chat' | 'explore' | 'saved' | 'trips' | 'updates' | 'create' | 'inspiration';

export interface ExploreItem {
  id: string;
  title: string;
  subtitle: string;
  category: string; // e.g., "Restaurant", "City", "Experience"
  images: string[]; // Array for the gallery
  tags: string[];
  rating?: number;
  reviewCount?: number;
  priceLevel?: string;
  address?: string;
  description_long: string;
  prompt: string; // What to ask AI when clicked
}

export interface InspirationGuide {
  id: string;
  title: string;
  location: string;
  author: {
    name: string;
    avatar: string;
  };
  coverImage: string;
  placeCount: number;
  days: number;
  description: string;
  places: PlaceDetails[];
}