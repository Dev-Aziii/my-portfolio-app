import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import type { FunctionComponent, SVGProps } from "react";

export interface HeroData {
  name: string;
  title: string;
  location: string;
  email: string;
  profileImage: string;
  profileImage2: string;
  cvUrl: string;
}

export interface TechItem {
  name: string;
  icon: LucideIcon | IconType | FunctionComponent<SVGProps<SVGSVGElement>>;
  brandColor: string;
}

export interface TechCategory {
  name: string;
  items: TechItem[];
}

export interface PositionEntry {
  title: string;
  timeSpan: string;
  description?: string | string[];
  skills?: string[];
}

export interface ExperienceEntry {
  title?: string;
  company: string;
  year: string;
  logoInitials?: string;
  schedule?: string;
  location?: string;
  positions?: PositionEntry[];
  emoji?: string;
  isCurrent?: boolean;
}

export interface Project {
  title: string;
  description: string;
  url: string;
  icon:  LucideIcon | IconType | FunctionComponent<SVGProps<SVGSVGElement>>;
  slug?: string;
  details?: ProjectDetails;
}

export interface ProjectHighlight {
  label: string;
  icon?: LucideIcon | IconType | FunctionComponent<SVGProps<SVGSVGElement>>;
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectDetails {
  heroImage: string;
  techs: string[];
  version?: string;
  year?: string;
  problem: {
    title: string;
    description: string;
  };
  solution: {
    title: string;
    description: string;
  };
  impact: {
    title: string;
    description: string;
  };
  highlights?: ProjectHighlight[];
  metrics?: ProjectMetric[];
  additionalImages?: string[];
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
