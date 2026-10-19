import { Suspense } from "react";
import { connection } from "next/server";
import { listPrograms } from "@/lib/program-store";
import { programs as defaultPrograms } from "./data/programs";
import PageContent from "./page-content";

export default function Home() {
	return (
		<Suspense fallback={<PageContent programs={defaultPrograms} />}>
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
	return <PageContent programs={programs} />;
}
