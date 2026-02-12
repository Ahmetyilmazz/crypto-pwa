// Service Worker Kayıt
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker kaydedildi:", registration);
      })
      .catch((error) => {
        console.log("Service Worker kaydı başarısız:", error);
      });
  });
}

// PWA yükleme olayı
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Yükle butonunu göster
  const installBtn = document.getElementById("installBtn");
  if (installBtn) {
    installBtn.style.display = "block";
  }
});
