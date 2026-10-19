import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { listPrograms } from "@/lib/program-store";
import { programs as defaultPrograms } from "./data/programs";
import PageContent from "./page-content";

export default function Home() {
	return (
		<Suspense fallback={<PageContent programs={defaultPrograms} initialTheme={null} />}>
			<HomeContent />
		</Suspense>
	);
}

async function HomeContent() {
	let programs;
	try {
		await connection();
		programs = await listPrograms();
	} catch {
		programs = defaultPrograms;
	}
	const cookieStore = await cookies();
	const theme = cookieStore.get("ambarsan-theme")?.value as "light" | "dark" | undefined;
	return <PageContent programs={programs} initialTheme={theme ?? null} />;
}
