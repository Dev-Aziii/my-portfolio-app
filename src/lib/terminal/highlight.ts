export interface HighlightPart { text: string; start: number; end: number; kind: "plain" | "command" | "argument" }
/** Highlight raw text, including drafts the interpreter would reject. Never execute or unescape it. */
export function highlightCommand(input: string): HighlightPart[] {
  const parts: HighlightPart[] = [];
  let index = 0, tokenCount = 0;
  while (index < input.length) {
    const start = index;
    const plain = /\s/.test(input[index]);
    if (plain) {
      while (index < input.length && /\s/.test(input[index])) index++;
    } else {
      let quote = "";
      while (index < input.length) {
        const char = input[index];
        if (char === "\\") { index = Math.min(input.length, index + 2); continue; }
        if (quote) { if (char === quote) quote = ""; }
        else if (char === '"' || char === "'") quote = char;
        else if (/\s/.test(char)) break;
        index++;
      }
    }
    parts.push({ text: input.slice(start, index), start, end: index, kind: plain ? "plain" : tokenCount++ === 0 ? "command" : "argument" });
  }
  return parts;
}
