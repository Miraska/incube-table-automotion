import { z } from 'zod'

const BASE_SCHEME = z.object({
  id: z.string(),
  name: z.string(),
  space_id: z.string(),
});

export default BASE_SCHEME;