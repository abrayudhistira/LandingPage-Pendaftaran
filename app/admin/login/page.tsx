"use client";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(""); const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }); if (response.ok) router.push("/admin"); else setError("Email atau password tidak valid."); setLoading(false); }
  return <main className="admin-auth"><div className="admin-auth-brand"><Link className="brand" href="/"><Image className="brand-icon" src="/app-icon.png" alt="" width={40} height={40} priority /><span><strong>Akademi Professional Legal</strong><small>pendidikan &amp; advokasi hukum</small></span></Link><p>Ruang kerja yang tenang untuk menjaga data tetap tertata.</p></div><div className="admin-auth-card"><p className="eyebrow">Ambarsan · Admin</p><h1>Selamat datang kembali.</h1><p className="auth-copy">Masuk untuk mengelola pendataan dan pendaftaran ulang.</p><form onSubmit={submit}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-primary button-wide" disabled={loading}>{loading ? "Memeriksa..." : "Masuk ke dashboard"}</button></form><Link className="back-link" href="/">← Kembali ke halaman utama</Link></div></main>;
}
