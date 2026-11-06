"use strict";
const $ = (id) => document.getElementById(id);
const sayi = (x, b = 0) => x.toLocaleString("tr-TR", { minimumFractionDigits: b, maximumFractionDigits: b });
const guzel = (s) => s.toLocaleLowerCase("tr").split(" ").map((w) => w.charAt(0).toLocaleUpperCase("tr") + w.slice(1)).join(" ");
const NS = "http://www.w3.org/2000/svg";
const ETIKET = ["çok ağır", "ağır", "orta", "hafif", "hasarsız"];
let M, S, IL = {}, secIlce = null;

const agir = (m) => m.h[0] + m.h[1];
const oran = (m) => agir(m) / m.bina;
function ekDe(s) {
  const k = s.toLocaleLowerCase("tr"), sesli = [...k].reverse().find((h) => "aıoueiöü".includes(h));
  return `${s}'${"fstkçşhp".includes(k.slice(-1)) ? "t" : "d"}${"aıou".includes(sesli) ? "a" : "e"}`;
}

function harita() {
  const COS = Math.cos((41.05 * Math.PI) / 180);
  let b = [99, 99, -99, -99];
  S.forEach((il) => il.h.forEach((h) => h.forEach(([x, y]) => { b = [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)]; })));
  const W = 1000, k = W / ((b[2] - b[0]) * COS), Hh = Math.round((b[3] - b[1]) * k);
  const P = ([x, y]) => `${((x - b[0]) * COS * k).toFixed(1)},${((b[3] - y) * k).toFixed(1)}`;
  const s = $("harita"); s.setAttribute("viewBox", `0 0 ${W} ${Hh}`);
  const enb = Math.max(...Object.values(IL).map((x) => x.oran));
  S.forEach((il) => {
    const ad = il.ad.toLocaleUpperCase("tr"), v = IL[ad];
    const e = document.createElementNS(NS, "path");
    e.setAttribute("d", il.h.map((h) => "M" + h.map(P).join("L") + "Z").join(""));
    e.setAttribute("fill-rule", "evenodd");
    e.style.fill = v ? `color-mix(in oklab, var(--cok) ${Math.round(100 * Math.sqrt(v.oran / enb))}%, var(--az))` : "var(--az)";
    e.style.stroke = "var(--zemin)"; e.style.strokeWidth = "1";
    const t = document.createElementNS(NS, "title");
    t.textContent = v ? `${il.ad}: binaların %${sayi(100 * v.oran, 1)}'inde ağır/çok ağır hasar bekleniyor (${sayi(v.agir)} bina)` : il.ad;
    e.appendChild(t);
    e.onclick = () => ilceSec(ad);
    e.dataset.ad = ad;
    s.appendChild(e);
  });
  const sira = Object.entries(IL).sort((a, c) => c[1].oran - a[1].oran);
  $("lejant").textContent = `Koyu renk daha yüksek oran. En yüksek: ${guzel(sira[0][0])} (%${sayi(100 * sira[0][1].oran, 1)}), en düşük: ${guzel(sira[sira.length - 1][0])} (%${sayi(100 * sira[sira.length - 1][1].oran, 1)}). Bir ilçeye dokun, mahalleleri listelensin.`;
}

