import { z } from "zod"

export const CreateUserSchema=z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(3).max(50),
  password: z.string().min(6, "Password must be at least 6 characters")
})

export const SignInSchema=z.object({
  email: z.string().email("Invalid email").min(3).max(50),
  password: z.string()
})

export const RoomSchema=z.object({
  name:z.string()
})