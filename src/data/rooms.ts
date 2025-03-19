
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
    capacity: 20, // Updated capacity from 4 to 20
    amenities: ["Storage space", "Workshop area"],
    description: "Hierdie lokaal het 'n groot konferensie tafel waar 8 mense gemaklik om die tafel kan sit. Hierdie lokaal kan 11 tot 20 mense akkommodeer",
    area: "Pastorie",
    position: { x: 50, y: 50, width: 150, height: 120 }
  },
  {
    id: "room-2",
    name: "Pooltafel",
    capacity: 8,
    amenities: ["Pool table", "Seating area", "Refreshment corner"],
    description: "Hierdie area het 'n pool-tafel in en is oopplan met die kombuis. 10 Mense kan gemaklik saam kuier. Slegs 7 stoele.  Hierdie lokaal kan 7-10 mense akkommodeer",
    area: "Pastorie",
    position: { x: 210, y: 50, width: 150, height: 120 }
  },
  {
    id: "room-3",
    name: "Taffeltennis",
    capacity: 6,
    amenities: ["Table tennis table", "Scoreboard", "Storage cabinet"],
    description: "Hierdie area het 'n tafeltennis-blad wat kan opslaan. Daar is sitplek vir 6. Hierdie lokaal kan 7-10 mense akkommodeer",
    area: "Pastorie",
    position: { x: 370, y: 50, width: 150, height: 120 }
  },
  {
    id: "room-4",
    name: "Kombuis",
    capacity: 10,
    amenities: ["Full kitchen", "Island counter", "Dining area"],
    description: "Die kombuisarea het 'n tafel in maar nie stoele nie. Hierdie lokaal kan 7-10 mense akkommodeer",
    area: "Pastorie",
    position: { x: 530, y: 50, width: 150, height: 120 }
  },
  {
    id: "room-5",
    name: "Bybelstudielokaal",
    capacity: 15,
    amenities: ["Whiteboard", "Bookshelves", "Study tables"],
    description: "Room designed for Bible study sessions and discussions",
    area: "Pastorie",
    position: { x: 50, y: 180, width: 150, height: 120 }
  },
  {
    id: "room-6",
    name: "Studeerlokaal",
    capacity: 8,
    amenities: ["Desk space", "Reference materials", "Quiet environment"],
    description: "Study room with resources for individual or small group learning",
    area: "Pastorie",
    position: { x: 210, y: 180, width: 150, height: 120 }
  },
  {
    id: "room-7",
    name: "Tafeltennisarea",
    capacity: 10,
    amenities: ["Multiple table tennis tables", "Seating area", "Water cooler"],
    description: "Larger area for table tennis tournaments and group activities",
    area: "Pastorie",
    position: { x: 370, y: 180, width: 150, height: 120 }
  },
  {
    id: "room-8",
    name: "Kafee",
    capacity: 20,
    amenities: ["Coffee machine", "Seating area", "Snack counter"],
    description: "Casual space for refreshments and informal gatherings",
    area: "Kerksaal",
    position: { x: 50, y: 340, width: 150, height: 120 }
  },
  {
    id: "room-9",
    name: "Bybelstudielokaal",
    capacity: 12,
    amenities: ["Bookshelves", "Whiteboard", "Study tables"],
    description: "Dedicated room for Bible study and discussion groups",
    area: "Kerksaal",
    position: { x: 210, y: 340, width: 150, height: 120 }
  },
  {
    id: "room-10",
    name: "Kerksaal",
    capacity: 50,
    amenities: ["Sound system", "Projector", "Stage area", "Flexible seating"],
    description: "Large multipurpose hall for church gatherings and events",
    area: "Kerksaal",
    position: { x: 370, y: 340, width: 150, height: 120 }
  },
  {
    id: "room-11",
    name: "Kombuis",
    capacity: 8,
    amenities: ["Full kitchen", "Refrigerator", "Serving area"],
    description: "Die kombuisarea het 'n tafel in maar nie stoele nie. Hierdie lokaal kan 7-10 mense akkommodeer",
    area: "Kerksaal",
    position: { x: 530, y: 340, width: 150, height: 120 }
  },
  {
    id: "room-12",
    name: "Kerkkantoor",
    capacity: 4,
    amenities: ["Desks", "Filing cabinets", "Printer"],
    description: "Administrative office for church staff",
    area: "Kerksaal",
    position: { x: 690, y: 340, width: 150, height: 120 }
  },
  {
    id: "room-13",
    name: "Konsistorie",
    capacity: 10,
    amenities: ["Projector", "Whiteboard", "Sound system"],
    description: "Meeting room for leadership gatherings",
    area: "Kerkgebou",
    position: { x: 210, y: 480, width: 150, height: 120 }
  },
  {
    id: "room-14",
    name: "Langs liturgie area",
    capacity: 20,
    amenities: ["Sound system", "Video conferencing", "Piano"],
    description: "Multi-purpose space adjacent to worship area",
    area: "Kerkgebou",
    position: { x: 370, y: 480, width: 150, height: 120 }
  },
  {
    id: "room-15",
    name: "Gesinskamer",
    capacity: 15,
    amenities: ["TV Screen", "Comfortable seating", "Children's play area"],
    description: "Family-friendly room for community gatherings",
    area: "Kerkgebou",
    position: { x: 530, y: 480, width: 150, height: 120 }
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
