import { z } from 'zod'

const FIELD_SCHEME = z.object({
  id: z.string(),
  name: z.string(),
  table_id: z.number(),
  field_type: z.enum(["number", "string"]),
  data: z.any(),
});

export default FIELD_SCHEME;