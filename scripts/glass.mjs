// Glass card kit for the profile. Plain SVG, no dependencies.
// node scripts/glass.mjs   builds every static card into assets/
import { writeFileSync, mkdirSync } from 'node:fs';

export const C = { void: '#07070a', ivory: '#f5f0e8', gold: '#c9a84c', crimson: '#c23a3a', ice: '#8fb8ff', dim: '#a8a39a' };
export const SANS = "'Segoe UI','SF Pro Display','Helvetica Neue',Helvetica,Arial,sans-serif";
export const MONO = "ui-monospace,'SF Mono','Cascadia Code',Consolas,Menlo,monospace";
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// One glass panel: frosted fill, bright edge, top highlight.
export const glass = (x, y, w, h, r = 22, o = 0.06) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" fill-opacity="${o}" stroke="url(#edge)" stroke-width="1.2"/>` +
  `<rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${Math.min(h * 0.5, 90)}" rx="${r - 1}" fill="url(#hl)"/>`;

export const chip = (x, y, text, color = C.gold) => {
  const w = text.length * 7.4 + 26;
  return { w, svg: `<rect x="${x}" y="${y}" width="${w}" height="26" rx="13" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-opacity=".55"/><text x="${x + w / 2}" y="${y + 17.5}" text-anchor="middle" font-family="${MONO}" font-size="11" letter-spacing="1.4" fill="${color}">${esc(text)}</text>` };
};

// Card shell: void background, three drifting blurred lights, clipped to a rounded frame.
export function card(w, h, body, { label = '', orbs = [[0.14, 0.2, C.crimson], [0.86, 0.3, C.ice], [0.55, 1.0, C.gold]], extraCss = '' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${esc(label)}">
<defs>
<clipPath id="frame"><rect width="${w}" height="${h}" rx="28"/></clipPath>
<filter id="blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="70"/></filter>
<linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></linearGradient>
<linearGradient id="hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".11"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>
<style>
.o{animation:drift 16s ease-in-out infinite alternate}.o2{animation-duration:21s;animation-direction:alternate-reverse}.o3{animation-duration:26s}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(70px,36px)}}
.sheen{animation:sheen 7s cubic-bezier(.16,1,.3,1) infinite}
@keyframes sheen{0%,35%{transform:translateX(-40%) skewX(-18deg)}80%,100%{transform:translateX(140%) skewX(-18deg)}}
.in{animation:in .9s cubic-bezier(.16,1,.3,1) backwards}
@keyframes in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.pulse{animation:pulse 2s ease-in-out infinite}@keyframes pulse{50%{opacity:.25}}
${extraCss}
</style>
<g clip-path="url(#frame)">
<rect width="${w}" height="${h}" fill="${C.void}"/>
<g filter="url(#blur)" opacity=".62">${orbs.map((o, i) => `<circle class="o o${i + 1}" cx="${o[0] * w}" cy="${o[1] * h}" r="${Math.min(w, h) * 0.42}" fill="${o[2]}"/>`).join('')}</g>
${body}
<rect class="sheen" x="0" y="0" width="${w * 0.3}" height="${h}" fill="url(#sheen)"/>
</g>
<rect x=".6" y=".6" width="${w - 1.2}" height="${h - 1.2}" rx="28" fill="none" stroke="url(#edge)" stroke-width="1.2"/>
</svg>
`;
}

const T = (x, y, s, { size = 16, fill = C.ivory, weight = 400, font = SANS, anchor = 'start', ls = 0, op = 1, cls = '', delay = 0 } = {}) =>
  `<text ${cls ? `class="${cls}" style="animation-delay:${delay}s" ` : ''}x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" fill-opacity="${op}" text-anchor="${anchor}" letter-spacing="${ls}">${esc(s)}</text>`;
export { T };

function hero() {
  const lines = ['Founder of MYNTHISM, a creative AI studio.', 'I design the brand, build the site, and wire the agents behind it.', 'Self taught. Arabic, French, English, and some German.'];
  const css = `.rot{opacity:0;animation:rot 12s linear infinite}@keyframes rot{0%,3%{opacity:0;transform:translateY(8px)}7%,30%{opacity:1;transform:none}34%,100%{opacity:0;transform:translateY(-8px)}}
.ring{transform-origin:1010px 222px;animation:spin 28s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.core{transform-origin:1010px 222px;animation:breath 5s ease-in-out infinite}@keyframes breath{50%{transform:scale(1.06)}}`;
  const dots = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<circle cx="${(1010 + Math.cos(a) * 104).toFixed(1)}" cy="${(222 + Math.sin(a) * 104).toFixed(1)}" r="${i % 2 ? 3 : 5}" fill="${i % 2 ? C.ivory : C.gold}"/>`; }).join('');
  const body = `${glass(36, 36, 1128, 372, 26)}
${T(76, 92, '◈  MYNTHISM', { font: MONO, size: 13, ls: 3, fill: C.gold, cls: 'in' })}
${T(840, 92, 'TUNIS  ·  TRIPOLI', { font: MONO, size: 13, ls: 3, fill: C.dim, anchor: 'end', cls: 'in', delay: 0.1 })}
${T(74, 190, 'Hamdi Ben Jarrar', { size: 78, weight: 700, ls: -1.5, cls: 'in', delay: 0.15 })}
<text class="in" style="animation-delay:.3s" x="76" y="240" font-family="'Geeza Pro','Noto Naskh Arabic','Segoe UI',Tahoma,Arial,sans-serif" font-size="30" fill="${C.ivory}" fill-opacity=".85" direction="rtl" text-anchor="end" unicode-bidi="plaintext">حمدي بن جرار</text>
${T(76, 292, 'Designer  ·  Full stack and AI developer  ·  Creative director', { size: 21, fill: C.ivory, op: 0.92, cls: 'in', delay: 0.45 })}
<rect class="in" style="animation-delay:.55s" x="76" y="314" width="56" height="2" fill="${C.gold}"/>
${lines.map((l, i) => `<text class="rot" style="animation-delay:${i * 4}s" x="76" y="354" font-family="${SANS}" font-size="18" fill="${C.dim}">${esc(l)}</text>`).join('')}
<g class="in" style="animation-delay:.6s">
<circle cx="1010" cy="222" r="128" fill="#fff" fill-opacity=".05" stroke="url(#edge)" stroke-width="1.2"/>
<g class="ring">${dots}</g>
<g class="core"><circle cx="1010" cy="222" r="62" fill="#fff" fill-opacity=".08" stroke="url(#edge)"/><text x="1010" y="246" text-anchor="middle" font-family="${SANS}" font-size="68" fill="${C.gold}">◈</text></g>
</g>`;
  return card(1200, 444, body, { label: 'Hamdi Ben Jarrar. Designer, full stack and AI developer, creative director. Founder of MYNTHISM. Tunis and Tripoli.', extraCss: css });
}

function now() {
  const items = [
    ['MYNTHISM', 'A creative AI studio: brand systems, sites', 'and the agents that run behind them.', 'LIVE', C.gold],
    ['Aura', 'An Arabic first assistant that answers from an', 'organisation’s own documents and cites them.', 'IN PROGRESS', C.ice],
    ['Ghazala Cinematic Lab', 'Animated site in Arabic, English and French,', 'and the magazine, for a film lab in Tripoli.', 'PREVIEW LIVE', C.crimson],
    ['npm Pulse', 'A free, open API that gives any npm package', 'a health score from 0 to 100.', 'LIVE', C.gold],
    ['awesome-arabic-dev', 'A curated list of resources for', 'Arabic speaking developers.', 'OPEN SOURCE', C.ice],
    ['DinarWise', 'A personal finance tracker built with', 'Next.js and MongoDB.', 'COMPLETE', C.dim]
  ];
  let body = T(48, 62, 'NOW BUILDING', { font: MONO, size: 13, ls: 3, fill: C.gold });
  items.forEach((it, i) => {
    const x = 36 + (i % 3) * 380, y = 88 + Math.floor(i / 3) * 196, c = chip(x + 24, y + 126, it[3], it[4]);
    body += `<g class="in" style="animation-delay:${0.1 * i}s">${glass(x, y, 368, 180, 20)}${T(x + 24, y + 46, it[0], { size: 23, weight: 700 })}${T(x + 24, y + 76, it[1], { size: 14.5, fill: C.dim })}${T(x + 24, y + 97, it[2], { size: 14.5, fill: C.dim })}${c.svg}</g>`;
  });
  return card(1200, 500, body, { label: 'Now building: MYNTHISM, Aura, Ghazala Cinematic Lab, npm Pulse, awesome-arabic-dev, DinarWise.', orbs: [[0.1, 0.9, C.gold], [0.9, 0.1, C.crimson], [0.5, 0.4, C.ice]] });
}

function stack() {
  const rows = [
    ['INTERFACE', ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Motion', 'GSAP', 'Three.js']],
    ['SERVER', ['Node', 'Express', 'Python', 'FastAPI', 'Supabase', 'PostgreSQL', 'MongoDB']],
    ['AGENTS', ['LLM APIs', 'RAG', 'Multi agent systems', 'MCP', 'n8n']],
    ['SHIP', ['Vercel', 'Cloudflare', 'Docker', 'GitHub Actions']],
    ['DESIGN', ['Brand identity', 'Art direction', 'Arabic and Latin type', 'Motion design']]
  ];
  let body = T(48, 62, 'TOOLKIT', { font: MONO, size: 13, ls: 3, fill: C.gold }) + glass(36, 84, 1128, 300, 22);
  rows.forEach((r, ri) => {
    const y = 110 + ri * 54; let x = 220;
    body += T(64, y + 18, r[0], { font: MONO, size: 12, ls: 2.4, fill: C.dim });
    r[1].forEach((s, si) => { const w = s.length * 8.6 + 34; body += `<g class="in" style="animation-delay:${(ri * 0.12 + si * 0.05).toFixed(2)}s"><rect x="${x}" y="${y}" width="${w}" height="34" rx="17" fill="#fff" fill-opacity=".07" stroke="url(#edge)"/><text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" font-family="${SANS}" font-size="15" fill="${C.ivory}">${esc(s)}</text></g>`; x += w + 10; });
  });
  return card(1200, 420, body, { label: 'Toolkit: React, Next.js, TypeScript, Tailwind, Motion, GSAP, Three.js, Node, Express, Python, FastAPI, Supabase, PostgreSQL, MongoDB, LLM APIs, RAG, multi agent systems, MCP, n8n, Vercel, Cloudflare, Docker, GitHub Actions, brand identity, art direction.', orbs: [[0.85, 0.85, C.gold], [0.15, 0.15, C.ice], [0.5, 0.6, C.crimson]] });
}

