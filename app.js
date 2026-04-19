/* ════════════════════════════════════════════════════════════════
   KiranaCredit AI · Hackathon-Winning Prototype Logic
   Implements all 6 innovations from PS4C + 5 Core Innovations Doc
   ════════════════════════════════════════════════════════════════ */

// ═══════════════════════ ROUTING / NAV ═══════════════════════
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-pill').forEach(p => p.classList.remove('active'));
  const screen = document.getElementById('screen-' + name);
  if (screen) screen.classList.add('active');
  const navPill = document.querySelector(`.nav-pill[data-screen="${name}"]`);
  if (navPill) navPill.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-screen]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = el.dataset.screen;
    showScreen(target);
    if (target === 'portfolio') {
      // Always re-render so charts pick up theme changes; renderPortfolio destroys old instances first
      setTimeout(renderPortfolio, 100);
      window._portfolioRendered = true;
    }
    if (target === 'wizard' && !window._wizardMapRendered) {
      setTimeout(initWizardMap, 150);
      window._wizardMapRendered = true;
    }
  });
});

// ═══════════════════════ THEME TOGGLE ═══════════════════════
// Two themes: 'paper' (default editorial light) and 'dark' (terminal warm)
const themeBtn = document.getElementById('theme_toggle');
function applyTheme(t) {
  document.body.dataset.theme = t;
  themeBtn.innerHTML = t === 'dark'
    ? '<svg class="icon"><use href="#i-sun"/></svg>'
    : '<svg class="icon"><use href="#i-moon"/></svg>';
  try { localStorage.setItem('kc_theme', t); } catch (e) {}
  if (window._portfolioRendered) { setTimeout(renderPortfolio, 50); }
}
themeBtn.addEventListener('click', () => {
  applyTheme(document.body.dataset.theme === 'dark' ? 'paper' : 'dark');
});
try {
  const saved = localStorage.getItem('kc_theme');
  if (saved) applyTheme(saved);
  else applyTheme('paper');
} catch (e) { applyTheme('paper'); }

// ═══════════════════════ SAMPLE PERSONAS ═══════════════════════
const SAMPLES = {
  prime: {
    store_id: 'KR-2026-MH-PRIME', store_name: 'Mahalaxmi Stores',
    owner_name: 'Vikram Patel', lat: 19.0760, lng: 72.8777, city_tier: '1',
    upi_daily: 28000, cash_ratio: 30, order_size: 35000, order_freq: 2,
    reviews_pm: 28, margin: 22, dpo: 9, receivables: 1.8,
    location: { tier: 'Prime', demographics: 1.40, competition: 0.95, traffic: 1.65, tierMult: 1.45 },
    visual: { sdi: 0.78, sku: 9.5, invValue: 95000, refill: 'Strong', infra: 0.82, size: 'Large', mix: 'Balanced' },
    geo: { density: 'high', road: 'Main arterial', poi: 88, comp: 'moderate', mix: 'Mixed Use', activity: 'growing', footfall: 85 },
    fraud: { clustering: 0.18, concentration: 0.42, discipline: 0.20, ratio: 0.12, festival: 0.15 },
    confComp: { img: 0.91, sig: 0.88, peer: 0.85, feat: 0.88 },
    peerN: 412, peerPct: 78
  },
  good: {
    store_id: 'KR-2026-MH-00847', store_name: 'Sharma General Store',
    owner_name: 'Rajesh Sharma', lat: 18.5204, lng: 73.8567, city_tier: '2',
    upi_daily: 8000, cash_ratio: 40, order_size: 15000, order_freq: 3,
    reviews_pm: 12, margin: 18, dpo: 8, receivables: 2.5,
    location: { tier: 'Good', demographics: 1.10, competition: 0.99, traffic: 1.30, tierMult: 1.0 },
    visual: { sdi: 0.71, sku: 8.2, invValue: 55000, refill: 'Moderate', infra: 0.65, size: 'Medium', mix: 'Balanced' },
    geo: { density: 'high', road: 'Secondary market', poi: 72, comp: 'moderate', mix: 'Mixed Use', activity: 'stable', footfall: 67 },
    fraud: { clustering: 0.22, concentration: 0.50, discipline: 0.30, ratio: 0.18, festival: 0.20 },
    confComp: { img: 0.81, sig: 0.72, peer: 0.78, feat: 0.65 },
    peerN: 284, peerPct: 62
  },
  average: {
    store_id: 'KR-2026-UP-00321', store_name: 'Ganesh Kirana',
    owner_name: 'Suresh Yadav', lat: 26.8467, lng: 80.9462, city_tier: '3',
    upi_daily: 4500, cash_ratio: 55, order_size: 9000, order_freq: 4,
    reviews_pm: 6, margin: 16, dpo: 10, receivables: 3.0,
    location: { tier: 'Average', demographics: 0.90, competition: 1.05, traffic: 0.95, tierMult: 0.75 },
    visual: { sdi: 0.55, sku: 6.0, invValue: 32000, refill: 'Moderate', infra: 0.48, size: 'Medium', mix: 'Staple-dominant' },
    geo: { density: 'medium', road: 'Residential street', poi: 45, comp: 'moderate', mix: 'Predominantly Residential', activity: 'stable', footfall: 48 },
    fraud: { clustering: 0.28, concentration: 0.48, discipline: 0.40, ratio: 0.22, festival: 0.25 },
    confComp: { img: 0.74, sig: 0.68, peer: 0.70, feat: 0.62 },
    peerN: 156, peerPct: 51
  },
  weak: {
    store_id: 'KR-2026-RJ-RURAL', store_name: 'Kisan Stores',
    owner_name: 'Mohan Lal', lat: 26.9124, lng: 75.7873, city_tier: 'rural',
    upi_daily: 2200, cash_ratio: 65, order_size: 6000, order_freq: 5,
    reviews_pm: 3, margin: 14, dpo: 12, receivables: 4.5,
    location: { tier: 'Weak', demographics: 0.65, competition: 1.10, traffic: 0.75, tierMult: 0.50 },
    visual: { sdi: 0.42, sku: 4.5, invValue: 18000, refill: 'Weak', infra: 0.32, size: 'Small', mix: 'Staple-dominant' },
    geo: { density: 'low', road: 'Internal lane', poi: 22, comp: 'low', mix: 'Predominantly Residential', activity: 'declining', footfall: 28 },
    fraud: { clustering: 0.30, concentration: 0.45, discipline: 0.45, ratio: 0.25, festival: 0.30 },
    confComp: { img: 0.68, sig: 0.62, peer: 0.55, feat: 0.50 },
    peerN: 88, peerPct: 32
  },
  fraud: {
    store_id: 'KR-2026-DL-SUSPECT', store_name: 'Suspicious Mart',
    owner_name: 'Unknown', lat: 28.6139, lng: 77.2090, city_tier: '1',
    upi_daily: 12000, cash_ratio: 35, order_size: 32000, order_freq: 2,
    reviews_pm: 4, margin: 18, dpo: 1, receivables: 1.0,
    location: { tier: 'Good', demographics: 1.05, competition: 1.00, traffic: 1.20, tierMult: 1.0 },
    visual: { sdi: 0.93, sku: 7.5, invValue: 180000, refill: 'Absent', infra: 0.55, size: 'Medium', mix: 'FMCG-dominant' },
    geo: { density: 'high', road: 'Secondary market', poi: 65, comp: 'moderate', mix: 'Mixed Use', activity: 'stable', footfall: 60 },
    fraud: { clustering: 0.85, concentration: 0.78, discipline: 0.92, ratio: 0.65, festival: 0.70 },
    confComp: { img: 0.78, sig: 0.32, peer: 0.28, feat: 0.55 },
    peerN: 284, peerPct: 12
  }
};

