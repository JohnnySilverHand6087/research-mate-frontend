
import { z } from 'zod';
import { PositionType } from '@/types/api';

export const affiliationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  department: z.string().optional(),
  position_title: z.string().optional(),
  position_type: z.nativeEnum(PositionType),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_primary: z.boolean().default(false),
});

export type AffiliationFormData = z.infer<typeof affiliationSchema>;
