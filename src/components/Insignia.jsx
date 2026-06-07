import { useEffect, useRef } from "react";

// ─── INSIGNIA DE ORIÓN (SILABOS) ──────────────────────────────────────────
// Dos variantes portadas de la web SILABOS:
//   · InsigniaAnimada → "nacimiento estelar" una sola vez al cargar (cabecera).
//   · InsigniaStatic  → versión fija para usos pequeños (header de juego, etc.).
// Geometría idéntica a la de la web para coherencia exacta de marca.

// IDs únicos por instancia para que dos insignias en la misma página no
// colisionen en sus <defs>/gradientes.
let uid = 0;

export function InsigniaAnimada({ size = 96 }) {
  const svgRef = useRef(null);
  const ran = useRef(false);
  const pfx = useRef(`an${uid++}`).current; // prefijo único de IDs

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const svg = svgRef.current;
    if (!svg) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const STARS = [
      { id: `${pfx}-betelgeuse`, ox: 60, oy: 60 },
      { id: `${pfx}-bellatrix`, ox: -50, oy: 50 },
      { id: `${pfx}-mintaka`, ox: 35, oy: -45 },
      { id: `${pfx}-alnilam`, ox: -40, oy: -35 },
      { id: `${pfx}-alnitak`, ox: -35, oy: 40 },
      { id: `${pfx}-saiph`, ox: 55, oy: -50 },
      { id: `${pfx}-rigel`, ox: -55, oy: -40 },
    ];
    const LINES = Array.from({ length: 8 }, (_, i) => `${pfx}-l${i + 1}`);
    const FLASHES = Array.from({ length: 7 }, (_, i) => `${pfx}-fl${i + 1}`);
    const STAR_DUR = 900, STAR_DELAY = 200;
    const LINE_START = STARS.length * STAR_DELAY + STAR_DUR + 200;
    const LINE_DUR = 380, LINE_DELAY = 120;

    // Si el usuario prefiere menos movimiento, mostramos la insignia ya formada.
    if (reduce) {
      [...STARS.map((s) => s.id), ...LINES, `${pfx}-hb`, `${pfx}-hr`].forEach((id) => {
        const el = svg.getElementById(id);
        if (el) el.setAttribute("opacity", 1);
      });
      return;
    }

    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function animate({ duration, delay = 0, onProgress, onDone }) {
      const start = performance.now() + delay;
      function f(now) {
        const elapsed = now - start;
        if (elapsed < 0) { requestAnimationFrame(f); return; }
        const t = Math.min(1, elapsed / duration);
        onProgress(t);
        if (t < 1) requestAnimationFrame(f);
        else if (onDone) onDone();
      }
      requestAnimationFrame(f);
    }
    function fadeIn(el, dur, delay) {
      if (!el) return;
      animate({ duration: dur, delay, onProgress(t) { el.setAttribute("opacity", easeOut(t)); } });
    }
    function animateFlash(el) {
      if (!el) return;
      animate({
        duration: 550,
        onProgress(t) {
          el.setAttribute("r", easeOut(t) * 26);
          el.setAttribute("opacity", t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85);
        },
        onDone() { el.setAttribute("opacity", 0); },
      });
    }

    STARS.forEach((s, i) => {
      const el = svg.getElementById(s.id);
      if (!el) return;
      const flashEl = svg.getElementById(FLASHES[i]);
      const finalX = parseFloat(el.getAttribute("data-fx") || 0);
      const finalY = parseFloat(el.getAttribute("data-fy") || 0);
      const cx = (finalX + s.ox + finalX) / 2 + (finalY - s.oy) * 0.3;
      const cy = (finalY + s.oy + finalY) / 2 + (s.ox - finalX) * 0.3;
      animate({
        duration: STAR_DUR, delay: i * STAR_DELAY,
        onProgress(t) {
          const et = ease(t);
          const bx = (1 - et) * (1 - et) * s.ox + 2 * (1 - et) * et * (cx - finalX);
          const by = (1 - et) * (1 - et) * s.oy + 2 * (1 - et) * et * (cy - finalY);
          el.setAttribute("opacity", Math.min(1, t * 3));
          el.setAttribute("transform", `translate(${bx},${by}) scale(${0.05 + 0.95 * et})`);
        },
        onDone() {
          el.removeAttribute("transform");
          el.setAttribute("opacity", 1);
          if (flashEl) animateFlash(flashEl);
          if (i === 0) setTimeout(() => fadeIn(svg.getElementById(`${pfx}-hb`), 600, 0), 100);
          if (i === 6) setTimeout(() => fadeIn(svg.getElementById(`${pfx}-hr`), 600, 0), 100);
        },
      });
    });

    LINES.forEach((id, li) => {
      const el = svg.getElementById(id);
      if (!el) return;
      if (li === 7) {
        animate({ duration: LINE_DUR, delay: LINE_START + li * LINE_DELAY, onProgress(t) { el.setAttribute("opacity", easeOut(t)); } });
      } else {
        const len = Math.hypot(el.x2.baseVal.value - el.x1.baseVal.value, el.y2.baseVal.value - el.y1.baseVal.value);
        el.setAttribute("opacity", 1);
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
        animate({ duration: LINE_DUR, delay: LINE_START + li * LINE_DELAY, onProgress(t) { el.style.strokeDashoffset = len * (1 - easeOut(t)); } });
      }
    });
  }, [pfx]);

  return (
    <svg ref={svgRef} viewBox="-24 -24 173 173" width={size} height={size} style={{ display: "block" }}>
      <defs>
        <radialGradient id={`${pfx}-gb`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FF2DA6" /><stop offset="100%" stopColor="#A855F7" />
        </radialGradient>
        <radialGradient id={`${pfx}-gr`} cx="35%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" /><stop offset="50%" stopColor="#00C8FF" /><stop offset="100%" stopColor="#A855F7" />
        </radialGradient>
        <radialGradient id={`${pfx}-hbg`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF2DA6" stopOpacity="0.35" /><stop offset="100%" stopColor="#FF2DA6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${pfx}-hrg`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.4" /><stop offset="100%" stopColor="#00C8FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${pfx}-flash`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" /><stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
        </radialGradient>
        <filter id={`${pfx}-glow`}>
          <feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${pfx}-glow-sm`}>
          <feGaussianBlur stdDeviation="1" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle id={`${pfx}-hb`} cx="24" cy="14" r="22" fill={`url(#${pfx}-hbg)`} opacity="0" />
      <circle id={`${pfx}-hr`} cx="100" cy="100" r="22" fill={`url(#${pfx}-hrg)`} opacity="0" />
      <line id={`${pfx}-l1`} x1="24" y1="14" x2="88" y2="26" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" opacity="0" />
      <line id={`${pfx}-l2`} x1="24" y1="14" x2="34" y2="60" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" opacity="0" />
      <line id={`${pfx}-l3`} x1="88" y1="26" x2="78" y2="52" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" opacity="0" />
      <line id={`${pfx}-l4`} x1="34" y1="60" x2="56" y2="58" stroke="#00C8FF" strokeWidth="2" strokeLinecap="round" opacity="0" filter={`url(#${pfx}-glow-sm)`} />
      <line id={`${pfx}-l5`} x1="56" y1="58" x2="78" y2="52" stroke="#00C8FF" strokeWidth="2" strokeLinecap="round" opacity="0" filter={`url(#${pfx}-glow-sm)`} />
      <line id={`${pfx}-l6`} x1="34" y1="60" x2="20" y2="108" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" opacity="0" />
      <line id={`${pfx}-l7`} x1="78" y1="52" x2="100" y2="100" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" opacity="0" />
      <line id={`${pfx}-l8`} x1="20" y1="108" x2="100" y2="100" stroke="#00C8FF" strokeWidth="0.8" strokeDasharray="3,4" strokeLinecap="round" opacity="0" />
      <g id={`${pfx}-betelgeuse`} opacity="0" data-fx="24" data-fy="14" filter={`url(#${pfx}-glow)`}><circle cx="24" cy="14" r="10" fill={`url(#${pfx}-gb)`} /></g>
      <g id={`${pfx}-bellatrix`} opacity="0" data-fx="88" data-fy="26"><circle cx="88" cy="26" r="7" fill="#A855F7" /></g>
      <g id={`${pfx}-mintaka`} opacity="0" data-fx="34" data-fy="60"><circle cx="34" cy="60" r="5" fill="#00C8FF" /></g>
      <g id={`${pfx}-alnilam`} opacity="0" data-fx="56" data-fy="58"><circle cx="56" cy="58" r="5" fill="#00C8FF" /></g>
      <g id={`${pfx}-alnitak`} opacity="0" data-fx="78" data-fy="52"><circle cx="78" cy="52" r="5" fill="#00C8FF" /></g>
      <g id={`${pfx}-saiph`} opacity="0" data-fx="20" data-fy="108"><circle cx="20" cy="108" r="6" fill="#A855F7" /></g>
      <g id={`${pfx}-rigel`} opacity="0" data-fx="100" data-fy="100" filter={`url(#${pfx}-glow)`}>
        <circle cx="100" cy="100" r="10" fill={`url(#${pfx}-gr)`} />
        <circle cx="100" cy="100" r="10" fill="none" stroke="#0A0A12" strokeWidth="0.8" />
        <text x="100" y="104" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fontWeight="700" fill="#0A0A12">S</text>
      </g>
      {[24, 88, 34, 56, 78, 20, 100].map((cx, i) => {
        const cy = [14, 26, 60, 58, 52, 108, 100][i];
        const id = `${pfx}-fl${i + 1}`;
        return <circle key={id} id={id} cx={cx} cy={cy} r="1" fill={`url(#${pfx}-flash)`} opacity="0" />;
      })}
    </svg>
  );
}

export function InsigniaStatic({ size = 40 }) {
  const pfx = useRef(`st${uid++}`).current;
  return (
    <svg viewBox="-24 -24 173 173" width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <radialGradient id={`${pfx}-gb`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FF2DA6" /><stop offset="100%" stopColor="#A855F7" />
        </radialGradient>
        <radialGradient id={`${pfx}-gr`} cx="35%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" /><stop offset="50%" stopColor="#00C8FF" /><stop offset="100%" stopColor="#A855F7" />
        </radialGradient>
        <filter id={`${pfx}-glow`}>
          <feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1="24" y1="14" x2="88" y2="26" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="24" y1="14" x2="34" y2="60" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="88" y1="26" x2="78" y2="52" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="34" y1="60" x2="56" y2="58" stroke="#00C8FF" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="58" x2="78" y2="52" stroke="#00C8FF" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="60" x2="20" y2="108" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="78" y1="52" x2="100" y2="100" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="20" y1="108" x2="100" y2="100" stroke="#00C8FF" strokeWidth="0.8" strokeDasharray="3,4" strokeLinecap="round" />
      <g filter={`url(#${pfx}-glow)`}><circle cx="24" cy="14" r="10" fill={`url(#${pfx}-gb)`} /></g>
      <circle cx="88" cy="26" r="7" fill="#A855F7" />
      <circle cx="34" cy="60" r="5" fill="#00C8FF" />
      <circle cx="56" cy="58" r="5" fill="#00C8FF" />
      <circle cx="78" cy="52" r="5" fill="#00C8FF" />
      <circle cx="20" cy="108" r="6" fill="#A855F7" />
      <g filter={`url(#${pfx}-glow)`}>
        <circle cx="100" cy="100" r="10" fill={`url(#${pfx}-gr)`} />
        <circle cx="100" cy="100" r="10" fill="none" stroke="#0A0A12" strokeWidth="0.8" />
        <text x="100" y="104" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fontWeight="700" fill="#0A0A12">S</text>
      </g>
    </svg>
  );
}