function ilceSec(ad) {
  secIlce = ad;
  [...$("harita").querySelectorAll("path")].forEach((e) => { e.style.stroke = e.dataset.ad === ad ? "var(--yazi)" : "var(--zemin)"; e.style.strokeWidth = e.dataset.ad === ad ? "2.5" : "1"; });
  liste();
  $("liste").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function liste() {
  const l = M.filter((m) => m.bina >= 100 && (!secIlce || m.il === secIlce)).sort((a, b) => oran(b) - oran(a)).slice(0, 15);
  const enb = oran(l[0]);
  $("listeBaslik").textContent = secIlce ? `${guzel(secIlce)}: en çok etkilenmesi beklenen mahalleler` : "En çok etkilenmesi beklenen mahalleler";
  $("liste").innerHTML = l.map((m) => `<li><button data-i="${M.indexOf(m)}">${guzel(m.ad)}</button><span class="cubuk" style="width:${(100 * oran(m)) / enb}%;background:var(--h1)"></span><span class="deger">%${sayi(100 * oran(m), 1)}</span></li>`).join("");
  document.querySelectorAll(".liste li").forEach((li) => (li.style.gridTemplateColumns = "24px 150px 1fr 60px"));
}

function goster(m) {
  const hasarsiz = Math.max(0, m.bina - m.h.reduce((a, b) => a + b, 0));
  const parca = [...m.h, hasarsiz];
  const eski = m.yas[0] / m.bina;
  const il = IL[m.il];
  const kiyas = oran(m) > il.oran * 1.15 ? "ilçe ortalamasının üstünde" : oran(m) < il.oran * 0.85 ? "ilçe ortalamasının altında" : "ilçe ortalamasına yakın";
  $("ozet").innerHTML = `<p class="cumle"><b>${guzel(m.ad)}</b> (${guzel(m.il)}) mahallesinde ${sayi(m.bina)} bina var. Senaryoya göre bunların <b style="color:var(--vurgu)">${sayi(agir(m))}</b> tanesinde (%${sayi(100 * oran(m), 1)}) ağır ya da çok ağır hasar bekleniyor; bu ${kiyas} (%${sayi(100 * il.oran, 1)}). Binaların %${sayi(100 * eski)}'${ekYuzde(Math.round(100 * eski))} 1980'den önce yapılmış.</p>
    <div class="hasar">${parca.map((n, i) => `<i style="width:${(100 * n) / m.bina}%;background:var(--h${i})" title="${ETIKET[i]}: ${sayi(n)}"></i>`).join("")}</div>
    <div class="hl">${parca.map((n, i) => `<span><i style="background:var(--h${i})"></i>${ETIKET[i]} ${sayi(n)}</span>`).join("")}</div>
    <p class="senaryo">Aynı senaryoda bu mahalle için tahmin edilen: ${sayi(m.can)} can kaybı, ${sayi(m.agir_yarali)} ağır yaralı, ${sayi(m.barinma)} kişinin geçici barınma ihtiyacı.</p>`;
  history.replaceState(null, "", `?mahalle=${encodeURIComponent(guzel(m.ad))}&ilce=${encodeURIComponent(guzel(m.il))}`);
}
function ekYuzde(n) {
  const B = ["ı", "i", "si", "ü", "ü", "i", "sı", "si", "i", "u"], O = ["ü", "u", "si", "u", "ı", "si", "ı", "i", "i", "ı"];
  return n === 100 ? "ü" : n === 0 ? "ı" : n % 10 ? B[n % 10] : O[n / 10];
}

function dagilim() {
  const G = 460, Y = 300, sol = 40, alt = 30, ust = 10, sag = 10;
  const l = M.filter((m) => m.bina >= 100);
  const enb = Math.max(...l.map(oran));
  const X = (v) => sol + v * (G - sol - sag), Yp = (v) => ust + (1 - v / enb) * (Y - ust - alt);
  let s = `<svg viewBox="0 0 ${G} ${Y}" role="img" aria-label="1980 öncesi bina payı ile ağır hasar oranı">`;
  for (const v of [0, 0.25, 0.5, 0.75, 1]) s += `<line x1="${X(v)}" x2="${X(v)}" y1="${ust}" y2="${Y - alt}" stroke="var(--cizgi)"/><text x="${X(v)}" y="${Y - 12}" text-anchor="middle" font-size="11" fill="var(--soluk)">%${v * 100}</text>`;
  for (let v = 0; v <= enb; v += 0.05) s += `<text x="${sol - 6}" y="${Yp(v) + 4}" text-anchor="end" font-size="11" fill="var(--soluk)">%${Math.round(v * 100)}</text>`;
  l.forEach((m) => (s += `<circle cx="${X(m.yas[0] / m.bina).toFixed(1)}" cy="${Yp(oran(m)).toFixed(1)}" r="2.2" fill="var(--h1)" opacity=".45"><title>${guzel(m.ad)} (${guzel(m.il)})</title></circle>`));
  s += `<text x="${G / 2}" y="${Y}" text-anchor="middle" font-size="11" fill="var(--soluk)">1980 öncesi bina payı →</text>`;
  // korelasyon
  const xs = l.map((m) => m.yas[0] / m.bina), ys = l.map(oran), n = xs.length;
  const mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
  let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
  const r = sxy / Math.sqrt(sxx * syy);
  $("dagilim").innerHTML = s + "</svg>" + `<p class="alt">Korelasyon katsayısı r = ${sayi(r, 2)} (${n} mahalle). Eski binası çok olan mahallelerde beklenen hasar ${r > 0.5 ? "güçlü biçimde" : r > 0.3 ? "orta düzeyde" : "zayıf biçimde"} daha yüksek. Bina yaşı farkın yalnız bir kısmını açıklıyor; zemin, bina yüksekliği ve faya uzaklık gibi etkenler de rol oynuyor olabilir.</p>`;
}

function bul(yazi) {
  const q = yazi.toLocaleUpperCase("tr").split(",").map((x) => x.trim());
  const ad = q[0].replace(/ MAHALLESİ$| MAH\.?$/, "");
  const aday = M.filter((m) => m.ad === ad || m.ad === ad + " MAHALLESİ");
  if (!aday.length) return null;
  if (q[1]) { const t = aday.find((m) => m.il === q[1]); if (t) return t; }
  return aday[0];
}

async function baslat() {
  [M, S] = await Promise.all([fetch("veri/mahalleler.json").then((r) => r.json()), fetch("veri/ilce-sinir.json").then((r) => r.json())]);
  for (const m of M) { const x = (IL[m.il] ||= { bina: 0, agir: 0 }); x.bina += m.bina; x.agir += agir(m); }
  for (const x of Object.values(IL)) x.oran = x.agir / x.bina;
  harita(); liste(); dagilim();
  $("mahalleler").innerHTML = M.map((m) => `<option value="${guzel(m.ad)}, ${guzel(m.il)}">`).join("");
  $("form").onsubmit = (e) => {
    e.preventDefault();
    const m = bul($("ara").value);
    if (m) goster(m); else $("ozet").innerHTML = `<p class="cumle">"${$("ara").value.replace(/[<>&]/g, "")}" adlı bir mahalle bulunamadı. Listeden seçmeyi dene ("Mahalle, İlçe").</p>`;
  };
  document.body.addEventListener("click", (e) => { const b = e.target.closest(".liste button"); if (b) { goster(M[Number(b.dataset.i)]); $("ozet").scrollIntoView({ behavior: "smooth" }); } });
  const p = new URLSearchParams(location.search);
  const m = p.get("mahalle") ? bul(`${p.get("mahalle")}, ${p.get("ilce") || ""}`) : bul("CAFERAĞA, KADIKÖY") || M[0];
  if (m) { $("ara").value = `${guzel(m.ad)}, ${guzel(m.il)}`; goster(m); }
}
baslat();
