// Biblioteca de desenhos em SVG, no estilo da capa de O Curador de Sementes:
// formas chapadas, recortes de pedra e contorno branco de "adesivo".

export const cor = {
  terra: '#4A2F20', terraEsc: '#2E1D14', terracota: '#C8553A', osso: '#F1E9DA',
  salvia: '#8FA37E', salviaEsc: '#4F6647', folha: '#3F6B3A', folhaClara: '#6A9256',
  dourado: '#E8B54A', pessego: '#F0C07C', amarelo: '#E5C22E', roxo: '#4B2A5A',
  pedra: '#BDBCB5', pedraClara: '#DAD6CC', pedraEsc: '#8E918C', carvao: '#2B2A28',
  branco: '#FFFDF8', cereja: '#B8312A', agua: '#A9C7C0'
};

// Gerador pseudoaleatório com semente, para o cenário sair igual sempre
export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const f = (n) => Math.round(n * 10) / 10;

// Folha pontuda (base na origem, apontando para +x)
function folha(comp, larg, fill, rot, x, y, contorno = true) {
  const d = `M0 0 C${f(comp * .25)} ${f(-larg)},${f(comp * .7)} ${f(-larg)},${comp} 0 C${f(comp * .7)} ${f(larg)},${f(comp * .25)} ${f(larg)},0 0Z`;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">` +
    (contorno ? `<path d="${d}" fill="${cor.branco}" stroke="${cor.branco}" stroke-width="7" stroke-linejoin="round"/>` : '') +
    `<path d="${d}" fill="${fill}"/><path d="M2 0 L${f(comp * .85)} 0" stroke="${cor.carvao}" stroke-opacity=".45" stroke-width="1.6"/></g>`;
}

// Pé de café: caule, pares de folhas pontudas e cachos de frutos vermelhos
function pedeCafe(seed, alt = 200) {
  const r = rng(seed);
  let s = `<path d="M0 0 C-4 ${-alt * .4},4 ${-alt * .7},0 ${-alt}" stroke="${cor.branco}" stroke-width="11" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M0 0 C-4 ${-alt * .4},4 ${-alt * .7},0 ${-alt}" stroke="${cor.terra}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const niveis = 6;
  for (let i = 0; i < niveis; i++) {
    const y = -alt * (0.18 + i * 0.15);
    const comp = 70 - i * 8 + r() * 10;
    const tons = [cor.folha, cor.folhaClara, cor.salviaEsc];
    s += folha(comp, comp * .26, tons[i % 3], -10 - r() * 25, 0, y);
    s += folha(comp * .95, comp * .25, tons[(i + 1) % 3], 190 + r() * 25, 0, y - 8);
    if (i < 4) {
      for (let b = 0; b < 4; b++) {
        const bx = (r() - .5) * 18, by = y + 6 + r() * 10;
        s += `<circle cx="${f(bx)}" cy="${f(by)}" r="7" fill="${cor.branco}"/><circle cx="${f(bx)}" cy="${f(by)}" r="5" fill="${b % 2 ? cor.cereja : cor.terracota}"/>`;
      }
    }
  }
  s += folha(30, 9, cor.folhaClara, -90, 0, -alt + 4);
  return s;
}

// Samambaia: haste curva com folíolos
function samambaia(seed, alt = 170) {
  const r = rng(seed);
  let s = '';
  for (let k = 0; k < 3; k++) {
    const inc = (k - 1) * 28 + (r() - .5) * 10;
    s += `<g transform="rotate(${f(inc)})">`;
    s += `<path d="M0 0 Q 10 ${-alt * .5} 30 ${-alt}" stroke="${cor.salviaEsc}" stroke-width="4" fill="none"/>`;
    for (let i = 1; i < 12; i++) {
      const t = i / 12, x = 30 * t * t, y = -alt * t, c = 34 * (1 - t) + 8;
      s += folha(c, c * .3, k === 1 ? cor.folha : cor.salviaEsc, -60, x, y, false);
      s += folha(c, c * .3, k === 1 ? cor.folha : cor.salviaEsc, -120 - 10, x, y, false);
    }
    s += '</g>';
  }
  return s;
}

function capim(seed, alt = 70, tom = cor.salviaEsc) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < 9; i++) {
    const x = (i - 4) * 6, h = alt * (.5 + r() * .6), dx = (r() - .5) * 50;
    s += `<path d="M${x - 3} 0 Q ${f(x + dx * .3)} ${f(-h * .6)} ${f(x + dx)} ${f(-h)} Q ${f(x + dx * .3 + 3)} ${f(-h * .5)} ${x + 4} 0Z" fill="${i % 3 ? tom : cor.salvia}"/>`;
  }
  return s;
}

// Pedra facetada, como os recortes da capa
export function pedra(x, y, w, h, seed, tons = [cor.pedra, cor.pedraClara, cor.pedraEsc]) {
  const r = rng(seed);
  const pts = [[0, 0], [w * (.1 + r() * .1), -h * (.7 + r() * .3)], [w * (.45 + r() * .1), -h], [w * (.85 + r() * .1), -h * (.6 + r() * .3)], [w, 0]];
  const p = pts.map(([a, b]) => `${f(x + a)},${f(y + b)}`).join(' ');
  const mx = x + pts[2][0], my = y + pts[2][1];
  return `<polygon points="${p}" fill="${tons[0]}"/>` +
    `<polygon points="${f(mx)},${f(my)} ${f(x + pts[3][0])},${f(y + pts[3][1])} ${f(x + w)},${f(y)} ${f(x + w * .55)},${f(y)}" fill="${tons[2]}" opacity=".55"/>` +
    `<polygon points="${f(x + pts[1][0])},${f(y + pts[1][1])} ${f(mx)},${f(my)} ${f(x + w * .4)},${f(y - h * .45)}" fill="${tons[1]}" opacity=".8"/>`;
}

function arvore(seed, alt = 380) {
  const r = rng(seed);
  let s = `<path d="M-10 0 L-6 ${-alt * .55} L6 ${-alt * .55} L12 0Z" fill="${cor.terra}"/>`;
  const copa = [];
  for (let i = 0; i < 7; i++) copa.push([(r() - .5) * 170, -alt * .55 - r() * alt * .45, 50 + r() * 45]);
  for (const [cx, cy, rr] of copa) s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rr + 6)}" fill="${cor.branco}"/>`;
  copa.forEach(([cx, cy, rr], i) => { s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rr)}" fill="${[cor.folha, cor.salviaEsc, cor.folhaClara][i % 3]}"/>`; });
  return s;
}

