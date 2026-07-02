#!/usr/bin/env bash
set -u

ROOT="/Users/ahndohun/projects/merge-mage"
EVIDENCE="$ROOT/.omo/evidence/merge-mage-release-gate"
REPO_EVIDENCE="$EVIDENCE/repo"
TESTSPRITE_EVIDENCE="$EVIDENCE/testsprite"

mkdir -p "$REPO_EVIDENCE" "$TESTSPRITE_EVIDENCE"

{
  printf '## Live URL root\n'
  curl -i -L --max-time 30 https://merge-mage.vercel.app/
  printf '\n## Live API health\n'
  curl -i -L --max-time 30 https://merge-mage.vercel.app/api/health
} > "$REPO_EVIDENCE/live-url-and-health.txt" 2>&1

{
  printf '## git status --short\n'
  git status --short
  printf '\n## git log --oneline --decorate -30\n'
  git log --oneline --decorate -30
  printf '\n## LOOP.md\n'
  sed -n '1,220p' LOOP.md
  printf '\n## README.md\n'
  sed -n '1,220p' README.md
  printf '\n## workflow\n'
  sed -n '1,220p' .github/workflows/testsprite.yml
  printf '\n## TestSprite files\n'
  find tests/testsprite -type f -maxdepth 3 | sort
} > "$REPO_EVIDENCE/judge-surface.txt" 2>&1

if command -v gh >/dev/null 2>&1; then
  gh run list --workflow testsprite-gate --limit 5 --json databaseId,displayTitle,conclusion,status,headSha,createdAt,updatedAt,url \
    > "$REPO_EVIDENCE/gh-run-list.json" 2> "$REPO_EVIDENCE/gh-run-list.stderr" || true
else
  printf 'gh not installed\n' > "$REPO_EVIDENCE/gh-run-list.stderr"
  printf '[]\n' > "$REPO_EVIDENCE/gh-run-list.json"
fi

{
  printf '## testsprite --version\n'
  testsprite --version
  printf '\n## testsprite auth whoami\n'
  testsprite auth whoami
  printf '\n## local TestSprite suite count\n'
  find tests/testsprite -type f | sort
} > "$TESTSPRITE_EVIDENCE/preflight.txt" 2>&1 || true

{
  printf '## npm run build\n'
  npm run build
} > "$REPO_EVIDENCE/npm-build.txt" 2>&1 || true

{
  printf '## npm test\n'
  npm test
} > "$REPO_EVIDENCE/npm-test.txt" 2>&1 || true

node <<'NODE' > "$REPO_EVIDENCE/judge-surface-summary.json"
const fs = require("node:fs")
const path = require("node:path")
const root = "/Users/ahndohun/projects/merge-mage"
const evidence = path.join(root, ".omo/evidence/merge-mage-release-gate")
function read(rel) {
  return fs.readFileSync(path.join(evidence, rel), "utf8")
}
function maybeJson(rel, fallback) {
  try {
    return JSON.parse(read(rel))
  } catch {
    return fallback
  }
}
const live = read("repo/live-url-and-health.txt")
const judge = read("repo/judge-surface.txt")
const runs = maybeJson("repo/gh-run-list.json", [])
const preflight = read("testsprite/preflight.txt")
const build = read("repo/npm-build.txt")
const test = read("repo/npm-test.txt")
const latestRun = Array.isArray(runs) ? runs[0] ?? null : null
const loopRows = (judge.match(/^\| [0-9]+ \|/gm) ?? []).length
const testSpriteFiles = (judge.match(/^tests\/testsprite\//gm) ?? []).length
const summary = {
  liveUrlWorks: live.includes("HTTP/2 200") || live.includes("HTTP/1.1 200"),
  apiHealthWorks: live.includes('{"ok":true') || live.includes('"ok":true'),
  workflowExists: judge.includes("name: testsprite-gate") && judge.includes("testsprite test run"),
  latestGhRun: latestRun,
  latestGhRunGreen: latestRun?.status === "completed" && latestRun?.conclusion === "success",
  loopRows,
  testSpriteFiles,
  readmeClaimsSupportedByFiles:
    judge.includes("11 TestSprite tests") &&
    testSpriteFiles >= 11 &&
    judge.includes("CI keeps the loop honest") &&
    judge.includes(".github/workflows/testsprite.yml"),
  testspritePreflightOk:
    !preflight.includes("command not found") &&
    !preflight.toLowerCase().includes("auth error") &&
    !preflight.toLowerCase().includes("not authenticated"),
  buildOk: build.includes("built in") && !build.includes("error TS"),
  testOk: test.includes("Test Files") && test.includes("passed"),
}
summary.pass =
  summary.liveUrlWorks &&
  summary.apiHealthWorks &&
  summary.workflowExists &&
  summary.latestGhRunGreen &&
  summary.loopRows >= 9 &&
  summary.testSpriteFiles >= 11 &&
  summary.readmeClaimsSupportedByFiles &&
  summary.testspritePreflightOk &&
  summary.buildOk &&
  summary.testOk
console.log(JSON.stringify(summary, null, 2))
NODE
