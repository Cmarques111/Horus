/* HORUS · CRM da Horus Consultoria Financeira
   Foco: clientes, produtos e comissões. Receita escritório = valor × % do produto; parte do assessor = receita × repasse. */
(function(){
const W = window;
const ACT = W.ACT = W.ACT || {}, CH = W.CHANGE = W.CHANGE || {};
const ymAddG = (ym, n) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + n, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };

/* ---------- Marca ---------- */
const HORUS_SVG = "<svg class=\"hr-mark\" viewBox=\"0 0 120 120\" width=\"__S__\" height=\"__S__\" __A__><defs><radialGradient id=\"hi-dark\" cx=\"38%\" cy=\"32%\" r=\"78%\"><stop offset=\"0\" stop-color=\"#E3ECFF\"/><stop offset=\".45\" stop-color=\"#6F97F5\"/><stop offset=\"1\" stop-color=\"#1B3C88\"/></radialGradient><linearGradient id=\"hg-dark\" x1=\"8\" y1=\"70\" x2=\"110\" y2=\"40\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#FFFFFF\"/><stop offset=\".42\" stop-color=\"#8FB0FF\"/><stop offset=\".78\" stop-color=\"#F5C451\"/><stop offset=\"1\" stop-color=\"#F5C451\"/></linearGradient></defs><path d=\"M55 15v-9\" stroke=\"#FFFFFF\" stroke-width=\"5\" stroke-linecap=\"round\"/><path d=\"M38.6 19.5l-3.6-7.6M71.4 19.5l3.6-7.6\" stroke=\"#FFFFFF\" stroke-width=\"4.4\" stroke-linecap=\"round\"/><path d=\"M25 28.5l-6-5.4\" stroke=\"#FFFFFF\" stroke-width=\"4\" stroke-linecap=\"round\" opacity=\".85\"/><path d=\"M8 62C22 42 39 33 56 33c17 0 31 6 43 17\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"6.5\" stroke-linecap=\"round\"/><path d=\"M8 62c13 17 30 25 47 24 10-.6 18-4.6 25-11.6L104 50.5\" fill=\"none\" stroke=\"url(#hg-dark)\" stroke-width=\"6.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M89 46.5h18.5V65\" fill=\"none\" stroke=\"url(#hg-dark)\" stroke-width=\"6.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"55\" cy=\"59.5\" r=\"17.5\" fill=\"url(#hi-dark)\"/><circle cx=\"55\" cy=\"59.5\" r=\"17.5\" fill=\"none\" stroke=\"#FFFFFF\" stroke-opacity=\".22\" stroke-width=\"1.6\"/><circle cx=\"55\" cy=\"59.5\" r=\"7.2\" fill=\"#061230\"/><circle cx=\"49.6\" cy=\"53.8\" r=\"3.3\" fill=\"#fff\" opacity=\".95\"/><circle cx=\"60.2\" cy=\"64.6\" r=\"1.4\" fill=\"#fff\" opacity=\".7\"/><path d=\"M37.5 86.5c-1.6 6.3-3.9 12-7.2 17.5\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"5.2\" stroke-linecap=\"round\"/></svg>";
let hmN = 0;
const horusMark = (size, label) => { const n = ++hmN; return HORUS_SVG.replace(/(h[ig]-dark)/g, '$1-' + n).replace(/__S__/g, size).replace('__A__', label ? 'role="img" aria-label="' + esc(label) + '"' : 'aria-hidden="true"'); };
const brandHTML = (big) => '<span class="hr-brand' + (big ? ' big' : '') + '">' + horusMark(big ? 72 : 38, 'HORUS') + '<span class="hr-word"><b>HORUS</b><i>Consultoria Financeira</i></span></span>';

/* ---------- Dados ---------- */
const CATS = ['Renda fixa', 'Renda variável e fundos', 'Previdência e seguros', 'Câmbio e crédito', 'Consórcio'];
const CAT_C = { 'Renda fixa': '#4C8DFF', 'Renda variável e fundos': '#9B87FF', 'Previdência e seguros': '#2FD0B8', 'Câmbio e crédito': '#F08A47', 'Consórcio': '#F0B442' };
const PERFIS = ['Conservador', 'Moderado', 'Arrojado'];
const P = (id, nome, cat, tipo, taxa, custodia, base) => ({ id, nome, cat, tipo, taxa, custodia, base, ativo: true });
const PRODUTOS = [
  P('p1', 'CDB', 'Renda fixa', 'pontual', 1.0, true, 'sobre o valor aplicado'),
  P('p2', 'LCI / LCA', 'Renda fixa', 'pontual', 0.8, true, 'sobre o valor aplicado'),
  P('p3', 'Debêntures', 'Renda fixa', 'pontual', 1.5, true, 'sobre o valor aplicado'),
  P('p4', 'CRI / CRA', 'Renda fixa', 'pontual', 1.5, true, 'sobre o valor aplicado'),
  P('p5', 'Tesouro Direto', 'Renda fixa', 'recorrente', 0.1, true, 'ao ano sobre o saldo'),
  P('p6', 'Fundos de investimento', 'Renda variável e fundos', 'recorrente', 0.6, true, 'ao ano sobre o saldo'),
  P('p7', 'Ações (corretagem)', 'Renda variável e fundos', 'pontual', 0.3, true, 'sobre o volume operado'),
  P('p8', 'Fundos imobiliários', 'Renda variável e fundos', 'pontual', 0.25, true, 'sobre o volume operado'),
  P('p9', 'COE', 'Renda variável e fundos', 'pontual', 2.5, true, 'sobre o valor aplicado'),
  P('p10', 'Previdência PGBL / VGBL', 'Previdência e seguros', 'recorrente', 0.8, true, 'ao ano sobre o saldo'),
  P('p11', 'Seguro de vida', 'Previdência e seguros', 'recorrente', 25, false, 'ao ano sobre o prêmio anual'),
  P('p12', 'Câmbio', 'Câmbio e crédito', 'pontual', 0.5, false, 'sobre o volume'),
  P('p13', 'Crédito / home equity', 'Câmbio e crédito', 'pontual', 1.0, false, 'sobre o valor contratado'),
  P('p14', 'Consórcio', 'Consórcio', 'pontual', 3.0, false, 'sobre o valor da carta')
];
const ASSESSORES = [
  { id: 'a1', nome: 'Carlos Marques', ini: 'CM', email: 'caduliam325@gmail.com', repasse: 35, meta: 3000, role: 'admin' },
  { id: 'a2', nome: 'Kauê Moraes', ini: 'KM', email: 'kaueom690@gmail.com', repasse: 35, meta: 3000, role: 'admin' }
];
function seed() {
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const nomes = ['Helena Duarte', 'Rafael Monteiro', 'Patrícia Gomes', 'Marcos Teixeira', 'Juliana Prado', 'Fernando Alves', 'Camila Rocha', 'Eduardo Nunes', 'Larissa Castro', 'Gustavo Pires', 'Beatriz Lopes', 'Ricardo Farias', 'Vanessa Moura', 'Thiago Barros', 'Sofia Mendes', 'André Cardoso'];
  const clientes = nomes.map((n, i) => ({ id: 'c' + (i + 1), nome: n, perfil: PERFIS[i % 3], ass: i % 2 ? 'a2' : 'a1', tel: '(11) 9' + String(80000000 + i * 137531).slice(0, 4) + '-' + String(1000 + i * 77).slice(0, 4), email: n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')[0] + '@exemplo.com', desde: dOff(-60 - i * 37), origem: pick(['Indicação', 'Evento', 'LinkedIn', 'Rede pessoal']), notas: '', prox: i % 3 === 0 ? dOff(i % 6 - 2) : '', contatos: [{ id: uid('k'), d: dOff(-10 - i * 3), tipo: pick(['Reunião', 'Ligação', 'WhatsApp']), nota: pick(['Revisão da carteira', 'Apresentação de nova emissão', 'Conversa sobre previdência', 'Acompanhamento de vencimento']) }] }));
  const lancs = [];
  const rec = ['p5', 'p6', 'p6', 'p10', 'p10', 'p11'], pon = ['p1', 'p1', 'p2', 'p2', 'p3', 'p4', 'p7', 'p8', 'p9', 'p12', 'p13', 'p14'];
  clientes.forEach((c, i) => {
    const nRec = 1 + Math.floor(rnd() * 2);
    for (let k = 0; k < nRec; k++) {
      const pid = pick(rec), pr = PRODUTOS.find(p => p.id === pid);
      const val = pid === 'p11' ? 2400 + Math.round(rnd() * 8) * 600 : 80000 + Math.round(rnd() * 40) * 10000;
      lancs.push({ id: uid('l'), cli: c.id, prod: pid, ass: c.ass, data: dOff(-340 + Math.floor(rnd() * 320)), valor: val, taxa: pr.taxa, venc: '', fim: '', obs: '' });
    }
    const nPon = 1 + Math.floor(rnd() * 3);
    for (let k = 0; k < nPon; k++) {
      const pid = pick(pon), pr = PRODUTOS.find(p => p.id === pid);
      const val = pid === 'p14' ? 80000 + Math.round(rnd() * 8) * 10000 : pid === 'p12' ? 10000 + Math.round(rnd() * 10) * 5000 : pid === 'p7' || pid === 'p8' ? 20000 + Math.round(rnd() * 10) * 5000 : 20000 + Math.round(rnd() * 13) * 10000;
      const d = dOff(-360 + Math.floor(rnd() * 360));
      const venc = pr.cat === 'Renda fixa' ? dOff(Math.floor(rnd() * 420) - 20) : '';
      lancs.push({ id: uid('l'), cli: c.id, prod: pid, ass: c.ass, data: d, valor: val, taxa: pr.taxa, venc, fim: '', obs: '' });
    }
  });
  const eventos = [[0, 9.5, 'Revisão de carteira', 'c1'], [1, 14, 'Apresentação de previdência', 'c3'], [2, 11, 'Reunião de equipe', ''], [3, 16, 'Proposta de consórcio', 'c6'], [7, 10, 'Comitê de investimentos', '']].map(([o, h, t, cli], i) => ({ id: uid('e'), d: dOff(o), h, dur: 1, t, cli, local: i === 2 ? 'Escritório' : 'Google Meet', ass: i % 2 ? 'a2' : 'a1' }));
  return { v: 2, assessores: ASSESSORES, produtos: PRODUTOS, clientes, lancs, eventos, receb: null, cfg: {}, nota: '' };
}
W.horusSeed = seed;
let ST = null;
const normalize = (st) => { st = st || {}; ['clientes', 'produtos', 'lancs', 'eventos', 'docs', 'imgLib'].forEach(k => { if (!Array.isArray(st[k])) st[k] = []; }); if (!st.receb || typeof st.receb !== 'object') st.receb = {}; if (!st.assets || typeof st.assets !== 'object') st.assets = {}; if (!st.cfg) st.cfg = {}; st.clientes.forEach(c => { if (!c.contatos) c.contatos = []; }); return st; };
const persist = W.persist = () => { if (W.Store && ST) W.Store.save(ST); };
W.setSync = (txt, kind) => { const si = $('#syncInfo'); if (si) si.innerHTML = '<span class="live-dot"' + (kind === 'off' ? ' style="background:var(--muted);box-shadow:none"' : kind === 'warn' ? ' style="background:var(--warn);box-shadow:none"' : '') + '></span>' + esc(txt); };
W.UI = { des: { sub: 'home' }, tab: 'inicio', as: 'todos', cMes: ymAddG(iso(TODAY).slice(0, 7), -1), pj: null, q: '', lMes: iso(TODAY).slice(0, 7), lCat: 'Todas', rPer: '12m', cPerfil: 'Todos', drawer: null };
let ME = 'a1';
const me = () => ST.assessores.find(a => a.id === ME) || ST.assessores[0] || { id: ME, nome: 'Você', ini: '?', repasse: 35, meta: 0, role: 'admin', email: '' };
const isAdmin = () => me().role === 'admin';
const assOf = (id) => ST.assessores.find(a => a.id === id) || { nome: '—', ini: '?', repasse: 35 };
const prodOf = (id) => ST.produtos.find(p => p.id === id) || { nome: '—', cat: '', tipo: 'pontual', taxa: 0 };
const cliOf = (id) => ST.clientes.find(c => c.id === id) || { nome: '—' };

/* ---------- Cálculos ---------- */
const ymNow = iso(TODAY).slice(0, 7);
const ymAdd = (ym, n) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + n, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
const ymLabel = (ym) => { const [y, m] = ym.split('-').map(Number); return MESES[m - 1] + '/' + String(y).slice(2); };
const ymEnd = (ym) => { const [y, m] = ym.split('-').map(Number); return iso(new Date(y, m, 0)); };
const lastN = (n) => Array.from({ length: n }, (_, i) => ymAdd(ymNow, i - n + 1));
const scopeAss = () => isAdmin() ? (W.UI.as === 'todos' ? null : W.UI.as) : ME;
const visLancs = () => { const a = scopeAss(); return a ? ST.lancs.filter(l => l.ass === a) : ST.lancs; };
const visClientes = () => { const a = scopeAss(); return a ? ST.clientes.filter(c => c.ass === a) : ST.clientes; };
// receita escritório de um lançamento num mês
const recIn = (l, ym) => {
  const p = prodOf(l.prod);
  if (p.tipo === 'recorrente') return (l.data <= ymEnd(ym) && (!l.fim || l.fim >= ym + '-01')) ? l.valor * l.taxa / 1200 : 0;
  return l.data.slice(0, 7) === ym ? l.valor * l.taxa / 100 : 0;
};
const recPontual = (l) => l.valor * l.taxa / 100;
const recMensal = (l) => l.valor * l.taxa / 1200;
const parteDe = (l, v) => v * (assOf(l.ass).repasse || 0) / 100;
function mes(ym, list) {
  list = list || visLancs();
  let pont = 0, rec = 0, parte = 0;
  list.forEach(l => { const v = recIn(l, ym); if (!v) return; if (prodOf(l.prod).tipo === 'recorrente') rec += v; else pont += v; parte += parteDe(l, v); });
  return { pont, rec, total: pont + rec, parte };
}
const ativo = (l) => !l.fim || l.fim > iso(TODAY);
const patrimonio = (list) => list.filter(l => prodOf(l.prod).custodia && ativo(l) && (!l.venc || l.venc >= iso(TODAY))).reduce((s, l) => s + l.valor, 0);
const receita12 = (list) => lastN(12).reduce((s, ym) => s + mes(ym, list).total, 0);
/* Conferência: recebido informado pelo assessor (extrato do escritório) × previsto pelo sistema */
const rKey = (a, ym) => a + '|' + ym;
const previstoPorProd = (a, ym) => { const out = {}; ST.lancs.filter(l => l.ass === a).forEach(l => { const v = recIn(l, ym); if (v) out[l.prod] = (out[l.prod] || 0) + v; }); return out; };
const confOf = (a, ym) => ST.receb[rKey(a, ym)] || { prods: {}, ok: false };
const confStatus = (a, ym) => {
  const c = ST.receb[rKey(a, ym)], prev = Object.values(previstoPorProd(a, ym)).reduce((s, v) => s + v, 0);
  if (!c || !Object.keys(c.prods).length) return { st: ym >= ymNow ? 'aberto' : 'pendente', prev, rec: 0, dif: -prev };
  const rec = Object.values(c.prods).reduce((s, v) => s + (+v || 0), 0), dif = rec - prev;
  return { st: c.ok ? (Math.abs(dif) < 1 ? 'ok' : 'okdif') : Math.abs(dif) < 1 ? 'bate' : 'diverge', prev, rec, dif };
};
function seedReceb() {
  ST.receb = {}; let s = 3; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  ST.assessores.forEach(a => lastN(12).slice(0, 10).forEach((ym, i) => {
    const pv = previstoPorProd(a.id, ym), prods = {};
    Object.entries(pv).forEach(([k, v]) => { prods[k] = Math.round(v * (i === 7 && rnd() < .6 ? 0.82 : 1) * 100) / 100; });
    ST.receb[rKey(a.id, ym)] = { prods, ok: i !== 7 };
  }));
  persist();
}
const metaScope = () => { const a = scopeAss(); return a ? assOf(a).meta || 0 : ST.assessores.reduce((s, x) => s + (x.meta || 0), 0); };
const fMoney = (v) => 'R$ ' + (v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fTaxa = (p, t) => fNum(t == null ? p.taxa : t, 2) + '%' + (p.tipo === 'recorrente' ? ' a.a.' : '');
const catTag = (c) => '<span class="ncat" style="--c:' + (CAT_C[c] || '#8FB0FF') + '">' + esc(c) + '</span>';
const tipoTag = (t) => '<span class="tag ' + (t === 'recorrente' ? 't-fin' : 't-design') + '">' + (t === 'recorrente' ? 'Recorrente' : 'Pontual') + '</span>';
const avA = (id) => '<span class="av" title="' + esc(assOf(id).nome) + '">' + esc(assOf(id).ini) + '</span>';

/* ---------- Dados para as apresentações (só dados do cliente; nunca comissão) ---------- */
W.HorusData = {
  clientes: () => visClientes().slice().sort((a, b) => a.nome.localeCompare(b.nome)),
  cliente: (id) => cliOf(id),
  assessor: () => me(),
  carteira: (cid) => ST.lancs.filter(l => l.cli === cid && prodOf(l.prod).custodia && ativo(l) && (!l.venc || l.venc >= iso(TODAY))).map(l => { const p = prodOf(l.prod); return { nome: p.nome, cat: p.cat, valor: l.valor, data: l.data, venc: l.venc || '' }; }),
  evolucao: (cid, n) => { const L = ST.lancs.filter(l => l.cli === cid && prodOf(l.prod).custodia); return lastN(n).map(ym => { const e = ymEnd(ym), s = ym + '-01', mi = +ym.slice(5) - 1; return { l: MESES[mi].charAt(0).toUpperCase() + MESES[mi].slice(1), v: L.filter(l => l.data <= e && (!l.fim || l.fim > e) && (!l.venc || l.venc >= s)).reduce((t, l) => t + l.valor, 0) }; }); }
};
ACT.cliDeck = (b) => { const id = b.dataset.id; closeDrawer(); go('apresentacoes'); if (W.Studio) W.Studio.pick(id); };

/* ---------- Componentes ---------- */
const AT = { inicio: 'home', clientes: 'user', lancamentos: 'money', conferencia: 'check', agenda: 'calendar', apresentacoes: 'presenter', produtos: 'coins', projecao: 'trend', relatorios: 'chart', assessores: 'star' };
const ph = (tab, eyebrow, title, meta, actions) => '<div class="ph"><div class="ph-l"><div class="ph-ico">' + icon(AT[tab]) + '</div><div><div class="eyebrow">' + esc(eyebrow) + '</div><h1>' + esc(title) + '</h1>' + (meta ? '<div class="ph-meta">' + meta + '</div>' : '') + '</div></div><div class="ph-r">' + (actions || '') + '</div></div>';
const cardW = (title, sub, body, opts) => { opts = opts || {}; return '<section class="card"><div class="card-h"><div><h3>' + title + '</h3>' + (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div>' + (opts.tools || '') + '</div><div class="card-b"' + (opts.flush ? ' style="padding:0"' : '') + '>' + body + '</div></section>'; };
const kpi = (cls, label, value, sub, extra) => '<div class="card kpi hkp ' + (cls || '') + '"><div class="kpi-l"><span>' + label + '</span></div><div class="kpi-v">' + value + '</div>' + (extra || '') + (sub ? '<div class="kpi-s">' + sub + '</div>' : '') + '</div>';
const seg = (act, cur, opts) => '<div class="seg" role="group">' + opts.map(([v, l]) => '<button data-act="' + act + '" data-v="' + v + '" class="' + (v === cur ? 'on' : '') + '" aria-pressed="' + (v === cur) + '">' + l + '</button>').join('') + '</div>';
const niceMax = (v) => { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };
function chartBars(data, opts) {
  opts = opts || {};
  const Wd = 680, H = 260, ml = 52, mr = 12, mt = 18, mb = 30, iw = Wd - ml - mr, ih = H - mt - mb;
  const max = niceMax(Math.max(1, ...data.map(d => Math.max((d.a || 0) + (d.b || 0), d.meta || 0))) * 1.08);
  const y = v => mt + ih - v / max * ih, bw = Math.min(40, iw / data.length * 0.58);
  let s = '<svg viewBox="0 0 ' + Wd + ' ' + H + '" role="img" aria-label="' + esc(opts.label || 'Gráfico') + '">';
  for (let i = 0; i <= 4; i++) { const v = max / 4 * i, yy = y(v); s += '<line x1="' + ml + '" x2="' + (Wd - mr) + '" y1="' + yy + '" y2="' + yy + '" stroke="#1E2430"/><text x="' + (ml - 8) + '" y="' + (yy + 4) + '" text-anchor="end">' + esc(fBRLk(v).replace('R$ ', '')) + '</text>'; }
  data.forEach((d, i) => {
    const cx = ml + iw / data.length * (i + 0.5), x = cx - bw / 2, ya = y(d.a || 0), yb = y((d.a || 0) + (d.b || 0));
    s += '<rect x="' + x + '" y="' + ya + '" width="' + bw + '" height="' + Math.max(0, mt + ih - ya) + '" fill="' + (opts.ca || '#2FCB8A') + '" rx="2"><title>' + esc(d.l + ' · ' + opts.la + ': ' + fMoney(d.a)) + '</title></rect>';
    if (d.b) s += '<rect x="' + x + '" y="' + yb + '" width="' + bw + '" height="' + Math.max(0, ya - yb - 1.5) + '" fill="' + (opts.cb || '#4C8DFF') + '" rx="2"><title>' + esc(d.l + ' · ' + opts.lb + ': ' + fMoney(d.b)) + '</title></rect>';
    if (d.meta) { const ym = y(d.meta); s += '<line x1="' + (x - 5) + '" x2="' + (x + bw + 5) + '" y1="' + ym + '" y2="' + ym + '" stroke="#F2B13C" stroke-width="2.5" stroke-linecap="round"><title>Meta ' + esc(fBRL(d.meta)) + '</title></line>'; }
    s += '<text x="' + cx + '" y="' + (H - 10) + '" text-anchor="middle"' + (d.cur ? ' style="fill:#F2F4F8;font-weight:600"' : '') + '>' + esc(d.l) + '</text>';
  });
  return '<div class="chart">' + s + '</svg></div><div class="legend"><span><i style="background:' + (opts.ca || '#2FCB8A') + '"></i>' + esc(opts.la) + '</span><span><i style="background:' + (opts.cb || '#4C8DFF') + '"></i>' + esc(opts.lb) + '</span>' + (opts.meta ? '<span><i style="background:#F2B13C;height:3px"></i>Meta</span>' : '') + '</div>';
}
const hbars = (rows, fmt) => { const max = Math.max(1, ...rows.map(r => r.v)); return rows.map(r => '<div class="hbar"><span class="l" title="' + esc(r.l) + '">' + esc(r.l) + '</span><span class="t"><i style="width:' + (r.v / max * 100) + '%;' + (r.c ? 'background:' + r.c : '') + '"></i></span><b class="num">' + (fmt ? fmt(r.v) : r.v) + '</b></div>').join('') || '<div class="empty">Sem dados no período.</div>'; };
const delta = (a, b) => { if (!b) return ''; const d = (a / b - 1) * 100; return '<span class="chip ' + (d >= 0 ? 'up' : 'down') + '">' + (d >= 0 ? '▲ ' : '▼ ') + fPct(d, 1) + '</span>'; };

/* ---------- Início ---------- */
const V = {};
V.apresentacoes = () => '<div class="empty-big">' + icon('presenter') + '<h3>Apresentações</h3><p>Abrindo o editor…</p></div>';
const onboarding = () => {
  const L = visLancs(), steps = [
    [ST.produtos.length > 0, 'Crie seus produtos', 'Cada produto guarda a sua porcentagem de comissão.', 'newProd', 'Criar produto'],
    [visClientes().length > 0, 'Cadastre seus clientes', 'Nome, perfil e contato. O resto o HORUS calcula.', 'newCli', 'Novo cliente'],
    [L.length > 0, 'Faça o primeiro lançamento', 'Registre uma operação e veja a receita escritório e a sua parte.', 'newLanc', 'Novo lançamento']
  ];
  if (steps.every(x => x[0])) return '';
  const nx = steps.findIndex(x => !x[0]);
  return '<section class="onb"><div class="onb-h">' + horusMark(52) + '<div><h2>Bem-vindo ao HORUS</h2><p>Três passos para ver sua receita ganhar forma.</p></div></div><div class="onb-s">' +
    steps.map((x, k) => '<div class="onb-i' + (x[0] ? ' done' : k === nx ? ' cur' : '') + '"><span>' + (x[0] ? '✓' : k + 1) + '</span><div><b>' + x[1] + '</b><small>' + x[2] + '</small></div>' + (x[0] ? '' : '<button class="btn ' + (k === nx ? 'btn-primary' : '') + ' btn-sm" data-act="' + x[3] + '"' + (k > nx ? ' disabled' : '') + '>' + x[4] + '</button>') + '</div>').join('') + '</div></section>';
};
const confAviso = () => { const a = scopeAss() || ME, ym = ymAdd(ymNow, -1), x = confStatus(a, ym); if (!['pendente', 'diverge', 'bate'].includes(x.st) || x.prev < 1) return ''; return '<div class="banner cbanner" style="margin-bottom:16px">' + icon('alert') + '<div style="flex:1"><b>Conferência de ' + ymLabel(ym) + (scopeAss() ? '' : ' (' + esc(assOf(a).nome.split(' ')[0]) + ')') + ':</b> ' + (x.st === 'pendente' ? 'o extrato do escritório ainda não foi lançado. Previsto: ' + fMoney(x.prev) + '.' : x.st === 'diverge' ? 'diferença de ' + sMoney(x.dif) + ' entre o previsto e o recebido.' : 'os valores batem, falta confirmar.') + '</div><button class="btn btn-sm" data-act="goConf" data-v="' + ym + '">Conferir agora</button></div>'; };
ACT.goConf = (b) => { W.UI.cMes = b.dataset.v; go('conferencia'); };
const agendaCont = () => { const lim = dOff(7), list = visClientes().filter(c => c.prox && c.prox <= lim).sort((a, b) => a.prox.localeCompare(b.prox)); return list.map(c => { const d = -daysSince(c.prox); return '<button class="li" data-act="openCli" data-id="' + c.id + '"><span><b>' + esc(c.nome) + '</b><small>' + esc(c.perfil) + ' · último contato ' + ((c.contatos || []).length ? fDateS(c.contatos.slice().sort((x, y) => y.d.localeCompare(x.d))[0].d) : '—') + '</small></span><span class="li-r"><b class="' + (d < 0 ? 'neg' : d === 0 ? 'gold' : '') + '">' + (d < 0 ? 'atrasado ' + (-d) + 'd' : d === 0 ? 'hoje' : fDateS(c.prox)) + '</b></span></button>'; }).join('') || '<div class="empty">Nenhum contato agendado para os próximos dias.</div>'; };
V.inicio = () => {
  const m = mes(ymNow), prev = mes(ymAdd(ymNow, -1)), meta = metaScope(), pct = meta ? Math.min(100, m.total / meta * 100) : 0;
  const L = visLancs(), runRate = L.filter(l => prodOf(l.prod).tipo === 'recorrente' && ativo(l)).reduce((s, l) => s + recMensal(l), 0);
  const pat = patrimonio(L), months = lastN(12), a = scopeAss();
  const venc = L.filter(l => l.venc && l.venc >= iso(TODAY) && l.venc <= dOff(60)).sort((x, y) => x.venc.localeCompare(y.venc));
  const top = visClientes().map(c => ({ c, v: receita12(L.filter(l => l.cli === c.id)) })).sort((x, y) => y.v - x.v).slice(0, 6);
  const ult = L.slice().sort((x, y) => y.data.localeCompare(x.data)).slice(0, 6);
  const quem = a ? assOf(a).nome.split(' ')[0] : 'escritório';
  return ph('inicio', TODAY.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), (new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite') + ', ' + me().nome.split(' ')[0],
      a ? 'Visão de ' + esc(assOf(a).nome) : 'Visão do escritório · todos os assessores', '<button class="btn btn-primary" data-act="newLanc">' + icon('plus', 'ic-sm') + 'Novo lançamento</button>') +
    onboarding() + confAviso() +
    '<div class="cols c4" style="margin-bottom:16px">' +
      kpi('hero', 'Receita escritório · ' + ymLabel(ymNow), fMoney(m.total), (meta ? 'Meta ' + fBRL(meta) + ' · <b>' + Math.round(pct) + '% atingido</b>' : 'Defina a meta em Assessores'), '<div class="bar' + (pct >= 100 ? ' pos' : '') + '"><i style="width:' + pct + '%"></i></div><div class="row" style="gap:6px">' + delta(m.total, prev.total) + '<small class="muted">vs. ' + ymLabel(ymAdd(ymNow, -1)) + '</small></div>') +
      kpi('gold', a ? 'Parte de ' + esc(assOf(a).nome.split(' ')[0]) + ' (' + assOf(a).repasse + '%)' : 'Repasse aos assessores', fMoney(m.parte), 'Calculado sobre a receita escritório do mês') +
      kpi('', 'Receita recorrente mensal', fMoney(runRate), 'Entra todo mês com a carteira atual · ' + fBRL(runRate * 12) + ' por ano') +
      kpi('', 'Patrimônio sob assessoria', fBRLk(pat), visClientes().length + ' clientes · ' + quem) +
    '</div>' +
    '<div class="cols c-main" style="margin-bottom:16px">' +
      cardW('Receita escritório · 12 meses', 'Recorrente na base, pontual em cima, meta em amarelo', chartBars(months.map(ym => { const x = mes(ym); return { l: ymLabel(ym), a: x.rec, b: x.pont, meta: meta, cur: ym === ymNow }; }), { la: 'Recorrente', lb: 'Pontual', meta: true, label: 'Receita escritório por mês' })) +
      cardW('Por categoria · ' + ymLabel(ymNow), 'Receita escritório do mês', hbars(CATS.map(c => ({ l: c, c: CAT_C[c], v: L.filter(l => prodOf(l.prod).cat === c).reduce((s, l) => s + recIn(l, ymNow), 0) })).sort((x, y) => y.v - x.v), fBRL)) +
    '</div>' +
    '<div class="cols c2">' +
      cardW('Contatos para fazer', 'Agenda de relacionamento · próximos 7 dias e atrasados', agendaCont(), { flush: true }) +
      cardW('Vencimentos nos próximos 60 dias', 'Oportunidades de reinvestimento', venc.map(l => '<button class="li" data-act="openCli" data-id="' + l.cli + '"><span><b>' + esc(cliOf(l.cli).nome) + '</b><small>' + esc(prodOf(l.prod).nome) + ' · ' + fBRL(l.valor) + '</small></span><span class="li-r"><b>' + fDateS(l.venc) + '</b><small>em ' + Math.max(0, -daysSince(l.venc)) + ' dias</small></span></button>').join('') || '<div class="empty">Nenhum vencimento próximo.</div>', { flush: true }) +
      cardW('Clientes que mais geram receita', 'Últimos 12 meses', top.map((t, i) => '<button class="li" data-act="openCli" data-id="' + t.c.id + '"><span class="rk-n">' + (i + 1) + '</span><span><b>' + esc(t.c.nome) + '</b><small>' + esc(t.c.perfil) + (a ? '' : ' · ' + esc(assOf(t.c.ass).nome)) + '</small></span><span class="li-r"><b class="pos">' + fBRL(t.v) + '</b></span></button>').join('') || '<div class="empty">Sem clientes.</div>', { flush: true }) +
      cardW('Últimos lançamentos', '', ult.map(l => { const p = prodOf(l.prod), v = p.tipo === 'recorrente' ? recMensal(l) : recPontual(l); return '<button class="li" data-act="editLanc" data-id="' + l.id + '"><span><b>' + esc(cliOf(l.cli).nome) + '</b><small>' + esc(p.nome) + ' · ' + fDateS(l.data) + '</small></span><span class="li-r"><b class="pos">+' + fMoney(v) + '</b><small>' + (p.tipo === 'recorrente' ? 'por mês' : 'pontual') + '</small></span></button>'; }).join('') || '<div class="empty">Nenhum lançamento.</div>', { flush: true, tools: '<button class="btn btn-sm" data-act="go" data-v="lancamentos">Ver todos</button>' }) +
    '</div>';
};

/* ---------- Clientes ---------- */
V.clientes = () => {
  const U = W.UI, L = visLancs();
  let list = visClientes().filter(c => (U.cPerfil === 'Todos' || c.perfil === U.cPerfil) && (!U.q || c.nome.toLowerCase().includes(U.q.toLowerCase())));
  const rows = list.map(c => { const cl = L.filter(l => l.cli === c.id); return { c, pat: patrimonio(cl), r12: receita12(cl), rm: mes(ymNow, cl).total, n: new Set(cl.map(l => l.prod)).size }; }).sort((a, b) => b.pat - a.pat);
  const tot = rows.reduce((s, r) => ({ pat: s.pat + r.pat, r12: s.r12 + r.r12, rm: s.rm + r.rm }), { pat: 0, r12: 0, rm: 0 });
  return ph('clientes', 'Carteira', 'Clientes', rows.length + ' clientes · ' + fBRLk(tot.pat) + ' sob assessoria', '<button class="btn" data-act="newCli">' + icon('plus', 'ic-sm') + 'Novo cliente</button><button class="btn btn-primary" data-act="newLanc">' + icon('plus', 'ic-sm') + 'Novo lançamento</button>') +
    '<div class="toolbar"><input class="inp" type="search" data-chg="cliQ" placeholder="Buscar cliente…" value="' + esc(U.q) + '" aria-label="Buscar cliente">' + seg('cliPerfil', U.cPerfil, [['Todos', 'Todos'], ...PERFIS.map(p => [p, p])]) + '</div>' +
    '<section class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Cliente</th><th>Perfil</th>' + (scopeAss() ? '' : '<th>Assessor</th>') + '<th class="r">Patrimônio</th><th class="r">Produtos</th><th class="r">Receita no mês</th><th class="r">Receita 12 meses</th></tr></thead><tbody>' +
      rows.map(r => '<tr class="click" data-act="openCli" data-id="' + r.c.id + '"><td><b>' + esc(r.c.nome) + '</b><br><small class="muted">Cliente desde ' + fDate(r.c.desde) + '</small></td><td>' + perfilPill(r.c.perfil) + '</td>' + (scopeAss() ? '' : '<td><span class="who">' + avA(r.c.ass) + esc(assOf(r.c.ass).nome) + '</span></td>') + '<td class="r"><b>' + fBRL(r.pat) + '</b></td><td class="r">' + r.n + '</td><td class="r">' + fMoney(r.rm) + '</td><td class="r"><b class="pos">' + fMoney(r.r12) + '</b></td></tr>').join('') +
    '</tbody><tfoot><tr><td colspan="' + (scopeAss() ? 2 : 3) + '">Total</td><td class="r">' + fBRL(tot.pat) + '</td><td></td><td class="r">' + fMoney(tot.rm) + '</td><td class="r">' + fMoney(tot.r12) + '</td></tr></tfoot></table></div>' + (rows.length ? '' : '<div class="empty">Nenhum cliente encontrado.</div>') + '</section>';
};
const perfilPill = (p) => '<span class="pill ' + ({ Conservador: 'p-sky', Moderado: 'p-warn', Arrojado: 'p-neg' }[p] || '') + '">' + esc(p) + '</span>';

/* ---------- Lançamentos ---------- */
V.lancamentos = () => {
  const U = W.UI, ym = U.lMes;
  const L = visLancs().filter(l => U.lCat === 'Todas' || prodOf(l.prod).cat === U.lCat);
  const rows = L.map(l => ({ l, v: recIn(l, ym) })).filter(r => r.v > 0).sort((a, b) => b.l.data.localeCompare(a.l.data));
  const tot = rows.reduce((s, r) => ({ v: s.v + r.v, p: s.p + parteDe(r.l, r.v) }), { v: 0, p: 0 });
  const meses = lastN(12).reverse();
  return ph('lancamentos', 'Comissões', 'Lançamentos', 'Receita escritório de ' + ymLabel(ym) + ': <b class="pos">' + fMoney(tot.v) + '</b> · repasse: <b class="gold">' + fMoney(tot.p) + '</b>', '<button class="btn" data-act="exportCSV">' + icon('download', 'ic-sm') + 'Exportar CSV</button><button class="btn btn-primary" data-act="newLanc">' + icon('plus', 'ic-sm') + 'Novo lançamento</button>') +
    '<div class="toolbar"><select class="inp" data-chg="lMes" style="width:auto" aria-label="Mês">' + meses.map(m => '<option value="' + m + '"' + (m === ym ? ' selected' : '') + '>' + ymLabel(m) + '</option>').join('') + '</select>' + seg('lCat', U.lCat, [['Todas', 'Todas'], ...CATS.map(c => [c, c])]) + '</div>' +
    '<section class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Data</th><th>Cliente</th><th>Produto</th><th>Tipo</th><th class="r">Valor</th><th class="r">Comissão</th><th class="r">Receita escritório</th><th class="r">Repasse</th>' + (scopeAss() ? '' : '<th>Assessor</th>') + '</tr></thead><tbody>' +
      rows.map(({ l, v }) => { const p = prodOf(l.prod); return '<tr class="click" data-act="editLanc" data-id="' + l.id + '"><td>' + fDate(l.data) + '</td><td><b>' + esc(cliOf(l.cli).nome) + '</b></td><td>' + esc(p.nome) + '<br>' + catTag(p.cat) + '</td><td>' + tipoTag(p.tipo) + '</td><td class="r">' + fBRL(l.valor) + '</td><td class="r">' + fTaxa(p, l.taxa) + '</td><td class="r"><b class="pos">' + fMoney(v) + '</b></td><td class="r"><span class="gold">' + fMoney(parteDe(l, v)) + '</span><br><small class="muted">' + assOf(l.ass).repasse + '%</small></td>' + (scopeAss() ? '' : '<td>' + avA(l.ass) + '</td>') + '</tr>'; }).join('') +
    '</tbody><tfoot><tr><td colspan="6">Total de ' + ymLabel(ym) + ' · ' + rows.length + ' lançamentos</td><td class="r">' + fMoney(tot.v) + '</td><td class="r">' + fMoney(tot.p) + '</td>' + (scopeAss() ? '' : '<td></td>') + '</tr></tfoot></table></div>' + (rows.length ? '' : '<div class="empty">Nenhuma receita neste mês com esse filtro.</div>') + '</section>' +
    '<p class="muted" style="font-size:12.5px;margin-top:10px">Produtos recorrentes aparecem em todos os meses em que estão ativos, com a receita mensal (saldo × taxa ao ano ÷ 12). Produtos pontuais aparecem só no mês da operação.</p>';
};

/* ---------- Produtos ---------- */
V.produtos = () => (!ST.produtos.length ? ph('produtos', 'Tabela de comissões', 'Produtos', 'Cada produto guarda a sua porcentagem de comissão.', '<button class="btn btn-primary" data-act="newProd">' + icon('plus', 'ic-sm') + 'Novo produto</button>') + '<div class="empty-big">' + icon('coins') + '<h3>Nenhum produto ainda</h3><p>Crie o primeiro produto com a porcentagem de comissão que você recebe. Leva menos de um minuto.</p><button class="btn btn-primary" data-act="newProd">' + icon('plus', 'ic-sm') + 'Criar meu primeiro produto</button></div>' : '') || '' +
  ph('produtos', 'Tabela de comissões', 'Produtos', 'Cada produto guarda a sua porcentagem de comissão' + (W.Store.mode === 'local' ? '. Os produtos abaixo são exemplos: edite ou crie os seus.' : '. Clique num produto para editar.'), isAdmin() ? '<button class="btn btn-primary" data-act="newProd">' + icon('plus', 'ic-sm') + 'Novo produto</button>' : '') +
  '<div class="banner" style="margin-bottom:16px">' + icon('alert') + '<div><b>Como a receita é calculada.</b> <b>Pontual:</b> valor da operação × % do produto, uma única vez. <b>Recorrente:</b> saldo × % ao ano ÷ 12, todo mês enquanto o cliente mantiver o produto. Sua parte é a receita escritório × o seu repasse (' + me().repasse + '%).</div></div>' +
  CATS.map(c => { const ps = ST.produtos.filter(p => p.cat === c); if (!ps.length) return ''; return '<section class="card" style="margin-bottom:16px"><div class="card-h"><div><h3>' + catTag(c) + '</h3></div></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Produto</th><th>Tipo</th><th class="r">Comissão</th><th>Base de cálculo</th><th class="r">Em R$ 100 mil</th><th class="r">Sua parte</th><th class="r">Clientes</th></tr></thead><tbody>' +
    ps.map(p => { const ex = p.tipo === 'recorrente' ? 100000 * p.taxa / 100 : 100000 * p.taxa / 100; const ncli = new Set(visLancs().filter(l => l.prod === p.id).map(l => l.cli)).size; return '<tr class="click' + (p.ativo ? '' : ' off') + '" data-act="editProd" data-id="' + p.id + '"><td><b>' + esc(p.nome) + '</b>' + (p.ativo ? '' : ' <span class="tag">Inativo</span>') + '</td><td>' + tipoTag(p.tipo) + '</td><td class="r"><b>' + fTaxa(p) + '</b></td><td class="muted">' + esc(p.base || '') + '</td><td class="r pos">' + fMoney(ex) + (p.tipo === 'recorrente' ? '<br><small class="muted">por ano · ' + fMoney(ex / 12) + '/mês</small>' : '') + '</td><td class="r gold">' + fMoney(ex * me().repasse / 100) + '</td><td class="r">' + ncli + '</td></tr>'; }).join('') + '</tbody></table></div></section>'; }).join('');

/* ---------- Relatórios ---------- */
V.relatorios = () => {
  const U = W.UI, L = visLancs();
  const per = U.rPer === 'ano' ? Array.from({ length: TODAY.getMonth() + 1 }, (_, i) => TODAY.getFullYear() + '-' + String(i + 1).padStart(2, '0')) : U.rPer === '6m' ? lastN(6) : lastN(12);
  const sum = (list) => per.reduce((s, ym) => s + mes(ym, list).total, 0);
  const tot = per.reduce((s, ym) => { const x = mes(ym); return { t: s.t + x.total, r: s.r + x.rec, p: s.p + x.pont, rp: s.rp + x.parte }; }, { t: 0, r: 0, p: 0, rp: 0 });
  const byProd = ST.produtos.map(p => ({ l: p.nome, c: CAT_C[p.cat], v: sum(L.filter(l => l.prod === p.id)) })).filter(x => x.v > 0).sort((a, b) => b.v - a.v).slice(0, 10);
  const byCli = visClientes().map(c => ({ l: c.nome, v: sum(L.filter(l => l.cli === c.id)) })).filter(x => x.v > 0).sort((a, b) => b.v - a.v).slice(0, 10);
  const byAss = ST.assessores.map(a => ({ a, v: sum(ST.lancs.filter(l => l.ass === a.id)) }));
  return ph('relatorios', 'Análises', 'Relatórios', 'Período: ' + ymLabel(per[0]) + ' a ' + ymLabel(per[per.length - 1]), seg('rPer', U.rPer, [['6m', '6 meses'], ['12m', '12 meses'], ['ano', 'Este ano']]) + '<button class="btn" data-act="exportCSV">' + icon('download', 'ic-sm') + 'Exportar CSV</button>') +
    '<div class="cols c4" style="margin-bottom:16px">' + kpi('hero', 'Receita escritório no período', fMoney(tot.t), 'Média de ' + fMoney(tot.t / per.length) + ' por mês') + kpi('gold', 'Repasse no período', fMoney(tot.rp), scopeAss() ? 'Parte de ' + esc(assOf(scopeAss()).nome) : 'Soma dos repasses aos assessores') + kpi('', 'Recorrente', fMoney(tot.r), Math.round(tot.t ? tot.r / tot.t * 100 : 0) + '% da receita') + kpi('', 'Pontual', fMoney(tot.p), Math.round(tot.t ? tot.p / tot.t * 100 : 0) + '% da receita') + '</div>' +
    '<div class="cols c-main" style="margin-bottom:16px">' + cardW('Evolução mensal', 'Receita escritório', chartBars(per.map(ym => { const x = mes(ym); return { l: ymLabel(ym), a: x.rec, b: x.pont, meta: metaScope(), cur: ym === ymNow }; }), { la: 'Recorrente', lb: 'Pontual', meta: true })) +
      cardW('Por categoria', '', hbars(CATS.map(c => ({ l: c, c: CAT_C[c], v: sum(L.filter(l => prodOf(l.prod).cat === c)) })).sort((a, b) => b.v - a.v), fBRL)) + '</div>' +
    '<div class="cols c2" style="margin-bottom:16px">' + cardW('Produtos que mais geram receita', 'Top 10', hbars(byProd, fBRL)) + cardW('Clientes que mais geram receita', 'Top 10', hbars(byCli, fBRL)) + '</div>' +
    (isAdmin() && !scopeAss() ? cardW('Por assessor', 'Receita escritório e repasse no período', '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Assessor</th><th class="r">Repasse</th><th class="r">Receita escritório</th><th class="r">Parte do assessor</th><th class="r">Fica no escritório</th></tr></thead><tbody>' + byAss.map(x => '<tr><td><span class="who">' + avA(x.a.id) + esc(x.a.nome) + '</span></td><td class="r">' + x.a.repasse + '%</td><td class="r pos"><b>' + fMoney(x.v) + '</b></td><td class="r gold">' + fMoney(x.v * x.a.repasse / 100) + '</td><td class="r">' + fMoney(x.v * (100 - x.a.repasse) / 100) + '</td></tr>').join('') + '</tbody></table></div>', { flush: true }) : '');
};

/* ---------- Assessores ---------- */
V.assessores = () => {
  const rows = ST.assessores.map(a => { const L = ST.lancs.filter(l => l.ass === a.id), m = mes(ymNow, L); return { a, m, n: ST.clientes.filter(c => c.ass === a.id).length, pat: patrimonio(L), r12: receita12(L) }; }).sort((x, y) => y.m.total - x.m.total);
  return ph('assessores', 'Equipe', 'Assessores', 'Cada assessor vê só os próprios clientes. O administrador vê tudo.', '<button class="btn btn-primary" data-act="newAss">' + icon('plus', 'ic-sm') + 'Novo assessor</button>') +
    '<div class="cols c3" style="margin-bottom:16px">' + rows.slice(0, 3).map((r, i) => { const pct = r.a.meta ? Math.min(100, r.m.total / r.a.meta * 100) : 0; return '<div class="card kpi hkp ' + (i === 0 ? 'hero' : '') + '"><div class="kpi-l"><span class="who">' + avA(r.a.id) + esc(r.a.nome) + '</span><span class="rk-n">' + (i + 1) + 'º</span></div><div class="kpi-v">' + fMoney(r.m.total) + '</div><div class="bar' + (pct >= 100 ? ' pos' : '') + '"><i style="width:' + pct + '%"></i></div><div class="kpi-s">' + Math.round(pct) + '% da meta de ' + fBRL(r.a.meta) + ' · parte ' + fMoney(r.m.parte) + '</div></div>'; }).join('') + '</div>' +
    '<section class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Assessor</th><th>E-mail</th><th>Papel</th><th class="r">Repasse</th><th class="r">Meta mensal</th><th class="r">Clientes</th><th class="r">Patrimônio</th><th class="r">Receita no mês</th><th class="r">Receita 12 meses</th></tr></thead><tbody>' +
    rows.map(r => '<tr class="click" data-act="editAss" data-id="' + r.a.id + '"><td><span class="who">' + avA(r.a.id) + '<b>' + esc(r.a.nome) + '</b></span></td><td class="muted">' + esc(r.a.email) + '</td><td>' + (r.a.role === 'admin' ? '<span class="pill p-sky nodot">Administrador</span>' : 'Assessor') + '</td><td class="r"><b class="gold">' + r.a.repasse + '%</b></td><td class="r">' + fBRL(r.a.meta) + '</td><td class="r">' + r.n + '</td><td class="r">' + fBRLk(r.pat) + '</td><td class="r pos"><b>' + fMoney(r.m.total) + '</b></td><td class="r">' + fMoney(r.r12) + '</td></tr>').join('') + '</tbody></table></div></section>';
};

/* ---------- Ficha do cliente ---------- */
/* ---------- Conferência ---------- */
const ST_LBL = { ok: ['Conferido', 'p-pos'], okdif: ['Conferido com diferença', 'p-warn'], bate: ['Bate · falta confirmar', 'p-sky'], diverge: ['Divergência', 'p-neg'], pendente: ['Aguardando extrato', 'p-warn'], aberto: ['Mês em andamento', ''] };
const confAss = () => scopeAss() || W.UI.cAss || ME;
V.conferencia = () => {
  const a = confAss(), ym = W.UI.cMes, months = lastN(12);
  const pv = previstoPorProd(a, ym), c = confOf(a, ym), ids = Array.from(new Set(Object.keys(pv).concat(Object.keys(c.prods)))).sort((x, y) => (pv[y] || 0) - (pv[x] || 0));
  const s = confStatus(a, ym), lbl = ST_LBL[s.st];
  const strip = months.map(m => { const x = confStatus(a, m); return '<button class="cm ' + x.st + (m === ym ? ' sel' : '') + '" data-act="cMes" data-v="' + m + '" title="' + esc(ST_LBL[x.st][0]) + '"><small>' + ymLabel(m) + '</small><i></i><b>' + (x.prev ? fBRLk(x.prev).replace('R$ ', '') : '—') + '</b></button>'; }).join('');
  const pend = months.filter(m => m < ymNow && ['pendente', 'diverge', 'bate'].includes(confStatus(a, m).st)).length;
  return ph('conferencia', 'Previsto × recebido', 'Conferência', 'Compare a receita que o sistema calculou com o que o escritório pagou. ' + (pend ? '<b class="gold">' + pend + ' ' + (pend === 1 ? 'mês precisa' : 'meses precisam') + ' de atenção.</b>' : '<b class="pos">Tudo em dia.</b>'),
      (isAdmin() && !scopeAss() ? '<select class="inp" data-chg="cAss" style="width:auto" aria-label="Assessor">' + opts(ST.assessores, a, 'id', 'nome') + '</select>' : '')) +
    '<div class="cstrip" role="list">' + strip + '</div>' +
    '<div class="cols c4" style="margin:16px 0">' + kpi('hero', 'Previsto pelo sistema · ' + ymLabel(ym), fMoney(s.prev), 'Calculado a partir dos lançamentos') + kpi('', 'Recebido do escritório', fMoney(s.rec), Object.keys(c.prods).length ? 'Informado por produto abaixo' : 'Ainda não informado') +
      kpi(Math.abs(s.dif) < 1 ? '' : 'warnk', 'Diferença', '<span class="' + (Math.abs(s.dif) < 1 ? 'pos' : s.dif < 0 ? 'neg' : 'gold') + '">' + (Math.abs(s.dif) < 1 ? fMoney(0) : sMoney(s.dif)) + '</span>', Math.abs(s.dif) < 1 ? 'Sem diferença' : s.dif < 0 ? 'Recebeu menos que o previsto' : 'Recebeu mais que o previsto') +
      kpi('', 'Situação', '<span class="pill ' + lbl[1] + '" style="font-size:13px;height:28px">' + lbl[0] + '</span>', c.ok ? 'Confirmado em ' + (c.at ? fDate(c.at) : 'mês anterior') : 'Confirme quando o extrato bater') + '</div>' +
    '<section class="card"><div class="card-h"><div><h3>Produtos de ' + ymLabel(ym) + '</h3><div class="sub">Digite o valor que veio no extrato do escritório. A diferença aparece na hora.</div></div><div class="row"><button class="btn btn-sm" data-act="cFill">Preencher com o previsto</button><button class="btn btn-sm btn-primary" data-act="cOk"' + (c.ok ? ' disabled' : '') + '>' + icon('check', 'ic-sm') + (c.ok ? 'Mês conferido' : 'Marcar como conferido') + '</button></div></div>' +
    '<div class="tbl-wrap"><table class="tbl ctbl"><thead><tr><th>Produto</th><th class="r">Previsto</th><th class="r" style="width:170px">Recebido</th><th class="r">Diferença</th></tr></thead><tbody>' +
    ids.map(id => { const p = prodOf(id), v = pv[id] || 0, r = c.prods[id], d = r == null || r === '' ? null : (+r) - v; return '<tr><td><b>' + esc(p.nome) + '</b> ' + tipoTag(p.tipo) + '<br>' + catTag(p.cat) + '</td><td class="r">' + fMoney(v) + '</td><td class="r"><input class="inp cin" inputmode="decimal" data-chg="cVal" data-p="' + id + '" value="' + (r == null || r === '' ? '' : fNum(+r, 2)) + '" placeholder="0,00" aria-label="Recebido em ' + esc(p.nome) + '"></td><td class="r" data-dif="' + id + '">' + difHTML(d) + '</td></tr>'; }).join('') +
    '</tbody><tfoot><tr><td>Total</td><td class="r">' + fMoney(s.prev) + '</td><td class="r" id="cTotR">' + fMoney(s.rec) + '</td><td class="r" id="cTotD">' + difHTML(Object.keys(c.prods).length ? s.dif : null) + '</td></tr></tfoot></table></div>' + (ids.length ? '' : '<div class="empty">Sem receita prevista neste mês.</div>') + '</section>' +
    '<p class="muted" style="font-size:12.5px;margin-top:10px">Diferenças comuns: produto recorrente que o cliente resgatou e não foi encerrado no lançamento, taxa negociada diferente da tabela, ou pagamento que caiu no mês seguinte.</p>';
};
const sMoney = (d) => (d < 0 ? '−' : '+') + fMoney(Math.abs(d));
const difHTML = (d) => d == null ? '<span class="muted">—</span>' : Math.abs(d) < 1 ? '<span class="chip up">✓ bate</span>' : '<span class="chip ' + (d < 0 ? 'down' : 'gold-c') + '">' + sMoney(d) + '</span>';
ACT.cMes = (b) => { W.UI.cMes = b.dataset.v; render(); };
CH.cAss = (t, ev) => { if (ev.type !== 'change') return; W.UI.cAss = t.value; render(); };
CH.cVal = (t, ev) => {
  const a = confAss(), k = rKey(a, W.UI.cMes), c = ST.receb[k] || (ST.receb[k] = { prods: {}, ok: false });
  if (t.value.trim() === '') delete c.prods[t.dataset.p]; else c.prods[t.dataset.p] = pNum(t.value);
  c.ok = false; persist();
  const pv = previstoPorProd(a, W.UI.cMes), r = c.prods[t.dataset.p];
  $('[data-dif="' + t.dataset.p + '"]').innerHTML = difHTML(r == null ? null : r - (pv[t.dataset.p] || 0));
  const s = confStatus(a, W.UI.cMes); $('#cTotR').textContent = fMoney(s.rec); $('#cTotD').innerHTML = difHTML(s.dif);
  if (ev.type === 'change') setTimeout(() => { const ae = document.activeElement, ap = ae && ae.dataset ? ae.dataset.p : null; render(); if (ap) { const e = $('.cin[data-p="' + ap + '"]'); if (e) e.focus(); } }, 0);
};
ACT.cFill = () => { const a = confAss(), k = rKey(a, W.UI.cMes), pv = previstoPorProd(a, W.UI.cMes); ST.receb[k] = { prods: Object.fromEntries(Object.entries(pv).map(([p, v]) => [p, Math.round(v * 100) / 100])), ok: false }; persist(); render(); toast('Preenchido com o previsto. Ajuste o que veio diferente.'); };
ACT.cOk = () => { const a = confAss(), k = rKey(a, W.UI.cMes), c = ST.receb[k]; if (!c || !Object.keys(c.prods).length) { toast('Informe primeiro os valores recebidos.', 'warn'); return; } c.ok = true; c.at = iso(TODAY); persist(); render(); toast('Mês marcado como conferido'); };

/* ---------- Projeção ---------- */
V.projecao = () => {
  const L = visLancs(), a = scopeAss(), rep = a ? assOf(a).repasse : 35;
  const runRate = L.filter(l => prodOf(l.prod).tipo === 'recorrente' && ativo(l)).reduce((s, l) => s + recMensal(l), 0);
  const last6 = lastN(7).slice(0, 6);
  const avgPont = last6.reduce((s, ym) => s + mes(ym, L).pont, 0) / 6;
  const recL = L.filter(l => prodOf(l.prod).tipo === 'recorrente' && last6.includes(l.data.slice(0, 7)));
  const avgCapt = recL.reduce((s, l) => s + l.valor, 0) / 6, avgTx = recL.length ? recL.reduce((s, l) => s + l.taxa * l.valor, 0) / Math.max(1, recL.reduce((s, l) => s + l.valor, 0)) : 0.6;
  const P = W.UI.pj || (W.UI.pj = { capt: Math.round(avgCapt / 10000) * 10000 || 100000, tx: Math.round(avgTx * 100) / 100 || 0.6, pont: Math.round(avgPont / 500) * 500 || 1500, cresc: 3, hz: 12 });
  const meta = metaScope();
  let rr = runRate, pont = P.pont, data = [], acc = 0, hit = null;
  for (let i = 1; i <= P.hz; i++) {
    rr += P.capt * P.tx / 1200; pont *= 1 + P.cresc / 100;
    const ym = ymAdd(ymNow, i), tot = rr + pont; acc += tot;
    if (!hit && meta && tot >= meta) hit = ym;
    data.push({ l: ymLabel(ym), a: rr, b: pont, meta, cur: false });
  }
  const last = data[data.length - 1];
  const sl = (id, lbl, val, min, max, step, fmt) => '<label class="pj-s"><span>' + lbl + '<b id="pjv-' + id + '">' + fmt(val) + '</b></span><input type="range" id="pj-' + id + '" data-chg="pj" data-k="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></label>';
  return ph('projecao', 'Simulação de futuro', 'Projeção', 'Mexa nos controles e veja para onde vai a receita' + (a ? ' de ' + esc(assOf(a).nome) : ' do escritório'), seg('pjHz', String(P.hz), [['12', '12 meses'], ['24', '24 meses'], ['36', '36 meses']])) +
    '<div class="cols c-main">' +
      '<section class="card"><div class="card-h"><div><h3>Receita escritório projetada</h3><div class="sub">Base atual: ' + fMoney(runRate) + ' por mês de recorrente</div></div></div><div class="card-b">' + chartBars(data, { la: 'Recorrente acumulado', lb: 'Pontual', meta: true, label: 'Projeção de receita' }) + '</div></section>' +
      '<div class="stack"><section class="card"><div class="card-h"><div><h3>Premissas</h3><div class="sub">Começam pela média dos últimos 6 meses</div></div></div><div class="card-b pj">' +
        sl('capt', 'Captação mensal em recorrentes', P.capt, 0, 2000000, 10000, fBRL) + sl('tx', 'Comissão média dos recorrentes (% a.a.)', P.tx, 0.1, 2, 0.05, v => fNum(v, 2) + '%') +
        sl('pont', 'Receita pontual por mês hoje', P.pont, 0, 30000, 250, fBRL) + sl('cresc', 'Crescimento do pontual ao mês', P.cresc, 0, 15, 0.5, v => fNum(v, 1) + '%') +
      '</div></section>' +
      '<section class="card pj-out"><div class="card-b"><div class="pj-big"><small>Em ' + last.l + ', receita escritório de</small><b>' + fMoney(last.a + last.b) + '</b><span>por mês · sua parte ' + fMoney((last.a + last.b) * rep / 100) + '</span></div>' +
        '<div class="calc-g"><span>Acumulado no período</span><b class="pos">' + fMoney(acc) + '</b><span>Sua parte acumulada (' + rep + '%)</span><b class="gold">' + fMoney(acc * rep / 100) + '</b><span>Recorrente mensal no fim</span><b>' + fMoney(last.a) + '</b><span>Meta mensal</span><b>' + (meta ? (hit ? 'batida em ' + ymLabel(hit) : '<span class="neg">não alcançada</span>') : '—') + '</b></div></div></section></div>' +
    '</div>';
};
CH.pj = (t, ev) => { W.UI.pj[t.dataset.k] = +t.value; if (ev.type === 'change') render(); else { const v = $('#pjv-' + t.dataset.k); if (v) v.textContent = t.dataset.k === 'tx' ? fNum(+t.value, 2) + '%' : t.dataset.k === 'cresc' ? fNum(+t.value, 1) + '%' : fBRL(+t.value); } };
ACT.pjHz = (b) => { W.UI.pj.hz = +b.dataset.v; render(); };

/* ---------- Agenda ---------- */
const DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
const weekStart = (off) => { const d = new Date(TODAY); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd + (off || 0) * 7); return d; };
const hm = (h) => String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.round((h % 1) * 60)).padStart(2, '0');
let gBusy = false;
function agItems(from, to) {
  const a = scopeAss(), out = [];
  ST.eventos.filter(e => e.d >= from && e.d <= to && (!a || e.ass === a)).forEach(e => out.push({ k: 'ev', id: e.id, d: e.d, h: e.h, dur: e.dur, t: e.t, sub: e.cli ? cliOf(e.cli).nome : (e.local || ''), cli: e.cli }));
  visClientes().filter(c => c.prox && c.prox >= from && c.prox <= to).forEach(c => out.push({ k: 'ct', id: c.id, d: c.prox, h: null, t: 'Contato: ' + c.nome, sub: c.perfil, cli: c.id }));
  visLancs().filter(l => l.venc && l.venc >= from && l.venc <= to).forEach(l => out.push({ k: 'vc', id: l.id, d: l.venc, h: null, t: 'Vence: ' + prodOf(l.prod).nome, sub: cliOf(l.cli).nome + ' · ' + fBRL(l.valor), cli: l.cli }));
  if (W.GCal && W.GCal.connected()) (W.GCal.cached(from, to) || []).forEach(g => out.push({ k: 'g', id: g.id, d: g.d, h: g.h, dur: g.dur, t: g.t, sub: 'Google Agenda', link: g.link }));
  return out.sort((x, y) => x.d.localeCompare(y.d) || (x.h == null ? -1 : x.h) - (y.h == null ? -1 : y.h));
}
V.agenda = () => {
  const off = W.UI.agWeek || 0, ws = weekStart(off), days = Array.from({ length: 7 }, (_, i) => { const d = new Date(ws); d.setDate(ws.getDate() + i); return iso(d); });
  const from = days[0], to = days[6], items = agItems(from, to), gc = W.GCal && W.GCal.connected(), cid = ST.cfg.gcalClientId;
  if (gc && !W.GCal.cached(from, to) && !gBusy) { gBusy = true; W.GCal.events(from, to).then(() => { gBusy = false; render(); }).catch(er => { gBusy = false; toast('Google Agenda: ' + er.message, 'warn'); }); }
  const label = new Date(from + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) + ' a ' + new Date(to + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  const gBtn = W.Store.mode === 'local' ? '' : !cid ? '<button class="btn" data-act="gSetup">' + icon('calendar', 'ic-sm') + 'Ligar Google Agenda</button>' : gc ? '<button class="btn" data-act="gSync">' + icon('refresh', 'ic-sm') + 'Google conectado · atualizar</button>' : '<button class="btn" data-act="gConnect">' + icon('calendar', 'ic-sm') + 'Conectar meu Google Agenda</button>';
  const chip = (it) => '<button class="ag-it ag-' + it.k + '" data-act="agOpen" data-k="' + it.k + '" data-id="' + esc(it.id) + '"' + (it.cli ? ' data-cli="' + it.cli + '"' : '') + '><b>' + (it.h == null ? '' : '<time>' + hm(it.h) + '</time>') + esc(it.t) + '</b>' + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</button>';
  const today = iso(TODAY);
  return ph('agenda', 'Compromissos e lembretes', 'Agenda', 'Reuniões, contatos com clientes e vencimentos' + (gc ? ', junto com o seu Google Agenda' : ''), gBtn + '<button class="btn btn-primary" data-act="newEv">' + icon('plus', 'ic-sm') + 'Novo compromisso</button>') +
    '<div class="ag-bar"><div class="row"><button class="btn btn-sm" data-act="agWk" data-v="-1" aria-label="Semana anterior">←</button><button class="btn btn-sm" data-act="agWk" data-v="0">Hoje</button><button class="btn btn-sm" data-act="agWk" data-v="1" aria-label="Próxima semana">→</button><b>' + label + '</b></div>' +
      '<div class="ag-leg"><span class="ag-ev">Compromisso</span><span class="ag-ct">Contato com cliente</span><span class="ag-vc">Vencimento</span>' + (gc ? '<span class="ag-g">Google Agenda</span>' : '') + '</div></div>' +
    (W.Store.mode === 'local' ? '' : !cid ? '<div class="banner" style="margin-bottom:14px">' + icon('calendar') + '<div style="flex:1"><b>Traga seu Google Agenda para cá.</b> Depois de uma configuração única, cada assessor conecta a própria conta e vê as reuniões do Google junto com os compromissos do HORUS. Os compromissos criados aqui também podem ir para o Google.</div><button class="btn btn-sm" data-act="gSetup">Configurar</button></div>' : '') +
    '<div class="wk">' + days.map((d, i) => { const its = items.filter(x => x.d === d); return '<section class="wk-d' + (d === today ? ' today' : '') + (i > 4 ? ' wkend' : '') + '"><header><small>' + DIAS[i] + '</small><b>' + d.slice(8) + '</b><button class="ibtn" data-act="newEv" data-d="' + d + '" aria-label="Novo compromisso em ' + fDate(d) + '">' + icon('plus', 'ic-sm') + '</button></header><div class="wk-l">' + (its.map(chip).join('') || '<span class="wk-e">Livre</span>') + '</div></section>'; }).join('') + '</div>';
};
ACT.agWk = (b) => { const v = +b.dataset.v; W.UI.agWeek = v === 0 ? 0 : (W.UI.agWeek || 0) + v; render(); };
ACT.agOpen = (b) => {
  const k = b.dataset.k;
  if (k === 'ev') return evOpen(ST.eventos.find(e => e.id === b.dataset.id));
  if (k === 'g') { const g = W.GCal.find(b.dataset.id); if (g && g.link) window.open(g.link, '_blank', 'noopener'); return; }
  if (b.dataset.cli) openDrawer({ type: 'cliente', id: b.dataset.cli });
};
function evForm(e) {
  const clis = visClientes().slice().sort((a, b) => a.nome.localeCompare(b.nome)), gc = W.GCal && W.GCal.connected();
  return '<form id="evForm" class="grid-f"><label class="fld req" style="grid-column:1/-1"><span>Compromisso</span><input name="t" value="' + esc(e.t || '') + '" placeholder="Ex.: Revisão de carteira"></label>' +
    '<label class="fld"><span>Data</span><input type="date" name="d" value="' + (e.d || iso(TODAY)) + '"></label><label class="fld"><span>Horário</span><input type="time" name="h" value="' + hm(e.h == null ? 10 : e.h) + '"></label>' +
    '<label class="fld"><span>Duração</span><select name="dur">' + [[0.5, '30 min'], [1, '1 hora'], [1.5, '1h30'], [2, '2 horas']].map(([v, l]) => '<option value="' + v + '"' + ((e.dur || 1) == v ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></label>' +
    '<label class="fld"><span>Cliente (opcional)</span><select name="cli"><option value="">Nenhum</option>' + opts(clis, e.cli || '', 'id', 'nome') + '</select></label>' +
    '<label class="fld" style="grid-column:1/-1"><span>Local ou link</span><input name="local" value="' + esc(e.local || '') + '" placeholder="Escritório, Meet, endereço…"></label>' +
    (!e.id && gc ? '<label class="pw-tog" style="grid-column:1/-1"><input type="checkbox" name="g" checked> Também criar no meu Google Agenda</label>' : '') +
    (!e.id && !gc && W.Store.mode !== 'local' ? '<p class="muted" style="grid-column:1/-1;margin:0;font-size:12.5px">Conecte o Google Agenda na tela Agenda para criar o compromisso lá também.</p>' : '') + '</form>';
}
function evOpen(e) {
  e = e || {};
  openModal(e.id ? 'Editar compromisso' : 'Novo compromisso', evForm(e), (e.id ? '<button class="btn btn-danger" data-act="evDel" data-id="' + e.id + '" style="margin-right:auto">Excluir</button>' : '') + '<button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-primary" data-act="evSave"' + (e.id ? ' data-id="' + e.id + '"' : '') + '>Salvar</button>');
}
ACT.newEv = (b) => evOpen({ d: (b && b.dataset.d) || iso(TODAY), cli: (b && b.dataset.cli) || '' });
ACT.evSave = async (b) => {
  const f = $('#evForm'), t = f.t.value.trim(); if (!t) { toast('Dê um nome ao compromisso.', 'warn'); return; }
  const [hh, mm] = (f.h.value || '10:00').split(':').map(Number);
  const data = { t, d: f.d.value || iso(TODAY), h: hh + mm / 60, dur: +f.dur.value, cli: f.cli.value, local: f.local.value.trim() };
  if (b.dataset.id) Object.assign(ST.eventos.find(e => e.id === b.dataset.id), data); else ST.eventos.push(Object.assign({ id: uid('e'), ass: ME }, data));
  persist(); closeModal(); render(); toast('Compromisso salvo');
  if (!b.dataset.id && f.g && f.g.checked) { try { await W.GCal.create(data); toast('Compromisso salvo e criado no Google Agenda'); } catch (er) { toast('Salvo no HORUS, mas não foi para o Google: ' + er.message, 'warn'); } }
};
ACT.evDel = (b) => { ST.eventos = ST.eventos.filter(e => e.id !== b.dataset.id); persist(); closeModal(); render(); toast('Compromisso excluído'); };
ACT.gConnect = async () => { try { await W.GCal.connect(); toast('Google Agenda conectado'); render(); } catch (er) { toast('Não foi possível conectar: ' + er.message, 'warn'); } };
ACT.gSync = () => { W.GCal.clear(); render(); toast('Atualizando o Google Agenda…'); };
ACT.gSetup = () => openModal('Ligar o Google Agenda', '<p style="margin:0 0 12px">Cole aqui o <b>ID do cliente OAuth</b> criado uma única vez no Google Cloud (o Claude te guia nessa criação). Depois disso, você e o Kauê só clicam em <b>Conectar meu Google Agenda</b>.</p><label class="fld"><span>ID do cliente OAuth</span><input id="gCid" value="' + esc(ST.cfg.gcalClientId || '') + '" placeholder="000000000000-xxxx.apps.googleusercontent.com"></label>',
  '<button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-primary" data-act="gSetupSave">Salvar</button>');
ACT.gSetupSave = () => { const v = $('#gCid').value.trim(); if (v && !/\.apps\.googleusercontent\.com$/.test(v)) { toast('Esse ID deve terminar em .apps.googleusercontent.com', 'warn'); return; } ST.cfg.gcalClientId = v; persist(); closeModal(); render(); toast(v ? 'Google Agenda configurado. Agora clique em Conectar.' : 'Configuração removida'); };

const DRAWERS = {};
DRAWERS.cliente = (d) => {
  const c = cliOf(d.id), L = ST.lancs.filter(l => l.cli === c.id).sort((a, b) => b.data.localeCompare(a.data));
  const pat = patrimonio(L), r12 = receita12(L), rm = mes(ymNow, L), run = L.filter(l => prodOf(l.prod).tipo === 'recorrente' && ativo(l)).reduce((s, l) => s + recMensal(l), 0);
  const pos = L.filter(l => prodOf(l.prod).custodia && ativo(l) && (!l.venc || l.venc >= iso(TODAY)));
  const byCat = CATS.map(k => ({ l: k, c: CAT_C[k], v: pos.filter(l => prodOf(l.prod).cat === k).reduce((s, l) => s + l.valor, 0) })).filter(x => x.v > 0);
  return '<div class="dr-h"><div style="flex:1;min-width:0"><div class="eyebrow">Cliente · ' + esc(assOf(c.ass).nome) + '</div><h2>' + esc(c.nome) + '</h2><div class="row" style="margin-top:8px">' + perfilPill(c.perfil) + '<span class="tag">' + esc(c.origem || '') + '</span><span class="muted" style="font-size:12.5px">Desde ' + fDate(c.desde) + '</span></div></div><button class="ibtn" data-act="closeDrawer" aria-label="Fechar">' + icon('x') + '</button></div>' +
    '<div class="dr-b">' +
      '<div class="cols c2" style="gap:10px">' + mini('Patrimônio', fBRL(pat)) + mini('Receita 12 meses', fMoney(r12), 'pos') + mini('Receita no mês', fMoney(rm.total), 'pos') + mini('Recorrente por mês', fMoney(run)) + '</div>' +
      (byCat.length ? '<div><p class="sec-t">Distribuição da carteira</p><div class="alloc">' + byCat.map(x => '<i style="flex:' + x.v + ';background:' + x.c + '" title="' + esc(x.l + ': ' + fBRL(x.v)) + '"></i>').join('') + '</div><div class="legend" style="margin-top:8px">' + byCat.map(x => '<span><i style="background:' + x.c + '"></i>' + esc(x.l) + ' · ' + Math.round(x.v / pat * 100) + '%</span>').join('') + '</div></div>' : '') +
      '<div><p class="sec-t">Produtos e operações</p><div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Produto</th><th class="r">Valor</th><th class="r">Receita</th></tr></thead><tbody>' +
        L.map(l => { const p = prodOf(l.prod); return '<tr class="click" data-act="editLanc" data-id="' + l.id + '"><td><b>' + esc(p.nome) + '</b> ' + tipoTag(p.tipo) + '<br><small class="muted">' + fDate(l.data) + (l.venc ? ' · vence ' + fDate(l.venc) : '') + (l.fim ? ' · resgatado ' + fDate(l.fim) : '') + '</small></td><td class="r">' + fBRL(l.valor) + '<br><small class="muted">' + fTaxa(p, l.taxa) + '</small></td><td class="r pos"><b>' + fMoney(p.tipo === 'recorrente' ? recMensal(l) : recPontual(l)) + '</b><br><small class="muted">' + (p.tipo === 'recorrente' ? 'por mês' : 'uma vez') + '</small></td></tr>'; }).join('') +
      '</tbody></table></div>' + (L.length ? '' : '<div class="empty">Nenhuma operação ainda.</div>') + '</div></div>' +
      '<div><p class="sec-t">Relacionamento</p><div class="rel"><label class="fld"><span>Próximo contato</span><input type="date" data-chg="cliProx" data-id="' + c.id + '" value="' + (c.prox || '') + '"></label><div class="kv"><span>Telefone</span><b>' + esc(c.tel || '—') + '</b><span>E-mail</span><b>' + esc(c.email || '—') + '</b></div></div>' +
        '<form class="ct-new" data-id="' + c.id + '"><select class="inp" name="tipo" aria-label="Tipo de contato">' + ['Reunião', 'Ligação', 'WhatsApp', 'E-mail'].map(x => '<option>' + x + '</option>').join('') + '</select><input class="inp" name="nota" placeholder="O que foi conversado?" aria-label="Resumo do contato"><button class="btn btn-sm" data-act="addContato" data-id="' + c.id + '">Registrar</button></form>' +
        '<div class="tl">' + ((c.contatos || []).slice().sort((x, y) => y.d.localeCompare(x.d)).map(k => '<div class="tl-i"><i></i><div><b>' + esc(k.tipo) + '</b> <small class="muted">' + fDate(k.d) + '</small><br><span>' + esc(k.nota || '') + '</span></div></div>').join('') || '<div class="muted" style="font-size:13px">Nenhum contato registrado.</div>') + '</div></div>' +
      '<div><p class="sec-t">Anotações</p><textarea class="inp" style="height:90px;padding:10px" data-chg="cliNota" data-id="' + c.id + '" placeholder="Objetivos, preferências, próximos passos…">' + esc(c.notas || '') + '</textarea></div>' +
    '</div><div class="dr-f"><button class="btn btn-ghost" data-act="editCli" data-id="' + c.id + '">Editar cliente</button><button class="btn" data-act="newEv" data-cli="' + c.id + '">' + icon('calendar', 'ic-sm') + 'Agendar reunião</button><button class="btn" data-act="cliDeck" data-id="' + c.id + '">' + icon('presenter', 'ic-sm') + 'Apresentação</button><button class="btn btn-primary" data-act="newLanc" data-cli="' + c.id + '">' + icon('plus', 'ic-sm') + 'Novo lançamento</button></div>';
};
const mini = (l, v, cls) => '<div class="mini"><small>' + l + '</small><b class="' + (cls || '') + '">' + v + '</b></div>';

/* ---------- Modais ---------- */
const openModal = W.openModal = (title, body, foot, wide) => { const m = $('#modal'); m.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"' + (wide ? ' style="width:min(1000px,100%)"' : '') + '><div class="modal-h"><h3>' + esc(title) + '</h3><button class="ibtn" data-act="closeModal" aria-label="Fechar">' + icon('x') + '</button></div><div class="modal-b">' + body + '</div>' + (foot ? '<div class="modal-f">' + foot + '</div>' : '') + '</div>'; m.hidden = false; const f = m.querySelector('input:not([type=hidden]),select'); if (f) setTimeout(() => f.focus(), 30); };
const closeModal = W.closeModal = () => { $('#modal').hidden = true; $('#modal').innerHTML = ''; };
W.confirmBox = (title, text, okLabel, fn) => { W._confirmFn = fn; openModal(title, '<p style="margin:0" class="muted">' + esc(text) + '</p>', '<button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-danger" data-act="confirmOk">' + esc(okLabel) + '</button>'); };
W.nowHM = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const opts = (list, cur, val, lab) => list.map(x => '<option value="' + esc(x[val]) + '"' + (x[val] === cur ? ' selected' : '') + '>' + esc(x[lab]) + '</option>').join('');
function lancForm(l) {
  const clis = visClientes().slice().sort((a, b) => a.nome.localeCompare(b.nome));
  const prods = ST.produtos.filter(p => p.ativo || p.id === l.prod);
  return '<form id="lancForm" class="grid-f" data-id="' + (l.id || '') + '">' +
    '<label class="fld req"><span>Cliente</span><select name="cli">' + opts(clis, l.cli, 'id', 'nome') + '</select></label>' +
    '<label class="fld req"><span>Produto</span><select name="prod" data-chg="lancProd">' + CATS.map(c => '<optgroup label="' + esc(c) + '">' + opts(prods.filter(p => p.cat === c), l.prod, 'id', 'nome') + '</optgroup>').join('') + '<option value="__new">＋ Criar novo produto…</option></select><small class="fld-h" id="lProdH"></small></label>' +
    '<label class="fld req"><span id="lValL">Valor (R$)</span><input name="valor" inputmode="decimal" data-chg="lancCalc" value="' + (l.valor ? fNum(l.valor, 2) : '') + '" placeholder="0,00"></label>' +
    '<label class="fld req"><span id="lTaxL">Comissão (%)</span><input name="taxa" inputmode="decimal" data-chg="lancCalc" value="' + fNum(l.taxa, 2) + '"><small class="fld-h">Vem do produto. Altere só se essa operação teve taxa diferente.</small></label>' +
    '<label class="fld req"><span>Data da operação</span><input type="date" name="data" value="' + l.data + '"></label>' +
    '<label class="fld"><span>Vencimento do produto</span><input type="date" name="venc" value="' + (l.venc || '') + '"></label>' +
    (l.id ? '<label class="fld"><span>Resgate / encerramento</span><input type="date" name="fim" value="' + (l.fim || '') + '"></label>' : '') +
    (isAdmin() ? '<label class="fld"><span>Assessor</span><select name="ass">' + opts(ST.assessores, l.ass, 'id', 'nome') + '</select></label>' : '') +
    '<label class="fld" style="grid-column:1/-1"><span>Observação</span><input name="obs" value="' + esc(l.obs || '') + '"></label>' +
    '<div class="calc-box" id="lancPrev" style="grid-column:1/-1"></div></form>';
}
function lancCalc() {
  const f = $('#lancForm'); if (!f) return;
  const p = prodOf(f.prod.value), v = pNum(f.valor.value), t = pNum(f.taxa.value), ass = assOf(f.ass ? f.ass.value : (cliOf(f.cli.value).ass || ME));
  $('#lTaxL').textContent = p.tipo === 'recorrente' ? 'Comissão (% ao ano)' : 'Comissão (%)';
  $('#lValL').textContent = p.tipo === 'recorrente' ? (/prêmio/.test(p.base || '') ? 'Prêmio anual (R$)' : 'Saldo aplicado (R$)') : 'Valor (R$)';
  const rec = p.tipo === 'recorrente' ? v * t / 1200 : v * t / 100;
  $('#lancPrev').innerHTML = '<div><small>' + catTag(p.cat) + ' ' + tipoTag(p.tipo) + ' <span class="muted">' + esc(p.base || '') + '</span></small></div><div class="calc-g"><span>Receita escritório' + (p.tipo === 'recorrente' ? ' por mês' : '') + '</span><b class="pos">' + fMoney(rec) + '</b><span>Parte de ' + esc(ass.nome.split(' ')[0]) + ' (' + ass.repasse + '%)</span><b class="gold">' + fMoney(rec * ass.repasse / 100) + '</b>' + (p.tipo === 'recorrente' ? '<span>Em 12 meses</span><b>' + fMoney(rec * 12) + ' · parte ' + fMoney(rec * 12 * ass.repasse / 100) + '</b>' : '') + '</div>';
}
function lancOpen(l) {
  const foot = (l.id ? '<button class="btn btn-danger" data-act="delLanc" data-id="' + l.id + '" style="margin-right:auto">Excluir</button>' : '') + '<button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-primary" data-act="saveLanc"' + (l.id ? ' data-id="' + l.id + '"' : '') + '>' + (l.id ? 'Salvar' : 'Salvar lançamento') + '</button>';
  openModal(l.id ? 'Editar lançamento' : 'Novo lançamento', lancForm(l), foot); lancCalc();
}
const lancDraft = () => { const f = $('#lancForm'); return { id: f.dataset.id || '', cli: f.cli.value, prod: '', taxa: pNum(f.taxa.value), valor: pNum(f.valor.value), data: f.data.value, venc: f.venc.value, fim: f.fim ? f.fim.value : '', obs: f.obs.value, ass: f.ass ? f.ass.value : ME }; };
function lancReopen(d) { if (!d.prod) { const p = ST.produtos.find(x => x.ativo); if (!p) return; d.prod = p.id; d.taxa = p.taxa; } lancOpen(d); }
ACT.newLanc = (b) => {
  if (!visClientes().length) { toast('Cadastre um cliente primeiro.'); ACT.newCli(); return; }
  const cli = (b && b.dataset.cli) || (visClientes()[0] || {}).id, p = ST.produtos.find(x => x.ativo);
  const d = { cli, prod: p ? p.id : '', taxa: p ? p.taxa : 0, data: iso(TODAY), ass: cliOf(cli).ass || ME };
  if (!p) { toast('Primeiro, crie o produto. Depois o lançamento continua.'); pwOpen(null, d); return; }
  lancOpen(d);
};
ACT.editLanc = (b) => { const l = ST.lancs.find(x => x.id === b.dataset.id); if (l) lancOpen(l); };
ACT.saveLanc = (b) => {
  const f = $('#lancForm'), v = pNum(f.valor.value), t = pNum(f.taxa.value);
  if (!(v > 0)) { toast('Informe o valor da operação.', 'warn'); return; }
  if (!(t >= 0)) { toast('Informe a comissão.', 'warn'); return; }
  const data = { cli: f.cli.value, prod: f.prod.value, valor: v, taxa: t, data: f.data.value || iso(TODAY), venc: f.venc.value, fim: f.fim ? f.fim.value : '', obs: f.obs.value.trim(), ass: f.ass ? f.ass.value : (cliOf(f.cli.value).ass || ME) };
  if (b.dataset.id) Object.assign(ST.lancs.find(x => x.id === b.dataset.id), data); else ST.lancs.push(Object.assign({ id: uid('l') }, data));
  persist(); closeModal(); render(); toast('Lançamento salvo');
};
ACT.delLanc = (b) => { ST.lancs = ST.lancs.filter(x => x.id !== b.dataset.id); persist(); closeModal(); render(); toast('Lançamento excluído'); };
CH.lancProd = (t, ev) => { if (ev.type !== 'change') return; if (t.value === '__new') { const d = lancDraft(); pwOpen(null, d); return; } const f = $('#lancForm'); f.taxa.value = fNum(prodOf(t.value).taxa, 2); lancCalc(); };
CH.lancCalc = () => lancCalc();

function cliForm(c) {
  return '<form id="cliForm" class="grid-f"><label class="fld req" style="grid-column:1/-1"><span>Nome</span><input name="nome" value="' + esc(c.nome || '') + '"></label>' +
    '<label class="fld"><span>Perfil de investidor</span><select name="perfil">' + PERFIS.map(p => '<option' + (p === c.perfil ? ' selected' : '') + '>' + p + '</option>').join('') + '</select></label>' +
    '<label class="fld"><span>Origem</span><select name="origem">' + ['Indicação', 'Evento', 'LinkedIn', 'Rede pessoal', 'Outro'].map(p => '<option' + (p === c.origem ? ' selected' : '') + '>' + p + '</option>').join('') + '</select></label>' +
    '<label class="fld"><span>Telefone</span><input name="tel" value="' + esc(c.tel || '') + '"></label><label class="fld"><span>E-mail</span><input name="email" type="email" value="' + esc(c.email || '') + '"></label>' +
    '<label class="fld"><span>Cliente desde</span><input type="date" name="desde" value="' + (c.desde || iso(TODAY)) + '"></label>' +
    (isAdmin() ? '<label class="fld"><span>Assessor</span><select name="ass">' + opts(ST.assessores, c.ass || ME, 'id', 'nome') + '</select></label>' : '') + '</form>';
}
ACT.newCli = () => openModal('Novo cliente', cliForm({ perfil: 'Moderado', origem: 'Indicação' }), '<button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-primary" data-act="saveCli">Salvar cliente</button>');
ACT.editCli = (b) => { const c = cliOf(b.dataset.id); openModal('Editar cliente', cliForm(c), '<button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-primary" data-act="saveCli" data-id="' + c.id + '">Salvar</button>'); };
ACT.saveCli = (b) => {
  const f = $('#cliForm'), nome = f.nome.value.trim(); if (!nome) { toast('Informe o nome do cliente.', 'warn'); return; }
  const data = { nome, perfil: f.perfil.value, origem: f.origem.value, tel: f.tel.value.trim(), email: f.email.value.trim(), desde: f.desde.value, ass: f.ass ? f.ass.value : ME };
  let id = b.dataset.id;
  if (id) Object.assign(cliOf(id), data); else { id = uid('c'); ST.clientes.push(Object.assign({ id, notas: '' }, data)); }
  persist(); closeModal(); render(); toast('Cliente salvo'); openDrawer({ type: 'cliente', id });
};
CH.cliProx = (t, ev) => { if (ev.type !== 'change') return; cliOf(t.dataset.id).prox = t.value; persist(); render(); toast(t.value ? 'Próximo contato agendado para ' + fDate(t.value) : 'Próximo contato removido'); };
ACT.addContato = (b) => { const f = b.closest('form'), c = cliOf(b.dataset.id), nota = f.nota.value.trim(); (c.contatos = c.contatos || []).push({ id: uid('k'), d: iso(TODAY), tipo: f.tipo.value, nota }); persist(); render(); toast('Contato registrado'); };
CH.cliNota = (t) => { const c = cliOf(t.dataset.id); c.notas = t.value; persist(); };

/* ---------- Assistente de criação de produto ---------- */
const CAT_INFO = {
  'Renda fixa': { ex: 'CDB, LCI/LCA, Tesouro, debêntures, CRI/CRA', sug: ['CDB', 'LCI', 'LCA', 'LC', 'Tesouro Direto', 'Debêntures', 'CRI', 'CRA'], ic: 'shield' },
  'Renda variável e fundos': { ex: 'Ações, FIIs, fundos, COE, ETFs', sug: ['Fundos de investimento', 'Ações', 'Fundos imobiliários', 'COE', 'ETF'], ic: 'trend' },
  'Previdência e seguros': { ex: 'PGBL, VGBL, seguro de vida', sug: ['PGBL', 'VGBL', 'Seguro de vida', 'Seguro patrimonial'], ic: 'heart' },
  'Câmbio e crédito': { ex: 'Câmbio, remessas, home equity', sug: ['Câmbio', 'Remessa internacional', 'Home equity', 'Crédito com garantia'], ic: 'globe' },
  'Consórcio': { ex: 'Imóvel, automóvel, serviços', sug: ['Consórcio de imóvel', 'Consórcio de automóvel'], ic: 'target' }
};
const BASES = { pontual: ['sobre o valor aplicado', 'sobre o volume operado', 'sobre o valor contratado', 'sobre o valor da carta'], recorrente: ['ao ano sobre o saldo', 'ao ano sobre o prêmio anual'] };
let PW = null;
function pwOpen(p, back) {
  PW = p ? { id: p.id, cat: p.cat, tipo: p.tipo, nome: p.nome, taxa: p.taxa, base: p.base, custodia: p.custodia !== false, ativo: p.ativo !== false, step: 3, back } : { cat: '', tipo: '', nome: '', taxa: '', base: '', custodia: true, ativo: true, step: 1, back };
  pwRender();
}
function pwRender() {
  const st = PW.step, steps = ['Categoria', 'Como você recebe', 'Nome e comissão'];
  const head = '<ol class="pw-steps">' + steps.map((t, k) => '<li class="' + (k + 1 < st ? 'done' : k + 1 === st ? 'on' : '') + '"><button type="button" data-act="pwGo" data-v="' + (k + 1) + '"' + (k + 1 > st && !(PW.cat && (k < 2 || PW.tipo)) ? ' disabled' : '') + '><span>' + (k + 1 < st ? '✓' : k + 1) + '</span>' + t + '</button></li>').join('') + '</ol>';
  let body = '';
  if (st === 1) body = '<p class="pw-q">Em qual categoria esse produto entra?</p><div class="pw-cards">' + CATS.map(c => '<button type="button" class="pw-card' + (PW.cat === c ? ' on' : '') + '" data-act="pwCat" data-v="' + esc(c) + '" style="--c:' + CAT_C[c] + '"><i>' + icon(CAT_INFO[c].ic) + '</i><b>' + esc(c) + '</b><small>' + esc(CAT_INFO[c].ex) + '</small></button>').join('') + '</div>';
  if (st === 2) body = '<p class="pw-q">Como você recebe a comissão desse produto?</p><div class="pw-cards two">' +
    '<button type="button" class="pw-card' + (PW.tipo === 'pontual' ? ' on' : '') + '" data-act="pwTipo" data-v="pontual" style="--c:#4C8DFF"><i>' + icon('coins') + '</i><b>Pontual</b><small>Uma vez só, sobre o valor da operação.</small><em>Ex.: R$ 100 mil em CDB a 1% = R$ 1.000 no mês da aplicação</em></button>' +
    '<button type="button" class="pw-card' + (PW.tipo === 'recorrente' ? ' on' : '') + '" data-act="pwTipo" data-v="recorrente" style="--c:#2FCB8A"><i>' + icon('refresh') + '</i><b>Recorrente</b><small>Todo mês, um % ao ano sobre o saldo do cliente.</small><em>Ex.: R$ 100 mil em fundo a 0,6% a.a. = R$ 50 por mês</em></button></div>';
  if (st === 3) {
    const sug = CAT_INFO[PW.cat] ? CAT_INFO[PW.cat].sug.filter(x => !ST.produtos.some(q => q.nome === x && q.id !== PW.id)) : [];
    body = '<div class="pw-sum">' + catTag(PW.cat) + tipoTag(PW.tipo) + '<button type="button" class="lg-link" data-act="pwGo" data-v="1">alterar</button></div>' +
      '<form id="pwForm" class="pw-f"><label class="fld req"><span>Nome do produto</span><input id="pwNome" name="nome" value="' + esc(PW.nome) + '" placeholder="Ex.: ' + esc(sug[0] || 'CDB Banco X') + '" data-chg="pwField" autocomplete="off"></label>' +
      (sug.length ? '<div class="pw-sug">' + sug.map(x => '<button type="button" class="chip" data-act="pwSug" data-v="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div>' : '') +
      '<div class="pw-row"><label class="fld req pw-pct"><span>Comissão' + (PW.tipo === 'recorrente' ? ' (% ao ano)' : ' (%)') + '</span><div class="pw-in"><input id="pwTaxa" name="taxa" inputmode="decimal" value="' + (PW.taxa === '' ? '' : fNum(PW.taxa, 2)) + '" placeholder="0,00" data-chg="pwField"><b>%</b></div></label>' +
      '<label class="fld"><span>Base de cálculo</span><select id="pwBase" name="base" data-chg="pwField">' + BASES[PW.tipo].map(b => '<option' + (b === PW.base ? ' selected' : '') + '>' + b + '</option>').join('') + '</select></label></div>' +
      '<label class="pw-tog"><input type="checkbox" id="pwCust" data-chg="pwField"' + (PW.custodia ? ' checked' : '') + '> Conta como patrimônio do cliente <small class="muted">(desmarque para câmbio, crédito, seguro e consórcio)</small></label>' +
      (PW.id ? '<label class="pw-tog"><input type="checkbox" id="pwAtivo" data-chg="pwField"' + (PW.ativo ? ' checked' : '') + '> Produto ativo para novos lançamentos</label>' : '') +
      '<div class="calc-box" id="pwPrev"></div></form>';
  }
  const foot = (st > 1 && !PW.id ? '<button class="btn btn-ghost" data-act="pwGo" data-v="' + (st - 1) + '" style="margin-right:auto">' + icon('chevL', 'ic-sm') + 'Voltar</button>' : '') + '<button class="btn btn-ghost" data-act="pwCancel">Cancelar</button>' +
    (st === 3 ? '<button class="btn btn-primary" data-act="pwSave">' + (PW.id ? 'Salvar produto' : 'Criar produto') + '</button>' : '');
  openModal(PW.id ? 'Editar produto' : 'Novo produto', head + body, foot);
  if (st === 3) { if (!PW.base) PW.base = BASES[PW.tipo][0]; pwPrev(); }
}
function pwPrev() {
  const t = pNum(PW.taxa), r = 100000 * t / 100, a = me();
  const el = $('#pwPrev'); if (!el) return;
  el.innerHTML = '<small class="muted">Simulação com R$ 100.000</small><div class="calc-g">' + (PW.tipo === 'recorrente' ?
    '<span>Receita escritório por mês</span><b class="pos">' + fMoney(r / 12) + '</b><span>Receita escritório por ano</span><b class="pos">' + fMoney(r) + '</b><span>Sua parte por ano (' + a.repasse + '%)</span><b class="gold">' + fMoney(r * a.repasse / 100) + '</b>' :
    '<span>Receita escritório</span><b class="pos">' + fMoney(r) + '</b><span>Sua parte (' + a.repasse + '%)</span><b class="gold">' + fMoney(r * a.repasse / 100) + '</b>') + '</div>';
}
ACT.pwCat = (b) => { PW.cat = b.dataset.v; PW.custodia = !['Câmbio e crédito', 'Consórcio'].includes(PW.cat); PW.step = PW.tipo ? (PW.id ? 3 : 2) : 2; pwRender(); };
ACT.pwTipo = (b) => { if (PW.tipo !== b.dataset.v) PW.base = ''; PW.tipo = b.dataset.v; PW.step = 3; pwRender(); setTimeout(() => { const n = $('#pwNome'); if (n && !n.value) n.focus(); else { const t = $('#pwTaxa'); t && t.focus(); } }, 40); };
ACT.pwGo = (b) => { PW.step = +b.dataset.v; pwRender(); };
ACT.pwSug = (b) => { PW.nome = b.dataset.v; if (/seguro/i.test(PW.nome)) { PW.custodia = false; if (PW.tipo === 'recorrente') PW.base = 'ao ano sobre o prêmio anual'; } pwRender(); setTimeout(() => $('#pwTaxa').focus(), 30); };
CH.pwField = () => { PW.nome = $('#pwNome').value; PW.taxa = $('#pwTaxa').value; PW.base = $('#pwBase').value; PW.custodia = $('#pwCust').checked; if ($('#pwAtivo')) PW.ativo = $('#pwAtivo').checked; pwPrev(); };
ACT.pwCancel = () => { const back = PW && PW.back; PW = null; closeModal(); if (back) lancReopen(back); };
ACT.pwSave = () => {
  CH.pwField();
  const nome = PW.nome.trim(), taxa = pNum(PW.taxa);
  if (!nome) { toast('Dê um nome ao produto.', 'warn'); $('#pwNome').focus(); return; }
  if (!(taxa > 0)) { toast('Informe a porcentagem de comissão.', 'warn'); $('#pwTaxa').focus(); return; }
  const data = { nome, cat: PW.cat, tipo: PW.tipo, taxa, base: PW.base, custodia: PW.custodia, ativo: PW.ativo };
  let id = PW.id;
  if (id) Object.assign(prodOf(id), data); else { id = uid('p'); ST.produtos.push(Object.assign({ id }, data)); }
  const back = PW.back; PW = null; persist(); closeModal(); render(); toast(back ? 'Produto criado. Continue o lançamento.' : 'Produto salvo');
  if (back) { back.prod = id; back.taxa = taxa; lancReopen(back); }
};
ACT.newProd = () => pwOpen(null, null);
ACT.editProd = (b) => pwOpen(prodOf(b.dataset.id), null);

function assForm(a) {
  return '<form id="assForm" class="grid-f"><label class="fld req"><span>Nome</span><input name="nome" value="' + esc(a.nome || '') + '"></label><label class="fld req"><span>E-mail</span><input name="email" type="email" value="' + esc(a.email || '') + '"' + (a.id && W.Store.mode !== 'local' ? ' readonly' : '') + '></label>' +
    '<label class="fld req"><span>Repasse ao assessor (%)</span><input name="repasse" inputmode="decimal" value="' + fNum(a.repasse == null ? 35 : a.repasse, 0) + '"></label><label class="fld"><span>Meta mensal de receita escritório (R$)</span><input name="meta" inputmode="decimal" value="' + fNum(a.meta || 0, 0) + '"></label>' +
    '<label class="fld"><span>Papel</span><select name="role"><option value="assessor">Assessor (vê só os próprios clientes)</option><option value="admin"' + (a.role === 'admin' ? ' selected' : '') + '>Administrador (vê tudo)</option></select></label></form>';
}
ACT.newAss = () => openModal('Novo assessor', assForm({}), '<button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-primary" data-act="saveAss">Salvar</button>');
ACT.editAss = (b) => { const a = assOf(b.dataset.id); openModal('Editar assessor', assForm(a), '<button class="btn btn-ghost" data-act="closeModal">Cancelar</button><button class="btn btn-primary" data-act="saveAss" data-id="' + a.id + '">Salvar</button>'); };
ACT.saveAss = async (b) => {
  const f = $('#assForm'), nome = f.nome.value.trim(); if (!nome) { toast('Informe o nome.', 'warn'); return; }
  const data = { nome, ini: nome.split(/\s+/).filter(w => /^[A-ZÁ-Ú]/.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase() || nome[0].toUpperCase(), email: f.email.value.trim(), repasse: clamp(pNum(f.repasse.value), 0, 100), meta: pNum(f.meta.value), role: f.role.value };
  if (b.dataset.id === ME && data.role !== 'admin') data.role = 'admin';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) { toast('Informe um e-mail válido.', 'warn'); return; }
  data.email = data.email.toLowerCase();
  if (W.Store.mode === 'local') { if (b.dataset.id) Object.assign(assOf(b.dataset.id), data); else ST.assessores.push(Object.assign({ id: uid('a') }, data)); persist(); }
  else {
    try {
      if (b.dataset.id) { const old = assOf(b.dataset.id); await W.Store.updateMember(old.email, { nome: data.nome, ini: data.ini, repasse: data.repasse, meta: data.meta, role: data.role }); }
      else await W.Store.addMember(data);
      ST.assessores = W.Store.members();
    } catch (er) { toast('Não foi possível salvar: ' + (er.message || er), 'warn'); return; }
  }
  closeModal(); render(); renderTop(); toast(b.dataset.id ? 'Assessor salvo' : 'Acesso liberado para ' + data.email + '. Peça para fazer o primeiro acesso.');
};

ACT.simular = () => {
  openModal('Simular comissão', '<form id="simForm" class="grid-f"><label class="fld"><span>Produto</span><select name="prod" data-chg="simCalc">' + CATS.map(c => '<optgroup label="' + esc(c) + '">' + opts(ST.produtos.filter(p => p.cat === c && p.ativo), '', 'id', 'nome') + '</optgroup>').join('') + '</select></label><label class="fld"><span>Valor (R$)</span><input name="valor" inputmode="decimal" data-chg="simCalc" value="100.000,00"></label><div class="calc-box" id="simOut" style="grid-column:1/-1"></div></form>', '<button class="btn btn-ghost" data-act="closeModal">Fechar</button>');
  CH.simCalc();
};
CH.simCalc = () => {
  const f = $('#simForm'); if (!f) return; const p = prodOf(f.prod.value), v = pNum(f.valor.value), r = v * p.taxa / 100, a = me();
  $('#simOut').innerHTML = '<div><small>' + catTag(p.cat) + ' ' + tipoTag(p.tipo) + ' <span class="muted">' + fTaxa(p) + ' ' + esc(p.base || '') + '</span></small></div><div class="calc-g">' + (p.tipo === 'recorrente' ?
    '<span>Receita escritório por mês</span><b class="pos">' + fMoney(r / 12) + '</b><span>Receita escritório por ano</span><b class="pos">' + fMoney(r) + '</b><span>Sua parte por ano (' + a.repasse + '%)</span><b class="gold">' + fMoney(r * a.repasse / 100) + '</b>' :
    '<span>Receita escritório</span><b class="pos">' + fMoney(r) + '</b><span>Sua parte (' + a.repasse + '%)</span><b class="gold">' + fMoney(r * a.repasse / 100) + '</b>') + '</div>';
};

ACT.exportCSV = () => {
  const per = W.UI.tab === 'lancamentos' ? [W.UI.lMes] : lastN(12);
  const rows = [['Mês', 'Data', 'Cliente', 'Produto', 'Categoria', 'Tipo', 'Valor', 'Comissão %', 'Receita escritório', 'Repasse %', 'Parte do assessor', 'Assessor']];
  per.forEach(ym => visLancs().forEach(l => { const v = recIn(l, ym); if (!v) return; const p = prodOf(l.prod), a = assOf(l.ass); rows.push([ymLabel(ym), fDate(l.data), cliOf(l.cli).nome, p.nome, p.cat, p.tipo, fNum(l.valor, 2), fNum(l.taxa, 2), fNum(v, 2), a.repasse, fNum(v * a.repasse / 100, 2), a.nome]); }));
  const csv = '﻿' + rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(';')).join('\n');
  saveFile('horus-receitas-' + per[0] + (per.length > 1 ? '-a-' + per[per.length - 1] : '') + '.csv', new Blob([csv], { type: 'text/csv' }));
};

/* ---------- Navegação e shell ---------- */
const TABS = [['inicio', 'Início'], ['clientes', 'Clientes'], ['lancamentos', 'Lançamentos'], ['conferencia', 'Conferência'], ['agenda', 'Agenda'], ['apresentacoes', 'Apresentações'], ['produtos', 'Produtos'], ['projecao', 'Projeção'], ['relatorios', 'Relatórios'], ['assessores', 'Assessores']];
const tabsVis = () => TABS.filter(([id]) => id !== 'assessores' || isAdmin());
function renderTabs() { $('#tabs').innerHTML = tabsVis().map(([id, l]) => '<button class="tab ' + (W.UI.tab === id ? 'on' : '') + '" data-act="go" data-v="' + id + '"' + (W.UI.tab === id ? ' aria-current="page"' : '') + '>' + icon(AT[id], 'ic-sm') + l + '</button>').join(''); }
function renderTop() {
  $('#meAv').textContent = me().ini;
  $('#asSel').innerHTML = isAdmin() ? '<select class="inp as-sel" data-chg="asSel" aria-label="Ver dados de"><option value="todos">Todos os assessores</option>' + opts(ST.assessores, W.UI.as, 'id', 'nome') + '</select>' : '';
}
W.render = () => { const main = $('#main'), keep = main.scrollTop; main.innerHTML = (V[W.UI.tab] || V.inicio)(); renderTabs(); main.scrollTop = keep; if (W.UI.drawer) renderDrawer(); };
const render = W.render;
const go = W.go = (t) => { if (!V[t]) t = 'inicio'; closePop(); if (W.Studio) W.Studio.toggle(t === 'apresentacoes'); W.UI.tab = t; try { history.replaceState(null, '', '#' + t); } catch (e) {} $('#main').scrollTop = 0; render(); };
const openDrawer = (d) => { W.UI.drawer = d; renderDrawer(); $('#drawer').hidden = false; $('#scrim').hidden = false; };
const closeDrawer = () => { W.UI.drawer = null; $('#drawer').hidden = true; $('#scrim').hidden = true; $('#drawer').innerHTML = ''; };
function renderDrawer() { const d = W.UI.drawer; if (!d) return; const b = $('#drawer .dr-b'), sc = b ? b.scrollTop : 0; $('#drawer').innerHTML = DRAWERS[d.type](d); const nb = $('#drawer .dr-b'); if (nb) nb.scrollTop = sc; }
const openPop = W.openPop = (anchor, title, content) => {
  const p = $('#pop'); let body;
  if (Array.isArray(content)) { W._popFns = content.map(i => i[1]); body = '<div class="pop-b" style="padding:6px">' + content.map((c, i) => '<button class="pop-item" data-act="popItem" data-i="' + i + '">' + c[0] + '</button>').join('') + '</div>'; }
  else body = '<div class="pop-b">' + (content || '') + '</div>';
  p.innerHTML = '<div class="pop-h"><span>' + esc(title) + '</span><button class="ibtn" data-act="closePop" aria-label="Fechar">' + icon('x', 'ic-sm') + '</button></div>' + body;
  p.hidden = false; const r = anchor.getBoundingClientRect(), pw = p.offsetWidth, ph = p.offsetHeight;
  let top = r.bottom + 8; if (top + ph > innerHeight - 12) top = Math.max(12, r.top - ph - 8);
  p.style.left = clamp(r.left + r.width / 2 - pw / 2, 12, innerWidth - pw - 12) + 'px'; p.style.top = top + 'px'; W._popAnchor = anchor;
};
const closePop = W.closePop = () => { $('#pop').hidden = true; W._popAnchor = null; };

Object.assign(ACT, {
  go: (b) => go(b.dataset.v), closeModal, closeDrawer, closePop,
  popItem: (b) => { const f = W._popFns && W._popFns[+b.dataset.i]; closePop(); f && f(); },
  confirmOk: () => { const f = W._confirmFn; closeModal(); f && f(); },
  openCli: (b) => openDrawer({ type: 'cliente', id: b.dataset.id }),
  toggleHP: () => HP.toggle(),
  cliPerfil: (b) => { W.UI.cPerfil = b.dataset.v; render(); },
  lCat: (b) => { W.UI.lCat = b.dataset.v; render(); },
  rPer: (b) => { W.UI.rPer = b.dataset.v; render(); },
  openNotes: (b) => { openPop(b, 'Notas rápidas', []); $('#pop .pop-b').innerHTML = '<textarea id="quickNote" class="inp" style="height:160px;padding:10px;width:min(300px,80vw)" placeholder="Anote algo para não esquecer…">' + esc(ST.nota || '') + '</textarea><small class="muted" style="display:block;padding:4px 2px">Salva automaticamente.</small>'; const p = $('#pop'), r = b.getBoundingClientRect(); p.style.top = Math.max(12, r.top - p.offsetHeight - 8) + 'px'; $('#quickNote').focus(); },
  userMenu: (b) => openPop(b, 'Sua conta', [
    [icon('user', 'ic-sm') + ' <span>' + esc(me().nome) + '<br><small class="muted">' + esc(me().email) + ' · repasse ' + me().repasse + '%</small></span>', () => { go('assessores'); }],
    [icon('download', 'ic-sm') + ' Baixar backup (.json)', () => saveFile('horus-backup-' + iso(TODAY) + '.json', new Blob([JSON.stringify(ST, null, 1)], { type: 'application/json' }))]
  ].concat(W.Store.mode === 'local' ? [[icon('refresh', 'ic-sm') + ' Restaurar dados de exemplo', () => W.Store.reset().then(() => location.reload())]] : [[icon('lock', 'ic-sm') + ' Trocar minha senha', () => W.Store.auth.reset(me().email).then(() => toast('Enviamos um link de troca de senha para o seu e-mail.')).catch(er => toast(er.message, 'warn'))]]).concat([
    [icon('logout', 'ic-sm') + ' Sair', () => W.Store.auth.signOut().then(() => location.reload())]
  ]))
});
CH.cliQ = (t, ev) => { if (ev.type !== 'input') return; W.UI.q = t.value; render(); const i = $('[data-chg="cliQ"]'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); };
CH.lMes = (t, ev) => { if (ev.type !== 'change') return; W.UI.lMes = t.value; render(); };
CH.asSel = (t, ev) => { if (ev.type !== 'change') return; W.UI.as = t.value; render(); };

document.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-act]'), ab = ev.target.closest('[data-act],[data-x]');
  if (!$('#pop').hidden && !ev.target.closest('#pop') && (!ab || ab !== W._popAnchor)) closePop();
  if (!ev.target.closest('.search')) $('#gresults').hidden = true;
  if (!b || b.disabled) return;
  const fn = ACT[b.dataset.act]; if (fn) { ev.preventDefault(); fn(b, ev); }
});
['change', 'input'].forEach(type => document.addEventListener(type, (ev) => { const t = ev.target.closest('[data-chg]'); if (t && CH[t.dataset.chg]) CH[t.dataset.chg](t, ev); }));
document.addEventListener('input', (ev) => { if (ev.target.id === 'quickNote') { ST.nota = ev.target.value; persist(); } });
$('#scrim').addEventListener('click', closeDrawer);
$('#modal').addEventListener('click', (ev) => { if (ev.target.id === 'modal') closeModal(); });
document.addEventListener('submit', (ev) => ev.preventDefault());
document.addEventListener('keydown', (ev) => { if (ev.key !== 'Escape') return; if (!$('#modal').hidden) closeModal(); else if (!$('#pop').hidden) closePop(); else if (W.UI.drawer) closeDrawer(); });
$('#gsearch').addEventListener('input', (ev) => {
  const q = ev.target.value.trim().toLowerCase(), r = $('#gresults');
  if (q.length < 2) { r.hidden = true; return; }
  const cs = visClientes().filter(c => c.nome.toLowerCase().includes(q)).slice(0, 6), ps = ST.produtos.filter(p => p.nome.toLowerCase().includes(q)).slice(0, 4);
  r.innerHTML = cs.map(c => '<button class="gres" data-act="gopenCli" data-id="' + c.id + '">' + icon('user', 'ic-sm') + '<span>' + esc(c.nome) + '<small>Cliente · ' + esc(c.perfil) + '</small></span></button>').join('') + ps.map(p => '<button class="gres" data-act="gopenProd">' + icon('coins', 'ic-sm') + '<span>' + esc(p.nome) + '<small>Produto · ' + fTaxa(p) + '</small></span></button>').join('') || '<div class="empty" style="padding:14px">Nada encontrado.</div>';
  r.hidden = false;
});
ACT.gopenCli = (b) => { $('#gresults').hidden = true; $('#gsearch').value = ''; go('clientes'); openDrawer({ type: 'cliente', id: b.dataset.id }); };
ACT.gopenProd = () => { $('#gresults').hidden = true; $('#gsearch').value = ''; go('produtos'); };

/* ---------- Login e início ---------- */
let started = false, renderT = null;
function loginMsg(t, kind) { const m = $('#lgMsg'); m.textContent = t || ''; m.className = 'lg-msg' + (kind ? ' ' + kind : ''); }
function setMode(mode) {
  const f = $('#loginForm'); f.dataset.mode = mode;
  $('#lgTitle').textContent = mode === 'signup' ? 'Primeiro acesso' : mode === 'reset' ? 'Recuperar senha' : 'Acesso interno';
  $('#lgSub').textContent = mode === 'signup' ? 'Use o e-mail liberado para você e crie sua senha.' : mode === 'reset' ? 'Enviaremos um link para criar uma nova senha.' : 'Entre com seu e-mail e senha de assessor.';
  $('#lgNameF').hidden = mode !== 'signup'; $('#lgPassF').hidden = mode === 'reset';
  $('#lgGo').textContent = mode === 'signup' ? 'Criar acesso' : mode === 'reset' ? 'Enviar link' : 'Entrar';
  $('#lgLinks').innerHTML = mode === 'login' ? '<button type="button" class="lg-link" data-lg="signup">Primeiro acesso</button><button type="button" class="lg-link" data-lg="reset">Esqueci minha senha</button>' : '<button type="button" class="lg-link" data-lg="login">Voltar para o login</button>';
  loginMsg('');
}
async function enter() {
  W.setSync('Carregando dados…', 'off');
  try {
    ST = normalize(await W.Store.load()); W.ST = ST;
    ST.assessores = W.Store.members();
    ME = W.Store.meId() || (ST.assessores[0] || {}).id; W.ME = ME;
    if (W.Store.mode === 'local' && !Object.keys(ST.receb).length && ST.lancs.length) { seedReceb(); persist(); }
    started = true;
    $('#login').hidden = true; $('#app').hidden = false; renderTop();
    const t = location.hash.slice(1); go(V[t] ? t : 'inicio');
  } catch (er) { console.error(er); loginMsg(er.message || 'Não foi possível carregar os dados.', 'err'); $('#login').hidden = false; }
}
addEventListener('horus:remote', () => {
  if (!started) return; clearTimeout(renderT);
  renderT = setTimeout(() => {
    normalize(ST); ST.assessores = W.Store.members();
    if (!$('#modal').hidden || W.UI.tab === 'apresentacoes') return;
    const ae = document.activeElement; if (ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName) && ($('#main').contains(ae) || $('#drawer').contains(ae))) return;
    render(); renderTop();
  }, 400);
});
W.HorusApp = {
  init() {
    $('#loginBrand').innerHTML = brandHTML(true) + '<div class="lb-tag">Clientes, comissões e receita do escritório no mesmo lugar.</div><div class="lb-foot">Horus Consultoria Financeira · uso exclusivo dos assessores</div>';
    $('#brand').innerHTML = brandHTML(false);
    const demo = W.Store.mode === 'local';
    $('#lgHint').textContent = demo ? 'Modo demonstração: qualquer e-mail e senha entram. Os dados ficam só neste navegador.' : 'Acesso restrito aos assessores liberados. Conexão protegida.';
    if (demo) { $('#lgUser').value = 'caduliam325@gmail.com'; $('#lgPass').value = 'demonstracao'; }
    setMode('login');
    $('#lgLinks').addEventListener('click', (ev) => { const b = ev.target.closest('[data-lg]'); if (b) setMode(b.dataset.lg); });
    $('#loginForm').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const mode = ev.currentTarget.dataset.mode, email = $('#lgUser').value.trim().toLowerCase(), pass = $('#lgPass').value, nome = $('#lgName').value.trim();
      if (!email) return loginMsg('Informe seu e-mail.', 'err');
      const btn = $('#lgGo'); btn.disabled = true;
      try {
        if (mode === 'reset') { await W.Store.auth.reset(email); loginMsg('Pronto. Verifique sua caixa de entrada.', 'ok'); }
        else if (mode === 'signup') {
          if (pass.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
          if (!nome) throw new Error('Informe seu nome.');
          const r = await W.Store.auth.signUp(email, pass, nome);
          if (r && r.msg) { setMode('login'); $('#lgUser').value = email; loginMsg(r.msg, 'ok'); }
        } else { if (!pass) throw new Error('Informe sua senha.'); await W.Store.auth.signIn(email, pass); }
      } catch (er) { loginMsg(W.Store.auth.message ? W.Store.auth.message(er) : er.message, 'err'); }
      btn.disabled = false;
    });
    W.Store.auth.onChange((u) => { if (u && !started) enter(); if (!u) { $('#login').hidden = false; $('#app').hidden = true; } });
    addEventListener('hashchange', () => { const t = location.hash.slice(1); if (started && t && t !== W.UI.tab && V[t]) go(t); });
  }
};
})();
