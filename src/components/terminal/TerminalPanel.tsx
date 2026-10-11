import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { getPanelBounds, getPanelHeight, resizePanel, resizePanelWithKey } from "@/lib/terminal/panel";
import { useTerminalState } from "./TerminalState";
import TerminalConsole from "./TerminalConsole";

interface TerminalPanelProps {
  inputRef: RefObject<HTMLInputElement | null>;
  launcherRef: RefObject<HTMLButtonElement | null>;
  headerRef: RefObject<HTMLElement | null>;
}
interface Drag { pointerId: number; startY: number; startHeight: number; handle: HTMLElement; userSelect: string; priority: string }

export default function TerminalPanel({ inputRef, launcherRef, headerRef }: TerminalPanelProps) {
  const { panelOpen, setPanelOpen, preferredHeight, setPreferredHeight } = useTerminalState();
  const panelRef = useRef<HTMLElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const [present, setPresent] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.visualViewport?.height ?? window.innerHeight, bottom: 0, headerHeight: 0 }));
  const bounds = getPanelBounds(viewport.width, viewport.height, viewport.headerHeight);
  const height = getPanelHeight(preferredHeight, bounds);

  useEffect(() => {
    const measure = () => {
      const visible = window.visualViewport;
      setViewport({ width: window.innerWidth, height: visible?.height ?? window.innerHeight,
        bottom: Math.max(0, window.innerHeight - (visible?.height ?? window.innerHeight) - (visible?.offsetTop ?? 0)),
        headerHeight: headerRef.current?.getBoundingClientRect().height ?? 0 });
    };
    const observer = new ResizeObserver(measure);
    if (headerRef.current) observer.observe(headerRef.current);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); window.visualViewport?.removeEventListener("resize", measure); window.visualViewport?.removeEventListener("scroll", measure); };
  }, [headerRef]);

  const releaseDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (drag.handle.hasPointerCapture(drag.pointerId)) drag.handle.releasePointerCapture(drag.pointerId);
    if (drag.userSelect) document.body.style.setProperty("user-select", drag.userSelect, drag.priority);
    else document.body.style.removeProperty("user-select");
  }, []);
  const finishDrag = (event: PointerEvent<HTMLDivElement>) => { if (event.pointerId !== dragRef.current?.pointerId) return; releaseDrag(); setResizing(false); };
  useEffect(() => {
    const blur = () => { releaseDrag(); setResizing(false); };
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("blur", blur); releaseDrag(); };
  }, [releaseDrag]);
  useEffect(() => { if (!panelOpen) { releaseDrag(); setResizing(false); } }, [panelOpen, releaseDrag]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const from = animationRef.current ? getComputedStyle(panel).transform : panelOpen ? "translateY(100%)" : "translateY(0)";
    animationRef.current?.cancel();
    if (panelOpen) setPresent(true);
    const animation = panel.animate([{ transform: from }, { transform: panelOpen ? "translateY(0)" : "translateY(100%)" }], { duration: reduced.matches ? 0 : 180, easing: "ease-out", fill: "both" });
    animationRef.current = animation;
    let disposed = false;
    const finish = () => { if (reduced.matches) animation.finish(); };
    reduced.addEventListener("change", finish);
    void animation.finished.then(() => {
      if (disposed) return;
      if (!panelOpen) { setPresent(false); return; }
      // Opening focuses the prompt without overriding a user's intervening click elsewhere.
      if (document.activeElement === launcherRef.current || document.activeElement === document.body) inputRef.current?.focus({ preventScroll: true });
    }).catch(() => { /* superseded by a rapid toggle */ });
    return () => { disposed = true; reduced.removeEventListener("change", finish); };
  }, [panelOpen, inputRef, launcherRef]);
  useEffect(() => () => animationRef.current?.cancel(), []);
  const close = () => { releaseDrag(); setResizing(false); setPanelOpen(false); launcherRef.current?.focus({ preventScroll: true }); };

  return createPortal(<section ref={panelRef} id="terminal-console" className="terminal-panel terminal-console" data-open={panelOpen} data-resizing={resizing} data-compact={height < 160} hidden={!panelOpen && !present} inert={!panelOpen} aria-hidden={!panelOpen} aria-labelledby="terminal-console-title" style={{ height, bottom: viewport.bottom }}
    onKeyDown={(event) => { if (event.key === "Escape" && !event.nativeEvent.isComposing) { event.preventDefault(); close(); } }}>
    <div role="separator" aria-label="Resize terminal" aria-orientation="horizontal" aria-controls="terminal-console" aria-valuemin={Math.round(bounds.min)} aria-valuemax={Math.round(bounds.max)} aria-valuenow={Math.round(height)} aria-valuetext={`${Math.round(height)} pixels high`} aria-describedby="terminal-resize-hint" tabIndex={0} className="terminal-resize-handle"
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return;
        event.preventDefault();
        releaseDrag();
        dragRef.current = { pointerId: event.pointerId, startY: event.clientY, startHeight: height, handle: event.currentTarget, userSelect: document.body.style.getPropertyValue("user-select"), priority: document.body.style.getPropertyPriority("user-select") };
        document.body.style.setProperty("user-select", "none");
        if (event.currentTarget.hasPointerCapture(event.pointerId) || event.nativeEvent.isTrusted) event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.focus({ preventScroll: true });
        setResizing(true);
      }}
      onPointerMove={(event) => { const drag = dragRef.current; if (drag?.pointerId === event.pointerId) setPreferredHeight(resizePanel(drag.startHeight, drag.startY, event.clientY, bounds)); }}
      onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}
      onDoubleClick={() => setPreferredHeight(null)}
      onKeyDown={(event) => { const next = resizePanelWithKey(height, event.key, event.shiftKey, bounds); if (next !== null) { event.preventDefault(); setPreferredHeight(next); } }} />
    <p id="terminal-resize-hint" className="sr-only">Drag upward to expand. Use Up and Down to resize, Shift for larger steps, Home for minimum, End for maximum. Double-click to reset.</p>
    <div className="terminal-panel-heading"><h2 id="terminal-console-title">&gt; Interactive Terminal</h2><button type="button" aria-label="Close terminal" onClick={close}>[ Close ↓ ]</button></div>
    <TerminalConsole inputRef={inputRef} onClose={close} />
  </section>, document.body);
}
