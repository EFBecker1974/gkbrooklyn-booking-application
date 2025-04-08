
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      
      if (jsonData.length === 0) {
        throw new Error("No data found in Excel file");
      }
      
      console.log("Excel data to process:", jsonData);

      // Process each row and update or insert to the database
      const updatedRecords = [];
      const newRecords = [];
      
      // Process each row in the Excel file
      for (const row of jsonData) {
        // Skip rows without an ID
        if (!row.id) continue;

        // Prepare room data object
        const roomData: any = {
          id: row.id.toString(),
          name: row.name || `Room ${row.id}`,
          capacity: parseInt(row.capacity) || 0
        };

        // Handle features array (area + amenities)
        const features: string[] = [];
        
        // First item in features is the area
        if (row.area) {
          features.push(row.area);
        } else {
          features.push("Pastorie"); // Default area
        }
        
        // Add amenities if present
        if (row.amenities && typeof row.amenities === 'string') {
          const amenitiesList = row.amenities.split(',').map((a: string) => a.trim());
          features.push(...amenitiesList);
        }
        
        roomData.features = features;

        // Check if the room exists
        const { data: existingRoom } = await supabase
          .from('rooms')
          .select('id')
          .eq('id', roomData.id)
          .single();

        if (existingRoom) {
          // Update existing room
          const { error } = await supabase
            .from('rooms')
            .update(roomData)
            .eq('id', roomData.id);
            
          if (error) {
            console.error(`Error updating room ${roomData.id}:`, error);
          } else {
            updatedRecords.push(roomData.id);
          }
        } else {
          // Insert new room
          const { error } = await supabase
            .from('rooms')
            .insert(roomData);
            
          if (error) {
            console.error(`Error inserting room ${roomData.id}:`, error);
          } else {
            newRecords.push(roomData.id);
          }
        }
      }
      
      // Show success message
      if (updatedRecords.length > 0 || newRecords.length > 0) {
        let successMessage = '';
        if (newRecords.length > 0) {
          successMessage += `Created ${newRecords.length} new rooms. `;
        }
        if (updatedRecords.length > 0) {
          successMessage += `Updated ${updatedRecords.length} existing rooms.`;
        }
        
        toast({
          title: "Rooms processed successfully",
          description: successMessage,
        });
        
        // Force a reload to reflect the changes
        window.location.reload();
      } else {
        toast({
          title: "No rooms were processed",
          description: "Check your Excel file format and try again",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error("Error processing Excel file:", error);
      toast({
        title: "Error processing Excel file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Clear the file input
      setFile(null);
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium">Upload Room Information</h3>
      <p className="text-sm text-muted-foreground">
        Upload an Excel file with room details to create or update rooms.
        The Excel file should have columns: <code>id</code>, <code>name</code>, <code>capacity</code>, <code>area</code>, and <code>amenities</code> (comma separated).
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
        <h4 className="text-sm font-medium mb-2">Excel Structure Example:</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs">
            <thead>
              <tr className="bg-muted">
                <th className="border px-2 py-1">id</th>
                <th className="border px-2 py-1">name</th>
                <th className="border px-2 py-1">capacity</th>
                <th className="border px-2 py-1">area</th>
                <th className="border px-2 py-1">amenities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">101</td>
                <td className="border px-2 py-1">Conference Room</td>
                <td className="border px-2 py-1">20</td>
                <td className="border px-2 py-1">Pastorie</td>
                <td className="border px-2 py-1">Projector, Whiteboard, WiFi</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">102</td>
                <td className="border px-2 py-1">Meeting Room</td>
                <td className="border px-2 py-1">10</td>
                <td className="border px-2 py-1">Kerksaal</td>
                <td className="border px-2 py-1">WiFi, Table Tennis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
