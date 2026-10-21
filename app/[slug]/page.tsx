import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getProgram } from "@/lib/program-store";
import { programs as defaultPrograms } from "@/app/data/programs";

export async function generateStaticParams() {
	return defaultPrograms.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	await connection();
	const program = await getProgram(slug);
	return {
		title: program ? `${program.name} | Akademi Professional Legal` : "Program tidak ditemukan | Akademi Professional Legal",
		description: program?.summary ?? "Program Akademi Professional Legal.",
	};
}

export default function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	return (
		<Suspense fallback={<ProgramDetailLoading />}>
			<ProgramDetailContent params={params} />
		</Suspense>
	);
}

async function ProgramDetailContent({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	await connection();
	const program = await getProgram(slug);
	if (!program) notFound();

	return (
		<main className="program-detail-page">
			<header className="site-header program-detail-header">
				<Link className="brand" href="/">
					<Image className="brand-icon" src="/app-icon.png" alt="" width={40} height={40} priority />
					<span><strong>Akademi Professional Legal</strong><small>pendidikan &amp; advokasi hukum</small></span>
				</Link>
			</header>
			<section className="program-detail-hero shell">
				<div>
					<Link className="button button-secondary back-btn" href="/#pendaftaran-baru">← Semua program</Link>
					<p className="eyebrow">{program.category}</p>
					<h1>{program.name}</h1>
					<p className="hero-text">{program.summary}</p>
				</div>
				<aside className="detail-panel">
					<p className="eyebrow">Detail program</p>
					<p>{program.detail}</p>
					<div className="audience"><span className="mini-label">Cocok untuk</span><strong>{program.audience}</strong></div>
					{program.url ? (
						<a className="button button-primary button-wide" href={program.url} target="_blank" rel="noopener noreferrer">Buka formulir resmi <ArrowUpRight /></a>
					) : (
						<div className="unavailable"><span className="status-symbol">—</span><span><strong>Link formulir segera tersedia</strong><small>Silakan kembali lagi setelah tautan resmi diberikan.</small></span></div>
					)}
				</aside>
			</section>
			{program.benefitEnabled && program.benefitText && (
				<section className="benefit-section shell" aria-labelledby="benefit-title">
					<div className="benefit-card">
						<div><p className="eyebrow">Benefit program</p><h2 id="benefit-title">Yang Anda dapatkan.</h2><p>{program.benefitText}</p></div>
						{program.benefitImage && <Image className="benefit-image" src={program.benefitImage} alt={`Lampiran benefit ${program.name}`} width={520} height={340} />}
					</div>
				</section>
			)}
		</main>
	);
}

function ProgramDetailLoading() {
	return (
		<main className="program-detail-page">
			<section className="program-detail-hero shell" aria-busy="true">
				<p className="eyebrow">Menyiapkan detail program...</p>
			</section>
		</main>
	);
}

function ArrowUpRight() {
	return (
		<svg aria-hidden="true" viewBox="0 0 16 16" className="icon" fill="none">
			<path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}
