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
    name: "Motorhuis",
    capacity: 4,
    amenities: ["Storage space", "Workshop area"],
    description: "Garage area with space for activities and storage",
    area: "Pastorie",
    position: { x: 50, y: 50, width: 100, height: 100 }
  },
  {
    id: "room-2",
    name: "Pooltafel",
    capacity: 8,
    amenities: ["Pool table", "Seating area", "Refreshment corner"],
    description: "Recreation room with pool table for leisure activities",
    area: "Pastorie",
    position: { x: 160, y: 50, width: 120, height: 100 }
  },
  {
    id: "room-3",
    name: "Taffeltennis",
    capacity: 6,
    amenities: ["Table tennis table", "Scoreboard", "Storage cabinet"],
    description: "Space dedicated for table tennis activities",
    area: "Pastorie",
    position: { x: 290, y: 50, width: 120, height: 100 }
  },
  {
    id: "room-4",
    name: "Kombuis",
    capacity: 10,
    amenities: ["Full kitchen", "Island counter", "Dining area"],
    description: "Fully equipped kitchen area for meal preparation",
    area: "Pastorie",
    position: { x: 420, y: 50, width: 130, height: 100 }
  },
  {
    id: "room-5",
    name: "Bybelstudielokaal",
    capacity: 15,
    amenities: ["Whiteboard", "Bookshelves", "Study tables"],
    description: "Room designed for Bible study sessions and discussions",
    area: "Pastorie",
    position: { x: 50, y: 160, width: 150, height: 120 }
  },
  {
    id: "room-6",
    name: "Studeerlokaal",
    capacity: 8,
    amenities: ["Desk space", "Reference materials", "Quiet environment"],
    description: "Study room with resources for individual or small group learning",
    area: "Pastorie",
    position: { x: 210, y: 160, width: 150, height: 120 }
  },
  {
    id: "room-7",
    name: "Tafeltennisarea",
    capacity: 10,
    amenities: ["Multiple table tennis tables", "Seating area", "Water cooler"],
    description: "Larger area for table tennis tournaments and group activities",
    area: "Pastorie",
    position: { x: 370, y: 160, width: 180, height: 120 }
  },
  {
    id: "room-8",
    name: "Kafee",
    capacity: 20,
    amenities: ["Coffee machine", "Seating area", "Snack counter"],
    description: "Casual space for refreshments and informal gatherings",
    area: "Kerksaal",
    position: { x: 50, y: 250, width: 120, height: 100 }
  },
  {
    id: "room-9",
    name: "Bybelstudielokaal",
    capacity: 12,
    amenities: ["Bookshelves", "Whiteboard", "Study tables"],
    description: "Dedicated room for Bible study and discussion groups",
    area: "Kerksaal",
    position: { x: 180, y: 250, width: 120, height: 100 }
  },
  {
    id: "room-10",
    name: "Kerksaal",
    capacity: 50,
    amenities: ["Sound system", "Projector", "Stage area", "Flexible seating"],
    description: "Large multipurpose hall for church gatherings and events",
    area: "Kerksaal",
    position: { x: 310, y: 250, width: 140, height: 120 }
  },
  {
    id: "room-11",
    name: "Kombuis",
    capacity: 8,
    amenities: ["Full kitchen", "Refrigerator", "Serving area"],
    description: "Kitchen facility for meal preparation and catering",
    area: "Kerksaal",
    position: { x: 460, y: 250, width: 100, height: 100 }
  },
  {
    id: "room-12",
    name: "Kerkkantoor",
    capacity: 4,
    amenities: ["Desks", "Filing cabinets", "Printer"],
    description: "Administrative office for church staff",
    area: "Kerksaal",
    position: { x: 570, y: 250, width: 100, height: 100 }
  },
  {
    id: "room-13",
    name: "Konsistorie",
    capacity: 10,
    amenities: ["Projector", "Whiteboard", "Sound system"],
    description: "Meeting room for leadership gatherings",
    area: "Kerkgebou",
    position: { x: 220, y: 390, width: 180, height: 120 }
  },
  {
    id: "room-14",
    name: "Langs liturgie area",
    capacity: 20,
    amenities: ["Sound system", "Video conferencing", "Piano"],
    description: "Multi-purpose space adjacent to worship area",
    area: "Kerkgebou",
    position: { x: 420, y: 390, width: 200, height: 120 }
  },
  {
    id: "room-15",
    name: "Gesinskamer",
    capacity: 15,
    amenities: ["TV Screen", "Comfortable seating", "Children's play area"],
    description: "Family-friendly room for community gatherings",
    area: "Kerkgebou",
    position: { x: 320, y: 530, width: 180, height: 130 }
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
