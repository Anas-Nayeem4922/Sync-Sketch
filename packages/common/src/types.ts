import { z } from "zod";

export const SignupSchema = z.object({
    email: z.string().email(),
    username: z.string().max(20),
    password: z.string().min(4).max(10)
});

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(10)
});

export const RoomSchema = z.object({
    slug: z.string().max(30)
})

