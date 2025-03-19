
import { useState, useEffect } from "react";
import { FloorPlan } from "@/components/FloorPlan";
import { getFutureBookings, Booking } from "@/data/bookings";
import { rooms } from "@/data/rooms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon, CheckCircle, Users, MapPin, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="min-h-screen bg-secondary/50">
      {/* Church-like header */}
      <div className="church-header">
        <div className="container mx-auto flex flex-col items-center md:items-start">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">GK Brooklyn</h1>
          <p className="text-white/90 text-lg">Facility Booking System</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="floorplan" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="floorplan" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Floor Plan
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Your Bookings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="floorplan" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Facility Floor Plan
                </CardTitle>
                <CardDescription>
                  Click on a room to make a booking or hover to see details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-md border shadow-sm overflow-auto">
                  <FloorPlan />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Your Upcoming Bookings
                </CardTitle>
                <CardDescription>
                  Manage your facility reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myBookings.length > 0 ? (
                  <ScrollArea className="h-[350px] rounded-md border">
                    <div className="p-4 space-y-3">
                      {myBookings.map(booking => (
                        <div 
                          key={booking.id}
                          className="p-4 border rounded-md bg-white hover:bg-gray-50 transition flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                        >
                          <div className="rounded-full bg-primary/10 p-3 text-primary">
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-lg">{getRoomName(booking.roomId)}</div>
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
                          <div className="shrink-0">
                            <div className="flex items-center text-green-600 text-sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirmed
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 border rounded-md bg-white">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No Bookings Yet</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
                      You don't have any upcoming bookings. Click on a room in the floor plan to make your first reservation.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="bg-primary text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80 text-sm">
            &copy; {new Date().getFullYear()} GK Brooklyn Facility Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
