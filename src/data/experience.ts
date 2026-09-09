import type { ExperienceEntry } from "./types";

export const experiences: ExperienceEntry[] = [
  {
    title: "Software Developer & Freelance Consultant",
    company: "Independent / Client Projects",
    year: "2025 - PRESENT",
    logoInitials: "SD",
    schedule: "Full-time / Contract",
    location: "Davao City, Philippines · Hybrid / Remote",
    isCurrent: true,
    positions: [
      {
        title: "Full-Stack Web & Mobile Developer",
        timeSpan: "JAN 2025 - PRESENT",
        description: [
          "Building and maintaining web, mobile, and desktop applications using Flutter, Laravel, React, TypeScript, and WinUI for a variety of client projects.",
          "Developing REST APIs, working with SQL/NOSQL databases, improving application performance, and deploying client applications to cloud and serverless platforms.",
        ],
        skills: [
          "Laravel",
          "React",
          "Flutter",
          "Dart",
          "PHP",
          "TypeScript",
          "WinUI",
          "C#",
          "Tailwind CSS",
          "REST APIs",
          "SQL",
          "Git"
        ],
      },
    ],
  },
  {
    title: "University of Mindanao - Main Campus",
    company: "University of Mindanao",
    year: "2023 - 2027",
    kind: "education",
    logoInitials: "UM",
    schedule: "Degree Program · 4 yrs",
    location: "Davao City, Philippines · On-site",
    positions: [
      {
        title: "BS Information Technology Student | Capstone Lead/Full-Stack Developer",
        timeSpan: "AUG 2022 - SEP 2027 · 4 YRS",
        description: [
          "Pursuing Bachelor of Science in Information Technology, focusing on software engineering principles, enterprise database design, and mobile computing.",
          "Led development of capstone software projects, coordinating system design, API integrations, and code reviews across team members.",
        ],
        skills: ["Database Systems", "Data Structures", "Web Development", "Mobile App Development", "Machine Learning", "Team Leadership"],
      },
    ],
  },
  {
    title: "First Milestone & Tech Journey",
    company: "Self-Directed Learning",
    year: "2021",
    kind: "learning",
    logoInitials: "HW",
    schedule: "Self-Initiated Milestone",
    location: "Davao, Philippines",
    positions: [
      {
        title: "Started Software Development Journey",
        timeSpan: "2021 · FIRST CODE",
        description: [
          'Wrote the first line of code: system.out.println("Hello, World!"); and embarked on a passion-driven path into modern web development and software engineering.',
        ],
        skills: ["Java"],
      },
    ],
  },
];

