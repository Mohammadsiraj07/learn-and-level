
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, CheckCircle, Camera, MapPin, GraduationCap, Briefcase, Tag, FileText, Globe, Linkedin, UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileProgress } from "@/components/profile/ProfileProgress";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { CompletionModal } from "@/components/profile/CompletionModal";

// Define interface for profile data to resolve type issues
interface ProfileData {
  id: string;
  full_name: string | null;
  location: string | null;
  role: "student" | "professional" | "";
  teach_skills: string[];
  learn_skills: string[];
  bio: string | null;
  preferred_language: string | null;
  social_link: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

// Define the schema for profile data
const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Please enter your location"),
  role: z.enum(["student", "professional", ""]),
  teachSkills: z.array(z.string()).min(1, "Select at least one skill to teach"),
  learnSkills: z.array(z.string()).min(1, "Select at least one skill to learn"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters"),
  language: z.string().min(1, "Please select a preferred language"),
  socialLink: z.string().url("Please enter a valid URL").or(z.literal("")),
  profilePicture: z.any().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<Partial<ProfileFormValues>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [previousCompletion, setPreviousCompletion] = useState(0);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Check if profile is already completed at 80% or more
    const checkProfileStatus = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      setIsLoading(true);
      
      // Check if we've already redirected to avoid loops
      const redirected = localStorage.getItem("profileRedirected");
      if (redirected === "true") {
        setHasRedirected(true);
      }

      try {
        // Use type assertion for Supabase query
        const { data, error } = await supabase
          .from('profiles')
          .select("*")
          .eq("id", user.id)
          .single() as { data: ProfileData | null, error: any };
          
        if (error) throw error;
        
        if (data) {
          // Transform the data to match our form schema
          const formData: Partial<ProfileFormValues> = {
            fullName: data.full_name || "",
            location: data.location || "",
            role: (data.role as "student" | "professional") || "",
            teachSkills: data.teach_skills || [],
            learnSkills: data.learn_skills || [],
            bio: data.bio || "",
            language: data.preferred_language || "",
            socialLink: data.social_link || "",
            profilePicture: data.avatar_url || "",
          };
          
          setProfileData(formData);
          
          // Calculate completion percentage
          const completionPercentage = calculateCompletion(formData);
          setCompletion(completionPercentage);
          setPreviousCompletion(completionPercentage);
          
          // If profile is at least 80% complete and has required fields
          // and we haven't redirected before, allow access to other features
          if (completionPercentage >= 80 && hasRequiredFields(formData)) {
            if (!hasRedirected && redirected !== "true") {
              localStorage.setItem("profileCompleted", "true");
            }
          } else {
            localStorage.setItem("profileCompleted", "false");
            // Only redirect if coming from signup and not already on profile page
            if (!hasRedirected && redirected !== "true") {
              localStorage.setItem("profileRedirected", "true");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkProfileStatus();
  }, [user, navigate, hasRedirected]);

  const calculateCompletion = (data: Partial<ProfileFormValues>) => {
    const fields = [
      !!data.fullName,
      !!data.location,
      !!data.role,
      Array.isArray(data.teachSkills) && data.teachSkills.length > 0,
      Array.isArray(data.learnSkills) && data.learnSkills.length > 0,
      !!data.bio,
      !!data.language,
      !!data.profilePicture,
      !!data.socialLink,
    ];
    
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };
  
  const hasRequiredFields = (data: Partial<ProfileFormValues>) => {
    return (
      !!data.role &&
      Array.isArray(data.teachSkills) && 
      data.teachSkills.length > 0 &&
      Array.isArray(data.learnSkills) && 
      data.learnSkills.length > 0
    );
  };
  
  const handleSaveProfile = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update the profile in Supabase with type assertion
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
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

      if (error) throw error;
      
      // Handle profile picture upload if changed
      if (data.profilePicture && data.profilePicture instanceof File) {
        const fileExt = data.profilePicture.name.split('.').pop();
        const filePath = `${user.id}/avatar.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, data.profilePicture, {
            upsert: true,
          });
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
          
        // Update profile with avatar URL using type assertion
        await supabase
          .from('profiles')
          .update({ avatar_url: urlData.publicUrl } as any)
          .eq("id", user.id);
      }
      
      // Calculate new completion
      const completionPercentage = calculateCompletion(data);
      setCompletion(completionPercentage);
      
      // Check if completion just hit 100%
      if (completionPercentage === 100 && previousCompletion < 100) {
        setShowCompletionModal(true);
      }
      
      // Update previous completion
      setPreviousCompletion(completionPercentage);
      
      // Mark as completed if >= 80% and has required fields
      if (completionPercentage >= 80 && hasRequiredFields(data)) {
        localStorage.setItem("profileCompleted", "true");
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
      // Update state
      setProfileData(data);
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !Object.keys(profileData).length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProfileLayout>
      <ProfileHeader completion={completion} />
      
      <ProfileForm 
        defaultValues={profileData} 
        onSubmit={handleSaveProfile} 
        isLoading={isLoading} 
        onCompletionChange={setCompletion}
      />
      
      {showCompletionModal && (
        <CompletionModal 
          onClose={() => setShowCompletionModal(false)} 
          topSkill={profileData.teachSkills?.[0] || ""}
        />
      )}
    </ProfileLayout>
  );
};

export default Profile;
