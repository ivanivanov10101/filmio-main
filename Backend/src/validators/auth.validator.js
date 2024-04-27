import { z } from 'zod';

// create an object schema....
const signupSchema = z.object({
    fullName: z
        .string({ required_error: 'Both names are required' })
        .trim()
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(200, { message: 'Name must be at most 200 characters' }),
    userName: z
        .string({ required_error: 'Username is required' })
        .trim()
        .min(2, { message: 'Username must be at least 2 characters' })
        .max(50, { message: 'Username must be at most 500 characters' }),
    email: z
        .string({ required_error: 'Email address is required' })
        .trim()
        .email({ message: 'Email address is not correct' })
        .min(3, { message: 'Email address must be at least 3 characters' })
        .max(200, { message: 'Email address must be at most 200 characters' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(200, { message: 'Password must be at most 200 characters' }),
});

const loginSchema = z.object({
    email: z.string({ required_error: 'Email address is required' }).trim().email({ message: 'Email address is not correct' }),
    password: z.string({ required_error: 'Password is required' }),
});

const googleSchema = z.object({
    name: z.string(),
    email: z.string({ required_error: 'Email address is required' }).trim().email({ message: 'Email address is not correct' }),
    googlePhotoUrl: z.string(),
});

export { signupSchema, loginSchema, googleSchema };
