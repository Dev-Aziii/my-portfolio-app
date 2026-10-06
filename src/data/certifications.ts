import type { Certification } from "./types";
import { SiCisco } from "react-icons/si";
import { VscTerminal } from "react-icons/vsc";
import { TbShield, TbWorldCode } from "react-icons/tb";

export const certifications: Certification[] = [
  // Networking & Security
  {
    title: "IT Specialist in Cybersecurity",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/3e5d833f-7a78-4b43-ad8f-24d922e9c5a7/public_url",
    pdfUrl: "/pdf/Information Technology Specialist in Cybersecurity.pdf",
    category: "Networking & Security",
    icon: SiCisco,
    iconUrl: "https://images.credly.com/images/d05c40ff-0e15-4c1d-8c4f-6607e93eda24/ITS-Badges-Cybersecurity.png",
  },
  {
    title: "IT Specialist in Network Security",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/4aef257a-6820-45fb-a984-5d9dac9f14c9/public_url",
    pdfUrl: "/pdf/Information Technology Specialist in Network Security.pdf",
    category: "Networking & Security",
    icon: TbShield,
    iconUrl: "https://images.credly.com/images/fa85b446-fcbf-44c0-991f-064d37ae7a6f/ITS-Badges_Network-Security_1200px.png",
  },
  {
    title: "IT Specialist in Networking",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/76b92ed5-201f-46ce-80f0-44f081f96075/public_url",
    pdfUrl: "/pdf/Information Technology Specialist in Networking.pdf",
    category: "Networking & Security",
    icon: SiCisco,
    iconUrl: "https://images.credly.com/images/6713c2e4-0562-4a4f-ad1b-27a0069491d8/ITS-Badges_Networking_1200px.png",
  },


  // Databases
  {
    title: "IT Specialist in Databases",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/57314292-2da7-48c3-ac2f-92765a7b3a73/public_url",
    pdfUrl: "/pdf/Information Technology Specialist in Databases.pdf",
    category: "Databases",
    icon: VscTerminal,
    iconUrl: "https://images.credly.com/size/680x680/images/49a492cd-5f72-4c9d-aafa-06649e4853fb/MicrosoftTeams-image__5_.png",
  },

  // Web Development
  {
    title: "IT Specialist in HTML and CSS",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/c8b83b2b-e914-4e90-82e0-4f6745b764d9/public_url",
    pdfUrl: "/pdf/Information Technology Specialist in HTML and CSS.pdf",
    category: "Web Development",
    icon: TbWorldCode,
    iconUrl: "https://images.credly.com/size/680x680/images/e2dc688d-de61-44a5-81af-ee96f117a211/ITS-Badges_HTML-and-CSS_1200px.png",
  },
];

export const certificationCategories = [
  "Networking & Security",
  "Databases",
  "Web Development",
];
