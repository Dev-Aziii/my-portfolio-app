// Simple Icons
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiVite,
  SiTailwindcss,
  SiNodedotjs,
  SiLaravel,
  SiFlutter,
  SiDotnet,
  SiPostgresql,
  SiPython,
  SiPhp,
  SiDart,
  SiMysql,
  SiFirebase,
  SiTensorflow,
  SiScikitlearn,
  SiHuggingface,
  SiDocker,
  SiGithubactions,
  SiGit,
  SiGithub,
  SiPostman,
  SiFigma,
  SiSharp,
} from "react-icons/si";

// Devicons - programming language icons
import {
  DiJava,
  DiMsqlServer, 
} from "react-icons/di";

// VS Code Icons
import {
  VscCode, 
} from "react-icons/vsc";

// Tabler Icons - for Visual Studio
import {
  TbBrandVisualStudio,
} from "react-icons/tb";

import type { TechCategory } from "./types";

export const techStack: TechCategory[] = [
  {
    name: "Frontend",
    items: [
      { name: "JavaScript", icon: SiJavascript, brandColor: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, brandColor: "#3178C6" },
      { name: "React", icon: SiReact, brandColor: "#61DAFB" },
      { name: "Vite", icon: SiVite, brandColor: "#646CFF" },
      { name: "Tailwind CSS", icon: SiTailwindcss, brandColor: "#06B6D4" },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js", icon: SiNodedotjs, brandColor: "#339933" },
      { name: "Laravel", icon: SiLaravel, brandColor: "#FF2D20" },
      { name: "Flutter", icon: SiFlutter, brandColor: "#02569B" },
      { name: "ASP.NET", icon: SiDotnet, brandColor: "#512BD4" },
      { name: "PostgreSQL", icon: SiPostgresql, brandColor: "#4169E1" },
      { name: "Java", icon: DiJava, brandColor: "#007396" },
      { name: "Python", icon: SiPython, brandColor: "#3776AB" },
      { name: "C#", icon: SiSharp, brandColor: "#239120" },
      { name: "PHP", icon: SiPhp, brandColor: "#777BB4" },
      { name: "Dart", icon: SiDart, brandColor: "#0175C2" },
      { name: "MySQL", icon: SiMysql, brandColor: "#4479A1" },
      { name: "SQL Server", icon: DiMsqlServer, brandColor: "#CC2927" },
      { name: "Firebase", icon: SiFirebase, brandColor: "#FFCA28" },
    ],
  },
  {
    name: "AI & Machine Learning",
    items: [
      { name: "TensorFlow", icon: SiTensorflow, brandColor: "#FF6F00" },
      { name: "scikit-learn", icon: SiScikitlearn, brandColor: "#F7931E" },
      { name: "Hugging Face", icon: SiHuggingface, brandColor: "#FFD21E" },
    ],
  },
  {
    name: "DevOps & Tools",
    items: [
      { name: "Docker", icon: SiDocker, brandColor: "#2496ED" },
      { name: "GitHub Actions", icon: SiGithubactions, brandColor: "#2088FF" },
      { name: "Git", icon: SiGit, brandColor: "#F05032" },
      { name: "GitHub", icon: SiGithub, brandColor: "#181717" },
      { name: "Visual Studio", icon: TbBrandVisualStudio, brandColor: "#5C2D91" },
      { name: "VS Code", icon: VscCode, brandColor: "#007ACC" },
      { name: "Postman", icon: SiPostman, brandColor: "#FF6C37" },
      { name: "Figma", icon: SiFigma, brandColor: "#F24E1E" },
    ],
  },
];
