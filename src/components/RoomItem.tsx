
import { useState } from "react";
import { Room } from "@/data/rooms";
import { isRoomBooked, getRoomBookingInfo } from "@/data/bookings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { CalendarIcon, Users, Clock, Info, MapPin, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Card } from "@/components/ui/card";

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
      <HoverCard>
        <HoverCardTrigger asChild>
          <div 
            className={`absolute cursor-pointer rounded-md p-3 flex flex-col shadow-md hover:shadow-lg transition-all ${isBooked ? 'room-booked' : 'room-available'}`}
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
            <div className="font-semibold text-sm mb-1">{room.name}</div>
            <div className="text-xs text-gray-700 mb-2 line-clamp-2">{room.description}</div>
            
            <div className="mt-auto space-y-1">
              <div className="flex items-center text-xs gap-1">
                <Users className="h-3 w-3 text-primary" />
                <span>{room.capacity}</span>
              </div>
              
              {isBooked && bookingInfo ? (
                <div className="space-y-1 mt-1 bg-white p-1 rounded text-xs">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3 text-primary" />
                    <span>{format(bookingInfo.startTime, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>
                      {format(bookingInfo.startTime, "h:mm a")} - {format(bookingInfo.endTime, "h:mm a")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-green-700 font-medium mt-1 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" /> 
                  Available now
                </div>
              )}
              
              <Badge variant={isBooked ? "destructive" : "outline"} className="text-[10px] h-4 mt-1 border-primary">
                {isBooked ? 'Booked' : 'Available'}
              </Badge>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-0 bg-white shadow-lg rounded-md overflow-hidden border border-gray-200">
          <div className={`${isBooked ? 'bg-red-500' : 'bg-primary'} text-white p-3`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white">{room.name}</h3>
              <Badge variant={isBooked ? "destructive" : "outline"} className="bg-white text-xs">
                {isBooked ? 'Booked' : 'Available'}
              </Badge>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <p className="text-sm">{room.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm">Capacity: {room.capacity} people</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {room.amenities.map((amenity, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-primary/30 text-primary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
            
            {isBooked && bookingInfo ? (
              <Card className="mt-2 bg-gray-50">
                <div className="p-3">
                  <h4 className="font-semibold text-sm mb-1 text-primary flex items-center gap-1">
                    <Info className="h-3 w-3" /> Booking Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span>{format(bookingInfo.startTime, "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>
                        {format(bookingInfo.startTime, "h:mm a")} - {format(bookingInfo.endTime, "h:mm a")}
                      </span>
                    </div>
                    <div className="mt-1">
                      <div className="font-medium text-xs text-gray-500">Booked by:</div>
                      <div className="text-sm">{bookingInfo.bookedBy}</div>
                    </div>
                    <div>
                      <div className="font-medium text-xs text-gray-500">Purpose:</div>
                      <div className="text-sm">{bookingInfo.purpose}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="border-t pt-3 mt-2">
                <p className="text-green-600 font-medium flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  This room is currently available for booking
                </p>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              {room.name}
            </DialogTitle>
            <DialogDescription>
              {room.description} • Capacity: {room.capacity} people
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 my-2">
              {room.amenities.map((amenity, index) => (
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
