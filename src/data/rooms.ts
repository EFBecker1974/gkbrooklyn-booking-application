
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
    name: "Konsistorie",
    capacity: 10,
    amenities: ["Projector", "Whiteboard", "Sound system"],
    description: "Meeting room for leadership gatherings",
    area: "Kerkgebou",
    position: { x: 220, y: 250, width: 180, height: 120 }
  },
  {
    id: "room-5",
    name: "Langs liturgie area",
    capacity: 20,
    amenities: ["Sound system", "Video conferencing", "Piano"],
    description: "Multi-purpose space adjacent to worship area",
    area: "Kerkgebou",
    position: { x: 420, y: 250, width: 200, height: 120 }
  },
  {
    id: "room-6",
    name: "Gesinskamer",
    capacity: 15,
    amenities: ["TV Screen", "Comfortable seating", "Children's play area"],
    description: "Family-friendly room for community gatherings",
    area: "Kerkgebou",
    position: { x: 220, y: 390, width: 180, height: 130 }
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
