const { spawnSync } = require("node:child_process");
const fs = require("node:fs");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function runNpm(args) {
  return spawnSync(npmCommand, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
}

console.log("Dependency check for youtube-advanced-search");

const audit = runNpm(["audit", "--json"]);
try {
  const data = JSON.parse(audit.stdout || "");
  const vulnerabilities = data.metadata?.vulnerabilities || {};
  const total = Object.values(vulnerabilities).reduce(
    (sum, value) => sum + (Number.isInteger(value) ? value : 0),
    0,
  );

  if (total) {
    const details = Object.entries(vulnerabilities)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    console.warn(
      `WARNING: npm audit reports ${total} vulnerability(ies) (${details}). Run 'npm audit' for details.`,
    );
  } else {
    console.log("OK: npm audit reports no known vulnerabilities.");
  }
} catch {
  console.warn("WARNING: npm audit could not be read. Run 'npm audit' manually.");
}

const outdated = runNpm(["outdated", "--json"]);
try {
  const packages = JSON.parse(outdated.stdout || "{}");
  const count = Object.keys(packages).length;
  if (count) {
    console.log(`INFO: ${count} package(s) are outdated. Run 'npm outdated' to review updates.`);
  } else {
    console.log("OK: all installed packages match the latest versions reported by npm.");
  }
} catch {
  console.log("INFO: npm outdated could not be completed, usually because the registry was unavailable.");
}

if (!fs.existsSync("package-lock.json")) {
  console.log("INFO: package-lock.json is missing; run 'npm install' to create it.");
}
