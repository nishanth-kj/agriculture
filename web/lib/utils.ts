import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidIdentity(identity: string) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
  
  if (identity.includes("@")) {
    return emailRegex.test(identity);
  }
  return usernameRegex.test(identity);
}
