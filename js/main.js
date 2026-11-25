// Motor do currículo: a rolagem vertical move o Eremita pelo mundo na horizontal.
import { defs, monograma, icone, cor } from './arte.js';
import { construir, construirEspiral, pos, CHAO } from './mundo.js';
import { regioes, projetos, linhaDoTempo, cursos, resumoCursos, areas } from './dados.js';
import { svgEremita, Eremita } from './eremita.js';

// Respeita "reduzir movimento" do sistema, mas a pessoa pode ligar as animações pelo botão do HUD
const sistemaReduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
let escolha = null;
try { escolha = localStorage.getItem('travessia-animacao'); } catch (e) { /* sem armazenamento */ }
const reduzido = escolha ? escolha === 'desligada' : sistemaReduz;
const RITMO = 1.1;               // pixels de rolagem por pixel de caminhada
const HERO_MIN = pos.inicio;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const E = {                      // estado
  s: 1, offY: 0, viewW: 1000, cs: 300, meio: 200, heroMax: pos.final,
  hero: HERO_MIN, alvo: HERO_MIN, camX: 0, regiao: -1, paradas: [],
  camadas: [], coletadas: new Set(), estados: {}, q: 0, parado: 0, ultimaParada: null,
  particulas: [], borboletas: [], esp: null
};

const CAMADAS = [
  ['c-nuvens', 0.07, 'nuvens'], ['c-espiral', 0.04, null], ['c-longe', 0.18, 'longe'],
  ['c-ceu-info', 0.3, 'ceuInfo'], ['c-meio', 0.5, 'meio'], ['c-borboletas', 0.8, null],
  ['c-chao', 1, 'chao'], ['c-info', 1, 'info'], ['c-frente', 1.35, 'frente']
];