function borboleta(c1, c2) {
  return `<g class="asa asa-e"><path d="M0 0 C-30 -40,-55 -20,-40 0 C-50 15,-30 35,0 6Z" fill="${c1}" stroke="${cor.branco}" stroke-width="3"/><circle cx="-30" cy="-12" r="5" fill="${c2}"/></g>` +
    `<g class="asa asa-d"><path d="M0 0 C30 -40,55 -20,40 0 C50 15,30 35,0 6Z" fill="${c1}" stroke="${cor.branco}" stroke-width="3"/><circle cx="30" cy="-12" r="5" fill="${c2}"/></g>` +
    `<rect x="-3" y="-14" width="6" height="26" rx="3" fill="${cor.carvao}"/>`;
}

// Ícones simples (caixa 100x100, traço branco sobre disco colorido)
export function icone(nome, c = cor.branco) {
  const t = `fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
  switch (nome) {
    case 'camadas': return `<g ${t}><path d="M50 18 L84 36 L50 54 L16 36Z"/><path d="M16 52 L50 70 L84 52"/><path d="M16 66 L50 84 L84 66"/></g>`;
    case 'cursor': return `<g ${t}><rect x="14" y="18" width="72" height="54" rx="6"/><path d="M14 32 H86"/><path d="M52 50 L52 88 L62 78 L70 92 L76 89 L68 76 L82 74Z" fill="${c}"/></g>`;
    case 'paleta': return `<g ${t}><path d="M50 14 C24 14 12 34 14 52 C16 74 34 86 50 86 C58 86 60 78 56 72 C52 66 56 60 64 60 L74 60 C84 60 88 52 86 42 C82 24 68 14 50 14Z"/></g><circle cx="34" cy="40" r="6" fill="${c}"/><circle cx="52" cy="30" r="6" fill="${c}"/><circle cx="70" cy="40" r="6" fill="${c}"/>`;
    case 'trilha': return `<g ${t}><path d="M20 84 C20 60 50 64 50 46 C50 30 74 32 80 16"/><circle cx="20" cy="84" r="5" fill="${c}"/></g><path d="M74 10 L86 10 L86 22" ${t}/>`;
    case 'codigo': return `<g ${t}><path d="M34 28 L14 50 L34 72"/><path d="M66 28 L86 50 L66 72"/><path d="M56 22 L44 78"/></g>`;
    case 'pena': return `<g ${t}><path d="M24 86 C34 56 52 30 84 14 C82 44 62 70 34 76"/><path d="M24 86 L58 42"/></g>`;
    case 'faisca': return `<g ${t}><path d="M50 12 L58 42 L88 50 L58 58 L50 88 L42 58 L12 50 L42 42Z"/></g>`;
    case 'balao': return `<g ${t}><path d="M16 22 H84 V66 H46 L28 82 V66 H16Z"/></g>`;
    case 'livro': return `<g ${t}><path d="M50 24 C38 16 22 16 12 20 V80 C22 76 38 76 50 84 C62 76 78 76 88 80 V20 C78 16 62 16 50 24Z"/><path d="M50 24 V84"/></g>`;
    case 'pincel': return `<g ${t}><path d="M82 14 L46 54"/><path d="M44 52 C30 50 22 62 24 72 C24 80 18 84 14 86 C30 90 50 84 50 66"/></g>`;
    case 'insta': return `<g ${t}><rect x="16" y="16" width="68" height="68" rx="20"/><circle cx="50" cy="50" r="16"/></g><circle cx="70" cy="30" r="5" fill="${c}"/>`;
    case 'semente': return `<path d="M50 14 C74 30 78 66 50 88 C22 66 26 30 50 14Z" fill="${c}"/><path d="M50 26 C58 42 58 62 50 78" stroke="${cor.terra}" stroke-width="4" fill="none" opacity=".5"/>`;
    case 'espiral': return `<path d="M50 50 m0 -4 a4 4 0 1 1 -4 4 a10 10 0 1 1 10 10 a18 18 0 1 1 -18 -18 a28 28 0 1 1 28 28" ${t}/>`;
    case 'carta': return `<g ${t}><rect x="12" y="24" width="76" height="54" rx="6"/><path d="M14 28 L50 56 L86 28"/></g>`;
    case 'seta': return `<path d="M18 50 H80 M60 30 L82 50 L60 70" ${t}/>`;
    default: return '';
  }
}

// Monograma CT (sem a palavra "visto")
export function monograma(c = cor.terra) {
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="45" fill="none" stroke="${c}" stroke-width="4"/>` +
    `<path d="M62 24 A16 16 0 1 0 62 46" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M24 56 L76 56 L70 64 L56 64 L56 90 M44 90 L44 64 L30 64 Z" fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"/></svg>`;
}

