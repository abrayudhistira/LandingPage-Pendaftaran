"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Program, ProgramCategory } from "@/app/data/programs";

function EditIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 16 16" className="icon" fill="none">
			<path d="M12.5 3.5 3.25 12.75 2 14l1.25-1.25L12.5 4.5M8.75 2.25a2 2 0 0 1 2.83 0l.47.47a2 2 0 0 1 0 2.83l-7.5 7.5A2 2 0 0 1 3.25 14.5H.75a.75.75 0 0 1-.75-.75v-2.5a2 2 0 0 1 .59-1.42l7.5-7.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function DeleteIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 16 16" className="icon" fill="none">
			<path d="M3 4.5h10M6 6.5v5M10 6.5v5M5 4.5l1-3h4l1 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
			<rect x="2" y="4.5" width="12" height="1" rx="0.5" fill="currentColor" />
			<rect x="3.5" y="5.5" width="9" height="8.5" rx="1" stroke="currentColor" strokeWidth="1" />
		</svg>
	);
}

function CheckIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 16 16" className="icon" fill="none">
			<path d="M3 8.5 6.5 12 13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function WarningIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 16 16" className="icon" fill="none">
			<path d="M8 2 1.5 14h13L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M8 6v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

type ProgramItem = Program;
const blank: ProgramItem = { slug: "program-baru", name: "", category: "Pendaftaran Baru", summary: "", detail: "", audience: "", url: "" };
const categories: ProgramCategory[] = ["Pendaftaran Baru", "Pendataan Ulang"];

type ToastType = "success" | "error";
interface Toast { id: number; message: string; type: ToastType; }

