// exportAdsPdf.js
// Generează un PDF A4 doar cu anunțurile, numerotate 1, 2, 3...
// Fiecare card e construit ca HTML ascuns, fotografiat cu html2canvas și așezat
// în PDF cu jsPDF. Așa diacriticele și orice alfabet apar corect, iar împărțirea
// pe pagini se face după înălțimea reală a fiecărui card (un card nu se rupe).
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PAGE_W = 210;          // mm (A4)
const PAGE_H = 297;
const MARGIN = 12;
const CONTENT_W = PAGE_W - MARGIN * 2;
const RENDER_W = 720;        // lățimea în px la care desenăm cardurile
const PX_TO_MM = CONTENT_W / RENDER_W;
const GAP = 5;               // spațiu între carduri, mm
const FOOTER_H = 8;

const BRAND = '#1f2631';

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

function displayUrl(link) {
  return String(link || '').replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

// ---------- cardul unui anunț: număr în stânga, anunțul în dreapta ----------
function buildAdCard(ad, index) {
  const card = el('div', {
    width: `${RENDER_W}px`,
    background: '#fff',
    border: '1px solid #dfe3e7',
    borderRadius: '14px',
    boxSizing: 'border-box',
    padding: '16px 22px 16px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    fontFamily: 'Arial, Helvetica, sans-serif',
  });

  const badge = el('div', {
    width: '34px', height: '34px', flexShrink: '0', borderRadius: '50%',
    background: BRAND, color: '#fff', fontSize: '15px', fontWeight: 'bold',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }, index + 1);

  // anunțul în stil Google
  const preview = el('div', { flex: '1', minWidth: '0' });
  append(preview, el('div', { fontSize: '12px', fontWeight: 'bold', color: '#202124', marginBottom: '6px' }, 'Sponsored'));

  const siteRow = el('div', { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' });
  const fav = el('div', {
    width: '26px', height: '26px', borderRadius: '50%', background: '#f1f3f4',
    border: '1px solid #e0e3e6', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 'bold', color: '#5a6b78',
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

  append(card, badge, preview);
  return card;
}

// ---------- randare card -> imagine ----------
async function snapshot(node, host) {
  host.appendChild(node);
  const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff', logging: false });
  host.removeChild(node);
  return {
    // JPEG ține fișierul mic
    data: canvas.toDataURL('image/jpeg', 0.92),
    hMm: (canvas.height / 2) * PX_TO_MM,
  };
}

/**
 * Exportă anunțurile într-un PDF și pornește descărcarea.
 * @param {Array} ads  anunțurile {h1,h2,h3,d1,d2,link,phoneNumber?,sitelinks?}
 * @param {Object} opts { fileName }
 */
export async function exportAdsToPdf(ads, opts = {}) {
  if (!ads || ads.length === 0) return;

  const host = el('div', {
    position: 'fixed', left: '-10000px', top: '0', width: `${RENDER_W}px`, pointerEvents: 'none',
  });
  document.body.appendChild(host);

  try {
    const cards = [];
    for (let i = 0; i < ads.length; i++) {
      cards.push(await snapshot(buildAdCard(ads[i], i), host));
    }

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const bottom = PAGE_H - FOOTER_H - 4;
    let y = MARGIN;

    cards.forEach(card => {
      if (y + card.hMm > bottom && y > MARGIN) {
        pdf.addPage();
        y = MARGIN;
      }
      pdf.addImage(card.data, 'JPEG', MARGIN, y, CONTENT_W, card.hMm);
      y += card.hMm + GAP;
    });

    // doar numărul paginii, discret, jos la mijloc (când sunt mai multe pagini)
    const pages = pdf.getNumberOfPages();
    if (pages > 1) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 155, 160);
      for (let p = 1; p <= pages; p++) {
        pdf.setPage(p);
        pdf.text(`${p} / ${pages}`, PAGE_W / 2, PAGE_H - FOOTER_H + 3, { align: 'center' });
      }
    }

    const stamp = new Date().toISOString().slice(0, 10);
    pdf.save(opts.fileName || `google-ads-${stamp}.pdf`);
  } finally {
    document.body.removeChild(host);
  }
}
