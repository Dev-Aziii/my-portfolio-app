import type { LucideIcon } from "lucide-react";

export interface HeroData {
  name: string;
  title: string;
  location: string;
  email: string;
  profileImage: string;
}

export interface TechCategory {
  name: string;
  items: string[];
}

export interface ExperienceEntry {
  title: string;
  year: string;
  company: string;
  emoji?: string;
  isCurrent?: boolean;
}

export interface Project {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
}

export interface Certification {
  title: string;
  issuer: string;
  href: string;
}

export interface Recommendation {
  quote: string;
  author: string;
  title: string;
  initials: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType;
}

export interface Membership {
  name: string;
  href: string;
}
