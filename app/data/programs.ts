export type ProgramCategory = "Pendaftaran Baru" | "Pendataan Ulang";

export type Program = {
  slug: string;
  name: string;
  category: ProgramCategory;
  summary: string;
  detail: string;
  audience: string;
  url?: string;
};

export const programs: Program[] = [
  {
    slug: "perdata-mahir",
    name: "Pendidikan Kompetensi Kemahiran Menangani Perkara Perdata",
    category: "Pendaftaran Baru",
    summary: "Perkuat kesiapan dan kemahiran dalam menangani perkara perdata.",
    detail: "Program pembelajaran untuk peserta yang ingin mengembangkan kompetensi praktis dalam menangani perkara perdata secara lebih terstruktur.",
    audience: "Praktisi hukum dan peserta yang ingin memperdalam perkara perdata.",
  },
  {
    slug: "advokat-pajak",
    name: "Advokat Pajak",
    category: "Pendaftaran Baru",
    summary: "Bangun pemahaman dan kesiapan praktik pada bidang hukum pajak.",
    detail: "Ruang belajar bagi calon dan praktisi hukum yang ingin mengembangkan fokus keahlian pada isu hukum perpajakan.",
    audience: "Advokat, calon advokat, dan praktisi yang fokus pada pajak.",
  },
  {
    slug: "likuidator-mahir",
    name: "Likuidator",
    category: "Pendaftaran Baru",
    summary: "Kenali kompetensi yang diperlukan untuk menjalankan peran likuidator.",
    detail: "Program pengembangan kompetensi untuk peserta yang ingin memahami proses dan tanggung jawab dalam pelaksanaan likuidasi.",
    audience: "Praktisi hukum dan profesional yang menekuni likuidasi.",
  },
  {
    slug: "omnibuslaw",
    name: "Omnibus Law",
    category: "Pendaftaran Baru",
    summary: "Pelajari perkembangan dan implikasi hukum dari omnibus law.",
    detail: "Program untuk memperbarui perspektif dan pemahaman terhadap perubahan regulasi serta dampaknya bagi praktik hukum.",
    audience: "Praktisi, akademisi, dan peserta yang mengikuti perkembangan regulasi.",
  },
  {
    slug: "advokat-medis-3",
    name: "Advokat Medis 3",
    category: "Pendaftaran Baru",
    summary: "Perluas wawasan pada isu hukum dan praktik advokasi medis.",
    detail: "Program lanjutan bagi peserta yang ingin memahami dinamika pendampingan dan advokasi pada bidang medis.",
    audience: "Praktisi hukum dan peserta yang tertarik pada hukum kesehatan.",
  },
  {
    slug: "pkpa-1",
    name: "PKPA 1",
    category: "Pendaftaran Baru",
    summary: "Informasi pendaftaran PKPA 1 akan tersedia melalui halaman ini.",
    detail: "Tautan formulir untuk program ini belum diberikan. Silakan kembali setelah informasi pendaftaran resmi tersedia.",
    audience: "Calon peserta PKPA 1.",
  },
  {
    slug: "kepailitan",
    name: "Kepailitan",
    category: "Pendataan Ulang",
    summary: "Perbarui data Anda untuk kebutuhan pendataan program kepailitan.",
    detail: "Gunakan pendataan ulang untuk memastikan informasi peserta pada program kepailitan tetap akurat dan terkini.",
    audience: "Peserta atau alumni program kepailitan.",
  },
  {
    slug: "mediator",
    name: "Mediator",
    category: "Pendataan Ulang",
    summary: "Pastikan data Anda tetap tercatat dan relevan pada program mediator.",
    detail: "Pendataan ulang membantu memastikan informasi peserta atau alumni program mediator tetap sesuai dengan kondisi terbaru.",
    audience: "Peserta atau alumni program mediator.",
  },
  {
    slug: "advokat-medis-2",
    name: "Advokat Medis 2",
    category: "Pendataan Ulang",
    summary: "Perbarui data peserta pada program Advokat Medis 2.",
    detail: "Lengkapi pendataan ulang untuk membantu menjaga keakuratan informasi peserta program Advokat Medis 2.",
    audience: "Peserta atau alumni Advokat Medis 2.",
    url: "https://forms.gle/5Yc2uyLB6BAPEahr5",
  },
];
