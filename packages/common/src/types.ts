import { z } from "zod"

export const CreateUserSchema=z.object({
  name: z.string(),
  email: z.string().min(3).max(20),
  password: z.string()
})

export const SignInSchema=z.object({
  email: z.string().min(3).max(20),
  password: z.string()
})

export const RoomSchema=z.object({
  name:z.string()
})