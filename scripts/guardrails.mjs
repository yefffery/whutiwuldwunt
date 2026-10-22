#!/usr/bin/env node
// RECONCILIATION MASTER STANDARD 1.0 (V72) — automated deployment guardrails.
//
// Scans the application source and fails the build (non-zero exit) when a
// transactional booking model or machine-paint-correction promises creep back
// into the code. Scope: app/, components/, lib/, src/ — data-layer files
// (db/, drizzle/) and this script itself are excluded.

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const roots = ["app", "components", "lib", "src"];
const extensions = [".ts", ".tsx", ".mjs", ".json"];

const violations = [];

function* walk(directory) {
  for (const entry of readdirSync(directory)) {
    const full = path.join(directory, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (extensions.some((ext) => full.endsWith(ext))) yield full;
  }
}

const CORE_SERVICE_FILES = ["src/config/business_configuration.json", "lib/service-promise.ts", "lib/services.ts", "lib/care-rules.ts", "lib/business-config.ts"];

// Rule 1: no transactional vocabulary in copy strings or component labels.
const TRANSACTIONAL = /\b(booking|booked)\b/gi;
// Rule 2: no machine paint-correction stages, timelines, or duration-based
// warranties written into the core service definitions.
const MACHINE_PROMISES = /\b(multi-stage|stage[- ]?(one|two|three|1|2|3)|paint correction stage|timeline|corrected in \d+|warranty|guaranteed for)\b/gi;
const DURATION_TERMS = /\b(months|years)\b/gi;

function location(file, index, source) {
  const line = source.slice(0, index).split("\n").length;
  return `${file}:${line}`;
}

for (const root of roots) {
  for (const file of walk(root)) {
    const source = readFileSync(file, "utf8");
    const isCoreService = CORE_SERVICE_FILES.includes(file);
    for (const match of source.matchAll(TRANSACTIONAL)) {
      violations.push(`${location(file, match.index, source)}: transactional term "${match[0]}"`);
    }
    if (isCoreService) {
      for (const match of source.matchAll(MACHINE_PROMISES)) {
        violations.push(`${location(file, match.index, source)}: machine paint-correction promise "${match[0]}" in a core service definition`);
      }
      for (const match of source.matchAll(DURATION_TERMS)) {
        violations.push(`${location(file, match.index, source)}: duration-based term "${match[0]}" in a core service definition`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error("V72 guardrails: build rejected.\n");
  for (const violation of violations) console.error(`  ✗ ${violation}`);
  console.error(`\n${violations.length} violation(s). Remove the transactional model and machine promises, then rebuild.`);
  process.exit(1);
}

console.log("V72 guardrails: clean. Inquiry model intact, no transactional vocabulary, no machine promises in core service definitions.");
