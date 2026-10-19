import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { getSessionCookieName, isValidSessionToken } from "@/lib/admin-auth";
import AdminDashboard from "./admin-dashboard";

function AdminLoading() {
  return <main className="admin-page admin-loading"><div className="admin-loading-card"><span className="eyebrow">Akademi Professional Legal · Admin</span><h1>Menyiapkan workspace.</h1><p>Memeriksa akses admin...</p></div></main>;
}

async function AuthenticatedAdmin() {
  await connection();
  const cookieStore = await cookies();
  if (!isValidSessionToken(cookieStore.get(getSessionCookieName())?.value)) redirect("/admin/login");
  return <AdminDashboard />;
}

export default function AdminPage() {
  return <Suspense fallback={<AdminLoading />}><AuthenticatedAdmin /></Suspense>;
}
