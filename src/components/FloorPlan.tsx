
import { useState, useEffect } from "react";
import { rooms, getRoomsByArea } from "@/data/rooms";
import { isRoomBooked } from "@/data/bookings";
import { RoomItem } from "./RoomItem";

interface FloorPlanProps {
  refreshTrigger?: number;
}

export const FloorPlan = ({ refreshTrigger = 0 }: FloorPlanProps) => {
  const [refreshState, setRefreshState] = useState(0);
  const roomsByArea = getRoomsByArea();
  
  // Update refresh state when refresh trigger changes
  useEffect(() => {
    setRefreshState(prev => prev + 1);
  }, [refreshTrigger]);
  
  const handleBookingUpdate = () => {
    setRefreshState(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {Object.entries(roomsByArea).map(([area, areaRooms]) => (
        <div key={area} className="space-y-3">
          <h3 className="text-xl font-semibold border-b pb-2">{area}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {areaRooms.map(room => (
              <RoomItem 
                key={room.id} 
                room={room} 
                onBookingUpdate={handleBookingUpdate} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
