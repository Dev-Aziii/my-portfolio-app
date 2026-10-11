import type { CommandResult } from "./types";

export interface TranscriptEntry { command: string; directory: string; output: CommandResult["output"] }
export interface TerminalSession { input: string; history: string[]; entries: TranscriptEntry[] }
export function initialSession(): TerminalSession { return { input: "", history: [], entries: [] }; }
export function appendCommand(session: TerminalSession, command: string, directory: string, result: CommandResult): TerminalSession {
  return {
    input: "",
    history: [...session.history, command],
    entries: result.clear ? [] : [...session.entries, { command, directory, output: result.output }],
  };
}
