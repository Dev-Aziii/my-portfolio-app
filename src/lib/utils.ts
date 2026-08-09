import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidHttpUrl(url?: string | null): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (!/^https?:\/\//i.test(trimmed)) return false
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export function formatDemoLabel(value?: string | null): string {
  const trimmed = value?.trim()
  if (!trimmed) return "Demo Unavailable"
  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
