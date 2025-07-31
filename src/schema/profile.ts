
import { z } from 'zod';

export const profileSchema = z.object({
  display_name: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  orcid_id: z.string().optional(),
  social_links: z.record(z.string()).optional(),
  research_expertise: z.array(z.string()).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
