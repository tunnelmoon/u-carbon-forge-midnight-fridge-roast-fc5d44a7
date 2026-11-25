import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "It is 2 a.m. and my fridge just locked me out for my own good, like a bouncer who knows my cholesterol.";

function fail(message: string): never {
  throw new Error(message);
}

if (LINE.length < 1 || LINE.length > 200) {
  fail(`line must be 1 to 200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("line must not be only white space");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("line must not contain control characters");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) {
  fail("round-trip read-back does not match the line");
}
