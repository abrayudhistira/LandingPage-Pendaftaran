# Design Spec — Ambarsan Legal Registration & Data Collection

## 1. Arah Visual

Gunakan estetika law firm yang profesional, kredibel, dan tenang: editorial, rapi, dan tidak terasa seperti portal promosi agresif. Komposisi memadukan latar netral, aksen emas sebagai penanda otoritas, dan maroon sebagai CTA utama.

Prinsip visual:

- **Trust first:** ruang kosong cukup, grid rapi, tipografi tegas.
- **Clarity over decoration:** program dan CTA menjadi fokus utama.
- **Editorial legal:** heading serif yang berwibawa dipadukan dengan body sans-serif yang mudah dibaca.
- **Progressive disclosure:** landing page ringkas; detail program muncul setelah program dipilih.
- **Accessible by default:** jangan gunakan emas atau maroon sebagai satu-satunya pembeda status.

## 2. Palet Warna

### Light mode

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-bg` | `#F8F9FA` | Background utama |
| `--color-surface` | `#FFFFFF` | Kartu, panel, header |
| `--color-text-primary` | `#212121` | Heading dan teks utama |
| `--color-text-secondary` | `#424242` | Body text dan deskripsi |
| `--color-accent` | `#8B0000` | Button, link aktif, aksen |
| `--color-accent-hover` | `#6F0000` | Hover/focus button |
| `--color-gold` | `#B8860B` | Border, eyebrow, icon, highlight |
| `--color-border` | `#E3E5E8` | Border dan divider |
| `--color-muted` | `#F0F1F2` | Background badge dan state sekunder |

### Dark mode

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-bg` | `#121212` | Background utama |
| `--color-surface` | `#1E1E1E` | Kartu, panel, header |
| `--color-text-primary` | `#FFD700` | Heading/header utama |
| `--color-text-secondary` | `#E0E0E0` | Body text |
| `--color-accent` | `#B71C1C` | Button, banner, link aktif |
| `--color-accent-hover` | `#D32F2F` | Hover/focus button |
| `--color-gold` | `#FFC107` | Highlight, border, warning |
| `--color-border` | `#3A3A3A` | Border dan divider |
| `--color-muted` | `#292929` | Background badge dan state sekunder |

> Catatan aksesibilitas: heading emas pada dark mode perlu diuji pada ukuran aktual. Untuk body text, gunakan `#E0E0E0`; jangan gunakan emas untuk paragraf panjang.

## 3. Tipografi

- **Display / heading:** `Cormorant Garamond` atau `Playfair Display`, serif. Memberi kesan legal, premium, dan editorial.
- **Body / UI:** `Inter` atau `Manrope`, sans-serif. Dipakai untuk navigasi, label, deskripsi, dan button.
- Maksimal dua keluarga font.
- H1 desktop: 52–64px, line-height 1.05.
- H1 mobile: 38–44px, line-height 1.1.
- H2: 32–40px.
- Body: 16–18px, line-height 1.6.
- Caption/eyebrow: 12–14px, letter-spacing 0.08em, uppercase secukupnya.

## 4. Struktur Halaman

### 4.1 Header

- Logo/nama Ambarsan di kiri.
- Navigasi anchor: `Beranda`, `Pendaftaran Baru`, `Pendataan Ulang`.
- Theme toggle di kanan dengan label/tooltip yang jelas.
- Pada mobile: nav menjadi menu sederhana atau anchor horizontal yang tidak overflow.
- Header sticky boleh digunakan, tetapi tidak boleh menutupi heading saat navigasi anchor.

### 4.2 Hero

- Layout dua kolom pada desktop, satu kolom pada mobile.
- Kiri: eyebrow `LAYANAN PENDAFTARAN & PENDATAAN`, H1, deskripsi, dua CTA kategori.
- Kanan: panel visual abstrak bertema legal—misalnya monogram, garis geometris, atau bidang maroon/emas. Hindari stok foto generik ruang sidang.
- Tambahkan trust line kecil, misalnya `Informasi resmi dan tautan formulir terkurasi`.

### 4.3 Category selector

Dua tab/segmented control:

- `Pendaftaran Baru` — aksen maroon.
- `Pendataan Ulang` — aksen emas dengan teks kontras.

Pada mobile, selector dibuat full width dengan target sentuh minimal 44px.

### 4.4 Program grid

- Desktop: 3 kolom.
- Tablet: 2 kolom.
- Mobile: 1 kolom.
- Setiap kartu berisi:
  - badge kategori/status;
  - nomor atau simbol kecil;
  - nama program;
  - ringkasan maksimal 2–3 baris;
  - link teks `Lihat detail`;
  - CTA utama.
- Hover: elevasi kecil, border emas, dan transform maksimal 2px.
- Jangan membuat seluruh kartu terlihat seperti button jika ada dua aksi berbeda.

### 4.5 Detail program

Bisa berupa route terpisah atau detail panel; rekomendasi MVP: route/section dengan URL yang bisa dibagikan.

