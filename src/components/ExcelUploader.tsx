
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { rooms, Room } from '@/data/rooms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface RoomUpdate {
  id: string;
  description?: string;
  capacity?: number;
}

export const ExcelUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an Excel file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
      
      // Process the data - expect columns: id, description, capacity
      const updates: RoomUpdate[] = jsonData.map(row => ({
        id: row.id?.toString() || '',
        description: row.description,
        capacity: row.capacity ? Number(row.capacity) : undefined
      }));
      
      // Check for valid data
      if (updates.length === 0) {
        throw new Error("No valid data found in Excel file");
      }
      
      // Update rooms in the data store
      let updatedCount = 0;
      let capacityUpdatedCount = 0;
      let descriptionUpdatedCount = 0;
      
      updates.forEach(update => {
        if (update.id) {
          const roomIndex = rooms.findIndex(room => room.id === update.id);
          if (roomIndex !== -1) {
            let updated = false;
            
            if (update.description) {
              rooms[roomIndex].description = update.description;
              descriptionUpdatedCount++;
              updated = true;
            }
            
            if (update.capacity !== undefined) {
              rooms[roomIndex].capacity = update.capacity;
              capacityUpdatedCount++;
              updated = true;
            }
            
            if (updated) updatedCount++;
          }
        }
      });
      
      // Show success message
      let successMessage = `Updated ${updatedCount} rooms`;
      if (descriptionUpdatedCount > 0 && capacityUpdatedCount > 0) {
        successMessage += ` (${descriptionUpdatedCount} descriptions, ${capacityUpdatedCount} capacities)`;
      } else if (descriptionUpdatedCount > 0) {
        successMessage += ` (${descriptionUpdatedCount} descriptions)`;
      } else if (capacityUpdatedCount > 0) {
        successMessage += ` (${capacityUpdatedCount} capacities)`;
      }
      
      toast({
        title: "Rooms updated successfully",
        description: successMessage,
      });
      
      // Clear the file input
      setFile(null);
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error("Error processing Excel file:", error);
      toast({
        title: "Error processing Excel file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium">Update Room Information</h3>
      <p className="text-sm text-muted-foreground">
        Upload an Excel file with room details to update information.
        The Excel file should have columns: <code>id</code>, <code>description</code>, and <code>capacity</code>.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          onClick={handleUpload} 
          disabled={!file || isLoading}
          className="whitespace-nowrap"
        >
          {isLoading ? "Processing..." : "Upload & Process"}
        </Button>
      </div>
      
      <div className="mt-2 text-sm">
        {file && (
          <p className="text-green-600">
            Selected file: {file.name}
          </p>
        )}
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Room ID Reference:</h4>
        <div className="text-xs text-muted-foreground max-h-40 overflow-y-auto border p-2 rounded">
          {rooms.map(room => (
            <div key={room.id} className="mb-1">
              <strong>{room.id}</strong>: {room.name} ({room.area}) - Capacity: {room.capacity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
