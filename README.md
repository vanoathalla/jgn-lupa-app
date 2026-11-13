# Jgn Lupa App 🔔

App pengingat yang simpel, keren, dan bisa di-install.

## Stack
- React + Vite
- Tailwind CSS + Framer Motion
- Electron (build .exe untuk Windows)

## Cara Jalanin (Dev Mode)

### Web / Preview
```bash
npm run dev
```
Buka `http://localhost:5173`

### Desktop (Electron)
Terminal 1:
```bash
npm run dev
```
Terminal 2:
```bash
npm run electron:dev
```

## Build

### Build .exe (Windows Installer)
```bash
npm run electron:build
```
Output ada di folder `dist-electron/`

## Fitur
- ✅ Tambah / edit / hapus reminder
- 🔔 Notifikasi otomatis saat waktu tiba
- 📂 Kategori: Pribadi, Kerja, Kesehatan, Belanja, Lainnya
- 🔄 Pengulangan: harian, mingguan, bulanan
- 🌙 Dark mode penuh
- 💾 Data tersimpan lokal (localStorage)
