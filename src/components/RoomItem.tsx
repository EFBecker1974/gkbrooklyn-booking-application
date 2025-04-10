
import { useState } from "react";
import { Room } from "@/data/rooms";
import { isRoomBooked, getRoomBookingInfo } from "@/data/bookings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { CalendarIcon, Users, Clock, MapPin, CheckCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface RoomItemProps {
  room: Room;
  onBookingUpdate: () => void;
  onSelect?: () => void;
}

export const RoomItem = ({ room, onBookingUpdate, onSelect }: RoomItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: isBooked = false, isLoading: isBookedLoading } = useQuery({
    queryKey: ['roomBooked', room.id],
    queryFn: () => isRoomBooked(room.id),
    refetchInterval: 60000, // Refetch every minute
  });

  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  const { data: bookingInfo = null, isLoading: bookingInfoLoading } = useQuery({
    queryKey: ['roomBookingInfo', room.id, isBooked],
    queryFn: () => isBooked ? getRoomBookingInfo(room.id, now, tomorrow) : Promise.resolve(null),
    enabled: isBooked,
  });
  
  const handleRoomClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      setIsDialogOpen(true);
    }
  };
  
  // Display room description if available
  const hasDescription = room.description && room.description.trim() !== '';

  // Get the current booking information if the room is booked
  const currentBooking = bookingInfo && bookingInfo.length > 0 ? bookingInfo[0] : null;
  
  return (
    <>
      <div 
        className={`cursor-pointer rounded-md p-4 flex flex-col shadow-md hover:shadow-lg transition-all h-full ${isBooked ? 'room-booked' : 'room-available'}`}
        onClick={handleRoomClick}
      >
        <div className="font-semibold text-sm mb-1">{room.name}</div>
        
        {hasDescription && (
          <div className="text-xs text-gray-700 mb-2 line-clamp-2">{room.description}</div>
        )}
        
        <div className="flex items-center text-xs gap-1 mt-1">
          <Users className="h-3 w-3 text-primary" />
          <span>Capacity: {room.capacity}</span>
        </div>
        
        <div className="mt-auto pt-3">
          {isBooked && currentBooking ? (
            <div className="space-y-1 mt-1 bg-white p-2 rounded text-xs">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3 text-primary" />
                <span>{format(new Date(currentBooking.start_time), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-primary" />
                <span>
                  {format(new Date(currentBooking.start_time), "h:mm a")} - {format(new Date(currentBooking.end_time), "h:mm a")}
                </span>
              </div>
              <div className="text-xs mt-1">
                <span className="font-medium">Booked by: </span>{currentBooking.user_id}
              </div>
            </div>
          ) : (
            <div className="text-xs text-green-700 font-medium mt-1 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> 
              Available now
            </div>
          )}
          
          <Badge variant={isBooked ? "destructive" : "outline"} className="text-[10px] h-4 mt-2 border-primary">
            {isBooked ? 'Booked' : 'Available'}
          </Badge>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              {room.name}
            </DialogTitle>
            <DialogDescription>
              {hasDescription ? (
                <div className="flex items-start gap-2 mt-1">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{room.description}</span>
                </div>
              ) : (
                <span>Capacity: {room.capacity} people</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 my-2">
              {room.amenities && room.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs border-primary/30 text-primary">
                  {amenity}
                </Badge>
              ))}
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="text-sm font-semibold flex items-center mb-3 text-primary">
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
