class CryptoApp {
  constructor() {
    this.algorithmSelect = document.getElementById("algorithm");
    this.keyInput = document.getElementById("key");
    this.shiftContainer = document.getElementById("shiftContainer");
    this.inputText = document.getElementById("inputText");
    this.outputText = document.getElementById("outputText");
    this.charCount = document.getElementById("charCount");
    this.historyList = document.getElementById("historyList");

    this.init();
  }

  init() {
    // AES için rastgele anahtar oluştur
    this.generateAESKey();

    // Event listeners
    this.algorithmSelect.addEventListener("change", () =>
      this.onAlgorithmChange(),
    );
    this.inputText.addEventListener("input", () => this.updateCharCount());

    document
      .getElementById("encryptBtn")
      .addEventListener("click", () => this.encrypt());
    document
      .getElementById("decryptBtn")
      .addEventListener("click", () => this.decrypt());
    document
      .getElementById("clearBtn")
      .addEventListener("click", () => this.clear());
    document
      .getElementById("copyBtn")
      .addEventListener("click", () => this.copyOutput());
    document
      .getElementById("installBtn")
      .addEventListener("click", () => this.installPWA());

    // Çevrimiçi/çevrimdışı durum takibi
    window.addEventListener("online", () => this.updateStatus(true));
    window.addEventListener("offline", () => this.updateStatus(false));

    // Geçmişi yükle
    this.loadHistory();

    this.updateCharCount();
    this.onAlgorithmChange();
    this.updateStatus(navigator.onLine);
  }

  onAlgorithmChange() {
    const algo = this.algorithmSelect.value;

    if (algo === "caesar" || algo === "shift") {
      this.shiftContainer.style.display = "block";
      document.getElementById("keyInfo").textContent =
        "Kaydırma miktarını girin (1-25)";
    } else if (algo === "aes") {
      this.shiftContainer.style.display = "none";
      document.getElementById("keyInfo").textContent =
        "AES için 32 karakter anahtar önerilir";
    } else if (algo === "xor") {
      this.shiftContainer.style.display = "none";
      document.getElementById("keyInfo").textContent =
        "XOR için herhangi bir anahtar";
    } else if (algo === "scytale") {
      this.shiftContainer.style.display = "none";
      document.getElementById("keyInfo").textContent =
        "Sütun sayısını girin (ör: 3, 4, 5)";
    } else {
      // atbash, base64
      this.shiftContainer.style.display = "none";
      document.getElementById("keyInfo").textContent = "Anahtar gerekmez";
    }
  }

