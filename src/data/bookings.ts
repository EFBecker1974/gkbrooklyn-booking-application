
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Booking = Tables<'bookings'>;

export const getFutureBookings = async (): Promise<Booking[]> => {
  const now = new Date().toISOString();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('end_time', now)
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }

  return bookings || [];
};

export const getUserBookings = async (userEmail: string): Promise<Booking[]> => {
  const now = new Date().toISOString();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userEmail)
    .gte('end_time', now)
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }

  return bookings || [];
};

export const cancelBooking = async (bookingId: string, userEmail: string): Promise<boolean> => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)
    .eq('user_id', userEmail);

  if (error) {
    console.error("Error cancelling booking:", error);
    return false;
  }

  return true;
};

export const getRoomBookings = async (roomId: string): Promise<Booking[]> => {
  const now = new Date().toISOString();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('room_id', roomId)
    .gte('end_time', now)
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Error fetching room bookings:", error);
    return [];
  }

  return bookings || [];
};

// Add the missing bookRoom function that BookingForm.tsx is trying to use
export const bookRoom = async (booking: {
  roomId: string;
  startTime: Date;
  endTime: Date;
  bookedBy: string;
  purpose?: string;
}): Promise<boolean> => {
  // Just call our existing createBooking function with the right parameters
  return await createBooking({
    roomId: booking.roomId,
    startTime: booking.startTime,
    endTime: booking.endTime,
    userEmail: booking.bookedBy,
    purpose: booking.purpose
  });
};

export const createBooking = async (booking: {
  roomId: string;
  startTime: Date;
  endTime: Date;
  userEmail: string;
  purpose?: string;
}): Promise<boolean> => {
  console.log("Creating booking:", booking);
  
  if (!booking.userEmail) {
    console.error("No user email provided");
    return false;
  }
  
  // Insert directly into the bookings table
  const { error } = await supabase
    .from('bookings')
    .insert({
      room_id: booking.roomId,
      start_time: booking.startTime.toISOString(),
      end_time: booking.endTime.toISOString(),
      user_id: booking.userEmail,
      purpose: booking.purpose || "Room reservation"
    });
  
  if (error) {
    console.error("Error creating booking:", error);
    return false;
  }
  
  return true;
};

export const getRoomBookingInfo = async (roomId: string, startTime: Date, endTime: Date): Promise<Booking[]> => {
  const start = startTime.toISOString();
  const end = endTime.toISOString();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('room_id', roomId)
    .gte('end_time', start)
    .lte('start_time', end);

  if (error) {
    console.error("Error fetching room bookings:", error);
    return [];
  }

  return bookings || [];
};

// Add missing isRoomBooked function needed by FloorPlan and RoomItem
export const isRoomBooked = async (roomId: string): Promise<boolean> => {
  const now = new Date();
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', roomId)
    .lte('start_time', now.toISOString())
    .gte('end_time', now.toISOString())
    .limit(1);
    
  if (error) {
    console.error("Error checking if room is booked:", error);
    return false;
  }
  
  return (data && data.length > 0);
};
