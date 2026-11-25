// O Eremita: Carlos estilizado como a carta do tarô.
// SVG montado por partes; cada parte gira em torno do seu ponto de articulação.
// A pose é calculada a cada quadro (caminhada ligada à distância percorrida)
// e somada às "ações" (chegar, colher, final), que o GSAP anima.
import { cor } from './arte.js';

const PELE = '#E2B48C', PELE_ESC = '#C48E68', BARBA = '#3A2A22';
const CAPA = '#6E4C36', CAPA_ESC = '#563A29', CALCA = '#3A281D', BOTA = '#22160F';
const CAJADO = '#8A5A3A', CONT = cor.branco;

export function svgEremita() {
  return `
<svg id="eremita" viewBox="-20 -60 240 380" aria-hidden="true">
 <g id="er-espelho">
  <g id="er-ator">
   <g id="er-sombra"><ellipse cx="104" cy="308" rx="62" ry="9" fill="${cor.terraEsc}" opacity=".28"/></g>
   <g id="er-bracoT">
     <path d="M86 112 Q74 146 80 176 L98 176 Q100 146 102 116Z" fill="${CAPA_ESC}" stroke="${CONT}" stroke-width="4" stroke-linejoin="round"/>
     <circle cx="89" cy="180" r="8.5" fill="${PELE_ESC}" stroke="${CONT}" stroke-width="3"/>
   </g>
   <g id="er-pernaT">
     <path d="M90 196 H108 V292 H90Z" fill="${BOTA}"/>
     <path d="M86 288 H110 Q120 296 116 306 H86Z" fill="${BOTA}" stroke="${CONT}" stroke-width="3" stroke-linejoin="round"/>
   </g>
   <g id="er-pernaF">
     <path d="M97 196 H115 V292 H97Z" fill="${CALCA}"/>
     <path d="M93 288 H117 Q128 296 124 306 H93Z" fill="${BOTA}" stroke="${CONT}" stroke-width="3" stroke-linejoin="round"/>
   </g>
   <g id="er-corpo">
     <path d="M78 106 Q102 94 126 106 L142 250 Q104 260 62 250Z" fill="${CAPA}" stroke="${CONT}" stroke-width="5" stroke-linejoin="round"/>
     <path d="M104 116 L118 250 L98 252Z" fill="${CAPA_ESC}" opacity=".7"/>
     <path d="M84 120 Q80 190 72 248" stroke="${CAPA_ESC}" stroke-width="3" fill="none" opacity=".6"/>
     <g id="er-barra">
       <path d="M62 242 Q102 254 142 242 L150 272 Q128 262 106 274 Q84 262 56 272Z" fill="${CAPA_ESC}" stroke="${CONT}" stroke-width="4" stroke-linejoin="round"/>
     </g>
     <path d="M80 166 Q104 176 130 164" stroke="${cor.terracota}" stroke-width="7" fill="none" stroke-linecap="round"/>
     <path d="M124 168 Q128 186 122 204 M124 168 Q134 184 132 198" stroke="${cor.terracota}" stroke-width="4" fill="none" stroke-linecap="round"/>
     <circle cx="124" cy="168" r="6" fill="${cor.terracota}" stroke="${CONT}" stroke-width="2"/>
     <g id="er-cabeca">
       <path d="M72 108 Q62 62 90 38 Q116 20 136 44 Q144 62 138 84 L132 110Z" fill="${CAPA_ESC}" stroke="${CONT}" stroke-width="5" stroke-linejoin="round"/>
       <ellipse cx="116" cy="72" rx="19" ry="22" fill="${PELE}"/>
       <path d="M101 52 Q116 44 132 52 L132 58 Q116 52 101 58Z" fill="${BARBA}"/>
       <path d="M97 72 Q98 106 116 110 Q134 108 136 82 Q130 92 117 92 Q105 92 97 72Z" fill="${BARBA}"/>
       <path d="M110 86 Q122 80 132 86 Q122 91 110 88Z" fill="${BARBA}"/>
       <path d="M133 68 Q140 75 133 81" fill="${PELE_ESC}"/>
       <g id="er-olhos"><circle cx="114" cy="70" r="2" fill="${cor.carvao}"/><circle cx="129" cy="70" r="2" fill="${cor.carvao}"/></g>
       <g fill="${CONT}" fill-opacity=".22" stroke="${cor.carvao}" stroke-width="2.6">
         <circle cx="113" cy="70" r="7.5"/><circle cx="129" cy="70" r="7.5"/>
       </g>
       <path d="M120.5 69 Q121 67 121.5 69 M105.5 69 L96 66" stroke="${cor.carvao}" stroke-width="2.4" fill="none"/>
       <path d="M108 60 L118 59 M124 59 L134 61" stroke="${BARBA}" stroke-width="2.6" stroke-linecap="round"/>
       <path d="M136 44 Q146 62 138 86" stroke="${cor.terra}" stroke-width="4" fill="none"/>
     </g>
   </g>
   <g id="er-bracoF">
     <g id="er-luz">
       <circle class="er-halo" cx="153" cy="-6" r="44" fill="${cor.dourado}" opacity=".16"/>
       <circle class="er-halo2" cx="153" cy="-6" r="27" fill="${cor.amarelo}" opacity=".3"/>
       <circle id="er-onda" cx="153" cy="-6" r="20" fill="none" stroke="${cor.dourado}" stroke-width="4" opacity="0"/>
     </g>
     <path d="M149 2 H157 V308 H149Z" fill="${CAJADO}" stroke="${CONT}" stroke-width="3"/>
     <path d="M153 -24 C166 -14 166 6 153 16 C140 6 140 -14 153 -24Z" fill="${cor.dourado}" stroke="${CONT}" stroke-width="3"/>
     <path d="M153 -16 C158 -8 158 4 153 10" stroke="${cor.terra}" stroke-width="2" fill="none" opacity=".45"/>
     <path d="M108 110 Q130 128 142 158 L156 152 Q140 122 124 106Z" fill="${CAPA}" stroke="${CONT}" stroke-width="4" stroke-linejoin="round"/>
     <circle cx="152" cy="160" r="9.5" fill="${PELE}" stroke="${CONT}" stroke-width="3"/>
   </g>
  </g>
 </g>
</svg>`;
}

