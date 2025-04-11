
import { supabase } from "@/integrations/supabase/client";
import { BookingRequest, BookingCreateRequest } from "@/types/booking.types";
import { getUserIdFromEmail } from "@/utils/user-utils";

export const bookRoom = async (booking: BookingRequest): Promise<boolean> => {
  console.log("Creating booking:", booking);
  
  const userId = await getUserIdFromEmail(booking.bookedBy);
  if (!userId) return false;
  
  try {
    // Start a transaction by using RPC - this way if booking fails,
    // we won't have orphaned booking_usage records
    const { data, error } = await supabase.rpc('create_booking_with_usage', {
      p_room_id: booking.roomId,
      p_start_time: booking.startTime.toISOString(),
      p_end_time: booking.endTime.toISOString(),
      p_user_id: userId,
      p_purpose: booking.purpose || "Room reservation"
    });
    
    if (error) {
      console.error("Error creating booking with RPC:", error);
      
      // Fallback method if RPC fails or doesn't exist
      // Just insert the booking directly - the trigger for booking_usage
      // might fail silently but at least the booking will be created
      const { error: insertError } = await supabase
        .from('bookings')
        .insert({
          room_id: booking.roomId,
          start_time: booking.startTime.toISOString(),
          end_time: booking.endTime.toISOString(),
          user_id: userId,
          purpose: booking.purpose || "Room reservation"
        });
      
      if (insertError) {
        console.error("Error creating booking fallback:", insertError);
        return false;
      }
    }
    
    return true;
  } catch (err) {
    console.error("Exception during booking creation:", err);
    return false;
  }
};

export const createBooking = async (booking: BookingCreateRequest): Promise<boolean> => {
  // Just call our bookRoom function with the right parameters
  return await bookRoom({
    roomId: booking.roomId,
    startTime: booking.startTime,
    endTime: booking.endTime,
    bookedBy: booking.userEmail,
    purpose: booking.purpose
  });
};

export const cancelBooking = async (bookingId: string, userEmail: string): Promise<boolean> => {
  const userId = await getUserIdFromEmail(userEmail);
  if (!userId) return false;
  
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
