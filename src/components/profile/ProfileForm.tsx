
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  User, MapPin, GraduationCap, Briefcase, Tag, 
  FileText, Globe, Linkedin, UploadCloud, Loader2, Save 
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileFormValues } from "@/pages/Profile";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { SkillsInput } from "./SkillsInput";

// Sample skills list, ideally this should come from your database
const SAMPLE_SKILLS = [
  "JavaScript", "TypeScript", "React", "Vue", "Angular", 
  "Node.js", "Python", "Java", "C#", "PHP",
  "GraphQL", "REST API", "SQL", "MongoDB", "Firebase",
  "AWS", "Azure", "Google Cloud", "DevOps", "UI/UX Design",
  "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Sass",
  "Redux", "MobX", "Zustand", "React Query", "Testing",
  "Marketing", "SEO", "Content Writing", "Graphic Design", "Video Editing"
];

// Sample languages
const LANGUAGES = ["English", "Spanish", "French", "German", "Mandarin", "Japanese", "Hindi", "Arabic", "Portuguese", "Russian"];

interface ProfileFormProps {
  defaultValues: Partial<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  isLoading: boolean;
  onCompletionChange: (completion: number) => void;
}

export const ProfileForm = ({ 
  defaultValues, 
  onSubmit, 
  isLoading,
  onCompletionChange,
}: ProfileFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize form with zod schema
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(z.object({
      fullName: z.string().min(2, "Name must be at least 2 characters"),
      location: z.string().min(2, "Please enter your location"),
      role: z.enum(["student", "professional", ""]),
      teachSkills: z.array(z.string()).min(1, "Select at least one skill to teach"),
      learnSkills: z.array(z.string()).min(1, "Select at least one skill to learn"),
      bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
      language: z.string().min(1, "Please select a preferred language"),
      socialLink: z.string().url("Please enter a valid URL").or(z.literal("")),
      profilePicture: z.any().optional(),
    })),
    defaultValues: {
      fullName: "",
      location: "",
      role: "",
      teachSkills: [],
      learnSkills: [],
      bio: "",
      language: "",
      socialLink: "",
      ...defaultValues,
    },
  });
  
  // Set profile picture preview if one exists in defaultValues
  useEffect(() => {
    if (typeof defaultValues.profilePicture === "string" && defaultValues.profilePicture) {
      setPreviewUrl(defaultValues.profilePicture);
    }
  }, [defaultValues.profilePicture]);
  
  // Calculate and update completion percentage as form values change
  useEffect(() => {
    const formValues = form.getValues();
    const fields = [
      !!formValues.fullName,
      !!formValues.location,
      !!formValues.role,
      Array.isArray(formValues.teachSkills) && formValues.teachSkills.length > 0,
      Array.isArray(formValues.learnSkills) && formValues.learnSkills.length > 0,
      !!formValues.bio,
      !!formValues.language,
      !!previewUrl,
      !!formValues.socialLink,
    ];
    
    const filledFields = fields.filter(Boolean).length;
    const completionPercentage = Math.round((filledFields / fields.length) * 100);
    onCompletionChange(completionPercentage);
  }, [form.watch(), previewUrl, onCompletionChange]);

  const handleProfilePictureChange = (file: File | null) => {
    if (file) {
      form.setValue("profilePicture", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="overflow-hidden border-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <h3 className="text-xl font-semibold">Basic Information</h3>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <ProfilePictureUpload 
                  previewUrl={previewUrl} 
                  onChange={handleProfilePictureChange} 
                />
              </div>
              
              <div className="md:w-2/3 space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {field.value === "student" ? (
                          <GraduationCap className="h-4 w-4" />
                        ) : field.value === "professional" ? (
                          <Briefcase className="h-4 w-4" />
                        ) : (
                          <><GraduationCap className="h-4 w-4" />/
                          <Briefcase className="h-4 w-4" /></>
                        )}
                        Are you a Student or Professional?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <h3 className="text-xl font-semibold">Skills & Preferences</h3>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="teachSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Skills You Can Teach
                  </FormLabel>
                  <FormControl>
                    <SkillsInput
                      placeholder="Select skills you can teach..."
                      availableSkills={SAMPLE_SKILLS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Select skills that you're confident to teach others
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="learnSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Skills You Want to Learn
                  </FormLabel>
                  <FormControl>
                    <SkillsInput
                      placeholder="Select skills you want to learn..."
                      availableSkills={SAMPLE_SKILLS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Select skills that you're interested in learning
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Preferred Language for Communication
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-56 overflow-y-auto">
                      {LANGUAGES.map(language => (
                        <SelectItem key={language} value={language}>{language}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <h3 className="text-xl font-semibold">About You</h3>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Bio / About Me
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell others about yourself, your experience, and what you're looking for..."
                      {...field}
                      rows={4}
                      maxLength={500}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn or Portfolio (optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Add your LinkedIn or portfolio URL to showcase your work
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
          
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              className="bg-primary/10 hover:bg-primary/20"
              onClick={() => onSubmit(form.getValues())}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
