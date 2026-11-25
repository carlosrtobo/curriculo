// Monta o mundo: camadas de parallax (longe → frente) e os objetos do currículo.
// Tudo em "unidades": a tela tem 1000 de altura; o chão fica em y = 830.
import { cor, rng, pedra, icone, xicara } from './arte.js';
import { regioes, habilidades, linhaDoTempo, projetos, resumoCursos, livro, contato } from './dados.js';

export const CHAO = 830;
const f1 = (n) => Math.round(n * 10) / 10;
const R = Object.fromEntries(regioes.map((r) => [r.id, r]));

// Posições fixas dos objetos no mundo (x do chão)
export const pos = {
  inicio: 200,
  quebra: 2480,
  placaHab: 3000,
  habilidades: habilidades.map((_, i) => 3420 + i * 430),
  placaTempo: 6300,
  tempo: linhaDoTempo.map((_, i) => 6750 + i * 450),
  bau: 10620,
  placaVale: 11300,
  sementes: projetos.map((_, i) => 11720 + i * 540),
  placaRetorno: 15250,
  canteiro: 15800,
  final: 16420
};

const usar = (id, x, y, s = 1, extra = '') =>
  `<use href="#${id}" transform="translate(${f1(x)} ${f1(y)}) scale(${s})" ${extra}/>`;

function pedaco(x0, x1, conteudo, cls = '') {
  x0 = Math.floor(x0); x1 = Math.ceil(x1);
  return `<svg class="pedaco ${cls}" data-x0="${x0}" data-x1="${x1}" style="left:${x0}px;width:${x1 - x0}px" viewBox="${x0} 0 ${x1 - x0} 1000" preserveAspectRatio="none" aria-hidden="true">${conteudo}</svg>`;
}

// Serra facetada: cada pico tem um lado claro e outro de sombra
function serra(x0, x1, base, alt, tons, seed, passo = 260) {
  const r = rng(seed);
  let s = '', x = x0;
  const pts = [[x0, base]];
  while (x < x1) {
    const w = passo * (0.6 + r() * 0.8), h = alt * (0.45 + r() * 0.55);
    pts.push([x + w * 0.5, base - h], [x + w, base - h * (0.15 + r() * 0.3)]);
    x += w;
  }
  pts.push([x, base], [x, 1000], [x0, 1000]);
  s += `<polygon points="${pts.map((p) => p.map(f1).join(',')).join(' ')}" fill="${tons[0]}"/>`;
  for (let i = 1; i < pts.length - 3; i += 2) {
    const [px, py] = pts[i], [qx, qy] = pts[i + 1];
    s += `<polygon points="${f1(px)},${f1(py)} ${f1(qx)},${f1(qy)} ${f1(qx - 30)},${base} ${f1(px + 10)},${base}" fill="${tons[1]}" opacity=".9"/>`;
  }
  return s;
}

function nuvem(x, y, w, seed) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < 4; i++) s += `<ellipse cx="${f1(x + (i - 1.5) * w * 0.22)}" cy="${f1(y - r() * 18)}" rx="${f1(w * (0.18 + r() * 0.1))}" ry="${f1(22 + r() * 16)}" fill="${cor.branco}"/>`;
  return `<g opacity=".55">${s}<rect x="${f1(x - w * 0.45)}" y="${f1(y - 6)}" width="${f1(w * 0.9)}" height="26" rx="13" fill="${cor.branco}"/></g>`;
}

