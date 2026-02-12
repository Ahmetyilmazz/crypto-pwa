# 🔐 Kripto Şifreleyici - Crypto PWA


**Kripto Şifreleyici**, tamamen **PWA (Progressive Web App)** olarak tasarlanmış, **çevrimdışı çalışabilen**, **ana ekrana kurulabilen** ve **çoklu şifreleme algoritmalarını** destekleyen modern bir web uygulamasıdır.

🔗 **Canlı Demo:** [https://ahmetyilmazz.github.io/crypto-pwa/](https://ahmetyilmazz.github.io/crypto-pwa/)

---

## ✨ Özellikler

### 🔐 Desteklenen Şifreleme Algoritmaları

| Algoritma | Açıklama | Anahtar Gereksinimi |
|-----------|----------|---------------------|
| **Sezar (Caesar)** | Harfleri belirli sayıda kaydırır | Kaydırma miktarı (1-25) |
| **Atbash** | Alfabeyi ters çevirir (A↔Z, B↔Y) | Gerekmez |
| **Scytale** | Antik Yunan sütun şifrelemesi | Sütun sayısı |
| **Kaydırma (Shift)** | Unicode karakter setinde kaydırma | Kaydırma miktarı |
| **AES-256** | Web Crypto API ile endüstri standardı | 32 karakter önerilir |
| **XOR** | Basit XOR işlemi | Herhangi bir anahtar |
| **Base64** | Kodlama/dönüştürme | Gerekmez |

### 📱 PWA Özellikleri
- ✅ **Çevrimdışı çalışma** – Service Worker ile tüm statik dosyalar önbelleklenir
- ✅ **Ana ekrana ekleme** – Native uygulama gibi kurulum
- ✅ **Tam ekran modu** – `standalone` display ile tarayıcı arayüzü gizlenir
- ✅ **Responsive tasarım** – Her cihaza uyumlu
- ✅ **Hızlı yükleme** – Önbellek stratejileri ile optimize edilmiş
- ✅ **Kurulum butonu** – `beforeinstallprompt` ile kolay yükleme

### 🧠 Kullanıcı Deneyimi
- ⚡ Anlık şifreleme/deşifreleme
- 📋 Tek tıkla sonuç kopyalama
- 📊 Gerçek zamanlı karakter sayacı
- 📜 Son 20 işlemin geçmişi (localStorage)

---


---

## 🚀 Hızlı Başlangıç (Kurulum)

### 1️⃣ Projeyi Klonla
```bash
git clone https://github.com/kullaniciadin/crypto-pwa.git
cd crypto-pwa