let currentSample = SAMPLES.good;

// ═══════════════════════ HELPERS ═══════════════════════
const fmtINR = n => '₹' + Math.round(n).toLocaleString('en-IN');
const fmtINRk = n => {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K';
  return '₹' + Math.round(n);
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ═══════════════════════ WIZARD STEP NAV ═══════════════════════
let currentStep = 1;
const prevBtn = document.getElementById('prev_btn');
const nextBtn = document.getElementById('next_btn');

function setStep(n) {
  currentStep = n;
  document.querySelectorAll('.wstep').forEach(el => el.classList.toggle('active', +el.dataset.step === n));
  document.querySelectorAll('.track-step').forEach(el => {
    const step = +el.dataset.step;
    el.classList.toggle('active', step === n);
    el.classList.toggle('done', step < n);
  });
  document.querySelectorAll('.track-line').forEach((el, i) => el.classList.toggle('done', i + 1 < n));
  prevBtn.disabled = n === 1;
  nextBtn.textContent = n === 4 ? 'Run Pipeline →' : 'Next →';

  if (n === 4) updateReviewSummary();
}

prevBtn.addEventListener('click', () => { if (currentStep > 1) setStep(currentStep - 1); });
nextBtn.addEventListener('click', () => {
  if (currentStep < 4) setStep(currentStep + 1);
  else runPipeline();
});

function updateReviewSummary() {
  document.getElementById('rv_name').textContent = document.getElementById('store_name').value;
  document.getElementById('rv_id').textContent = document.getElementById('store_id').value;
  document.getElementById('rv_owner').textContent = document.getElementById('owner_name').value;
  document.getElementById('rv_gps').textContent = `${document.getElementById('lat').value}, ${document.getElementById('lng').value}`;
}

// ═══════════════════════ SAMPLE LOADERS ═══════════════════════
document.querySelectorAll('.chip[data-sample]').forEach(chip => {
  chip.addEventListener('click', () => {
    const s = SAMPLES[chip.dataset.sample];
    if (!s) return;
    currentSample = s;
    document.querySelectorAll('.chip[data-sample]').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    document.getElementById('store_id').value = s.store_id;
    document.getElementById('store_name').value = s.store_name;
    document.getElementById('owner_name').value = s.owner_name;
    document.getElementById('lat').value = s.lat;
    document.getElementById('lng').value = s.lng;
    document.getElementById('city_tier').value = s.city_tier;
    document.getElementById('upi_daily').value = s.upi_daily;
    document.getElementById('cash_ratio').value = s.cash_ratio;
    document.getElementById('order_size').value = s.order_size;
    document.getElementById('order_freq').value = s.order_freq;
    document.getElementById('reviews_pm').value = s.reviews_pm;
    document.getElementById('margin').value = s.margin;
    document.getElementById('dpo').value = s.dpo;
    document.getElementById('receivables').value = s.receivables;

    // mark photo zones as captured (simulated)
    document.querySelectorAll('.photo-zone').forEach(z => z.classList.add('captured'));

    // visual feedback
    chip.style.transform = 'scale(0.95)';
    setTimeout(() => chip.style.transform = '', 150);

    // update wizard map
    if (window._wizardMap) {
      window._wizardMap.setView([s.lat, s.lng], 15);
      if (window._wizardMarker) window._wizardMap.removeLayer(window._wizardMarker);
      if (window._wizardCircle) window._wizardMap.removeLayer(window._wizardCircle);
      window._wizardMarker = L.marker([s.lat, s.lng]).addTo(window._wizardMap);
      window._wizardCircle = L.circle([s.lat, s.lng], { radius: 500, color: '#6366f1', fillOpacity: 0.1 }).addTo(window._wizardMap);
    }
  });
});

// Photo zone click → mark captured
document.querySelectorAll('.photo-zone').forEach(zone => {
  zone.addEventListener('click', () => zone.classList.toggle('captured'));
});

// ═══════════════════════ MAP INIT ═══════════════════════
function initWizardMap() {
  const mapEl = document.getElementById('wizard_map');
  if (!mapEl || window._wizardMap) return;
  const lat = parseFloat(document.getElementById('lat').value) || 18.5204;
  const lng = parseFloat(document.getElementById('lng').value) || 73.8567;
  window._wizardMap = L.map(mapEl, { zoomControl: false }).setView([lat, lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OSM' }).addTo(window._wizardMap);
  window._wizardMarker = L.marker([lat, lng]).addTo(window._wizardMap);
  window._wizardCircle = L.circle([lat, lng], { radius: 500, color: '#6366f1', fillOpacity: 0.1 }).addTo(window._wizardMap);
}

function initResultMap(lat, lng) {
  const mapEl = document.getElementById('result_map');
  if (!mapEl) return;
  if (window._resultMap) { window._resultMap.remove(); }
  window._resultMap = L.map(mapEl).setView([lat, lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OSM' }).addTo(window._resultMap);

  // store marker (purple pin)
  const storeIcon = L.divIcon({
    html: '<div style="background:#8b5cf6;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 4px 10px rgba(139,92,246,0.5);"></div>',
    iconSize: [24, 24], className: ''
  });
  L.marker([lat, lng], { icon: storeIcon }).addTo(window._resultMap).bindPopup('<b>Subject Store</b>');

  // catchment circle
  L.circle([lat, lng], { radius: 500, color: '#6366f1', fillOpacity: 0.08 }).addTo(window._resultMap);

  // simulated competitor pins
  const offsets = [[0.002, 0.003], [-0.001, 0.002], [0.0015, -0.0025], [-0.002, -0.001], [0.003, 0.0005]];
  const compIcon = L.divIcon({
    html: '<div style="background:#475569;width:14px;height:14px;border-radius:50%;border:2px solid white;"></div>',
    iconSize: [14, 14], className: ''
  });
  offsets.forEach((off, i) => {
    L.marker([lat + off[0], lng + off[1]], { icon: compIcon }).addTo(window._resultMap).bindPopup(`Competitor ${i + 1}`);
  });
}

// ═══════════════════════ INNOVATION 1: MULTI-SIGNAL REVENUE ═══════════════════════
function innovation1(inputs) {
  const upiSignal = inputs.upi_daily * (1 + inputs.cash_ratio / 100);
  const orderSignal = inputs.order_size / inputs.order_freq;
  const reviewScore = Math.min(1, inputs.reviews_pm / 30);
  const googleMult = 0.8 + reviewScore * 0.3;
  const baseEstimate = (upiSignal + orderSignal) / 2;
  const googleSignal = baseEstimate * googleMult;

  const signals = [upiSignal, orderSignal, googleSignal];
  const mean = signals.reduce((a, b) => a + b, 0) / 3;
  const maxDev = Math.max(...signals.map(s => Math.abs(s - mean) / mean));
  let agreement, conf;
  if (maxDev < 0.15) { agreement = 'High'; conf = 0.85; }
  else if (maxDev < 0.30) { agreement = 'Medium'; conf = 0.70; }
  else { agreement = 'Low'; conf = 0.55; }

  const fused = upiSignal * 0.40 + orderSignal * 0.40 + googleSignal * 0.20;

  return {
    upi: upiSignal, order: orderSignal, google: googleSignal,
    daily: fused,
    range: { low: fused * 0.78, mid: fused, high: fused * 1.25 },
    agreement, agreementPct: ((1 - maxDev) * 100).toFixed(0),
    confidence: conf
  };
}

// ═══════════════════════ INNOVATION 2: CASH CONVERSION CYCLE ═══════════════════════
function innovation2(inputs, dailyRevenue) {
  const dailyCOGS = Math.max(dailyRevenue * (1 - inputs.margin / 100), 1);
  const avgInventory = (inputs.order_size / 2) + 3000;
  const inventoryDays = avgInventory / dailyCOGS;
  const receivablesDays = parseFloat(inputs.receivables);
  const payablesDays = parseFloat(inputs.dpo);
  const ccc = inventoryDays + receivablesDays - payablesDays;

  const monthlyRev = dailyRevenue * 28;
  let loanCategory, loanLow, loanHigh, risk, explain, tenure;

  if (ccc <= 0) {
    loanCategory = 'Supplier-funded';
    loanLow = monthlyRev * 0.35; loanHigh = monthlyRev * 0.50;
    risk = 'Low–Medium'; tenure = '24–36 months';
    explain = 'Negative CCC — store receives cash before paying suppliers. Strongest position; standard EMI safe.';
  } else if (ccc <= 5) {
    loanCategory = 'Balanced';
    loanLow = monthlyRev * 0.25; loanHigh = monthlyRev * 0.35;
    risk = 'Medium'; tenure = '18–30 months';
    explain = 'Balanced cycle — healthy working capital, supports standard EMI structure.';
  } else if (ccc <= 15) {
    loanCategory = 'Capital-intensive';
    loanLow = monthlyRev * 0.15; loanHigh = monthlyRev * 0.25;
    risk = 'Medium–High'; tenure = '12–24 months';
    explain = 'Capital-intensive — recommend daily/weekly EMI collection via UPI auto-debit.';
  } else {
    loanCategory = 'High risk';
    loanLow = monthlyRev * 0.05; loanHigh = monthlyRev * 0.15;
    risk = 'High'; tenure = '6–12 months';
    explain = 'Long CCC > 15 days — cash trapped. Require supplier co-guarantee or inventory lien.';
  }

  return { inventoryDays, receivablesDays, payablesDays, ccc, loanCategory, loanLow, loanHigh, risk, tenure, explain };
}

// ═══════════════════════ INNOVATION 3: LOCATION INTELLIGENCE ═══════════════════════
function innovation3(loc) {
  const final = (loc.demographics * 0.30) + (loc.competition * 0.25) + (loc.traffic * 0.25) + (loc.tierMult * 0.20);
  return {
    tier: loc.tier,
    demographics: loc.demographics, competition: loc.competition,
    traffic: loc.traffic, tierMult: loc.tierMult,
    final
  };
}

// ═══════════════════════ INNOVATION 4: VISION FEATURES (V1-V7) ═══════════════════════
function innovation4(visual) {
  return [
    { code: 'V1', name: 'Shelf Density Index', value: visual.sdi.toFixed(2), score: visual.sdi,
      meaning: visual.sdi > 0.85 ? 'Warning: possibly staged inventory' : visual.sdi > 0.6 ? 'Healthy working capital deployed' : 'Low inventory commitment' },
    { code: 'V2', name: 'SKU Diversity Score', value: visual.sku.toFixed(1), score: visual.sku / 12,
      meaning: visual.sku > 7 ? 'Diversified — wide customer appeal' : 'Limited categories — narrow customer base' },
    { code: 'V3', name: 'Inventory Value Approx', value: fmtINRk(visual.invValue), score: Math.min(1, visual.invValue / 100000),
      meaning: 'Estimated retail value of visible inventory' },
    { code: 'V4', name: 'Refill Signal', value: visual.refill, score: { Strong: 0.95, Moderate: 0.7, Weak: 0.4, Absent: 0.1 }[visual.refill],
      meaning: visual.refill === 'Absent' ? 'Warning: no depletion patterns — staging risk' : 'Consistent customer demand visible' },
    { code: 'V5', name: 'Infrastructure Quality', value: visual.infra.toFixed(2), score: visual.infra,
      meaning: visual.infra > 0.7 ? 'Branded display units present (3rd-party verified)' : 'Basic fixtures, no branded racks' },
    { code: 'V6', name: 'Visual Store Size', value: visual.size, score: { Small: 0.3, Medium: 0.6, Large: 0.85, 'Very Large': 1.0 }[visual.size],
      meaning: 'Floor area sets revenue ceiling' },
    { code: 'V7', name: 'Category Mix Profile', value: visual.mix, score: 0.7,
      meaning: `Margin model: ${visual.mix === 'FMCG-dominant' ? '12-18%' : visual.mix === 'Balanced' ? '8-12%' : '4-7%'} net income` }
  ];
}

// ═══════════════════════ GEO FEATURES (G1-G7) ═══════════════════════
function geoFeatures(geo) {
  return [
    { code: 'G1', name: 'Catchment Population Density', value: geo.density, score: { high: 0.9, medium: 0.6, low: 0.3 }[geo.density],
      meaning: 'Population within 300m walking distance' },
    { code: 'G2', name: 'Road Type Classification', value: geo.road, score: geo.road.includes('arterial') ? 1.0 : geo.road.includes('Secondary') ? 0.75 : 0.5,
      meaning: 'Primary footfall predictor' },
    { code: 'G3', name: 'POI Proximity Score', value: geo.poi.toString(), score: geo.poi / 100,
      meaning: 'Schools, offices, transit hubs nearby' },
    { code: 'G4', name: 'Competition Density', value: geo.comp, score: { low: 0.5, moderate: 0.85, high: 0.4 }[geo.comp],
      meaning: 'Moderate competition = healthy market' },
    { code: 'G5', name: 'Residential / Commercial Mix', value: geo.mix, score: 0.7,
      meaning: 'Determines weekly revenue rhythm' },
    { code: 'G6', name: 'Location Demand Tier', value: currentSample.location.tier, score: currentSample.location.tierMult / 1.5,
      meaning: 'Composite tier classification' },
    { code: 'G7', name: 'Micro-Market Activity', value: geo.activity, score: { growing: 0.95, stable: 0.7, declining: 0.35 }[geo.activity],
      meaning: 'Future revenue trajectory signal' }
  ];
}

// ═══════════════════════ INNOVATION 5: PAYMENT FINGERPRINTING ═══════════════════════
function innovation5(fraud) {
  const score = fraud.clustering * 0.20 + fraud.concentration * 0.20 +
                fraud.discipline * 0.25 + fraud.ratio * 0.20 + fraud.festival * 0.15;
  let level, badge;
  if (score < 0.3) { level = 'Healthy'; badge = 'green'; }
  else if (score < 0.5) { level = 'Monitor'; badge = 'blue'; }
  else if (score < 0.7) { level = 'Review'; badge = 'amber'; }
  else { level = 'High Risk'; badge = 'red'; }

  const patterns = [
    { name: 'Transaction Clustering', score: fraud.clustering,
      desc: fraud.clustering > 0.6 ? 'Suspicious: 80%+ of transactions occur in 1-hour windows — likely staged' : 'Natural spread across operating hours' },
    { name: 'Recipient Concentration (HHI)', score: fraud.concentration,
      desc: fraud.concentration > 0.6 ? 'High: 75%+ payments to 2 suppliers — possible inflated orders' : 'Diversified supply chain (12-15 suppliers)' },
    { name: 'Payment Discipline (DPO)', score: fraud.discipline,
      desc: fraud.discipline > 0.85 ? 'Warning: Impossibly fast payments (under 1 day) — pre-arranged?' : fraud.discipline > 0.6 ? 'Late payments — cash stress signal' : 'Healthy payment terms maintained' },
    { name: 'Weekend / Weekday Ratio', score: fraud.ratio,
      desc: fraud.ratio > 0.5 ? 'Pattern contradicts location profile' : 'Matches expected residential/commercial split' },
    { name: 'Post-Festival Consistency', score: fraud.festival,
      desc: fraud.festival > 0.6 ? 'Diwali spike never normalized — fabricated activity' : 'Normal seasonal pattern' }
  ];
  return { score, level, badge, patterns };
}

// ═══════════════════════ INNOVATION 7: CONFIDENCE RECALIBRATION ═══════════════════════
function innovation7(confComp, fraudScore) {
  const base = confComp.img * 0.30 + confComp.sig * 0.25 + confComp.peer * 0.20 + confComp.feat * 0.25;
  const penalty = fraudScore * 0.30;
  return Math.max(0.10, Math.min(0.98, base - penalty));
}

// ═══════════════════════ DECISION ROUTING ═══════════════════════
function decision(conf, fraudScore) {
  if (fraudScore > 0.7) return { label: 'Manual Review', cls: 'review', tier: 'red', sub: 'Fraud anomalies detected — full field verification required.' };
  if (conf >= 0.80) return { label: 'Strong Approve', cls: 'approve', tier: 'green', sub: 'High confidence — disburse with standard terms.' };
  if (conf >= 0.65) return { label: 'Standard Approve', cls: 'approve', tier: 'green', sub: 'Good confidence — credit officer review optional.' };
  if (conf >= 0.45) return { label: 'Conditional Approve', cls: 'review', tier: 'amber', sub: 'Limited field verification recommended.' };
  if (conf >= 0.25) return { label: 'Field Verify', cls: 'review', tier: 'amber', sub: 'Full verification required before approval.' };
  return { label: 'Decline', cls: 'reject', tier: 'red', sub: 'Insufficient signals — re-submission with better data needed.' };
}

// ═══════════════════════ RISK FLAG GENERATION ═══════════════════════
function generateFlags(rev, ccc, loc, fraud, visual) {
  const flags = [];

  if (rev.agreement === 'High') flags.push({ severity: 'positive', title: 'Multi-signal consensus', desc: `All 3 signals (UPI, Orders, Google) agree within ${100 - rev.agreementPct}%. High estimate confidence.` });
  if (rev.agreement === 'Low') flags.push({ severity: 'high', title: 'Signal disagreement', desc: 'UPI, distributor orders, and Google demand diverge significantly. Possible data manipulation or anomaly.' });

  if (ccc.ccc < 0) flags.push({ severity: 'positive', title: 'Negative cash conversion cycle', desc: ccc.explain });
  if (ccc.ccc > 15) flags.push({ severity: 'high', title: 'Long cash conversion cycle', desc: `${ccc.ccc.toFixed(1)} days — working capital under stress.` });

  if (loc.final > 1.2) flags.push({ severity: 'positive', title: 'Premium location quality', desc: `Multiplier ${loc.final.toFixed(2)}x — high revenue potential supports larger loan.` });
  if (loc.final < 0.7) flags.push({ severity: 'medium', title: 'Sub-optimal location', desc: `Multiplier ${loc.final.toFixed(2)}x — limited customer catchment caps revenue ceiling.` });

  // Fraud flags from PS4C section 7.4
  if (visual.sdi > 0.90 && visual.refill === 'Absent') {
    flags.push({ severity: 'high', title: 'inventory_footfall_mismatch', desc: 'SDI > 0.90 with no depletion patterns — possible inspection-day overstocking.' });
  }
  if (fraud.score > 0.7) flags.push({ severity: 'high', title: 'possible_staging', desc: 'Multiple payment fingerprint anomalies suggest staged business activity.' });
  if (fraud.concentration > 0.7) flags.push({ severity: 'medium', title: 'unusual_sku_concentration', desc: 'Payments concentrated to few suppliers — atypical for diversified kirana.' });
  if (visual.refill === 'Absent') flags.push({ severity: 'medium', title: 'limited_view_coverage', desc: 'No refill signals visible — request additional photos to confirm real customer activity.' });

  if (fraud.score < 0.3 && rev.agreement === 'High' && ccc.ccc < 5) {
    flags.push({ severity: 'positive', title: 'Healthy across all dimensions', desc: 'Revenue signals consistent, cash cycle short, payment patterns normal. Ideal borrower profile.' });
  }

  return flags;
}

// ═══════════════════════ MAIN PIPELINE ═══════════════════════
let locationChart = null, trajChart = null, npaChart = null, geoChart = null;

// Theme-aware color helper for Chart.js (editorial palette)
function chartColors() {
  const dark = document.body.dataset.theme === 'dark';
  return {
    text: dark ? '#b8ad95' : '#4a4540',
    grid: dark ? '#2d2620' : '#d6cfb8',
    muted: dark ? '#786e58' : '#8a857d',
    accent: dark ? '#d97a3a' : '#b34a1f',
    ink: dark ? '#f0e8d8' : '#1a1a1a',
    surface: dark ? '#1c1814' : '#fbf8f0'
  };
}

async function runPipeline() {
  showScreen('processing');

  // gather inputs
  const inputs = {
    store_id: document.getElementById('store_id').value,
    store_name: document.getElementById('store_name').value,
    owner_name: document.getElementById('owner_name').value,
    lat: parseFloat(document.getElementById('lat').value),
    lng: parseFloat(document.getElementById('lng').value),
    upi_daily: parseFloat(document.getElementById('upi_daily').value),
    cash_ratio: parseFloat(document.getElementById('cash_ratio').value),
    order_size: parseFloat(document.getElementById('order_size').value),
    order_freq: parseFloat(document.getElementById('order_freq').value),
    reviews_pm: parseFloat(document.getElementById('reviews_pm').value),
    margin: parseFloat(document.getElementById('margin').value),
    dpo: parseFloat(document.getElementById('dpo').value),
    receivables: parseFloat(document.getElementById('receivables').value)
  };

  const sample = currentSample;

  // reset pipeline
  ['ps-1', 'ps-2', 'ps-3', 'ps-4', 'ps-5', 'ps-7'].forEach(id => {
    document.getElementById(id).classList.remove('running', 'done');
  });
  document.getElementById('big_arc').style.strokeDashoffset = 534;
  document.getElementById('big_conf').textContent = '0.00';
  ['cc_img', 'cc_sig', 'cc_peer', 'cc_feat'].forEach(id => document.getElementById(id).textContent = '—');

  // timer (MM:SS.CS format)
  const startTime = Date.now();
  const timerEl = document.getElementById('proc_timer');
  const timer = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(Math.floor(elapsed % 60)).padStart(2, '0');
    const cs = String(Math.floor((elapsed * 100) % 100)).padStart(2, '0');
    timerEl.textContent = `${mm}:${ss}.${cs}`;
  }, 30);

  // Step 1
  document.getElementById('ps-1').classList.add('running');
  await sleep(900);
  const rev = innovation1(inputs);
  document.getElementById('ps-1').classList.remove('running');
  document.getElementById('ps-1').classList.add('done');

  // Step 2
  document.getElementById('ps-2').classList.add('running');
  await sleep(700);
  const ccc = innovation2(inputs, rev.daily);
  document.getElementById('ps-2').classList.remove('running');
  document.getElementById('ps-2').classList.add('done');

  // Step 3
  document.getElementById('ps-3').classList.add('running');
  await sleep(800);
  const loc = innovation3(sample.location);
  document.getElementById('ps-3').classList.remove('running');
  document.getElementById('ps-3').classList.add('done');

  // Step 4 (Vision)
  document.getElementById('ps-4').classList.add('running');
  await sleep(1100);
  const visualFeatures = innovation4(sample.visual);
  const geoFeats = geoFeatures(sample.geo);
  document.getElementById('ps-4').classList.remove('running');
  document.getElementById('ps-4').classList.add('done');

  // Step 5
  document.getElementById('ps-5').classList.add('running');
  await sleep(900);
  const fraud = innovation5(sample.fraud);
  document.getElementById('ps-5').classList.remove('running');
  document.getElementById('ps-5').classList.add('done');

  // Step 7 - confidence build-up animation
  document.getElementById('ps-7').classList.add('running');
  await sleep(400);
  const conf = innovation7(sample.confComp, fraud.score);

  // animate confidence components filling in
  const ccItems = [
    { id: 'cc_img', val: sample.confComp.img },
    { id: 'cc_sig', val: sample.confComp.sig },
    { id: 'cc_peer', val: sample.confComp.peer },
    { id: 'cc_feat', val: sample.confComp.feat }
  ];
  for (const item of ccItems) {
    document.getElementById(item.id).textContent = item.val.toFixed(2);
    await sleep(180);
  }

  // animate big confidence ring
  const circumference = 534;
  const targetOffset = circumference * (1 - conf);
  document.getElementById('big_arc').style.strokeDashoffset = targetOffset;

  let displayed = 0;
  const animateConf = setInterval(() => {
    displayed += 0.02;
    if (displayed >= conf) { displayed = conf; clearInterval(animateConf); }
    document.getElementById('big_conf').textContent = Math.round(displayed * 100);
  }, 30);

  await sleep(800);
  document.getElementById('ps-7').classList.remove('running');
  document.getElementById('ps-7').classList.add('done');

  clearInterval(timer);
  await sleep(700);

  // Calculate final outputs
  const adjustedDaily = rev.daily * loc.final;
  const dailyRange = { low: rev.range.low * loc.final, mid: adjustedDaily, high: rev.range.high * loc.final };
  const monthlyRange = { low: dailyRange.low * 28, mid: dailyRange.mid * 28, high: dailyRange.high * 28 };
  const incomeRange = {
    low: monthlyRange.low * (inputs.margin / 100) * 0.55,
    mid: monthlyRange.mid * (inputs.margin / 100) * 0.65,
    high: monthlyRange.high * (inputs.margin / 100) * 0.75
  };
  const loanRange = { low: ccc.loanLow * loc.final, mid: (ccc.loanLow + ccc.loanHigh) / 2 * loc.final, high: ccc.loanHigh * loc.final };

  renderResults(inputs, sample, rev, ccc, loc, visualFeatures, geoFeats, fraud, conf, dailyRange, monthlyRange, incomeRange, loanRange);
  showScreen('result');
}

document.getElementById('run_btn').addEventListener('click', runPipeline);

// ═══════════════════════ RENDER RESULTS ═══════════════════════
function renderResults(inputs, sample, rev, ccc, loc, visualFeatures, geoFeats, fraud, conf, dailyRange, monthlyRange, incomeRange, loanRange) {
  document.getElementById('result-empty').classList.add('hidden');
  document.getElementById('result-content').classList.remove('hidden');

  // Headline
  const dec = decision(conf, fraud.score);
  document.getElementById('r_store_name').textContent = inputs.store_name;
  document.getElementById('r_store_id').textContent = inputs.store_id;
  const decEl = document.getElementById('r_decision');
  decEl.textContent = dec.label;
  decEl.className = 'decision ' + dec.cls;
  document.getElementById('r_decision_sub').textContent = dec.sub;

  // Confidence ring (whole percent)
  const circ = 377;
  document.getElementById('r_arc').style.strokeDashoffset = circ * (1 - conf);
  document.getElementById('r_conf').textContent = Math.round(conf * 100);

  const tierPill = document.getElementById('r_tier_pill');
  tierPill.className = 'conf-tier-pill';
  tierPill.textContent = conf >= 0.80 ? 'High Reliability Zone' : conf >= 0.65 ? 'Standard Reliability' : conf >= 0.45 ? 'Conditional Reliability' : conf >= 0.25 ? 'Field Verification Zone' : 'Low Reliability';

  // KPIs
  document.getElementById('r_daily_mid').textContent = fmtINRk(dailyRange.mid);
  document.getElementById('r_daily_range').textContent = `${fmtINRk(dailyRange.low)} – ${fmtINRk(dailyRange.high)}`;
  document.getElementById('r_monthly_mid').textContent = fmtINRk(monthlyRange.mid);
  document.getElementById('r_monthly_range').textContent = `${fmtINRk(monthlyRange.low)} – ${fmtINRk(monthlyRange.high)}`;
  document.getElementById('r_income_mid').textContent = fmtINRk(incomeRange.mid);
  document.getElementById('r_income_range').textContent = `${fmtINRk(incomeRange.low)} – ${fmtINRk(incomeRange.high)}`;
  document.getElementById('r_loan_mid').textContent = fmtINRk(loanRange.mid);
  document.getElementById('r_loan_range').textContent = `${fmtINRk(loanRange.low)} – ${fmtINRk(loanRange.high)}`;

  // Multi-signal
  const maxSignal = Math.max(rev.upi, rev.order, rev.google);
  document.getElementById('bar_upi').style.width = (rev.upi / maxSignal * 100) + '%';
  document.getElementById('bar_order').style.width = (rev.order / maxSignal * 100) + '%';
  document.getElementById('bar_google').style.width = (rev.google / maxSignal * 100) + '%';
  document.getElementById('val_upi').textContent = fmtINRk(rev.upi);
  document.getElementById('val_order').textContent = fmtINRk(rev.order);
  document.getElementById('val_google').textContent = fmtINRk(rev.google);
  document.getElementById('signal_agreement').textContent = rev.agreementPct + '%';
  const agBadge = document.getElementById('agreement_badge');
  agBadge.textContent = rev.agreement;
  agBadge.className = 'badge ' + (rev.agreement === 'High' ? 'green' : rev.agreement === 'Medium' ? 'amber' : 'red');

  // CCC
  document.getElementById('ccc_inv').textContent = ccc.inventoryDays.toFixed(1);
  document.getElementById('ccc_rec').textContent = ccc.receivablesDays.toFixed(1);
  document.getElementById('ccc_pay').textContent = ccc.payablesDays.toFixed(1);
  document.getElementById('ccc_total').textContent = ccc.ccc.toFixed(1);
  document.getElementById('ccc_explain').textContent = ccc.explain;
  document.getElementById('lb_model').textContent = ccc.loanCategory;
  document.getElementById('lb_tenure').textContent = ccc.tenure;
  document.getElementById('lb_risk').textContent = ccc.risk;

  // Location chart
  const ctx = document.getElementById('locationChart').getContext('2d');
  if (locationChart) { locationChart.destroy(); locationChart = null; }
  const cc = chartColors();
  locationChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Demographics', 'Competition', 'Traffic', 'Tier'],
      datasets: [{
        label: 'Multiplier',
        data: [loc.demographics, loc.competition, loc.traffic, loc.tierMult],
        backgroundColor: 'rgba(179, 74, 31, 0.15)',
        borderColor: cc.accent,
        borderWidth: 1.5,
        pointBackgroundColor: cc.accent,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
      scales: { r: { beginAtZero: true, suggestedMax: 1.8, ticks: { stepSize: 0.5, color: cc.muted, backdropColor: 'transparent' }, grid: { color: cc.grid }, angleLines: { color: cc.grid }, pointLabels: { color: cc.text, font: { size: 11, weight: '600' } } } },
      plugins: { legend: { display: false } }
    }
  });
  document.getElementById('loc_tier').textContent = loc.tier;
  document.getElementById('loc_mult').textContent = loc.final.toFixed(2) + 'x';

  // Init result map
  setTimeout(() => initResultMap(inputs.lat, inputs.lng), 100);

  // Vision features (V1-V7)
  const visionContainer = document.getElementById('vision_features');
  visionContainer.innerHTML = visualFeatures.map(f => `
    <div class="feature-card">
      <div class="fc-head">
        <span class="fc-code">${f.code}</span>
        <span class="fc-name">${f.name}</span>
      </div>
      <div class="fc-value">${f.value}</div>
      <div class="fc-bar"><div style="width:${(f.score * 100).toFixed(0)}%"></div></div>
      <p class="fc-meaning">${f.meaning}</p>
    </div>
  `).join('');

  // Geo features (G1-G7)
  const geoContainer = document.getElementById('geo_features');
  geoContainer.innerHTML = geoFeats.map(f => `
    <div class="feature-card">
      <div class="fc-head">
        <span class="fc-code">${f.code}</span>
        <span class="fc-name">${f.name}</span>
      </div>
      <div class="fc-value">${f.value}</div>
      <div class="fc-bar"><div style="width:${(f.score * 100).toFixed(0)}%"></div></div>
      <p class="fc-meaning">${f.meaning}</p>
    </div>
  `).join('');

  // Anomaly meter
  document.getElementById('anomaly_marker').style.left = (fraud.score * 100) + '%';
  document.getElementById('anomaly_score').textContent = fraud.score.toFixed(2);
  const anomalyBadge = document.getElementById('anomaly_label');
  anomalyBadge.textContent = fraud.level;
  anomalyBadge.className = 'badge ' + fraud.badge;

  // Fraud patterns
  const fpContainer = document.getElementById('fraud_patterns');
  fpContainer.innerHTML = fraud.patterns.map(p => {
    const cls = p.score > 0.6 ? 'alert' : p.score > 0.4 ? 'warn' : 'ok';
    const ico = p.score > 0.6 ? 'i-alert-triangle' : p.score > 0.4 ? 'i-info' : 'i-check';
    return `
    <div class="fp-item ${cls}">
      <div class="fp-icon"><svg class="icon-sm"><use href="#${ico}"/></svg></div>
      <div class="fp-body">
        <div class="fp-head">
          <span class="fp-name">${p.name}</span>
          <span class="fp-score">${p.score.toFixed(2)}</span>
        </div>
        <p class="fp-desc">${p.desc}</p>
      </div>
    </div>`;
  }).join('');

  // Trajectory chart
  if (trajChart) { trajChart.destroy(); trajChart = null; }
  const trajData = fraud.score > 0.7
    ? [conf, conf - 0.05, conf - 0.15, conf - 0.30, conf - 0.40, conf - 0.45]
    : [conf, conf + 0.04, conf + 0.07, conf + 0.08, conf + 0.10, conf + 0.12].map(v => Math.min(0.98, v));
  trajChart = new Chart(document.getElementById('trajChart'), {
    type: 'line',
    data: {
      labels: ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'],
      datasets: [{
        label: 'Confidence', data: trajData,
        borderColor: cc.accent,
        backgroundColor: 'rgba(179, 74, 31, 0.12)',
        fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: cc.accent, borderWidth: 1.5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
      scales: {
        y: { min: 0, max: 1, ticks: { color: cc.muted }, grid: { color: cc.grid } },
        x: { ticks: { color: cc.muted }, grid: { color: cc.grid } }
      },
      plugins: { legend: { display: false } }
    }
  });

  // Risk flags
  const flags = generateFlags(rev, ccc, loc, fraud, sample.visual);
  const flagsList = document.getElementById('risk_flags');
  flagsList.innerHTML = flags.map(f => {
    const sev = f.severity === 'positive' ? 'POSITIVE' : f.severity === 'high' ? 'HIGH' : 'MEDIUM';
    const cls = f.severity === 'positive' ? 'green' : f.severity === 'high' ? 'red' : 'amber';
    const icon = f.severity === 'positive' ? 'i-check-circle' : f.severity === 'high' ? 'i-alert-triangle' : 'i-info';
    return `<li class="${f.severity}">
      <div class="flag-icon"><svg class="icon-sm"><use href="#${icon}"/></svg></div>
      <div class="flag-body">
        <div class="flag-head"><span class="flag-title">${f.title}</span><span class="badge ${cls}">${sev}</span></div>
        <p class="flag-desc">${f.desc}</p>
      </div>
    </li>`;
  }).join('');

  // Peer benchmark
  document.getElementById('peer_n').textContent = sample.peerN;
  document.getElementById('peer_pct').textContent = sample.peerPct + 'th';
  document.getElementById('peer_group').textContent = `${loc.tier}-tier, ${currentSample.store_name.includes('Mumbai') ? 'Mumbai metro' : 'matched geography'}`;
  document.getElementById('peer_marker').style.left = sample.peerPct + '%';

  // Confidence breakdown bars
  const cb = sample.confComp;
  document.getElementById('cb_img').style.width = (cb.img * 100) + '%';
  document.getElementById('cb_sig').style.width = (cb.sig * 100) + '%';
  document.getElementById('cb_peer').style.width = (cb.peer * 100) + '%';
  document.getElementById('cb_feat').style.width = (cb.feat * 100) + '%';
  document.getElementById('cb_img_v').textContent = cb.img.toFixed(2);
  document.getElementById('cb_sig_v').textContent = cb.sig.toFixed(2);
  document.getElementById('cb_peer_v').textContent = cb.peer.toFixed(2);
  document.getElementById('cb_feat_v').textContent = cb.feat.toFixed(2);

  // JSON output (matches PS4C Section 7.5)
  const out = {
    store_id: inputs.store_id,
    store_name: inputs.store_name,
    assessment_date: new Date().toISOString().split('T')[0],
    location_tier: loc.tier,
    estimates: {
      daily_sales_range: { low: Math.round(dailyRange.low), mid: Math.round(dailyRange.mid), high: Math.round(dailyRange.high) },
      monthly_revenue_range: { low: Math.round(monthlyRange.low), mid: Math.round(monthlyRange.mid), high: Math.round(monthlyRange.high) },
      monthly_income_range: { low: Math.round(incomeRange.low), mid: Math.round(incomeRange.mid), high: Math.round(incomeRange.high) },
      loan_eligibility_range: { low: Math.round(loanRange.low), mid: Math.round(loanRange.mid), high: Math.round(loanRange.high) },
      currency: 'INR'
    },
    confidence_score: parseFloat(conf.toFixed(2)),
    confidence_components: {
      image_quality: cb.img, signal_consistency: cb.sig,
      peer_alignment: cb.peer, feature_coverage: cb.feat
    },
    visual_features: {
      shelf_density_index: sample.visual.sdi,
      sku_diversity_score: sample.visual.sku,
      inventory_value_approx_inr: sample.visual.invValue,
      refill_signal: sample.visual.refill.toLowerCase(),
      infrastructure_quality: sample.visual.infra,
      store_size_class: sample.visual.size.toLowerCase(),
      category_mix_profile: sample.visual.mix.toLowerCase()
    },
    geo_features: {
      catchment_population_density: sample.geo.density,
      road_type: sample.geo.road.toLowerCase().replace(/ /g, '_'),
      poi_score: sample.geo.poi,
      competition_density: sample.geo.comp,
      residential_commercial_mix: sample.geo.mix.toLowerCase().replace(/ /g, '_'),
      micro_market_activity: sample.geo.activity,
      footfall_proxy_index: sample.geo.footfall
    },
    multi_signal_revenue: {
      upi_signal: Math.round(rev.upi),
      order_signal: Math.round(rev.order),
      google_signal: Math.round(rev.google),
      signal_agreement: rev.agreement.toLowerCase()
    },
    cash_conversion_cycle: {
      inventory_days: parseFloat(ccc.inventoryDays.toFixed(2)),
      receivables_days: ccc.receivablesDays,
      payables_days: ccc.payablesDays,
      ccc: parseFloat(ccc.ccc.toFixed(2)),
      loan_model: ccc.loanCategory.toLowerCase().replace(/[ -]/g, '_')
    },
    location_intelligence: {
      multiplier: parseFloat(loc.final.toFixed(2)),
      demographics: loc.demographics,
      competition: loc.competition,
      traffic: loc.traffic,
      tier_multiplier: loc.tierMult
    },
    payment_fingerprint: {
      anomaly_score: parseFloat(fraud.score.toFixed(2)),
      risk_level: fraud.level.toLowerCase().replace(/ /g, '_'),
      patterns: {
        transaction_clustering: parseFloat(sample.fraud.clustering.toFixed(2)),
        recipient_concentration: parseFloat(sample.fraud.concentration.toFixed(2)),
        payment_discipline: parseFloat(sample.fraud.discipline.toFixed(2)),
        weekend_weekday_ratio: parseFloat(sample.fraud.ratio.toFixed(2)),
        post_festival_consistency: parseFloat(sample.fraud.festival.toFixed(2))
      }
    },
    risk_flags: flags.map(f => ({
      flag: f.title.replace(/[✓⚠] /g, '').toLowerCase().replace(/ /g, '_'),
      severity: f.severity === 'high' ? 'major' : f.severity === 'medium' ? 'moderate' : 'info',
      description: f.desc
    })),
    peer_benchmark: {
      percentile: sample.peerPct,
      peer_group: `${loc.tier}-tier`,
      n: sample.peerN
    },
    recommendation: dec.label.toLowerCase().replace(/ /g, '_'),
    seasonality_note: 'Assessment date in normal period. No seasonal adjustment applied.'
  };
  document.getElementById('json_output').textContent = JSON.stringify(out, null, 2);
}

// ═══════════════════════ RESULT TAB SWITCHING ═══════════════════════
document.querySelectorAll('.rtab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.rtab;
    document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.rtab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.rtab-content[data-rtab="${target}"]`).classList.add('active');

    // Re-init map if location tab opened
    if (target === 'location' && window._resultMap) {
      setTimeout(() => window._resultMap.invalidateSize(), 100);
    }
  });
});

// ═══════════════════════ COPY JSON ═══════════════════════
document.getElementById('copy_json').addEventListener('click', () => {
  const text = document.getElementById('json_output').textContent;
  navigator.clipboard.writeText(text);
  const btn = document.getElementById('copy_json');
  const orig = btn.textContent;
  btn.textContent = '✓ Copied!';
  setTimeout(() => btn.textContent = orig, 1500);
});

// ═══════════════════════ PORTFOLIO ═══════════════════════
function renderPortfolio() {
  const cc = chartColors();
  const dark = document.body.dataset.theme === 'dark';

  // NPA chart
  if (npaChart) { npaChart.destroy(); npaChart = null; }
  const npaCanvas = document.getElementById('npaChart');
  if (npaCanvas) {
    npaChart = new Chart(npaCanvas, {
      type: 'bar',
      data: {
        labels: ['0.90+', '0.70–0.80', '0.50–0.70', '<0.50'],
        datasets: [
          { label: 'Predicted NPA', data: [5, 11, 22, 40], backgroundColor: cc.muted, borderRadius: 0 },
          { label: 'Actual NPA',   data: [5, 11, 24, 38], backgroundColor: cc.accent, borderRadius: 0 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
        scales: {
          y: { beginAtZero: true, ticks: { color: cc.muted, callback: v => v + '%' }, grid: { color: cc.grid } },
          x: { ticks: { color: cc.muted }, grid: { color: cc.grid } }
        },
        plugins: { legend: { position: 'bottom', labels: { color: cc.text, font: { size: 12 } } } }
      }
    });
  }

  // Geographic distribution
  if (geoChart) { geoChart.destroy(); geoChart = null; }
  const geoCanvas = document.getElementById('geoChart');
  if (geoCanvas) {
    geoChart = new Chart(geoCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Tier 1 Metro', 'Tier 2 City', 'Tier 3 Town', 'Rural'],
        datasets: [{
          data: [42, 78, 95, 32],
          backgroundColor: [cc.accent, cc.ink, cc.muted, cc.grid],
          borderWidth: 2,
          borderColor: cc.surface
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
        plugins: { legend: { position: 'right', labels: { color: cc.text, font: { size: 12 } } } }
      }
    });
  }

  // Portfolio table
  const rows = [
    { id: 'KR-MH-PRIME', tier: 'Prime', loan: '₹4.2L', initial: 0.88, current: 0.92, traj: [0.88, 0.90, 0.91, 0.92, 0.92, 0.92], status: 'healthy' },
    { id: 'KR-MH-00847', tier: 'Good', loan: '₹1.3L', initial: 0.74, current: 0.83, traj: [0.74, 0.77, 0.80, 0.81, 0.82, 0.83], status: 'healthy' },
    { id: 'KR-KA-09812', tier: 'Good', loan: '₹1.8L', initial: 0.78, current: 0.85, traj: [0.78, 0.80, 0.82, 0.84, 0.84, 0.85], status: 'healthy' },
    { id: 'KR-DL-12345', tier: 'Good', loan: '₹2.0L', initial: 0.72, current: 0.45, traj: [0.72, 0.75, 0.70, 0.62, 0.50, 0.45], status: 'alert' },
    { id: 'KR-UP-RURAL', tier: 'Weak', loan: '₹65K', initial: 0.58, current: 0.52, traj: [0.58, 0.60, 0.58, 0.55, 0.53, 0.52], status: 'watch' },
    { id: 'KR-RJ-00211', tier: 'Average', loan: '₹95K', initial: 0.65, current: 0.71, traj: [0.65, 0.67, 0.69, 0.70, 0.71, 0.71], status: 'healthy' },
    { id: 'KR-DL-SUSPECT', tier: 'Suspect', loan: '₹0', initial: 0.42, current: 0.32, traj: [0.42, 0.40, 0.38, 0.35, 0.33, 0.32], status: 'alert' }
  ];
  const tbody = document.getElementById('portfolio_table');
  tbody.innerHTML = rows.map(r => {
    const sparklinePath = makeSparkline(r.traj);
    return `<tr>
      <td><b>${r.id}</b></td>
      <td>${r.tier}</td>
      <td>${r.loan}</td>
      <td>${r.initial.toFixed(2)}</td>
      <td><b>${r.current.toFixed(2)}</b></td>
      <td>${sparklinePath}</td>
      <td><span class="status-pill ${r.status}">${r.status === 'healthy' ? 'On Track' : r.status === 'watch' ? 'Watch' : 'Alert'}</span></td>
      <td><button class="btn-tiny">View</button></td>
    </tr>`;
  }).join('');
}

function makeSparkline(data) {
  const w = 80, h = 24, max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const last = data[data.length - 1], first = data[0];
  const color = last < first ? '#8c2818' : '#2d5a3d';
  return `<svg class="sparkline" viewBox="0 0 ${w} ${h}"><polyline fill="none" stroke="${color}" stroke-width="1.5" points="${pts}"/></svg>`;
}

// ═══════════════════════ SETTINGS SLIDERS ═══════════════════════
document.querySelectorAll('input[type="range"]').forEach(slider => {
  slider.addEventListener('input', e => {
    const row = e.target.closest('.slider-row');
    if (!row) return;
    const valEl = row.querySelector('.slider-head b');
    if (!valEl) return;
    const v = e.target.value;
    const orig = valEl.textContent;
    if (orig.includes('%')) valEl.textContent = v + '%';
    else valEl.textContent = v;
  });
});

// Update portfolio table to use tier-pill styling (tier column)
const _origRender = renderPortfolio;
renderPortfolio = function() {
  _origRender();
  document.querySelectorAll('#portfolio_table tr').forEach(tr => {
    const tierCell = tr.children[1];
    if (tierCell && !tierCell.querySelector('.tier-pill')) {
      tierCell.innerHTML = '<span class="tier-pill">' + tierCell.textContent + '</span>';
    }
  });
};

// Mark default chip "good" as active on load + Mumbai chip preset for Prime
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.photo-zone').forEach((z, i) => {
      if (i < 4) z.classList.add('captured');
    });
    const goodChip = document.querySelector('.chip[data-sample="good"]');
    if (goodChip) goodChip.classList.add('active');
  }, 100);
});
