
export interface Room {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  description: string;
  area: "Pastorie" | "Kerksaal" | "Kerkgebou"; // Added area property
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const rooms: Room[] = [
  {
    id: "room-1",
    name: "Executive Suite",
    capacity: 12,
    amenities: ["Projector", "Whiteboard", "Video conferencing"],
    description: "Large conference room with executive furnishings",
    area: "Pastorie",
    position: { x: 50, y: 50, width: 200, height: 150 }
  },
  {
    id: "room-2",
    name: "Team Space",
    capacity: 8,
    amenities: ["Whiteboard", "Video conferencing"],
    description: "Medium-sized room ideal for team meetings",
    area: "Pastorie",
    position: { x: 300, y: 50, width: 150, height: 150 }
  },
  {
    id: "room-3",
    name: "Huddle Room",
    capacity: 4,
    amenities: ["TV Screen"],
    description: "Small room for quick meetings and discussions",
    area: "Kerksaal",
    position: { x: 50, y: 250, width: 120, height: 120 }
  },
  {
    id: "room-4",
    name: "Innovation Lab",
    capacity: 16,
    amenities: ["Projector", "Whiteboard", "Video conferencing", "Sound system"],
    description: "Large space for workshops and creative sessions",
    area: "Kerkgebou",
    position: { x: 220, y: 250, width: 230, height: 120 }
  },
];

// Helper function to get rooms grouped by area
export const getRoomsByArea = () => {
  const groupedRooms: Record<string, Room[]> = {};
  
  rooms.forEach(room => {
    if (!groupedRooms[room.area]) {
      groupedRooms[room.area] = [];
    }
    groupedRooms[room.area].push(room);
  });
  
  return groupedRooms;
};
