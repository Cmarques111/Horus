/* HORUS · armazenamento local (modo demonstração, sem servidor) */
(function(){
const W = window;
const KEY = 'horus.demo.v3', SKEY = 'horus.session';
const get = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
W.createLocalStore = () => {
  let st = null, user = get(SKEY), t = null; const ls = [];
  return {
    mode: 'local',
    async load() { st = get(KEY); if (!st || !st.assessores) st = W.horusSeed(); W.setSync && W.setSync('Salvo neste navegador'); return st; },
    save(s) { st = s; clearTimeout(t); W.setSync && W.setSync('Salvando…', 'off'); t = setTimeout(() => { const ok = set(KEY, s); W.setSync && W.setSync(ok ? 'Salvo neste navegador' : 'Sem espaço no navegador', ok ? '' : 'warn'); }, 300); },
    async reset() { try { localStorage.removeItem(KEY); } catch (e) {} },
    members: () => (st && st.assessores) || [],
    meId: () => 'a1',
    isAdmin: () => true,
    auth: {
      current: () => user,
      onChange(cb) { ls.push(cb); setTimeout(() => cb(user), 0); },
      async signIn(email) { user = { email, uid: 'local' }; set(SKEY, user); ls.forEach(f => f(user)); },
      async signUp(email) { return this.signIn(email); },
      async reset() { throw new Error('No modo demonstração não há envio de e-mail.'); },
      async signOut() { user = null; try { localStorage.removeItem(SKEY); } catch (e) {} },
      message: (er) => er.message
    }
  };
};
})();
