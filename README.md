# MADANI AI AVATAR STUDIO
### Karnival MADANI PPD Kulim Bandar Baharu, Kedah

> **Tagline:** “Wajah Anda, Dunia Fantasi Anda!”  
> **Slogan Karnival:** “Bersama Membina Masa Depan”

---

## 📌 Pengenalan Aplikasi
**MADANI AI Avatar Studio** merupakan sebuah aplikasi kiosk interaktif berasaskan web yang dibangunkan khas sempena **Karnival MADANI** anjuran **Pejabat Pendidikan Daerah (PPD) Kulim Bandar Baharu**. 

Aplikasi ini membolehkan murid-murid mengambil gambar menggunakan webcam komputer, memilih gaya avatar 3D kegemaran (ala filem animasi keluarga Disney/Pixar), dan seterusnya menjana kad cenderamata kenangan eksklusif berformat **A4, A5, 4R, atau Segi Empat** yang boleh dicetak serta-merta atau dimuat turun dalam bentuk PNG/PDF resolusi tinggi.

---

## ✨ Ciri-Ciri Utama

1. **Aliran Kiosk Mesra Murid (5 Langkah Mudah):**
   - **Langkah 1: Selamat Datang** — Panduan penggunaan visual dan butang mula pantas.
   - **Langkah 2: Ambil Gambar** — Integrasi webcam langsung dengan bingkai panduan wajah, pemasa 3 saat, fungsi cermin, dan sokongan muat naik gambar.
   - **Langkah 3: Pilih Gaya Avatar 3D** — 7 pilihan gaya animasi keluarga:
     - *3D Animation Hero* (Gaya filem keluarga Pixar/Disney)
     - *Mini Chibi 3D* (Proporsi comel & ekspresi riang)
     - *Little MADANI Hero* (Vest wira tema perpaduan Malaysia)
     - *Futuristic AI Avatar* (Teknologi siber & hologram neon)
     - *School Superstar* (Uniform sekolah kemas & bintang emas)
     - *MADANI Culture* (Busana sopan warisan budaya harmoni)
     - *Royal 3D Portrait* (Blazer bersulam emas & potret diraja)
   - **Langkah 4: Penjanaan AI Sebenar** — Dikuasakan oleh model penjanaan imej Google Gemini dengan paparan kemajuan langsung dan pengurusan ralat telus.
   - **Langkah 5: Reka Kad & Cetak** — 5 pilihan templat kad (*MADANI Celebration*, *My 3D Avatar*, *Little Malaysian Star*, *Kenangan Karnival MADANI*, *Future AI Generation*), fungsi isian nama murid, mod jimat dakwat (*plain white*), serta butang cetak & muat turun.

2. **Perlindungan Privasi Murid:**
   - Foto dan avatar diproses di dalam memori sesi sementara sahaja.
   - Tiada pengumpulan data biometrik atau simpanan fail secara kekal.
   - Pemasa sesi kiosk automatik (auto-timeout) dengan amaran 20 saat bagi mengosongkan sesi untuk murid seterusnya.
   - Butang *"Padam Sesi"* untuk memadam data foto serta-merta pada bila-bila masa.

3. **Panel Pentadbir Kiosk:**
   - Tetapan nama program, penganjur, tarikh, dan slogan.
   - Muat naik logo rasmi penganjur.
   - Pelarasan masa tamat sesi kiosk (default: 120 saat).
   - Pengesahan status sambungan Kunci API Gemini (`/api/health`).

---

## 🛠️ Panduan Konfigurasi Pentadbir Sekolah

### 1. Keperluan Perkakasan & Perisian
- **Komputer Kiosk:** Komputer meja (PC) atau komputer riba dengan Windows 10/11, macOS, atau ChromeOS.
- **Kamera:** Webcam USB HD (720p atau 1080p disyorkan) atau webcam terbina dalam.
- **Pencetak:** Pencetak warna (inkjet atau laser) dengan sambungan USB atau rangkaian setempat (LAN/Wi-Fi).
- **Penyemak Imbas:** Google Chrome, Microsoft Edge, atau Safari versi terkini.
- **Sambungan Internet:** Rangkaian internet yang stabil untuk memproses permintaan API Google Gemini.

### 2. Konfigurasi Kunci API Gemini (GEMINI_API_KEY)
Aplikasi ini menggunakan perkhidmatan pelayan proksi selamat untuk memproses permintaan AI tanpa mendedahkan kunci API kepada penyemak imbas murid.

1. Buka panel **Settings > Secrets** dalam persekitaran Google AI Studio / pelayan anda.
2. Tambahkan pembolehubah persekitaran:
   ```env
   GEMINI_API_KEY=KUNCI_API_GEMINI_ANDA
   ```
3. Tekan butang gear pentadbir (ikon ⚙️ di penjuru kanan atas aplikasi) untuk mengesahkan bahawa status menunjukkan **"Kunci API Bersedia"**.

### 3. Persediaan Kiosk Semasa Karnival
1. Buka pautan aplikasi di penyemak imbas Google Chrome.
2. Tekan butang **Skrin Penuh** (ikon segiempat di bar atas) atau tekan kekunci `F11` pada papan kekunci untuk mengaktifkan mod kiosk penuh.
3. Sambungkan pencetak dan lakukan satu cetakan ujian (*test print*) melalui butang **CETAK SEGERA** untuk memastikan saiz kertas (A4/A5/4R) selaras dengan tetapan pencetak fizikal.
4. Pastikan pencahayaan di gerai/kiosk mencukupi agar muka murid kelihatan jelas pada webcam.

---

## 📜 Hak Cipta & Penganjur
- **Penganjur Rasmi:** Pejabat Pendidikan Daerah Kulim Bandar Baharu, Kedah Darul Aman.
- **Acara:** Karnival MADANI PPD Kulim Bandar Baharu.
- **Teknologi:** React, TypeScript, Tailwind CSS, Express, Google Gen AI SDK.
