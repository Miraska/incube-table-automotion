import { z } from 'zod'

const AUTOMATION_SCHEMA = z.object({
  id: z.string(),
  name: z.string(),
  trigger_type: z.enum(['onCreate', 'onUpdate', 'onDelete', 'scheduled']),
  enabled: z.boolean(),
  created_time: z.date(),
  created_by: z.string().nullable().optional(),
  last_modified_time: z.date().optional(),
});

export default AUTOMATION_SCHEMA;