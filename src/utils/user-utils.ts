
import { supabase } from "@/integrations/supabase/client";

export const getUserIdFromEmail = async (email: string): Promise<string | null> => {
  if (!email) {
    console.error("No user email provided");
    return null;
  }
  
  // Get the user's ID from profiles table using email
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();
    
  if (profileError || !profile) {
    console.error("Error finding user profile:", profileError);
    return null;
  }
    
  return profile.id;
};
