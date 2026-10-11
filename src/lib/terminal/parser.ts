export interface CommandToken { value: string; start: number; end: number }

/** A small tokenizer, not a shell: no expansions, operators, or executable syntax. */
export function tokenize(input: string, partial = false): CommandToken[] {
  const tokens: CommandToken[] = [];
  let value = "", start = -1, quote = "", escaped = false;
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (escaped) { value += char; escaped = false; continue; }
    if (char === "\\") { if (start < 0) start = index; escaped = true; continue; }
    if (quote) { if (char === quote) quote = ""; else value += char; continue; }
    if (char === '"' || char === "'") { if (start < 0) start = index; quote = char; continue; }
    if (/\s/.test(char)) {
      if (start >= 0) { tokens.push({ value, start, end: index }); value = ""; start = -1; }
      continue;
    }
    if (/[|;&<>$`]/.test(char)) throw new Error("Shell operators and expansions are not supported. Quote literal text.");
    if (start < 0) start = index;
    value += char;
  }
  if (!partial && (quote || escaped)) throw new Error(quote ? "Unclosed quote. Close the quoted argument before submitting." : "Incomplete escape at end of command.");
  if (start >= 0) tokens.push({ value, start, end: input.length });
  return tokens;
}

export function parseCommand(input: string): { command: string; args: string[] } {
  const tokens = tokenize(input);
  return { command: tokens[0]?.value.toLowerCase() ?? "", args: tokens.slice(1).map((token) => token.value) };
}
