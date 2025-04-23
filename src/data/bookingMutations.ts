
import { supabase } from "@/integrations/supabase/client";
import { BookingRequest, BookingCreateRequest } from "@/types/booking.types";
import { getUserIdFromEmail } from "@/utils/user-utils";

/**
 * Create a booking directly in the database
 */
export const createBooking = async (bookingData: BookingCreateRequest): Promise<string | null> => {
  try {
    const { roomId, startTime, endTime, userEmail, purpose } = bookingData;
    
    // Get the user's ID from their email
    const userId = await getUserIdFromEmail(userEmail);
    if (!userId) {
      console.error("Could not find user ID for email:", userEmail);
      return null;
    }

    // Insert the booking
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          room_id: roomId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          user_id: userId,
          purpose: purpose || 'Meeting'
        }
      ])
      .select();

    if (error) {
      console.error("Error creating booking:", error);
      return null;
    }

    return data && data[0]?.id || null;
  } catch (error) {
    console.error("Exception when creating booking:", error);
    return null;
  }
};

/**
 * Book a room with a stored procedure or direct insert
 */
export const bookRoom = async (booking: BookingRequest): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          room_id: booking.roomId,
          start_time: booking.startTime.toISOString(),
          end_time: booking.endTime.toISOString(),
          user_id: booking.bookedBy,
          purpose: booking.purpose || 'Meeting'
        }
      ]);

    if (error) {
      console.error("Error booking room:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception when booking room:", error);
    return false;
  }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: string, userEmail: string): Promise<boolean> => {
  try {
    // Get the user's ID from their email
    const userId = await getUserIdFromEmail(userEmail);
    if (!userId) {
      console.error("Could not find user ID for email:", userEmail);
      return false;
    }

    // Add a check that ensures the user cancelling the booking is either:
    // 1. The user who created the booking
    // 2. An admin (would need a new check for admin status)
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
  } catch (error) {
    console.error("Exception when cancelling booking:", error);
    return false;
  }
};
