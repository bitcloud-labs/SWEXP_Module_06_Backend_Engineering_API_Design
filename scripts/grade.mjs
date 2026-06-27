#!/usr/bin/env node
/**
 * Forge SWEXP autograder (Module 06).
 * Runs every exercise's tests (behaviour + type-level) and the strict type gate,
 * then prints a per-exercise score and writes a Markdown report for GitHub Actions.
 *
 * Grouping is by exercise folder under labs/ and assignments/. The tests are the
 * spec — no answer keys are shipped.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, appendFileSync, existsSync } from 'node:fs';

const REPORT = '.grade/vitest.json';
mkdirSync('.grade', { recursive: true });

function run(cmd) {
  try {
    return { ok: true, out: execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString() };
  } catch (e) {
    return { ok: false, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

// Exercise folder name from a test file path, e.g. ".../labs/lab-02-service-layer/tests/x.test.ts"
function exerciseOf(p) {
  const m = p.replace(/\\/g, '/').match(/\/(labs|assignments)\/([^/]+)\//);
  return m ? `${m[1]}/${m[2]}` : null;
}

// 1) Behaviour + type-level tests.
run(`npx vitest run --typecheck --reporter=json --outputFile=${REPORT}`);
if (!existsSync(REPORT)) {
  console.error('Could not produce a test report. Run `npm install` first.');
  process.exit(2);
}
const report = JSON.parse(readFileSync(REPORT, 'utf8'));

// 2) Strict type gate (the compiler is your first reviewer).
const typeGate = run('npx tsc --noEmit -p tsconfig.json');

// Aggregate per exercise.
const tally = {};
for (const file of report.testResults ?? []) {
  const key = exerciseOf(file.name);
  if (!key) continue;
  tally[key] ??= { passed: 0, total: 0 };
  for (const a of file.assertionResults ?? []) {
    tally[key].total += 1;
    if (a.status === 'passed') tally[key].passed += 1;
  }
}

const passed = report.numPassedTests ?? 0;
const total = report.numTotalTests ?? 0;
const pct = total ? Math.round((passed / total) * 100) : 0;
const complete = passed === total && total > 0 && typeGate.ok;

const rows = Object.keys(tally)
  .sort()
  .map((k) => {
    const t = tally[k];
    const mark = t.passed === t.total ? '✅' : '❌';
    return `| \`${k}\` | ${t.passed}/${t.total} | ${mark} |`;
  });

const md = [
  `## Forge SWEXP — Module 06 autograde`,
  ``,
  `**Score: ${passed}/${total} tests (${pct}%)**  ·  Strict type-check: ${typeGate.ok ? '✅ clean' : '❌ errors'}`,
  ``,
  `| Exercise | Tests | Status |`,
  `| --- | --- | --- |`,
  ...rows,
  ``,
  complete
    ? `🎉 **All exercises complete and the project type-checks clean.**`
    : `Keep going — open each exercise folder, implement the \`// TODO\`s in its \`src/\`, and run \`npm test\`. The tests in each \`tests/\` folder are the spec.`,
].join('\n');

writeFileSync('grade-report.md', md + '\n');
console.log('\n' + md + '\n');

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
}

process.exit(complete ? 0 : 1);
