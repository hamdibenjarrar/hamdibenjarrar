// Nomen, the resident agent of this profile.
// A scheduled workflow wakes it. It reads public GitHub activity, remembers who said hello,
// and redraws itself into assets/nomen.svg. No dependencies.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { card, glass, T, C, MONO, SANS, esc } from './glass.mjs';

const USER = process.env.GH_USER || 'hamdibenjarrar';
const TOKEN = process.env.GITHUB_TOKEN || '';
const VISITOR = /^[A-Za-z0-9-]{1,39}$/.test(process.env.VISITOR || '') ? process.env.VISITOR : '';
const STATE = 'assets/nomen.json';
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { visitors: [], repos: 0, followers: 0, lastRepo: '', lastPush: '', lastCommit: '', newest: '' };

async function gh(path) {
  const r = await fetch('https://api.github.com' + path, { headers: { 'User-Agent': 'nomen', Accept: 'application/vnd.github+json', ...(TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {}) } });
  if (!r.ok) throw new Error(path + ' ' + r.status);
  return r.json();
}

try {
  const [u, repos, events] = await Promise.all([gh(`/users/${USER}`), gh(`/users/${USER}/repos?type=owner&sort=pushed&per_page=100`), gh(`/users/${USER}/events/public?per_page=30`)]);
  const own = repos.filter((r) => !r.fork && !r.private);
  state.repos = u.public_repos; state.followers = u.followers;
  if (own[0]) { state.lastRepo = own[0].name; state.lastPush = own[0].pushed_at; }
  const newest = [...own].sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  if (newest) state.newest = newest.name;
  const push = events.find((e) => e.type === 'PushEvent' && e.payload && e.payload.commits && e.payload.commits.length);
  if (push) state.lastCommit = push.payload.commits[push.payload.commits.length - 1].message.split('\n')[0];
} catch (e) {
  console.log('Nomen could not reach GitHub, keeping its last memory:', e.message);
}

if (VISITOR && VISITOR.toLowerCase() !== USER.toLowerCase()) {
  state.visitors = [VISITOR, ...state.visitors.filter((v) => v !== VISITOR)].slice(0, 200);
  state.greeted = (state.greeted || 0) + 1;
}
const now = new Date();
state.woke = now.toISOString();

const day = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const hoursSince = state.lastPush ? (now - new Date(state.lastPush)) / 36e5 : 999;
const awake = hoursSince < 36;
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

const lines = [
  awake ? 'I am awake. Hamdi shipped something in the last day.' : 'I am resting. It has been quiet for a while.',
  state.lastRepo ? `Last public push: ${state.lastRepo}, on ${day(state.lastPush)}.` : '',
  state.lastCommit ? `Latest commit note: “${cut(state.lastCommit, 58)}”` : '',
  state.newest ? `Newest public repository: ${state.newest}.` : '',
  state.visitors.length ? `Last visitor who said hello: @${state.visitors[0]}.` : 'Nobody has said hello yet. Open an issue titled nomen.'
].filter(Boolean);

const total = lines.length * 5, slot = 100 / lines.length;
const css = `.say{opacity:0;animation:say ${total}s linear infinite}@keyframes say{0%{opacity:0;transform:translateY(10px)}${(slot * 0.1).toFixed(2)}%,${(slot * 0.9).toFixed(2)}%{opacity:1;transform:none}${slot.toFixed(2)}%,100%{opacity:0;transform:translateY(-10px)}}
.bob{animation:bob 4.5s ease-in-out infinite}@keyframes bob{50%{transform:translateY(-12px)}}
.shadow{transform-origin:200px 318px;animation:sh 4.5s ease-in-out infinite}@keyframes sh{50%{transform:scaleX(.82);opacity:.25}}
.eye{transform-box:fill-box;transform-origin:center;animation:blink 5.2s infinite}@keyframes blink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.08)}}
.orbit{transform-origin:200px 178px;animation:orbit 18s linear infinite}@keyframes orbit{to{transform:rotate(360deg)}}
.ant{animation:pulse 1.6s ease-in-out infinite}
.cur{animation:pulse 1s steps(2) infinite}`;

