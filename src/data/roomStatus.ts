
import { supabase } from "@/integrations/supabase/client";

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
