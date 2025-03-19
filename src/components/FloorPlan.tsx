
import { useState, useEffect } from "react";
import { rooms, getRoomsByArea } from "@/data/rooms";
import { isRoomBooked } from "@/data/bookings";
import { RoomItem } from "./RoomItem";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";

interface FloorPlanProps {
  refreshTrigger?: number;
  onBookingSuccess?: () => void;
}

export const FloorPlan = ({ refreshTrigger = 0, onBookingSuccess }: FloorPlanProps) => {
  const [refreshState, setRefreshState] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const roomsByArea = getRoomsByArea();
  
  useEffect(() => {
    setRefreshState(prev => prev + 1);
  }, [refreshTrigger]);
  
  const handleBookingUpdate = () => {
    setRefreshState(prev => prev + 1);
  };

  const handleBookingSuccess = () => {
    setSelectedRoom(null);
    if (onBookingSuccess) {
      onBookingSuccess();
    }
  };

  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : "Room";
  };

  return (
    <div className="relative">
      {selectedRoom && (
        <Dialog open={!!selectedRoom} onOpenChange={(open) => !open && setSelectedRoom(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Book {getRoomName(selectedRoom)}</DialogTitle>
            <DialogDescription>
              Reserve {getRoomName(selectedRoom)} for your upcoming event.
            </DialogDescription>
            <BookingForm roomId={selectedRoom} onSuccess={handleBookingSuccess} />
          </DialogContent>
        </Dialog>
      )}
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
    </div>
  );
};
