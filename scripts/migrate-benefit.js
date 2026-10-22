// One-off migration: add benefit columns to programs table
// Run: node scripts/migrate-benefit.js

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

// Read .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
const envLines = envContent.split("\n");
for (const line of envLines) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim();
}

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) { console.log("No DATABASE_URL found"); process.exit(1); }
  const parsed = new URL(url);
  const conn = await mysql.createConnection({
    host: parsed.hostname,
    port: parseInt(parsed.port),
    user: parsed.username,
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.slice(1),
    ssl: { rejectUnauthorized: false },
  });

  const [cols] = await conn.query("SHOW COLUMNS FROM programs");
  const colNames = cols.map(c => c.Field);
  console.log("Current columns:", colNames.join(", "));

  if (!colNames.includes("benefit_enabled")) {
    await conn.query("ALTER TABLE programs ADD COLUMN benefit_enabled TINYINT(1) NOT NULL DEFAULT 0");
    console.log("✓ Added benefit_enabled");
  } else { console.log("· benefit_enabled already exists"); }

  if (!colNames.includes("benefit_text")) {
    await conn.query("ALTER TABLE programs ADD COLUMN benefit_text TEXT DEFAULT NULL");
    console.log("✓ Added benefit_text");
  } else { console.log("· benefit_text already exists"); }

  if (!colNames.includes("benefit_image")) {
    await conn.query("ALTER TABLE programs ADD COLUMN benefit_image VARCHAR(512) DEFAULT NULL");
    console.log("✓ Added benefit_image");
  } else { console.log("· benefit_image already exists"); }

  const [cols2] = await conn.query("SHOW COLUMNS FROM programs");
  console.log("\nFinal columns:", cols2.map(c => c.Field).join(", "));
  console.log("Migration complete!");
  await conn.end();
}

run().catch(e => { console.error(e); process.exit(1); });
