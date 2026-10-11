import { heroData, profileIntroduction, projects, techStack, experiences, certifications, socialLinks } from "@/data";
import { isValidHttpUrl } from "../utils";
import type { OutputEntry, PortfolioFilesystem } from "./types";

const text = (value: string): OutputEntry => ({ kind: "text", text: value });
const link = (label: string, href: string): OutputEntry => ({ kind: "link", text: label, href });

export function createFilesystem(): PortfolioFilesystem {
  const nodes: PortfolioFilesystem["nodes"] = {
    "/": { kind: "directory", route: "/", description: "Portfolio home" },
  };
  const links: PortfolioFilesystem["links"] = Object.create(null);
  const section = (name: string, route: string, description: string, content: OutputEntry[]) => {
    nodes[`/${name}`] = { kind: "directory", route, description };
    nodes[`/${name}/readme.txt`] = { kind: "file", content, description };
  };
  const profile = [text(`${heroData.name}\n${heroData.title}\n${heroData.location}\n\n${profileIntroduction}`)];
  const contacts = [link(heroData.email, `mailto:${heroData.email}`), ...socialLinks.map((item) => link(item.name, item.href)), link("Download CV", heroData.cvUrl)];
  section("about", "/#about", "Developer profile", profile);
  section("projects", "/projects", "Project catalog", projects.map((project) => text(`${project.title}${project.slug ? ` (${project.slug})` : ""}\n${project.description}`)));
  section("skills", "/tech-stack", "Technologies and skills", techStack.map((category) => text(`${category.name}\n${category.items.map((item) => `- ${item.name}`).join("\n")}`)));
  section("experience", "/experience", "Career, education and learning", experiences.map((entry) => text([
    `${entry.company} | ${entry.year}`, entry.title, entry.schedule, entry.location,
    ...entry.positions?.map((position) => `${position.title} | ${position.timeSpan}\n${Array.isArray(position.description) ? position.description.join("\n") : position.description ?? ""}\n${position.skills?.join(", ") ?? ""}`) ?? [],
  ].filter(Boolean).join("\n"))));
  section("certifications", "/certifications", "Verified certifications", certifications.flatMap((cert) => [text(`${cert.title} | ${cert.issuer} | ${cert.category}`), link("Verify badge", cert.href), ...(cert.pdfUrl ? [link("View certificate PDF", cert.pdfUrl)] : [])]));
  section("contact", "/#contact", "Contact and social links", contacts);
  nodes["/README.md"] = { kind: "file", description: "Welcome and navigation", content: [...profile, text("Explore about/, projects/, skills/, experience/, certifications/, contact/.\nType help for commands."), ...contacts] };
  for (const project of projects) {
    if (project.slug && project.details) {
      const path = `/projects/${project.slug}`;
      const details = project.details;
      nodes[path] = { kind: "directory", route: path, description: project.title };
      nodes[`${path}/readme.txt`] = { kind: "file", description: project.title, content: [
        text(`${project.title}\n${project.description}\n${project.badge}\n${details.techs.join(", ")}\n${[details.version, details.year].filter(Boolean).join(" | ")}`),
        ...[details.problem, details.solution, details.impact].map((item) => text(`${item.title}\n${item.description}`)),
        ...details.metrics?.map((metric) => text(`${metric.value} ${metric.label}${metric.comparison ? ` — ${metric.comparison}` : ""}`)) ?? [],
        ...details.highlights?.map((item) => text(item.label)) ?? [],
        ...(isValidHttpUrl(project.url) ? [link("Visit project", project.url)] : [text(project.url)]),
      ] };
    }
    if (isValidHttpUrl(project.url)) links[`${project.slug ?? project.title.toLowerCase()}-demo`] = { text: project.title, href: project.url };
  }
  links.email = { text: heroData.email, href: `mailto:${heroData.email}` };
  links.cv = { text: "Download CV", href: heroData.cvUrl };
  for (const item of socialLinks) links[item.name.toLowerCase()] = { text: item.name, href: item.href };
  for (const [index, cert] of certifications.entries()) {
    links[`certificate-${index + 1}`] = { text: cert.title, href: cert.href };
    if (cert.pdfUrl) links[`certificate-${index + 1}-pdf`] = { text: `${cert.title} PDF`, href: cert.pdfUrl };
  }
  return { nodes, links };
}

export function normalizePath(input: string, cwd: string): string {
  let path = input.trim();
  if (path === "~" || path === "~/portfolio" || path === "/portfolio") path = "/";
  else if (path.startsWith("~/portfolio/")) path = path.slice("~/portfolio".length);
  else if (path.startsWith("~/")) path = path.slice(1);
  const segments = (path.startsWith("/") ? path : `${cwd}/${path}`).split("/");
  const normalized: string[] = [];
  for (const part of segments) {
    if (!part || part === ".") continue;
    if (part === "..") normalized.pop(); else normalized.push(part);
  }
  return `/${normalized.join("/")}`;
}

export function formatDirectory(path: string): string { return `~/portfolio${path === "/" ? "" : path}`; }

export function childrenOf(path: string, filesystem: PortfolioFilesystem): Array<{ name: string; path: string; node: PortfolioFilesystem["nodes"][string] }> {
  const prefix = path === "/" ? "/" : `${path}/`;
  return Object.entries(filesystem.nodes).filter(([key]) => key.startsWith(prefix) && key !== path && !key.slice(prefix.length).includes("/"))
    .map(([key, node]) => ({ name: key.slice(prefix.length), path: key, node }));
}

export function directoryToRoute(path: string, filesystem: PortfolioFilesystem): string | null {
  const node = filesystem.nodes[path];
  return node?.kind === "directory" ? node.route : null;
}

export function routeToDirectory(pathname: string, hash: string, filesystem: PortfolioFilesystem): string | null {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const route = normalized === "/" && ["#about", "#contact"].includes(hash) ? `/${hash}` : normalized;
  return Object.entries(filesystem.nodes).find(([, node]) => node.kind === "directory" && node.route === route)?.[0] ?? null;
}
