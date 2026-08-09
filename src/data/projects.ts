import {SiReact, SiLaravel, SiSharp, SiDotnet } from "react-icons/si";
import type { Project } from "./types";

export const projects: Project[] = [
  {
    title: "Tezā",
    slug: "teza",
    icon: SiReact,
    logo: "/images/projects/teza/logo.webp",
    url: "https://teza-v1.vercel.app/",
    description: "A modern progressive web application that helps couples stay connected through shared updates, plans, spontaneous proposals, and meaningful daily interactions.",
    details: {
      heroImage: "/images/projects/teza/hero.webp",
      version: "v1.0",
      year: "2026",
      techs: [
        "React",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "Vercel",
        "Supabase",
        "PostgreSQL",
      ],
      highlights: [
        { label: "Real-time couple activity feed" },
        { label: "Installable PWA" },
        { label: "Spontaneous date proposals & response tracking" },
        { label: "Shared daily and monthly schedule planning" }
      ],
      problem: {
        title: "The Challenge: Keeping Couples Connected",
        description:
          "Traditional messaging platforms are built for conversations, not relationship management. They lack dedicated features for sharing daily status updates, organizing future plans, tracking shared schedules, or sending actionable date proposals. As a result, important moments become buried in chat history, making it harder for couples to stay synchronized despite their busy lives."
      },
      solution: {
        title: "The Solution: A Dedicated Relationship Hub",
        description:
          "I designed and developed Tezā as a Progressive Web Application that combines communication, planning, and shared experiences into one intuitive platform. Couples can post what they're currently doing, maintain shared daily and monthly plans, create spontaneous date proposals that can be accepted or declined, and view a unified activity feed that keeps both partners connected in real time. Built with React and Supabase, the application delivers a responsive, installable experience while leveraging real-time synchronization and secure authentication through Supabase's free-tier infrastructure."
      },
      impact: {
        title: "The Impact: Strengthening Digital Intimacy",
        description:
          "Couples using the platform reported feeling more connected through centralized daily updates and shared planning. The PWA approach eliminated app store barriers, enabling instant access across devices. Real-time synchronization ensured both partners stayed informed without delays, transforming scattered conversations into a cohesive shared experience that strengthened daily communication habits."
      },
      additionalImages: [
        "/images/projects/teza/img.webp",
        "/images/projects/teza/img1.webp",
        "/images/projects/teza/img2.webp",
        "/images/projects/teza/img3.webp"
      ]
    }
  },
  {
    title: "ElecSys",
    slug: "elecsys",
    icon: SiLaravel,
    logo: "/images/projects/elecsys/logo.webp",
    url: "locally hosted",
    description: "A high-performance, containerized election management system engineered for offline-first reliability in large-scale cooperative voting environments.",
    details: {
      heroImage: "/images/projects/elecsys/hero.webp",
      version: "v1.0",
      year: "2026",
      techs: ["Laravel", "JavaScript", "Octane", "FrankenPHP", "Docker", "Caddy", "MySQL"],
      highlights: [
        { label: "Offline-first voting" },
        { label: "Transparency and analytics" }
      ],
      metrics: [
        { value: "7,000+", label: "Voters Supported" },
        { value: "66%", label: "Turnout Rate" },
        { value: "7 Hours", label: "Execution Window" },
        { value: "100%", label: "Data Sovereignty" }
      ],
      problem: {
        title: "The Challenge: Breaking SaaS Dependency",
        description: "The organization previously relied on an external voting platform that required stable internet access—an impractical dependency in a remote setting. This resulted in high operational costs, degraded performance during peak usage, and limited control over system reliability. With thousands of participants expected to vote within a short time window, a more resilient and self-managed solution was required."      },
      solution: {
        title: "The Solution: Local-First High Performance",
        description: "I architected and deployed a containerized application stack on a dedicated on-site server to enable a fully localized voting system. The platform was optimized for high concurrency and low-latency access within a private network environment. By eliminating reliance on external services, the system ensured reliable performance, reduced operational overhead, and provided full control over data and infrastructure."
      },
      impact: {
        title: "The Impact: Zero-Downtime Election Execution",
        description: "In the 2025 election, the organization reached 7,000+ voters with a 66% turnout rate across a 13-hour voting window (5:00 AM–6:00 PM). With ElecSys deployed for the 2026 election, the same 7,000+ voter reach and 66% turnout were achieved within just 7 hours (6:00 AM–1:00 PM)—cutting the election window by nearly half while maintaining full participation. The system operated with zero downtime, delivered sub-second response times on the local network, and maintained complete data sovereignty without any external SaaS dependency."
      },
      additionalImages: [
        "/images/projects/elecsys/img1.webp",
        "/images/projects/elecsys/img2.webp",
        "/images/projects/elecsys/img3.webp",
        "/images/projects/elecsys/img4.webp"
      ]
    }
  },
  {
    title: "AccSys",
    description:
      "A Web-Based Integrated Accounting & Financial Management System that automates bookkeeping, financial reporting, and financial transaction management for organizations.",
    url: "http://accsys-jps.runasp.net",
    icon: SiDotnet,
    logo: "/images/projects/accsys/logo.webp",
    slug: "accsys",
    details: {
      heroImage: "/images/projects/accsys/hero.webp",
      version: "v1.0",
      year: "2025",
      techs: [
        ".NET 8",
        "Blazor WebAssembly",
        ".NET Core Web API",
        "SQL Server ",
        "EF Core",
      ],
      highlights: [
        { label: "AP, AR & General Ledger" },
        { label: "JWT Auth and audit logging" },
        { label: "Automated double-entry bookkeeping validation" },
        { label: "Real-time automated financial statements" }
      ],
      metrics: [
      ],
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
      impact: {
        title: "The Impact: Automated Financial Accuracy",
        description:
          "The platform eliminated manual bookkeeping errors through automated double-entry validation, reducing reconciliation time significantly. Real-time dashboards gave management instant visibility into financial health, replacing the delays inherent in spreadsheet-based reporting. Integration with external APIs for payment processing, inflation data, and currency exchange provided a comprehensive financial ecosystem that previously required multiple disconnected tools.",
      },
      additionalImages: [
        "/images/projects/accsys/img1.webp",
        "/images/projects/accsys/img2.webp",
        "/images/projects/accsys/img3.webp",
        "/images/projects/accsys/img4.webp",
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
      heroImage: "/images/projects/peoplehub/hero.webp",
      version: "v1.0",
      year: "2024",
      techs: ["C#", "Windows Forms", "DevExpress", ".NET", "SQL Server"],
      highlights: [
        { label: "Centralized employee record management" },
        { label: "Attendance tracking & leave approval flow" },
        { label: "Automated payroll calculation engine" },
        { label: "DevExpress UI dashboard controls" }
      ],
      metrics: [
      ],
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
      impact: {
        title: "The Impact: Streamlined HR Operations",
        description:
          "The system consolidated employee management, attendance tracking, leave approval, and payroll processing into a single desktop application, eliminating the need for multiple disconnected tools. The project demonstrated practical proficiency in C# desktop development, database integration, and UI component libraries while delivering a functional HR tool that met all course requirements with distinction.",
      },
      additionalImages: [
         "/images/projects/peoplehub/img1.webp",
        "/images/projects/peoplehub/img2.webp",
        "/images/projects/peoplehub/img3.webp",
      ],
    },
  }
];