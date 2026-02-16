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
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "React", icon: SiReact },
      { name: "Vite", icon: SiVite },
      { name: "Tailwind CSS", icon: SiTailwindcss },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Laravel", icon: SiLaravel },
      { name: "Flutter", icon: SiFlutter },
      { name: "ASP.NET", icon: SiDotnet },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Java", icon: DiJava },
      { name: "Python", icon: SiPython },
      { name: "C#", icon: SiSharp },
      { name: "PHP", icon: SiPhp },
      { name: "Dart", icon: SiDart },
      { name: "MySQL", icon: SiMysql },
      { name: "SQL Server", icon: DiMsqlServer },
      { name: "Firebase", icon: SiFirebase },
    ],
  },
  {
    name: "AI & Machine Learning",
    items: [
      { name: "TensorFlow", icon: SiTensorflow },
      { name: "scikit-learn", icon: SiScikitlearn },
      { name: "Hugging Face", icon: SiHuggingface },
    ],
  },
  {
    name: "DevOps & Tools",
    items: [
      { name: "Docker", icon: SiDocker },
      { name: "GitHub Actions", icon: SiGithubactions },
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "Visual Studio", icon: TbBrandVisualStudio },
      { name: "VS Code", icon: VscCode },
      { name: "Postman", icon: SiPostman },
      { name: "Figma", icon: SiFigma },
    ],
  },
];