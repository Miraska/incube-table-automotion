import { z } from 'zod'

const SPACE_SCHEME = z.object({
  id: z.string(),
  name: z.string(),
});

export default SPACE_SCHEME;