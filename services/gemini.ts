import { GoogleGenAI, Type, ChatSession } from "@google/genai";
import { TripItinerary, ActivityType, PlaceDetails, ChatMessage } from "../types";

// Initialize the API with safety check for browser environments
const getAiClient = () => {
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  if (!apiKey) {
    console.warn("API Key not found. Chat features will not function.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to extract JSON from markdown code blocks
const extractJsonBlock = (text: string): any[] | null => {
  const match = text.match(/```json\s*(\[[\s\S]*?\])\s*```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse JSON block", e);
      return null;
    }
  }
  return null;
};

// -- 1. Chat with Visual Generative UI --

export const createTravelChat = (): ChatSession => {
  const ai = getAiClient();
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      temperature: 0.7,
      systemInstruction: `You are "DMC Suite", an elite AI travel architect for luxury travel agents.
      
      CORE BEHAVIOR:
      1.  You are helpful, professional, and knowledgeable about the world.
      2.  When the user asks for recommendations (hotels, restaurants, spots), you MUST provide a "Visual List" by including a structured JSON block at the end of your response.
      3.  Use the 'googleMaps' tool to verify the existence, rating, and location of every place you suggest.
      
      FORMATTING INSTRUCTIONS:
      - Write your conversational response naturally first.
      - If you are recommending specific places, append a JSON block wrapped in \`\`\`json [ ... ] \`\`\` at the very end.
      - The JSON schema for the array is:
        [
          {
            "name": "Exact Name",
            "description": "20 word enticing summary",
            "priceLevel": "$$$",
            "rating": 4.5,
            "category": "Accommodation" | "Dining" | "Sightseeing" | "Leisure",
            "address": "Short address"
          }
        ]
      
      Example Response:
      "Here are three top-tier hotels in Paris that match your request for boutique luxury."
      \`\`\`json
      [{"name": "Hotel Costes", "description": "...", "category": "Accommodation"}]
      \`\`\`
      `,
      tools: [{ googleMaps: {} }],
    },
  });
};

export const parseModelResponse = (text: string): { cleanText: string; places: PlaceDetails[] } => {
  const places = extractJsonBlock(text) || [];
  // Remove the JSON block from the text to display nicely
  const cleanText = text.replace(/```json[\s\S]*?```/, '').trim();
  
  return {
    cleanText,
    places: places as PlaceDetails[]
  };
};

// -- 2. Structured Itinerary Generation --

export const generateItineraryJson = async (
  conversationHistory: string, 
  userRequest: string,
  existingCanvasItems: PlaceDetails[] = []
): Promise<TripItinerary> => {
  const ai = getAiClient();
  
  // Convert canvas items to a string context so the AI knows what the user has already "Selected"
  const selectedContext = existingCanvasItems.length > 0 
    ? `The user has explicitly selected these places of interest: ${existingCanvasItems.map(p => p.name).join(', ')}. Ensure these are included in the schedule.` 
    : '';

  const itinerarySchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A catchy title for the trip" },
      destination: { type: Type.STRING },
      durationDays: { type: Type.INTEGER },
      travelers: { type: Type.STRING },
      totalEstimatedCost: { type: Type.NUMBER },
      days: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            dayNumber: { type: Type.INTEGER },
            title: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  time: { type: Type.STRING },
                  type: { type: Type.STRING, enum: Object.values(ActivityType) },
                  title: { type: Type.STRING },
                  notes: { type: Type.STRING },
                  estimatedCost: { type: Type.NUMBER },
                  details: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      rating: { type: Type.NUMBER },
                      priceLevel: { type: Type.STRING },
                    },
                    required: ["name"]
                  }
                },
                required: ["id", "time", "type", "title"]
              }
            }
          },
          required: ["dayNumber", "title", "activities"]
        }
      }
    },
    required: ["title", "destination", "days", "durationDays"]
  };

  const prompt = `
    Create a detailed trip itinerary.
    Conversation History: ${conversationHistory}
    Context: ${selectedContext}
    Request: ${userRequest}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: itinerarySchema,
    }
  });

  const text = response.text;
  if (!text) throw new Error("No itinerary generated");
  
  return JSON.parse(text) as TripItinerary;
};