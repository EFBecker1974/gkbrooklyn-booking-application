
import { useState, useEffect } from "react";
import { getRoomsByArea } from "@/data/rooms";
import { RoomItem } from "./RoomItem";
import { ExcelUploader } from "./ExcelUploader";

export const FloorPlan = () => {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const roomsByArea = getRoomsByArea();
  
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
  
  return (
    <div className="space-y-8">
      <ExcelUploader />
      
      {Object.entries(roomsByArea).map(([area, rooms]) => (
        <div key={`${area}-${refreshFlag}`} className="mb-8 border rounded-lg overflow-hidden shadow-sm">
          <h3 className="text-lg font-semibold p-4 bg-primary text-white">
            {area}
          </h3>
          <div className="p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(room => (
                <RoomItem 
                  key={`${room.id}-${refreshFlag}`} 
                  room={room} 
                  onBookingUpdate={handleBookingUpdate}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
