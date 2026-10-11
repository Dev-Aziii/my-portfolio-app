import { describe, expect, it } from "vitest";
import { parseCommand } from "./parser";
import { createFilesystem, normalizePath, directoryToRoute, routeToDirectory } from "./filesystem";
import { executeCommand, commandDefinitions } from "./commands";
import { getCompletions, applyCompletion } from "./autocomplete";
import { appendCommand, initialSession } from "./session";

const filesystem = createFilesystem();
const context = { cwd: "/", filesystem, history: ["pwd", "ls"], theme: "light" as const, resolvedTheme: "light" as const, now: new Date(2026, 9, 11, 13, 14) };
const run = (input: string, cwd = "/") => executeCommand(input, { ...context, cwd });
const output = (input: string, cwd = "/") => run(input, cwd).output.map((entry) => entry.text).join("\n");

describe("command parser", () => {
  it("normalizes commands but retains argument casing, spaces and escaped quotes", () => {
    expect(parseCommand('  EcHo "Hello world" \'Azi\' escaped\\ space \\"quote\\"')).toEqual({ command: "echo", args: ["Hello world", "Azi", "escaped space", '"quote"'] });
    expect(parseCommand(" \t ")).toEqual({ command: "", args: [] });
  });
  it("rejects incomplete input and shell execution syntax", () => {
    for (const input of ['cat "unfinished', "echo test\\", "pwd; ls", "ls | cat", "echo $(pwd)", "echo `pwd`"]) {
      expect(() => parseCommand(input)).toThrow();
    }
    expect(parseCommand('echo "<script>alert(1)</script>"').args).toEqual(["<script>alert(1)</script>"]);
  });
});

describe("portfolio filesystem and router", () => {
  it.each([
    ["projects/elecsys", "/", "/projects/elecsys"], ["../teza", "/projects/elecsys", "/projects/teza"],
    ["../../..", "/projects/elecsys", "/"], ["./readme.txt", "/about", "/about/readme.txt"],
    ["~/portfolio/projects", "/skills", "/projects"], ["~", "/contact", "/"], ["/", "/skills", "/"],
  ])("normalizes %s from %s", (input, cwd, expected) => expect(normalizePath(input, cwd)).toBe(expected));
  it("maps all supported routes and home hashes both ways", () => {
    for (const [directory, route] of [["/", "/"], ["/projects/elecsys", "/projects/elecsys"], ["/skills", "/tech-stack"], ["/about", "/#about"], ["/contact", "/#contact"], ["/experience", "/experience"], ["/certifications", "/certifications"]]) {
      expect(directoryToRoute(directory, filesystem)).toBe(route);
      const [pathname, hash] = route.split("#");
      expect(routeToDirectory(pathname, hash ? `#${hash}` : "", filesystem)).toBe(directory);
    }
    expect(routeToDirectory("/missing", "", filesystem)).toBeNull();
    expect(directoryToRoute("/projects/missing", filesystem)).toBeNull();
  });
  it("reads real projects and profile content", () => {
    expect(output("ls projects")).toContain("elecsys/");
    expect(output("ls projects")).toContain("teza/");
    expect(output("cat projects/elecsys/readme.txt")).toContain("ElecSys");
    expect(output("whoami")).toContain("Adzyl Hilary Jipos");
    expect(output("cat contact/readme.txt")).toContain("adzyl.jipos@gmail.com");
  });
});

