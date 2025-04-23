
import { getFutureBookings, getUserBookings, getRoomBookings, getRoomBookingInfo } from "./bookingQueries";
import { isRoomBooked } from "./roomStatus";
import { bookRoom, createBooking, cancelBooking } from "./bookingMutations";

// Re-export everything
export {
  getFutureBookings,
  getUserBookings,
  getRoomBookings,
  getRoomBookingInfo,
  isRoomBooked,
  bookRoom,
  createBooking,
  cancelBooking
};

// Re-export types
export type { Booking, BookingRequest, BookingCreateRequest } from "@/types/booking.types";