export default function AdminDashboard() {
	const router = useRouter();
	const [items, setItems] = useState<ProgramItem[]>([]);
	const [form, setForm] = useState(blank);
	const [editing, setEditing] = useState<string | null>(null);
	const [category, setCategory] = useState<ProgramCategory>(categories[0]);
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = (message: string, type: ToastType = "success") => {
		const id = Date.now();
		setToasts((current) => [...current, { id, message, type }]);
	};

	async function load() {
		const response = await fetch("/api/admin/content");
		if (response.ok) setItems((await response.json()).programs);
	}
	useEffect(() => {
		const timer = window.setTimeout(load, 0);
		return () => window.clearTimeout(timer);
	}, []);
	const visible = useMemo(() => items.filter((item) => item.category === category), [items, category]);
	function change(key: keyof ProgramItem, value: string) {
		setForm((current) => ({ ...current, [key]: value }));
	}
	function edit(item: ProgramItem) {
		setEditing(item.slug);
		setForm(item);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
	async function save(event: React.FormEvent) {
		event.preventDefault();
		const isEditing = Boolean(editing);
		const response = await fetch(isEditing ? `/api/admin/content/${editing}` : "/api/admin/content", {
			method: isEditing ? "PATCH" : "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		if (response.ok) {
			showToast(isEditing ? "Konten diperbarui." : "Program ditambahkan.");
			setForm(blank);
			setEditing(null);
			load();
		} else showToast((await response.json()).error ?? "Gagal menyimpan konten.", "error");
	}
	async function remove(slug: string) {
		if (!window.confirm("Hapus program ini dari landing page?")) return;
		const response = await fetch(`/api/admin/content/${slug}`, { method: "DELETE" });
		if (response.ok) {
			showToast("Program dihapus.");
			load();
		} else showToast("Gagal menghapus program.", "error");
	}
	async function logout() {
		await fetch("/api/admin/logout", { method: "POST" });
		router.push("/admin/login");
	}
	return (
		<main className="admin-page">
			<header className="admin-header shell">
				<Link className="brand" href="/">
					<Image className="brand-icon" src="/app-icon.png" alt="" width={40} height={40} priority />
					<span><strong>Akademi Professional Legal</strong><small>PENDIDIKAN & ADVOKASI HUKUM</small></span>
				</Link>
				<button className="text-link" onClick={logout}>Keluar</button>
			</header>
			<section className="admin-shell shell">
				<div className="admin-title">
					<div>
						<p className="eyebrow">Workspace admin</p>
						<h1>Kelola konten.</h1>
						<p className="hero-text">Atur program yang tampil di landing page, dari nama hingga tautan formulir.</p>
					</div>
					<div className="admin-stats">
						<div><strong>{items.length}</strong><span>Total program</span></div>
						<div><strong>{items.filter((item) => item.url).length}</strong><span>Link aktif</span></div>
					</div>
				</div>
				<div className="admin-grid">
					<form className="admin-form" onSubmit={save}>
						<div className="form-heading">
							<p className="eyebrow">{editing ? "Perbarui konten" : "Tambah konten"}</p>
							<h2>{editing ? "Edit program" : "Program baru"}</h2>
						</div>
						<label>Slug<input value={form.slug} onChange={(e) => change("slug", e.target.value)} disabled={Boolean(editing)} required /></label>
						<label>Kategori<select value={form.category} onChange={(e) => change("category", e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
						<label>Nama program<input value={form.name} onChange={(e) => change("name", e.target.value)} required /></label>
						<label>Deskripsi singkat<textarea value={form.summary} onChange={(e) => change("summary", e.target.value)} rows={3} required /></label>
						<label>Deskripsi detail<textarea value={form.detail} onChange={(e) => change("detail", e.target.value)} rows={4} required /></label>
						<label>Cocok untuk<textarea value={form.audience} onChange={(e) => change("audience", e.target.value)} rows={2} required /></label>
						<label>Link redirect <span className="field-hint">Kosongkan jika belum tersedia</span><input type="url" value={form.url ?? ""} onChange={(e) => change("url", e.target.value)} placeholder="https://bit.ly/..." /></label>
						<button className="button button-primary button-wide">{editing ? "Simpan perubahan" : "Tambah program"}</button>
						{editing && <button type="button" className="button button-secondary button-wide" onClick={() => { setEditing(null); setForm(blank); }}>Batal</button>}
					</form>
					<section className="records-panel">
						<div className="records-toolbar">
							<div><p className="eyebrow">Landing page</p><h2>Program</h2></div>
							<div className="category-tabs admin-tabs">{categories.map((item) => <button className={category === item ? "tab active" : "tab"} type="button" key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
						</div>
						<div className="record-list">
							{visible.length === 0 ? (
								<p className="empty-state">Belum ada program di kategori ini.</p>
							) : (
								visible.map((item) => (
									<article className="record-item" key={item.slug}>
										<div>
											<strong>{item.name}</strong>
											<span>{item.summary}</span>
											<small>{item.url ? "Link redirect aktif" : "Link belum tersedia"}</small>
										</div>
										<div className="record-actions">
											<button type="button" className="edit-btn" onClick={() => edit(item)} aria-label={`Edit ${item.name}`}>
												<EditIcon /> Edit
											</button>
											<button type="button" className="delete-btn" onClick={() => remove(item.slug)} aria-label={`Hapus ${item.name}`}>
												<DeleteIcon /> Hapus
											</button>
										</div>
									</article>
								))
							)}
						</div>
					</section>
				</div>
			</section>

			<div className="toast-container" aria-live="polite" aria-label="Notifikasi">
				{toasts.map((toast) => (
					<ToastItem key={toast.id} toast={toast} onExpire={() => setToasts((current) => current.filter((t) => t.id !== toast.id))} />
				))}
			</div>
		</main>
	);
}

function ToastItem({ toast, onExpire }: { toast: Toast; onExpire: () => void }) {
	useEffect(() => {
		const timer = window.setTimeout(onExpire, 3000);
		return () => window.clearTimeout(timer);
	}, [onExpire]);

	return (
		<div className={`toast toast-${toast.type}`}>
			<span className="toast-icon">{toast.type === "success" ? <CheckIcon /> : <WarningIcon />}</span>
			<span className="toast-text">{toast.message}</span>
			<span className="toast-progress" />
		</div>
	);
}
