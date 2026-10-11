import type { Theme, ResolvedTheme } from "../theme";
import { parseCommand } from "./parser";
import { childrenOf, directoryToRoute, formatDirectory, normalizePath, routeToDirectory } from "./filesystem";
import type { CommandResult, PortfolioFilesystem } from "./types";

export interface CommandContext {
  cwd: string;
  filesystem: PortfolioFilesystem;
  history: string[];
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  now: Date;
}
interface CommandDefinition {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  min: number;
  max: number;
  completion?: "directories" | "paths" | "targets";
  execute(args: string[], context: CommandContext): CommandResult;
}
const message = (text: string): CommandResult => ({ output: [{ kind: "text", text }] });
const error = (text: string): CommandResult => ({ output: [{ kind: "error", text }] });
const readFile = (path: string, context: CommandContext): CommandResult => {
  const node = context.filesystem.nodes[path];
  return node?.kind === "file" ? { output: node.content } : error(node ? `${path}: is a directory. Try ls.` : `${path}: no such file.`);
};
const sectionCommand = (name: string, description: string): CommandDefinition => ({ name, description, usage: name, min: 0, max: 0, execute: (_args, context) => readFile(`/${name}/readme.txt`, context) });

export const commandDefinitions: CommandDefinition[] = [
  { name: "help", aliases: ["?"], description: "List commands and usage", usage: "help [command]", min: 0, max: 1,
    execute: (args) => {
      const command = args[0] ? findCommand(args[0]) : null;
      return args[0] ? command ? message(`${command.usage}\n${command.description}`) : error(`Unknown command: ${args[0]}`)
        : message(commandDefinitions.map((item) => `${item.usage.padEnd(24)} ${item.description}`).join("\n"));
    } },
  { name: "pwd", description: "Print working directory", usage: "pwd", min: 0, max: 0, execute: (_args, context) => message(formatDirectory(context.cwd)) },
  { name: "ls", aliases: ["dir"], description: "List files and directories", usage: "ls [path]", min: 0, max: 1, completion: "paths",
    execute: (args, context) => {
      const path = normalizePath(args[0] ?? ".", context.cwd), node = context.filesystem.nodes[path];
      if (!node) return error(`${path}: no such file or directory.`);
      return message(node.kind === "file" ? path.split("/").pop()! : childrenOf(path, context.filesystem).map((child) => `${child.name}${child.node.kind === "directory" ? "/" : ""}`).join("  "));
    } },
  { name: "cd", description: "Navigate the portfolio", usage: "cd [path]", min: 0, max: 1, completion: "directories",
    execute: (args, context) => {
      const path = normalizePath(args[0] ?? "~", context.cwd), route = directoryToRoute(path, context.filesystem);
      return route === null ? error(`${path}: ${context.filesystem.nodes[path] ? "not a directory" : "no such directory"}.`) : { output: [], navigate: route };
    } },
  { name: "cat", description: "Read a portfolio text file", usage: "cat <file>", min: 1, max: 1, completion: "paths", execute: (args, context) => readFile(normalizePath(args[0], context.cwd), context) },
  { name: "whoami", description: "Display developer identity", usage: "whoami", min: 0, max: 0, execute: (_args, context) => readFile("/about/readme.txt", context) },
  sectionCommand("about", "Read developer profile"), sectionCommand("projects", "List real projects"), sectionCommand("skills", "List technologies and skills"),
  sectionCommand("experience", "Read career and education"), sectionCommand("certifications", "List certifications and links"), sectionCommand("contact", "Show contact and social links"),
  { name: "open", description: "Open a section, project, or approved link", usage: "open <target>", min: 1, max: 1, completion: "targets",
    execute: (args, context) => {
      const target = args[0];
      const routePath = target.split("#");
      const routeDirectory = target.startsWith("/") ? routeToDirectory(routePath[0], routePath[1] ? `#${routePath[1]}` : "", context.filesystem) : null;
      const projectPath = `/projects/${target}`;
      const sectionPath = `/${target}`;
      const path = routeDirectory ?? (context.filesystem.nodes[projectPath]?.kind === "directory" ? projectPath : context.filesystem.nodes[sectionPath]?.kind === "directory" ? sectionPath : normalizePath(target, context.cwd));
      const route = directoryToRoute(path, context.filesystem);
      if (route !== null) return { output: [], navigate: route };
      const approved = context.filesystem.links[target.toLowerCase()] ?? Object.values(context.filesystem.links).find((item) => item.href === target);
      return approved ? { output: [{ kind: "link", ...approved }] } : error(`Unknown target: ${target}. Use a section, project slug, or approved portfolio link (github, linkedin, email, cv).`);
    } },
  { name: "clear", aliases: ["cls"], description: "Clear output; retain history", usage: "clear", min: 0, max: 0, execute: () => ({ output: [], clear: true }) },
  { name: "history", description: "List submitted commands", usage: "history", min: 0, max: 0, execute: (_args, context) => message(context.history.map((item, index) => `${index + 1}  ${item}`).join("\n")) },
  { name: "echo", description: "Print literal text safely", usage: "echo [text]", min: 0, max: Infinity, execute: (args) => message(args.join(" ")) },
  { name: "date", description: "Show browser-local date and time", usage: "date", min: 0, max: 0, execute: (_args, context) => message(context.now.toLocaleString()) },
  { name: "theme", description: "Show presentation and theme preferences", usage: "theme", min: 0, max: 0, execute: (_args, context) => message(`Presentation: terminal (monochrome)\nDashboard theme: ${context.theme}\nResolved dashboard theme: ${context.resolvedTheme}\nUse the dashboard theme selector to change your preference; exit returns to dashboard.`) },
  { name: "exit", description: "Return to dashboard at the current route", usage: "exit", min: 0, max: 0, execute: () => ({ output: [], presentation: "dashboard" }) },
];

export function findCommand(name: string): CommandDefinition | undefined {
  const normalized = name.toLowerCase();
  return commandDefinitions.find((item) => item.name === normalized || item.aliases?.includes(normalized));
}

export function executeCommand(input: string, context: CommandContext): CommandResult {
  try {
    const parsed = parseCommand(input);
    if (!parsed.command) return { output: [] };
    const definition = findCommand(parsed.command);
    if (!definition) return error(`Command not found: ${parsed.command}. Type help to see available commands.`);
    if (parsed.args.length < definition.min || parsed.args.length > definition.max) return error(`Usage: ${definition.usage}`);
    return definition.execute(parsed.args, context);
  } catch (cause) { return error(cause instanceof Error ? cause.message : "Could not process command."); }
}
