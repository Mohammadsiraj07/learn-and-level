
// This file extends the Supabase types with our custom tables
export interface ProfilesTable {
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

// Add any other custom tables here
