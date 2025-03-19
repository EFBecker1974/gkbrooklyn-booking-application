
import { useState, useEffect } from "react";
import { FloorPlan } from "@/components/FloorPlan";
import { Button } from "@/components/ui/button";
import { getFutureBookings, Booking } from "@/data/bookings";
import { rooms } from "@/data/rooms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";

const Index = () => {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Set a periodic refresh for bookings
    const timer = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 60000); // Refresh every minute
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load user's bookings
    const allBookings = getFutureBookings();
    setMyBookings(allBookings);
  }, [refreshTrigger]);

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : "Unknown Room";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-2">Conference Room Booking</h1>
          <p className="text-gray-600 mb-6">Book your meeting space easily</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Floor Plan</h2>
            <p className="text-gray-600 mb-4">Click on a room to view details and make a booking</p>
            
            <div className="overflow-auto">
              <FloorPlan />
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Your Upcoming Bookings</h2>
            {myBookings.length > 0 ? (
              <ScrollArea className="h-[250px] rounded-md border">
                <div className="p-4 space-y-4">
                  {myBookings.map(booking => (
                    <div 
                      key={booking.id}
                      className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="font-medium">{getRoomName(booking.roomId)}</div>
                      <div className="text-sm text-gray-600">{booking.purpose}</div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:gap-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {format(booking.startTime, "MMMM d, yyyy")}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {format(booking.startTime, "h:mm a")} - {format(booking.endTime, "h:mm a")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>You have no upcoming bookings</p>
                <p className="text-sm mt-2">Click on a room in the floor plan to make a booking</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
