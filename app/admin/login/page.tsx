"use client";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function EyeIcon({ show }: { show: boolean }) {
	return show ? (
		<svg aria-hidden="true" viewBox="0 0 16 16" className="icon" fill="none">
			<path d="M1 1l14 14M4.5 4.5A4.5 4.5 0 0 1 12 8a4.3 4.3 0 0 1-.86 2.66L4.5 4.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			<path d="M1 1l14 14M4.5 4.5A4.5 4.5 0 0 1 12 8a4.3 4.3 0 0 1-.86 2.66L4.5 4.5Z" fill="currentColor" />
		</svg>
	) : (
		<svg aria-hidden="true" viewBox="0 0 16 16" className="icon" fill="none">
			<path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5Z" stroke="currentColor" strokeWidth="1.3" />
			<circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
		</svg>
	);
}

export default function AdminLogin() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function submit(event: FormEvent) {
		event.preventDefault();
		setLoading(true);
		setError("");
		const response = await fetch("/api/admin/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		if (response.ok) router.push("/admin");
		else setError("Email atau password tidak valid.");
		setLoading(false);
	}

	return (
		<main className="admin-auth">
			<div className="admin-auth-brand">
				<Link className="brand" href="/">
					<Image className="brand-icon" src="/app-icon.png" alt="" width={40} height={40} priority />
					<span><strong>Akademi Profesional Legal</strong><small>pendidikan &amp; advokasi hukum</small></span>
				</Link>
				<p>Hendaklah keadilan ditegakkan walaupun langit runtuh.</p>
			</div>
			<div className="admin-auth-card">
				<p className="eyebrow">Fiat Justitia Ruat Caelum</p>
				<h1>Selamat datang kembali.</h1>
				<p className="auth-copy">Masuk untuk mengelola pendataan dan pendaftaran ulang.</p>
				<form onSubmit={submit}>
					<label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>

					<label>Password
						<div className="password-field">
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
								autoComplete="current-password"
							/>
							<button
								type="button"
								className="password-toggle"
								onClick={() => setShowPassword((prev) => !prev)}
								aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
								aria-pressed={showPassword}
							>
								<EyeIcon show={showPassword} />
							</button>
						</div>
					</label>

					{error && <p className="form-error">{error}</p>}
					<button className="button button-primary button-wide" disabled={loading}>
						{loading ? "Memeriksa..." : "Masuk ke dashboard"}
					</button>
				</form>
				<Link className="back-link" href="/">← Kembali ke halaman utama</Link>
			</div>
		</main>
	);
}
