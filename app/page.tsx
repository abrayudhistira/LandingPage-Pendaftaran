"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { programs as defaultPrograms, type Program, type ProgramCategory } from "./data/programs";

const categories: ProgramCategory[] = ["Pendaftaran Baru", "Pendataan Ulang"];

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="icon" fill="none">
      <path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThemeIcon({ theme }: { theme: "light" | "dark" }) {
  return theme === "dark" ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="icon" fill="none">
      <path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="icon" fill="none">
      <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 1.8v2M10 16.2v2M18.2 10h-2M3.8 10h-2M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4M15.8 15.8l-1.4-1.4M5.6 5.6 4.2 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return <HomeContent programs={defaultPrograms} />;
}

function HomeContent({ programs }: { programs: Program[] }) {
  const [activeCategory, setActiveCategory] = useState<ProgramCategory>("Pendaftaran Baru");
  const [selectedSlug, setSelectedSlug] = useState("perdata-mahir");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const storedTheme = window.localStorage.getItem("ambarsan-theme");
    return storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  });

  const visiblePrograms = useMemo(
    () => programs.filter((program) => program.category === activeCategory),
    [activeCategory, programs],
  );
  const selectedProgram = programs.find((program) => program.slug === selectedSlug) ?? visiblePrograms[0];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function changeTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("ambarsan-theme", nextTheme);
  }

  function selectCategory(category: ProgramCategory) {
    setActiveCategory(category);
    const firstProgram = programs.find((program) => program.category === category);
    if (firstProgram) setSelectedSlug(firstProgram.slug);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#beranda" aria-label="Ambarsan, kembali ke beranda">
          <Image className="brand-icon" src="/app-icon.png" alt="" width={40} height={40} priority />
          <span>
            <strong>Akademi Professional Legal</strong>
            <small>pendidikan &amp; advokasi hukum</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          <a href="#beranda">Beranda</a>
          <a href="#pendaftaran-baru">Program</a>
          <a href="#panduan">Panduan</a>
        </nav>
        <button className="theme-toggle" type="button" onClick={changeTheme} aria-label={`Aktifkan mode ${theme === "light" ? "gelap" : "terang"}`}>
          <ThemeIcon theme={theme} />
          <span>{theme === "light" ? "Mode gelap" : "Mode terang"}</span>
        </button>
      </header>

      <section className="hero shell" id="beranda">
        <div className="hero-copy">
          <p className="eyebrow">Layanan pendaftaran &amp; pendataan</p>
          <h1>Ruang tumbuh bagi profesional hukum.</h1>
          <p className="hero-text">Temukan program yang sesuai, baca informasinya, lalu lanjutkan ke formulir resmi untuk mendaftar atau memperbarui data Anda.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#pendaftaran-baru">Lihat program <span>↓</span></a>
            <a className="text-link" href="#panduan">Cara menggunakan <span>→</span></a>
          </div>
          <div className="trust-line"><span className="trust-dot" /> Informasi ringkas dengan tautan formulir terkurasi</div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-ring art-ring-one" />
          <div className="art-ring art-ring-two" />
          <div className="art-cross">✦</div>
          <div className="art-panel"><Image src="/app-icon.png" alt="" width={92} height={92} /><small>PROFESSIONAL LEGAL</small></div>
          <div className="art-caption">Keadilan<br />dengan keahlian.</div>
        </div>
      </section>

      <section className="program-section shell" id="pendaftaran-baru">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Pilih kebutuhan Anda</p>
            <h2>Program yang tersedia</h2>
          </div>
          <p className="section-intro">Satu halaman untuk menemukan langkah berikutnya dengan lebih jelas.</p>
        </div>
        <div className="category-tabs" role="tablist" aria-label="Kategori program">
          {categories.map((category) => (
            <button key={category} type="button" role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? "tab active" : "tab"} onClick={() => selectCategory(category)}>
              <span className="tab-index">0{categories.indexOf(category) + 1}</span>{category}
            </button>
          ))}
        </div>
        <div className="program-layout">
          <div className="program-grid" aria-live="polite">
            {visiblePrograms.map((program, index) => (
              <article className={selectedProgram?.slug === program.slug ? "program-card selected" : "program-card"} key={program.slug}>
                <div className="card-topline"><span>0{index + 1}</span><span className="card-status">{program.url ? "Pendaftaran dibuka" : "Segera tersedia"}</span></div>
                <h3>{program.name}</h3>
                <p>{program.summary}</p>
                <div className="card-footer">
                  <button type="button" className="detail-link" onClick={() => { setSelectedSlug(program.slug); document.getElementById("detail-program")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>Lihat detail <span>→</span></button>
                  <span className="card-arrow">↗</span>
                </div>
              </article>
            ))}
          </div>
          {selectedProgram && (
            <aside className="detail-panel" id="detail-program" aria-label={`Detail ${selectedProgram.name}`}>
              <p className="eyebrow">Detail program</p>
              <h2>{selectedProgram.name}</h2>
              <p>{selectedProgram.detail}</p>
              <div className="audience"><span className="mini-label">Cocok untuk</span><strong>{selectedProgram.audience}</strong></div>
              {selectedProgram.url ? (
                <a className="button button-primary button-wide" href={selectedProgram.url} target="_blank" rel="noopener noreferrer">Buka formulir resmi <ArrowUpRight /></a>
              ) : (
                <div className="unavailable"><span className="status-symbol">—</span><span><strong>Link formulir segera tersedia</strong><small>Silakan kembali lagi setelah tautan resmi diberikan.</small></span></div>
              )}
            </aside>
          )}
        </div>
      </section>

      <section className="guide-section shell" id="panduan">
        <div className="guide-card">
          <div><p className="eyebrow">Panduan singkat</p><h2>Mulai dari kebutuhan Anda.</h2></div>
          <div className="guide-steps"><div><span>01</span><strong>Pilih kategori</strong><p>Tentukan apakah Anda ingin mendaftar baru atau memperbarui data.</p></div><div><span>02</span><strong>Baca detail</strong><p>Kenali tujuan program dan siapa yang paling sesuai mengikutinya.</p></div><div><span>03</span><strong>Lanjutkan ke formulir</strong><p>Tekan tombol CTA untuk membuka formulir pada halaman eksternal.</p></div></div>
        </div>
      </section>

      <section className="faq-section shell">
        <div><p className="eyebrow">Pertanyaan umum</p><h2>Yang perlu diketahui.</h2></div>
        <div className="faq-list"><details><summary>Apa perbedaan pendaftaran baru dan pendataan ulang?</summary><p>Pendaftaran baru ditujukan bagi calon peserta, sedangkan pendataan ulang ditujukan bagi peserta atau alumni yang perlu memperbarui informasi.</p></details><details><summary>Ke mana saya diarahkan setelah menekan tombol?</summary><p>Anda akan diarahkan ke formulir eksternal resmi melalui tautan Bitly yang sesuai dengan program pilihan Anda.</p></details><details><summary>Apa yang perlu disiapkan sebelum mengisi formulir?</summary><p>Siapkan informasi identitas dan data pendukung yang relevan. Pastikan seluruh data sudah benar sebelum dikirim.</p></details></div>
      </section>

      <footer className="site-footer shell"><div className="brand footer-brand"><Image className="brand-icon" src="/app-icon.png" alt="" width={40} height={40} /><span><strong>Akademi Professional Legal</strong><small>pendidikan &amp; advokasi hukum</small></span></div><p>Informasi pendaftaran dan pendataan program Akademi Professional Legal.</p><small>© 2026 Akademi Professional Legal. Tautan formulir mengarah ke layanan eksternal.</small></footer>
    </main>
  );
}
