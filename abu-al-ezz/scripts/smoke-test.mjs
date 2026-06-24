const baseUrl = (process.argv[2] || process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const skipHealth = process.argv.includes("--no-health");

const checks = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Products" },
  { path: "/categories", label: "Categories" },
  { path: "/cart", label: "Cart" },
  { path: "/login", label: "Login" },
  { path: "/register", label: "Register" },
  { path: "/admin-login", label: "Admin login" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
];

if (!skipHealth) {
  checks.push({ path: "/api/health", label: "Health API", json: true });
}

const failures = [];

for (const check of checks) {
  const url = `${baseUrl}${check.path}`;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": "abu-al-ezz-smoke-test/1.0" },
    });
    const body = await response.text();
    if (!response.ok) {
      failures.push(`${check.label} ${check.path} returned ${response.status}`);
      continue;
    }

    if (check.json) {
      try {
        const parsed = JSON.parse(body);
        if (parsed.status !== "ok") {
          failures.push(`${check.label} ${check.path} returned unexpected JSON`);
          continue;
        }
      } catch {
        failures.push(`${check.label} ${check.path} did not return JSON`);
        continue;
      }
    }

    console.log(`OK ${check.label}: ${response.status}`);
  } catch (error) {
    failures.push(`${check.label} ${check.path} failed: ${error.message}`);
  }
}

if (failures.length) {
  console.error("\nSmoke test failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`\nSmoke test passed for ${baseUrl}`);
