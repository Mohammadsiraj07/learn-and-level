
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, ProfileFormValues } from "@/types/profile.types";

export const ProfileService = {
  /**
   * Fetch profile data for a specific user
   */
  async fetchProfile(userId: string): Promise<ProfileData | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select("*")
        .eq("id", userId)
        .single() as { data: ProfileData | null, error: any };
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },

  /**
   * Update profile data
   */
  async updateProfile(userId: string, data: ProfileFormValues): Promise<{ error: any | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: data.fullName,
          location: data.location,
          role: data.role,
          teach_skills: data.teachSkills,
          learn_skills: data.learnSkills,
          bio: data.bio,
          preferred_language: data.language,
          social_link: data.socialLink,
          updated_at: new Date().toISOString(),
        } as any);

      return { error };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error };
    }
  },

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(userId: string, file: File): Promise<{ publicUrl: string | null, error: any | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
        
      // Update profile with avatar URL
      await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl } as any)
        .eq("id", userId);

      return { publicUrl: urlData.publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return { publicUrl: null, error };
    }
  }
};
