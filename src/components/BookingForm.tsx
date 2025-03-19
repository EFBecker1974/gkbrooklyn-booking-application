
import { useState } from "react";
import { bookRoom } from "@/data/bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addHours, setHours, setMinutes } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingFormProps {
  roomId: string;
  onSuccess: () => void;
}

export const BookingForm = ({ roomId, onSuccess }: BookingFormProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [startHour, setStartHour] = useState("9");
  const [duration, setDuration] = useState("1");
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create start time by setting the hour from the selected hour
    const startTime = setMinutes(setHours(date, parseInt(startHour)), 0);
    
    // Create end time by adding the duration to the start time
    const endTime = addHours(startTime, parseInt(duration));
    
    const success = bookRoom({
      roomId,
      startTime,
      endTime,
      bookedBy: name,
      purpose
    });
    
    if (success) {
      onSuccess();
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

  // Generate duration options (1 to 4 hours)
  const durations = [1, 2, 3, 4].map(h => ({
    value: h.toString(),
    label: `${h} hour${h > 1 ? 's' : ''}`
  }));

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
                disabled={(date) => date < new Date()}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
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
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger id="duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {durations.map((duration) => (
              <SelectItem key={duration.value} value={duration.value}>
                {duration.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
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
      
      <Button type="submit" className="w-full">Book Room</Button>
    </form>
  );
};
