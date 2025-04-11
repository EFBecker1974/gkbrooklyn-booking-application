
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

  // Get the user's ID from profiles table using email
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single();
    
  if (profileError || !profile) {
    console.error("Error finding user profile:", profileError);
    return [];
  }
    
  const userId = profile.id;

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .gte('end_time', now)
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }

  return bookings || [];
};

export const cancelBooking = async (bookingId: string, userEmail: string): Promise<boolean> => {
  // Get the user's ID from profiles table using email
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single();
    
  if (profileError || !profile) {
    console.error("Error finding user profile:", profileError);
    return false;
  }
    
  const userId = profile.id;
  
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)
    .eq('user_id', userId);

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

export const bookRoom = async (booking: {
  roomId: string;
  startTime: Date;
  endTime: Date;
  bookedBy: string;
  purpose?: string;
}): Promise<boolean> => {
  console.log("Creating booking:", booking);
  
  if (!booking.bookedBy) {
    console.error("No user email provided");
    return false;
  }
  
  // Get the user's ID from profiles table using email
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', booking.bookedBy)
    .single();
    
  if (profileError || !profile) {
    console.error("Error finding user profile:", profileError);
    return false;
  }
    
  const userId = profile.id;
  
  // Insert directly into the bookings table with the user's UUID instead of email
  const { error } = await supabase
    .from('bookings')
    .insert({
      room_id: booking.roomId,
      start_time: booking.startTime.toISOString(),
      end_time: booking.endTime.toISOString(),
      user_id: userId,
      purpose: booking.purpose || "Room reservation"
    });
  
  if (error) {
    console.error("Error creating booking:", error);
    return false;
  }
  
  return true;
};

export const createBooking = async (booking: {
  roomId: string;
  startTime: Date;
  endTime: Date;
  userEmail: string;
  purpose?: string;
}): Promise<boolean> => {
  // Just call our bookRoom function with the right parameters
  return await bookRoom({
    roomId: booking.roomId,
    startTime: booking.startTime,
    endTime: booking.endTime,
    bookedBy: booking.userEmail,
    purpose: booking.purpose
  });
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
