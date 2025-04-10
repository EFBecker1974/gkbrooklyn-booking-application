
import { useState } from "react";
import { bookRoom } from "@/data/bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Sun, Moon, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addHours, setHours, setMinutes, isBefore, startOfDay } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface BookingFormProps {
  roomId: string;
  onSuccess: () => void;
}

type DurationType = 
  | "1" | "2" | "3" | "4" // hours
  | "half-day-am" 
  | "half-day-pm" 
  | "full-day";

export const BookingForm = ({ roomId, onSuccess }: BookingFormProps) => {
  // Set default date to tomorrow to ensure it's in the future
  const tomorrow = addHours(new Date(), 24);
  const [date, setDate] = useState<Date>(tomorrow);
  const [startHour, setStartHour] = useState("9");
  const [duration, setDuration] = useState<DurationType>("1");
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.email) {
      toast.error("You must be logged in to book a room");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create start time by setting the hour from the selected hour
      let startTime = setMinutes(setHours(date, parseInt(startHour)), 0);
      let endTime: Date;
      
      // Check if the booking start time is in the past
      if (isBefore(startTime, new Date())) {
        toast.error("Cannot book a time slot in the past");
        setIsSubmitting(false);
        return;
      }
      
      // Calculate end time based on duration type
      switch(duration) {
        case "1":
        case "2":
        case "3":
        case "4":
          // Hours - add the selected number of hours
          endTime = addHours(startTime, parseInt(duration));
          break;
        case "half-day-am":
          // Morning half day (9:00 AM - 1:00 PM)
          startTime = setHours(date, 9);
          endTime = setHours(date, 13);
          break;
        case "half-day-pm":
          // Afternoon half day (1:00 PM - 5:00 PM)
          startTime = setHours(date, 13);
          endTime = setHours(date, 17);
          break;
        case "full-day":
          // Full day (9:00 AM - 5:00 PM)
          startTime = setHours(date, 9);
          endTime = setHours(date, 17);
          break;
        default:
          // Default 1 hour
          endTime = addHours(startTime, 1);
      }
      
      const success = await bookRoom({
        roomId,
        startTime,
        endTime,
        bookedBy: user.email,
        purpose
      });
      
      if (success) {
        toast.success("Room booked successfully");
        onSuccess();
      } else {
        toast.error("Failed to book room. Please try again.");
      }
    } catch (error) {
      console.error("Error booking room:", error);
      toast.error("Failed to book room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate hours for selection (8 AM to 6 PM)
  const hours = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    return {
      value: hour.toString(),
      label: `${hour}:00 ${hour < 12 ? 'AM' : hour === 12 ? 'PM' : `${hour - 12} PM`}`
    };
  });

  // Only show start time field if duration is hourly
  const isHourlyDuration = ["1", "2", "3", "4"].includes(duration);
  
  // Get current date for date picker disabled dates
  const today = startOfDay(new Date());

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                disabled={(date) => isBefore(date, today)}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {isHourlyDuration && (
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Select value={startHour} onValueChange={setStartHour}>
              <SelectTrigger id="start-time">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour.value} value={hour.value}>
                    {hour.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Select value={duration} onValueChange={(value) => setDuration(value as DurationType)}>
          <SelectTrigger id="duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>1 hour</span>
              </div>
            </SelectItem>
            <SelectItem value="2">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>2 hours</span>
              </div>
            </SelectItem>
            <SelectItem value="3">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>3 hours</span>
              </div>
            </SelectItem>
            <SelectItem value="4">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>4 hours</span>
              </div>
            </SelectItem>
            <SelectItem value="half-day-am">
              <div className="flex items-center">
                <Sun className="mr-2 h-4 w-4" />
                <span>Half Day (Morning: 9AM - 1PM)</span>
              </div>
            </SelectItem>
            <SelectItem value="half-day-pm">
              <div className="flex items-center">
                <Moon className="mr-2 h-4 w-4" />
                <span>Half Day (Afternoon: 1PM - 5PM)</span>
              </div>
            </SelectItem>
            <SelectItem value="full-day">
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>Full Day (9AM - 5PM)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="purpose">Meeting Purpose</Label>
        <Input
          id="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Brief description of meeting"
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Booking..." : "Book Room"}
      </Button>
    </form>
  );
};