function path() {
  const steps = [
    ['2023', ['Brand and identity', 'designer'], 'Anis Ben Ammar Studio'],
    ['2025', ['Software developer', 'bootcamp'], 'GOMYCODE, graduated April'],
    ['2025', ['Founder', ''], 'MYNTHISM'],
    ['2025', ['Innovation and digital', 'impact lead'], 'Wallah We Can Global'],
    ['2026', ['Innovation sector', 'director'], 'Almarsm Organization, Tripoli']
  ];
  const css = `.line{stroke-dasharray:1100;stroke-dashoffset:1100;animation:draw 2.6s cubic-bezier(.16,1,.3,1) .2s forwards}@keyframes draw{to{stroke-dashoffset:0}}`;
  let body = T(48, 62, 'PATH', { font: MONO, size: 13, ls: 3, fill: C.gold }) + glass(36, 84, 1128, 258, 22) + `<path class="line" d="M90 150 H1110" stroke="${C.gold}" stroke-width="1.5" fill="none"/>`;
  steps.forEach((s, i) => {
    const x = 90 + i * 212;
    body += `<g class="in" style="animation-delay:${0.3 + i * 0.18}s"><circle cx="${x}" cy="150" r="7" fill="${C.void}" stroke="${C.gold}" stroke-width="2"/><circle class="pulse" style="animation-delay:${i * 0.3}s" cx="${x}" cy="150" r="3" fill="${C.gold}"/>${T(x - 8, 124, s[0], { font: MONO, size: 14, fill: C.gold, ls: 1 })}${T(x - 8, 190, s[1][0], { size: 15, weight: 700 })}${T(x - 8, 210, s[1][1], { size: 15, weight: 700 })}${T(x - 8, 236, s[2], { size: 13.5, fill: C.dim })}</g>`;
  });
  body += T(64, 306, 'Self taught beyond the bootcamp. Baccalauréat 2014. All 16 Anthropic Academy certificates. MongoDB and Postman API certified.', { size: 14.5, fill: C.dim });
  return card(1200, 378, body, { label: 'Path: brand designer at Anis Ben Ammar Studio 2023, GOMYCODE bootcamp graduated April 2025, founder of MYNTHISM 2025, innovation and digital impact lead at Wallah We Can Global 2025, innovation sector director at Almarsm Organization in Tripoli 2026. Self taught.', extraCss: css, orbs: [[0.2, 0.9, C.crimson], [0.8, 0.2, C.gold], [0.5, 0.5, C.ice]] });
}

