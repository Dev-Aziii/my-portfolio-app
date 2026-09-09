// Simple Icons
import {
  // Frontend
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiVite,
  SiTailwindcss,
  SiNextdotjs,
  SiRedux,
  SiSass,
  SiBootstrap,
  SiFlutter,
  SiDart,
  SiExpo,
  SiElectron,

  // Backend & Database
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiLaravel,
  SiDotnet,
  SiPostgresql,
  SiPython,
  SiPhp,
  SiMysql,
  SiFirebase,
  SiSupabase,
  SiRedis,
  SiSqlite,
  SiPrisma,

  // AI & Machine Learning
  SiTensorflow,
  SiPytorch,
  SiKeras,
  SiScikitlearn,
  SiHuggingface,
  SiOpencv,
  SiNumpy,
  SiPandas,
  SiJupyter,
  SiOpenai,

  // DevOps & Tools
  SiDocker,
  SiGithubactions,
  SiGit,
  SiGithub,
  SiPostman,
  SiFigma,
  SiSharp,
  SiNpm,
  SiPnpm,
  SiYarn,
  SiEslint,
  SiPrettier,
  SiVercel,
  SiNetlify,
  SiCloudflare,
} from "react-icons/si";

// Devicons
import {
  DiJava,
  DiMsqlServer,
} from "react-icons/di";

// VS Code Icons
import {
  VscCode,
} from "react-icons/vsc";

// Tabler Icons
import {
  TbBrandVisualStudio,
  TbBrandWindows,
} from "react-icons/tb";

import type { TechCategory } from "./types";

export const techStack: TechCategory[] = [
  {
    name: "Frontend",
    items: [
      { name: "HTML5", icon: SiHtml5, brandColor: "#E34F26" },
      { name: "CSS3", icon: SiCss3, brandColor: "#1572B6" },
      { name: "JavaScript", icon: SiJavascript, brandColor: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, brandColor: "#3178C6" },

      { name: "React", icon: SiReact, brandColor: "#61DAFB" },
      { name: "React Native", icon: SiReact, brandColor: "#61DAFB" },
      //{ name: "Next.js", icon: SiNextdotjs, brandColor: "#000000" },
      //{ name: "Redux", icon: SiRedux, brandColor: "#764ABC" },

      { name: "Vite", icon: SiVite, brandColor: "#646CFF" },
      { name: "Tailwind CSS", icon: SiTailwindcss, brandColor: "#06B6D4" },
      { name: "Sass", icon: SiSass, brandColor: "#CC6699" },
      { name: "Bootstrap", icon: SiBootstrap, brandColor: "#7952B3" },

      { name: "Flutter", icon: SiFlutter, brandColor: "#02569B" },
      { name: "Dart", icon: SiDart, brandColor: "#0175C2" },
      { name: "Expo", icon: SiExpo, brandColor: "#000020" },

      { name: "WinUI", icon: TbBrandWindows, brandColor: "#0078D4" },
      //{ name: "Electron", icon: SiElectron, brandColor: "#47848F" },
    ],
  },

  {
    name: "Backend",
    items: [
      { name: "Node.js", icon: SiNodedotjs, brandColor: "#339933" },
      //{ name: "Express.js", icon: SiExpress, brandColor: "#000000" },
      //{ name: "NestJS", icon: SiNestjs, brandColor: "#E0234E" },

      { name: "Laravel", icon: SiLaravel, brandColor: "#FF2D20" },
      { name: "PHP", icon: SiPhp, brandColor: "#777BB4" },

      { name: "ASP.NET", icon: SiDotnet, brandColor: "#512BD4" },
      { name: "C#", icon: SiSharp, brandColor: "#239120" },

      { name: "Java", icon: DiJava, brandColor: "#007396" },
      { name: "Python", icon: SiPython, brandColor: "#3776AB" },

      { name: "PostgreSQL", icon: SiPostgresql, brandColor: "#4169E1" },
      { name: "MySQL", icon: SiMysql, brandColor: "#4479A1" },
      { name: "SQL Server", icon: DiMsqlServer, brandColor: "#CC2927" },
      { name: "SQLite", icon: SiSqlite, brandColor: "#003B57" },

      { name: "Firebase", icon: SiFirebase, brandColor: "#FFCA28" },
      { name: "Supabase", icon: SiSupabase, brandColor: "#3FCF8E" },
      { name: "Redis", icon: SiRedis, brandColor: "#DC382D" },

      //{ name: "Prisma", icon: SiPrisma, brandColor: "#2D3748" },
    ],
  },

  {
    name: "AI & Machine Learning",
    items: [
      { name: "Python", icon: SiPython, brandColor: "#3776AB" },

      { name: "TensorFlow", icon: SiTensorflow, brandColor: "#FF6F00" },
      { name: "PyTorch", icon: SiPytorch, brandColor: "#EE4C2C" },
      //{ name: "Keras", icon: SiKeras, brandColor: "#D00000" },
      { name: "scikit-learn", icon: SiScikitlearn, brandColor: "#F7931E" },

      { name: "Hugging Face", icon: SiHuggingface, brandColor: "#FFD21E" },
      { name: "OpenAI", icon: SiOpenai, brandColor: "#412991" },

      //{ name: "OpenCV", icon: SiOpencv, brandColor: "#5C3EE8" },
      { name: "NumPy", icon: SiNumpy, brandColor: "#013243" },
      { name: "Pandas", icon: SiPandas, brandColor: "#150458" },

      { name: "Jupyter", icon: SiJupyter, brandColor: "#F37626" },
    ],
  },

  {
    name: "DevOps & Tools",
    items: [
      { name: "Git", icon: SiGit, brandColor: "#F05032" },
      { name: "GitHub", icon: SiGithub, brandColor: "#181717" },
      { name: "GitHub Actions", icon: SiGithubactions, brandColor: "#2088FF" },

      { name: "Docker", icon: SiDocker, brandColor: "#2496ED" },
      { name: "Cloudflare", icon: SiCloudflare, brandColor: "#F38020" },

      { name: "Visual Studio", icon: TbBrandVisualStudio, brandColor: "#5C2D91" },
      { name: "VS Code", icon: VscCode, brandColor: "#007ACC" },

      { name: "Postman", icon: SiPostman, brandColor: "#FF6C37" },
      { name: "Figma", icon: SiFigma, brandColor: "#F24E1E" },

      { name: "npm", icon: SiNpm, brandColor: "#CB3837" },
      { name: "pnpm", icon: SiPnpm, brandColor: "#F69220" },
      { name: "Yarn", icon: SiYarn, brandColor: "#2C8EBB" },

      { name: "ESLint", icon: SiEslint, brandColor: "#4B32C3" },
      { name: "Prettier", icon: SiPrettier, brandColor: "#F7B93E" },

      { name: "Vercel", icon: SiVercel, brandColor: "#000000" },
      { name: "Netlify", icon: SiNetlify, brandColor: "#00C7B7" },
    ],
  },
];