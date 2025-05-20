
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { ProfileService } from "@/services/ProfileService";
import { ProfileFormValues, ProfileData } from "@/types/profile.types";

export const useProfile = () => {
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
        const data = await ProfileService.fetchProfile(user.id);
        
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
      // Update the profile in Supabase
      const { error } = await ProfileService.updateProfile(user.id, data);
      if (error) throw error;
      
      // Handle profile picture upload if changed
      if (data.profilePicture && data.profilePicture instanceof File) {
        const { error: uploadError } = await ProfileService.uploadProfilePicture(user.id, data.profilePicture);
        if (uploadError) throw uploadError;
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

  const closeCompletionModal = () => setShowCompletionModal(false);

  return {
    profileData,
    isLoading,
    completion,
    showCompletionModal,
    setCompletion,
    handleSaveProfile,
    closeCompletionModal,
  };
};
