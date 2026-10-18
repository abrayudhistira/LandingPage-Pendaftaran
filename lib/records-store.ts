import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { programs } from "@/app/data/programs";

export type RecordStatus = "Baru" | "Diverifikasi" | "Selesai";
export type AdminRecord = { id: string; name: string; email: string; phone: string; program: string; category: string; status: RecordStatus; notes: string; createdAt: string; updatedAt: string };
type Store = { version: 1; records: AdminRecord[] };
const filePath = path.join(process.cwd(), "data", "admin-records.json");
let writeQueue = Promise.resolve();

async function readStore(): Promise<Store> {
  try { return JSON.parse(await readFile(filePath, "utf8")) as Store; }
  catch { return { version: 1, records: [] }; }
}
async function saveStore(store: Store) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.tmp`;
  await writeFile(tempPath, JSON.stringify(store, null, 2), "utf8");
  await rename(tempPath, filePath);
}
function queueSave(store: Store) { writeQueue = writeQueue.then(() => saveStore(store)); return writeQueue; }
export async function listRecords() { return (await readStore()).records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }
export async function addRecord(input: Omit<AdminRecord, "id" | "createdAt" | "updatedAt">) { const store = await readStore(); const now = new Date().toISOString(); const record = { ...input, id: randomUUID(), createdAt: now, updatedAt: now }; store.records.push(record); await queueSave(store); return record; }
export async function updateRecord(id: string, input: Partial<Omit<AdminRecord, "id" | "createdAt" | "updatedAt">>) { const store = await readStore(); const index = store.records.findIndex((record) => record.id === id); if (index < 0) return null; store.records[index] = { ...store.records[index], ...input, updatedAt: new Date().toISOString() }; await queueSave(store); return store.records[index]; }
export async function deleteRecord(id: string) { const store = await readStore(); const next = store.records.filter((record) => record.id !== id); if (next.length === store.records.length) return false; store.records = next; await queueSave(store); return true; }
export function isValidProgram(program: string) { return programs.some((item) => item.name === program); }
