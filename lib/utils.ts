import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageUrl(path?: string | null, tmdbSize: string = "w500"): string {
  if (!path) return ""
  if (/^https?:\/\//i.test(path)) return path
  // Assume TMDB path otherwise
  const clean = path.startsWith("/") ? path : `/${path}`
  return `https://image.tmdb.org/t/p/${tmdbSize}${clean}`
}
