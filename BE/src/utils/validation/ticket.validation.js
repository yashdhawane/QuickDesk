const { z } = require('zod');


// Ticket creation validation schema
const createTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().optional(),
  tag: z.array(z.string()).optional(),
  attachment: z.url('Attachment must be a valid URL').optional(),
});

module.exports = {
  createTicketSchema,
};
