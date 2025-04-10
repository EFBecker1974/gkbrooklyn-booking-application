
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  bookedBy: string;
  purpose: string;
  user_id?: string;
}

// Helper to get all future bookings
export const getFutureBookings = async (): Promise<Booking[]> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('end_time', now);
  
  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
  
  return data.map(booking => ({
    id: booking.id,
    roomId: booking.room_id,
    startTime: new Date(booking.start_time),
    endTime: new Date(booking.end_time),
    bookedBy: booking.user_id,
    purpose: booking.purpose || ''
  }));
};

// Fallback to localStorage for backward compatibility
export const getFutureBookingsSync = (): Booking[] => {
  const storedBookings = localStorage.getItem('roomBookings');
  if (!storedBookings) return [];
  
  const bookings: Booking[] = JSON.parse(storedBookings, (key, value) => {
    if (key === 'startTime' || key === 'endTime') {
      return new Date(value);
    }
    return value;
  });
  
  const now = new Date();
  return bookings.filter(booking => booking.endTime > now);
};

// Get bookings for a specific user
export const getUserBookings = async (userEmail: string): Promise<Booking[]> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("Error getting user:", userError);
    return [];
  }
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userData.user.id);
  
  if (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
  
  return data.map(booking => ({
    id: booking.id,
    roomId: booking.room_id,
    startTime: new Date(booking.start_time),
    endTime: new Date(booking.end_time),
    bookedBy: userEmail,
    purpose: booking.purpose || ''
  }));
};

// Check if a room is currently booked
export const isRoomBooked = async (roomId: string): Promise<boolean> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('room_id', roomId)
    .lte('start_time', now)
    .gte('end_time', now)
    .limit(1);
  
  if (error) {
    console.error("Error checking if room is booked:", error);
    return false;
  }
  
  return data.length > 0;
};

// Get current booking information for a room if it exists
export const getRoomBookingInfo = async (roomId: string): Promise<Booking | null> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('room_id', roomId)
    .lte('start_time', now)
    .gte('end_time', now)
    .limit(1);
  
  if (error || data.length === 0) {
    return null;
  }
  
  const booking = data[0];
  return {
    id: booking.id,
    roomId: booking.room_id,
    startTime: new Date(booking.start_time),
    endTime: new Date(booking.end_time),
    bookedBy: booking.user_id,
    purpose: booking.purpose || ''
  };
};

// Check if a room is available for a specific time slot
export const isTimeSlotAvailable = async (roomId: string, startTime: Date, endTime: Date): Promise<boolean> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('room_id', roomId)
    .or(`start_time.lte.${endTime.toISOString()},end_time.gte.${startTime.toISOString()}`);
  
  if (error) {
    console.error("Error checking time slot availability:", error);
    return false;
  }
  
  return data.length === 0;
};

// Book a room
export const bookRoom = async (booking: Omit<Booking, 'id'>): Promise<boolean> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    toast.error("You must be logged in to book a room");
    return false;
  }
  
  const isAvailable = await isTimeSlotAvailable(booking.roomId, booking.startTime, booking.endTime);
  
  if (!isAvailable) {
    toast.error("This time slot is already booked.");
    return false;
  }
  
  // Insert directly into the bookings table without triggering booking_usage
  const { error } = await supabase
    .from('bookings')
    .insert({
      room_id: booking.roomId,
      start_time: booking.startTime.toISOString(),
      end_time: booking.endTime.toISOString(),
      user_id: userData.user.id,
      purpose: booking.purpose
    });
  
  if (error) {
    console.error("Error booking room:", error);
    toast.error("Error booking room. Please try again.");
    return false;
  }
  
  toast.success("Room booked successfully!");
  return true;
};

// Cancel a booking
export const cancelBooking = async (bookingId: string, userName: string): Promise<boolean> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    toast.error("You must be logged in to cancel a booking");
    return false;
  }
  
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)
    .eq('user_id', userData.user.id);
  
  if (error) {
    console.error("Error cancelling booking:", error);
    toast.error("Error cancelling booking. Please try again.");
    return false;
  }
  
  toast.success("Booking cancelled successfully!");
  return true;
};
