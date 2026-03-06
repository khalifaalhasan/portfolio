"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { upsertProfile } from "@/actions/profile";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Profile } from "@prisma/client";
import { ImageUpload } from "./ImageUpload";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  initial: z.string().max(3, "Initial max 3 characters."),
  tagline: z.string().min(2, "Tagline required."),
  location: z.string().optional(),
  locationLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  summary: z.string().optional(),
  avatarUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm({ initialData }: { initialData: Profile | null }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "",
      initial: initialData?.initial || "",
      tagline: initialData?.tagline || "",
      location: initialData?.location || "",
      locationLink: initialData?.locationLink || "",
      description: initialData?.description || "",
      summary: initialData?.summary || "",
      avatarUrl: initialData?.avatarUrl || "",
      resumeUrl: initialData?.resumeUrl || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      await upsertProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="initial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initials (Max 3)</FormLabel>
                <FormControl>
                  <Input placeholder="JD" maxLength={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer & Designer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Jakarta, Indonesia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="locationLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Link (Google Maps)</FormLabel>
                <FormControl>
                  <Input placeholder="https://maps.google.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description (Intro)</FormLabel>
              <FormControl>
                <Textarea placeholder="Hi, I am a software engineer..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rich Summary / About Me</FormLabel>
              <FormControl>
                <Textarea className="min-h-[150px]" placeholder="Detailed biography..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value || ""} 
                    onChange={field.onChange} 
                    folder="avatars"
                  />
                </FormControl>
                <FormDescription>Upload your profile picture (Max 5MB).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resumeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume/CV Document</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value || ""} 
                    onChange={field.onChange} 
                    folder="resumes"
                    accept=".pdf,.doc,.docx"
                  />
                </FormControl>
                <FormDescription>Upload your Resume/CV (PDF/DOCX, Max 5MB).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </form>
    </Form>
  );
}