// Defs globais: símbolos reaproveitados por <use> em todas as camadas
export function defs() {
  // sem viewBox: o desenho usa as próprias coordenadas e o <use> só posiciona e escala
  const sym = (id, vb, conteudo) => `<symbol id="${id}" overflow="visible">${conteudo}</symbol>`;
  let s = '';
  s += sym('cafe1', '-100 -230 200 230', pedeCafe(11, 210));
  s += sym('cafe2', '-100 -230 200 230', pedeCafe(29, 190));
  s += sym('cafe3', '-100 -230 200 230', pedeCafe(47, 220));
  s += sym('samambaia', '-100 -200 200 200', samambaia(5));
  s += sym('samambaia2', '-100 -200 200 200', samambaia(9, 130));
  s += sym('capim', '-40 -90 80 90', capim(3));
  s += sym('capim2', '-40 -90 80 90', capim(8, 60, cor.terra));
  s += sym('arvore', '-160 -420 320 420', arvore(4));
  s += sym('arvore2', '-160 -420 320 420', arvore(19, 300));
  // borboletas azuis (pedido do Carlos): quatro tons de azul com pintas claras
  s += sym('borbo1', '-60 -50 120 100', borboleta('#2F6FB0', '#BFE0F5'));
  s += sym('borbo2', '-60 -50 120 100', borboleta('#4F9BD9', cor.osso));
  s += sym('borbo3', '-60 -50 120 100', borboleta('#1F4C80', '#7FC4EE'));
  s += sym('borbo4', '-60 -50 120 100', borboleta('#7DB8E8', '#1F4C80'));
  s += sym('folhaVoo', '-20 -10 40 20', folha(36, 10, cor.folha, 0, -18, 0));
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${s}</defs></svg>`;
}
