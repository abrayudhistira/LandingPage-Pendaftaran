# PRD — Ambarsan Legal Registration & Data Collection

## 1. Ringkasan Produk

Landing page resmi untuk kebutuhan pendaftaran dan pendataan program hukum/pendidikan hukum Ambarsan. Halaman utama berfungsi sebagai direktori program yang membantu pengunjung menemukan program yang relevan, membaca detail singkat, lalu diarahkan ke formulir eksternal melalui link Bitly.

Produk ini **bukan** aplikasi pengisian formulir internal. Seluruh pengumpulan data dilakukan pada halaman/formulir eksternal yang dituju oleh tombol CTA.

## 2. Tujuan

- Menyediakan satu pintu informasi untuk seluruh program pendaftaran dan pendataan.
- Memisahkan program berdasarkan status: **Pendaftaran Baru** dan **Pendataan Ulang**.
- Memberi detail yang cukup sebelum pengunjung berpindah ke formulir eksternal.
- Meningkatkan kejelasan, kredibilitas, dan kemudahan akses pada perangkat mobile.
- Menyediakan fondasi visual yang dapat digunakan dalam mode light dan dark.

## 3. Sasaran Pengguna

- Advokat dan calon advokat.
- Praktisi hukum yang ingin mengikuti pelatihan atau sertifikasi.
- Peserta program pendidikan hukum.
- Alumni atau peserta lama yang perlu melakukan pendataan ulang.
- Pengunjung dari poster, media sosial, atau tautan kampanye.

## 4. Ruang Lingkup MVP

### 4.1 Halaman yang dibutuhkan

1. **Landing page / direktori program**
   - Header dengan identitas Ambarsan.
   - Hero singkat: ajakan untuk mendaftar atau memperbarui data.
   - Dua kategori utama: Pendaftaran Baru dan Pendataan Ulang.
   - Kartu program yang dapat dibuka ke detail.
   - FAQ singkat atau panduan sebelum mengisi formulir.
   - Footer dengan kontak/identitas organisasi.

2. **Detail program**
   - Nama program.
   - Kategori/status program.
   - Deskripsi singkat.
   - Target peserta.
   - Informasi tindakan yang harus dilakukan.
   - CTA "Daftar Sekarang" atau "Isi Pendataan Ulang".
   - CTA membuka link Bitly di tab baru.
   - State untuk link belum tersedia: tombol nonaktif dengan label "Link segera tersedia".

### 4.2 Daftar program — Pendaftaran Baru

| Program | Link |
|---|---|
| Pendidikan Kompetensi Kemahiran Menangani Perkara Perdata | https://bit.ly/PERDATAMahir1 |
| Advokat Pajak | https://bit.ly/ADVPajak1 |
| Likuidator | https://bit.ly/LIKUIDATORMahir1 |
| Omnibus Law | https://bit.ly/OMNIBUSLAW1 |
| Advokat Medis 3 | https://bit.ly/ADVMEDIS3 |
| PKPA 1 | **TBD — link belum diberikan** |

### 4.3 Daftar program — Pendataan Ulang

| Program | Link |
|---|---|
| Kepailitan | **TBD — link belum diberikan** |
| Mediator | **TBD — link belum diberikan** |
| Advokat Medis 2 | https://bit.ly/ADVMEDIS2 |

> Link Bitly yang belum tersedia harus dikonfirmasi sebelum publikasi. Jangan menebak atau membuat link baru.

## 5. User Stories

- Sebagai pengunjung, saya ingin memahami tujuan halaman agar tahu apakah saya perlu mendaftar atau memperbarui data.
- Sebagai calon peserta, saya ingin melihat daftar program pendaftaran baru beserta detailnya.
- Sebagai peserta lama, saya ingin menemukan program pendataan ulang dengan cepat.
- Sebagai pengunjung mobile, saya ingin tombol CTA mudah ditemukan dan ditekan.
- Sebagai pengelola, saya ingin dapat menandai link yang belum tersedia tanpa merusak pengalaman pengguna.

## 6. Alur Pengguna Utama

1. Pengunjung membuka landing page.
2. Pengunjung memilih kategori: Pendaftaran Baru atau Pendataan Ulang.
3. Pengunjung memilih kartu program.
4. Sistem menampilkan detail program.
5. Pengunjung menekan CTA.
6. Sistem membuka link Bitly di tab baru.
7. Pengunjung menyelesaikan formulir eksternal.

## 7. Persyaratan Fungsional

- Program ditampilkan dalam kategori yang jelas.
- Setiap kartu memiliki nama, ringkasan, status, dan CTA.
- Detail program dapat diakses melalui route/section yang stabil dan dapat dibagikan.
- Link eksternal dibuka dengan `target="_blank"` dan `rel="noopener noreferrer"`.
- Link yang belum ada tidak boleh menjadi link palsu atau mengarah ke halaman kosong.
- Mode tema dapat mengikuti preferensi sistem dan memiliki toggle manual.
- Navigasi keyboard, focus state, dan kontras warna harus dipastikan.
- Halaman harus responsif untuk mobile, tablet, dan desktop.

## 8. Persyaratan Non-Fungsional

- Bahasa utama: Bahasa Indonesia.
- Tone: profesional, tepercaya, ringkas, dan membantu.
- Performa: konten utama tampil cepat tanpa aset berat yang tidak perlu.
- SEO dasar: title, description, heading hierarchy, dan metadata sosial.
- Aksesibilitas: semantic HTML, label CTA yang jelas, kontras WCAG yang memadai, dan tidak mengandalkan warna saja.
- Keamanan: jangan mengumpulkan data pribadi pada landing page; jangan menyimpan data formulir eksternal.

## 9. Konten Awal

**Hero headline:**
> Pendaftaran dan Pendataan Program Ambarsan

**Hero supporting copy:**
> Temukan program yang sesuai, baca informasinya, lalu lanjutkan ke formulir pendaftaran atau pendataan melalui tautan resmi.

**Trust note:**
> Pastikan data yang Anda masukkan pada formulir eksternal sudah benar sebelum dikirim.

## 10. Acceptance Criteria MVP

- [ ] Semua program yang link-nya tersedia tampil pada kategori yang benar.
- [ ] PKPA 1, Kepailitan, dan Mediator diberi status TBD sampai link dikonfirmasi.
- [ ] Setiap program memiliki detail dan CTA yang sesuai.
- [ ] CTA aktif membuka Bitly yang tepat di tab baru.
- [ ] Landing page dapat digunakan pada lebar layar mobile tanpa horizontal scroll.
- [ ] Light mode dan dark mode memiliki kontras teks/CTA yang terbaca.
- [ ] Navigasi utama dan tombol dapat digunakan dengan keyboard.
- [ ] Metadata dasar halaman tersedia.

## 11. Di Luar Scope MVP

- Formulir internal.
- Dashboard admin.
- Autentikasi pengguna.
- Pembayaran online.
- Integrasi database peserta.
- Pelacakan data pribadi pengunjung.

## 12. Pertanyaan Terbuka

1. Apa link Bitly untuk PKPA 1?
2. Apa link Bitly untuk pendataan ulang Kepailitan?
3. Apa link Bitly untuk pendataan ulang Mediator?
4. Apakah nama resmi organisasi, logo, alamat, email, dan nomor kontak perlu ditampilkan?
5. Apakah detail tiap program memiliki jadwal, biaya, narahubung, atau persyaratan tambahan?
6. Apakah seluruh detail dibuka sebagai route terpisah atau modal/accordion pada satu halaman?
