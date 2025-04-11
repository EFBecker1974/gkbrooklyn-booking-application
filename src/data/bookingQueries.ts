
import { supabase } from "@/integrations/supabase/client";
import { Booking } from "@/types/booking.types";
import { getUserIdFromEmail } from "@/utils/user-utils";

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
  
  const userId = await getUserIdFromEmail(userEmail);
  if (!userId) return [];

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
