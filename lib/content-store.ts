import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Program, ProgramCategory } from "@/app/data/programs";
import { programs as defaults } from "@/app/data/programs";

const filePath = path.join(process.cwd(), "data", "program-content.json");
let writeQueue = Promise.resolve();
export type ContentProgram = Program;
type Store = { version: 1; programs: ContentProgram[] };
const categories: ProgramCategory[] = ["Pendaftaran Baru", "Pendataan Ulang"];

async function readStore(): Promise<Store> {
  try { const parsed = JSON.parse(await readFile(filePath, "utf8")) as Store; if (Array.isArray(parsed.programs)) return parsed; } catch { /* seed below */ }
  return { version: 1, programs: defaults };
}
async function saveStore(store: Store) { await mkdir(path.dirname(filePath), { recursive: true }); const tmp = `${filePath}.${process.pid}.tmp`; await writeFile(tmp, JSON.stringify(store, null, 2), "utf8"); await rename(tmp, filePath); }
function queueSave(store: Store) { writeQueue = writeQueue.then(() => saveStore(store)); return writeQueue; }
export async function listContent() { return (await readStore()).programs; }
export async function updateContent(slug: string, input: Partial<ContentProgram>) { const store = await readStore(); const index = store.programs.findIndex((item) => item.slug === slug); if (index < 0) return null; store.programs[index] = { ...store.programs[index], ...input, slug }; await queueSave(store); return store.programs[index]; }
export async function createContent(input: ContentProgram) { const store = await readStore(); if (store.programs.some((item) => item.slug === input.slug)) return null; store.programs.push(input); await queueSave(store); return input; }
export async function deleteContent(slug: string) { const store = await readStore(); const next = store.programs.filter((item) => item.slug !== slug); if (next.length === store.programs.length) return false; store.programs = next; await queueSave(store); return true; }
export function validateContent(input: Partial<ContentProgram>) { return typeof input.name === "string" && input.name.trim().length > 0 && typeof input.summary === "string" && input.summary.trim().length > 0 && typeof input.detail === "string" && input.detail.trim().length > 0 && typeof input.audience === "string" && input.audience.trim().length > 0 && typeof input.category === "string" && categories.includes(input.category as ProgramCategory) && (!input.url || (typeof input.url === "string" && /^https?:\/\//.test(input.url))); }