const rad = Math.PI / 180;

export class Eremita {
  constructor(raiz, reduzido) {
    this.raiz = raiz;
    this.reduzido = reduzido;
    const q = (id) => raiz.querySelector('#' + id);
    this.p = {
      espelho: q('er-espelho'), ator: q('er-ator'), corpo: q('er-corpo'), barra: q('er-barra'),
      cabeca: q('er-cabeca'), olhos: q('er-olhos'), bracoF: q('er-bracoF'), bracoT: q('er-bracoT'),
      pernaF: q('er-pernaF'), pernaT: q('er-pernaT'), luz: q('er-luz'), onda: q('er-onda')
    };
    this.fase = 0;        // fase do ciclo de passos (radianos)
    this.andar = 0;       // 0 parado, 1 andando (suavizado)
    this.fuga = 0;        // 0 normal, 1 correndo na fuga
    this.dir = 1;
    this.t = 0;
    this.piscar = 3;
    // valores animados pelas ações (GSAP)
    this.acao = { braco: 0, agacha: 0, inclina: 0, luz: 0 };
  }

  // v = deslocamento neste quadro (unidades do mundo); fuga = 0..1
  atualizar(dt, v, fuga) {
    this.t += dt;
    const mov = Math.abs(v) > 0.15;
    if (mov) this.dir = v > 0 ? 1 : -1;
    this.andar += ((mov ? 1 : 0) - this.andar) * Math.min(1, dt * (mov ? 10 : 5));
    this.fuga += (fuga - this.fuga) * Math.min(1, dt * 4);
    if (!this.reduzido) this.fase += Math.abs(v) * (2 * Math.PI / 118);

    const w = this.reduzido ? 0 : this.andar;
    const s = Math.sin(this.fase), c = Math.cos(this.fase);
    const a = this.acao, fu = this.fuga;
    const resp = Math.sin(this.t * 2.1);

    const perna = (28 + fu * 8) * s * w;
    const bob = (3.5 + fu * 3) * Math.abs(s) * w + a.agacha;
    const inclina = (fu * 9 * w) + a.inclina + (w * 2);
    const set = (el, tr) => el.setAttribute('transform', tr);

    set(this.p.espelho, this.dir < 0 ? 'translate(208 0) scale(-1 1)' : '');
    set(this.p.ator, `translate(0 ${bob.toFixed(2)}) rotate(${inclina.toFixed(2)} 104 300)`);
    set(this.p.pernaF, `rotate(${perna.toFixed(2)} 106 200)`);
    set(this.p.pernaT, `rotate(${(-perna).toFixed(2)} 99 200)`);
    const respira = 1 + 0.014 * resp * (1 - w);
    set(this.p.corpo, `translate(0 250) scale(1 ${respira.toFixed(4)}) translate(0 -250)`);
    const balanco = -(6 + fu * 10) * Math.sin(this.fase - 0.7) * w + 2.2 * Math.sin(this.t * 1.4) * (1 - w) + fu * w * 4 * Math.sin(this.t * 22);
    set(this.p.barra, `translate(102 248) skewX(${balanco.toFixed(2)}) translate(-102 -248)`);
    set(this.p.cabeca, `rotate(${(1.6 * Math.sin(this.fase * 2) * w + 1.2 * resp * (1 - w)).toFixed(2)} 104 108)`);
    set(this.p.bracoT, `rotate(${(-24 * s * w).toFixed(2)} 92 118)`);
    set(this.p.bracoF, `rotate(${(7 * s * w + a.braco).toFixed(2)} 116 118)`);

    // piscar
    this.piscar -= dt;
    let olho = 1;
    if (this.piscar < 0.12) olho = 0.15;
    if (this.piscar < 0) this.piscar = 2.5 + Math.random() * 3;
    set(this.p.olhos, `translate(0 70) scale(1 ${olho}) translate(0 -70)`);

    // brilho do cajado pulsa sempre
    const pulso = this.reduzido ? 1 : 1 + 0.12 * Math.sin(this.t * 3) + a.luz * 0.6;
    set(this.p.luz, `translate(153 -6) scale(${pulso.toFixed(3)}) translate(-153 -6)`);
    this.p.luz.style.opacity = Math.min(1, 0.75 + a.luz * 0.25);
    this.passo = c; // exposto para efeitos (poeira)
  }

