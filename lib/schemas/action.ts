import { z } from 'zod'

const ACTION_SCHEME = z.object({
  id: z.string(),
  automation_id: z.string(),
  order: z.number(),
  type: z.enum(["updateRecord", "callAPI", "sendNotification", "runScript"]),
  name: z.string(),
  trigger_type: z.enum(['onCreate', 'onUpdate', 'onDelete', 'scheduled']),
  enabled: z.boolean(),
  created_time: z.date(),
  last_modified_time: z.date().optional(),
});

export default ACTION_SCHEME;