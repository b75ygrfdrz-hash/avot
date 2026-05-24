// Deep linking — hash-based routes the prototype can read directly,
// no server required. Examples:
//   #avot/1.14         → opens Mishnah 1:14
//   #avot/3.6/he       → opens 3:6 Hebrew-only
//   #avot/home         → forces the home screen
//   #avot/chain        → opens the Chain of Mesorah
//   #avot/shabbat      → opens the Shabbat Table
//   #h=<text>          → highlight + scroll to a phrase (combined with above)

(function () {
  // Parse the current hash into a route object
  function parseHash() {
    const h = (location.hash || '').replace(/^#/, '');
    if (!h) return null;
    const [primary, queryStr] = h.split('?');
    const parts = primary.split('/').filter(Boolean);
    const route = { kind: null, perek: null, mishnah: null, view: null, focus: null, query: {} };
    if (queryStr) {
      queryStr.split('&').forEach(kv => {
        const [k, v] = kv.split('=');
        if (k) route.query[k] = decodeURIComponent(v || '');
      });
    }
    if (parts[0] === 'avot') {
      if (parts[1] === 'home') {
        route.kind = 'home';
      } else if (parts[1] === 'chain') {
        route.kind = 'chain';
        route.focus = parts[2] || null;
      } else if (parts[1] === 'shabbat') {
        route.kind = 'shabbat';
      } else if (parts[1] === 'list') {
        route.kind = 'list';
      } else if (parts[1]) {
        const m = parts[1].match(/^(\d+)\.(\d+)$/);
        if (m) {
          route.kind = 'mishnah';
          route.perek = Number(m[1]);
          route.mishnah = Number(m[2]);
          if (parts[2] === 'he' || parts[2] === 'en' || parts[2] === 'split' || parts[2] === 'stacked') {
            route.view = parts[2];
          }
        }
      }
    }
    return route;
  }

  // Build a hash for a given mishnah reference
  function buildHash(perek, mishnah, opts = {}) {
    let h = `#avot/${perek}.${mishnah}`;
    if (opts.view) h += `/${opts.view}`;
    const qParts = [];
    if (opts.highlight) qParts.push(`h=${encodeURIComponent(opts.highlight)}`);
    if (qParts.length) h += '?' + qParts.join('&');
    return h;
  }

  window.AvotRoutes = {
    parseHash,
    buildHash,
    update(perek, mishnah, opts) {
      const newHash = buildHash(perek, mishnah, opts);
      if (location.hash !== newHash) {
        history.replaceState(null, '', newHash);
      }
    },
    home() {
      if (location.hash !== '#avot/home') history.replaceState(null, '', '#avot/home');
    },
  };
})();