// ---------- objetos da linha do tempo ----------
function objeto(tipo, x) {
  const b = CHAO, C = cor, W = `stroke="${C.branco}" stroke-width="5" stroke-linejoin="round"`;
  switch (tipo) {
    case 'camera': return `<g ${W}><rect x="${x - 60}" y="${b - 92}" width="120" height="78" rx="10" fill="${C.carvao}"/><rect x="${x - 30}" y="${b - 112}" width="44" height="22" rx="4" fill="${C.carvao}"/></g>
      <circle cx="${x}" cy="${b - 53}" r="28" fill="${C.pedraEsc}" stroke="${C.branco}" stroke-width="4"/><circle cx="${x}" cy="${b - 53}" r="14" fill="${C.roxo}"/><circle cx="${x - 5}" cy="${b - 58}" r="4" fill="${C.branco}"/>
      <circle cx="${x + 42}" cy="${b - 78}" r="5" fill="${C.terracota}"/>
      <g transform="translate(${x + 75} ${b - 40})"><circle r="34" fill="${C.pedraClara}" stroke="${C.branco}" stroke-width="4"/><circle r="10" fill="${C.carvao}"/><circle r="24" fill="none" stroke="${C.dourado}" stroke-width="3" opacity=".7"/></g>`;
    case 'filme': {
      const rolo = (cx, cy, rr) => `<g transform="translate(${cx} ${cy})"><circle r="${rr}" fill="${C.carvao}" stroke="${C.branco}" stroke-width="5"/>${[0, 1, 2, 3, 4].map((k) => `<circle cx="${f1(Math.cos(k * 1.2566) * rr * 0.55)}" cy="${f1(Math.sin(k * 1.2566) * rr * 0.55)}" r="${f1(rr * 0.17)}" fill="${C.pedra}"/>`).join('')}<circle r="${f1(rr * 0.15)}" fill="${C.terracota}"/></g>`;
      return `<path d="M${x - 70} ${b - 40} C ${x - 20} ${b - 10}, ${x + 30} ${b - 70}, ${x + 100} ${b - 18}" stroke="${C.carvao}" stroke-width="22" fill="none"/><path d="M${x - 70} ${b - 40} C ${x - 20} ${b - 10}, ${x + 30} ${b - 70}, ${x + 100} ${b - 18}" stroke="${C.pessego}" stroke-width="8" stroke-dasharray="6 8" fill="none"/>` + rolo(x - 30, b - 60, 50) + rolo(x + 50, b - 140, 38);
    }
    case 'prancheta': return `<path d="M${x - 50} ${b} L${x - 10} ${b - 130} M${x + 60} ${b} L${x + 20} ${b - 130}" stroke="${C.terra}" stroke-width="9" stroke-linecap="round"/>
      <g transform="rotate(-8 ${x} ${b - 140})"><rect x="${x - 85}" y="${b - 210}" width="170" height="120" rx="6" fill="${C.osso}" ${W}/>
      <rect x="${x - 70}" y="${b - 196}" width="140" height="16" rx="3" fill="${C.terracota}"/><rect x="${x - 70}" y="${b - 172}" width="60" height="62" fill="${C.salvia}"/>
      <path d="M${x} ${b - 166} H${x + 70} M${x} ${b - 150} H${x + 60} M${x} ${b - 134} H${x + 66} M${x} ${b - 118} H${x + 40}" stroke="${C.carvao}" stroke-width="5" opacity=".55"/></g>
      <path d="M${x + 70} ${b - 250} L${x + 120} ${b - 120}" stroke="${C.amarelo}" stroke-width="10" stroke-linecap="round"/><path d="M${x + 118} ${b - 126} l6 16" stroke="${C.carvao}" stroke-width="6"/>`;
    case 'cristal': return `<g ${W}><polygon points="${x - 70},${b} ${x - 80},${b - 150} ${x - 20},${b - 190} ${x + 70},${b - 165} ${x + 80},${b}" fill="#CFE0E2"/></g>
      <polygon points="${x - 20},${b - 190} ${x + 70},${b - 165} ${x + 20},${b - 130}" fill="#EEF6F5"/><polygon points="${x + 20},${b - 130} ${x + 70},${b - 165} ${x + 80},${b} ${x + 30},${b}" fill="#A9C4C8"/>
      <g opacity=".75" transform="translate(${x - 18} ${b - 75})"><circle r="30" fill="none" stroke="${C.carvao}" stroke-width="2.5"/>${[0, 1, 2, 3, 4, 5].map((k) => `<ellipse rx="7" ry="16" transform="rotate(${k * 60}) translate(0 -15)" fill="none" stroke="${C.carvao}" stroke-width="2.5"/>`).join('')}</g>`;
    case 'livro': return `<g ${W}><path d="M${x - 90} ${b - 30} L${x} ${b - 10} L${x + 90} ${b - 30} L${x + 90} ${b - 110} L${x} ${b - 90} L${x - 90} ${b - 110}Z" fill="${C.osso}"/></g>
      <path d="M${x} ${b - 90} V${b - 10}" stroke="${C.terra}" stroke-width="4"/><path d="M${x - 75} ${b - 85} L${x - 15} ${b - 72} M${x - 75} ${b - 68} L${x - 15} ${b - 55} M${x - 75} ${b - 51} L${x - 25} ${b - 40} M${x + 15} ${b - 72} L${x + 75} ${b - 85} M${x + 15} ${b - 55} L${x + 75} ${b - 68}" stroke="${C.carvao}" stroke-width="4" opacity=".5"/>
      <path d="M${x - 90} ${b - 30} L${x} ${b - 10} L${x + 90} ${b - 30} L${x + 90} ${b} L${x - 90} ${b}Z" fill="${C.terracota}"/>`;
    case 'provas': {
      let s = '';
      for (let i = 0; i < 6; i++) s += `<rect x="${x - 70 + (i % 2) * 6}" y="${b - 20 - i * 16}" width="120" height="16" fill="${i % 2 ? C.osso : C.pedraClara}" stroke="${C.branco}" stroke-width="3"/>`;
      return s + `<g transform="rotate(10 ${x + 70} ${b - 80})"><rect x="${x + 30}" y="${b - 170}" width="90" height="120" rx="8" fill="${C.terra}" ${W}/><rect x="${x + 40}" y="${b - 156}" width="70" height="96" fill="${C.osso}"/><rect x="${x + 60}" y="${b - 178}" width="30" height="14" rx="4" fill="${C.pedraEsc}"/>
        <path d="M${x + 48} ${b - 136} l7 7 l12 -14 M${x + 48} ${b - 108} l7 7 l12 -14 M${x + 48} ${b - 80} l7 7 l12 -14" stroke="${C.salviaEsc}" stroke-width="5" fill="none"/></g>`;
    }
    case 'escola': return `<g ${W}><rect x="${x - 150}" y="${b - 190}" width="300" height="190" fill="${C.osso}"/><polygon points="${x - 175},${b - 185} ${x},${b - 290} ${x + 175},${b - 185}" fill="${C.terracota}"/></g>
      <rect x="${x - 40}" y="${b - 230}" width="80" height="26" rx="4" fill="${C.carvao}"/><text x="${x}" y="${b - 210}" text-anchor="middle" class="svg-texto" font-size="22" fill="${C.osso}">ETEC</text>
      <rect x="${x - 26}" y="${b - 96}" width="52" height="96" rx="24" fill="${C.terra}"/>
      ${[-110, -70, 50, 90].map((dx) => `<rect x="${x + dx}" y="${b - 160}" width="28" height="40" fill="${C.salviaEsc}" stroke="${C.branco}" stroke-width="3"/><rect x="${x + dx}" y="${b - 90}" width="28" height="40" fill="${C.salviaEsc}" stroke="${C.branco}" stroke-width="3"/>`).join('')}
      <path d="M${x + 120} ${b - 190} V${b - 320}" stroke="${C.terra}" stroke-width="5"/><path d="M${x + 122} ${b - 320} L${x + 172} ${b - 306} L${x + 122} ${b - 292}Z" fill="${C.amarelo}" stroke="${C.branco}" stroke-width="3"/>`;
    case 'pergaminho': return pergaminho(x, b - 50, 1.3);
    default: return '';
  }
}

