const { execFileSync } = require("node:child_process");

const stagedFiles = execFileSync(
  "git",
  ["diff", "--cached", "--name-only", "--diff-filter=ACMR"],
  { encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean);

const blockedFiles = stagedFiles.filter(
  (file) =>
    ((file === ".env" || (file.startsWith(".env.") && file !== ".env.example")) ||
      /credentials.*\.json$/.test(file) ||
      /\.(pem|key)$/.test(file) ||
      /(^|\/)(id_rsa|id_ed25519)$/.test(file)),
);

if (blockedFiles.length) {
  console.error("BLOCKED: sensitive file(s) are staged and cannot be committed:");
  blockedFiles.forEach((file) => console.error(file));
  console.error("Use environment variables or a redacted .env.example instead.");
  process.exit(2);
}

const diff = execFileSync(
  "git",
  ["diff", "--cached", "--diff-filter=ACMR", "--unified=0", "--", ".", ":!package-lock.json"],
  { encoding: "utf8" },
);

const patterns = [
  ["Google API key", /AIza[0-9A-Za-z_-]{35}/],
  ["AWS access key", /AKIA[0-9A-Z]{16}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9_]{20,}/],
  ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["generic secret assignment", /(api[_-]?key|secret|token|password|authorization)\s*[:=]\s*["'][^"']{12,}["']/i],
];
const placeholders = /(your[_ -]?|replace[_ -]?me|example|placeholder|changeme|dummy|xxx)/i;
const findings = new Set();

for (const line of diff.split("\n")) {
  if (!line.startsWith("+") || line.startsWith("+++")) continue;
  for (const [label, pattern] of patterns) {
    const match = line.match(pattern);
    if (match && !placeholders.test(match[0])) findings.add(label);
  }
}

if (findings.size) {
  console.error("BLOCKED: possible secret detected in staged additions:");
  for (const label of [...findings].sort()) console.error(`- ${label}`);
  console.error("Remove it or use an environment variable before committing.");
  process.exit(2);
}

console.log("Security scan passed: no sensitive files or likely secrets found.");
