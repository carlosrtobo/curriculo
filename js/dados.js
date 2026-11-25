// Conteúdo do currículo: tudo o que aparece no mundo e na versão em texto.
// Editar aqui muda o site inteiro.

export const pessoa = {
  nome: 'Carlos Tobo',
  titulo: 'Comunicólogo, professor de design e linguagem e escritor',
  frase: 'Entre a palavra e o design, planto histórias, ensino caminhos e desenho mundos.',
  instagram: 'https://www.instagram.com/carlos.tobo/'
};

// As cinco regiões do caminho (unidades do mundo: a tela tem 1000 de altura)
export const regioes = [
  { id: 'cafezal', nome: 'Cafezal Infinito', curto: 'Cafezal', ini: 0, fim: 2600 },
  { id: 'fuga', nome: 'A Fuga do Cafezal', curto: 'Fuga', ini: 2600, fim: 6000 },
  { id: 'piramide', nome: 'Caminho para a Pirâmide', curto: 'Pirâmide', ini: 6000, fim: 10700 },
  { id: 'vale', nome: 'Vale das Borboletas', curto: 'Vale', ini: 10700, fim: 15000 },
  { id: 'retorno', nome: 'De volta ao Cafezal', curto: 'Retorno', ini: 15000, fim: 17400 }
];

export const habilidades = [
  { nome: 'Edição e manipulação de imagem', nivel: 9, icone: 'camadas', nota: 'a base de tudo' },
  { nome: 'UX e design de interfaces', nivel: 8, icone: 'cursor' },
  { nome: 'Identidade visual e design systems', nivel: 8, icone: 'paleta' },
  { nome: 'Design instrucional', nivel: 6, icone: 'trilha', nota: 'em testes' },
  { nome: 'Front-end', nivel: 5, icone: 'codigo' },
  { nome: 'Escrita e construção de mundos', nivel: 5, icone: 'pena', nota: 'a mais nova' }
];

// Linha do tempo: formação (pergaminho) e trabalho (objeto)
export const linhaDoTempo = [
  {
    ano: '2000', ate: '2003', tipo: 'formacao', objeto: 'camera',
    titulo: 'Comunicação Social: Multimeios', local: 'PUC-SP',
    detalhes: ['Graduação em Comunicação Social, habilitação em Multimeios.', 'O TCC foi o CD-ROM Mandalas: Caminhos para o Centro, feito em Flash.']
  },
  {
    ano: '2001', ate: '2003', tipo: 'trabalho', objeto: 'filme',
    titulo: 'Estagiário na Videoteca', local: 'PUC-SP',
    detalhes: ['Gravação em vídeo de palestras e eventos.', 'Catalogação e revisão do acervo.', 'Organização de mostras de vídeo e exposições.', 'Criação de convites e release do Espaço Cultural.', 'Atendimento ao público.']
  },
  {
    ano: '2004', ate: '2008', tipo: 'trabalho', objeto: 'prancheta',
    titulo: 'Autônomo', local: 'Sites, imagens e ilustrações',
    detalhes: ['Produção de sites.', 'Tratamento de imagens.', 'Ilustrações.']
  },
  {
    ano: '2008', tipo: 'trabalho', objeto: 'cristal',
    titulo: 'Operador de Photoshop', local: 'Amani Cristais',
    detalhes: ['Tratamento de fotografias.', 'Criação de ilustrações.', 'Gravação de imagens em cristais.', 'Materiais promocionais (folders, vales-presente).', 'Atendimento.']
  },
  {
    ano: '2009', tipo: 'formacao', objeto: 'livro',
    titulo: 'Formação de Professores: Letras/Português', local: 'UNIBAN',
    detalhes: ['Programa Especial de Formação de Professores, habilitação em Letras/Português.']
  },
  {
    ano: '2009', tipo: 'trabalho', objeto: 'provas',
    titulo: 'Avaliações SARESP e SAEB', local: 'CAED-UFJF · Consulplan',
    detalhes: ['Apoio regional (SARESP, CAED-UFJF) e multiplicador (SAEB, Consulplan).', 'Alocação e treinamento de aplicadores e fiscais.', 'Logística das provas e apoio aos diretores.', 'Organização de materiais e relatórios.']
  },
  {
    ano: '2010', ate: 'hoje', tipo: 'trabalho', objeto: 'escola', destaque: true,
    titulo: 'Professor no Centro Paula Souza', local: 'Etec Parque Belém',
    detalhes: [
      'Hoje leciona Língua Portuguesa, Gestão de Conteúdo Web, Usabilidade, Design de Interfaces e Acessibilidade Digital, e Arte Digital.',
      'Cursos técnicos em Informática para Internet e em Desenvolvimento de Sistemas.',
      'Já lecionou nos cursos de Comunicação Visual e de Orientação Comunitária, e na Etec Vila Formosa.',
      'Orientação de TCC.',
      'Foi coordenador de área do curso de Informática para Internet por 9 anos: eventos e visitas técnicas, concursos de fotografia e de poesia, Plano Plurianual de Gestão, bancas de seleção de professores e apadrinhamento de novos alunos.'
    ]
  },
  {
    ano: '2014', tipo: 'formacao', objeto: 'pergaminho',
    titulo: 'Especialização em Arte, Educação e Terapia', local: 'FATECE',
    detalhes: ['Pós-graduação lato sensu concluída em 2014.']
  }
];

