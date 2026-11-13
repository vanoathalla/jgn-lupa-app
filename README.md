# Jgn Lupa 🔔

Aplikasi pengingat harian yang simpel, keren, dan bisa dipasang langsung di laptop maupun HP Android. Project ini dibuat dengan React + Electron + Capacitor, dan fokus pada pengingat jadwal yang aktif di background.

## Fitur utama
- Tambah pengingat dengan judul, catatan, tanggal, dan waktu
- Notifikasi alarm dengan suara dan popup otomatis
- Alarm tetap aktif saat aplikasi diminimalkan ke tray pada Windows
- Kategori: Pribadi, Kerja, Kesehatan, Belanja, Lainnya
- Pengulangan: tidak berulang, harian, mingguan, bulanan
- Tandai selesai, edit, dan hapus reminder
- Ringkasan statistik total, aktif, selesai, dan terlewat
- Layout responsif untuk desktop dan mobile
- Dark mode penuh

## Instalasi di Windows (.exe)

1. Download file `Jgn Lupa Setup 1.0.0.exe` dari [Releases](https://github.com/vanoathalla/jgn-lupa-app/releases)
2. Jalankan installer
3. Jika muncul peringatan SmartScreen, klik **More info** lalu **Run anyway**
4. Ikuti wizard instalasi hingga selesai
5. Aplikasi akan masuk ke system tray di pojok kanan bawah

> Klik tombol X hanya akan meminimalkan ke tray. Untuk keluar sepenuhnya, klik kanan pada ikon tray lalu pilih **Keluar**.

## Instalasi di Android (.apk)

1. Download file `app-debug.apk` dari [Releases](https://github.com/vanoathalla/jgn-lupa-app/releases)
2. Pindahkan file ke HP
3. Buka file APK dan izinkan instalasi dari sumber tidak dikenal jika diminta
4. Tap **Install** dan tunggu hingga selesai

## Menjalankan dari source code

### Prasyarat
- Node.js v18+
- npm v9+

### Install dependency

```bash
npm install
```

### Jalankan aplikasi

```bash
npm run dev
```

### Build aplikasi

```bash
npm run build
```

Untuk mode desktop/Electron atau build Android/iOS, sesuaikan dengan konfigurasi project yang tersedia pada repository ini.