function pergaminho(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-46" y="-26" width="92" height="52" fill="${cor.osso}" stroke="${cor.branco}" stroke-width="4"/>
    <path d="M-34 -10 H34 M-34 2 H24 M-34 14 H30" stroke="${cor.carvao}" stroke-width="3" opacity=".45"/>
    <rect x="-56" y="-32" width="16" height="64" rx="8" fill="${cor.pessego}" stroke="${cor.branco}" stroke-width="3"/><rect x="40" y="-32" width="16" height="64" rx="8" fill="${cor.pessego}" stroke="${cor.branco}" stroke-width="3"/>
    <circle cx="0" cy="26" r="11" fill="${cor.terracota}" stroke="${cor.branco}" stroke-width="3"/><path d="M-6 34 L-10 50 M6 34 L10 50" stroke="${cor.terracota}" stroke-width="6"/></g>`;
}

function placa(x, alt = 200) {
  return `<path d="M${x - 4} ${CHAO + 6} V${CHAO - alt}" stroke="${cor.branco}" stroke-width="18" stroke-linecap="round"/><path d="M${x - 4} ${CHAO + 6} V${CHAO - alt}" stroke="${cor.terra}" stroke-width="10" stroke-linecap="round"/>`;
}

// ---------- a "pirâmide": casa de pedra no alto do morro, com o telhado longo em rampa ----------
function piramide(x, base, s) {
  const C = { pedra: '#C9B48F', pedraEsc: '#9C8664', telhado: '#B8A07A', telhadoEsc: '#8E7756', fresta: '#3A3226' };
  const g = (conteudo) => `<g transform="translate(${f1(x)} ${f1(base)}) scale(${s})">${conteudo}</g>`;
  let st = '';
  // morro facetado
  st += `<polygon points="-760,0 -560,-120 -300,-170 -60,-210 200,-260 420,-250 640,-180 820,-60 900,0" fill="#8E9B78"/>`;
  st += `<polygon points="-300,-170 -60,-210 120,-80 -200,-40" fill="#A8B38F"/><polygon points="420,-250 640,-180 560,-60 380,-120" fill="#6F7E5C"/>`;
  // rochas na frente
  st += pedra(80, -205, 220, 120, 7, [C.pedra, '#E1CFA8', C.pedraEsc]) + pedra(260, -215, 160, 150, 13, ['#D3A66E', '#E8C38C', C.pedraEsc]) + pedra(380, -200, 140, 90, 21, [C.pedra, '#E1CFA8', C.pedraEsc]);
  // parede baixa e telhado em rampa
  st += `<polygon points="-560,-190 -470,-190 -470,-260 -560,-260" fill="${C.pedra}"/><polygon points="-470,-190 180,-300 180,-372 -470,-262" fill="${C.pedraEsc}"/>`;
  st += `<polygon points="-600,-262 -470,-268 220,-470 120,-470" fill="${C.telhado}" stroke="${cor.branco}" stroke-width="6" stroke-linejoin="round"/>`;
  st += `<polygon points="-470,-268 220,-470 220,-450 -470,-252" fill="${C.telhadoEsc}"/>`;
  // casinha com telhado de quatro águas
  st += `<rect x="120" y="-470" width="360" height="270" fill="${C.pedra}" stroke="${cor.branco}" stroke-width="6"/><rect x="380" y="-470" width="100" height="270" fill="${C.pedraEsc}"/>`;
  st += `<polygon points="70,-462 240,-600 400,-600 530,-462" fill="${C.telhado}" stroke="${cor.branco}" stroke-width="6" stroke-linejoin="round"/><polygon points="400,-600 530,-462 460,-462" fill="${C.telhadoEsc}"/>`;
  st += `<rect x="230" y="-440" width="90" height="120" fill="${C.fresta}"/><rect x="-540" y="-245" width="50" height="30" fill="${C.fresta}"/>`;
  // textura de pedras (linhas)
  let lin = '';
  const r = rng(99);
  for (let yy = -455; yy < -210; yy += 22) for (let xx = 130; xx < 470; xx += 34 + r() * 14) lin += `M${f1(xx)} ${yy} h${f1(18 + r() * 12)} `;
  for (let k = 0; k < 14; k++) { const t = k / 14; lin += `M${f1(-560 + t * 760)} ${f1(-262 - t * 205)} l${f1(30 - t * 20)} 12 `; }
  st += `<path d="${lin}" stroke="${cor.branco}" stroke-opacity=".45" stroke-width="4" stroke-linecap="round"/>`;
  st += usar('arvore2', -640, -150, 0.45) + usar('capim', 600, -120, 1.4) + usar('capim', 0, -200, 1.2);
  return g(st);
}

// ---------- cachoeira das borboletas ----------
function cachoeira(x, base, s) {
  const C = { rocha: '#A65A44', rochaClara: '#C27A5A', rochaEsc: '#7A4232', vao: '#3D3A2E', poco: '#8FB08A', pocoClaro: '#B3CDA6' };
  let st = '';
  st += usar('arvore', -420, -520, 1) + usar('arvore2', -150, -560, 1.1) + usar('arvore', 260, -540, 0.9) + usar('arvore2', 520, -510, 1);
  // encosta de mata dos dois lados
  st += `<polygon points="-1050,0 -900,-260 -760,-470 -690,-520 -690,-300 -560,0" fill="#5E7D4C"/><polygon points="1050,0 900,-250 780,-450 700,-500 700,-300 560,0" fill="#5E7D4C"/>`;
  // laje de rocha avermelhada
  st += `<polygon points="-720,-500 -500,-560 -200,-570 100,-590 380,-575 640,-545 720,-520 735,-450 700,-400 -700,-400 -740,-450" fill="${C.rocha}" stroke="${cor.branco}" stroke-width="6" stroke-linejoin="round"/>`;
  st += `<polygon points="-500,-560 -200,-570 -260,-480 -480,-470" fill="${C.rochaClara}"/><polygon points="100,-590 380,-575 340,-490 140,-500" fill="${C.rochaClara}"/><polygon points="380,-575 640,-545 600,-430 360,-450" fill="${C.rochaEsc}"/><polygon points="-720,-500 -500,-560 -560,-420 -700,-400 -740,-450" fill="${C.rochaEsc}"/>`;
  // vão escuro sob a laje
  st += `<path d="M-700 -402 H700 Q720 -330 690 -270 Q0 -240 -690 -270 Q-720 -330 -700 -402Z" fill="${C.vao}"/>`;
  st += usar('samambaia', -560, -270, 0.9) + usar('samambaia2', -330, -270, 1) + usar('samambaia', 560, -270, 0.95) + usar('samambaia2', 160, -270, 0.8);
  // poço verde, de margem irregular
  st += `<path d="M-820 -250 Q-420 -300 0 -280 Q420 -300 820 -250 Q900 -130 700 -60 Q0 -10 -700 -60 Q-900 -130 -820 -250Z" fill="#6F9A86" stroke="${cor.branco}" stroke-width="6"/>`;
  st += `<path d="M-700 -230 Q0 -258 700 -230 Q760 -160 640 -100 Q0 -60 -640 -100 Q-760 -160 -700 -230Z" fill="${C.poco}"/>`;
  st += `<path d="M-500 -180 h220 M-120 -140 h300 M240 -200 h200 M-330 -100 h180 M300 -110 h160" stroke="${C.pocoClaro}" stroke-width="8" stroke-linecap="round" class="reflexo"/>`;
  // dois fios d'água
  for (const [qx, top] of [[-260, -550], [420, -570]]) {
    st += `<path d="M${qx - 14} ${top} Q${qx - 18} ${(top - 260) / 2} ${qx - 10} -262 H${qx + 12} Q${qx + 18} ${(top - 260) / 2} ${qx + 14} ${top}Z" fill="${cor.branco}"/>`;
    st += `<path d="M${qx - 3} ${top} V-262" stroke="${cor.agua}" stroke-width="7" stroke-dasharray="22 24" class="agua"/>`;
    st += `<ellipse cx="${qx}" cy="-262" rx="58" ry="13" fill="${cor.branco}" opacity=".9" class="respingo"/>`;
    st += `<ellipse cx="${qx}" cy="-250" rx="90" ry="12" fill="none" stroke="${C.pocoClaro}" stroke-width="5" class="reflexo"/>`;
  }
  // pedras chatas na frente
  st += pedra(-640, -10, 260, 90, 31, ['#8C8577', '#A9A294', '#6B655A']) + pedra(380, 0, 300, 120, 37, ['#8C8577', '#A9A294', '#6B655A']) + pedra(-200, 10, 200, 60, 41, ['#9A9384', '#B4AD9F', '#6B655A']);
  return `<g transform="translate(${f1(x)} ${f1(base)}) scale(${s})">${st}</g>`;
}

function bau(x) {
  const b = CHAO;
  return `<g id="bau">
    <rect x="${x - 95}" y="${b - 100}" width="190" height="100" rx="8" fill="${cor.terra}" stroke="${cor.branco}" stroke-width="6"/>
    <path d="M${x - 95} ${b - 50} H${x + 95}" stroke="${cor.dourado}" stroke-width="8"/>
    <path d="M${x - 60} ${b - 100} V${b} M${x + 60} ${b - 100} V${b}" stroke="${cor.dourado}" stroke-width="8"/>
    <rect x="${x - 14}" y="${b - 66}" width="28" height="32" rx="4" fill="${cor.amarelo}" stroke="${cor.branco}" stroke-width="3"/>
    <g id="bau-tampa"><path d="M${x - 98} ${b - 100} Q${x} ${b - 170} ${x + 98} ${b - 100}Z" fill="${cor.terracota}" stroke="${cor.branco}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M${x - 60} ${b - 100} Q${x - 60} ${b - 150} ${x - 50} ${b - 150} M${x + 60} ${b - 100} Q${x + 60} ${b - 150} ${x + 50} ${b - 150}" stroke="${cor.dourado}" stroke-width="8" fill="none"/></g>
    <ellipse id="bau-luz" cx="${x}" cy="${b - 110}" rx="80" ry="22" fill="${cor.amarelo}" opacity="0"/>
  </g>`;
}

// =====================================================================
export function construir(ctx) {
  const { viewW, cs } = ctx;
  const meio = viewW * 0.5 - cs;            // quanto à frente do Eremita fica o centro da tela
  const estreito = viewW < 900;
  const lx = (f, heroX, telaX) => (heroX - cs) * f + telaX;
  const faixa = (f, r, ext = 0) => [lx(f, r.ini - ext, -300), lx(f, r.fim + ext, viewW + 300)];
const bioma = (x0, x1, c, reg) => pedaco(x0, x1, c, 'bioma').replace('<svg ', `<svg data-reg="${reg}" `);
  const out = { longe: '', meio: '', chao: '', info: '', frente: '', nuvens: '', ceuInfo: '' };
  // fim do caminho: livro + formulário. No desktop largo o formulário cabe ao lado do livro;
  // senão o Eremita anda um pouco mais até a caixa de correio.
  const fim = {};
  fim.livroW = estreito ? Math.min(420, viewW - 40) : 700;
  fim.livroX = pos.final + (estreito ? meio : 260);
  fim.formW = estreito ? Math.min(420, viewW - 40) : 420;
  if (estreito) {
    fim.correio = pos.final + 560;
    fim.formX = fim.correio + meio;
  } else {
    fim.formX = fim.livroX + fim.livroW / 2 + 40 + fim.formW / 2;
    fim.correio = Math.max(pos.final, fim.formX + fim.formW / 2 + 40 - viewW + cs);
  }
  fim.caixaX = fim.formX + fim.formW / 2 - 60;
  if (!contato.chave) fim.correio = pos.final;
  const heroFim = fim.correio;
  const fimMundo = Math.max(heroFim, fim.caixaX) + viewW + 400;

  // ---------- nuvens ----------
  {
    const r = rng(77); let s = '';
    const x1 = lx(0.07, heroFim, viewW + 400);
    for (let x = -200; x < x1; x += 260 + r() * 300) s += nuvem(x, 120 + r() * 220, 180 + r() * 160, (x | 0) + 3);
    out.nuvens = pedaco(-400, x1 + 400, s);
  }

  // ---------- longe (f 0.18) ----------
  {
    const f = 0.18;
    let [a, b] = faixa(f, R.fuga, 900);
    out.longe += bioma(a, b, serra(a, b, 700, 200, ['#D8C6A2', '#C7B28A'], 3, 320) + serra(a, b, 760, 110, ['#C9B488', '#B49E73'], 4, 220), 'fuga');
    [a, b] = faixa(f, R.piramide, 900);
    out.longe += bioma(a, b, serra(a, b, 640, 330, ['#A7B0B3', '#8D989D'], 5, 360) + serra(a, b, 720, 220, ['#8E9A93', '#76837C'], 6, 300) + serra(a, b, 790, 120, ['#93A07C', '#7E8B68'], 7, 240), 'piramide');
    [a, b] = faixa(f, R.vale, 900);
    out.longe += bioma(a, b, serra(a, b, 680, 260, ['#A9B796', '#93A37F'], 8, 300) + serra(a, b, 770, 150, ['#7F956B', '#6B8159'], 9, 230), 'vale');
    [a, b] = faixa(f, R.retorno, 900);
    b = Math.max(b, lx(f, heroFim, viewW + 400));
    out.longe += bioma(a, b, serra(a, b, 700, 200, ['#E0A95E', '#CF9550'], 10, 320) + serra(a, b, 770, 120, ['#C98F4E', '#B57D40'], 11, 240), 'retorno');
  }

  // ---------- meio (f 0.5) ----------
  {
    const f = 0.5;
    // Cafezal: fileiras curvas de café
    let [a, b] = faixa(f, R.cafezal, 500); a = Math.min(a, -viewW);
    let s = `<rect x="${a}" y="770" width="${b - a}" height="230" fill="#C98D4A"/>`;
    for (let fila = 0; fila < 2; fila++) {
      const y0 = 770 + fila * 38, esc = 0.3 + fila * 0.1;
      for (let x = a; x < b; x += 70 + fila * 20) s += usar(['cafe1', 'cafe2', 'cafe3'][(x / 70 | 0) % 3], x, y0 + Math.sin(x / 160) * 14, esc);
    }
    out.meio += bioma(a, b, s, 'cafezal');
    // Fuga: campo aberto, pedras partidas, árvores soltas
    [a, b] = faixa(f, R.fuga, 500);
    s = `<rect x="${a}" y="720" width="${b - a}" height="280" fill="#D2B57E"/>`;
    { const r = rng(12); for (let x = a; x < b; x += 160 + r() * 200) { const k = r(); s += k < 0.25 ? usar('arvore2', x, 735, 0.55) : k < 0.6 ? pedra(x, 740, 90 + r() * 80, 50 + r() * 50, (x | 0), [cor.pedraClara, cor.osso, cor.pedra]) : usar('capim', x, 742, 1.1); } }
    out.meio += bioma(a, b, s, 'fuga');
    // Pirâmide: rochas e arbustos; a construção cresce no horizonte
    [a, b] = faixa(f, R.piramide, 500);
    s = `<rect x="${a}" y="730" width="${b - a}" height="270" fill="#9DA582"/>`;
    { const r = rng(21); for (let x = a; x < b; x += 180 + r() * 220) s += r() < 0.5 ? pedra(x, 745, 120 + r() * 90, 60 + r() * 60, (x | 0) + 1) : usar('capim', x, 748, 1.3); }
    const escPir = Math.min(1, Math.max(0.42, viewW / 1500));
    s += piramide(lx(f, pos.bau - meio, viewW * (estreito ? 0.62 : 0.6)), 742, escPir);
    out.meio += bioma(a, b, s, 'piramide');
    // Vale: árvores, samambaias e a cachoeira
    [a, b] = faixa(f, R.vale, 500);
    s = `<rect x="${a}" y="720" width="${b - a}" height="280" fill="#7E9A68"/>`;
    { const r = rng(31); for (let x = a; x < b; x += 150 + r() * 170) s += r() < 0.5 ? usar(r() < 0.5 ? 'arvore' : 'arvore2', x, 735, 0.7 + r() * 0.3) : usar('samambaia', x, 740, 0.9); }
    const escCach = Math.min(0.72, Math.max(0.5, viewW / 1800));
    s += cachoeira(lx(f, pos.sementes[2] - meio + 300, viewW * 0.5), 800, escCach);
    out.meio += bioma(a, b, s, 'vale');
    // Retorno: fileiras retas de café, agora com caminho aberto
    [a, b] = faixa(f, R.retorno, 500); b = Math.max(b, lx(f, heroFim, viewW + 400));
    s = `<rect x="${a}" y="700" width="${b - a}" height="300" fill="#C98D4A"/>`;
    for (let fila = 0; fila < 3; fila++) for (let x = a; x < b; x += 80) s += usar(['cafe2', 'cafe1', 'cafe3'][(x / 80 | 0) % 3], x + fila * 30, 700 + fila * 45, 0.32 + fila * 0.1);
    out.meio += bioma(a, b, s, 'retorno');
  }

  // ---------- chão (f 1) e informações ----------
  const solo = { cafezal: ['#8A5A3A', '#9C6A44'], fuga: ['#C9A36A', '#D8B57C'], piramide: ['#A39A86', '#BAB19C'], vale: ['#6A8A55', '#7F9D68'], retorno: ['#8A5A3A', '#9C6A44'] };
  const info = [];
  const H = (x, y, w, html, cls = '', extra = '') => info.push(`<div class="item ${cls}" style="left:${f1(x - w / 2)}px;top:${f1(y)}px;width:${f1(w)}px" ${extra}>${html}</div>`);

  for (const reg of regioes) {
    let a = reg.ini - 300, b = reg.fim + 300;
    if (reg.id === 'cafezal') a = -viewW - 200;
    if (reg.id === 'retorno') b = fimMundo;
    const [c1, c2] = solo[reg.id];
    let s = `<rect x="${a}" y="${CHAO}" width="${b - a}" height="${1000 - CHAO}" fill="${cor.terra}"/>`;
    s += `<rect x="${a}" y="${CHAO}" width="${b - a}" height="34" fill="${c1}"/><rect x="${a}" y="${CHAO}" width="${b - a}" height="10" fill="${c2}"/>`;
    // borda branca ondulada (o traço da capa)
    let d = `M${a} ${CHAO}`; const r = rng(reg.ini + 5);
    for (let x = a; x < b; x += 40) d += ` L${x + 40} ${f1(CHAO + (r() - 0.5) * 4)}`;
    s += `<path d="${d}" stroke="${cor.branco}" stroke-width="4" fill="none"/>`;
    // sulcos com semente (o glifo do livro)
    for (let x = Math.ceil(a / 620) * 620; x < b; x += 620) s += `<use href="#glifo" x="${x}" y="${905 + ((x / 620) % 2) * 30}" width="420" height="76" color="${cor.osso}" opacity=".35"/>`;

    if (reg.id === 'cafezal') {
      for (let x = a; x < reg.fim + 200; x += 290) if (Math.abs(x - pos.inicio) > 140) s += usar(['cafe1', 'cafe3', 'cafe2'][Math.abs(x / 290 | 0) % 3], x, CHAO + 4, 0.95);
    }
    if (reg.id === 'fuga') {
      s += placa(pos.placaHab, 250);
      H(pos.placaHab, CHAO - 300, 230, `<span class="tabua">Habilidades</span>`, 'placa');
      habilidades.forEach((h, i) => {
        const x = pos.habilidades[i], alt = estreito ? 100 + h.nivel * 28 : 120 + h.nivel * 34, topo = CHAO - alt;
        let pl = `<path d="M${x} ${CHAO} C${x - 16} ${CHAO - alt * 0.35},${x + 16} ${CHAO - alt * 0.65},${x} ${topo}" stroke="${cor.branco}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
        pl += `<path d="M${x} ${CHAO} C${x - 16} ${CHAO - alt * 0.35},${x + 16} ${CHAO - alt * 0.65},${x} ${topo}" stroke="${cor.salviaEsc}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
        for (let k = 1; k <= Math.floor(h.nivel / 2); k++) {
          const y = CHAO - alt * (k / (h.nivel / 2 + 1)), lado = k % 2 ? 1 : -1, c = 52 - k * 2;
          pl += `<g transform="translate(${x} ${f1(y)}) rotate(${lado > 0 ? -28 : 208})"><path d="M0 0 C${c * .25} ${-c * .28},${c * .7} ${-c * .28},${c} 0 C${c * .7} ${c * .28},${c * .25} ${c * .28},0 0Z" fill="${k % 3 ? cor.folha : cor.folhaClara}" stroke="${cor.branco}" stroke-width="4"/></g>`;
        }
        pl += `<circle cx="${x}" cy="${topo - 44}" r="50" fill="${cor.terracota}" stroke="${cor.branco}" stroke-width="7"/>`;
        pl += `<g transform="translate(${x - 30} ${topo - 74}) scale(.6)">${icone(h.icone)}</g>`;
        // sementes acesas de 0 a 10
        for (let k = 0; k < 10; k++) {
          const sx = x - 99 + k * 22, sy = topo - 128, aceso = k < h.nivel;
          pl += `<path class="sem ${aceso ? 'acesa' : ''}" d="M${sx} ${sy - 12} C${sx + 9} ${sy - 4},${sx + 9} ${sy + 6},${sx} ${sy + 12} C${sx - 9} ${sy + 6},${sx - 9} ${sy - 4},${sx} ${sy - 12}Z" fill="${aceso ? cor.dourado : 'none'}" stroke="${aceso ? cor.branco : cor.terra}" stroke-width="${aceso ? 3 : 2.5}" opacity="${aceso ? 1 : 0.55}"/>`;
        }
        s += `<g class="planta-hab" id="hab-${i}" data-x="${x}">${pl}</g>`;
        H(x, topo - 290, 250, `<strong>${h.nome}</strong><span class="nivel" aria-label="nível ${h.nivel} de 10">${h.nivel}<small>/10</small></span>`, 'rot-hab', `id="hab-rot-${i}"`);
        if (h.nota) H(x + 90, CHAO - alt * 0.45, 140, `<span class="etiqueta">${h.nota}</span>`, 'rot-nota', `id="hab-nota-${i}"`);
      });
    }
    if (reg.id === 'piramide') {
      s += placa(pos.placaTempo, 250);
      H(pos.placaTempo, CHAO - 300, 260, `<span class="tabua">Formação e experiência</span>`, 'placa');
      H(pos.placaTempo, CHAO - 430, 260, `<span class="legenda"><svg viewBox="-60 -40 120 90" class="ico">${pergaminho(0, 0, .9)}</svg> formação <svg viewBox="0 0 100 100" class="ico"><circle cx="50" cy="50" r="44" fill="${cor.terra}"/>${icone('camadas')}</svg> trabalho</span>`, 'placa');
      linhaDoTempo.forEach((it, i) => {
        const x = pos.tempo[i];
        const grande = it.objeto === 'escola';
        // no celular a pedra com o ano vai para a direita (o Eremita fica à esquerda)
        const px = estreito ? x + (grande ? 150 : 95) : x - (grande ? 175 : 95);
        const ox = estreito ? x - (grande ? 55 : 45) : x + (grande ? 40 : 30);
        const esc = estreito && grande ? 0.72 : 1;
        s += pedra(px - 75, CHAO + 2, 150, 130, i * 7 + 3, [cor.pedra, cor.pedraClara, cor.pedraEsc]);
        s += `<text x="${px}" y="${CHAO - 38}" text-anchor="middle" class="svg-ano" font-size="44" fill="${cor.carvao}">${it.ano}</text>`;
        if (it.ate) s += `<text x="${px}" y="${CHAO - 12}" text-anchor="middle" class="svg-texto" font-size="22" fill="${cor.carvao}">até ${it.ate}</text>`;
        if (it.tipo === 'formacao') s += pergaminho(px, CHAO - 150, 0.9);
        s += `<g class="obj-tempo" id="tempo-${i}"><g transform="translate(${ox} ${CHAO}) scale(${esc}) translate(${-ox} ${-CHAO})">${objeto(it.objeto, ox)}</g></g>`;
        // janelas em alturas diferentes, presas ao objeto por um fio pontilhado
        const sobe = (estreito ? [0, 95, 40, 120, 20, 75] : [0, 175, 80, 210, 35, 140])[i % 6];
        const topo = (grande ? CHAO - 470 : CHAO - 390) - sobe;
        const altObj = { camera: 115, filme: 190, prancheta: 250, cristal: 190, livro: 110, provas: 180, escola: 320 * esc, pergaminho: 90 }[it.objeto] || 150;
        s += `<path d="M${x - 20} ${topo + 118} Q${(x - 20 + ox) / 2} ${(topo + 118 + CHAO - altObj) / 2 + 30} ${ox} ${CHAO - altObj - 6}" stroke="${cor.terra}" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round" fill="none" opacity=".55"/>`;
        s += `<circle cx="${ox}" cy="${CHAO - altObj - 6}" r="6" fill="${cor.dourado}" stroke="${cor.branco}" stroke-width="2"/>`;
        H(x - 20, topo, estreito ? 300 : 320,
          `<button class="cartao-tempo ${it.tipo}" data-painel="tempo-${i}"><span class="tipo">${it.tipo === 'formacao' ? 'Formação' : 'Trabalho'}</span><strong>${it.titulo}</strong><span class="local">${it.local}</span><span class="mais" aria-hidden="true">+</span></button>`, 'rot-tempo');
      });
      s += bau(pos.bau);
      const areas = resumoCursos(), total = areas.reduce((t, a) => t + a.n, 0);
      areas.forEach((ar, k) => {
        const ang = Math.PI * (1 - (k + 0.5) / areas.length), raio = 230;
        // no celular as insígnias ficam em duas fileiras, longe do Eremita
        const bx = estreito ? pos.bau - 22 + (k < 4 ? (k - 1.5) * 84 : (k - 5) * 84) : pos.bau + Math.cos(ang) * raio;
        const by = estreito ? CHAO - (k < 4 ? 455 : 362) : CHAO - 170 - Math.sin(ang) * raio * 0.9;
        s += `<g class="insignia" id="ins-${k}"><line x1="${pos.bau}" y1="${CHAO - 110}" x2="${f1(bx)}" y2="${f1(by)}" stroke="${cor.dourado}" stroke-width="3" stroke-dasharray="4 8" opacity=".7"/>
          <circle cx="${f1(bx)}" cy="${f1(by)}" r="40" fill="${ar.cor}" stroke="${cor.branco}" stroke-width="6"/><g transform="translate(${f1(bx - 21)} ${f1(by - 21)}) scale(.42)">${icone(ar.icone)}</g>
          <rect x="${f1(bx + 14)}" y="${f1(by + 16)}" width="${ar.n > 9 ? 50 : 40}" height="30" rx="15" fill="${cor.branco}"/><text x="${f1(bx + 14 + (ar.n > 9 ? 25 : 20))}" y="${f1(by + 38)}" text-anchor="middle" class="svg-texto" font-size="21" fill="${cor.carvao}">×${ar.n}</text></g>`;
        // botão invisível sobre a insígnia: ao passar o mouse mostra os nomes dos cursos
        H(bx, by - 46, 92, `<button class="insignia-btn" data-area="${ar.id}" data-painel="bau" aria-label="${ar.nome}: ${ar.n} cursos. Abrir a lista completa" aria-describedby="tip-cursos"></button>`, 'rot-insignia');
      });
      H(pos.bau, CHAO - 90, 200, `<button class="botao-bau" data-painel="bau" aria-label="Abrir o baú: ${total} cursos complementares"><span>${total} cursos</span></button>`, 'rot-bau');
      H(estreito ? pos.bau - 22 : pos.bau, estreito ? CHAO - 610 : CHAO - 560, estreito ? 280 : 320, `<strong class="titulo-bau">Baú de cursos</strong><span class="local">2001 a 2026 · toque no baú</span>`, 'rot-bau-titulo');
    }
    if (reg.id === 'vale') {
      s += placa(pos.placaVale, 250);
      H(pos.placaVale, CHAO - 300, 220, `<span class="tabua">Projetos</span>`, 'placa');
      for (let x = a; x < b; x += 340) s += usar(x % 680 ? 'samambaia2' : 'samambaia', x + 120, CHAO + 6, 0.8);
      projetos.forEach((p, i) => {
        const x = pos.sementes[i];
        s += `<g class="semente-chao" id="sem-${i}"><ellipse cx="${x}" cy="${CHAO + 4}" rx="34" ry="8" fill="${cor.terraEsc}" opacity=".4"/>
          <circle class="sem-halo" cx="${x}" cy="${CHAO - 22}" r="34" fill="${cor.amarelo}" opacity=".35"/>
          <path d="M${x} ${CHAO - 48} C${x + 20} ${CHAO - 32},${x + 20} ${CHAO - 10},${x} ${CHAO} C${x - 20} ${CHAO - 10},${x - 20} ${CHAO - 32},${x} ${CHAO - 48}Z" fill="${cor.dourado}" stroke="${cor.branco}" stroke-width="5"/></g>`;
        const topo = estreito ? 400 : 390;
        s += `<g class="broto" id="broto-${i}"><path d="M${x} ${CHAO} C${x - 30} ${CHAO - 120},${x + 30} ${topo + 200},${x} ${topo + 60}" stroke="${cor.branco}" stroke-width="16" fill="none" stroke-linecap="round"/>
          <path d="M${x} ${CHAO} C${x - 30} ${CHAO - 120},${x + 30} ${topo + 200},${x} ${topo + 60}" stroke="${cor.salviaEsc}" stroke-width="9" fill="none" stroke-linecap="round"/>
          <g transform="translate(${x} ${CHAO - 120}) rotate(-30)"><path d="M0 0 C15 -18,48 -18,64 0 C48 18,15 18,0 0Z" fill="${cor.folha}" stroke="${cor.branco}" stroke-width="4"/></g>
          <g transform="translate(${x} ${CHAO - 200}) rotate(205)"><path d="M0 0 C15 -18,48 -18,64 0 C48 18,15 18,0 0Z" fill="${cor.folhaClara}" stroke="${cor.branco}" stroke-width="4"/></g></g>`;
        H(x, topo - 175, 250, `<strong class="fruto-nome">${p.nome}</strong><span class="local">${p.categoria}</span><button class="fruto" data-painel="proj-${i}" id="fruto-${i}" aria-label="Projeto ${p.nome}: abrir detalhes"><span class="fruto-img"><img src="${p.capa}" alt="" loading="lazy" decoding="async"></span></button>`, 'rot-fruto', `id="rot-fruto-${i}"`);
      });
    }
    if (reg.id === 'retorno') {
      s += placa(pos.placaRetorno, 250);
      H(pos.placaRetorno, CHAO - 300, 260, `<span class="tabua">De volta ao Cafezal</span>`, 'placa');
      for (let x = reg.ini - 200; x < b; x += 300) if (x < pos.canteiro - 300 || x > fimMundo) s += usar(['cafe2', 'cafe1', 'cafe3'][Math.abs(x / 300 | 0) % 3], x, CHAO + 4, 0.95);
      // canteiro onde as sementes são plantadas
      const cx = pos.canteiro;
      s += `<rect x="${cx - 250}" y="${CHAO - 30}" width="500" height="40" rx="10" fill="${cor.terraEsc}" stroke="${cor.branco}" stroke-width="5"/>`;
      for (let k = 0; k < 6; k++) {
        const x = cx - 200 + k * 80;
        s += `<use href="#glifo" x="${x - 34}" y="${CHAO - 26}" width="68" height="12" color="${cor.osso}" opacity=".6"/>`;
        s += `<g class="muda" id="muda-${k}"><path d="M${x} ${CHAO - 26} C${x - 6} ${CHAO - 70},${x + 6} ${CHAO - 90},${x} ${CHAO - 120}" stroke="${cor.salviaEsc}" stroke-width="7" fill="none" stroke-linecap="round"/>
          <g transform="translate(${x} ${CHAO - 100}) rotate(-35)"><path d="M0 0 C10 -12,32 -12,42 0 C32 12,10 12,0 0Z" fill="${cor.folha}" stroke="${cor.branco}" stroke-width="3"/></g>
          <g transform="translate(${x} ${CHAO - 116}) rotate(210)"><path d="M0 0 C10 -12,32 -12,42 0 C32 12,10 12,0 0Z" fill="${cor.folhaClara}" stroke="${cor.branco}" stroke-width="3"/></g>
          <circle cx="${x}" cy="${CHAO - 124}" r="9" fill="${cor.dourado}" stroke="${cor.branco}" stroke-width="3"/></g>`;
      }
      H(cx, CHAO - 260, 260, `<strong class="titulo-canteiro"><span id="plantadas">0</span> de 6 sementes plantadas</strong>`, 'rot-canteiro');
      s += `<polygon id="raio-luz" points="${pos.final - 40},${CHAO - 300} ${pos.final - 40},${CHAO - 280} ${cx + 260},${CHAO - 20} ${cx - 260},${CHAO - 20}" fill="${cor.amarelo}" opacity="0"/>`;
      // o livro
      const lw = estreito ? 104 : 240, ly = estreito ? 78 : 120;
      H(fim.livroX, ly, fim.livroW,
        `<div class="final ${estreito ? 'final-estreito' : ''}">
          <img class="capa-livro" src="${livro.capa}" alt="Capa do livro O Curador de Sementes, de Carlos Tobo" style="width:${lw}px" loading="lazy">
          <div class="final-texto"><p class="frase-livro">${livro.frase}</p>
          ${livro.links.map((l) => `<a class="cta ${l.icone === 'insta' ? 'cta-insta' : ''}" href="${l.url}" target="_blank" rel="noopener"><svg viewBox="0 0 100 100" aria-hidden="true">${icone(l.icone)}</svg><span>${l.texto}<small>${l.sub}</small></span></a>`).join('')}
          ${contato.chave && fim.correio > pos.final ? `<button class="cta cta-msg" data-correio><svg viewBox="0 0 100 100" aria-hidden="true">${icone('carta')}</svg><span>Mandar mensagem<small>${estreito ? 'logo ali, na caixa de correio' : 'no formulário ao lado'}</small></span></button>` : ''}
          </div></div>`, 'rot-final');
      // xícara de café: volta ao começo do caminho
      const xx = estreito ? heroFim + viewW * 0.56 - cs : fim.livroX + fim.livroW / 2 - 70;
      H(xx, CHAO - 168, 150, `<button class="xicara" data-ir="${pos.inicio}" aria-label="Voltar ao início do caminho">${xicara()}<span>voltar ao início</span></button>`, 'rot-xicara');
      // caixa de correio e o formulário, direto no cenário (sem janela por cima)
      if (contato.chave) {
        s += caixaCorreio(fim.caixaX);
        H(fim.formX, estreito ? 92 : 120, fim.formW, formulario(estreito), 'rot-form', 'id="correio"');
      }
    }
    out.chao += pedaco(a, b, s);
  }
  out.info = info.join('');

  // ---------- frente (f 1.35) ----------
  {
    const f = 1.35, r = rng(55);
    for (const reg of regioes) {
      let [a, b] = faixa(f, reg);
      if (reg.id === 'cafezal') a = Math.min(a, -viewW);
      if (reg.id === 'retorno') b = Math.max(b, lx(f, heroFim, viewW + 400));
      let s = '';
      for (let x = a; x < b; x += 240 + r() * 380) {
        const k = r();
        if (reg.id === 'cafezal' || reg.id === 'retorno') s += k < 0.5 ? usar('cafe2', x, 1090, 0.6) : usar('capim2', x, 1004, 1.6);
        else if (reg.id === 'vale') s += k < 0.6 ? usar('samambaia', x, 1030, 1) : usar('capim', x, 1004, 1.6);
        else if (reg.id === 'piramide') s += k < 0.5 ? pedra(x, 1010, 160, 90, (x | 0), [cor.pedraEsc, cor.pedra, cor.carvao]) : usar('capim', x, 1004, 1.6);
        else s += k < 0.5 ? usar('capim2', x, 1004, 1.7) : pedra(x, 1010, 140, 80, (x | 0), [cor.pedraClara, cor.osso, cor.pedra]);
      }
      out.frente += pedaco(a, b, s);
    }
  }

  // ---------- abertura no céu (f 0.3) ----------
  {
    const w = Math.min(estreito ? viewW - 40 : 860, viewW - 80);
    const cx = estreito ? viewW * 0.5 : Math.min(viewW * 0.6, viewW - w / 2 - 40);
    const sol = estreito ? 210 : 300;
    out.ceuInfo = `<svg class="pedaco" data-x0="${cx - sol - 20}" data-x1="${cx + sol + 20}" style="left:${cx - sol - 20}px;width:${2 * sol + 40}px" viewBox="${cx - sol - 20} 0 ${2 * sol + 40} 1000" aria-hidden="true">
        <circle id="sol" cx="${cx}" cy="${estreito ? 300 : 360}" r="${sol}" fill="${cor.osso}" opacity=".55"/><circle cx="${cx}" cy="${estreito ? 300 : 360}" r="${sol - 18}" fill="none" stroke="${cor.branco}" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round" opacity=".9"/></svg>
      <div class="item abertura ${estreito ? 'estreito' : ''}" style="left:${cx - w / 2}px;top:${estreito ? 105 : 170}px;width:${w}px">
        <h1 class="nome">Carlos Tobo</h1>
        <p class="titulo">Comunicólogo, professor de design e linguagem e escritor</p>
        <p class="frase">${'Entre a palavra e o design, planto histórias, ensino caminhos e desenho mundos.'.split(' ').map((p) => `<span class="pal">${p}</span>`).join(' ')}</p>
      </div>`;
  }

  // paradas do Eremita (para as setas do teclado e a reação de chegada)
  const paradas = [
    { x: pos.inicio, id: 'inicio' },
    { x: pos.quebra + 140, id: 'quebra' },
    { x: pos.placaHab - 40, id: 'hab' },
    ...pos.habilidades.map((x, i) => ({ x: x - meio, id: 'hab-' + i })),
    { x: pos.placaTempo - 40, id: 'tempo' },
    ...pos.tempo.map((x, i) => ({ x: x - 20 - meio, id: 'tempo-' + i })),
    // o baú fica à direita do Eremita o bastante para nenhuma insígnia ficar atrás dele
    { x: pos.bau - (estreito ? viewW * 0.6 - cs : Math.max(meio, 300)), id: 'bau' },
    { x: pos.placaVale - 40, id: 'vale' },
    ...pos.sementes.map((x, i) => ({ x: x + 30, id: 'sem-' + i })),
    { x: pos.canteiro - meio, id: 'canteiro' },
    { x: pos.final, id: 'final' },
    ...(fim.correio > pos.final ? [{ x: fim.correio, id: 'correio' }] : [])
  ];
  return { out, paradas, meio, heroMax: heroFim, correio: fim.correio };
}

