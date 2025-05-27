
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface MatchedUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  skills_teach: string[];
  skills_learn: string[];
  matchingTeachSkills: string[]; // Skills they teach that I want to learn
  matchingLearnSkills: string[]; // Skills they want to learn that I can teach
}

export class MatchingService {
  static async getCurrentUserProfile(userId: string): Promise<Profile | null> {
    console.log('Fetching current user profile for:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching current user profile:', error);
      return null;
    }

    console.log('Current user profile:', data);
    return data;
  }

  static async findMatches(currentUserId: string): Promise<MatchedUser[]> {
    console.log('Finding matches for user:', currentUserId);
    
    // First get current user's profile
    const currentUserProfile = await this.getCurrentUserProfile(currentUserId);
    
    if (!currentUserProfile) {
      console.log('Current user profile not found');
      return [];
    }

    const mySkillsTeach = currentUserProfile.skills_teach || [];
    const mySkillsLearn = currentUserProfile.skills_learn || [];

    console.log('My skills to teach:', mySkillsTeach);
    console.log('My skills to learn:', mySkillsLearn);

    if (mySkillsTeach.length === 0 && mySkillsLearn.length === 0) {
      console.log('User has no skills configured');
      return [];
    }

    // Get all other users' profiles
    const { data: allProfiles, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId);

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }

    console.log('Total profiles fetched:', allProfiles?.length || 0);

    if (!allProfiles || allProfiles.length === 0) {
      console.log('No other profiles found');
      return [];
    }

    // Filter and process matches
    const matches: MatchedUser[] = [];

    for (const profile of allProfiles) {
      const theirSkillsTeach = profile.skills_teach || [];
      const theirSkillsLearn = profile.skills_learn || [];

      // Find overlapping skills
      const theyTeachWhatILearn = theirSkillsTeach.filter(skill => 
        mySkillsLearn.includes(skill)
      );
      
      const theyLearnWhatITeach = theirSkillsLearn.filter(skill => 
        mySkillsTeach.includes(skill)
      );

      // Must have overlap in both directions
      if (theyTeachWhatILearn.length > 0 && theyLearnWhatITeach.length > 0) {
        matches.push({
          id: profile.id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          skills_teach: theirSkillsTeach,
          skills_learn: theirSkillsLearn,
          matchingTeachSkills: theyTeachWhatILearn,
          matchingLearnSkills: theyLearnWhatITeach,
        });

        console.log(`Match found: ${profile.full_name}`);
        console.log('  They teach what I learn:', theyTeachWhatILearn);
        console.log('  They learn what I teach:', theyLearnWhatITeach);
      }
    }

    console.log('Total matches found:', matches.length);
    return matches;
  }
}
