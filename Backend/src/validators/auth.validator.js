import { z } from 'zod';

const signupSchema = z.object({
    fullName: z
        .string({ required_error: 'Both names are required' })
        .trim()
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(200, { message: 'Name must be at most 200 characters' }),
    userName: z
        .string({ required_error: 'Username is required' })
        .trim()
        .min(3, { message: 'Username must be at least 2 characters' })
        .max(50, { message: 'Username must be at most 50 characters' }),
    email: z
        .string({ required_error: 'Email address is required' })
        .trim()
        .email({ message: 'Invalid email address' })
        .min(3, { message: 'Email address must be at least 3 characters' })
        .max(200, { message: 'Email address must be at most 200 characters' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password must be at most 100 characters' }),
});

const signinSchema = z.object({
    email: z.string({ required_error: 'Email address is required' }).trim().email({ message: 'Invalid email address' }),
    password: z.string({ required_error: 'Password is required' }),
});

const googleSchema = z.object({
    name: z.string({ required_error: 'Username is required' }),
    email: z.string({ required_error: 'Email address is required' }).trim().email({ message: 'Invalid Email address' }),
    googlePhotoUrl: z.string(),
});

export { signupSchema, signinSchema, googleSchema };