// Áreas dos cursos complementares (o baú)
export const areas = {
  design: { nome: 'Design e UX', cor: '#C8553A', icone: 'cursor' },
  web: { nome: 'Front-end e web', cor: '#4F6647', icone: 'codigo' },
  ia: { nome: 'Inteligência artificial', cor: '#4B2A5A', icone: 'faisca' },
  com: { nome: 'Comunicação e mídias', cor: '#B98A2E', icone: 'balao' },
  edu: { nome: 'Docência e educação', cor: '#5B6E8C', icone: 'livro' },
  arte: { nome: 'Arte e cultura', cor: '#8A5A3A', icone: 'pincel' },
  img: { nome: 'Imagem, vídeo e som', cor: '#2B2A28', icone: 'camadas' }
};

// n = quantos cursos o item reúne; h = carga horária total (quando informada)
export const cursos = [
  { periodo: '2022–2026', titulo: 'Interfaces, front-end, comunicação e IA', itens: [
    { t: 'Workshop Portfólio de IA na Prática (duas edições)', a: 'ia', ano: 2026, n: 2 },
    { t: 'Formação continuada: correção de redação', a: 'edu', ano: 2026, h: 180 },
    { t: 'Língua Portuguesa e Literatura', a: 'edu', ano: 2024, h: 150 },
    { t: 'Novas tecnologias e formação docente', a: 'edu', ano: 2024, h: 120 },
    { t: 'Formação em mídias sociais', a: 'com', ano: 2024, h: 66 },
    { t: 'JavaScript: cinco cursos, da linguagem aos objetos e à web', a: 'web', ano: 2024, h: 56, n: 5 },
    { t: 'jQuery: a biblioteca mais popular do mercado, partes 1 e 2', a: 'web', ano: 2024, h: 24, n: 2 },
    { t: 'WordPress: crie sites com Elementor e Figma', a: 'web', ano: 2024, h: 10 },
    { t: 'WordPress: responsividade, efeitos visuais e plugins', a: 'web', ano: 2024, h: 8 },
    { t: 'Inteligência artificial e personas', a: 'ia', ano: 2024, h: 8 },
    { t: 'UX Design: persona, projetos estratégicos e concepção do produto', a: 'design', ano: 2023, h: 26, n: 3 },
    { t: 'UX Design: entenda a área da User Experience', a: 'design', ano: 2023, h: 8 },
    { t: 'Design System: criando um produto digital', a: 'design', ano: 2023, h: 8 },
    { t: 'Handoff: documentando a entrega do projeto', a: 'design', ano: 2023, h: 10 },
    { t: 'Vetores e animações com SVG', a: 'web', ano: 2023, h: 6 },
    { t: 'Mídias sociais: estratégias para engajar o público', a: 'com', ano: 2023, h: 8 },
    { t: 'Princípios da influência: persuasão com foco em negócios', a: 'com', ano: 2023, h: 13 },
    { t: 'Design System: elementos, componentes e publicação', a: 'design', ano: 2022, h: 26, n: 3 },
    { t: 'Design Thinking: viabilizando soluções', a: 'design', ano: 2022, h: 8 },
    { t: 'Figma: site mobile, componentes e Design System', a: 'design', ano: 2022, h: 32, n: 3 },
    { t: 'UX: experiência do usuário, UX Strategy, usabilidade mobile e testes', a: 'design', ano: 2022, h: 32, n: 4 }
  ]},
  { periodo: '2012–2018', titulo: 'Docência, arte e design', itens: [
    { t: 'Quadrinhos em sala de aula: estratégias, instrumentos e aplicações', a: 'edu', ano: 2018, h: 160 },
    { t: 'A arte como forma de comunicação', a: 'arte', ano: 2017, h: 210 },
    { t: 'Comunicação e linguagem', a: 'com', ano: 2017, h: 210 },
    { t: 'Formação continuada em Design Gráfico', a: 'design', ano: 2017, h: 220 },
    { t: 'Formação continuada em Marketing Digital', a: 'com', ano: 2016, h: 210 },
    { t: 'Capacitação em Design Gráfico: conceito e aplicação', a: 'design', ano: 2016, h: 40 },
    { t: 'Curso de HTML5', a: 'web', ano: 2016, h: 120 },
    { t: 'Curso de Flash', a: 'web', ano: 2016, h: 120 },
    { t: 'Atualização em programação para web: HTML e CSS', a: 'web', ano: 2016, h: 40 },
    { t: 'Saúde psíquica e física do discente', a: 'edu', ano: 2016, h: 20 },
    { t: 'Ferramentas práticas para TCC', a: 'edu', ano: 2016, h: 20 },
    { t: 'Mostra Ecofalante de Cinema Ambiental (Sesc)', a: 'arte', ano: 2016, h: 20 },
    { t: 'Visitas à 31ª e à 32ª Bienal de Artes', a: 'arte', ano: 2016, n: 2 },
    { t: 'Photoshop CS5', a: 'img', ano: 2015, h: 60 },
    { t: 'Fotografia digital', a: 'img', ano: 2015, h: 40 },
    { t: 'Psicologia da aprendizagem para adultos', a: 'edu', ano: 2015, h: 8 },
    { t: 'Acervos e Museus de São Paulo II', a: 'arte', ano: 2014, h: 48 },
    { t: 'Diálogos docentes: informação e comunicação', a: 'edu', ano: 2014, h: 16 },
    { t: 'Arte contemporânea na sala de aula', a: 'arte', ano: 2014, h: 6 },
    { t: 'Encontro sobre Arte, Fundação Bienal de São Paulo', a: 'arte', ano: 2014 },
    { t: 'O olhar do professor frente às demandas de diferentes gerações', a: 'edu', ano: 2013 },
    { t: 'TCC: a questão da metodologia e da referência, e videoconferência TCC', a: 'edu', ano: 2013, n: 2 },
    { t: 'Curso completo de Fireworks (MX Cursos Online)', a: 'img', ano: 2013, h: 40 },
    { t: 'Panorama da Educação Integrada ao Ensino Médio', a: 'edu', ano: 2012 },
    { t: 'Oficina Patrimônio em Rede: patrimônio artístico e cultural', a: 'arte', ano: 2012 }
  ]},
  { periodo: '2001–2011', titulo: 'Primeiras raízes', itens: [
    { t: 'Encontro de Orientadores de Projetos FETEPS (Centro Paula Souza)', a: 'edu', ano: 2011 },
    { t: 'Capacitação de professores: TCC (Centro Paula Souza)', a: 'edu', ano: 2011 },
    { t: 'Relações interpessoais: professor e aluno', a: 'edu', ano: 2010 },
    { t: 'Mídias na Educação, formação continuada a distância (NCE/USP)', a: 'edu', ano: 2010 },
    { t: 'Qualidade máxima de atendimento ao cliente (SEBRAE)', a: 'com', ano: 2009 },
    { t: 'Teorias dos processos de criação em artes e mídias (UNICAMP)', a: 'arte', ano: 2007, h: 45 },
    { t: 'Princípios para a crítica da cibercultura (CENCIB/PUC-SP)', a: 'com', ano: 2004, h: 12 },
    { t: 'Introdução à Educomunicação (ECA-USP)', a: 'edu', ano: 2004 },
    { t: 'Seminário de atualização em tecnologias Macromedia', a: 'web', ano: 2004 },
    { t: 'Oficina: Edição para internet I e II (PUC-SP)', a: 'web', ano: 2001, h: 120, n: 2 },
    { t: 'Oficina: Produção de conteúdo (PUC-SP)', a: 'com', ano: 2001, h: 60 },
    { t: 'Oficina: Criação musical (PUC-SP)', a: 'img', ano: 2002, h: 60 },
    { t: 'Oficina: Transgressões da linguagem do vídeo digital I e II (PUC-SP)', a: 'img', ano: 2002, h: 120, n: 2 },
    { t: 'Oficina: Realização de videoclipe (PUC-SP)', a: 'img', ano: 2003, h: 60 },
    { t: 'Oficina: Técnicas de edição de vídeo (PUC-SP)', a: 'img', ano: 2003, h: 60 },
    { t: 'Oficina: Questões contemporâneas da arte, a poética do desenho (PUC-SP)', a: 'arte', ano: 2003, h: 60 },
    { t: 'Oficina: Introdução à análise crítica do discurso (PUC-SP)', a: 'com', ano: 2003, h: 60 }
  ]}
];

