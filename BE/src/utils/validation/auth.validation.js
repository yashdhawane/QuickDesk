const { z } = require('zod');
const {Language} = require('../../model/enums/enum');

const LanguageEnum = z.enum(Object.values(Language));


const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  interest: z.array(z.string()).optional(),
  language: LanguageEnum.optional(),
  profilePic: z.url().optional(), 
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

module.exports = { registerSchema, loginSchema };
