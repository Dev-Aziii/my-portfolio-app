import { commandDefinitions, findCommand } from "./commands";
import { childrenOf, normalizePath } from "./filesystem";
import { tokenize } from "./parser";
import type { PortfolioFilesystem } from "./types";

export interface Completion { value: string; description: string; start: number; end: number; quote: string }

export function getCompletions(input: string, cwd: string, filesystem: PortfolioFilesystem, cursor = input.length): Completion[] {
  const before = input.slice(0, cursor);
  let tokens;
  try { tokens = tokenize(before, true); } catch { return []; }
  const last = tokens[tokens.length - 1];
  const trailingSpace = !last || last.end < before.length;
  const current = trailingSpace ? { value: "", start: cursor, end: cursor } : last;
  const quote = ["'", '"'].includes(input[current.start]) ? input[current.start] : "";
  // Complete through the end of the active token, while preserving subsequent arguments.
  let end = current.end;
  if (cursor < input.length) {
    try { end = tokenize(input, true).find((token) => token.start === current.start)?.end ?? end; } catch { /* retain safe prefix */ }
  }
  const make = (value: string, description: string): Completion => ({ value, description, start: current.start, end, quote });
  if (tokens.length === 0 || (tokens.length === 1 && !trailingSpace)) {
    if (!current.value) return [];
    return commandDefinitions.filter((item) => item.name.startsWith(current.value.toLowerCase())).map((item) => make(item.name, item.description));
  }
  const command = findCommand(tokens[0].value);
  if (!command?.completion || tokens.length > (trailingSpace ? 1 : 2)) return [];
  const value = current.value;
  if (command.completion === "targets") {
    const targets = [
      ...Object.entries(filesystem.nodes).filter(([, node]) => node.kind === "directory").map(([path, node]) => ({ value: path === "/" ? "/" : path.startsWith("/projects/") ? path.slice("/projects/".length) : path.slice(1), description: node.description })),
      ...Object.entries(filesystem.links).map(([name, item]) => ({ value: name, description: item.text })),
    ];
    const matches = targets.filter((item) => item.value.startsWith(value)).map((item) => make(item.value, item.description));
    if (!value.startsWith("/") && !value.startsWith("~")) return matches;
  }
  const slash = value.lastIndexOf("/");
  const prefix = slash < 0 ? "" : value.slice(0, slash + 1);
  const fragment = slash < 0 ? value : value.slice(slash + 1);
  const directory = normalizePath(prefix || ".", cwd);
  return childrenOf(directory, filesystem)
    .filter((item) => item.name.startsWith(fragment) && (command.completion !== "directories" || item.node.kind === "directory"))
    .map((item) => make(`${prefix}${item.name}${item.node.kind === "directory" ? "/" : ""}`, item.node.description));
}

export function applyCompletion(input: string, completion: Completion): string {
  const quote = completion.quote || (/\s/.test(completion.value) ? '"' : "");
  const value = quote ? `${quote}${completion.value.split("\\").join("\\\\").split(quote).join(`\\${quote}`)}${quote}` : completion.value;
  return input.slice(0, completion.start) + value + input.slice(completion.end);
}
