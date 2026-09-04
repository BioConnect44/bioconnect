const { execSync } = require("child_process");
const path = require("path");

const args = process.argv.slice(2).join(" ");
const pyScript = path.join(__dirname, "index_local_books.py");

try {
  console.log("🚀 Executing Local Book Scanner Script...");
  const output = execSync(`python "${pyScript}" ${args}`, { encoding: "utf-8" });
  console.log(output);
} catch (err) {
  console.error("❌ Indexer script error:", err.stdout || err.message);
  process.exit(1);
}
