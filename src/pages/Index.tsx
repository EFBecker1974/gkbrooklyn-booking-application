import { useState, useEffect } from "react";
import { FloorPlan } from "@/components/FloorPlan";
import { getFutureBookings, Booking, getUserBookings, cancelBooking } from "@/data/bookings";
import { fetchRooms } from "@/data/rooms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon, CheckCircle, Users, MapPin, BookOpen, Trash2, FileSpreadsheet, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "@/components/UserNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { ExcelUploader } from "@/components/ExcelUploader";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  const userEmail = user?.email || "";
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const { data: roomsList = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  });

  const { data: bookings = [], refetch: refetchBookings } = useQuery({
    queryKey: ['allBookings', refreshTrigger],
    queryFn: getFutureBookings,
    refetchInterval: 60000,
  });

  const { data: myBookings = [], refetch: refetchMyBookings } = useQuery({
    queryKey: ['myBookings', userEmail, refreshTrigger],
    queryFn: () => getUserBookings(userEmail),
    enabled: !!userEmail,
    refetchInterval: 60000,
  });

  const getRoomName = (roomId: string) => {
    const room = roomsList.find(r => r.id === roomId);
    return room ? room.name : "Unknown Room";
  };

  const getRoomDescription = (roomId: string) => {
    const room = roomsList.find(r => r.id === roomId);
    return room?.description || "";
  };

  const handleCancelBooking = async () => {
    if (bookingToCancel && userEmail) {
      const success = await cancelBooking(bookingToCancel, userEmail);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['allBookings'] });
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        queryClient.invalidateQueries({ queryKey: ['roomBooked'] });
        queryClient.invalidateQueries({ queryKey: ['roomBookingInfo'] });
      }
      setBookingToCancel(null);
    }
  };

  const handleBookingSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['allBookings'] });
    queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    queryClient.invalidateQueries({ queryKey: ['roomBooked'] });
    queryClient.invalidateQueries({ queryKey: ['roomBookingInfo'] });
  };

  return (
    <div className="min-h-screen bg-secondary/50">
      <div className="church-header">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/5c3be42e-32ad-42fd-a26c-8bcaad72b8eb.png" 
              alt="GK Brooklyn Logo" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">GK Brooklyn</h1>
              <p className="text-white/90 text-lg">Facility Booking System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="floorplan" className="w-full">
          <TabsList className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} w-full md:w-[600px]`}>
            <TabsTrigger value="floorplan" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Floor Plan
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Your Bookings
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Room Management
              </TabsTrigger>
            )}
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
                  <FloorPlan refreshTrigger={refreshTrigger} onBookingSuccess={handleBookingSuccess} />
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
                            <div className="font-medium text-lg">{getRoomName(booking.room_id)}</div>
                            <div className="text-sm text-gray-600">{booking.purpose}</div>
                            {getRoomDescription(booking.room_id) && (
                              <div className="text-xs text-gray-500 mt-1">{getRoomDescription(booking.room_id)}</div>
                            )}
                            <div className="mt-2 flex flex-col sm:flex-row sm:gap-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {format(new Date(booking.start_time), "MMMM d, yyyy")}
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {format(new Date(booking.start_time), "h:mm a")} - {format(new Date(booking.end_time), "h:mm a")}
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center text-green-600 text-sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirmed
                              </div>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => setBookingToCancel(booking.id)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                Cancel Booking
                              </Button>
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

          {isAdmin && (
            <TabsContent value="admin" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    Room Information Management
                  </CardTitle>
                  <CardDescription>
                    Use Excel to update room details and capacities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExcelUploader />
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {!isAdmin && (
            <TabsContent value="admin" className="mt-6">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Lock className="h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">Admin Access Required</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
                    You do not have permission to access room management features. Please contact an administrator for assistance.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
      
      <footer className="bg-primary text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80 text-sm">
            &copy; {new Date().getFullYear()} GK Brooklyn Facility Management System
          </p>
        </div>
      </footer>

      <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive hover:bg-destructive/90">
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
