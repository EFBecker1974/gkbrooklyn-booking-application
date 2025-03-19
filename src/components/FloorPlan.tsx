
import { useState, useEffect } from "react";
import { rooms } from "@/data/rooms";
import { RoomItem } from "./RoomItem";

export const FloorPlan = () => {
  const [refreshFlag, setRefreshFlag] = useState(0);
  
  // Setup a timer to periodically check for expired bookings and refresh the UI
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshFlag(prev => prev + 1);
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleBookingUpdate = () => {
    setRefreshFlag(prev => prev + 1);
  };
  
  // Find dimensions for the floor plan container
  const maxX = Math.max(...rooms.map(room => room.position.x + room.position.width));
  const maxY = Math.max(...rooms.map(room => room.position.y + room.position.height));
  
  return (
    <div 
      className="relative bg-gray-100 border rounded-lg shadow-inner my-4"
      style={{ 
        width: `${maxX + 50}px`, 
        height: `${maxY + 50}px`,
        maxWidth: '100%',
        overflow: 'auto'
      }}
    >
      {/* Grid lines for visual reference */}
      <div className="absolute inset-0" style={{ 
        backgroundSize: '40px 40px',
        backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
        opacity: 0.7
      }}></div>
      
      {/* Render each room */}
      {rooms.map(room => (
        <RoomItem 
          key={room.id} 
          room={room} 
          onBookingUpdate={handleBookingUpdate}
        />
      ))}
    </div>
  );
};