// formulário de mensagem que fica no cenário final
function formulario(estreito) {
  return `<form class="form-contato form-final ${estreito ? 'estreito' : ''}" novalidate aria-labelledby="form-titulo">
    <p class="painel-cat">Correio do Curador</p>
    <h2 id="form-titulo">Mande uma mensagem</h2>
    ${estreito ? '' : '<p class="form-intro">Uma dúvida, um convite, uma conversa sobre o livro ou um projeto: escreva que chega até mim.</p>'}
    <label>Seu nome<input name="nome" autocomplete="name" required maxlength="80"></label>
    <label>Seu e-mail <small>(para eu responder)</small><input name="email" type="email" autocomplete="email" required maxlength="120"></label>
    <label>Mensagem<textarea name="mensagem" rows="${estreito ? 3 : 4}" required maxlength="3000"></textarea></label>
    <input type="checkbox" name="botcheck" class="armadilha" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button class="cta" type="submit"><svg viewBox="0 0 100 100" aria-hidden="true">${icone('carta')}</svg><span>Enviar</span></button>
    <p class="form-status" role="status" aria-live="polite"></p>
  </form>`;
}

// caixa de correio de madeira, com a bandeirinha terracota
function caixaCorreio(x) {
  const b = CHAO;
  return `<g id="caixa-correio"><rect x="${x - 7}" y="${b - 150}" width="14" height="150" fill="${cor.terra}" stroke="${cor.branco}" stroke-width="4"/>
    <path d="M${x - 62} ${b - 150} V${b - 210} Q${x - 62} ${b - 250} ${x - 22} ${b - 250} H${x + 52} Q${x + 62} ${b - 250} ${x + 62} ${b - 210} V${b - 150}Z" fill="${cor.salviaEsc}" stroke="${cor.branco}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M${x - 62} ${b - 210} Q${x - 62} ${b - 250} ${x - 22} ${b - 250} Q${x + 18} ${b - 250} ${x + 18} ${b - 210} V${b - 150} H${x - 62}Z" fill="#3B4E35"/>
    <ellipse cx="${x - 22}" cy="${b - 190}" rx="22" ry="26" fill="${cor.terraEsc}"/>
    <path d="M${x - 40} ${b - 196} l18 -10 l18 10 v18 h-36z" fill="${cor.osso}" stroke="${cor.terra}" stroke-width="2"/>
    <g id="bandeira-correio"><rect x="${x + 50}" y="${b - 245}" width="8" height="70" fill="${cor.terra}"/><rect x="${x + 58}" y="${b - 245}" width="34" height="22" rx="3" fill="${cor.terracota}" stroke="${cor.branco}" stroke-width="3"/></g>
    ${usar('capim', x - 40, b + 4, 0.9)}${usar('capim', x + 50, b + 4, 0.8)}</g>`;
}

