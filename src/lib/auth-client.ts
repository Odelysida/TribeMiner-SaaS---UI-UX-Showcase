import { createAuthClient } from "better-auth/vue"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001", // Backend server URL
  credentials: "include"
})

export const { signIn, signUp, signOut, useSession, updateUser } = authClient 