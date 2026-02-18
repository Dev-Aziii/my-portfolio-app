import { SiLaravel, SiSharp  } from "react-icons/si";
import type { Project } from "./types";

export const projects: Project[] = [
  {
    title: "ElecSys",
    description:
      "A Web Application Election System for Samal Island Multipurpose Cooperative (SIMC) developed using Laravel Framework and Tailwnd CSS.",
    url: "/no-link-yet",
    icon: SiLaravel,
    slug: "elecsys",
    details: {
      heroImage: "/images/projects/elecsys/hero.jpg",
      techs: ["PHP", "Laravel", "MySQL", "Linux", "Nginx"],
      gist: {
        title: "The Gist",
        description:
          "ElecSys is a custom-built election management system I developed for Samal Island Multipurpose Cooperative (SIMC), which has over 7,000 illigible voters. In past years, elections and member management were plagued with issues: the cooperative relied on a third-party SaaS, which was costly (internet fees were separate), unreliable in low-connectivity areas, and slow to resolve problems since contacting their support was difficult. Our team built a centralized, offline-first system running on a LEMP stack virtual machine, accessible via a local LAN through host PC port forwarding. This ensures reliable voting and dashboard operations without depending on internet connectivity.",
      },
      problem: {
        title: "Where It Came From: The Problem",
        description:
          "SIMC’s previous election operations faced multiple challenges. The third-party SaaS they used required stable internet, which was often unavailable in remote areas such as Samal Island. Operational issues were frequent, costs were high due to separate internet fees, and fixing problems required contacting external admins, which was slow and inefficient. With over 7,000 members, manually managing voter eligibility, vote counts, and reporting became extremely difficult. The cooperative needed a system that could work offline, reduce dependency on external providers, and ensure accurate, real-time election management.",
      },
      solution: {
        title: "The Solution",
        description:
          "I developed ElecSys as an offline-first system deployed on a LEMP stack virtual machine. Using a custom LAN network architecture with host PC port forwarding, all terminals could access the system locally for voting and dashboard operations, eliminating the need for internet connectivity. Our solution includes a secure backend database to store all member and election data, a responsive frontend for vote casting and dashboard monitoring, and user-friendly interfaces for administrators. By removing reliance on third-party services, reducing costs, and providing full control over operations, ElecSys dramatically improved election efficiency, accuracy, and reliability for SIMC.",
      },
      additionalImages: [
        "/images/projects/elecsys/img1.jpg",
        "/images/projects/elecsys/img2.jpg",
        "/images/projects/elecsys/img3.jpg",
      ],
    },
  },
  {
    title: "PeopleHub-HRMS",
    description:
      "Desktop-based Human Resource Management System (HRMS) developed in C# using Windows Forms and enhanced with DevExpress components.",
    url: "https://github.com/Dev-Aziii/peopleHUB-HRMS",
    icon: SiSharp,
    slug: "peoplehub-hrms",
    details: {
      heroImage: "/images/projects/peoplehub/hero.png",
      techs: ["C#", "Windows Forms", "DevExpress", ".NET", "SQL Server"],
      gist: {
        title: "The Gist",
        description:
          "PeopleHub is a desktop-based Human Resource Management System created for a school project. It manages employee data, tracks attendance, handles leave requests, and processes payroll. The project uses C# and Windows Forms for the interface, enhanced with DevExpress components for a modern and user-friendly experience.",
      },
      problem: {
        title: "The Problem",
        description:
          "For the course, I needed a practical project to demonstrate our understanding of C# desktop applications and database integration. The challenge was to build a functional HRMS system that could handle basic HR tasks such as managing employee records, attendance, leaves, and payroll in a single desktop application.",
      },
      solution: {
        title: "The Solution",
        description:
          "I developed a desktop application using C# and Windows Forms, integrating SQL Server for data storage. DevExpress components were used to create a polished and intuitive interface. The system allows users to add and manage employees, track attendance, approve leave requests, and calculate payroll, all in a self-contained desktop environment. This project fulfilled the course requirements and provided hands-on experience in building practical desktop applications.",
      },
      additionalImages: [
         "/images/projects/peoplehub/img1.png",
        "/images/projects/peoplehub/img2.png",
        "/images/projects/peoplehub/img3.png",
      ],
    },
  }
];