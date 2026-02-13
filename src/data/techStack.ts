import type { TechCategory } from "./types";

export const techStack: TechCategory[] = [
  {
    name: "Frontend",
    items: ["JavaScript", "TypeScript", "React", 
            "Vite", "Tailwind CSS"],
  },
  {
    name: "Backend",
    items: ["Node.js", "Laravel", "Flutter", "ASP.NET", "PostgreSQL", "Java", 
            "Python", "C#", "PHP", "Dart", "MySQL", "SQL Server", "Firebase"],
  },
  {
    name: "AI & Machine Learning",
    items: ["TensorFlow", "scikit-learn", "Hugging Face"],
  },
  {
    name: "DevOps & Tools",
    items: ["Docker", "GitHub Actions", "Git", "GitHub", 
            "Visual Studio", "VsCode", "Postman", "Figma"],
  },
];
