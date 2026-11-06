"""İBB deprem senaryosu (7,5 Mw, gece) + 2017 mahalle bina sayıları → veri/mahalleler.json, veri/ilceler.json"""
import csv, json
from pathlib import Path
KOK = Path(__file__).resolve().parent.parent
def oku(f):
    return list(csv.DictReader(open(KOK / "ham" / f, encoding="cp1254"), delimiter=";"))
sen = {r["mahalle_koy_uavt"]: r for r in oku("senaryo.csv")}
bina = {r["mahalle_uavt"]: r for r in oku("bina.csv")}
I = lambda r, k: int(float(r[k] or 0))
mah = []
for u, s in sen.items():
    b = bina.get(u)
    if not b:
        continue
    yas = [I(b, "1980_oncesi"), I(b, "1980-2000_arasi"), I(b, "2000_sonrasi")]
    top = sum(yas)
    if not top:
        continue
    mah.append({"il": s["ilce_adi"], "ad": s["mahalle_adi"], "bina": top, "yas": yas,
                "kat": [I(b, "1-4 kat_arasi"), I(b, "5-9 kat_arasi"), I(b, "9-19 kat_arasi")],
                "h": [I(s, "cok_agir_hasarli_bina_sayisi"), I(s, "agir_hasarli_bina_sayisi"), I(s, "orta_hasarli_bina_sayisi"), I(s, "hafif_hasarli_bina_sayisi")],
                "can": I(s, "can_kaybi_sayisi"), "agir_yarali": I(s, "agir_yarali_sayisi"), "barinma": I(s, "gecici_barinma")})
print(len(sen), "senaryo,", len(mah), "eşleşen mahalle")
tot = lambda k: sum(m[k] for m in mah)
print("bina", tot("bina"), "çok ağır+ağır", sum(m["h"][0] + m["h"][1] for m in mah), "can", tot("can"), "barınma", tot("barinma"))
json.dump(mah, open(KOK / "veri/mahalleler.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
