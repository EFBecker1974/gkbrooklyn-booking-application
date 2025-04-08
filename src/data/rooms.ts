
import { supabase } from "@/integrations/supabase/client";

export interface Room {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  description: string;
  area: "Pastorie" | "Kerksaal" | "Kerkgebou";
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Fetch all rooms from Supabase
export const fetchRooms = async (): Promise<Room[]> => {
  // Use the "rooms" table with the correct type assertion
  const { data, error } = await supabase
    .from('rooms')
    .select('*');
  
  if (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
  
  if (!data) return [];
  
  return data.map(room => ({
    id: room.id,
    name: room.name,
    capacity: room.capacity,
    // The description field doesn't exist in the database schema, so we use an empty string as default
    description: '',
    // Map to the expected area format; if area doesn't exist, default to "Pastorie"
    area: (room.features && room.features[0]) as "Pastorie" | "Kerksaal" | "Kerkgebou" || "Pastorie",
    // Use features array as amenities or empty array if not present
    amenities: Array.isArray(room.features) ? room.features.slice(1) : [],
    // Default position for UI rendering
    position: { x: 0, y: 0, width: 150, height: 120 }
  }));
};

// This is kept for backward compatibility until all components are updated
export const rooms: Room[] = [];

// Helper function to get rooms grouped by area - now async
export const getRoomsByArea = async () => {
  const roomList = await fetchRooms();
  const groupedRooms: Record<string, Room[]> = {};
  
  roomList.forEach(room => {
    if (!groupedRooms[room.area]) {
      groupedRooms[room.area] = [];
    }
    groupedRooms[room.area].push(room);
  });
  
  return groupedRooms;
};

// Synchronous version for components that haven't been updated yet
export const getRoomsByAreaSync = () => {
  const groupedRooms: Record<string, Room[]> = {};
  
  rooms.forEach(room => {
    if (!groupedRooms[room.area]) {
      groupedRooms[room.area] = [];
    }
    groupedRooms[room.area].push(room);
  });
  
  return groupedRooms;
};
