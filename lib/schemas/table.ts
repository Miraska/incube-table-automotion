import { z } from 'zod'

const TABLE_SCHEME = z.object({
  id: z.string(),
  name: z.string(),
  base_id: z.number(),
});

export default TABLE_SCHEME;