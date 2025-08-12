import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to convert and object to a request query params
export function objectToQueryString(obj: Record<string, any>) {
   return Object.keys(obj)
      .map((key) => `${key}=${obj[key] || ''}`)
      .join('&')
}