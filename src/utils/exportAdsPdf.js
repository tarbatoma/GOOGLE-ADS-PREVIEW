// exportAdsPdf.js
// Generează un PDF A4 cu anunțurile create.
// Fiecare bloc (antet, card de anunț) e construit ca HTML ascuns, fotografiat cu
// html2canvas și așezat în PDF cu jsPDF. Așa diacriticele și orice alfabet apar corect,
// iar împărțirea pe pagini se face după înălțimea reală a fiecărui card.
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import logoUrl from '../assets/logo.png';

const PAGE_W = 210;          // mm (A4)
const PAGE_H = 297;
const MARGIN = 12;
const CONTENT_W = PAGE_W - MARGIN * 2;
const RENDER_W = 720;        // lățimea în px la care desenăm blocurile
const PX_TO_MM = CONTENT_W / RENDER_W;
const GAP = 5;               // spațiu între carduri, mm
const FOOTER_H = 10;

const BRAND = '#1f2631';
const SLATE = '#5a6b78';
const LIMITS = { h: 30, d: 90 };

// ---------- mici ajutoare DOM (textContent = text străin sigur) ----------
function el(tag, style = {}, text) {
  const node = document.createElement(tag);
  Object.assign(node.style, style);
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function append(parent, ...children) {
  children.filter(Boolean).forEach(c => parent.appendChild(c));
  return parent;
}

function formatDate(d) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

function displayUrl(link) {
  return String(link || '').replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

// ---------- antetul raportului (doar pe prima pagină) ----------
function buildHeader({ ads, title, spreadsheetLink, date }) {
  const wrap = el('div', {
    width: `${RENDER_W}px`,
    background: BRAND,
    borderRadius: '14px',
    padding: '22px 28px',
    boxSizing: 'border-box',
    color: '#fff',
    fontFamily: 'Arial, Helvetica, sans-serif',
  });

  const top = el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' });
  const logo = el('img', { height: '46px', width: 'auto', display: 'block' });
  logo.src = logoUrl;

  const right = el('div', { textAlign: 'right' });
  append(right,
    el('div', { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#9fb0bd' }, 'Ads Preview Report'),
    el('div', { fontSize: '13px', marginTop: '6px', color: '#d7dee4' }, formatDate(date)),
  );
  append(top, logo, right);

  const h = el('div', { fontSize: '26px', fontWeight: 'bold', margin: '16px 0 4px', lineHeight: '1.2' }, title);
  const site = displayUrl(ads[0]?.link);
  const sub = el('div', { fontSize: '14px', color: '#c3ccd4' },
    `${ads.length} search ad${ads.length === 1 ? '' : 's'}${site ? ` · ${site}` : ''}`);

  // statistici rapide
  const stats = el('div', { display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' });
  const hasCall = ads.some(a => a.phoneNumber);
  const hasLinks = ads.some(a => a.sitelinks && a.sitelinks.length);
  const hasH3 = ads.some(a => a.h3);
  [
    ['Ads', ads.length],
    ['Headline 3', hasH3 ? 'Yes' : 'No'],
    ['Call asset', hasCall ? 'Yes' : 'No'],
    ['Sitelinks', hasLinks ? 'Yes' : 'No'],
  ].forEach(([label, value]) => {
    const box = el('div', {
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.14)',
      borderRadius: '10px',
      padding: '8px 14px',
      minWidth: '110px',
    });
    append(box,
      el('div', { fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9fb0bd' }, label),
      el('div', { fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }, value),
    );
    stats.appendChild(box);
  });

  append(wrap, top, h, sub, stats);

  if (spreadsheetLink) {
    const sl = el('div', { marginTop: '12px', fontSize: '12px', color: '#c3ccd4', wordBreak: 'break-all' });
    append(sl, el('span', { fontWeight: 'bold', color: '#fff' }, 'Ad copy spreadsheet: '), el('span', {}, spreadsheetLink));
    wrap.appendChild(sl);
  }
  return wrap;
}

// ---------- un rând din tabelul de texte (cu numărul de caractere) ----------
function buildTextRow(label, text, limit) {
  const len = String(text || '').length;
  const over = len > limit;
  const row = el('div', {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '4px 0',
    borderTop: '1px solid #edf0f2',
    fontSize: '11.5px',
    lineHeight: '1.4',
  });
  append(row,
    el('div', { width: '92px', flexShrink: '0', color: SLATE, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', paddingTop: '2px' }, label),
    el('div', { flex: '1', color: '#202124', wordBreak: 'break-word' }, text),
    el('div', {
      flexShrink: '0',
      fontSize: '11px',
      fontWeight: 'bold',
      color: over ? '#c5221f' : '#188038',
      background: over ? '#fce8e6' : '#e6f4ea',
      borderRadius: '20px',
      padding: '2px 8px',
    }, `${len}/${limit}`),
  );
  return row;
}

// ---------- cardul unui anunț ----------
function buildAdCard(ad, index, total) {
  const card = el('div', {
    width: `${RENDER_W}px`,
    background: '#fff',
    border: '1px solid #dfe3e7',
    borderRadius: '14px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    fontFamily: 'Arial, Helvetica, sans-serif',
  });

  // bara de sus: „AD 01 / 10”
  const bar = el('div', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '7px 20px',
    background: '#f4f6f8',
    borderBottom: '1px solid #e6e9ec',
  });
  const num = String(index + 1).padStart(2, '0');
  append(bar,
    el('div', { fontSize: '12px', fontWeight: 'bold', color: BRAND, letterSpacing: '1.5px' }, `AD ${num}`),
    el('div', { fontSize: '11px', color: '#80868b' }, `${index + 1} of ${total} · Search · Desktop`),
  );

  // previzualizarea în stil Google
  const preview = el('div', { padding: '12px 22px 12px' });
  append(preview, el('div', { fontSize: '12px', fontWeight: 'bold', color: '#202124', marginBottom: '6px' }, 'Sponsored'));

  const siteRow = el('div', { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' });
  const fav = el('div', {
    width: '26px', height: '26px', borderRadius: '50%', background: '#f1f3f4',
    border: '1px solid #e0e3e6', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 'bold', color: SLATE,
  }, (displayUrl(ad.link)[0] || 'G').toUpperCase());
  const siteText = el('div', {});
  append(siteText,
    el('div', { fontSize: '14px', color: '#202124' }, displayUrl(ad.link).split('/')[0]),
    el('div', { fontSize: '12px', color: '#4d5156' }, displayUrl(ad.link)),
  );
  append(siteRow, fav, siteText);

  const headline = el('div', {
    fontSize: '19px', color: '#1a0dab', lineHeight: '1.3', margin: '4px 0 4px', wordBreak: 'break-word',
  }, [ad.h1, ad.h2, ad.h3].filter(Boolean).join(' | '));

  const desc = el('div', { fontSize: '13.5px', color: '#4d5156', lineHeight: '1.5', wordBreak: 'break-word' },
    [ad.d1, ad.d2].filter(Boolean).join(' '));

  append(preview, siteRow, headline, desc);

  if (ad.phoneNumber) {
    append(preview, el('div', {
      marginTop: '8px', fontSize: '13.5px', color: '#1a0dab',
    }, `📞 Call ${ad.phoneNumber}`));
  }

  if (ad.sitelinks && ad.sitelinks.length) {
    const links = el('div', { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' });
    ad.sitelinks.forEach(sl => {
      links.appendChild(el('div', {
        fontSize: '12.5px', color: '#1a0dab', background: '#f1f3f4', borderRadius: '20px', padding: '4px 12px',
      }, sl.title));
    });
    preview.appendChild(links);
  }

  // tabelul cu texte și caractere
  const details = el('div', { padding: '4px 22px 8px', background: '#fbfcfd', borderTop: '1px solid #e6e9ec' });
  [
    ['Headline 1', ad.h1, LIMITS.h],
    ['Headline 2', ad.h2, LIMITS.h],
    ['Headline 3', ad.h3, LIMITS.h],
    ['Description 1', ad.d1, LIMITS.d],
    ['Description 2', ad.d2, LIMITS.d],
  ].forEach(([label, text, limit], i) => {
    if (!text) return;
    const row = buildTextRow(label, text, limit);
    if (i === 0) row.style.borderTop = 'none';
    details.appendChild(row);
  });

  append(card, bar, preview, details);
  return card;
}

// ---------- randare bloc -> imagine ----------
async function snapshot(node, host) {
  host.appendChild(node);
  // așteptăm încărcarea imaginilor (logo)
  const imgs = Array.from(node.querySelectorAll('img'));
  await Promise.all(imgs.map(img => (img.complete ? null : new Promise(r => { img.onload = r; img.onerror = r; }))));
  const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false });
  host.removeChild(node);
  return {
    // JPEG ține fișierul mic (câteva sute de KB pentru 10 anunțuri)
    data: canvas.toDataURL('image/jpeg', 0.92),
    hMm: (canvas.height / 2) * PX_TO_MM,
  };
}

function drawPageChrome(pdf, pageNo, totalPages, title) {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(128, 134, 139);
  pdf.setDrawColor(223, 227, 231);
  pdf.line(MARGIN, PAGE_H - FOOTER_H, PAGE_W - MARGIN, PAGE_H - FOOTER_H);
  pdf.text('Noble House Media Group  ·  Google Ads Preview', MARGIN, PAGE_H - FOOTER_H + 5);
  pdf.text(`Page ${pageNo} / ${totalPages}`, PAGE_W - MARGIN, PAGE_H - FOOTER_H + 5, { align: 'right' });
}

/**
 * Exportă anunțurile într-un PDF și pornește descărcarea.
 * @param {Array} ads  anunțurile {h1,h2,h3,d1,d2,link,phoneNumber?,sitelinks?}
 * @param {Object} opts { title, spreadsheetLink, fileName }
 */
export async function exportAdsToPdf(ads, opts = {}) {
  if (!ads || ads.length === 0) return;
  const date = new Date();
  const title = opts.title || 'Google Search Ads Preview';

  const host = el('div', {
    position: 'fixed', left: '-10000px', top: '0', width: `${RENDER_W}px`, pointerEvents: 'none',
  });
  document.body.appendChild(host);

  try {
    const header = await snapshot(buildHeader({ ads, title, spreadsheetLink: opts.spreadsheetLink, date }), host);
    const cards = [];
    for (let i = 0; i < ads.length; i++) {
      cards.push(await snapshot(buildAdCard(ads[i], i, ads.length), host));
    }

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const bottom = PAGE_H - FOOTER_H - 4;
    let y = MARGIN;

    pdf.addImage(header.data, 'JPEG', MARGIN, y, CONTENT_W, header.hMm);
    y += header.hMm + GAP + 2;

    cards.forEach(card => {
      if (y + card.hMm > bottom && y > MARGIN) {
        pdf.addPage();
        y = MARGIN;
      }
      pdf.addImage(card.data, 'JPEG', MARGIN, y, CONTENT_W, card.hMm);
      y += card.hMm + GAP;
    });

    const pages = pdf.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      pdf.setPage(p);
      drawPageChrome(pdf, p, pages, title);
    }

    const stamp = date.toISOString().slice(0, 10);
    pdf.save(opts.fileName || `google-ads-preview-${stamp}.pdf`);
  } finally {
    document.body.removeChild(host);
  }
}