function button(name, label) {
  const w = label.length * 9.4 + 64, h = 52;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}"><defs><linearGradient id="e" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient><linearGradient id="s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="c"><rect width="${w}" height="${h}" rx="26"/></clipPath></defs><style>.s{animation:s 5s cubic-bezier(.16,1,.3,1) infinite}@keyframes s{0%,40%{transform:translateX(-60%)}90%,100%{transform:translateX(160%)}}</style><g clip-path="url(#c)"><rect width="${w}" height="${h}" fill="#0d0d12"/><circle cx="${w * 0.2}" cy="${h}" r="${h}" fill="${C.gold}" opacity=".28"/><circle cx="${w * 0.9}" cy="0" r="${h}" fill="${C.crimson}" opacity=".3"/><rect width="${w}" height="${h}" fill="#fff" fill-opacity=".05"/><rect class="s" width="${w * 0.4}" height="${h}" fill="url(#s)"/></g><rect x=".6" y=".6" width="${w - 1.2}" height="${h - 1.2}" rx="26" fill="none" stroke="url(#e)" stroke-width="1.2"/><text x="26" y="32" font-family="${SANS}" font-size="15" fill="${C.gold}">◈</text><text x="48" y="32" font-family="${SANS}" font-size="15.5" font-weight="600" fill="${C.ivory}">${esc(label)}</text></svg>\n`;
  writeFileSync(`assets/${name}.svg`, svg);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  mkdirSync('assets', { recursive: true });
  writeFileSync('assets/hero.svg', hero());
  writeFileSync('assets/now.svg', now());
  writeFileSync('assets/stack.svg', stack());
  writeFileSync('assets/path.svg', path());
  button('btn-linkedin', 'LinkedIn');
  button('btn-instagram', 'Instagram');
  button('btn-email', 'hamdibenjarrar@gmail.com');
  button('btn-mynthism', 'MYNTHISM');
  button('btn-talk', 'Say hello to Nomen');
  console.log('cards built');
}
