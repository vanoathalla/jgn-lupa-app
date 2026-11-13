# Jgn Lupa 🔔

App pengingat harian yang simpel, keren, dan bisa di-install langsung di laptop maupun HP Android. Dibuat dengan React + Electron + Capacitor.

---

## Fitur

- **Tambah pengingat** — isi judul, catatan, tanggal & waktu
- **Notifikasi alarm** — suara + popup muncul otomatis saat waktunya tiba
- **Background alarm** — tetap aktif meski app di-minimize ke tray (Windows)
- **Kategori** — Pribadi, Kerja, Kesehatan, Belanja, Lainnya
- **Pengulangan** — tidak berulang / harian / mingguan / bulanan
- **Tandai selesai / edit / hapus** reminder
- **Stats bar** — ringkasan total, aktif, selesai, terlewat
- **Responsif** — layout sidebar di laptop, mobile-friendly di HP
- **Dark mode** penuh

---

## Install di Windows (.exe)

1. Download file `Jgn Lupa Setup 1.0.0.exe` dari [Releases](https://github.com/vanoathalla/jgn-lupa-app/releases)
2. Double-click file installer
3. Kalau muncul peringatan Windows SmartScreen → klik **More info** → **Run anyway**
4. Ikuti wizard instalasi → pilih folder → Install → Finish
5. App otomatis jalan dan masuk ke **system tray** (pojok kanan bawah, dekat jam)

> Klik X di app = app ke tray, bukan quit. Untuk keluar beneran: klik kanan icon tray → **Keluar**

---

## Install di Android (.apk)

1. Download file `app-debug.apk` dari [Releases](https://github.com/vanoathalla/jgn-lupa-app/releases)
2. Pindahkan file ke HP (via USB, WhatsApp, Telegram, atau Google Drive)
3. Buka file APK di HP
4. Kalau muncul peringatan **"Install from unknown sources"** → masuk ke Settings → izinkan instalasi dari sumber ini
5. Tap **Install** → selesai

---

## Jalankan dari Source Code

### Prasyarat
- Node.js v18+
- npm v9+

### Install dependencies
```bash
npm install
```

### Development (web)
```bash
npm run dev
```
Buka `http://localhost:5173`

### Development (Electron desktop)
Buka dua terminal:
```bash
# Terminal 1 — jalankan dev server
npm run dev

# Terminal 2 — jalankan Electron
npm run electron:dev
```

### Build installer Windows (.exe)
```bash
npm run electron:build
```
Output: `dist-electron/Jgn Lupa Setup 1.0.0.exe`

### Build APK Android
Pastikan Android SDK sudah terinstall dan `ANDROID_HOME` sudah diset.
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animasi | Framer Motion |
| Icons | Lucide React |
| Desktop | Electron 31 |
| Mobile | Capacitor 6 |
| Data | localStorage + file sync |

---

## Struktur Project

```
jgn-lupa-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsBar.jsx
│   │   ├── ReminderList.jsx
│   │   ├── ReminderCard.jsx
│   │   ├── AddReminderModal.jsx
│   │   ├── AlarmOverlay.jsx
│   │   └── EmptyState.jsx
│   ├── hooks/
│   │   └── useReminders.js
│   ├── utils/
│   │   └── dateUtils.js
│   ├── App.jsx
│   └── index.css
├── android/              ← Capacitor Android project
├── electron.cjs          ← Electron main process
├── preload.cjs           ← Electron preload bridge
├── capacitor.config.ts
└── package.json
```
