import type {
  Certification,
  ExperienceEntry,
  Project,
} from "@/data/types";

export interface DashboardStats {
  projects: number;
  certifications: number;
  contributions: number;
  education: number;
}

interface DashboardStatsInput {
  projects: Project[];
  certifications: Certification[];
  experiences: ExperienceEntry[];
  contributions: number;
}

export function getDashboardStats({
  projects,
  certifications,
  experiences,
  contributions,
}: DashboardStatsInput): DashboardStats {
  return {
    projects: projects.length,
    certifications: certifications.length,
    contributions,
    education: experiences.filter((entry) => entry.kind === "education").length,
  };
}