export function resumoCursos() {
  const r = {};
  for (const k in areas) r[k] = { ...areas[k], id: k, n: 0, h: 0 };
  for (const p of cursos) for (const c of p.itens) { r[c.a].n += c.n || 1; r[c.a].h += c.h || 0; }
  return Object.values(r).sort((a, b) => b.n - a.n);
}

const P = 'img/projetos/';
export const projetos = [
  {
    id: 'mandalas', nome: 'Mandalas: Caminhos para o Centro', categoria: 'Criação visual · 2003/2026',
    capa: P + 'mandala-principal.jpg',
    imagens: [
      [P + 'mandala-principal.jpg', 'Tela inicial do construtor de mandalas'],
      [P + 'mandala-hindu.jpg', 'Montagem de uma mandala hindu (yantra)'],
      [P + 'mandala-indigena.jpg', 'Montagem de uma mandala indígena'],
      [P + 'mandala-sua.jpg', 'Modo "sua mandala", de criação livre']
    ],
    texto: 'Um construtor interativo de mandalas de várias tradições (hindu, indígena e uma "sua mandala", livre), com peças, modelo, música e impressão. Nasceu como CD-ROM em Flash no meu TCC, em 2003, e voltou a brotar em 2026, recriado em HTML, fiel ao original. É a raiz do meu trabalho com criação visual.'
  },
  {
    id: 'ariadne', nome: 'Ariadne Web', categoria: 'Identidade visual',
    capa: P + 'ariadne-capa.jpg',
    imagens: [
      [P + 'ariadne-capa.jpg', 'Marca Ariadne Web: o fio vira traço e o touro vira assinatura'],
      [P + 'ariadne-sacola.jpg', 'Sacola do kit promocional'],
      [P + 'ariadne-cracha.jpg', 'Crachá e fita do kit promocional']
    ],
    texto: 'Identidade visual e kit promocional de uma marca de soluções web. O conceito vem do fio de Ariadne, que guia para fora do labirinto: o fio vira traço, o touro vira assinatura, com círculo vermelho e tipografia geométrica. O kit tem sacola, caixa com o texto do mito, cartão de agradecimento, tag, crachá e fita.'
  },
  {
    id: 'apmas', nome: 'Apmas', categoria: 'Narrativa visual com IA',
    capa: P + 'apmas-onca.jpg', link: 'https://www.instagram.com/carlos.tobo/', linkTexto: 'Ver no Instagram',
    imagens: [
      [P + 'apmas-onca.jpg', 'Onça luminosa do mundo de Apmas'],
      [P + 'apmas-ogro1.jpg', 'O ogro, o elfo de rosa e o cão-aranha fazendo bagunça'],
      [P + 'apmas-ogro2.jpg', 'Os três presos na teia do cão-aranha']
    ],
    janela: true,
    texto: 'O registro visual de um mundo que está crescendo aos poucos. Um projeto de criação de mundos e narrativa visual em IA, publicado no @carlos.tobo.'
  },
  {
    id: 'rosa', nome: 'Grande Sertão: Veredas', categoria: 'Literatura · educação',
    capa: P + 'rosa-capa.jpg',
    imagens: [
      [P + 'rosa-capa.jpg', 'Capa do baralho de cartões de reflexão'],
      [P + 'rosa-cartao1.jpg', 'Cartão com citação de Guimarães Rosa e pergunta para refletir'],
      [P + 'rosa-cartao2.jpg', 'Outro cartão do baralho']
    ],
    texto: 'Um baralho digital de cartões de reflexão. Cada cartão traz uma citação de Guimarães Rosa, um tema (amor, Deus e o diabo…) e uma pergunta "Para refletir", que leva os alunos a pensar a própria vida a partir da travessia de Riobaldo. Tem contador de cartões restantes.'
  },
  {
    id: 'jp', nome: 'Isla Nublar: Jurassic Park', categoria: 'Site-modelo · projeto integrador',
    capa: P + 'jp-capa.jpg',
    imagens: [
      [P + 'jp-capa.jpg', 'Página inicial do site-modelo Isla Nublar'],
      [P + 'jp-setores.jpg', 'Setores de observação como canais de vigilância ao vivo'],
      [P + 'jp-especie.jpg', 'Ficha de uma espécie']
    ],
    texto: 'Um site-modelo feito para mostrar aos alunos o projeto que eu queria no projeto integrador. Trata o parque como um sistema real: visão geral, setores de observação como canais de vigilância "ao vivo", fichas de espécies, origem, curiosidades e documentação. Mostra como se constrói um mundo navegável.'
  },
  {
    id: 'gramatica', nome: 'Análise em Dia', categoria: 'Gramática gamificada',
    capa: P + 'gram1.jpg', vertical: true, link: 'https://carlosrtobo.github.io/appgramatica/', linkTexto: 'Abrir o app',
    imagens: [
      [P + 'gram1.jpg', 'Tela inicial com XP, coleção de selos e trilha de módulos'],
      [P + 'gram2.jpg', 'Tela do app Análise em Dia'],
      [P + 'gram3.jpg', 'Tela do app Análise em Dia']
    ],
    texto: 'Uma forma de gamificar a gramática: serve para revisar com os alunos o que aprenderam e para apresentar conceitos de um jeito mais lúdico. Tem trilha de módulos, XP, selos colecionáveis, trilha bônus de figuras de linguagem, prática livre e um relatório que mostra o que o aluno domina, onde está "quase lá" e onde trava.'
  }
];

export const livro = {
  titulo: 'O Curador de Sementes',
  capa: 'img/marca/livro-capa.png',
  frase: 'Um romance de realismo mágico em São Thomé das Letras, sobre um homem que aprende o peso de cuidar de alguma coisa.',
  links: [
    { texto: 'Comprar na Amazon', sub: 'físico e e-book', url: 'https://www.amazon.com.br/dp/650229278X', icone: 'livro' },
    { texto: 'Clube de Autores', sub: 'livro físico', url: 'https://clubedeautores.com.br/livro/o-curador-de-sementes-3', icone: 'livro' },
    { texto: 'Seguir @carlos.tobo', sub: 'Instagram', url: 'https://www.instagram.com/carlos.tobo/', icone: 'insta' }
  ]
};
