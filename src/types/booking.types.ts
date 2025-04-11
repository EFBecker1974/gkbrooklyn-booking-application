
import { Tables } from "@/integrations/supabase/types";

export type Booking = Tables<'bookings'>;

export interface BookingRequest {
  roomId: string;
  startTime: Date;
  endTime: Date;
  bookedBy: string;
  purpose?: string;
}

export interface BookingCreateRequest {
  roomId: string;
  startTime: Date;
  endTime: Date;
  userEmail: string;
  purpose?: string;
}
