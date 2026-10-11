import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePortfolioPreferences } from "@/components/PortfolioPreferences";
import { executeCommand } from "@/lib/terminal/commands";
import { applyCompletion, getCompletions, type Completion } from "@/lib/terminal/autocomplete";
import { formatDirectory, routeToDirectory } from "@/lib/terminal/filesystem";
import { appendCommand } from "@/lib/terminal/session";
import { highlightCommand } from "@/lib/terminal/highlight";
import type { OutputEntry } from "@/lib/terminal/types";
import { useTerminalState } from "./TerminalState";

function Output({ entry }: { entry: OutputEntry }) {
  if (entry.kind === "link" && entry.href) {
    return <div className="terminal-output-line">{entry.href.startsWith("/") && !/\.[a-z0-9]+$/i.test(entry.href) ? <Link to={entry.href}>[ {entry.text} ]</Link> : <a href={entry.href} target={entry.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer">[ {entry.text} ]</a>}</div>;
  }
  return <pre className={`terminal-output-line${entry.kind === "error" ? " terminal-output-error" : ""}`}>{entry.kind === "error" ? "error: " : ""}{entry.text}</pre>;
}

function CommandText({ text }: { text: string }) {
  return <>{highlightCommand(text).map((part) => <span key={part.start} className={`terminal-token-${part.kind}`}>{part.text}</span>)}</>;
}

export default function TerminalConsole({ inputRef, onClose }: { inputRef: RefObject<HTMLInputElement | null>; onClose: () => void }) {
  const { filesystem, session, setSession, panelOpen } = useTerminalState();
  const { setMode, theme, resolvedTheme } = usePortfolioPreferences();
  const location = useLocation();
  const navigate = useNavigate();
  const cwd = routeToDirectory(location.pathname, location.hash, filesystem) ?? "/";
  const directory = formatDirectory(cwd);
  const [selected, setSelected] = useState(-1);
  const [dismissed, setDismissed] = useState<string | null>(null);
  const [cursor, setCursor] = useState(session.input.length);
  const [focused, setFocused] = useState(false);
  const historyIndex = useRef<number | null>(null);
  const draft = useRef("");
  const transcriptRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLFormElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const followOutput = useRef(true);
  const [popup, setPopup] = useState<{ left: number; width: number; bottom: number; maxHeight: number } | null>(null);
  const focusAfterNavigation = useRef(false);
  const composing = useRef(false);
  const completionCaret = useRef<number | null>(null);
  const listId = useId();
  const hintId = useId();
  const completions = useMemo(() => getCompletions(session.input, cwd, filesystem, cursor), [session.input, cwd, filesystem, cursor]);
  const wantsSuggestions = panelOpen && focused && dismissed !== session.input && completions.length > 0;
  const visible = wantsSuggestions && popup !== null;
  const active = visible && selected >= 0 && selected < completions.length ? selected : -1;
  useLayoutEffect(() => {
    if (completionCaret.current === null) return;
    inputRef.current?.setSelectionRange(completionCaret.current, completionCaret.current);
    completionCaret.current = null;
  });

  useEffect(() => {
    if (active >= 0) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [active, listId]);

  useLayoutEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript && followOutput.current) transcript.scrollTop = transcript.scrollHeight;
  }, [session.entries]);
  useEffect(() => {
    const transcript = transcriptRef.current;
    if (!transcript) return;
    const observer = new ResizeObserver(() => {
      if (followOutput.current) transcript.scrollTop = transcript.scrollHeight;
    });
    observer.observe(transcript);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const input = inputRef.current;
    const sync = () => { if (input && mirrorRef.current) mirrorRef.current.scrollLeft = input.scrollLeft; };
    const frame = requestAnimationFrame(sync);
    input?.addEventListener("scroll", sync);
    return () => { cancelAnimationFrame(frame); input?.removeEventListener("scroll", sync); };
  }, [session.input, cursor, focused, inputRef]);
  useLayoutEffect(() => {
    if (!wantsSuggestions) return;
    const prompt = promptRef.current, transcript = transcriptRef.current;
    if (!prompt || !transcript) return;
    const position = () => {
      const rect = prompt.getBoundingClientRect(), viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const maxHeight = Math.min(260, (viewport?.height ?? innerHeight) * .4, rect.top - viewportTop - 8);
      const transcriptRect = transcript.getBoundingClientRect();
      setPopup(rect.top < transcriptRect.top || rect.bottom > transcriptRect.bottom + 2 || maxHeight < 44 ? null : {
        left: rect.left, width: rect.width, bottom: innerHeight - rect.top + 4, maxHeight,
      });
    };
    const observer = new ResizeObserver(position);
    observer.observe(prompt); observer.observe(transcript);
    if (transcript.closest("#terminal-console")) observer.observe(transcript.closest("#terminal-console")!);
    transcript.addEventListener("scroll", position);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position);
    window.visualViewport?.addEventListener("resize", position);
    window.visualViewport?.addEventListener("scroll", position);
    position();
    return () => {
      observer.disconnect(); transcript.removeEventListener("scroll", position);
      window.removeEventListener("resize", position); window.removeEventListener("scroll", position);
      window.visualViewport?.removeEventListener("resize", position); window.visualViewport?.removeEventListener("scroll", position);
    };
  }, [wantsSuggestions, session.input, session.entries]);
  useEffect(() => {
    if (!focusAfterNavigation.current) return;
    focusAfterNavigation.current = false;
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
      const transcript = transcriptRef.current;
      if (transcript) transcript.scrollTop = transcript.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, inputRef]);

  const updateInput = (input: string, nextCursor = input.length, showSuggestions = true) => {
    setSession((previous) => ({ ...previous, input }));
    setCursor(nextCursor);
    setSelected(-1);
    setDismissed(showSuggestions ? null : input);
  };
  const accept = (completion: Completion) => {
    const next = applyCompletion(session.input, completion);
    const nextCursor = completion.start + (next.length - session.input.length) + (completion.end - completion.start);
    completionCaret.current = nextCursor;
    updateInput(next, nextCursor, false);
    historyIndex.current = null;
    inputRef.current?.focus({ preventScroll: true });
  };
  const submit = () => {
    if (composing.current) return;
    const command = session.input.trim();
    if (!command) return;
    const result = executeCommand(command, { cwd, filesystem, history: [...session.history, command], theme, resolvedTheme, now: new Date() });
    setSession((previous) => appendCommand(previous, command, directory, result));
    historyIndex.current = null;
    draft.current = "";
    setCursor(0);
    setSelected(-1);
    setDismissed(null);
    inputRef.current?.focus({ preventScroll: true });
    if (result.navigate) { focusAfterNavigation.current = true; navigate(result.navigate); }
    if (result.presentation) setMode(result.presentation);
  };
  const browseHistory = (direction: -1 | 1) => {
    if (!session.history.length) return;
    if (historyIndex.current === null) { draft.current = session.input; historyIndex.current = session.history.length; }
    const next = Math.max(0, Math.min(session.history.length, historyIndex.current + direction));
    historyIndex.current = next;
    updateInput(next === session.history.length ? draft.current : session.history[next], undefined, false);
  };
  const focusPrompt = () => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
    inputRef.current?.focus({ preventScroll: true });
  };

  return <div className="terminal-console-body">
    <div ref={transcriptRef} className="terminal-transcript" tabIndex={0} aria-label="Terminal transcript"
      onScroll={(event) => { const element = event.currentTarget; followOutput.current = element.scrollHeight - element.scrollTop - element.clientHeight < 32; }}
      onClick={(event) => {
        if (window.getSelection()?.isCollapsed === false || !(event.target instanceof HTMLElement) || event.target.closest("a, button, input, pre, .terminal-submitted-command, .terminal-output-line")) return;
        focusPrompt();
      }}>
    <div data-terminal-output role="log" aria-label="Terminal output" aria-live="polite" aria-relevant="additions">
      {session.entries.map((entry, index) => <div className="terminal-transcript-entry" key={index}>
        <p className="terminal-submitted-command"><span className="terminal-muted">visitor@azi:{entry.directory}$</span> <CommandText text={entry.command} /></p>
        {entry.output.map((line, lineIndex) => <Output key={lineIndex} entry={line} />)}
      </div>)}
    </div>
    <form ref={promptRef} className="terminal-command-form" onSubmit={(event) => { event.preventDefault(); submit(); }}>
        {visible && popup && createPortal(<div id={listId} role="listbox" aria-label="Command suggestions" className="terminal-suggestions" style={popup}>
          {completions.map((item, index) => <div role="option" id={`${listId}-${index}`} aria-selected={active === index} key={item.value} className="terminal-suggestion" onPointerDown={(event) => { event.preventDefault(); accept(item); }}>
            <span>{item.value}</span><span>{item.description}</span>
          </div>)}
        </div>, document.body)}
        <div className="terminal-prompt-line">
          <label htmlFor={`${listId}-input`} className="terminal-prompt" title={`visitor@azi:${directory}$`}>visitor@azi:{directory}$</label>
          <div className="terminal-live-command">
          <div ref={mirrorRef} className="terminal-command-mirror" aria-hidden="true"><CommandText text={session.input} /></div>
          <input ref={inputRef} id={`${listId}-input`} type="text" role="combobox" aria-label="Terminal command" aria-autocomplete="list" aria-expanded={visible && !!popup} aria-controls={visible && popup ? listId : undefined} aria-activedescendant={active >= 0 && popup ? `${listId}-${active}` : undefined} aria-describedby={hintId}
            value={session.input} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="go" placeholder="Type help…"
            onFocus={() => { setFocused(true); const transcript = transcriptRef.current; if (transcript) transcript.scrollTop = transcript.scrollHeight; }} onBlur={() => setFocused(false)}
            onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }}
            onSelect={(event) => setCursor(event.currentTarget.selectionStart ?? session.input.length)}
            onChange={(event) => { historyIndex.current = null; updateInput(event.target.value, event.target.selectionStart ?? event.target.value.length); }}
            onKeyDown={(event) => {
              if (composing.current || event.nativeEvent.isComposing || event.keyCode === 229) { if (event.key === "Enter") event.preventDefault(); if (event.key === "Escape") event.stopPropagation(); return; }
              if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); if (visible) { setDismissed(session.input); setSelected(-1); } else onClose(); }
              else if (event.key === "Tab" && visible && !event.shiftKey) {
                event.preventDefault();
                if (completions.length === 1 || active >= 0) accept(completions[active >= 0 ? active : 0]); else setSelected(0);
              } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                if (visible) setSelected((previous) => event.key === "ArrowDown" ? (previous + 1) % completions.length : previous <= 0 ? completions.length - 1 : previous - 1);
                else browseHistory(event.key === "ArrowUp" ? -1 : 1);
              } else if (event.key === "Enter") {
                event.preventDefault();
                if (active >= 0) accept(completions[active]); else submit();
              }
            }} />
          </div>
          <button type="submit" aria-label="Run command">[ ↵ ]</button>
        </div>
      <p id={hintId} className="sr-only">Tab completes · ↑↓ suggestions/history · Enter accepts selected suggestion or runs command · Esc dismisses</p>
      <span className="sr-only" role="status" aria-live="polite">{visible ? `${completions.length} suggestions. Use arrow keys to select, Enter to accept, or Escape to dismiss.` : ""}</span>
    </form>
    </div>
  </div>;
}