// ---------- espiral do Cafezal Infinito (camada quase parada: f 0.04) ----------
export function construirEspiral(viewW) {
  const estreito = viewW < 900;
  const cx = estreito ? viewW * 0.6 : viewW * 0.62, cy = estreito ? 670 : 590;
  const Rm = estreito ? 300 : Math.min(620, viewW * 0.36);
  const N = 56, tMax = 5.2 * Math.PI;
  let s = `<polygon points="${-viewW},700 ${cx - Rm * 1.6},560 ${cx - Rm * 0.5},520 ${cx + Rm * 0.7},540 ${cx + Rm * 1.7},590 ${viewW * 2},680 ${viewW * 2},1000 ${-viewW},1000" fill="#D9A35A"/>`;
  s += `<polygon points="${cx - Rm * 0.5},520 ${cx + Rm * 0.7},540 ${cx + Rm * 0.3},640 ${cx - Rm * 0.9},650" fill="#E4B36A" opacity=".8"/>`;
  s += `<g id="esp-disco"><ellipse cx="${cx}" cy="${cy}" rx="${Rm * 1.08}" ry="${Rm * 0.34}" fill="#B9773F" stroke="${cor.branco}" stroke-width="5"/>
        <polyline id="esp-sulco" points="" fill="none" stroke="${cor.osso}" stroke-width="5" stroke-linecap="round" opacity=".8"/></g>`;
  // cacos (a espiral se parte como as pedras da capa)
  const cacos = [];
  const r = rng(404);
  const fatias = 9;
  for (let i = 0; i < fatias; i++) {
    for (let anel = 0; anel < 2; anel++) {
      const a0 = (i / fatias) * Math.PI * 2 + r() * 0.1, a1 = ((i + 1) / fatias) * Math.PI * 2 + r() * 0.1;
      const r0 = anel ? 0.5 + r() * 0.1 : 0, r1 = anel ? 1.08 : 0.55 + r() * 0.1;
      const pts = [[a0, r0], [a1, r0], [a1, r1], [(a0 + a1) / 2, r1 * (0.95 + r() * 0.1)], [a0, r1]]
        .map(([a, rr]) => [cx + Math.cos(a) * rr * Rm, cy + Math.sin(a) * rr * Rm * 0.34]);
      const mx = cx + Math.cos((a0 + a1) / 2) * (r0 + r1) / 2 * Rm, my = cy + Math.sin((a0 + a1) / 2) * (r0 + r1) / 2 * Rm * 0.34;
      const tom = [cor.carvao, cor.pedra, cor.pessego, cor.pedraClara, '#B9773F'][(i + anel) % 5];
      cacos.push({ mx, my, ang: (a0 + a1) / 2, rot: (r() - 0.5) * 140, dist: 300 + r() * 500 });
      s += `<polygon class="caco" points="${pts.map((p) => p.map(f1).join(',')).join(' ')}" fill="${tom}" stroke="${cor.branco}" stroke-width="4" stroke-linejoin="round" opacity="0"/>`;
    }
  }
  const plantas = [];
  for (let i = 0; i < N; i++) plantas.push({ t: 1.4 + (i / (N - 1)) * (tMax - 1.4), id: ['cafe1', 'cafe2', 'cafe3'][i % 3] });
  s += `<g id="esp-plantas">${plantas.map((p) => `<use href="#${p.id}"/>`).join('')}</g>`;
  const html = `<svg class="pedaco" data-x0="${-viewW}" data-x1="${viewW * 2}" style="left:${-viewW}px;width:${viewW * 3}px" viewBox="${-viewW} 0 ${viewW * 3} 1000" aria-hidden="true">${s}</svg>`;
  return { html, cx, cy, Rm, tMax, plantas, cacos };
}
