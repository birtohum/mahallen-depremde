# Mahallen büyük depremde ne yaşar?

**Canlı:** https://birtohum.github.io/mahallen-depremde/

İBB'nin 7,5 büyüklüğünde gece depremi senaryosuna göre İstanbul'un 959 mahallesinde beklenen bina hasarı. Mahalleni yazınca şunları görürsün: bina sayısı, hasar dağılımı (çok ağır, ağır, orta, hafif, hasarsız) ve 1980 öncesi bina payı. İlçe ortalamasıyla karşılaştırma ve senaryonun can kaybı ile barınma tahminleri de yer alıyor. Ayrıca bir ilçe haritası, en çok etkilenmesi beklenen mahalleler listesi ve bina yaşı ile hasar oranı arasındaki ilişkiyi gösteren bir dağılım grafiği var.

## Veri

- İBB Açık Veri, Deprem Senaryosu Analiz Sonuçları (7,5 Mw, gece; 2021'de yayımlandı).
- İBB Açık Veri, 2017 Mahalle Bazlı Bina Sayıları.
- Mahalleler UAVT koduyla eşleştirildi; 959 mahallenin hepsi eşleşti.
- İlçe sınırları: geoBoundaries / OpenStreetMap (ODbL).

## Sonuçlar

| Gösterge | Sonuç |
|---|---|
| Toplam bina | 1.165.936 |
| Ağır ya da çok ağır hasar beklenen bina | 47.830 (%4,1) |
| Can kaybı (senaryo tahmini) | 14.145 |
| Geçici barınma ihtiyacı | 835.918 kişi |
| En yüksek oranlı ilçe | Adalar (%18,1) |
| En düşük oranlı ilçe | Çekmeköy (%0,6) |

1980 öncesi bina payı ile ağır hasar oranı arasındaki korelasyon r = 0,37 (946 mahalle). Bu orta düzeyde bir ilişki.

## Sınırlar

- **Tek senaryo:** Sonuçlar tek bir senaryonun model tahminleri.
- **Eski bina verisi:** Bina sayıları 2017'ye ait. Sonradan yapılan dönüşümler veriye yansımıyor.
- **Bina düzeyinde bilgi yok:** Tek tek binalar için bilgi vermez.

Kod Apache-2.0. Veri İBB Açık Veri Lisansı ile kullanılıyor.
