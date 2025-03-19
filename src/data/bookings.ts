
import { toast } from "sonner";

export interface Booking {
  id: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  bookedBy: string;
  purpose: string;
}

// Helper to get all future bookings
export const getFutureBookings = (): Booking[] => {
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

// Check if a room is currently booked
export const isRoomBooked = (roomId: string): boolean => {
  const now = new Date();
  const bookings = getFutureBookings();
  
  return bookings.some(booking => 
    booking.roomId === roomId && 
    booking.startTime <= now && 
    booking.endTime > now
  );
};

// Get current booking information for a room if it exists
export const getRoomBookingInfo = (roomId: string): Booking | null => {
  const now = new Date();
  const bookings = getFutureBookings();
  
  return bookings.find(booking => 
    booking.roomId === roomId && 
    booking.startTime <= now && 
    booking.endTime > now
  ) || null;
};

// Check if a room is available for a specific time slot
export const isTimeSlotAvailable = (roomId: string, startTime: Date, endTime: Date): boolean => {
  const bookings = getFutureBookings();
  
  return !bookings.some(booking => 
    booking.roomId === roomId && 
    ((startTime >= booking.startTime && startTime < booking.endTime) || 
     (endTime > booking.startTime && endTime <= booking.endTime) ||
     (startTime <= booking.startTime && endTime >= booking.endTime))
  );
};

// Book a room
export const bookRoom = (booking: Omit<Booking, 'id'>): boolean => {
  if (!isTimeSlotAvailable(booking.roomId, booking.startTime, booking.endTime)) {
    toast.error("This time slot is already booked.");
    return false;
  }
  
  const bookings = getFutureBookings();
  const newBooking: Booking = {
    ...booking,
    id: `booking-${Date.now()}`
  };
  
  bookings.push(newBooking);
  
  localStorage.setItem('roomBookings', JSON.stringify(bookings));
  toast.success("Room booked successfully!");
  return true;
};
