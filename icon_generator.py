from PIL import Image, ImageDraw, ImageFont
import os

# İkon ayarları
icon_text = "🔐"  # veya "K"
bg_color = (102, 126, 234)  # #667eea
text_color = (255, 255, 255)  # Beyaz

# Boyutlar
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# icons klasörünü oluştur
if not os.path.exists('icons'):
    os.makedirs('icons')

for size in sizes:
    # Yeni resim oluştur
    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Font boyutunu hesapla (boyutun %60'ı)
    font_size = int(size * 0.6)
    
    try:
        # Emoji için font
        font = ImageFont.truetype("seguiemj.ttf", font_size)
    except:
        # Emoji fontu yoksa standart font
        font = ImageFont.load_default()
    
    # Metni ortala
    try:
        # Emoji için
        bbox = draw.textbbox((0, 0), icon_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
    except:
        # Standart font için
        text_width, text_height = draw.textsize(icon_text, font=font)
    
    position = ((size - text_width) // 2, (size - text_height) // 2)
    
    # Metni çiz
    draw.text(position, icon_text, font=font, fill=text_color)
    
    # Kaydet
    filename = f"icons/icon-{size}.png"
    img.save(filename, 'PNG')
    print(f"✅ {filename} oluşturuldu")

print("\n🎉 Tüm ikonlar başarıyla oluşturuldu!")