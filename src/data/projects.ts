import { SiLaravel, SiSharp, SiDotnet } from "react-icons/si";
import type { Project } from "./types";

export const projects: Project[] = [
  {
    title: "ElecSys",
    slug: "elecsys",
    icon: SiLaravel,
    url: "/no-link-yet",
    description: "A high-performance, Dockerized election management system built with Laravel Octane and FrankenPHP, engineered for offline-first reliability in large-scale cooperative voting.",
    details: {
      heroImage: "/images/projects/elecsys/hero.jpg",
      techs: ["Laravel", "Octane", "FrankenPHP", "Docker", "Caddy", "MySQL"],
      gist: {
        title: "The Gist",
        description: "ElecSys is a custom-built election system developed for the Samal Island Multipurpose Cooperative (SIMC) to manage over 7,000 eligible voters. Replacing a costly and unreliable third-party SaaS, I architected a high-performance, localized solution. By deploying a Dockerized environment on a physical server using Laravel Octane and FrankenPHP, we achieved lightning-fast response times and 100% uptime, independent of the island's often-unstable internet connectivity."
      },
      problem: {
        title: "The Challenge: Breaking SaaS Dependency",
        description: "SIMC previously relied on an external SaaS provider that required a constant internet connection—a major bottleneck in remote areas of Samal Island. This dependency led to high operational costs, frequent timeouts during peak voting hours, and a total lack of control over technical support. With 7,000 members needing to cast votes simultaneously, the cooperative required a localized infrastructure that could handle high traffic without relying on the cloud."
      },
      solution: {
        title: "The Solution: Local-First High Performance",
        description: "I engineered a modern infrastructure using Docker Desktop on a physical on-site server. To meet high concurrency demands, I implemented Laravel Octane powered by FrankenPHP, with Caddy serving as a high-performance web server. The networking architecture utilizes a localized LAN with Caddy handling requests through a physical server, allowing all voting terminals to access the system via local IP/port forwarding. This 'private cloud' approach eliminated internet costs, removed external latency, and provided SIMC with full sovereignty over their election data."
      },
      additionalImages: [
        "/images/projects/elecsys/img1.jpg",
        "/images/projects/elecsys/img2.jpg",
        "/images/projects/elecsys/img3.jpg",
        "/images/projects/elecsys/img4.jpg"
      ]
    }
  },
  {
    title: "AccSys",
    description:
      "A Web-Based Integrated Accounting & Financial Management System that automates bookkeeping, financial reporting, and financial transaction management for organizations.",
    url: "http://accsys-jps.runasp.net",
    icon: SiDotnet,
    slug: "accsys",
    details: {
      heroImage: "/images/projects/accsys/hero.png",
      techs: [
        ".NET 8",
        "Blazor WebAssembly",
        "ASP.NET Core Web API",
        "SQL Server 2022",
        "MudBlazor",
        "Entity Framework Core"
      ],
      gist: {
        title: "The Gist",
        description:
          "AccSys is a modern web-based accounting and financial management system designed to automate financial processes for organizations. Built using .NET 8, Blazor WebAssembly, and SQL Server, the system integrates core accounting modules such as General Ledger, Accounts Payable, and Accounts Receivable into a single platform. It features automated double-entry bookkeeping, real-time financial dashboards, and financial statement generation. AccSys also integrates external services such as PayMongo for payment processing, the World Bank API for Philippine inflation data, and Frankfurter API for currency exchange rates, providing a comprehensive financial ecosystem.",
      },
      problem: {
        title: "Where It Came From: The Problem",
        description:
          "Many small to medium organizations still rely on fragmented tools such as spreadsheets and manual bookkeeping to manage financial operations. This leads to inconsistent financial records, delayed reporting, and higher risk of accounting errors. Managing bills, invoices, journal entries, and financial reports across different tools also makes it difficult for management to obtain real-time financial insights. A unified system was needed to centralize financial data, automate bookkeeping processes, and provide secure multi-user access with role-based permissions.",
      },
      solution: {
        title: "The Solution",
        description:
          "AccSys was developed as an integrated accounting platform that centralizes all financial operations within a secure web-based system. The platform implements automated double-entry bookkeeping, ensuring every transaction maintains accounting integrity. Core modules such as Accounts Payable, Accounts Receivable, and the General Ledger allow organizations to manage vendors, customers, bills, invoices, and journal entries efficiently. Real-time financial dashboards and automatically generated financial statements provide immediate insights into business performance. With role-based access control, JWT authentication, and audit logging, the system ensures secure multi-user financial management while maintaining transparency and accountability.",
      },
      additionalImages: [
        "/images/projects/accsys/img1.png",
        "/images/projects/accsys/img2.png",
        "/images/projects/accsys/img3.png",
        "/images/projects/accsys/img4.png",
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