import { describe, expect, it } from "vitest";
import { highlightCommand } from "./highlight";

describe("command highlighting", () => {
  it("preserves whitespace, quotes, escapes and token offsets", () => {
    const input = '  CD  "my projects" escaped\\ path ';
    const parts = highlightCommand(input);
    expect(parts.map((part) => part.text).join("")).toBe(input);
    expect(parts.filter((part) => part.kind !== "plain").map((part) => [part.text, part.kind])).toEqual([
      ["CD", "command"], ['"my projects"', "argument"], ["escaped\\ path", "argument"],
    ]);
    for (const part of parts) expect(input.slice(part.start, part.end)).toBe(part.text);
  });
  it.each(['echo "unfinished', "echo trailing\\", 'echo "<img src=x onerror=alert(1)>"', "echo <tag> | & $x`", "", "   "])("keeps incomplete or unsupported input literal: %s", (input) => {
    expect(highlightCommand(input).map((part) => part.text).join("")).toBe(input);
  });
});
