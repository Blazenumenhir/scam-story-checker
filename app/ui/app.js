// Alibi window. Renders the case list, the new-check screen and the dossier.
// The desktop shell calls window.alibi; the same calls drive the README captures.
(() => {
  const ICON = {
    plus: '<path d="M8 3v10M3 8h10"/>',
    seller: '<path d="M2.5 8.6V3.2c0-.4.3-.7.7-.7h5.4l5 5-6.1 6.1z"/><circle cx="5.6" cy="5.6" r="1"/>',
    recruiter: '<rect x="2.5" y="5" width="11" height="8" rx="1.5"/><path d="M6 5V3.8c0-.4.3-.8.8-.8h2.4c.5 0 .8.4.8.8V5M2.5 8.5h11"/>',
    landlord: '<circle cx="5.5" cy="10.5" r="3"/><path d="M7.6 8.4 13 3M11 5l1.5 1.5"/>',
    website: '<circle cx="8" cy="8" r="5.5"/><path d="M2.5 8h11M8 2.5c1.6 1.6 2.4 3.5 2.4 5.5S9.6 11.9 8 13.5C6.4 11.9 5.6 10 5.6 8S6.4 4.1 8 2.5z"/>',
    myself: '<circle cx="8" cy="5.5" r="2.5"/><path d="M3 13.5c.8-2.5 2.7-3.8 5-3.8s4.2 1.3 5 3.8"/>',
    pen: '<path d="M3 13l1-3.5L10.5 3 13 5.5 6.5 12z"/>',
    eye: '<path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/>',
    gear: '<circle cx="8" cy="8" r="2.2"/><path d="M8 1.8v1.7M8 12.5v1.7M1.8 8h1.7M12.5 8h1.7M3.6 3.6l1.2 1.2M11.2 11.2l1.2 1.2M3.6 12.4l1.2-1.2M11.2 4.8l1.2-1.2"/>',
    shield: '<path d="M8 2l5 2v4c0 3-2.2 5-5 6-2.8-1-5-3-5-6V4z"/>',
    saved: '<path d="M3 5h10v8H3zM2.5 2.5h11V5h-11zM6 9l1.5 1.5L10 8"/>',
    pc: '<rect x="2" y="3" width="12" height="8" rx="1"/><path d="M6 14h4M8 11v3"/>',
    check: '<path d="M3.5 8.5l3 3 6-6.5"/>',
    cut: '<circle cx="4.5" cy="4.5" r="2"/><circle cx="4.5" cy="11.5" r="2"/><path d="M6.2 5.6 13 12M6.2 10.4 13 4"/>',
    doc: '<path d="M4 2h5l3 3v9H4zM9 2v3h3"/>',
    lead: '<path d="M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1"/>',
    out: '<path d="M6.5 3H3v10h10V9.5M9 3h4v4M13 3 7.5 8.5"/>',
    wayback: '<path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9M2.5 2.5v2.6h2.6M8 5v3.2l2 1.3"/>',
  };
  const i = (n) => `<svg class="i" viewBox="0 0 16 16">${ICON[n]}</svg>`;

  const REASONS = {
    seller: ['seller', 'A seller'], recruiter: ['recruiter', 'A recruiter or job'], landlord: ['landlord', 'A landlord'],
    website: ['website', 'A website or shop'], myself: ['myself', 'Myself'],
  };
  const SHORT = { seller: 'Seller', recruiter: 'Recruiter', landlord: 'Landlord', website: 'Website', myself: 'Myself' };
  const VERDICT = { bad: 'Red flags', warn: 'Doesn’t add up', ok: 'Holds up' };
  const DOT = { bad: 'var(--bad)', warn: 'var(--warn)', ok: 'var(--ok)', none: 'var(--faint)' };

  const LIST = [
    { no: '0411', date: '28 Oct', name: 'mossvale-lettings.co', reason: 'landlord', v: 'ok' },
    { no: '0409', date: '25 Oct', name: 'j.calloway.talent', reason: 'recruiter', v: 'warn' },
    { no: '0406', date: '19 Oct', name: 'Myself', reason: 'myself', v: 'none', meta: '3 of 9 done' },
    { no: '0402', date: '14 Oct', name: 'quickparcel-redeliver.info', reason: 'website', v: 'bad' },
    { no: '0397', date: '9 Oct', name: 'bramble.and.co', reason: 'seller', v: 'ok' },
    { no: '0391', date: '2 Oct', name: 'h.okafor.studio', reason: 'recruiter', v: 'ok' },
  ];
  const NEW = { no: '0412', date: '30 Oct', name: 'sunny.deals24', reason: 'seller', v: 'bad' };

  const EXHIBITS = [
    ['E1', 'Marketplace profile', 'swapyard.market/u/sunny.deals24', '14:02:38', '9f2c41…a71e', 'web'],
    ['E2', 'Photo match, 3 profiles', 'image hash b3e1 0c7f 92aa', '14:02:44', '5c1e07…9b07', 'web'],
    ['E3', 'Profile gadget_hub_mk', 'swapyard.market/u/gadget_hub_mk', '14:02:47', '2a7d90…c41f', 'web'],
    ['E4', 'Profile elena.v.sells', 'kerbside.shop/u/elena.v.sells', '14:02:51', 'e81b3c…04d2', 'web'],
    ['E5', 'Listing in Leeds, same phone', 'swapyard.market/l/88213907', '14:02:55', '70c9aa…f3b8', 'web'],
    ['E6', 'Domain record', 'rdap · sunnydeals-outlet24.shop', '14:02:58', '4be6d2…18aa', 'local'],
    ['E7', 'Listing in Bristol, same phone', 'kerbside.shop/i/5530912', '14:03:02', 'c3f018…7e61', 'web'],
    ['E8', 'Shop homepage', 'sunnydeals-outlet24.shop', '14:03:05', '0d4a77…b29c', 'web'],
    ['E9', 'Certificate log', 'crt.sh · first seen 21 Oct 2026', '14:03:07', '91e5b0…3a6f', 'local'],
  ];

  const CASE = {
    '0412': {
      handle: 'sunny.deals24', reason: 'seller', opened: 'Opened 30 Oct 2026, 14:02 UTC',
      sub: 'Nickname on a marketplace. Selling a games console.',
      said: 'Barely used console, still boxed. Bank transfer first and I’ll post it the same day.',
      v: 'bad', line: 'This seller’s story doesn’t hold up.', facts: '3 reasons · 9 exhibits · checked in 0:31', counts: [9, 5],
      reasons: [
        ['The account is <b>6 days old</b>. Nothing on it is older than last week.', ['E1']],
        ['The same profile photo is on <b>3 accounts with 3 different names</b>.', ['E2', 'E3', 'E4']],
        ['The shop it links to was registered <b>9 days ago</b>, and its owner is hidden.', ['E6', 'E9']],
      ],
      plain: 'Nine public finds, all saved as proof. The account, the shop and two look-alike accounts all appeared in the last ten days, and the phone number in the listing is <b>also selling consoles in Leeds and Bristol</b>. A seller with a boxed console rarely needs the money first. If you still want it, pay in person when you collect.',
    },
    '0411': {
      handle: 'mossvale-lettings.co', reason: 'landlord', opened: 'Opened 28 Oct 2026, 09:40 UTC', sub: 'Letting agent website.',
      said: 'We’ve managed flats in this area since 2011. Viewings on Saturday.',
      v: 'ok', line: 'Their story holds up.', facts: '3 reasons · 7 exhibits', counts: [7, 3],
      reasons: [['The domain is <b>14 years old</b> and has kept the same owner.', ['E2']], ['Their listings go back to <b>2012</b> on the Wayback Machine.', ['E4']], ['The office address matches the company register.', ['E6']]],
    },
    '0409': {
      handle: 'j.calloway.talent', reason: 'recruiter', opened: 'Opened 25 Oct 2026, 18:15 UTC', sub: 'Recruiter on a messaging app.',
      said: 'Remote data-entry role, £42 an hour, start Monday. Just need a copy of your ID first.',
      v: 'warn', line: 'Parts of this story don’t add up.', facts: '2 reasons · 6 exhibits', counts: [6, 2],
      reasons: [['The company is real, but <b>nobody by this name</b> works there publicly.', ['E1', 'E3']], ['The same job text is posted by <b>4 other recruiters</b>.', ['E5']]],
    },
  };

  const FEED = [
    ['SY', 'Swapyard', 'profile', 'found', 1], ['GH', 'GitHub', '', 'nothing', 0], ['IM', 'Photo match', 'image hash', '3 profiles', 1],
    ['RD', 'Reddit', '', 'nothing', 0], ['KB', 'Kerbside', 'profile', 'found', 1], ['BS', 'Bluesky', '', 'nothing', 0],
    ['SY', 'Swapyard', 'listing, Leeds', 'found', 1], ['GV', 'Gravatar', '', 'nothing', 0], ['DN', 'Domain record', 'rdap', 'found', 1],
    ['MA', 'Mastodon', '', 'nothing', 0], ['KB', 'Kerbside', 'listing, Bristol', 'found', 1], ['WB', 'Wayback Machine', 'snapshot', 'saved', 1],
    ['CT', 'Certificate log', 'crt.sh', 'found', 1], ['SO', 'Stack Overflow', '', 'nothing', 0],
  ];

  const LEADS = [
    { k: 'Start', t: '<span class="mono">sunny.deals24</span>', why: 'Where you started.', start: 1 },
    { k: 'Lead 1', d: 'depth 1', from: 'Profile photo', to: 'the same photo on 3 accounts', why: 'Photos are matched by image hash, never by face.', ex: ['E2', 'E3', 'E4'] },
    { k: 'Lead 2', d: 'depth 1', from: 'Phone in the listing', to: '2 more listings, Leeds and Bristol', why: 'The number +44 7700 900461 is printed in the listing.', ex: ['E5', 'E7'] },
    { k: 'Lead 3', d: 'depth 1', from: 'Shop link in the bio', to: '<span class="mono">sunnydeals-outlet24.shop</span>', why: 'The profile links to it.', ex: ['E8'] },
    { k: 'Lead 4', d: 'depth 2 · from lead 3', d2: 1, from: 'Domain record', to: 'registered 21 Oct 2026, owner hidden', why: 'Domain records say when a site was born.', ex: ['E6', 'E9'] },
    { k: 'Lead 5', d: 'depth 2 · from lead 1', d2: 1, from: 'elena.v.sells', to: 'other marketplaces', why: 'You cut this branch. Alibi won’t follow it.', cut: 1 },
  ];

  const app = document.getElementById('app');
  const state = { reason: null, selected: null, list: LIST.slice(), newOn: true };
  const $ = (s) => app.querySelector(s);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const num = (n) => n.toLocaleString('en-GB');

  function shell() {
    app.innerHTML = `
      <div class="lamp"></div>
      <div class="titlebar">
        <div class="brand">${window.AlibiMark ? window.AlibiMark(18) : ''}<b>Alibi</b></div>
        <div class="where" id="where"></div>
        <div class="ctl"><span><svg viewBox="0 0 10 10"><path d="M0 5.5h10"/></svg></span><span><svg viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9"/></svg></span><span><svg viewBox="0 0 10 10"><path d="M0 0l10 10M10 0L0 10"/></svg></span></div>
      </div>
      <aside class="side">
        <div class="newcheck" id="newcheck">${i('plus')}New check<kbd>Ctrl N</kbd></div>
        <h6>Cases <span class="mono" id="count"></span></h6>
        <div class="cases" id="cases"></div>
        <div class="foot">
          <div class="row">${i('eye')}Watching<em>2 active</em></div>
          <div class="row">${i('gear')}Settings</div>
          <div class="local"><i></i>Local AI. Nothing leaves this PC</div>
        </div>
      </aside>
      <main class="main"><div class="scroll" id="scroll"><div class="page" id="page"></div></div><div class="pop" id="pop"></div><div class="veil" id="veil"></div></main>`;
  }

  function renderList(freshNo) {
    $('#newcheck').classList.toggle('on', state.newOn);
    $('#count').textContent = 12 + (state.list.length - LIST.length);
    $('#cases').innerHTML = state.list.map((c) => `
      <div class="case${c.no === state.selected ? ' on' : ''}${c.no === freshNo ? ' fresh' : ''}">
        <div class="top"><span>No. ${c.no}</span><span>${c.date}</span></div>
        <div class="name">${c.name}</div>
        <div class="meta"><i style="background:${DOT[c.v]}"></i>${SHORT[c.reason]}${c.meta ? ` · ${c.meta}` : c.v !== 'none' ? ` · ${VERDICT[c.v]}` : ''}</div>
      </div>`).join('');
  }

  function where(html) { $('#where').innerHTML = html; }

  // New check
  function renderHome() {
    state.newOn = true; state.selected = null; renderList();
    where('<b>New check</b>');
    $('#page').className = 'page home';
    $('#page').style.transform = '';
    $('#page').innerHTML = `
      <div class="kicker">New check · No. 0412</div>
      <h1>Whose story are we checking?</h1>
      <p class="lede">Pick who they are, then give Alibi one thing you know about them.</p>
      <div class="chips">${Object.entries(REASONS).map(([k, [ic, label]]) => `<span class="chip${state.reason === k ? ' on' : ''}" data-r="${k}">${i(ic)}${label}</span>`).join('')}</div>
      <div class="field" id="field"><div class="val" id="val" data-ph="Their nickname, email, phone number or a link"></div><span class="btn" id="go">Check<kbd>Enter</kbd></span></div>
      <div class="story" id="story">${i('pen')}<span id="storytxt">What did they tell you? Paste it here, Alibi checks it too.</span></div>
      <div class="hints"><span>${i('shield')}Public pages only</span><span>${i('saved')}Every find saved as proof</span><span>${i('pc')}Runs on this PC</span></div>`;
  }

  function dossierHead(c, no, tabs) {
    const [ic, label] = REASONS[c.reason];
    return `
      <div class="dhead">
        <div class="meta"><span class="no">No. ${no}</span><span class="tag">${i(ic)}${label}</span><span>${c.opened}</span>
          <span class="acts"><span class="btn ghost" id="follow">${i('lead')}Follow the lead</span><span class="btn ghost" id="pdf">${i('doc')}Report</span></span></div>
        <h2>${c.handle}</h2>
        <div class="sub">${c.sub}</div>
        <div class="said"><small>Their story</small><q>${c.said}</q></div>
      </div>
      ${tabs ? `<div class="tabs" id="tabs"><span class="on" data-t="verdict">Does it hold up?</span><span data-t="proof">Proof <em>${c.counts[0]}</em></span><span data-t="timeline">Timeline</span><span data-t="leads">Leads <em>${c.counts[1]}</em></span></div>` : ''}`;
  }

  const chips = (ids) => ids.map((e) => `<span class="ex" data-ex="${e}">${e}</span>`).join('');

  function verdictBlock(c, hidden) {
    const words = c.line.split(' ').map((w) => `<span class="w${hidden ? '' : ' in'}">${w}</span>`).join(' ');
    return `
      <section class="verdict" id="s-verdict">
        <div class="label">The verdict</div>
        <h3>${words}</h3>
        <div class="vline" id="vline" style="${hidden ? 'opacity:0' : ''}"><span class="pill ${c.v}"><i></i>${VERDICT[c.v]}</span><span>${c.facts}</span></div>
        <ol class="reasons">${c.reasons.map(([t, ex], k) => `<li class="${hidden ? 'hid' : ''}"><b>0${k + 1}</b><span>${t}${chips(ex)}</span></li>`).join('')}</ol>
      </section>
      ${c.plain ? `<section class="plain" id="s-plain" style="${hidden ? 'opacity:0' : ''}"><div class="label">In plain words</div><p>${c.plain}</p>
        <div class="note">${i('pc')}Written on this PC from the exhibits above. It can’t add facts that aren’t in them.</div></section>` : ''}`;
  }

  function proofBlock() {
    return `
      <section class="sec" id="s-proof">
        <h4>Proof</h4>
        <p class="intro">Every find is saved the moment Alibi sees it. If a page disappears, the snapshot and its hash stay here.</p>
        <div class="proof">
          <div class="ph"><span>No.</span><span>What</span><span>Saved, UTC</span><span>SHA-256</span><span>Copy</span></div>
          ${EXHIBITS.map(([n, what, url, t, h, w]) => `<div class="pr"><b>${n}</b><div class="what"><div>${what}</div><small>${url}</small></div><span class="t"><span class="dt">30 Oct </span>${t}</span><span class="h">${h}</span>
            <span class="w"${w === 'local' ? ' style="color:var(--dim)"' : ''}>${w === 'web' ? i('wayback') + 'Wayback' : i('saved') + 'Local'}</span></div>`).join('')}
          <div class="pf">${i('saved')}<span><b>9 exhibits</b> saved on this PC. 7 also archived on the Wayback Machine.</span></div>
        </div>
      </section>`;
  }

  function timelineBlock() {
    const W = 656; const day = (d) => ((d - 20) / 11) * W;
    const yr = (y) => ((y - 2019) / 7.83) * (W - 22);
    const ev = [
      [21, 'Shop goes live', 1], [23, 'elena.v.sells joins', 3], [24, 'sunny.deals24 joins', 2],
      [25, 'Leeds listing', 1], [26, 'gadget_hub_mk joins', 3], [27, 'Bristol listing', 2], [30, 'You checked', 1, 1],
    ];
    const stem = { 1: 24, 2: 76, 3: 128 };
    return `
      <section class="sec" id="s-timeline">
        <h4>Timeline</h4>
        <p class="intro">Every date Alibi found, on one line. Real people leave a long trail. This one starts last week.</p>
        <div class="tl">
          <div class="years"><div class="axis"></div>
            ${[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => `<span class="tick" style="left:${yr(y)}px">${y}</span>`).join('')}
            <span class="empty" style="left:${yr(2020.6)}px">Nothing at all before October 2026</span>
            <span class="cluster"></span></div>
          <div class="zoom">
            <svg width="${W}" height="18" style="position:absolute;left:0;top:-1px;overflow:visible"><path d="M${W - 22} 0 L${W} 0 L${W} 18 L0 18 Z" fill="rgba(233,181,90,0.06)"/><path d="M${W - 22} 0 L0 18 M${W} 0 L${W} 18" stroke="rgba(233,181,90,0.45)" stroke-dasharray="3 3"/></svg>
            <div class="call">Everything here is less than 30 days old.<small>20 to 31 October 2026</small></div>
            ${ev.map(([d, a, lv, you]) => `<div class="ev" style="left:${day(d)}px;bottom:0"><span class="lab">${a}<small>${d} Oct</small></span><span class="stem" style="height:${stem[lv]}px"></span><span class="dot${you ? ' you' : ''}"></span></div>`).join('')}
            <div class="days"></div>
          </div>
        </div>
      </section>`;
  }

  function leadCard(l, hidden) {
    const cls = ['lead', l.start ? 'start' : l.cut ? 'cut' : 'done', l.d2 ? 'd2' : '', hidden ? 'hid' : ''].join(' ');
    const head = `<div class="k"><b>${l.k}</b>${l.d ? `<span>${l.d}</span>` : ''}${l.cut ? `<span class="cutw">${i('cut')}Cut</span>` : ''}${l.ex ? `<span style="margin-left:auto">${chips(l.ex)}</span>` : ''}</div>`;
    const t = l.start ? `<div class="t">${l.t}</div>` : `<div class="t"><span class="from">${l.from}</span><span class="arrow">→</span><span>${l.to}</span></div>`;
    return `<div class="${cls}">${head}${t}<div class="why"><span>Why</span>${l.why}</div></div>`;
  }

  function leadsBlock(hidden) {
    return `
      <section class="sec" id="s-leads">
        <h4>Follow the lead</h4>
        <p class="intro">Alibi follows what it finds and says why it took each step. You choose how deep it goes and cut what you don’t need.</p>
        <div class="leadbar"><span>Depth</span><span class="seg"><span>1</span><span class="on">2</span><span>3</span></span><span>5 leads, 1 cut</span><span class="btn ghost">${i('lead')}Follow more</span></div>
        <div class="chain" id="chain"><div class="rail" id="rail"></div>${LEADS.map((l) => leadCard(l, hidden)).join('')}</div>
      </section>`;
  }

  function renderDossier(no, { scanning = false, hidden = false } = {}) {
    const c = CASE[no];
    state.newOn = false; state.selected = no; renderList();
    where(`<b>No. ${no}</b><span>${c.handle}</span>`);
    $('#page').className = 'page';
    $('#page').style.transform = '';
    if (scanning) {
      $('#page').innerHTML = dossierHead(c, no, false) + `
        <section class="scan" id="scan">
          <div class="line">Checking public sources<span class="n num" id="n">0 <span>/ 3,412</span></span></div>
          <div class="bar"><i id="bar"></i></div>
          <div class="stats">
            <div class="stat"><small>Found</small><b class="num" id="found">0</b></div>
            <div class="stat"><small>Saved as proof</small><b class="num a" id="saved">0</b></div>
            <div class="stat"><small>Elapsed</small><b class="num" id="time">0:00</b></div>
          </div>
          <div class="feed" id="feed"></div>
        </section>`;
      return;
    }
    $('#page').innerHTML = dossierHead(c, no, true) + verdictBlock(c, hidden) + (no === '0412' ? proofBlock() + timelineBlock() + leadsBlock(false) : '');
  }

  async function scan() {
    const total = 3412, dur = 3300, t0 = performance.now();
    let fi = 0, found = 0;
    const hitsAt = [0.08, 0.2, 0.3, 0.44, 0.55, 0.63, 0.74, 0.86, 0.93];
    const feed = $('#feed');
    const push = () => {
      const [m, name, sub, s, hit] = FEED[fi % FEED.length]; fi++;
      const r = document.createElement('div');
      r.className = `r${hit ? ' hit' : ''}`;
      r.innerHTML = `<span class="mono-tile">${m}</span><span class="t">${name}${sub ? `<span>${sub}</span>` : ''}</span><span class="s">${s}</span>`;
      feed.prepend(r);
      while (feed.children.length > 5) feed.lastChild.remove();
    };
    push();
    let nextFeed = 0.06;
    for (;;) {
      const p = Math.min(1, (performance.now() - t0) / dur);
      const e = 1 - Math.pow(1 - p, 1.6);
      $('#n').innerHTML = `${num(Math.round(total * e))} <span>/ 3,412</span>`;
      $('#bar').style.width = `${e * 100}%`;
      $('#time').textContent = `0:${String(Math.round(p * 31)).padStart(2, '0')}`;
      while (found < hitsAt.length && p >= hitsAt[found]) {
        found++; $('#found').textContent = found;
        const f = found; setTimeout(() => { $('#saved') && ($('#saved').textContent = f); }, 160);
      }
      if (p >= nextFeed) { push(); nextFeed += 0.075; }
      if (p >= 1) break;
      await sleep(50);
    }
    await sleep(450);
  }

  async function reveal(no) {
    const c = CASE[no];
    const page = $('#page');
    page.innerHTML = dossierHead(c, no, true) + verdictBlock(c, true) + proofBlock() + timelineBlock() + leadsBlock(false);
    const words = [...page.querySelectorAll('.verdict h3 .w')];
    await sleep(250);
    for (const w of words) { w.classList.add('in'); await sleep(85); }
    await sleep(250);
    $('#vline').style.transition = 'opacity 0.4s'; $('#vline').style.opacity = 1;
    await sleep(350);
    for (const li of page.querySelectorAll('.reasons li')) { li.classList.add('in'); await sleep(480); }
    const plain = $('#s-plain'); if (plain) { plain.style.transition = 'opacity 0.5s'; plain.style.opacity = 1; }
  }

  // Exhibit preview next to a chip, flipped above when there is no room below.
  const SHOTS = {
    E2: () => `<div class="web"><div class="bar2"><i></i><i></i><i></i><span>image hash search · 3 matches</span></div>
      <div class="cards">${[['sunny.deals24', 'since 24 Oct 2026'], ['gadget_hub_mk', 'since 26 Oct 2026'], ['elena.v.sells', 'since 23 Oct 2026']].map(([n, s]) => `<div class="card"><div class="avatar"></div><div class="who">${n}</div><div class="since">${s}</div><div class="hash">b3e1 0c7f</div></div>`).join('')}</div>
      <div class="caption">Same image hash on 3 profiles with different names.</div></div>`,
    E1: () => `<div class="web"><div class="bar2"><i></i><i></i><i></i><span>swapyard.market/u/sunny.deals24</span></div>
      <div style="display:flex;gap:10px;padding:14px 12px"><div class="avatar" style="width:54px;height:54px"></div><div style="font-size:10px;line-height:1.5"><b style="font-size:12px">sunny.deals24</b><br>Member since 24 Oct 2026<br>0 reviews · 2 listings</div></div>
      <div class="caption">Games console, boxed. Bank transfer only, I post same day.</div></div>`,
  };
  function hover(ex) {
    const pop = $('#pop');
    app.querySelectorAll('.ex').forEach((e) => e.classList.toggle('hover', e.dataset.ex === ex));
    if (!ex) { pop.classList.remove('in'); return; }
    const row = EXHIBITS.find((e) => e[0] === ex);
    pop.innerHTML = `<div class="shot">${(SHOTS[ex] || SHOTS.E1)()}</div>
      <div class="rows"><div class="h"><span>${ex}</span>${row[1]}</div>
      <div><span>Saved</span><span>30 Oct 2026, ${row[3]} UTC</span></div>
      <div><span>SHA-256</span><span>${row[4]}</span></div>
      <div><span>Wayback</span><span class="okc">archived</span></div></div>`;
    const chip = app.querySelector(`.reasons .ex[data-ex="${ex}"]`) || app.querySelector(`.ex[data-ex="${ex}"]`);
    const m = $('.main').getBoundingClientRect(), r = chip.getBoundingClientRect();
    const h = 300;
    let top = r.bottom - m.top + 8;
    if (top + h > m.height - 8) top = r.top - m.top - h - 8;
    pop.style.left = `${Math.min(r.left - m.left - 12, m.width - 330)}px`;
    pop.style.top = `${top}px`;
    requestAnimationFrame(() => pop.classList.add('in'));
  }

  function scrollTo(id, ms = 0) {
    const page = $('#page');
    const target = id ? $(`#s-${id}`) : null;
    const y = target ? target.offsetTop - 26 : 0;
    page.style.transition = ms ? `transform ${ms}ms cubic-bezier(0.3, 0.7, 0.2, 1)` : 'none';
    page.style.transform = `translateY(${-y}px)`;
    app.querySelectorAll('#tabs span').forEach((s) => s.classList.toggle('on', s.dataset.t === (id === 'plain' ? 'verdict' : id || 'verdict')));
    return sleep(ms);
  }

  async function leads() {
    const chain = $('#chain');
    chain.querySelectorAll('.lead').forEach((l) => l.classList.add('hid'));
    const rail = $('#rail');
    rail.style.transition = 'none'; rail.style.height = '0px'; void rail.offsetHeight; rail.style.transition = '';
    await sleep(300);
    const cards = [...chain.querySelectorAll('.lead')];
    const page = $('#page'), main = $('.main');
    for (const card of cards) {
      // Keep the newest lead in view.
      const over = card.getBoundingClientRect().bottom - main.getBoundingClientRect().bottom + 28;
      if (over > 0) {
        const y = -new DOMMatrix(getComputedStyle(page).transform).m42 + over;
        page.style.transition = 'transform 0.3s cubic-bezier(0.3, 0.7, 0.2, 1)';
        page.style.transform = `translateY(${-y}px)`;
        await sleep(260);
      }
      card.classList.add('in'); card.classList.remove('hid');
      rail.style.height = `${card.offsetTop + 18}px`;
      await sleep(card.classList.contains('start') ? 500 : 820);
    }
  }

  function report(open = true) {
    const veil = $('#veil');
    if (!open) { veil.classList.remove('in'); return; }
    const c = CASE['0412'];
    veil.innerHTML = `
      <div class="paperwrap"><div class="paper">
        <div class="ph1"><b>Alibi report</b><span>Case No. 0412</span></div>
        <h5>${c.handle}</h5><div class="s">A seller · prepared 30 Oct 2026, 14:07 UTC · 9 exhibits</div>
        <div class="pv"><b>${c.line}</b><span>Red flags</span></div>
        <ol>${c.reasons.map(([t, ex]) => `<li>${t.replace(/<\/?b>/g, '')} <code>${ex.join(' ')}</code></li>`).join('')}</ol>
        <div class="ptitle">Exhibits</div>
        <table>${EXHIBITS.map(([n, what, url, t, h]) => `<tr><td>${n}</td><td>${what}<br><span style="color:#8b8173">${url}</span></td><td>${t}</td><td>${h}</td></tr>`).join('')}</table>
        <div class="pfoot"><span>Made with Alibi 1.7.3 on this PC</span><span>Page 1 of 4</span></div>
      </div></div>
      <div class="rpanel">
        <h5>Save the report</h5>
        <p>A PDF with every exhibit, its snapshot and its hash. Give it to the marketplace, your bank or the police.</p>
        <div>
          <div class="opt">Snapshots of each page<span class="tog on"></span></div>
          <div class="opt">Case log, what was checked and when<span class="tog on"></span></div>
          <div class="opt">My own notes<span class="tog"></span></div>
        </div>
        <span class="btn">${i('doc')}Save PDF<kbd>Ctrl S</kbd></span>
        <div class="fine">4 pages · 2.1 MB</div>
      </div>`;
    requestAnimationFrame(() => veil.classList.add('in'));
  }

  function yourself() {
    state.newOn = false; state.selected = '0406'; renderList();
    where('<b>No. 0406</b><span>Myself</span>');
    $('#page').className = 'page';
    $('#page').style.transform = '';
    const todo = (done, x, sub, go) => `<div class="todo${done ? ' done' : ''}"><span class="box">${done ? i('check') : ''}</span><span class="x">${x}<small>${sub}</small></span><span class="go">${go}</span></div>`;
    $('#page').innerHTML = `
      <div class="dhead">
        <div class="meta"><span class="no">No. 0406</span><span class="tag">${i('myself')}Myself</span><span>Opened 19 Oct 2026</span></div>
        <h2>alex.morgan</h2>
        <div class="sub">Checked with your nickname, <span class="mono">alex.m@postbox.example</span> and <span class="mono">+44 7700 900218</span></div>
      </div>
      <section class="verdict" style="margin-top:24px">
        <h3 style="font-size:38px">Here’s what anyone can find about you.</h3>
        <div class="prog"><span class="mono" style="color:var(--amber)">3 of 9 done</span><span class="bar"><i></i></span><span>Last checked today</span></div>
      </section>
      <div class="grp"><div class="gh"><b>People-search sites</b>They sell your name, age and town. Each one has an opt-out.</div>
        ${todo(1, 'PeopleLedger', 'Showed your name, age and town', 'Removed 26 Oct')}
        ${todo(0, 'Namecrate', 'Shows your name, age and relatives', `Opt out ${i('out')}`)}
        ${todo(0, 'FindFolks', 'Shows your name and phone number', `Opt out ${i('out')}`)}
        ${todo(1, 'TraceTree', 'Showed your name and town', 'Removed 26 Oct')}</div>
      <div class="grp"><div class="gh"><b>Old accounts</b>Still public, still under your name.</div>
        ${todo(0, 'A forum account from 2014', 'Uses your old email address', `Delete it ${i('out')}`)}
        ${todo(1, 'A photo site you last used in 2017', '38 public photos', 'Deleted 27 Oct')}
        ${todo(0, 'A public wishlist', 'Shows your full name', `Make it private ${i('out')}`)}</div>
      <div class="grp"><div class="gh"><b>Leaks</b>Checked with your own HIBP key.</div>
        ${todo(0, 'Your email is in 2 known breaches', '2019 and 2023', `Change those passwords ${i('out')}`)}</div>
      <div class="watch"><b>Watch me</b><small>Tell me when something new about me shows up. Ends 30 Jan 2027.</small><span class="tog on"></span></div>`;
  }

  shell();
  renderHome();
  window.AlibiReady = true;

  window.alibi = {
    home: renderHome,
    pick(r) { state.reason = r; app.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.r === r)); },
    focus(which) {
      $('#field').classList.toggle('focus', which === 'field');
      $('#story').classList.toggle('focus', which === 'story');
      $('#val').classList.toggle('typing', which === 'field');
    },
    async type(text, ms = 70) {
      const v = $('#val');
      for (let k = 1; k <= text.length; k++) { v.textContent = text.slice(0, k); await sleep(ms + ((k * 13) % 40)); }
    },
    paste(text) { $('#storytxt').outerHTML = `<span class="txt">${text}</span>`; },
    async press() { const b = $('#go'); b.classList.add('press'); await sleep(140); b.classList.remove('press'); },
    async run(no = '0412') {
      state.list = [NEW, ...LIST]; state.selected = no; state.newOn = false;
      renderList(no);
      renderDossier(no, { scanning: true });
      await sleep(350);
      await scan();
      await reveal(no);
    },
    verdict(no = '0412') {
      if (no === '0412' && !state.list.includes(NEW)) state.list = [NEW, ...LIST];
      renderDossier(no);
    },
    hover, scrollTo, leads, report, yourself,
    // Narrow layout, used for the close-up images in the README.
    compact(on) { app.classList.toggle('compact', on); },
    at(sel) { const r = app.querySelector(sel).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; },
  };
})();
