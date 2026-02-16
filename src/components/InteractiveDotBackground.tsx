import { useEffect, useRef } from "react";

interface Dot {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  vScale: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseDotColor(value: string, fallback: [number, number, number]) {
  const parts = value
    .trim()
    .split(/[,\s]+/)
    .map((token) => Number(token))
    .filter((num) => Number.isFinite(num));

  if (parts.length < 3) {
    return fallback;
  }

  return [
    clamp(Math.round(parts[0]), 0, 255),
    clamp(Math.round(parts[1]), 0, 255),
    clamp(Math.round(parts[2]), 0, 255),
  ] as [number, number, number];
}

export default function InteractiveDotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let spacing = 45;
    let interactionRadius = spacing * 4.8;
    let pushStrength = spacing * 1.55;
    const scaleBoost = 0.42;
    const springStiffness = 18;
    const springDamping = 10;
    let baseDotRadius = 0.9;
    const dotColor = { r: 113, g: 113, b: 122, alpha: 0.06 };
    let fillStyle = "rgba(113, 113, 122, 0.06)";
    let animationFrameId = 0;
    let lastTime = performance.now();
    let prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    const scrollState = {
      targetY: window.scrollY,
      smoothedY: window.scrollY,
    };

    const updateFillStyle = () => {
      const styles = getComputedStyle(document.documentElement);
      const [r, g, b] = parseDotColor(styles.getPropertyValue("--dot-rgb"), [
        113, 113, 122,
      ]);
      const alphaRaw = Number.parseFloat(
        styles.getPropertyValue("--dot-alpha").trim(),
      );
      const alpha = Number.isFinite(alphaRaw) ? clamp(alphaRaw, 0, 1) : 0.06;
      dotColor.r = r;
      dotColor.g = g;
      dotColor.b = b;
      dotColor.alpha = alpha;
      fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const createGrid = () => {
      const targetDots = window.innerWidth < 768 ? 300 : 600;
      spacing = clamp(Math.sqrt((width * height) / targetDots), 45, 75);
      interactionRadius = spacing * 4.8;
      pushStrength = spacing * 1.55;
      baseDotRadius = window.innerWidth < 768 ? 0.75 : 0.9;

      const columns = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const xOffset = (width - (columns - 1) * spacing) / 2;
      const yOffset = (height - (rows - 1) * spacing) / 2;
      const nextDots: Dot[] = [];

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns; col += 1) {
          const homeX = xOffset + col * spacing;
          const homeY = yOffset + row * spacing;
          nextDots.push({
            homeX,
            homeY,
            x: homeX,
            y: homeY,
            vx: 0,
            vy: 0,
            scale: 1,
            vScale: 0,
          });
        }
      }

      dots = nextDots;
    };

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      createGrid();
    };

    const drawDots = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = fillStyle;

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        const depth = dot.homeY / Math.max(height, 1) - 0.5;
        const parallaxY = prefersReducedMotion
          ? 0
          : scrollState.smoothedY * 0.03 * depth;
        const radius = baseDotRadius * dot.scale;

        context.beginPath();
        context.arc(dot.x, dot.y + parallaxY, radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const tick = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 1 / 30);
      lastTime = time;

      const scrollLerp = 1 - Math.exp(-8 * dt);
      scrollState.smoothedY +=
        (scrollState.targetY - scrollState.smoothedY) * scrollLerp;

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        let targetX = dot.homeX;
        let targetY = dot.homeY;
        let targetScale = 1;

        if (pointer.active) {
          const dx = dot.homeX - pointer.x;
          const dy = dot.homeY - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < interactionRadius) {
            const t = 1 - distance / interactionRadius;
            const falloff = t * t * (3 - 2 * t);
            const offset = pushStrength * falloff;
            const ux = distance > 0.0001 ? dx / distance : 1;
            const uy = distance > 0.0001 ? dy / distance : 0;

            targetX += ux * offset;
            targetY += uy * offset;
            targetScale += scaleBoost * falloff;
          }
        }

        const ax = (targetX - dot.x) * springStiffness - dot.vx * springDamping;
        const ay = (targetY - dot.y) * springStiffness - dot.vy * springDamping;
        const as =
          (targetScale - dot.scale) * springStiffness -
          dot.vScale * springDamping;

        dot.vx += ax * dt;
        dot.vy += ay * dt;
        dot.vScale += as * dt;

        dot.x += dot.vx * dt;
        dot.y += dot.vy * dt;
        dot.scale += dot.vScale * dt;
      }

      drawDots();
      animationFrameId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    const startLoop = () => {
      if (animationFrameId !== 0) {
        return;
      }
      lastTime = performance.now();
      animationFrameId = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onPointerDown = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onPointerInactive = () => {
      pointer.active = false;
    };

    const supportsPointerEvents = "PointerEvent" in window;
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      pointer.x = touch.clientX;
      pointer.y = touch.clientY;
      pointer.active = true;
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      pointer.x = touch.clientX;
      pointer.y = touch.clientY;
      pointer.active = true;
    };

    const onMouseMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onScroll = () => {
      scrollState.targetY = window.scrollY;
    };

    const onResize = () => {
      setupCanvas();
      if (prefersReducedMotion) {
        drawDots();
      }
    };

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      pointer.active = false;
      scrollState.targetY = window.scrollY;
      scrollState.smoothedY = scrollState.targetY;

      if (prefersReducedMotion) {
        stopLoop();
        drawDots();
      } else {
        startLoop();
      }
    };

    const observer = new MutationObserver(() => {
      updateFillStyle();
      if (prefersReducedMotion) {
        drawDots();
      }
    });

    setupCanvas();
    updateFillStyle();

    if (supportsPointerEvents) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerInactive, { passive: true });
      window.addEventListener("pointercancel", onPointerInactive, {
        passive: true,
      });
      window.addEventListener("pointerleave", onPointerInactive, {
        passive: true,
      });
    } else {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onPointerInactive, { passive: true });
      window.addEventListener("touchcancel", onPointerInactive, {
        passive: true,
      });
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseup", onPointerInactive, { passive: true });
      window.addEventListener("mouseleave", onPointerInactive, {
        passive: true,
      });
    }

    window.addEventListener("blur", onPointerInactive, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (prefersReducedMotion) {
      drawDots();
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      observer.disconnect();
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", onPointerInactive);

      if (supportsPointerEvents) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerInactive);
        window.removeEventListener("pointercancel", onPointerInactive);
        window.removeEventListener("pointerleave", onPointerInactive);
      } else {
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onPointerInactive);
        window.removeEventListener("touchcancel", onPointerInactive);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onPointerInactive);
        window.removeEventListener("mouseleave", onPointerInactive);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-bg" aria-hidden="true" />;
}