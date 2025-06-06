
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
      throw new Error("User not found");
    }

    console.log("Creating booking with data:", {
      room_id: roomId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      user_id: userId,
      purpose: purpose || 'Meeting'
    });

    // Direct insert to bookings table
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
      // Check for overlap error specifically
      if (error.message.includes('Booking overlaps')) {
        throw new Error("This time slot is already booked. Please choose a different time.");
      }
      throw new Error(`Booking failed: ${error.message}`);
    }

    return data && data[0]?.id || null;
  } catch (error) {
    console.error("Exception when creating booking:", error);
    throw error;
  }
};

/**
 * Book a room with a stored procedure or direct insert
 * This function is deprecated, use createBooking instead
 * @deprecated
 */
export const bookRoom = async (booking: BookingRequest): Promise<boolean> => {
  try {
    // Convert email to userId if needed
    let userId = booking.bookedBy;
    
    // Check if it looks like an email
    if (booking.bookedBy.includes('@')) {
      const userIdFromEmail = await getUserIdFromEmail(booking.bookedBy);
      if (!userIdFromEmail) {
        console.error("Could not find user ID for email:", booking.bookedBy);
        return false;
      }
      userId = userIdFromEmail;
    }
    
    console.log("Creating booking with bookRoom:", {
      room_id: booking.roomId,
      start_time: booking.startTime.toISOString(),
      end_time: booking.endTime.toISOString(),
      user_id: userId,
      purpose: booking.purpose || 'Meeting'
    });

    // Direct insert to bookings table
    const { error } = await supabase
      .from('bookings')
      .insert([
        {
          room_id: booking.roomId,
          start_time: booking.startTime.toISOString(),
          end_time: booking.endTime.toISOString(),
          user_id: userId,
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
      throw new Error("User not found");
    }

    console.log(`Attempting to cancel booking ${bookingId} for user ${userId}`);

    // Remove the check that limits cancellation to only the booking creator
    // This allows admin users to also cancel bookings
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);
      
    if (error) {
      console.error("Error cancelling booking:", error);
      throw new Error(`Cancellation failed: ${error.message}`);
    }
    
    console.log(`Successfully cancelled booking ${bookingId}`);
    return true;
  } catch (error) {
    console.error("Exception when cancelling booking:", error);
    throw error;
  }
};