  onda(tam = 140, dur = 0.9) {
    const o = this.p.onda;
    gsap.fromTo(o, { attr: { r: 18 }, opacity: 0.9 }, { attr: { r: tam }, opacity: 0, duration: dur, ease: 'power2.out' });
  }

  // Chega numa parada: apoia o cajado e solta um pulso de luz
  chegar() {
    if (this.ocupado) return;
    gsap.timeline()
      .to(this.acao, { braco: -10, duration: 0.25, ease: 'power2.out' })
      .to(this.acao, { braco: 3, agacha: 3, duration: 0.14, ease: 'power3.in' })
      .add(() => this.onda())
      .to(this.acao, { luz: 1, duration: 0.12 }, '<')
      .to(this.acao, { braco: 0, agacha: 0, luz: 0, duration: 0.6, ease: 'power2.out' });
  }

  // Abaixa para colher a semente
  colher() {
    this.ocupado = true;
    gsap.timeline({ onComplete: () => { this.ocupado = false; } })
      .to(this.acao, { agacha: 26, inclina: 16, braco: 14, duration: 0.22, ease: 'power2.out' })
      .add(() => this.onda(90, 0.6))
      .to(this.acao, { luz: 1.2, duration: 0.15 }, '<')
      .to(this.acao, { agacha: 0, inclina: 0, braco: 0, luz: 0, duration: 0.45, ease: 'back.out(2)' }, '+=0.12');
  }

  // Final: ergue o cajado e ilumina o canteiro
  erguer(ligado) {
    if (ligado === this.erguido) return;
    this.erguido = ligado;
    if (ligado) {
      gsap.to(this.acao, { braco: -38, inclina: -4, luz: 1.6, duration: 0.7, ease: 'back.out(1.6)' });
      this.onda(260, 1.4);
    } else {
      gsap.to(this.acao, { braco: 0, inclina: 0, luz: 0, duration: 0.5 });
    }
  }
}
