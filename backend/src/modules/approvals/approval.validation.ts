import { z } from 'zod';

export const approveSubmissionSchema = z.object({
  action: z.enum(['approved', 'rejected'], {
    errorMap: () => ({ message: 'action phải là approved hoặc rejected' })
  }),
  feedback: z.string().optional().default('')
});
