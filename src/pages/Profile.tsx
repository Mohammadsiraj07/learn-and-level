
import { useProfile } from "@/hooks/useProfile";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { CompletionModal } from "@/components/profile/CompletionModal";

const Profile = () => {
  const { 
    profileData, 
    isLoading, 
    completion, 
    showCompletionModal,
    setCompletion, 
    handleSaveProfile, 
    closeCompletionModal
  } = useProfile();

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
          onClose={closeCompletionModal} 
          topSkill={profileData.teachSkills?.[0] || ""}
        />
      )}
    </ProfileLayout>
  );
};

export default Profile;