  generateAESKey() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let key = "";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.keyInput.value = key;
  }

  updateCharCount() {
    this.charCount.textContent = `${this.inputText.value.length} karakter`;
  }

  async encrypt() {
    const text = this.inputText.value.trim();
    if (!text) {
      this.showMessage("Lütfen şifrelenecek metni girin", "error");
      return;
    }

    try {
      let result;
      const algo = this.algorithmSelect.value;

      switch (algo) {
        case "aes":
          result = await this.encryptAES(text, this.keyInput.value);
          break;
        case "caesar":
          const caesarShift = parseInt(document.getElementById("shift").value);
          result = this.caesarCipher(text, caesarShift);
          break;
        case "atbash":
          result = this.atbashCipher(text);
          break;
        case "scytale":
          const columns = parseInt(this.keyInput.value) || 3;
          result = this.scytaleCipher(text, columns);
          break;
        case "shift":
          const shiftAmount = parseInt(document.getElementById("shift").value);
          result = this.shiftCipher(text, shiftAmount);
          break;
        case "xor":
          result = this.xorCipher(text, this.keyInput.value);
          break;
        case "base64":
          result = btoa(encodeURIComponent(text));
          break;
        default:
          throw new Error("Bilinmeyen algoritma");
      }

      this.outputText.value = result;
      this.saveToHistory(text, result, algo, "encrypt");
      this.showMessage("Metin başarıyla şifrelendi!", "success");
    } catch (error) {
      this.showMessage(`Şifreleme hatası: ${error.message}`, "error");
    }
  }

  async decrypt() {
    const text = this.inputText.value.trim();
    if (!text) {
      this.showMessage("Lütfen deşifre edilecek metni girin", "error");
      return;
    }

    try {
      let result;
      const algo = this.algorithmSelect.value;

      switch (algo) {
        case "aes":
          result = await this.decryptAES(text, this.keyInput.value);
          break;
        case "caesar":
          const caesarShift = parseInt(document.getElementById("shift").value);
          result = this.caesarCipher(text, -caesarShift);
          break;
        case "atbash":
          result = this.atbashCipher(text); // Atbash kendini tersine çevirir
          break;
        case "scytale":
          const columns = parseInt(this.keyInput.value) || 3;
          result = this.scytaleDecipher(text, columns);
          break;
        case "shift":
          const shiftAmount = parseInt(document.getElementById("shift").value);
          result = this.shiftCipher(text, -shiftAmount);
          break;
        case "xor":
          result = this.xorCipher(text, this.keyInput.value);
          break;
        case "base64":
          result = decodeURIComponent(atob(text));
          break;
        default:
          throw new Error("Bilinmeyen algoritma");
      }

      this.outputText.value = result;
      this.saveToHistory(text, result, algo, "decrypt");
      this.showMessage("Metin başarıyla deşifre edildi!", "success");
    } catch (error) {
      this.showMessage(`Deşifre hatası: ${error.message}`, "error");
    }
  }

  // 1. SEZAR ŞİFRESİ (Geliştirilmiş)
  caesarCipher(text, shift) {
    // Kaydırma miktarını 0-25 aralığına getir
    shift = ((shift % 26) + 26) % 26;

    return text
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);

        if (code >= 65 && code <= 90) {
          // Büyük harf
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          // Küçük harf
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        } else if (code >= 48 && code <= 57) {
          // Rakamlar (0-9)
          return String.fromCharCode(((code - 48 + shift) % 10) + 48);
        } else if (code >= 1040 && code <= 1071) {
          // Türkçe büyük harf (A-İ)
          return String.fromCharCode(((code - 1040 + shift) % 32) + 1040);
        } else if (code >= 1072 && code <= 1103) {
          // Türkçe küçük harf (a-i)
          return String.fromCharCode(((code - 1072 + shift) % 32) + 1072);
        }
        return char;
      })
      .join("");
  }

  // 2. ATBASH ŞİFRESİ
  atbashCipher(text) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabetLower = alphabet.toLowerCase();
    const turkishUpper = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
    const turkishLower = turkishUpper.toLowerCase();

    return text
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);

        // İngilizce büyük harfler
        if (code >= 65 && code <= 90) {
          const index = alphabet.indexOf(char);
          return alphabet.charAt(25 - index);
        }
        // İngilizce küçük harfler
        else if (code >= 97 && code <= 122) {
          const index = alphabetLower.indexOf(char);
          return alphabetLower.charAt(25 - index);
        }
        // Türkçe büyük harfler
        else if (turkishUpper.includes(char)) {
          const index = turkishUpper.indexOf(char);
          return turkishUpper.charAt(turkishUpper.length - 1 - index);
        }
        // Türkçe küçük harfler
        else if (turkishLower.includes(char)) {
          const index = turkishLower.indexOf(char);
          return turkishLower.charAt(turkishLower.length - 1 - index);
        }
        // Rakamlar
        else if (code >= 48 && code <= 57) {
          return String.fromCharCode(57 - (code - 48) + 48);
        }
        return char;
      })
      .join("");
  }

  // 3. SCYTALE ŞİFRESİ (Antik Yunan - Spiral Şifre)
  scytaleCipher(text, columns) {
    if (columns <= 0) columns = 3;

    // Metindeki boşlukları kaldır ve büyük harfe çevir
    const cleanText = text.replace(/\s+/g, "").toUpperCase();
    const rows = Math.ceil(cleanText.length / columns);

    // Matris oluştur
    const matrix = [];
    let index = 0;

    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < columns; j++) {
        if (index < cleanText.length) {
          matrix[i][j] = cleanText.charAt(index);
          index++;
        } else {
          matrix[i][j] = "X"; // Dolgu karakteri
        }
      }
    }

    // Sütun sütun oku
    let result = "";
    for (let j = 0; j < columns; j++) {
      for (let i = 0; i < rows; i++) {
        result += matrix[i][j];
      }
    }

    return result;
  }

  scytaleDecipher(text, columns) {
    if (columns <= 0) columns = 3;

    const cleanText = text.toUpperCase();
    const rows = Math.ceil(cleanText.length / columns);

    // Matrisi geri oluştur
    const matrix = [];
    let index = 0;

    for (let j = 0; j < columns; j++) {
      for (let i = 0; i < rows; i++) {
        if (!matrix[i]) matrix[i] = [];
        if (index < cleanText.length) {
          matrix[i][j] = cleanText.charAt(index);
          index++;
        }
      }
    }

    // Satır satır oku
    let result = "";
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (matrix[i][j]) {
          result += matrix[i][j];
        }
      }
    }

    // Dolgu karakterlerini kaldır
    return result.replace(/X+$/g, "");
  }

  // AES Şifreleme (Web Crypto API kullanarak)
  async encryptAES(text, key) {
    try {
      // Anahtarı UTF-8 byte dizisine çevir
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      // Anahtarı hazırla (32 byte = 256 bit)
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(key.padEnd(32, "0").slice(0, 32)),
        "AES-CBC",
        false,
        ["encrypt", "decrypt"],
      );

      // IV (Initialization Vector) oluştur
      const iv = crypto.getRandomValues(new Uint8Array(16));

      // Şifrele
      const encrypted = await crypto.subtle.encrypt(
        {
          name: "AES-CBC",
          iv: iv,
        },
        keyMaterial,
        data,
      );

      // IV + şifreli veriyi base64 olarak birleştir
      const encryptedBytes = new Uint8Array(encrypted);
      const result = new Uint8Array(iv.length + encryptedBytes.length);
      result.set(iv);
      result.set(encryptedBytes, iv.length);

      return btoa(String.fromCharCode(...result));
    } catch (error) {
      throw new Error("AES şifreleme başarısız. Anahtar kontrol edin.");
    }
  }

  async decryptAES(encryptedBase64, key) {
    try {
      // Base64'ten decode et
      const encryptedData = Uint8Array.from(atob(encryptedBase64), (c) =>
        c.charCodeAt(0),
      );

      // IV ve şifreli veriyi ayır
      const iv = encryptedData.slice(0, 16);
      const encrypted = encryptedData.slice(16);

      // Anahtarı hazırla
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(key.padEnd(32, "0").slice(0, 32)),
        "AES-CBC",
        false,
        ["encrypt", "decrypt"],
      );

      // Deşifre et
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: iv,
        },
        keyMaterial,
        encrypted,
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      throw new Error("AES deşifre başarısız. Anahtar veya veri hatalı.");
    }
  }

  // XOR Şifreleme
  xorCipher(text, key) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result);
  }

  clear() {
    this.inputText.value = "";
    this.outputText.value = "";
    this.updateCharCount();
  }

  copyOutput() {
    if (this.outputText.value) {
      this.outputText.select();
      navigator.clipboard
        .writeText(this.outputText.value)
        .then(() => this.showMessage("Kopyalandı!", "success"))
        .catch(() => this.showMessage("Kopyalama başarısız", "error"));
    }
  }

  saveToHistory(input, output, algorithm, operation) {
    const historyItem = {
      timestamp: new Date().toLocaleString(),
      algorithm,
      operation,
      input: input.length > 50 ? input.substring(0, 50) + "..." : input,
      output: output.length > 50 ? output.substring(0, 50) + "..." : output,
    };

    let history = JSON.parse(localStorage.getItem("cryptoHistory") || "[]");
    history.unshift(historyItem);
    if (history.length > 20) history = history.slice(0, 20);

    localStorage.setItem("cryptoHistory", JSON.stringify(history));
    this.loadHistory();
  }

  loadHistory() {
    const history = JSON.parse(localStorage.getItem("cryptoHistory") || "[]");
    this.historyList.innerHTML = "";

    history.forEach((item) => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.innerHTML = `
                <strong>${item.timestamp}</strong><br>
                ${item.operation === "encrypt" ? "🔐" : "🔓"} ${item.algorithm} |
                Giriş: ${item.input}<br>
                Çıkış: ${item.output}
            `;
      this.historyList.appendChild(div);
    });
  }

  updateStatus(isOnline) {
    const statusText = document.getElementById("statusText");
    const statusIndicator = document.querySelector(".status-indicator");

    if (isOnline) {
      statusText.textContent = "Çevrimiçi";
      statusIndicator.className = "status-indicator online";
    } else {
      statusText.textContent = "Çevrimdışı";
      statusIndicator.className = "status-indicator offline";
    }
  }

  showMessage(message, type) {
    // Basit bildirim sistemi
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            background: ${type === "success" ? "#4CAF50" : "#f44336"};
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  installPWA() {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          this.showMessage("Uygulama yüklendi!", "success");
        }
        window.deferredPrompt = null;
      });
    } else {
      this.showMessage("Tarayıcınız PWA yüklemeyi desteklemiyor", "error");
    }
  }
}

// Uygulamayı başlat
document.addEventListener("DOMContentLoaded", () => {
  new CryptoApp();
});
