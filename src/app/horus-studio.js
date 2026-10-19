/* HORUS · Apresentações: área de criação (início, modelos, marca) e gerador de apresentações a partir dos dados do cliente.
   Nunca mostra comissão, taxa ou receita do escritório: só o que é do cliente. */
(function(){
const W = window;
const A = W.ACT = W.ACT || {}, C = W.CHANGE = W.CHANGE || {};
const U = () => W.UI.des || (W.UI.des = { sub: 'home' });
const root = () => $('#studio');
const docs = () => (W.ST.docs = W.ST.docs || []);
const D = () => W.HorusData;
const ago = (t) => { const s = Math.max(0, (Date.now() - (t || 0)) / 1000); if (s < 60) return 'agora'; if (s < 3600) return 'há ' + Math.floor(s / 60) + ' min'; if (s < 86400) return 'há ' + Math.floor(s / 3600) + ' h'; const d = Math.floor(s / 86400); return d === 1 ? 'ontem' : 'há ' + d + ' dias'; };
const NAV = [['home', 'home', 'Início'], ['modelos', 'layout', 'Modelos'], ['marca', 'brand', 'Marca']];
const CREATE = [['apres', 'Apresentação'], ['post', 'Post'], ['story', 'Story'], ['retrato', 'Carrossel'], ['a4', 'Documento'], ['linkedin', 'Banner'], ['cartao', 'Cartão'], ['youtube', 'Capa de vídeo']];
const kitPickHTML = (k) => '<label class="st-kit">' + icon('brand', 'ic-sm') + '<span>Versão</span><select data-chg="stKit" aria-label="Versão da marca nos modelos">' + SX.kits().map(x => '<option value="' + x.id + '"' + (x.id === k ? ' selected' : '') + '>' + esc(x.nome) + '</option>').join('') + '</select></label>';
const shape = (fmt) => { const f = SX.FORMATS[fmt]; const r = f.w / f.h, w = r >= 1 ? 30 : Math.round(30 * r), h = r >= 1 ? Math.round(30 / r) : 30; return '<i class="st-shape" style="width:' + w + 'px;height:' + Math.max(8, h) + 'px"></i>'; };
const tkit = () => U().tkit || 'hr';

/* ---------- Abrir e fechar ---------- */
function show() {
  const R = root(); if (!R) return;
  R.hidden = false; document.body.classList.add('in-studio');
  if (!U().sub) U().sub = 'home';
  render();
}
function hide() { const R = root(); if (!R) return; R.hidden = true; document.body.classList.remove('in-studio'); }
function render() {
  const R = root(); if (!R || R.hidden) return;
  if (U().sub === 'editor') {
    if (!Editor.doc) { U().sub = 'home'; return render(); }
    if (!R.querySelector('#sxEd') || R.dataset.doc !== Editor.doc.id) { R.innerHTML = '<div class="st-edroot" id="stEd"></div>'; R.dataset.doc = Editor.doc.id; Editor.mount($('#stEd')); }
    return;
  }
  R.dataset.doc = '';
  const keep = R.querySelector('.st-main') ? R.querySelector('.st-main').scrollTop : 0;
  R.innerHTML = '<div class="st-shell"><aside class="st-side">' +
    '<div class="st-brand">' + SX.logoTile(false, 34) + '<span><b>Apresentações</b><small>HORUS</small></span></div>' +
    '<button class="st-create" data-act="stCreate">' + icon('plus', 'ic-sm') + 'Criar</button>' +
    '<nav class="st-nav" aria-label="Apresentações">' + NAV.map(([k, ic, l]) => '<button class="' + (U().sub === k ? 'on' : '') + '" data-act="stNav" data-v="' + k + '">' + icon(ic, 'ic-sm') + '<span>' + l + '</span>' + (k === 'home' && docs().length ? '<em>' + docs().length + '</em>' : '') + '</button>').join('') + '</nav>' +
    '<span class="sp"></span><button class="st-back" data-act="go" data-v="inicio">' + icon('chevL', 'ic-sm') + 'Voltar ao HORUS</button></aside>' +
    '<main class="st-main" id="stMain">' + ({ home, modelos, marca }[U().sub] || home)() + '</main></div>';
  const m = R.querySelector('.st-main'); if (m) m.scrollTop = keep;
}

/* ---------- Cartões ---------- */
function docCard(d) {
  const f = SX.fmtOf(d), pg = d.pages[0], w = 260, h = 150, cli = d.cli && D().cliente(d.cli);
  return '<article class="st-dc"><button class="st-dcpv" data-act="stOpen" data-id="' + d.id + '" aria-label="Abrir ' + esc(d.nome) + '">' + (pg ? SX.preview(pg, d, w, h) : '') + '</button>' +
    '<div class="st-dcb"><div style="min-width:0"><b title="' + esc(d.nome) + '">' + esc(d.nome) + '</b><small>' + (cli ? esc(cli.nome) + ' · ' : '') + esc(f.l) + ' · ' + d.pages.length + ' pág. · editado ' + ago(d.upd) + '</small></div>' +
    '<button class="ibtn" data-act="stDocMenu" data-id="' + d.id + '" aria-label="Opções">' + icon('dots', 'ic-sm') + '</button></div></article>';
}
function deckCard(d, kid) {
  const K = SX.roles(SX.kitOf(kid)), f = SX.FORMATS.apres;
  const key = 'deck|' + kid + '|' + d.id + '|' + JSON.stringify(K.kit.c);
  W._stPv = W._stPv || new Map();
  if (!W._stPv.has(key)) { const pgs = d.pages.slice(0, 4).map(([k, t]) => SX.makeLayout(k, K, f, t)); SX.measure(f, pgs); W._stPv.set(key, '<span class="st-mosaic">' + SX.preview(pgs[0], f, 300, 169) + '<span class="st-mos3">' + pgs.slice(1).map(p => SX.preview(p, f, 96, 54)).join('') + '</span></span>'); }
  return '<button class="st-deck" data-act="stDeck" data-id="' + d.id + '">' + W._stPv.get(key) + '<span><b>' + esc(d.nome) + '</b><small>' + d.pages.length + ' páginas · ' + esc(d.desc) + '</small></span></button>';
}

/* ---------- Início ---------- */
function genCard() {
  const cs = D().clientes();
  if (!cs.length) return '<section class="hs-gen"><div class="hs-gen-t"><span class="st-eyebrow">Com os dados do cliente</span><h2>Apresentação pronta em um clique</h2><p>Cadastre um cliente com lançamentos para gerar a proposta ou a revisão de carteira com os números dele.</p></div></section>';
  const sel = U().gCli && cs.some(c => c.id === U().gCli) ? U().gCli : cs[0].id, tipo = U().gTipo || 'proposta';
  const c = D().cliente(sel), pos = D().carteira(sel), tot = pos.reduce((s, p) => s + p.valor, 0);
  return '<section class="hs-gen"><div class="hs-gen-t"><span class="st-eyebrow">Com os dados do cliente</span><h2>Apresentação pronta em um clique</h2>' +
    '<p>O HORUS monta os slides com o perfil, o patrimônio e a carteira do cliente. Você revisa, ajusta e apresenta. Comissões e receitas nunca aparecem.</p></div>' +
    '<div class="hs-gen-f"><label class="fld"><span>Cliente</span><select class="inp" data-chg="gCli" aria-label="Cliente">' + cs.map(x => '<option value="' + x.id + '"' + (x.id === sel ? ' selected' : '') + '>' + esc(x.nome) + '</option>').join('') + '</select></label>' +
    '<div class="fld"><span>Tipo</span><div class="seg" role="group">' + [['proposta', 'Proposta de carteira'], ['revisao', 'Revisão de carteira']].map(([k, l]) => '<button data-act="gTipo" data-v="' + k + '" class="' + (tipo === k ? 'on' : '') + '">' + l + '</button>').join('') + '</div></div>' +
    '<div class="hs-gen-s"><span><small>Perfil</small><b>' + esc(c.perfil || '—') + '</b></span><span><small>Patrimônio</small><b>' + fBRLk(tot) + '</b></span><span><small>Posições</small><b>' + pos.length + '</b></span></div>' +
    '<button class="btn btn-primary" data-act="gGo" data-id="' + sel + '">' + icon('sparkle', 'ic-sm') + 'Gerar apresentação</button></div></section>';
}
function home() {
  const q = (U().q || '').toLowerCase(), g = U().grp || 'all', kid = tkit();
  const list = docs().filter(d => (!q || d.nome.toLowerCase().includes(q)) && (g === 'all' || SX.fmtOf(d).g === g)).sort((a, b) => (b.upd || 0) - (a.upd || 0));
  const h = new Date().getHours();
  return '<section class="st-hero"><div class="st-hero-in"><span class="st-eyebrow">' + (h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite') + ' · Apresentações HORUS</span><h1>Apresentações que ajudam a captar</h1>' +
    '<label class="st-search">' + icon('zoomIn', 'ic-sm') + '<input type="search" data-chg="stQ" value="' + esc(U().q || '') + '" placeholder="Buscar nas suas apresentações" aria-label="Buscar apresentações"></label>' +
    '<div class="st-formats">' + CREATE.map(([k, l]) => '<button class="st-fmt" data-act="stNew" data-v="' + k + '"><span class="st-fmtic">' + shape(k) + '</span><b>' + l + '</b><small>' + SX.FORMATS[k].w + '×' + SX.FORMATS[k].h + '</small></button>').join('') +
    '<button class="st-fmt" data-act="stCustom"><span class="st-fmtic">' + icon('custom') + '</span><b>Personalizado</b><small>Qualquer tamanho</small></button></div></div></section>' +
    genCard() +
    '<section class="st-sec"><div class="st-sech"><h2>Modelos de carteira e captação</h2>' + kitPickHTML(kid) + '<button class="btn btn-sm btn-ghost" data-act="stNav" data-v="modelos">Ver todos os modelos</button></div>' +
    '<div class="st-row">' + SX.DECKS.map(d => deckCard(d, kid)).join('') + '</div></section>' +
    '<div class="st-cols"><section class="st-sec"><div class="st-sech"><h2>Suas apresentações</h2><div class="seg" role="group">' + [['all', 'Todas'], ['apres', 'Apresentações'], ['social', 'Redes sociais'], ['doc', 'Documentos']].map(([k, l]) => '<button data-act="stGrp" data-v="' + k + '" class="' + (g === k ? 'on' : '') + '">' + l + '</button>').join('') + '</div></div>' +
    (list.length ? '<div class="st-docs">' + list.map(docCard).join('') + '</div>' : '<div class="st-empty">' + icon('presenter') + '<b>' + (q ? 'Nada encontrado para “' + esc(q) + '”.' : 'Nenhuma apresentação ainda') + '</b><span>Gere uma a partir de um cliente ou comece por um modelo.</span></div>') + '</section>' +
    '<aside class="st-sec st-aside"><div class="st-sech"><h2>Para captar mais</h2></div>' +
    '<div class="hs-tips"><p><b>Comece pelo objetivo.</b> Abra com o que o cliente quer conquistar, não com produtos.</p><p><b>Um número por slide.</b> Patrimônio, prazo e aporte falam mais que tabelas cheias.</p><p><b>Mostre o caminho.</b> Os três perfis ajudam o cliente a se enxergar na carteira indicada.</p><p><b>Feche com o próximo passo.</b> Data da próxima conversa e o que ele precisa trazer.</p></div>' +
    '<div class="st-tips"><b>Atalhos do editor</b><span><kbd>T</kbd> texto · <kbd>R</kbd> retângulo · <kbd>C</kbd> círculo · <kbd>L</kbd> linha</span><span><kbd>Ctrl</kbd>+<kbd>Enter</kbd> nova página · <kbd>Ctrl</kbd>+<kbd>D</kbd> duplicar</span><span><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>P</kbd> apresentar</span></div></aside></div>';
}

/* ---------- Modelos ---------- */
function modelos() {
  const kid = tkit(), K = SX.roles(SX.kitOf(kid)), f = SX.FORMATS.apres, kc = JSON.stringify(K.kit.c);
  W._stPv = W._stPv || new Map();
  const pv = (key, make, fmt, w, h) => { key += '|' + kc; if (!W._stPv.has(key)) { const pg = make(); SX.measure(fmt, [pg]); W._stPv.set(key, SX.preview(pg, fmt, w, h)); } return W._stPv.get(key); };
  return '<div class="st-pageh"><div><span class="st-eyebrow">Biblioteca</span><h1>Modelos</h1><p>Todos os modelos usam as cores e fontes da versão de marca escolhida.</p></div>' + kitPickHTML(kid) + '</div>' +
    '<section class="st-sec"><div class="st-sech"><h2>Apresentações completas</h2></div><div class="st-grid3">' + SX.DECKS.map(d => deckCard(d, kid)).join('') + '</div></section>' +
    '<section class="st-sec"><div class="st-sech"><h2>Layouts de slide</h2><span class="muted">Clique para começar uma apresentação a partir do layout</span></div><div class="st-grid4">' +
    Object.entries(SX.LAYOUTS).map(([k, L]) => '<button class="st-lay" data-act="stLayout" data-v="' + k + '">' + pv('lay|' + kid + '|' + k, () => SX.makeLayout(k, K, f), f, 240, 135) + '<span>' + L.nome + '</span></button>').join('') + '</div></section>' +
    '<section class="st-sec"><div class="st-sech"><h2>Redes sociais e documentos</h2></div><div class="st-grid4">' +
    SX.SOCIAL.map(s => { const fm = SX.FORMATS[s.fmt]; return '<button class="st-lay" data-act="stSocial" data-v="' + s.id + '"><div class="st-laybox">' + pv('soc|' + kid + '|' + s.id, () => SX.makeSocial(s, K), fm, 200, 160) + '</div><span>' + esc(s.nome) + ' <small>' + fm.l + '</small></span></button>'; }).join('') + '</div></section>';
}

/* ---------- Marca ---------- */
function marca() {
  const custom = (W.ST.cfg && W.ST.cfg.kits) || {};
  const card = (c) => { const light = SX.lum(c.c[0]) > 0.55; return '<article class="st-kitcard"><div class="st-kittop" style="background:' + c.c[0] + '">' + SX.logoTile(light, 52) + '<b style="font-family:\'' + c.f[0] + '\';color:' + (c.c[2] || '#fff') + '">' + esc(c.nome) + '</b></div>' +
    '<div class="st-kitsw">' + c.c.map(x => '<button data-act="copyHex" data-c="' + x + '" style="background:' + x + '" title="Copiar ' + x + '" aria-label="Copiar cor ' + x + '"></button>').join('') + '</div>' +
    '<div class="st-kitf"><span style="font-family:\'' + c.f[0] + '\';font-size:19px;font-weight:700">' + esc(c.f[0]) + '</span><span class="muted" style="font-family:\'' + (c.f[1] || c.f[0]) + '\'">' + esc(c.f[1] || c.f[0]) + ' · texto</span></div>' +
    '<div class="st-kitact"><button class="btn btn-sm btn-ghost" data-act="editKit" data-id="' + c.id + '">Ajustar</button>' + (custom[c.id] ? '<button class="btn btn-sm btn-ghost" data-act="resetKit" data-id="' + c.id + '">Restaurar</button>' : '') + '<span class="sp"></span><button class="btn btn-sm" data-act="kitDesign" data-id="' + c.id + '">' + icon('palette', 'ic-sm') + 'Criar com esta versão</button></div></article>'; };
  return '<div class="st-pageh"><div><span class="st-eyebrow">Identidade</span><h1>Marca HORUS</h1><p>Três versões da marca prontas para as apresentações. O símbolo se adapta sozinho a fundos claros e escuros.</p></div></div>' +
    '<div class="st-kits">' + SX.kits().map(card).join('') + '</div>' +
    '<section class="st-sec" style="margin-top:26px"><div class="st-sech"><h2>Aviso legal padrão</h2></div><p class="muted" style="max-width:820px;line-height:1.6;margin:0">' + esc(SX.LEGAL) + '</p><p class="muted" style="font-size:12.5px">Já vem no slide de encerramento. Mantenha sempre um aviso como este em material para clientes.</p></section>';
}
A.copyHex = (b) => { const c = b.dataset.c; try { navigator.clipboard.writeText(c).then(() => toast('Cor ' + c + ' copiada'), () => toast(c)); } catch (e) { toast(c); } };
A.kitDesign = (b) => { openModal('Criar', '<div class="st-fmtgrid">' + CREATE.map(([k, l]) => '<button class="st-fmt" data-act="kitDesignGo" data-kit="' + b.dataset.id + '" data-v="' + k + '"><span class="st-fmtic">' + shape(k) + '</span><b>' + l + '</b></button>').join('') + '</div>', ''); };
A.kitDesignGo = (b) => { const fmt = b.dataset.v, kit = b.dataset.kit, t = SX.SOCIAL.find(s => s.fmt === fmt); const d = Editor.create(fmt, { kit, deck: fmt === 'apres' ? SX.DECKS[0] : null, tpl: fmt !== 'apres' ? t : null, nome: SX.FORMATS[fmt].l + ' · ' + SX.kitOf(kit).nome }); closeModal(); openEditor(d.id); };
A.editKit = (b) => {
  const c = SX.kitOf(b.dataset.id);
  openModal('Ajustar · ' + c.nome, '<form id="kitForm" class="stack" style="gap:12px"><div class="grid-f">' + ['Fundo', 'Destaque', 'Texto', 'Secundária', 'Apoio'].map((l, i) => '<label class="fld"><span>' + l + '</span><input type="color" name="c' + i + '" value="' + SX.toHex(c.c[i]) + '" style="padding:2px;height:40px"></label>').join('') +
    '<label class="fld"><span>Fonte de títulos</span><select name="f0">' + SX.FONTS.map(f => '<option' + (f === c.f[0] ? ' selected' : '') + '>' + f + '</option>').join('') + '</select></label>' +
    '<label class="fld"><span>Fonte de texto</span><select name="f1">' + SX.FONTS.map(f => '<option' + (f === c.f[1] ? ' selected' : '') + '>' + f + '</option>').join('') + '</select></label></div></form>',
    '<button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-primary" data-act="saveKit" data-id="' + c.id + '">Salvar</button>');
};
A.saveKit = (b) => {
  const f = $('#kitForm'), cfg = W.ST.cfg = W.ST.cfg || {}; cfg.kits = cfg.kits || {};
  cfg.kits[b.dataset.id] = { c: [0, 1, 2, 3, 4].map(i => f['c' + i].value), f: [f.f0.value, f.f1.value] };
  W._stPv && W._stPv.clear(); persist(); closeModal(); render(); toast('Versão da marca atualizada');
};
A.resetKit = (b) => { const k = (W.ST.cfg || {}).kits; if (k) delete k[b.dataset.id]; W._stPv && W._stPv.clear(); persist(); render(); toast('Cores originais restauradas'); };

/* ---------- Gerador a partir do cliente ---------- */
const MODELO = {
  Conservador: [['Renda fixa pós-fixada', 70, 'Reserva e liquidez'], ['Renda fixa inflação', 20, 'Proteção do poder de compra'], ['Multimercado', 10, 'Diversificação']],
  Moderado: [['Renda fixa pós-fixada', 45, 'Reserva e curto prazo'], ['Renda fixa inflação', 25, 'Objetivos de longo prazo'], ['Ações e fundos imobiliários', 20, 'Crescimento'], ['Internacional', 10, 'Diversificação em moeda forte']],
  Arrojado: [['Renda fixa pós-fixada', 25, 'Reserva'], ['Renda fixa inflação', 20, 'Longo prazo'], ['Ações e fundos imobiliários', 40, 'Crescimento'], ['Internacional', 15, 'Diversificação em moeda forte']]
};
const TAXA = { Conservador: 9, Moderado: 10, Arrojado: 11 };
const fK = (v) => fBRLk(v);
function contato(K) {
  const a = D().assessor();
  return { tel: '(00) 0 0000-0000', mail: a.email || '[seu e-mail]', social: '[@perfil]', sub: a.nome ? a.nome + ' · Horus Consultoria Financeira' : 'Seu patrimônio, acompanhado de perto.' };
}
function gerar(cid, tipo) {
  const c = D().cliente(cid), pos = D().carteira(cid), tot = pos.reduce((s, p) => s + p.valor, 0), perfil = c.perfil || 'Moderado';
  const first = (c.nome || '').split(' ')[0];
  const byCat = {}; pos.forEach(p => { const k = p.cat || 'Outros'; (byCat[k] = byCat[k] || { v: 0, n: [] }).v += p.valor; if (!byCat[k].n.includes(p.nome)) byCat[k].n.push(p.nome); });
  const aloc = Object.entries(byCat).sort((a, b) => b[1].v - a[1].v).map(([l, o]) => ({ l, v: Math.round(o.v / (tot || 1) * 1000) / 10, s: fK(o.v) + ' · ' + o.n.slice(0, 3).join(', ') }));
  const ct = contato();
  const venc = pos.filter(p => p.venc && p.venc <= dOff(365)).sort((a, b) => a.venc > b.venc ? 1 : -1);
  const P = [];
  if (tipo === 'revisao') {
    const evo = D().evolucao(cid, 12).map(r => ({ l: r.l, v: Math.round(r.v) }));
    const v0 = evo.length ? evo[0].v : 0, v1 = evo.length ? evo[evo.length - 1].v : 0, dif = v1 - v0;
    const rows = pos.slice().sort((a, b) => b.valor - a.valor), top = rows.slice(0, 9);
    const cells = [['Ativo', 'Classe', 'Valor aplicado', '% da carteira']].concat(top.map(p => [p.nome + (p.venc ? ' · vence ' + fDate(p.venc) : ''), p.cat, fBRL(p.valor), fNum(p.valor / (tot || 1) * 100, 1) + '%']));
    if (rows.length > top.length) { const rest = rows.slice(9).reduce((s, p) => s + p.valor, 0); cells.push(['Outros (' + (rows.length - 9) + ')', '', fBRL(rest), fNum(rest / (tot || 1) * 100, 1) + '%']); }
    cells.push(['Total', '', fBRL(tot), '100%']);
    P.push(['capa', { eyebrow: 'REVISÃO DE CARTEIRA', title: first ? first + ', veja como está o seu patrimônio' : 'Como está o seu patrimônio', sub: 'Preparada para ' + c.nome, notes: 'Começar perguntando se algo mudou nos objetivos desde a última conversa.' }]);
    P.push(['numeros', { title: 'Resumo da carteira', items: [[fK(tot), 'Patrimônio sob assessoria', 'Valores aplicados, sem marcação a mercado.'], [String(pos.length), pos.length === 1 ? 'Posição' : 'Posições', Object.keys(byCat).length + (Object.keys(byCat).length === 1 ? ' classe de ativo.' : ' classes de ativo.')], [String(venc.length), venc.length === 1 ? 'Vencimento em 12 meses' : 'Vencimentos em 12 meses', venc.length ? 'Próximo em ' + fDate(venc[0].venc) + '.' : 'Nenhum vencimento próximo.']] }]);
    P.push(['grafico', { title: 'Evolução dos valores aplicados', kind: 'line', fmt: 'brl', data: evo, kpi: dif > 0 ? '+' + fK(dif) : fK(v1), kpiTxt: dif > 0 ? 'a mais em valores aplicados nos últimos 12 meses, entre novos aportes e vencimentos.' : 'em valores aplicados hoje.' }]);
    P.push(['alocacao', { title: 'Alocação atual', data: aloc.length ? aloc : undefined, center: fK(tot), centerL: 'Patrimônio' }]);
    P.push(['carteira', { cells }]);
    P.push(['texto', { title: 'Ajustes sugeridos', para: 'Perfil ' + perfil.toLowerCase() + '. ' + (venc.length ? 'Temos ' + venc.length + (venc.length === 1 ? ' vencimento' : ' vencimentos') + ' nos próximos 12 meses para reinvestir de acordo com os objetivos.' : 'A carteira não tem vencimentos próximos.'), bullets: (venc.length ? 'Reinvestir ' + venc[0].nome + ' (' + fDate(venc[0].venc) + ')\n' : '') + '[Ajuste sugerido]\nManter a reserva de emergência' }]);
    P.push(['passos', { steps: [['Validação', 'Você aprova os ajustes sugeridos.'], ['Execução', 'Fazemos as movimentações combinadas.'], ['Próxima revisão', 'Nova conversa em ' + MESES_L[(TODAY.getMonth() + 6) % 12] + '.']] }]);
    P.push(['fim', ct]);
  } else {
    const m = MODELO[perfil] || MODELO.Moderado, ini = tot || 100000, rec = ['Conservador', 'Moderado', 'Arrojado'].indexOf(perfil);
    P.push(['capa', { eyebrow: 'PROPOSTA DE INVESTIMENTOS', title: 'Uma carteira feita para os objetivos de ' + (first || 'você'), sub: 'Preparada para ' + c.nome + ' · Horus Consultoria Financeira', notes: 'Agradecer o tempo e relembrar os objetivos que ' + (first || 'o cliente') + ' contou na primeira conversa.' }]);
    P.push(['sumario', { items: ['Seu momento', 'Cenário econômico', 'Carteira proposta', 'Próximos passos'] }]);
    P.push(['perfil', { perfil, objs: [['target', 'Objetivo principal', c.objetivo || '[Objetivo do cliente]'], ['wallet', 'Patrimônio hoje', tot ? fK(tot) + ' investidos' : 'R$ [valor]'], ['clock', 'Horizonte', '[0] anos']], notes: 'Confirmar o perfil e os objetivos antes de mostrar a carteira.' }]);
    if (tot) P.push(['alocacao', { title: 'Como está hoje', data: aloc, center: fK(tot), centerL: 'Patrimônio' }]);
    P.push(['indicadores', { notes: 'Atualizar os indicadores na véspera da reunião.' }]);
    P.push(['cenarios', { rec: rec < 0 ? 1 : rec }]);
    P.push(['alocacao', { title: 'Carteira proposta · perfil ' + perfil.toLowerCase(), data: m.map(([l, v, s]) => ({ l, v, s: (tot ? fK(tot * v / 100) + ' · ' : '') + s })), center: perfil, centerL: 'Perfil' }]);
    P.push(['projecao', { ini, aporte: 2000, taxa: TAXA[perfil] || 10, anos: 10, notes: 'Ajustar aporte e prazo ao que o cliente contou. É uma simulação, sem promessa de rentabilidade.' }]);
    P.push(['passos', {}]);
    P.push(['fim', ct]);
  }
  const deck = { pages: P }, kit = tkit();
  const d = Editor.create('apres', { deck, kit, nome: (tipo === 'revisao' ? 'Revisão de carteira · ' : 'Proposta · ') + c.nome });
  d.cli = cid; persist();
  return d;
}
C.gCli = (t, ev) => { if (ev.type === 'change') { U().gCli = t.value; render(); } };
A.gTipo = (b) => { U().gTipo = b.dataset.v; render(); };
A.gGo = (b) => { const d = gerar(b.dataset.id, U().gTipo || 'proposta'); openEditor(d.id); toast('Apresentação criada com os dados do cliente. Revise os campos entre colchetes.'); };

/* ---------- Ações ---------- */
function openEditor(id) { if (Editor.open(id)) { U().sub = 'editor'; const R = root(); R.innerHTML = ''; render(); } }
A.stNav = (b) => { U().sub = b.dataset.v; closePop(); render(); const m = $('#studio .st-main'); if (m) m.scrollTop = 0; };
A.stOpen = (b) => { closePop(); openEditor(b.dataset.id); };
A.stNew = (b) => { const d = Editor.create(b.dataset.v, { kit: tkit() }); closePop(); openEditor(d.id); };
A.stDeck = (b) => { const deck = SX.DECKS.find(d => d.id === b.dataset.id); const d = Editor.create('apres', { deck, kit: tkit(), nome: deck.nome }); openEditor(d.id); };
A.stLayout = (b) => { const d = Editor.create('apres', { kit: tkit(), nome: 'Apresentação sem título' }); d.pages = [SX.makeLayout(b.dataset.v, SX.roles(SX.kitOf(tkit())), d)]; SX.measure(d); persist(); openEditor(d.id); };
A.stSocial = (b) => { const t = SX.SOCIAL.find(s => s.id === b.dataset.v); const d = Editor.create(t.fmt, { kit: tkit(), tpl: t, nome: t.nome }); openEditor(d.id); };
A.stGrp = (b) => { U().grp = b.dataset.v; render(); };
C.stQ = (t, ev) => { if (ev.type !== 'input') return; U().q = t.value; render(); const i = $('#studio [data-chg="stQ"]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } };
C.stKit = (t, ev) => { if (ev.type === 'change') { U().tkit = t.value; render(); } };
A.stCustom = () => openModal('Tamanho personalizado', '<form id="stCustomF" class="grid-f"><label class="fld"><span>Largura (px)</span><input name="w" inputmode="numeric" value="1200"></label><label class="fld"><span>Altura (px)</span><input name="h" inputmode="numeric" value="800"></label></form>', '<button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-primary" data-act="stCustomGo">Criar</button>');
A.stCustomGo = () => { const f = $('#stCustomF'), w = Math.round(pNum(f.w.value)), h = Math.round(pNum(f.h.value)); if (!(w >= 50 && h >= 50 && w <= 8000 && h <= 8000)) { toast('Use medidas entre 50 e 8000 px.', 'warn'); return; } const d = Editor.create('custom', { w, h, kit: tkit() }); closeModal(); openEditor(d.id); };
A.stCreate = (b) => openPop(b, 'Criar', CREATE.map(([k, l]) => [shape(k) + ' <span>' + l + ' <small class="muted">' + SX.FORMATS[k].w + '×' + SX.FORMATS[k].h + '</small></span>', () => A.stNew({ dataset: { v: k } })]).concat([[icon('custom', 'ic-sm') + ' Tamanho personalizado', A.stCustom]]));
A.stDocMenu = (b) => {
  const d = docs().find(x => x.id === b.dataset.id);
  openPop(b, d.nome, [
    [icon('palette', 'ic-sm') + ' Abrir', () => openEditor(d.id)],
    [icon('play', 'ic-sm') + ' Apresentar', () => { if (Editor.open(d.id)) { U().sub = 'editor'; root().innerHTML = ''; render(); setTimeout(() => Editor.present(0, 'full'), 60); } }],
    [icon('copy', 'ic-sm') + ' Fazer uma cópia', () => { const c = JSON.parse(JSON.stringify(d)); c.id = uid('doc'); c.nome += ' (cópia)'; c.upd = c.criado = Date.now(); delete c._c; docs().unshift(c); persist(); render(); toast('Cópia criada'); }],
    [icon('trash', 'ic-sm') + ' Excluir', () => confirmBox('Excluir “' + d.nome + '”?', 'A apresentação será removida para todos os assessores.', 'Excluir', () => { W.ST.docs = docs().filter(x => x.id !== d.id); persist(); render(); toast('Apresentação excluída'); })]
  ]);
};

W.addEventListener('horus:remote', () => { if (!root() || root().hidden) return; if (U().sub !== 'editor') { const a = document.activeElement; if (a && a.closest && a.closest('#studio') && a.matches('input,textarea,select')) return; render(); } });

W.Studio = {
  show, hide, render,
  toggle(on) { if (on) show(); else hide(); },
  home() { U().sub = 'home'; const R = root(); if (R) R.innerHTML = ''; render(); },
  createPop() { const b = $('#studio .st-create'); if (b) A.stCreate(b); },
  open: openEditor,
  gerar(cid, tipo) { const d = gerar(cid, tipo); openEditor(d.id); return d; },
  pick(cid) { U().sub = 'home'; U().gCli = cid; render(); }
};
})();