const dots = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<circle cx="${(200 + Math.cos(a) * 122).toFixed(1)}" cy="${(178 + Math.sin(a) * 122).toFixed(1)}" r="${i % 2 ? 2.5 : 4}" fill="${i % 2 ? C.ivory : C.gold}" fill-opacity="${i % 2 ? 0.6 : 1}"/>`; }).join('');
const eyes = awake
  ? `<rect class="eye" x="170" y="158" width="16" height="26" rx="8" fill="${C.gold}"/><rect class="eye" x="214" y="158" width="16" height="26" rx="8" fill="${C.gold}"/>`
  : `<path d="M168 172 q10 8 20 0 M212 172 q10 8 20 0" stroke="${C.gold}" stroke-width="4" stroke-linecap="round" fill="none"/>`;

const stat = (x, label, value) => `${T(x, 300, label, { font: MONO, size: 11.5, ls: 2, fill: C.dim })}${T(x, 328, String(value), { size: 24, weight: 700 })}`;

const body = `
<ellipse class="shadow" cx="200" cy="318" rx="70" ry="9" fill="#000" opacity=".45"/>
<g class="orbit">${dots}</g>
<g class="bob">
<line x1="200" y1="92" x2="200" y2="62" stroke="url(#edge)" stroke-width="2"/><circle class="ant" cx="200" cy="58" r="6" fill="${awake ? C.gold : C.dim}"/>
<circle cx="200" cy="178" r="88" fill="#fff" fill-opacity=".08" stroke="url(#edge)" stroke-width="1.4"/>
<ellipse cx="172" cy="132" rx="38" ry="20" fill="#fff" fill-opacity=".1" transform="rotate(-24 172 132)"/>
${eyes}
<path d="M186 206 q14 ${awake ? 12 : 4} 28 0" stroke="${C.ivory}" stroke-opacity=".8" stroke-width="3" stroke-linecap="round" fill="none"/>
<text x="200" y="250" text-anchor="middle" font-family="${SANS}" font-size="20" fill="${C.gold}" fill-opacity=".9">◈</text>
</g>
${glass(380, 40, 780, 300, 24)}
<circle class="pulse" cx="416" cy="80" r="5" fill="${awake ? '#57d38c' : C.dim}"/>
${T(432, 85, 'NOMEN  ·  RESIDENT AGENT', { font: MONO, size: 13, ls: 3, fill: C.gold })}
${T(1124, 85, 'woke ' + now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC', { font: MONO, size: 12, fill: C.dim, anchor: 'end' })}
<line x1="412" y1="108" x2="1128" y2="108" stroke="#fff" stroke-opacity=".14"/>
${lines.map((l, i) => `<text class="say" style="animation-delay:${i * 5}s" x="414" y="186" font-family="${SANS}" font-size="27" font-weight="600" fill="${C.ivory}">${esc(l)}</text>`).join('')}
<rect class="cur" x="414" y="208" width="14" height="3" fill="${C.gold}"/>
<line x1="412" y1="262" x2="1128" y2="262" stroke="#fff" stroke-opacity=".14"/>
${stat(414, 'PUBLIC REPOS', state.repos || '·')}${stat(640, 'FOLLOWERS', state.followers || '·')}${stat(850, 'HELLOS RECEIVED', state.greeted || 0)}`;

mkdirSync('assets', { recursive: true });
writeFileSync('assets/nomen.svg', card(1200, 380, body, { label: 'Nomen, the resident agent of this profile. ' + lines.join(' '), extraCss: css, orbs: [[0.16, 0.5, C.gold], [0.9, 0.2, C.crimson], [0.62, 1.05, C.ice]] }));
writeFileSync(STATE, JSON.stringify(state, null, 2) + '\n');
console.log('Nomen is', awake ? 'awake' : 'resting', '·', lines.length, 'lines');