// cores do céu ao longo do caminho
const CEU = [[0, '#F2C27E'], [2350, '#F2C27E'], [3100, '#F1E6CF'], [5800, '#EFE3C8'], [6500, '#DCE2DE'], [9600, '#E2DCCB'], [10500, '#EBCB98'], [11100, '#DDE6D0'], [14600, '#DCE6CE'], [15300, '#F2BC72'], [17000, '#ECA562']];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function corCeu(x) {
  for (let i = 0; i < CEU.length - 1; i++) {
    const [x0, c0] = CEU[i], [x1, c1] = CEU[i + 1];
    if (x <= x1) {
      const t = Math.max(0, Math.min(1, (x - x0) / (x1 - x0))), a = hex(c0), b = hex(c1);
      return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(',')})`;
    }
  }
  return CEU[CEU.length - 1][1];
}

// ------------------------------------------------------------------ montagem
async function iniciar() {
  let glifo = '';
  try {
    const txt = await (await fetch('img/marca/glifo.svg')).text();
    const corpo = txt.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/fill="black"/g, 'fill="currentColor"');
    glifo = `<symbol id="glifo" viewBox="0 0 519 94" preserveAspectRatio="none">${corpo}</symbol>`;
  } catch (e) { /* sem glifo, segue */ }
  $('#defs').innerHTML = defs().replace('</defs>', glifo + '</defs>');
  $('#marca').innerHTML = monograma(cor.terra);
  $('#eremita-caixa').innerHTML = svgEremita();
  E.er = new Eremita($('#eremita-caixa'), reduzido);
  montarMapa();
  if (matchMedia('(pointer: coarse)').matches) $('.dica-texto').textContent = 'deslize para caminhar';
  const bt = $('#btn-animacao');
  if (sistemaReduz || escolha) {
    bt.hidden = false;
    bt.textContent = reduzido ? 'Ligar animações' : 'Desligar animações';
    bt.setAttribute('aria-pressed', String(!reduzido));
    bt.addEventListener('click', () => {
      try { localStorage.setItem('travessia-animacao', reduzido ? 'ligada' : 'desligada'); } catch (e) { /* segue */ }
      location.reload();
    });
  }
  document.documentElement.classList.toggle('reduzido', reduzido);
  montar(true);
  ligarEventos();
  if (!reduzido) animarAbertura();
  requestAnimationFrame(quadro);
  document.documentElement.classList.add('pronto');
}

function montar(primeira) {
  const h = innerHeight, w = innerWidth;
  E.s = Math.max(h / 1000, w / 2100);
  E.offY = h - 1000 * E.s;                       // em telas muito largas e baixas corta o alto do céu
  E.viewW = w / E.s;
  const estreito = E.viewW < 900;
  E.cs = E.viewW * (estreito ? 0.27 : 0.3);
  const { out, paradas, meio, heroMax } = construir({ viewW: E.viewW, cs: E.cs });
  E.paradas = paradas; E.meio = meio; E.heroMax = heroMax;
  E.esp = construirEspiral(E.viewW);

  E.camadas = CAMADAS.map(([id, f, chave]) => {
    const el = $('#' + id);
    const html = chave ? out[chave] : id === 'c-espiral' ? E.esp.html : '';
    el.innerHTML = `<div class="interno">${html}</div>`;
    const interno = el.firstChild;
    return { el, f, interno, pedacos: $$('.pedaco', interno).map((p) => ({ el: p, x0: +p.dataset.x0, x1: +p.dataset.x1, vis: true, reg: regioes.find((r) => r.id === p.dataset.reg), op: -1 })) };
  });
  montarBorboletas();
  E.espEls = { plantas: $$('#esp-plantas use'), sulco: $('#esp-sulco'), disco: $('#esp-disco'), cacos: $$('#c-espiral .caco'), grupo: $('#esp-plantas') };

  // Eremita: posição fixa na tela
  const cx = $('#eremita-caixa');
  const alt = 380 * 0.82 * E.s, larg = 240 * 0.82 * E.s;
  Object.assign(cx.style, { width: larg + 'px', height: alt + 'px', left: (E.cs * E.s - (104 + 20) * 0.82 * E.s) + 'px', top: (E.offY + (CHAO - 368 * 0.82) * E.s) + 'px' });
  $('#particulas').setAttribute('viewBox', `0 ${-E.offY / E.s} ${E.viewW} ${innerHeight / E.s}`);

  $('#rolagem').style.height = ((E.heroMax - HERO_MIN) * E.s * RITMO + innerHeight) + 'px';
  document.documentElement.style.setProperty('--s', E.s);

  // estados reaplicados sem animação
  E.estados = {};
  for (const i of E.coletadas) aplicarColeta(i, false);
  if (!primeira) scrollTo(0, heroParaRolagem(E.hero));
}

const heroParaRolagem = (x) => (x - HERO_MIN) * E.s * RITMO;

function montarMapa() {
  const tot = pos.final - HERO_MIN;
  const alvos = [pos.inicio, pos.placaHab - 40, pos.placaTempo - 40, pos.placaVale - 40, pos.placaRetorno - 40];
  $('#mapa-pontos').innerHTML = regioes.map((r, i) => {
    const p = ((alvos[i] - HERO_MIN) / tot) * 100;
    return `<button class="ponto" style="left:${p}%" data-ir="${alvos[i]}" aria-label="Ir para ${r.nome}"><span class="bolinha"></span><span class="nome-ponto">${r.curto}</span></button>`;
  }).join('');
}

function montarBorboletas() {
  const camada = E.camadas.find((c) => c.el.id === 'c-borboletas');
  const v = regioes.find((r) => r.id === 'vale');
  const x0 = (v.ini - E.cs) * 0.8 - 200, x1 = (v.fim - E.cs) * 0.8 + E.viewW + 200;
  let s = '';
  E.borboletas = [];
  for (let i = 0; i < 22; i++) {
    const b = { bx: x0 + ((i * 0.618) % 1) * (x1 - x0), by: 220 + ((i * 0.37) % 1) * 420, ph: i * 1.7, sc: 0.45 + ((i * 0.29) % 1) * 0.4 };
    E.borboletas.push(b);
    s += `<use href="#borbo${(i % 4) + 1}" class="borbo"/>`;
  }
  camada.interno.innerHTML = `<svg class="pedaco" data-x0="${x0}" data-x1="${x1}" style="left:${x0}px;width:${x1 - x0}px" viewBox="${x0} 0 ${x1 - x0} 1000" aria-hidden="true">${s}</svg>`;
  camada.pedacos = $$('.pedaco', camada.interno).map((p) => ({ el: p, x0, x1, vis: true }));
  E.borboEls = $$('.borbo', camada.interno);
}

function animarAbertura() {
  gsap.from('.abertura .nome', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  gsap.from('.abertura .titulo', { y: 20, opacity: 0, duration: 0.8, delay: 0.6 });
  gsap.from('.abertura .pal', { y: 26, opacity: 0, scale: 0.6, duration: 0.5, stagger: 0.09, ease: 'back.out(2)', delay: 1 });
  gsap.from('#sol', { attr: { r: 0 }, duration: 1.4, ease: 'power2.out' });
}

// ------------------------------------------------------------------ eventos
function irPara(x) {
  scrollTo({ top: heroParaRolagem(Math.max(HERO_MIN, Math.min(E.heroMax, x))), behavior: reduzido ? 'auto' : 'smooth' });
}

function ligarEventos() {
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => montar(false), 200); });
  $('#mapa').addEventListener('click', (e) => { const b = e.target.closest('[data-ir]'); if (b) irPara(+b.dataset.ir); });
  $('#marca').addEventListener('click', (e) => { e.preventDefault(); irPara(HERO_MIN); });
  addEventListener('keydown', (e) => {
    if ($('#painel').open) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const alvo = E.alvo;
      const p = e.key === 'ArrowRight' ? E.paradas.find((q) => q.x > alvo + 25) : [...E.paradas].reverse().find((q) => q.x < alvo - 25);
      if (p) irPara(p.x);
    }
  });
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-painel]'); if (b) abrirPainel(b.dataset.painel, b); });
  // navegação por Tab: leva o Eremita até o item focado
  $('#c-info').addEventListener('focusin', (e) => {
    const it = e.target.closest('.item'); if (!it) return;
    const x = parseFloat(it.style.left) + parseFloat(it.style.width) / 2;
    irPara(x - E.meio);
  });
  $('#painel').addEventListener('click', (e) => { if (e.target.id === 'painel' || e.target.closest('.fechar')) fecharPainel(); });
  $('#painel').addEventListener('close', () => { document.documentElement.classList.remove('com-painel'); });
}

// ------------------------------------------------------------------ quadro a quadro
let tAnt = performance.now();
function quadro(t) {
  const dt = Math.min(0.05, (t - tAnt) / 1000); tAnt = t;
  E.alvo = Math.max(HERO_MIN, Math.min(E.heroMax, HERO_MIN + scrollY / (E.s * RITMO)));
  const antes = E.hero;
  if (reduzido) E.hero = E.alvo;
  else { E.hero += (E.alvo - E.hero) * Math.min(1, dt * 7); if (Math.abs(E.alvo - E.hero) < 0.08) E.hero = E.alvo; }
  const v = E.hero - antes;
  E.camX = E.hero - E.cs;

  for (const c of E.camadas) {
    const desl = E.camX * c.f;
    c.interno.style.transform = `translate3d(${(-desl * E.s).toFixed(2)}px,${E.offY.toFixed(1)}px,0) scale(${E.s})`;
    const a = desl - 300, b = desl + E.viewW + 300;
    for (const p of c.pedacos) {
      let vis = p.x1 > a && p.x0 < b;
      if (p.reg) {                                  // biomas do fundo trocam com transição suave
        const T = 350, r = p.reg;
        const ent = r.ini === 0 ? 1 : Math.min(1, Math.max(0, (E.hero - (r.ini - T)) / (2 * T)));
        const sai = r.id === 'retorno' ? 1 : Math.min(1, Math.max(0, ((r.fim + T) - E.hero) / (2 * T)));
        const op = Math.round(Math.min(ent, sai) * 100) / 100;
        if (op === 0) vis = false;
        if (op !== p.op) { p.op = op; p.el.style.opacity = op; }
      }
      if (vis !== p.vis) { p.vis = vis; p.el.style.display = vis ? '' : 'none'; }
    }
  }
  document.body.style.backgroundColor = corCeu(E.hero);
  const abertura = Math.max(0, Math.min(1, 1 - (E.hero - 900) / 1200));
  if (abertura !== E.opAbertura) { E.opAbertura = abertura; E.camadas[3].interno.style.opacity = abertura; }

  const fuga = E.hero > pos.quebra - 60 && E.hero < pos.quebra + 900 && Math.abs(v) > 0.3 ? 1 : 0;
  E.er.atualizar(dt, v, fuga);

  atualizarEspiral(dt, t);
  gatilhos(v, dt);
  atualizarRegiao();
  atualizarParticulas(dt, v, fuga);
  if (E.hero > 2000 && E.hero < 15000 && !reduzido) atualizarBorboletas(t / 1000);

  $('#mapa-eremita').style.left = ((E.hero - HERO_MIN) / (E.heroMax - HERO_MIN) * 100) + '%';
  if (scrollY > 40) document.documentElement.classList.add('rolou');
  requestAnimationFrame(quadro);
}

// ------------------------------------------------------------------ a espiral
let contaQuadro = 0;
function atualizarEspiral(dt) {
  const esp = E.esp, els = E.espEls;
  const alvoQ = E.hero > pos.quebra ? 1 : 0;
  const qAntes = E.q;
  // a quebra anda em velocidade constante (1,4 s para ir, 0,7 s para voltar)
  E.q = alvoQ ? Math.min(1, E.q + dt * 0.72) : Math.max(0, E.q - dt * 1.4);
  if (reduzido) E.q = alvoQ;
  if (qAntes < 0.02 && E.q >= 0.02 && alvoQ === 1) quebrarEspiral();
  if (E.camX > 5000 && E.q === 1) return;
  const q = E.q, rot = reduzido ? 0.6 : E.hero * 0.0024;
  const pontos = [];
  esp.plantas.forEach((p, i) => {
    const ang = p.t + rot, rr = esp.Rm * (p.t / esp.tMax);
    const fundo = (Math.sin(ang) + 1) / 2;
    let x = esp.cx + Math.cos(ang) * rr * 1.0, y = esp.cy + Math.sin(ang) * rr * 0.34;
    const sc = (0.16 + 0.26 * rr / esp.Rm) * (0.82 + 0.3 * fundo);
    x += Math.cos(ang) * q * 700; y += -q * 300 + q * q * 900;
    const el = els.plantas[i];
    el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(q * 160 * (i % 2 ? 1 : -1)).toFixed(1)}) scale(${sc.toFixed(3)})`);
    el.style.opacity = 1 - q;
    p.y = y;
  });
  if (++contaQuadro % 6 === 0 && q < 1) {
    [...esp.plantas.keys()].sort((a, b) => esp.plantas[a].y - esp.plantas[b].y).forEach((i) => els.grupo.appendChild(els.plantas[i]));
  }
  for (let k = 0; k <= 150; k++) {
    const tt = (k / 150) * esp.tMax, ang = tt + rot, rr = esp.Rm * (tt / esp.tMax);
    pontos.push(`${(esp.cx + Math.cos(ang) * rr).toFixed(1)},${(esp.cy + Math.sin(ang) * rr * 0.34).toFixed(1)}`);
  }
  els.sulco.setAttribute('points', pontos.join(' '));
  els.disco.style.opacity = Math.max(0, 1 - q * 4);
  esp.cacos.forEach((c, i) => {
    const el = els.cacos[i];
    if (q < 0.01) { el.style.opacity = 0; return; }
    const dx = Math.cos(c.ang) * c.dist * q, dy = -280 * q + 1100 * q * q;
    el.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${(c.rot * q).toFixed(1)} ${c.mx.toFixed(1)} ${c.my.toFixed(1)})`);
    el.style.opacity = Math.max(0, Math.min(1, q * 8) - Math.max(0, q - 0.7) * 3.3);
  });
}

function quebrarEspiral() {
  if (reduzido) return;
  E.er.onda(220, 1);
  gsap.fromTo('#palco', { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' });
  for (let i = 0; i < 26; i++) soltarFolha(E.viewW * (0.3 + Math.random() * 0.6), 500 + Math.random() * 200, true);
}

// ------------------------------------------------------------------ gatilhos do caminho
function mudar(chave, ligado, ligar, desligar) {
  if (E.estados[chave] === ligado) return;
  const primeira = E.estados[chave] === undefined;
  E.estados[chave] = ligado;
  if (ligado) ligar(primeira); else desligar(primeira);
}

function gatilhos(v, dt) {
  const vis = (x) => E.hero > x - E.meio - E.viewW * 0.42;     // objeto entrou na tela pela direita
  const rapido = (el) => reduzido;

  pos.habilidades.forEach((x, i) => mudar('hab' + i, vis(x),
    () => {
      const g = $('#hab-' + i), rot = [$('#hab-rot-' + i), $('#hab-nota-' + i)].filter(Boolean);
      if (reduzido) { gsap.set(g, { scaleY: 1, transformOrigin: '50% 100%' }); gsap.set(rot, { opacity: 1 }); return; }
      gsap.fromTo(g, { scaleY: 0.02, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 1.1, ease: 'back.out(1.3)' });
      gsap.fromTo($$('.sem.acesa', g), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, stagger: 0.06, delay: 0.8, ease: 'back.out(3)' });
      gsap.fromTo(rot, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.7 });
    },
    (p) => { gsap.set('#hab-' + i, { scaleY: 0.02, transformOrigin: '50% 100%' }); gsap.set([$('#hab-rot-' + i), $('#hab-nota-' + i)].filter(Boolean), { opacity: 0 }); }));

  pos.tempo.forEach((x, i) => mudar('tempo' + i, vis(x),
    () => { if (!reduzido) gsap.fromTo('#tempo-' + i, { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }); else gsap.set('#tempo-' + i, { opacity: 1, y: 0 }); },
    () => gsap.set('#tempo-' + i, { y: 120, opacity: 0 })));

  mudar('bau', E.hero > pos.bau - E.meio - 160,
    () => {
      const d = reduzido ? 0 : 1;
      gsap.to('#bau-tampa', { rotation: -28, svgOrigin: `${pos.bau - 98} ${CHAO - 100}`, duration: 0.6 * d, ease: 'back.out(2)' });
      gsap.to('#bau-luz', { opacity: 0.6, duration: 0.4 * d });
      gsap.fromTo('.insignia', { scale: 0, opacity: 0, svgOrigin: `${pos.bau} ${CHAO - 110}` }, { scale: 1, opacity: 1, duration: 0.7 * d, stagger: 0.08 * d, ease: 'back.out(1.7)', delay: 0.2 * d });
      gsap.to('.rot-bau-titulo', { opacity: 1, duration: 0.4 * d, delay: 0.5 * d });
    },
    () => {
      gsap.set('#bau-tampa', { rotation: 0, svgOrigin: `${pos.bau - 98} ${CHAO - 100}` });
      gsap.set('#bau-luz', { opacity: 0 });
      gsap.set('.insignia', { scale: 0, opacity: 0 });
      gsap.set('.rot-bau-titulo', { opacity: 0 });
    });

  // sementes: colhidas quando o Eremita passa por cima
  pos.sementes.forEach((x, i) => { if (!E.coletadas.has(i) && E.hero >= x - 4) coletar(i); });
  pos.sementes.forEach((x, i) => { if (!E.coletadas.has(i) && !E.estados['semIni' + i]) { E.estados['semIni' + i] = 1; aplicarColeta(i, false, true); } });

  // canteiro: as sementes colhidas viram mudas
  mudar('canteiro', E.hero > pos.canteiro - E.meio - 220,
    () => {
      const n = E.coletadas.size; $('#plantadas').textContent = n;
      const mudas = $$('.muda').slice(0, n);
      gsap.fromTo(mudas, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: reduzido ? 0 : 0.7, stagger: reduzido ? 0 : 0.15, ease: 'back.out(2)' });
      gsap.set($$('.muda').slice(n), { scaleY: 0, transformOrigin: '50% 100%' });
    },
    () => gsap.set('.muda', { scaleY: 0, transformOrigin: '50% 100%' }));

  mudar('final', E.hero >= pos.final - 80,
    () => { E.er.erguer(true); gsap.to('#raio-luz', { opacity: 0.22, duration: 0.8 }); gsap.fromTo('.cta', { y: 14 }, { y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(3)' }); if (!reduzido) faiscas(E.cs, CHAO - 330, 24); },
    () => { E.er.erguer(false); gsap.to('#raio-luz', { opacity: 0, duration: 0.4 }); });

  // chegada numa parada: o Eremita apoia o cajado
  if (Math.abs(v) < 0.05) E.parado += dt; else E.parado = 0;
  if (E.ultimaParada && Math.abs(E.ultimaParada.x - E.hero) > 160) E.ultimaParada = null;
  if (E.parado > 0.2 && !reduzido) {
    const p = E.paradas.find((q) => Math.abs(q.x - E.hero) < 70);
    if (p && p !== E.ultimaParada && p.id !== 'final') { E.ultimaParada = p; E.er.chegar(); }
  }
}

function aplicarColeta(i, animar, esconder) {
  const broto = $('#broto-' + i), fruto = $('#rot-fruto-' + i), sem = $('#sem-' + i);
  if (!broto) return;
  if (esconder) {
    gsap.set(broto, { scaleY: 0, transformOrigin: '50% 100%' });
    gsap.set(fruto, { scale: 0, opacity: 0 });
    fruto.inert = true;
    return;
  }
  fruto.inert = false;
  if (!animar) { gsap.set(broto, { scaleY: 1, transformOrigin: '50% 100%' }); gsap.set(fruto, { scale: 1, opacity: 1 }); gsap.set(sem, { opacity: 0 }); return; }
  gsap.to(sem, { scale: 0, opacity: 0, svgOrigin: `${pos.sementes[i]} ${CHAO}`, duration: 0.3 });
  gsap.fromTo(broto, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.9, ease: 'back.out(1.4)', delay: 0.15 });
  gsap.fromTo(fruto, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2.2)', delay: 0.7 });
}

function coletar(i) {
  E.coletadas.add(i);
  aplicarColeta(i, !reduzido);
  if (!reduzido) { E.er.colher(); faiscas(E.cs, CHAO - 30, 18); }
  const n = E.coletadas.size;
  $('#cont-n').textContent = n;
  $('#contador').setAttribute('aria-label', `Sementes colhidas: ${n} de 6`);
  if (!reduzido) gsap.fromTo('#contador', { scale: 1.35 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1,0.4)' });
  if (n === 6) $('#contador').classList.add('completo');
}

// ------------------------------------------------------------------ região atual
function atualizarRegiao() {
  const i = regioes.findIndex((r) => E.hero >= r.ini && E.hero < r.fim);
  const idx = i < 0 ? regioes.length - 1 : i;
  if (idx === E.regiao) return;
  const primeira = E.regiao === -1;
  E.regiao = idx;
  $$('#mapa-pontos .ponto').forEach((b, k) => b.classList.toggle('atual', k === idx));
  document.documentElement.dataset.regiao = regioes[idx].id;
  if (primeira) return;
  const placa = $('#placa-fase');
  $('#placa-fase small').textContent = `Fase ${idx + 1}`;
  $('#placa-fase strong').textContent = regioes[idx].nome;
  gsap.killTweensOf(placa);
  gsap.timeline()
    .fromTo(placa, { y: -30, opacity: 0, rotation: -3 }, { y: 0, opacity: 1, rotation: 0, duration: reduzido ? 0 : 0.5, ease: 'back.out(2)' })
    .to(placa, { y: -20, opacity: 0, duration: 0.4 }, '+=2');
}

// ------------------------------------------------------------------ partículas e borboletas
function novaParticula(html, dados) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.innerHTML = html;
  $('#particulas').appendChild(g);
  E.particulas.push({ el: g, ...dados });
}
function soltarFolha(x, y, forte) {
  novaParticula(`<use href="#folhaVoo" transform="scale(${(0.6 + Math.random() * 0.8).toFixed(2)})"/>`,
    { x, y, vx: (forte ? 200 : -60) * (Math.random() + 0.3) * (Math.random() < 0.5 && forte ? -1 : 1), vy: -150 - Math.random() * 200, g: 260, r: Math.random() * 360, vr: (Math.random() - 0.5) * 600, vida: 2.2 });
}
function faiscas(x, y, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, vel = 120 + Math.random() * 260;
    novaParticula(`<circle r="${(3 + Math.random() * 5).toFixed(1)}" fill="${Math.random() < 0.5 ? cor.dourado : cor.amarelo}" stroke="${cor.branco}" stroke-width="1.5"/>`,
      { x, y, vx: Math.cos(a) * vel, vy: Math.sin(a) * vel - 160, g: 380, r: 0, vr: 0, vida: 1.1 });
  }
}
let acumFolha = 0;
function atualizarParticulas(dt, v, fuga) {
  if (fuga && !reduzido) { acumFolha += dt; if (acumFolha > 0.09) { acumFolha = 0; soltarFolha(E.cs - 40 * Math.sign(v || 1), CHAO - 120 - Math.random() * 160, false); } }
  for (let i = E.particulas.length - 1; i >= 0; i--) {
    const p = E.particulas[i];
    p.vida -= dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
    p.el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.r.toFixed(0)})`);
    p.el.style.opacity = Math.min(1, p.vida * 2);
    if (p.vida <= 0) { p.el.remove(); E.particulas.splice(i, 1); }
  }
}
function atualizarBorboletas(t) {
  E.borboletas.forEach((b, i) => {
    const x = b.bx + Math.sin(t * 0.5 + b.ph) * 90 + Math.sin(t * 1.3 + b.ph) * 20;
    const y = b.by + Math.sin(t * 0.9 + b.ph * 2) * 50;
    const asa = 0.25 + 0.75 * Math.abs(Math.sin(t * 11 + b.ph));
    const dir = Math.cos(t * 0.5 + b.ph) > 0 ? 1 : -1;
    E.borboEls[i].setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(dir * 12).toFixed(0)}) scale(${(b.sc * asa).toFixed(3)} ${b.sc.toFixed(3)})`);
  });
}

// ------------------------------------------------------------------ painéis
let painelOrigem = null;
function abrirPainel(chave, origem) {
  const d = $('#painel'), c = $('#painel-conteudo');
  painelOrigem = origem;
  if (chave.startsWith('proj-')) c.innerHTML = painelProjeto(projetos[+chave.slice(5)]);
  else if (chave.startsWith('tempo-')) c.innerHTML = painelTempo(linhaDoTempo[+chave.slice(6)]);
  else if (chave === 'bau') c.innerHTML = painelBau();
  c.querySelectorAll('.galeria-mini button').forEach((b) => b.addEventListener('click', () => {
    const img = c.querySelector('.galeria-grande img');
    img.src = b.dataset.src; img.alt = b.dataset.alt;
    c.querySelectorAll('.galeria-mini button').forEach((o) => o.setAttribute('aria-pressed', o === b));
  }));
  d.showModal();
  document.documentElement.classList.add('com-painel');
  if (!reduzido) gsap.fromTo(d, { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
  d.querySelector('.fechar').focus();
}
function fecharPainel() {
  $('#painel').close();
  if (painelOrigem) painelOrigem.focus({ preventScroll: true });
}

function painelProjeto(p) {
  const [src, alt] = p.imagens[0];
  return `<p class="painel-cat">Semente · ${p.categoria}</p><h2 id="painel-titulo">${p.nome}</h2>
    <figure class="galeria-grande ${p.janela ? 'janela' : ''} ${p.vertical ? 'vertical' : ''}"><img src="${src}" alt="${alt}"></figure>
    <div class="galeria-mini" role="group" aria-label="Imagens do projeto">${p.imagens.map(([s, a], k) => `<button data-src="${s}" data-alt="${a}" aria-pressed="${k === 0}" aria-label="Ver imagem ${k + 1}: ${a}"><img src="${s}" alt="" loading="lazy"></button>`).join('')}</div>
    <p class="painel-texto">${p.texto}</p>
    ${p.link ? `<a class="cta" href="${p.link}" target="_blank" rel="noopener"><svg viewBox="0 0 100 100" aria-hidden="true">${icone('seta')}</svg><span>${p.linkTexto}</span></a>` : ''}`;
}
function painelTempo(it) {
  return `<p class="painel-cat">${it.tipo === 'formacao' ? 'Formação' : 'Trabalho'} · ${it.ano}${it.ate ? '–' + it.ate : ''}</p><h2 id="painel-titulo">${it.titulo}</h2><p class="painel-local">${it.local}</p>
    <ul class="painel-lista">${it.detalhes.map((d) => `<li>${d}</li>`).join('')}</ul>`;
}
function painelBau() {
  const res = resumoCursos(), max = Math.max(...res.map((a) => a.n)), total = res.reduce((t, a) => t + a.n, 0);
  const horas = res.reduce((t, a) => t + a.h, 0);
  return `<p class="painel-cat">Baú de cursos complementares · 2001 a 2026</p><h2 id="painel-titulo">${total} cursos, mais de ${Math.floor(horas / 100) * 100} horas</h2>
    <div class="barras" role="list">${res.map((a) => `<div class="barra" role="listitem"><span class="barra-nome"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="${a.cor}"/>${icone(a.icone)}</svg>${a.nome}</span>
      <span class="barra-trilho"><span class="barra-valor" style="width:${(a.n / max) * 100}%;background:${a.cor}"></span></span><span class="barra-num">×${a.n}<small>${a.h ? a.h + ' h' : ''}</small></span></div>`).join('')}</div>
    <p class="nota-barras">Horas somam só os cursos com carga horária informada.</p>
    ${cursos.map((p) => `<details class="periodo"><summary><strong>${p.periodo}</strong> · ${p.titulo} <span>(${p.itens.reduce((t, c) => t + (c.n || 1), 0)})</span></summary>
      <ul>${p.itens.map((c) => `<li><span class="ponto-area" style="background:${areas[c.a].cor}" title="${areas[c.a].nome}"></span>${c.t}<small>${[c.h ? c.h + ' h' : '', c.ano].filter(Boolean).join(' · ')}</small></li>`).join('')}</ul></details>`).join('')}`;
}

iniciar();
window.travessia = { irPara, estado: E };   // para explorar pelo console
