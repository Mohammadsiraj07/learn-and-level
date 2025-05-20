
import { Sparkles } from "lucide-react";
import { ProfileProgress } from "./ProfileProgress";

interface ProfileHeaderProps {
  completion: number;
}

export const ProfileHeader = ({ completion }: ProfileHeaderProps) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <span className="text-sm font-medium text-primary">Profile setup</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold">
        Complete Your Profile to Start Swapping Skills
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl">
        Unlock powerful features like matches, verification badges, and sessions by completing your SkillSwap profile.
      </p>
      
      <ProfileProgress completion={completion} />
    </div>
  );
};
