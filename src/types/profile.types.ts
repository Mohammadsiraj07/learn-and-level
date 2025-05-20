
import { z } from "zod";

// Define interface for profile data from the database
export interface ProfileData {
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

// Define the schema for profile form data
export const profileSchema = z.object({
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