- Breadcrumb: `Beranda / Pendaftaran Baru / Nama Program`.
- Label status.
- Judul besar.
- Deskripsi dan poin `Cocok untuk Anda jika...`.
- Panel CTA yang selalu terlihat setelah konten pengantar.
- Tombol aktif: `Daftar Sekarang` atau `Isi Pendataan Ulang`.
- Tombol sekunder: `Kembali ke daftar program`.
- Jika link TBD: gunakan state disabled dengan copy `Link formulir akan segera tersedia` dan tampilkan informasi tanpa CTA palsu.

### 4.6 FAQ / panduan

Pertanyaan ringkas:

- Apa perbedaan pendaftaran baru dan pendataan ulang?
- Ke mana saya akan diarahkan setelah menekan tombol?
- Apa yang perlu disiapkan sebelum mengisi formulir?
- Bagaimana jika link program belum tersedia?

Gunakan accordion native/accessible, satu pertanyaan per baris.

### 4.7 Footer

- Nama Ambarsan.
- Kalimat singkat tentang fungsi halaman.
- Kontak resmi jika sudah tersedia.
- Copyright.
- Disclaimer: `Tautan formulir mengarah ke layanan eksternal.`

## 5. Komponen dan States

### Button

- Primary: background accent, teks putih/off-white, radius 8px, tinggi minimum 44px.
- Secondary: transparent, border gold/accent, teks mengikuti mode.
- Focus: outline 3px dengan warna gold/amber dan offset 2px.
- Disabled/TBD: opacity tidak boleh menjadi satu-satunya indikator; tambahkan label status.

### Card

- Surface dengan border 1px.
- Radius 16px untuk kartu program.
- Padding desktop 24px, mobile 20px.
- Heading kartu minimal 20px agar nama program panjang tetap mudah dipindai.

### Badge

- `Pendaftaran Baru`: maroon tint.
- `Pendataan Ulang`: gold/amber tint.
- `Link segera tersedia`: muted background + ikon/status teks.

### Iconography

Gunakan ikon outline sederhana: arrow-up-right, clipboard, file-text, refresh, shield-check. Hindari ikon palu/gavel besar yang klise sebagai dekorasi utama.

## 6. Layout Tokens

- Max content width: 1180–1240px.
- Side gutter desktop: 40px.
- Side gutter mobile: 20px.
- Section vertical spacing desktop: 96–128px.
- Section vertical spacing mobile: 64–80px.
- Grid gap: 20–24px.
- Border radius: 8px button, 12px panel, 16px card, 24px hero panel.
- Touch target minimum: 44×44px.

## 7. Motion dan Interaksi

- Page load: gunakan fade/translate ringan hanya jika tidak mengganggu aksesibilitas.
- Hover/focus transition: 150–200ms.
- Respect `prefers-reduced-motion: reduce`.
- Saat CTA eksternal ditekan, jangan gunakan loading palsu; cukup buka tab baru.
- Filter kategori harus menjaga posisi scroll dan memberi state aktif yang jelas.

## 8. Responsive Behavior

- **Mobile < 640px:** satu kolom, CTA full width, header ringkas, panel visual hero di bawah copy.
- **Tablet 640–1024px:** dua kolom kartu, hero dapat tetap satu kolom jika judul terlalu panjang.
- **Desktop > 1024px:** tiga kolom kartu, dua kolom hero, sticky header.
- Pastikan URL Bitly tidak memaksa overflow; tampilkan sebagai aksi, bukan URL panjang.

## 9. Copywriting Guidance

Gunakan kata kerja yang jelas dan tidak menjanjikan sesuatu yang tidak tersedia:

- `Lihat Detail`
- `Daftar Sekarang`
- `Isi Pendataan Ulang`
- `Buka Formulir`
- `Link formulir segera tersedia`

Hindari:

- copy yang terlalu formal atau bertele-tele;
- klaim sertifikasi/akreditasi yang belum dikonfirmasi;
- menyebut program sebagai tersedia jika link belum diberikan.

## 10. Accessibility Checklist

- [ ] Kontras teks dan background diuji pada light/dark mode.
- [ ] Semua gambar/dekorasi memiliki alt kosong jika ornamental.
- [ ] Heading berurutan dan hanya satu H1 pada landing page.
- [ ] Tombol/link memiliki nama yang bermakna.
- [ ] Focus ring terlihat pada keyboard.
- [ ] Accordion dan theme toggle dapat digunakan tanpa mouse.
- [ ] Tidak ada informasi yang hanya dibedakan lewat warna.
- [ ] `target="_blank"` disertai konteks bahwa link membuka halaman eksternal.

## 11. Acceptance Visual

- Tampilan terasa seperti layanan profesional law firm, bukan template SaaS generik.
- Pengunjung dapat membedakan dua kategori dalam kurang dari 3 detik.
- Program dengan link aktif dan link TBD dapat dibedakan dengan jelas.
- CTA utama terlihat tanpa harus membaca seluruh halaman.
- Tampilan tetap seimbang pada mobile dan desktop.
