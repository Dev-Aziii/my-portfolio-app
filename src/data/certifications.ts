import type { Certification } from "./types";
import { SiCisco } from "react-icons/si";
import { VscTerminal } from "react-icons/vsc";
import { TbShield, TbWorldCode } from "react-icons/tb";

export const certifications: Certification[] = [
  // Databases
  {
    title: "IT Specialist in Databases",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/57314292-2da7-48c3-ac2f-92765a7b3a73/public_url",
    category: "Databases",
    icon: VscTerminal,
    iconUrl: "https://images.credly.com/size/680x680/images/49a492cd-5f72-4c9d-aafa-06649e4853fb/MicrosoftTeams-image__5_.png",
  },

  // Networking & Security
  {
    title: "IT Specialist in Networking",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/76b92ed5-201f-46ce-80f0-44f081f96075/public_url",
    category: "Networking & Security",
    icon: SiCisco,
    iconUrl: "https://images.credly.com/images/6713c2e4-0562-4a4f-ad1b-27a0069491d8/ITS-Badges_Networking_1200px.png",
  },
  {
    title: "IT Specialist in Network Security",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/4aef257a-6820-45fb-a984-5d9dac9f14c9/public_url",
    category: "Networking & Security",
    icon: TbShield,
    iconUrl: "https://images.credly.com/images/fa85b446-fcbf-44c0-991f-064d37ae7a6f/ITS-Badges_Network-Security_1200px.png",
  },

  // Web Development
  {
    title: "IT Specialist in HTML and CSS",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/c8b83b2b-e914-4e90-82e0-4f6745b764d9/public_url",
    category: "Web Development",
    icon: TbWorldCode,
    iconUrl: "https://images.credly.com/size/680x680/images/e2dc688d-de61-44a5-81af-ee96f117a211/ITS-Badges_HTML-and-CSS_1200px.png",
  },

];

export const certificationCategories = [
  "Databases",
  "Networking & Security",
  "Web Development",
];
