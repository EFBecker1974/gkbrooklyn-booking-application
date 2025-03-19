
import { useState } from "react";
import { Room } from "@/data/rooms";
import { isRoomBooked, getRoomBookingInfo } from "@/data/bookings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { CalendarIcon, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface RoomItemProps {
  room: Room;
  onBookingUpdate: () => void;
}

export const RoomItem = ({ room, onBookingUpdate }: RoomItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isBooked = isRoomBooked(room.id);
  const bookingInfo = getRoomBookingInfo(room.id);
  
  // Calculate dynamic height based on content
  const minHeight = room.position.height;
  
  return (
    <>
      <div 
        className={`absolute cursor-pointer rounded-md p-3 flex flex-col shadow-md hover:shadow-lg transition-shadow ${isBooked ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'}`}
        style={{
          left: `${room.position.x}px`,
          top: `${room.position.y}px`,
          width: `${room.position.width}px`,
          minHeight: `${minHeight}px`,
          height: "auto",
          overflowY: "auto"
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="font-bold text-sm mb-1">{room.name}</div>
        <div className="text-xs text-gray-700 mb-2">{room.description}</div>
        
        <div className="mt-auto space-y-1">
          <div className="flex items-center text-xs gap-1">
            <Users className="h-3 w-3" />
            <span>{room.capacity}</span>
          </div>
          
          {isBooked && bookingInfo ? (
            <div className="space-y-1 mt-1 bg-white/50 p-1 rounded text-xs">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>{format(bookingInfo.startTime, "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {format(bookingInfo.startTime, "h:mm a")} - {format(bookingInfo.endTime, "h:mm a")}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-green-700 font-medium mt-1">Available now</div>
          )}
          
          <Badge variant={isBooked ? "destructive" : "default"} className="text-[10px] h-4 mt-1">
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
