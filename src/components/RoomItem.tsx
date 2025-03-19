
import { useState } from "react";
import { Room } from "@/data/rooms";
import { isRoomBooked } from "@/data/bookings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { CalendarIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomItemProps {
  room: Room;
  onBookingUpdate: () => void;
}

export const RoomItem = ({ room, onBookingUpdate }: RoomItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isBooked = isRoomBooked(room.id);
  
  return (
    <>
      <div 
        className={`absolute cursor-pointer rounded-md p-2 flex flex-col shadow-md hover:shadow-lg transition-shadow ${isBooked ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'}`}
        style={{
          left: `${room.position.x}px`,
          top: `${room.position.y}px`,
          width: `${room.position.width}px`,
          height: `${room.position.height}px`,
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="font-bold text-sm">{room.name}</div>
        <div className="text-xs mt-1 overflow-hidden text-ellipsis">{room.description}</div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center text-xs">
            <Users className="h-3 w-3 mr-1" />
            {room.capacity}
          </div>
          <Badge variant={isBooked ? "destructive" : "default"} className="text-[10px] h-4">
            {isBooked ? 'Booked' : 'Available'}
          </Badge>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{room.name}</DialogTitle>
            <DialogDescription>
              {room.description} • Capacity: {room.capacity} people
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 my-2">
              {room.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <h4 className="text-sm font-semibold flex items-center mb-2">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Book this room
              </h4>
              <BookingForm 
                roomId={room.id} 
                onSuccess={() => {
                  setIsDialogOpen(false);
                  onBookingUpdate();
                }} 
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