describe("command interpreter", () => {
  it("offers every required command with help metadata", () => {
    for (const name of ["help", "pwd", "ls", "cd", "cat", "whoami", "about", "projects", "skills", "experience", "certifications", "contact", "open", "clear", "history", "echo", "date", "theme", "exit"]) {
      expect(commandDefinitions.find((entry) => entry.name === name)?.description).toBeTruthy();
      expect(output("help")).toContain(name);
    }
  });
  it("navigates only to real directories", () => {
    expect(run("CD projects").navigate).toBe("/projects");
    expect(run("cd elecsys", "/projects").navigate).toBe("/projects/elecsys");
    expect(run("cd ..", "/projects/elecsys").navigate).toBe("/projects");
    expect(run("cd contact").navigate).toBe("/#contact");
    expect(run("cd missing").navigate).toBeUndefined();
    expect(run("cd README.md").output[0].kind).toBe("error");
    expect(output("pwd", "/projects")).toBe("~/portfolio/projects");
  });
  it("reports usage and missing content without throwing", () => {
    for (const input of ["unknown", "cat", "cat missing", "ls missing", "cd a b", "pwd extra", "cat projects", "theme dark", "open javascript:alert(1)", "open https://example.com/", "open constructor", "open __proto__"]) {
      expect(run(input).output[0].kind).toBe("error");
    }
  });
  it("opens only portfolio destinations and links", () => {
    expect(run("open teza").navigate).toBe("/projects/teza");
    expect(run("open /tech-stack").navigate).toBe("/tech-stack");
    expect(run("open github").output[0].href).toBe("https://github.com/Dev-Aziii");
    expect(run("open https://teza-v1.vercel.app/").output[0].href).toBe("https://teza-v1.vercel.app/");
  });
  it("opens advertised section shortcuts from a nested project directory", () => {
    for (const [target, route] of [["skills", "/tech-stack"], ["contact", "/#contact"], ["about", "/#about"], ["projects", "/projects"], ["experience", "/experience"], ["certifications", "/certifications"]]) {
      expect(run(`open ${target}`, "/projects/teza").navigate).toBe(route);
    }
  });
  it("handles output, aliases, theme reporting and session actions", () => {
    expect(output('echo "<img onerror=alert(1)>"')).toBe("<img onerror=alert(1)>");
    expect(output("theme")).toContain("light");
    expect(output("date")).toBe(context.now.toLocaleString());
    expect(output("history")).toContain("1  pwd");
    expect(run("cls").clear).toBe(true);
    expect(run("exit").presentation).toBe("dashboard");
    expect(output("dir")).toContain("projects/");
    expect(output("?")).toContain("help");
  });
  it("clears output while retaining submitted commands and resets the draft", () => {
    const first = appendCommand({ ...initialSession(), input: "pwd" }, "pwd", "~/portfolio", run("pwd"));
    expect(first.history).toEqual(["pwd"]);
    expect(first.entries).toHaveLength(1);
    const cleared = appendCommand(first, "clear", "~/portfolio", run("clear"));
    expect(cleared.history).toEqual(["pwd", "clear"]);
    expect(cleared.entries).toEqual([]);
    expect(cleared.input).toBe("");
  });
});

describe("context-aware autocomplete", () => {
  it("suggests commands and valid files, directories and project slugs", () => {
    expect(getCompletions("pr", "/", filesystem).map((item) => item.value)).toContain("projects");
    expect(getCompletions("cd e", "/projects", filesystem).map((item) => item.value)).toEqual(["elecsys/"]);
    expect(getCompletions("cat r", "/about", filesystem).map((item) => item.value)).toEqual(["readme.txt"]);
    expect(getCompletions("cat projects/teza/r", "/", filesystem).map((item) => item.value)).toEqual(["projects/teza/readme.txt"]);
    expect(getCompletions("open te", "/", filesystem).map((item) => item.value)).toContain("teza");
    expect(getCompletions("cd missing/", "/", filesystem)).toEqual([]);
  });
  it("replaces only the token being completed and closes quotes consistently", () => {
    const item = getCompletions('cd "projects/el', "/", filesystem)[0];
    expect(applyCompletion('cd "projects/el', item)).toBe('cd "projects/elecsys/"');
    const lsItem = getCompletions("ls projects/el", "/", filesystem)[0];
    expect(applyCompletion("ls projects/el", lsItem)).toBe("ls projects/elecsys/");
  });
});
