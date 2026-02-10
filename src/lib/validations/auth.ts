import z, { email } from "zod";


// Sign In Schema
export const signInSchema = z.object({
    email : z.string().email("Invalid email address"),
    password : z.string().min(6, "Password must be at least 6 characters long")
});

// sign up schema
export const signUpSchema = z.object({
    name : z.string().min(2, "Name must be at least 2 characters long"),
    email : z.string().email("Invalid email address"),
    password : z.string().min(6, "Password must be at least 6 characters long")
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;