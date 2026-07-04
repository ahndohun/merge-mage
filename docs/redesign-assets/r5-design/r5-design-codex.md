Reading additional input from stdin...
2026-07-04T07:01:16.712671Z  WARN codex_features: unknown feature key in config: child_agents_md
2026-07-04T07:01:17.030755Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.codex/plugins/cache/openai-primary-runtime/template-creator/26.630.12135/.codex-plugin/plugin.json
2026-07-04T07:01:17.031598Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.codex/plugins/cache/openai-primary-runtime/template-creator/26.630.12135/.codex-plugin/plugin.json
2026-07-04T07:01:18.851468Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.codex/plugins/cache/openai-primary-runtime/template-creator/26.630.12135/.codex-plugin/plugin.json
2026-07-04T07:01:18.852275Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.codex/plugins/cache/openai-primary-runtime/template-creator/26.630.12135/.codex-plugin/plugin.json
2026-07-04T07:01:18.854129Z  WARN codex_core_skills::loader: ignoring interface.default_prompt: exceeds maximum length of 1024 characters
2026-07-04T07:01:18.855344Z  WARN codex_core_skills::loader: ignoring interface.default_prompt: exceeds maximum length of 1024 characters
2026-07-04T07:01:18.954147Z  WARN codex_exec_server::client::http_client::reqwest_http_client: http/request send failed http_method="POST" error_is_timeout=false error_is_connect=true error=error sending request error_sources=Some("client error (Connect): tcp connect error: Connection refused (os error 61)")
2026-07-04T07:01:18.956478Z  WARN codex_rmcp_client::http_client_adapter: streamable HTTP post_message failed endpoint_scheme="http" endpoint_host="127.0.0.1" endpoint_path="/mcp" endpoint_has_query=false mcp_method="initialize" mcp_request_id="0" has_session_id=false has_authorization_header=false
2026-07-04T07:01:18.956587Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when Client(HttpRequest(HttpRequest("http/request failed: error sending request for url (http://127.0.0.1:6006/mcp)")))
2026-07-04T07:01:18.956872Z  WARN codex_exec_server::client::http_client::reqwest_http_client: http/request send failed http_method="POST" error_is_timeout=false error_is_connect=true error=error sending request error_sources=Some("client error (Connect): tcp connect error: Connection refused (os error 61)")
2026-07-04T07:01:18.956905Z  WARN codex_rmcp_client::http_client_adapter: streamable HTTP post_message failed endpoint_scheme="http" endpoint_host="127.0.0.1" endpoint_path="/mcp" endpoint_has_query=false mcp_method="initialize" mcp_request_id="0" has_session_id=false has_authorization_header=false
2026-07-04T07:01:18.956926Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when Client(HttpRequest(HttpRequest("http/request failed: error sending request for url (http://127.0.0.1:29979/mcp)")))
2026-07-04T07:01:18.956945Z  WARN codex_rmcp_client::rmcp_client::streamable_http_retry: streamable HTTP MCP initialize failed with a retryable error; retrying attempt=1 max_attempts=3 delay_ms=250 error=handshaking with MCP server failed: Send message error Transport [rmcp::transport::worker::WorkerTransport<rmcp::transport::streamable_http_client::StreamableHttpClientWorker<codex_rmcp_client::http_client_adapter::StreamableHttpClientAdapter>>] error: Client error: HTTP request failed: http/request failed: error sending request for url (http://127.0.0.1:29979/mcp), when send initialize request
2026-07-04T07:01:18.956944Z  WARN codex_rmcp_client::rmcp_client::streamable_http_retry: streamable HTTP MCP initialize failed with a retryable error; retrying attempt=1 max_attempts=3 delay_ms=250 error=handshaking with MCP server failed: Send message error Transport [rmcp::transport::worker::WorkerTransport<rmcp::transport::streamable_http_client::StreamableHttpClientWorker<codex_rmcp_client::http_client_adapter::StreamableHttpClientAdapter>>] error: Client error: HTTP request failed: http/request failed: error sending request for url (http://127.0.0.1:6006/mcp), when send initialize request
OpenAI Codex v0.142.3
--------
workdir: /Users/ahndohun/Documents/Codex/2026-07-04/new-chat
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019f2bee-7a24-7b01-bd28-8eb6453faa77
--------
user
merge-mage 재설계 트랙 R5 "전직·유파" 시스템을 설계하라. 저장소 절대경로: /Users/ahndohun/projects/merge-mage-redesign (redesign 브랜치). 먼저 다음 파일들을 읽어 현황을 정확히 파악한 뒤 설계하라: src/engine/resonance.ts (공명: fire targetCap / frost factor·durationMs / holy bossMultiplier), src/engine/traits.ts (특성 슬롯·pick·환생후 1회 respec, getResonanceRequirement), src/engine/types.ts (EngineState·TraitState·SkinState·wizardLevel·prestigeCount), src/engine/actions.ts (levelUp·환생 흐름), src/engine/simulate.ts (밸런스 시뮬), src/ui/WizardPanel.tsx (마법사 탭 현 구성), docs/specs/2026-07-04-redesign-tracks.md (트랙 정본).

원안(디렉터 승인): 공명+특성을 전직 시 유파(화염/냉기/신성) 선택으로 흡수하여 "진짜 특화"를 만든다. 견습→정식→대마법사 3단계 전직이 콘텐츠의 뼈대이며 시스템은 전직·레벨 순간에 열린다. 스킨=전직 보상(구매가 아니라 성장의 증표). 화폐 3종(골드·마나수정·스킬포인트) 유지, 신규 화폐 발행 금지. "머지가 왕" — 모든 시스템은 다음 머지를 더 맛있게로 수렴. 자동합성·자동구매는 후반 잠금해제 보상으로만.

너의 설계 관점: 밸런스-보존·엔진 견고성 우선. 기존 resonance/traits 효과값을 최대한 보존하며 유파로 재배치한다. SAVE_VERSION 마이그레이션 안전, 시뮬 곡선(첫 벽 10분·첫 환생 34분·7일 클리어 불가) 불변을 목표로.

출력은 한국어 마크다운. 반드시 포함: (1)전직 3단계 조건·타이밍을 어떤 상태값 기준으로 판정하는지 구체적으로 (2)유파 3종 각각의 효과 — 기존 공명/특성 효과를 어떻게 흡수·강화하는지 수치·메커니즘 수준으로 (3)스킨을 전직/유파에 매핑하는 방식 (4)필요한 상태(types.ts)·액션·SAVE_VERSION 마이그레이션 변경 목록 (5)마법사 탭 UI 재구성안 (6)밸런스 영향·리스크·기존 유닛테스트 충돌 예상. 이것은 설계안이지 구현 지시가 아니다. 코드를 수정하지 마라(읽기 전용).
warning: Under-development features enabled: chronicle. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/ahndohun/.codex/config.toml.
2026-07-04T07:01:19.210194Z  WARN codex_exec_server::client::http_client::reqwest_http_client: http/request send failed http_method="POST" error_is_timeout=false error_is_connect=true error=error sending request error_sources=Some("client error (Connect): tcp connect error: Connection refused (os error 61)")
2026-07-04T07:01:19.210216Z  WARN codex_rmcp_client::http_client_adapter: streamable HTTP post_message failed endpoint_scheme="http" endpoint_host="127.0.0.1" endpoint_path="/mcp" endpoint_has_query=false mcp_method="initialize" mcp_request_id="0" has_session_id=false has_authorization_header=false
2026-07-04T07:01:19.210227Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when Client(HttpRequest(HttpRequest("http/request failed: error sending request for url (http://127.0.0.1:6006/mcp)")))
2026-07-04T07:01:19.210238Z  WARN codex_rmcp_client::rmcp_client::streamable_http_retry: streamable HTTP MCP initialize failed with a retryable error; retrying attempt=2 max_attempts=3 delay_ms=1000 error=handshaking with MCP server failed: Send message error Transport [rmcp::transport::worker::WorkerTransport<rmcp::transport::streamable_http_client::StreamableHttpClientWorker<codex_rmcp_client::http_client_adapter::StreamableHttpClientAdapter>>] error: Client error: HTTP request failed: http/request failed: error sending request for url (http://127.0.0.1:6006/mcp), when send initialize request
2026-07-04T07:01:19.210266Z  WARN codex_exec_server::client::http_client::reqwest_http_client: http/request send failed http_method="POST" error_is_timeout=false error_is_connect=true error=error sending request error_sources=Some("client error (Connect): tcp connect error: Connection refused (os error 61)")
2026-07-04T07:01:19.210272Z  WARN codex_rmcp_client::http_client_adapter: streamable HTTP post_message failed endpoint_scheme="http" endpoint_host="127.0.0.1" endpoint_path="/mcp" endpoint_has_query=false mcp_method="initialize" mcp_request_id="0" has_session_id=false has_authorization_header=false
2026-07-04T07:01:19.210279Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when Client(HttpRequest(HttpRequest("http/request failed: error sending request for url (http://127.0.0.1:29979/mcp)")))
2026-07-04T07:01:19.210288Z  WARN codex_rmcp_client::rmcp_client::streamable_http_retry: streamable HTTP MCP initialize failed with a retryable error; retrying attempt=2 max_attempts=3 delay_ms=1000 error=handshaking with MCP server failed: Send message error Transport [rmcp::transport::worker::WorkerTransport<rmcp::transport::streamable_http_client::StreamableHttpClientWorker<codex_rmcp_client::http_client_adapter::StreamableHttpClientAdapter>>] error: Client error: HTTP request failed: http/request failed: error sending request for url (http://127.0.0.1:29979/mcp), when send initialize request
2026-07-04T07:01:19.281726Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
2026-07-04T07:01:19.282778Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
2026-07-04T07:01:20.212265Z  WARN codex_exec_server::client::http_client::reqwest_http_client: http/request send failed http_method="POST" error_is_timeout=false error_is_connect=true error=error sending request error_sources=Some("client error (Connect): tcp connect error: Connection refused (os error 61)")
2026-07-04T07:01:20.212314Z  WARN codex_rmcp_client::http_client_adapter: streamable HTTP post_message failed endpoint_scheme="http" endpoint_host="127.0.0.1" endpoint_path="/mcp" endpoint_has_query=false mcp_method="initialize" mcp_request_id="0" has_session_id=false has_authorization_header=false
2026-07-04T07:01:20.212338Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when Client(HttpRequest(HttpRequest("http/request failed: error sending request for url (http://127.0.0.1:6006/mcp)")))
2026-07-04T07:01:20.212427Z  WARN codex_exec_server::client::http_client::reqwest_http_client: http/request send failed http_method="POST" error_is_timeout=false error_is_connect=true error=error sending request error_sources=Some("client error (Connect): tcp connect error: Connection refused (os error 61)")
2026-07-04T07:01:20.212467Z  WARN codex_rmcp_client::http_client_adapter: streamable HTTP post_message failed endpoint_scheme="http" endpoint_host="127.0.0.1" endpoint_path="/mcp" endpoint_has_query=false mcp_method="initialize" mcp_request_id="0" has_session_id=false has_authorization_header=false
2026-07-04T07:01:20.212496Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when Client(HttpRequest(HttpRequest("http/request failed: error sending request for url (http://127.0.0.1:29979/mcp)")))
2026-07-04T07:01:21.439460Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:01:21.445969Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
2026-07-04T07:01:21.460623Z  WARN codex_core_skills::loader: ignoring interface.icon_small: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.460655Z  WARN codex_core_skills::loader: ignoring interface.icon_large: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.461068Z  WARN codex_core_skills::loader: ignoring interface.icon_small: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.461084Z  WARN codex_core_skills::loader: ignoring interface.icon_large: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.461507Z  WARN codex_core_skills::loader: ignoring interface.icon_small: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.461517Z  WARN codex_core_skills::loader: ignoring interface.icon_large: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.461870Z  WARN codex_core_skills::loader: ignoring interface.icon_small: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.461879Z  WARN codex_core_skills::loader: ignoring interface.icon_large: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.462261Z  WARN codex_core_skills::loader: ignoring interface.icon_small: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.462270Z  WARN codex_core_skills::loader: ignoring interface.icon_large: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.463083Z  WARN codex_core_skills::loader: ignoring interface.icon_small: icon path with '..' must resolve under plugin assets/
2026-07-04T07:01:21.463099Z  WARN codex_core_skills::loader: ignoring interface.icon_large: icon path with '..' must resolve under plugin assets/
warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
2026-07-04T07:01:25.659589Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:01:25.664479Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
codex
의도는 코드 변경 없는 설계 산출입니다. 지정 파일과 트랙 문서를 먼저 읽고, 현재 엔진 상태값과 밸런스 표면에 맞춰 R5 설계안을 작성하겠습니다.
  → 지정된 엔진·UI·스펙 파일을 읽고 현재 시스템 경계 파악
  • 공명·특성·전직·스킨 상태 모델과 밸런스 제약 정리
  • 한국어 마크다운 설계안 작성
2026-07-04T07:01:38.116549Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:01:38.122982Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
codex
`omo:programming` 지침이 이 작업에 적용됩니다. 타입스크립트 엔진 파일을 다루는 설계라서 해당 스킬을 먼저 확인한 뒤, 지정 파일만 읽기 전용으로 조사하겠습니다.
hook: PreToolUse
2026-07-04T07:01:52.290206Z  WARN codex_otel::events::session_telemetry: metrics counter [codex.skill.injected] failed: tag value contains invalid characters: omo:programming
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '1,240p' /Users/ahndohun/.codex/plugins/cache/sisyphuslabs/omo/4.15.1/skills/programming/SKILL.md" in /Users/ahndohun/Documents/Codex/2026-07-04/new-chat
 succeeded in 0ms:
---
name: programming
description: "MUST USE for ANY work on .py .pyi .rs .ts .tsx .mts .cts .go files. One philosophy: strict types, modern stacks (Pydantic v2 / serde+thiserror / Zod / gin+sqlc+pgx+slog), modern toolchains (uv+basedpyright+ruff / cargo+clippy+miri / Bun+Biome+tsc / gofumpt+golangci-lint v2+nilaway+go-race), parse-don't-validate, exhaustive match, typed errors, no any/unwrap/panic, 250 LOC ceiling, TDD. Routes to references/{python,rust,typescript,rust-ub,go}/. Triggers: write/edit Python/Rust/TypeScript/Go code, new project, gin server, bubbletea TUI, CJK IME, connect-go RPC, sqlc pgx, branded ids, exhaustive match, unsafe Rust, miri, oversized file, refactor, TDD, e2e test, arena, allocator, bumpalo, const fn, const generics, comptime, zero-alloc, bitfield, repr, scopeguard, errdefer, Zig-like, zerocopy, packed struct."
---

# Programming

You are a lazy senior engineer — lazy meaning efficient, never careless. **The best code is the code never written; the code you do write is type-strict, stack-first, async-correct, and architecturally honest about size.**

This skill is an index. The hard per-language rules live under `references/`. Load the language-specific reference **before** writing a single line of code.

---

## PHASE 0 — LANGUAGE GATE (RUN THIS FIRST, EVERY TIME)

**DO NOT WRITE OR EDIT A SINGLE LINE OF CODE BEFORE COMPLETING THIS GATE.**

1. **Identify the language** from the file extension or the user's request.
2. **STOP** and read the matching reference set:

   | File / Language | MANDATORY reading (load `Read` tool on every file below) |
   |---|---|
   | `.py`, `.pyi`, "Python" | `references/python/README.md` + every file under `references/python/` that the README tells you to load on demand |
   | `.rs`, `Cargo.toml`, "Rust" | `references/rust/README.md` + every file under `references/rust/` that the README tells you to load on demand. **IF the change touches `unsafe`, `*mut`, `*const`, `MaybeUninit`, FFI, `unsafe impl Send/Sync`, or a custom lock-free primitive: ALSO load `references/rust-ub/README.md` plus every file under `references/rust-ub/`.** |
   | `.ts`, `.tsx`, `.mts`, `.cts`, "TypeScript" | `references/typescript/README.md` + every file under `references/typescript/` that the README tells you to load on demand |
   | `.go`, `go.mod`, `go.sum`, `.golangci.yml`, `*.proto` next to a Go module, "Go" / "Golang" | `references/go/README.md` + every file under `references/go/` that the README tells you to load on demand |

3. Only after the references are loaded, apply the **shared philosophy** below plus the per-language iron list from the reference.

**No exceptions for "small" or "one-off" code.** The whole point of the modern toolchain (uv + PEP 723, `rust-script`, Bun) is that disposable scripts cost nothing to write with full discipline.

---

## Shared philosophy (all three languages)

These are not style preferences. They are the seven axioms every recipe in `references/` derives from.

0. **The best code is the code never written.** Before writing, stop at the first rung that holds: (1) does this need to exist at all? (YAGNI) (2) does this codebase already have it? — reuse the helper or pattern, do not re-implement. (3) does the standard library do it? (4) does a native platform feature cover it? (5) does an installed dependency solve it? (6) can it be one line? (7) only then, write the minimum that works. Climb the ladder *after* you understand the problem and trace the real flow end to end — the smallest diff in the wrong place is a second bug, not laziness. The ladder is a fast decision, not a written essay: pick the rung and move. **Bug fix = root cause, not symptom.** A ticket names a symptom; grep every caller of the function you touch and fix the shared seam once — one guard at the source is a smaller, more correct diff than one guard per caller, and patching only the path the ticket names leaves a sibling caller broken.

1. **The type system is your proof system.** Make illegal states unrepresentable. The compiler / type checker is the cheapest test you will ever run. If a bug can be expressed as a type error, it is *required* to be expressed as a type error.

2. **Parse, don't validate.** Untrusted input crosses a boundary exactly once - at the boundary it is parsed into a typed value (Pydantic v2 in Python, `serde` + `#[derive]` in Rust, Zod in TypeScript). Inside the boundary, code receives typed values and never re-validates. The boundary owns trust; the interior owns logic.

3. **One name = one concept.** A `UserId` is not a `string`. A `Seconds` is not a `Milliseconds`. Use `NewType` (Python), newtype tuple structs (Rust), or branded types (TypeScript) for every distinct semantic primitive. The compiler refuses to let two semantic units mix.

4. **Exhaustive variant matching, always.** Discriminated unions and enums are matched exhaustively. Python: `match` + `case unreachable: assert_never(unreachable)`. Rust: `match` (the compiler enforces). TypeScript: `switch` + `assertNever`. **`if`/`elif`/`else` is forbidden for discriminating on a tagged variant** - it silently swallows new variants.

5. **Trust framework guarantees. Validate only at boundaries.** No null checks for values the type system already proves non-null. No `try/except` around code that cannot raise. No `unwrap`/`!`/`as` to paper over a contract you should have encoded in types. No defensive layer for a scenario you cannot name.

6. **Test-driven, with the right shape of test.** No production line ships without a failing test that proves it was needed. Behavior is locked by tests, not by hope. See the TDD discipline below.

---

## TDD DISCIPLINE — NON-NEGOTIABLE

**Every change follows the red → green → refactor loop.** The order is mandatory; reverse it and you have written speculative code.

### The order

1. **Red.** Write a failing test that names the behavior in `Given / When / Then`. Run it. *Confirm it fails for the right reason* — not a typo, not an import error. A test that fails because the function does not exist yet is the right reason. A test that fails because of a missing import is not.
2. **Green.** Write the minimum code to make the test pass. Resist adding the second case until the first passes. The second case is the next red.
3. **Refactor.** With the test green, restructure ruthlessly. The test is your safety net. If the test is hard to refactor against, the test is bad — fix the test before the code.

### The shape of the test pyramid

Every feature ships with all three rungs, sized in this proportion:

| Rung | Count | Purpose | Speed budget |
|---|---|---|---|
| **Unit** | many | Pure-function correctness for every meaningful input class (happy + edges + boundaries + error paths) | < 10 ms each |
| **Integration** | some | The real adapter against the real downstream (DB, queue, HTTP) — via `testcontainers`, `httptest`, or equivalent. NEVER a unit test pretending to be integration. | < 1 s each |
| **E2E scenario** | few | One narrative per user-visible outcome. Spins the binary or the full app; drives it through its real surface (HTTP route, CLI invocation, TUI keystroke). Asserts the *observable outcome*, not internal state. | seconds, run on CI |

If a feature has zero E2E coverage, it is undone — even if every unit test passes.

### Given / When / Then is mandatory

Every test — unit, integration, E2E — is structured by these three blocks. Names follow `Test_<Behavior>_when_<Condition>` or the language idiom (`it("<does X> when <Y>")`, `#[test] fn behavior_when_condition`).

```
Given: the preconditions and fixtures
When:  the single action under test
Then:  the observable outcome AND only that outcome
```

One `When` per test. Multiple `When`s = multiple tests. The `Then` asserts only what changed because of the `When` — not unrelated invariants.

### Less mock, the better

Mocks are a last resort, not a default. The priority order:

1. **Real object.** Use it when constructable in <1 ms (most domain types, pure functions, value objects).
2. **In-memory fake.** A real implementation of the interface backed by a map/slice — for stores, caches, queues. The fake has its OWN test that proves it behaves like the real one.
3. **Testcontainer / sandbox.** Real Postgres, real Redis, real S3-compatible (MinIO), via `testcontainers`. Slow but truthful.
4. **HTTP-level fake.** `httptest.Server` (Go), `respx` (Python), `msw` (TS) — fake at the wire, not at the SDK.
5. **Mock.** Only when 1–4 are genuinely infeasible (clock, randomness, external SaaS with no sandbox). Then mock the **narrowest** seam — never an entire service. A mock that returns whatever the test wants is a tautology and proves nothing.

**The rule**: if your test fails when the production code's *implementation* changes but its *behavior* did not, the test is over-mocked. Delete the mock; assert on observable outputs.

### Efficient AND accurate — both, not either

- **Accurate**: the test fails for the bug it names, and only that bug. No incidental coupling to format, ordering, whitespace, or unrelated fields. Assert on the *contract*, not on the dump.
- **Efficient**: the whole unit suite runs in < 30 seconds on a developer laptop. The whole integration suite in < 5 minutes. If you cross those budgets, profile and split — fast tests run on every save, slow ones run on push.
- **Deterministic**: no `sleep`, no wall-clock dependence, no order dependence (`-shuffle=on`, pytest-randomly, vitest random seed). Inject a `Clock`. Subscribe to the event, do not poll for it. Time-based flake is a bug, not a test issue.
- **Isolated**: every test starts from a known fixture and tears down. `t.TempDir()`, `t.Setenv()`, transactional rollback for DB tests. Two tests passing individually but failing together is a fixture leak — fix it immediately.

### Prompt tests follow the same rule

When tests cover LLM prompts or agent outputs, assert on **parsed structure, decisions, or rule data**, never on exact prompt strings. Pinning a sentence is brittle pretend-coverage; asserting that the prompt instructs the model to refuse on category X is real coverage.

### Anti-patterns the skill rejects

| Anti-pattern | Why it fails | Fix |
|---|---|---|
| Writing code first, tests "to add later" | Tests-after rationalize the existing design, even when wrong. | Red first. Always. |
| One mega-test asserting 12 things | First failure hides the next 11. | Split by `Then` clause — one assertion class per test. |
| Mocking every collaborator | Test passes regardless of real behavior. | Use a fake or the real thing. Mock only true unmockables. |
| `time.sleep(0.1)` to "let it finish" | Flake guaranteed. | Subscribe to the completion signal; bounded await. |
| Snapshot tests for everything | Locks formatting, not behavior. | Snapshots for *structure* (CLI help, JSON shape). Assertions for *behavior*. |
| Removing a failing test to "unblock CI" | You just deleted a bug report. | Fix the code or fix the test — never delete to silence. |
| `assert result is not None` and stopping there | Passes when result is garbage. | Assert the *value*, not its existence. |
| Single happy-path E2E, no edges | Most bugs live on edges. | Edges are unit-test territory — but include at least one E2E that exercises an error path. |

---

## Cross-language iron list

Apply unless the per-language reference overrides with something stricter.

| Rule | Python | Rust | TypeScript | Go |
|---|---|---|---|---|
| Immutable by default | `@dataclass(frozen=True, slots=True)` / Pydantic `frozen=True` | every binding is `let` (not `let mut`) unless mutation is the documented purpose | every field is `readonly`; arrays are `readonly T[]` | value types, unexported fields, no mutation methods unless mutation is the purpose |
| Branded primitives | `UserId = NewType("UserId", int)` | `struct UserId(u64);` (newtype tuple) | `type UserId = Brand<string, "UserId">` | `type UserID string` + smart constructor with unexported field |
| Exhaustive variant matching | `match` + `assert_never` | `match` (compiler-enforced) | `switch` + `assertNever` | sealed interface + type switch + **`exhaustive` linter** (the compiler will not help) |
| No untyped escape hatches | no `Any` in public sigs, no `cast`, no `# type: ignore` | no `unwrap`/`expect` outside `main`/tests, no `as` for narrowing, no `#[allow]` to silence real warnings | no `any`, no `as` (except `as const`, `satisfies`), no `!`, no `@ts-ignore`, no `@ts-expect-error` | no `interface{}` / bare `any` in domain sigs; no `_ = err`; no `//nolint` without reason |
| No bare error strings | typed exception dataclass with `__str__` | `thiserror` enum (lib) or `anyhow` with `.context(...)` (app) | `Error` subclass with typed fields | sentinel `errors.New` + typed `*XError` struct; wrap with `%w`; check via `errors.Is/As` |
| Boundary catch only | catch the exact exception you expect; broad `except Exception` only in `main()`, with logging + re-raise | `?` everywhere; never `panic!` in library code | `catch` must narrow with `instanceof` and re-throw or convert; no empty catch | every `(T, error)` checked; `panic` only in `main`/tests; one `httperr.Write` funnel in handlers |
| Resources via RAII | `with` (sync) / `async with` (async) | `Drop` impl or RAII guard | `using`/`await using` (TC39 explicit resource management) | `defer x.Close()` immediately after acquisition; `bodyclose`/`sqlclosecheck` linters enforce |
| Async runtime is mandatory | `anyio` (NEVER bare `asyncio`) | `tokio` (`async-std` is unmaintained) | platform-native async (Bun/Node) with structured cancellation via `AbortSignal` | `context.Context` as first param + `errgroup` for structured concurrency; `-race` on every test |
| Modern HTTP client | [`httpx2`](https://github.com/pydantic/httpx2) with HTTP/2 + brotli + zstd | `reqwest` with rustls | `ky` (default) / `undici` direct API (Node perf) - NEVER bare `fetch` in prod | stdlib `net/http.Client` with tuned `Transport` + `go-retryablehttp` for retry/backoff |
| No parameter mutation | params are inputs; produce a new value | `&mut` only when mutation is the documented purpose | parameters never reassigned (`noParameterAssign`) | value receivers when not mutating; pointer receivers only for genuine mutation; `copylocks` vet enforces |
| No helpers for one-off | inline a 3-line operation; do not abstract until the second caller | same | same | same |

---

## Modern ecosystem - canonical libraries (2026)

Use these unless the project's manifest explicitly picks something else.

| Domain | Python | Rust | TypeScript | Go |
|---|---|---|---|---|
| Data validation / boundary parse | **Pydantic v2** | **serde** + `#[derive(Deserialize)]` + `validator` | **Zod v4** (Standard Schema) | `validator/v10` (HTTP) + `protovalidate` (proto) + smart constructors (domain) |
| Internal value object | `@dataclass(frozen=True, slots=True)` | newtype tuple struct or plain `struct` | `type` alias with `readonly` | struct with unexported fields + `NewX(...)` constructor |
| Error types | typed exception dataclass | `thiserror` (lib) + `anyhow` (app) | `Error` subclass + Result pattern | sentinel `errors.New` + typed `*XError` struct + `%w` wrap |
| HTTP client | [`httpx2`](https://github.com/pydantic/httpx2) | `reqwest` | `ky` / `undici` | stdlib `net/http` + `go-retryablehttp` |
| Web framework | **FastAPI** | **axum** | **Hono** + `hono-openapi` | **gin** (de facto, ~48%) / `chi` (minimalist) / `connect-go` (RPC) |
| ORM / DB | SQLAlchemy 2.x async + `asyncpg` | `sqlx` (compile-time checked) | **Drizzle** | **sqlc** (codegen from `.sql`) + `pgx/v5` + `goose` migrations |
| CLI | **typer** + `rich` | **clap** (derive) + `color-eyre` + `indicatif` | `@clack/prompts` + `commander` | **cobra** + `huh` (prompts) + `slog` |
| Logging / observability | `structlog` (prod) or `rich.logging` (dev) | **tracing** + `tracing-subscriber` | `pino` (structured JSON) | stdlib **`log/slog`** (NEVER logrus/zap/zerolog for new code) |
| Testing | `pytest` | `cargo nextest` + `proptest` + `insta` | `bun test` / `vitest` | stdlib `testing` + `testify/require` + `goleak` + `autogold` + `rapid` + `testcontainers` |
| Data / analytics | **polars** + **duckdb** + `numpy` (NEVER pandas) | `polars-rs` or `arrow` | (defer to backend service) | `arrow-go` + DuckDB-Go bindings + `gonum` |
| LLM / agent | **pydantic-ai** | (call out to Python via subprocess) | **Vercel AI SDK** | direct `net/http` + Connect (langchaingo not recommended) |
| TUI | **textual** | `ratatui` | `@clack/prompts` or ink | **bubbletea v2 RC** + `bubbles/v2` + `lipgloss/v2` (v2 mandatory for CJK IME) |
| Config from env | **pydantic-settings** | `figment` or `config` | `zod` + `process.env` | `caarlos0/env/v11` (struct-tag env) |

A bare default constructor for any of these (no timeouts, no pool tuning, no schema) is a bug. See the per-language reference for the canonical production defaults.

---

## Modern toolchain - the only acceptable setup

| Tool category | Python | Rust | TypeScript | Go |
|---|---|---|---|---|
| Package / project manager | **uv** (NEVER pip/poetry/conda) | **cargo** + `cargo-nextest` + `cargo-machete` + `cargo-deny` | **Bun** (runtime + package manager); pnpm if Node is forced | **`go modules`** + `go work` for monorepos |
| Type checker | **basedpyright** with `typeCheckingMode = "all"` | the Rust compiler with `-D warnings` + clippy `pedantic` + `nursery` + `cargo` groups | `tsc --noEmit` (or `tsgo` when available) with `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `verbatimModuleSyntax` | the Go compiler + **`golangci-lint v2`** with the strict bundle + **`nilaway`** (nil-deref static analysis) |
| Linter + formatter | **ruff** with `select = ["ALL"]` | `clippy` + `rustfmt` | **Biome** (single binary - replaces ESLint + Prettier) | **`gofumpt`** (stricter gofmt) + `goimports -local` + `golangci-lint v2` |
| Test runner | **pytest** | **cargo-nextest** | `bun test` / `vitest` | stdlib `go test -race -shuffle=on -count=1` + `goleak` |
| UB / soundness gate | (n/a) | **nightly miri** with strict provenance + Tree Borrows pass | (n/a) | **`nilaway`** + `-race` detector + `goleak` are the equivalent gate |
| Disposable scripts | **PEP 723** inline metadata + `uv run script.py` | **rust-script** with inline `Cargo.toml` block | `bun run script.ts` | `//go:build ignore` + `go run script.go` |
| Bootstrap a new project | `scripts/python/new-project.py` | `scripts/rust/new-project.py` | `scripts/typescript/new-project.ts` | `scripts/go/new-project.py` |
| Pre-commit / CI gate | `ruff check . && basedpyright && pytest` | `cargo +nightly clippy -- -D warnings && cargo nextest run && cargo +nightly miri test` | `bunx biome check . && bunx tsc --noEmit && bun test` | `gofumpt -l . && golangci-lint run ./... && nilaway ./... && go test -race -shuffle=on -count=1 ./...` |

A `tsconfig.json` with `"strict": true` alone is **not** strict. The reference enumerates the additional flags. Same for `pyproject.toml` and `Cargo.toml` - the references contain the canonical full configuration.

---

## CODE SMELLS — AUTOMATIC REVIEW TRIGGERS

Most smells below are design review triggers: STOP, re-examine the code, and either fix the smell or justify carrying it with a SPECIFIC reason. **The 250 pure LOC ceiling is stricter: >250 is a DEFECT. Refactor before adding lines except for rare SIZE_OK or pure-data-table exceptions.**

Full rationale, measurement methods, workaround detection, and split examples: **[`references/code-smells.md`](references/code-smells.md)**.

### Smell 1 — File exceeds 250 pure LOC

A source file past 250 non-blank, non-comment lines has outgrown a single reviewer's working memory. The module is almost certainly doing more than one thing. Measure: `awk '!/^[[:space:]]*$/ && !/^[[:space:]]*(\/\/|#|--)/' <file> | wc -l`.

**When detected:** Name what the file owns in one short noun phrase. If the answer needs "and", the file needs splitting. Load `/refactor` and split by responsibility. If the file genuinely cannot be split (generated parser, indivisible state machine), mark with `// allow: SIZE_OK — <reason>`.

### Smell 2 — Function with more than 3 parameters

More than 3 arguments signals the function is doing too much, or that related parameters belong in a typed struct. **Workarounds count as the same smell** — passing `dict`/`Record<string, unknown>`/`map[string]any`/`**kwargs`/`...args` to smuggle parameters through one argument, or a throwaway "config" object with 6+ fields that exists solely to wrap what would otherwise be positional args (genuine reusable domain types like `HttpClientConfig` are fine).

**When detected:** Group related parameters into a typed value object with a domain name. If 4+ independent inputs are genuinely required, the justification must be SPECIFIC. See [`references/code-smells.md` Smell 2](references/code-smells.md#smell-2--function-with-more-than-3-parameters) for examples in every language.

### Smell 3 — Redundant verification after a destructive action

Performing a delete/remove/clear/drop and then immediately querying to "confirm" the thing is gone. **The operation's contract IS the verification.** Re-checking is AI-generated defensive bloat that wastes cycles and teaches the reader the operation is unreliable — which it is not. Same smell: calling a setter then getting to "confirm", writing a file then reading it back, inserting a row then SELECT-ing it, pushing to an array then checking `.length`.

**When detected:** Delete the verification code. Trust the operation's contract. If the operation can genuinely fail silently, fix the operation — do not paper over it with a post-check. See [`references/code-smells.md` Smell 3](references/code-smells.md#smell-3--redundant-verification-after-a-destructive-action) for examples.

### Smell 4 — Negative-form names and conditions

Naming variables, functions, or flags by the **absence** of a quality (`isNotValid`, `noErrors`, `cannotProceed`, `DisableLogging`) instead of its **presence** (`isValid`, `isClean`, `canProceed`, `LoggingEnabled`). Every negation forces the reader to invert mentally; two negations (`if !isNotReady`) become a logic puzzle nobody reviews confidently.

**When detected:** Rename to the positive form and invert the branch logic. Negation IS appropriate in guard clauses (`if !authorized { return }`) and filters (`items.filter(|x| !x.is_expired())`) — the negative form is the intent there. See [`references/code-smells.md` Smell 4](references/code-smells.md#smell-4--negative-form-names-and-conditions) for the full naming table and examples.

---

## MANDATORY POST-WRITE REVIEW LOOP

**This runs EVERY time you finish writing or substantively editing code, before you claim the task is done.** No exceptions.

### Step 1 — measure

For every file you created or modified:

```bash
awk '!/^[[:space:]]*$/ && !/^[[:space:]]*(\/\/|#|--)/' <file> | wc -l
```

Or run the per-language checker the skill ships:

```bash
# Python
uv run scripts/python/check-no-excuse-rules.py <changed paths>
# Rust
bash scripts/rust/check-no-excuse-rules.sh <changed paths>
# TypeScript
bun run scripts/typescript/check-no-excuse-rules.ts <changed paths>
```

hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc 'pwd && git -C /Users/ahndohun/projects/merge-mage-redesign status --short --branch' in /Users/ahndohun/Documents/Codex/2026-07-04/new-chat
 succeeded in 0ms:
/Users/ahndohun/Documents/Codex/2026-07-04/new-chat
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-5dI89JUs' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-v4c0XJiX' (errno=Operation not permitted)
## redesign

2026-07-04T07:01:52.715026Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:01:52.720052Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
codex
브랜치는 `redesign`으로 확인됐고, 작업트리는 읽기 전용이라 수정은 하지 않습니다. 이제 지정 파일의 실제 타입·상태·효과 흐름을 병렬로 읽겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '1,220p' /Users/ahndohun/.codex/plugins/cache/sisyphuslabs/omo/4.15.1/skills/programming/references/typescript/README.md" in /Users/ahndohun/Documents/Codex/2026-07-04/new-chat
 succeeded in 0ms:

# TypeScript Programmer

Modern TypeScript. Type-strict, stack-first, async-correct.

## Philosophy

The compiler is your proof system. Make illegal states unrepresentable. Parse at boundaries. Every function has a contract; the type system enforces it.

## Hard rules

These are deliberate project choices. Violations are always wrong, not "style preferences".

### Tooling

| Category | Use | Never |
|---|---|---|
| Runtime | Bun (native TS, single binary) | ts-node, tsx |
| Package manager | `pnpm` | npm, yarn (unless workspace requires it) |
| Linter + formatter | Biome | ESLint, Prettier |
| Type checker | `tsc --noEmit` with strict config | skip type checking |
| Web framework | Hono | Express |
| Validation | Zod | joi, yup, class-validator |
| Testing | `bun test` or vitest | jest |
| ORM | Drizzle | TypeORM, Prisma (unless already in project) |

### The iron list

1. **Readonly by default** — all `type`/`interface` properties are `readonly`. Arrays are `readonly T[]`. Mutable only when mutation is the documented purpose.
2. **Branded types for distinct IDs** — `type UserId = Brand<string, "UserId">`. Never pass raw `string` where a branded type exists.
3. **Exhaustive switch** — every `switch` on a discriminated union ends with `default: assertNever(x)`. No fall-through.
4. **No any** — `any` is banned in annotations, returns, and parameters. Use `unknown` and narrow.
5. **No type assertions** — `as any`, `as unknown` banned. `as const` and `satisfies` are fine.
6. **No non-null assertion** — `x!` is banned. Use narrowing or optional chaining (`x?.y`).
7. **No @ts-ignore / @ts-expect-error** — fix the type.
8. **No enum** — use `as const` objects + literal union types.
9. **Zod at boundaries** — external input (API, user, file) → Zod schema. Internal → plain types.
10. **Typed errors** — Error subclasses with typed fields. No `throw new Error("bare string")` for domain errors. Use Result for expected failures within 1-2 call levels; throw for propagation across many layers.
11. **as const for constants** — module-level constant objects and arrays use `as const`.
12. **import type** — type-only imports use `import type`. Enforced by `verbatimModuleSyntax`.
13. **Named exports only** — no `export default`. Exception: framework requirement (Next.js pages, etc.).
14. **No empty catch, no catch-and-swallow** — every `catch` block must either (a) narrow the error with `instanceof` and handle each case, or (b) re-throw. Empty catch blocks and `catch (e) { console.error(e) }` without narrowing or re-throw are banned — they hide bugs. At top-level boundaries (CLI entry, HTTP handler), opt out with `// no-excuse-ok: catch`.

### Data modeling — which construct, when

| Situation | Use |
|---|---|
| User input, API request/response | Zod schema + `z.infer` |
| Internal value object | `type` with `readonly` properties |
| Function with multiple outcomes | Discriminated union (`kind` field) |
| Contract for implementations | `interface` |
| Fixed constants | `as const` + literal union |
| Distinct primitive (UserId vs OrderId) | Branded type |
| Key-value map | `Record<K, V>` or index signature |

**The one rule**: data crosses trust boundary → Zod. Everything else → plain `type` with `readonly`.

Load `data-modeling.md` for the full decision flowchart and comparison.

### When readonly does not apply

- **Framework state** (React `useState`, signals) — managed by framework.
- **Builder / accumulator** — object exists to be mutated (buffer, cache). Document why.
- **ORM mutations** — Drizzle insert/update objects.

### Why empty/unhandled catch is banned

In TypeScript, every `catch` receives `unknown`. The language gives you no type safety in catch blocks — you must earn it with `instanceof`. A bare `catch (e) { console.error(e) }` swallows `TypeError`, `RangeError`, and your domain errors identically. When a new error type appears, nothing warns you.

```typescript
// BANNED — empty catch
try { await fetchData() } catch {}
try { await fetchData() } catch (e) { /* will fix later */ }

// BANNED — catch-and-swallow (no narrowing, no rethrow)
try {
  const data = await api.get("/users")
} catch (e) {
  console.error("failed", e)
}

// GOOD — narrow with instanceof
try {
  const data = await api.get("/users")
} catch (e) {
  if (e instanceof HttpError) {
    logger.warn(`API ${e.status}: ${e.message}`)
    return fallback
  }
  throw e  // unknown errors propagate
}

// GOOD — top-level boundary (only place catch-all is acceptable)
async function main(): Promise<void> {  // no-excuse-ok: catch
  try {
    await run()
  } catch (e) {
    console.error("unhandled:", e)
    process.exit(1)
  }
}
```

### Libraries

| Domain | Library | Why |
|---|---|---|
| HTTP framework | Hono | Lightweight, multi-runtime, middleware, OpenAPI |
| Validation | Zod | Runtime validation + type inference |
| ORM | Drizzle | Type-safe SQL, no codegen |
| HTTP client | `ky` | Thin fetch wrapper (5KB); auto-throw on non-2xx, retry, timeout, hooks, prefixUrl. Browser + Node + Bun + Deno |
| HTTP client (perf) | `undici` (direct API) | When a Node backend needs connection pooling, HTTP/2, or pipelining |

> **HTTP client rule** - production code must not use bare `fetch()`. It has no retry, timeout, or error-handling policy and causes silent failures during incidents. Install **`ky`** by default, and use the **`undici`** direct API when a Node backend needs high-volume requests, connection pooling, HTTP/2, or pipelining. ~~`axios`~~ is forbidden after the supply-chain compromise (2026-03). `node-fetch` is unnecessary because Node 18+ includes built-in fetch.
| Testing | `bun test` / vitest | Fast, ESM-native |
| Logging | `pino` | Structured JSON, fast |
| CLI | `@clack/prompts` + `commander` | Interactive + parsing |

## tsconfig — the one true config

Scaffold a new project with all strict defaults pre-configured:

```bash
bun run ../../scripts/typescript/new-project.ts my-api
bun run ../../scripts/typescript/new-project.ts my-api --path ./projects
```

Creates: `package.json` (Hono + Zod + Biome), `tsconfig.json` (ultra-strict), `biome.json`, `src/index.ts`, `.gitignore`. Works on macOS, Linux, Windows.

For manual setup: `bunx tsc --init`, then load `tsconfig-strict.md` for the full strict config.

Key flags beyond `"strict": true`:

| Flag | What it catches |
|---|---|
| `noUncheckedIndexedAccess` | `arr[0]` is `T \| undefined`, forces check |
| `exactOptionalPropertyTypes` | `{ x?: string }` ≠ `{ x: string \| undefined }` |
| `verbatimModuleSyntax` | Forces `import type` for type-only imports |
| `noFallthroughCasesInSwitch` | Forgotten `break` / `return` |
| `noPropertyAccessFromIndexSignature` | `.key` on index sig → bracket notation |

## Reference loading

Load on demand — not all at once.

| Need | Load |
|---|---|
| Strict tsconfig + Biome config | `tsconfig-strict.md` |
| Type patterns (branded, as const, satisfies, narrowing, assertNever) | `type-patterns.md` |
| Data modeling (type vs interface vs Zod, readonly, parse-don't-validate) | `data-modeling.md` |
| Error handling (Result, typed errors, union vs throw) | `error-handling.md` |
| Bootstrapping a new project (Bun, pnpm, Hono, Vite) | `bootstrap.md` |
| Hono backend stack (hono-openapi, Scalar, Swagger) | `backend-hono.md` |

## No-excuse audit

Violations caught by `../../scripts/typescript/check-no-excuse-rules.ts`. Run after every edit session.

| Rule ID | Catches | Opt-out |
|---|---|---|
| `no-any-assertion` | `as any` | None — redesign types |
| `no-unknown-assertion` | `as unknown` | None — redesign types |
| `no-ts-ignore` | `@ts-ignore` | None — fix the type |
| `no-ts-expect-error` | `@ts-expect-error` | None — fix the type |
| `no-enum` | `enum` declarations | None — use `as const` |
| `no-non-null-assertion` | `x!` postfix | None — narrow or `?.` |
| `no-throw-literal` | `throw "string"` / `throw 123` | None — throw Error subclass |
| `no-mutable-export` | `export let` / `export var` | None — use `export const` |
| `no-any-annotation` | `: any` in parameter/return/variable types | `// no-excuse-ok: any` |
| `no-explicit-any-return` | `(): any` or `(): Promise<any>` return types | `// no-excuse-ok: any` |
| `empty-catch` | `catch { }` or `catch (e) { }` with empty body | `// no-excuse-ok: catch` |
| `catch-without-narrowing` | `catch (e)` used without `instanceof` or re-throw | `// no-excuse-ok: catch` |

Biome enforces additional rules (noExplicitAny, noNonNullAssertion, noDefaultExport, useImportType). The script catches what Biome cannot.

## In tests

Tests are strict too, with these exceptions (configure in `biome.jsonc` overrides):

| In tests you may | Why |
|---|---|
| Use `expect()` assertions | That's how testing works |
| Use magic numbers | Test data |
| Access private members via bracket notation | Testing internals |
| Skip readonly on test fixtures | Mutable setup/teardown |

Tests still follow the iron list — branded types, typed errors, exhaustive switch.

## Existing codebases

When editing an existing file that doesn't follow these rules: **write new code in strict style, don't refactor existing code in the same change.**

## Activation

This skill activates whenever you are writing or modifying any `.ts` or `.tsx` file. Even one-off scripts get the strict treatment.

exec
/bin/zsh -lc 'nl -ba src/engine/resonance.ts' in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import { FIRE_TARGET_CAP, FROST_SLOW_FACTOR, FROST_SLOW_MS } from "./constants.js"
     2	import { getResonanceRequirement, getTraitFrostSlowBonus, getTraitHolyBossBonus } from "./traits.js"
     3	import { ELEMENTS, assertNever, type Element, type EngineState } from "./types.js"
     4	
     5	export type ElementResonance = {
     6	  readonly active: boolean
     7	  readonly count: number
     8	  readonly mono: boolean
     9	}
    10	
    11	export type ResonanceState = {
    12	  readonly requirement: number
    13	  readonly fire: ElementResonance & { readonly targetCap: number }
    14	  readonly frost: ElementResonance & { readonly factor: number; readonly durationMs: number }
    15	  readonly holy: ElementResonance & { readonly bossMultiplier: number }
    16	}
    17	
    18	export function getResonance(state: EngineState): ResonanceState {
    19	  const counts = countEquippedElements(state)
    20	  const requirement = getResonanceRequirement(state)
    21	  const monoElement = ELEMENTS.find((element) => counts[element] >= 6) ?? null
    22	  const fireScale = getScale(counts.fire, requirement, monoElement === "fire")
    23	  const frostScale = getScale(counts.frost, requirement, monoElement === "frost")
    24	  const holyScale = getScale(counts.holy, requirement, monoElement === "holy")
    25	  const frostTrait = getTraitFrostSlowBonus(state)
    26	  const holyTrait = getTraitHolyBossBonus(state)
    27	
    28	  return {
    29	    requirement,
    30	    fire: {
    31	      ...baseResonance(counts.fire, requirement, monoElement === "fire"),
    32	      targetCap: FIRE_TARGET_CAP + Math.ceil(fireScale),
    33	    },
    34	    frost: {
    35	      ...baseResonance(counts.frost, requirement, monoElement === "frost"),
    36	      factor: FROST_SLOW_FACTOR + 0.15 * frostScale + frostTrait.factor,
    37	      durationMs: FROST_SLOW_MS + 1_000 * frostScale + frostTrait.durationMs,
    38	    },
    39	    holy: {
    40	      ...baseResonance(counts.holy, requirement, monoElement === "holy"),
    41	      bossMultiplier: 2 + 0.5 * holyScale + holyTrait,
    42	    },
    43	  }
    44	}
    45	
    46	export function getFireTargetCap(state: EngineState): number {
    47	  return getResonance(state).fire.targetCap
    48	}
    49	
    50	export function getFrostSlow(state: EngineState): { readonly factor: number; readonly durationMs: number } {
    51	  const frost = getResonance(state).frost
    52	  return { factor: frost.factor, durationMs: frost.durationMs }
    53	}
    54	
    55	export function getHolyBossMultiplier(state: EngineState): number {
    56	  return getResonance(state).holy.bossMultiplier
    57	}
    58	
    59	function countEquippedElements(state: EngineState): Record<Element, number> {
    60	  return state.equipped.reduce(
    61	    (counts, book) => {
    62	      if (book === null) {
    63	        return counts
    64	      }
    65	      switch (book.element) {
    66	        case "fire":
    67	          return { ...counts, fire: counts.fire + 1 }
    68	        case "frost":
    69	          return { ...counts, frost: counts.frost + 1 }
    70	        case "holy":
    71	          return { ...counts, holy: counts.holy + 1 }
    72	        default:
    73	          return assertNever(book.element)
    74	      }
    75	    },
    76	    { fire: 0, frost: 0, holy: 0 },
    77	  )
    78	}
    79	
    80	function baseResonance(count: number, requirement: number, mono: boolean): ElementResonance {
    81	  return {
    82	    active: count >= requirement,
    83	    count,
    84	    mono,
    85	  }
    86	}
    87	
    88	function getScale(count: number, requirement: number, mono: boolean): number {
    89	  if (count < requirement) {
    90	    return 0
    91	  }
    92	  return mono ? 1.5 : 1
    93	}

hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'nl -ba src/engine/types.ts' in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import { SLOT_INDEXES } from "./constants.js"
     2	
     3	export const ELEMENTS = ["fire", "frost", "holy"] as const
     4	export const SKILL_NAMES = ["summonBonus", "castSpeed", "goldGain", "critChance"] as const
     5	
     6	export type Element = (typeof ELEMENTS)[number]
     7	export type CastElement = Element | "arcane"
     8	export type SkillName = (typeof SKILL_NAMES)[number]
     9	export type SlotIndex = (typeof SLOT_INDEXES)[number]
    10	
    11	export type Spellbook = {
    12	  readonly id: string
    13	  readonly level: number
    14	  readonly element: Element
    15	}
    16	
    17	export type SkillAllocations = {
    18	  readonly summonBonus: number
    19	  readonly castSpeed: number
    20	  readonly goldGain: number
    21	  readonly critChance: number
    22	}
    23	
    24	export type EquippedBooks = readonly [
    25	  Spellbook | null,
    26	  Spellbook | null,
    27	  Spellbook | null,
    28	  Spellbook | null,
    29	  Spellbook | null,
    30	  Spellbook | null,
    31	]
    32	
    33	export type SlotTiers = readonly [number, number, number, number, number, number]
    34	export type SlotTimers = readonly [number, number, number, number, number, number]
    35	export type RelicEquipment = readonly [string | null, string | null, string | null]
    36	export type RiftKind = "golden" | "trial"
    37	
    38	export type QuestState = {
    39	  readonly completed: readonly string[]
    40	  readonly claimed: readonly string[]
    41	}
    42	
    43	export type AchievementState = {
    44	  readonly counters: Record<string, number>
    45	  readonly claimed: readonly string[]
    46	}
    47	
    48	export type CodexState = {
    49	  readonly tiers: Record<string, number>
    50	}
    51	
    52	export type TraitState = {
    53	  readonly picks: Record<string, string>
    54	}
    55	
    56	export type RelicState = {
    57	  readonly owned: Record<string, number>
    58	  readonly equipped: RelicEquipment
    59	}
    60	
    61	export type RiftRunsState = {
    62	  readonly date: string
    63	  readonly golden: number
    64	  readonly trial: number
    65	}
    66	
    67	export type BattleSnapshot = {
    68	  readonly stage: number
    69	  readonly wave: number
    70	  readonly stageHp: number
    71	  readonly enemiesHp: readonly number[]
    72	  readonly bossElapsedMs: number
    73	  readonly frostSlowMs: number
    74	}
    75	
    76	export type ActiveRiftState =
    77	  | {
    78	      readonly kind: "golden"
    79	      readonly remainingMs: number
    80	      readonly startedStage: number
    81	      readonly snapshot: BattleSnapshot
    82	    }
    83	  | {
    84	      readonly kind: "trial"
    85	      readonly step: number
    86	      readonly startedStage: number
    87	      readonly snapshot: BattleSnapshot
    88	    }
    89	
    90	export type PetState = {
    91	  readonly level: number
    92	  readonly xp: number
    93	  readonly evolution: number
    94	}
    95	
    96	export type MineState = {
    97	  readonly floor: number
    98	  readonly lastClaimAt: number | null
    99	}
   100	
   101	export type DailyMissionState = {
   102	  readonly date: string
   103	  readonly progress: Record<string, number>
   104	  readonly claimed: readonly string[]
   105	}
   106	
   107	export type SkinState = {
   108	  readonly owned: readonly string[]
   109	  readonly equipped: string | null
   110	}
   111	
   112	export type EngineState = {
   113	  readonly gold: number
   114	  readonly books: readonly Spellbook[]
   115	  readonly equipped: EquippedBooks
   116	  readonly highestLevelEver: number
   117	  readonly highestStage: number
   118	  readonly stage: number
   119	  readonly wave: number
   120	  readonly stageHp: number
   121	  readonly wizardLevel: number
   122	  readonly wizardXp: number
   123	  readonly skillPoints: number
   124	  readonly skills: SkillAllocations
   125	  readonly manaCrystals: number
   126	  readonly prestigeCount: number
   127	  readonly lastSeenServerTs: number | null
   128	  readonly slotTiers: SlotTiers
   129	  readonly castProgressMs: SlotTimers
   130	  readonly enemiesHp: readonly number[]
   131	  readonly bossElapsedMs: number
   132	  readonly frostSlowMs: number
   133	  readonly recentGoldPerSecond: number
   134	  readonly elapsedMs: number
   135	  readonly rngSeed: number
   136	  readonly rngState: number
   137	  readonly nextBookId: number
   138	  readonly quests: QuestState
   139	  readonly achievements: AchievementState
   140	  readonly codex: CodexState
   141	  readonly traits: TraitState
   142	  readonly relics: RelicState
   143	  readonly riftRuns: RiftRunsState
   144	  readonly activeRift: ActiveRiftState | null
   145	  readonly pet: PetState
   146	  readonly mine: MineState
   147	  readonly dailyMissions: DailyMissionState
   148	  readonly skins: SkinState
   149	}
   150	
   151	export type EngineEvent =
   152	  | {
   153	      readonly type: "cast"
   154	      readonly bookId: string
   155	      readonly slotIdx: SlotIndex
   156	      readonly element: CastElement
   157	      readonly damage: number
   158	      readonly critical: boolean
   159	      readonly targetIndex: number
   160	      readonly targetsHit: number
   161	    }
   162	  | {
   163	      readonly type: "kill"
   164	      readonly stage: number
   165	      readonly wave: number
   166	      readonly gold: number
   167	      readonly xp: number
   168	      readonly boss: boolean
   169	    }
   170	  | { readonly type: "waveClear"; readonly stage: number; readonly wave: number }
   171	  | { readonly type: "bossSpawn"; readonly stage: number }
   172	  | { readonly type: "bossKill"; readonly stage: number; readonly gold: number }
   173	  | { readonly type: "bossFail"; readonly stage: number; readonly requiredDps: number; readonly currentDps: number }
   174	  | { readonly type: "levelUp"; readonly wizardLevel: number; readonly skillPoints: number }
   175	  | { readonly type: "slow"; readonly durationMs: number; readonly factor: number }
   176	  | { readonly type: "riftComplete"; readonly kind: RiftKind; readonly reward: number }
   177	  | {
   178	      readonly type: "petCast"
   179	      readonly damage: number
   180	      readonly targetIndex: number
   181	      readonly evolution: number
   182	    }
   183	
   184	export class UnexpectedVariantError extends Error {
   185	  readonly name = "UnexpectedVariantError"
   186	
   187	  constructor(readonly value: string) {
   188	    super(`Unexpected variant: ${value}`)
   189	  }
   190	}
   191	
   192	export function assertNever(value: never): never {
   193	  throw new UnexpectedVariantError(String(value))
   194	}
   195	
   196	export type GameState = {
   197	  readonly gold: number
   198	  readonly books: readonly Spellbook[]
   199	  readonly equipped: readonly Spellbook[]
   200	  readonly stage: number
   201	  readonly wave: number
   202	  readonly highestLevel: number
   203	  readonly summonCount: number
   204	  readonly lastServerTime: string | null
   205	}

exec
/bin/zsh -lc 'nl -ba docs/specs/2026-07-04-redesign-tracks.md' in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	# Arcane Ascension 재설계 (트랙 R) — 웨이브 맵과 R1 스펙
     2	
     3	디렉터 승인: 2026-07-04. 제안서 정본: https://claude.ai/code/artifact/9cafc25b-c6ae-4f06-bcd1-8c2fbae9707f
     4	브랜치: `redesign` (라이브 main과 분리). 각 웨이브 끝에 프리뷰 검수 게이트. E2E 플랜 재작성은 트랙 통합 시점에 일괄.
     5	
     6	## 확정된 기둥
     7	1. **머지가 왕** — 모든 시스템은 "다음 머지를 더 맛있게"로 수렴. 설명 안 되면 흡수.
     8	2. **마법사의 여정** — 견습→정식→대마법사 전직이 뼈대. 시스템은 전직·레벨 순간에 열린다.
     9	3. **화폐 3종** — 골드(단기·구매) / 마나수정(환생·영구) / 스킬포인트(레벨). 신규 화폐 발행 금지.
    10	4. **원소·속성이 합성 단위** — 마법서가 아니라 원소 구슬을 합친다 (디렉터 지정).
    11	5. 볼륨 유지 — 컷 없음, 재배치·연결만.
    12	
    13	## 웨이브
    14	- **R1 화폐 통합 + 언락 폭포** (이 문서 아래 스펙)
    15	- **R2 원소 재테마** — 합성 단위 책→원소 구슬 (스프라이트 생성 병행 중, 카피·도감·연출 전환)
    16	- **R3 IA 재배치** — 탭 6→5(마법서/마법사/여정/캠프/환생), 웨이브 정보 HUD 통합, 랭킹→HUD 아이콘, 데스크톱 3열
    17	- **R4 시스템 연결** — 여정(퀘스트+NEXT GOAL+일일미션 통합), 캠프(펫이 광산을 캔다), 균열→전장 포탈
    18	- **R5 전직·유파** — 공명+특성을 전직 선택으로 흡수, 스킨=전직 보상, 연출 통일
    19	- **통합 게이트** — 밸런스 시뮬 재증명, E2E 재작성, 신선한 눈 실사용, 라이브 교체 판단
    20	
    21	## R1 스펙 — 화폐 통합 + 언락 폭포
    22	
    23	### A. 화폐 통합 (엔진)
    24	- `manaStone`(광산 산출 재화) 폐지 → 광산·일일미션 보상을 `manaCrystals`(마나수정)로 통합.
    25	- 환율 설계: 환생이 주 수입원으로 남아야 한다. 광산은 시간당 소량(기존 마나석 12/h → 크리스탈 환산 시 첫 환생 획득량의 5% 수준/h을 넘지 않게). 일일미션 보상도 같은 원칙.
    26	- `SAVE_VERSION` 4 마이그레이션: 기존 세이브 manaStone → 크리스탈 환산 편입, 서버 zod 스키마는 관대 원칙 유지.
    27	- HUD 정리: 화폐 3종 원칙에 따라 HUD에는 골드(+환생 해본 뒤 크리스탈)만. "MANA 0" 항목의 정체를 규명해 크리스탈 표기로 통합하거나 제거.
    28	- 시뮬 재검증: `src/engine/simulate.ts`로 첫 벽 8~12분, 첫 환생 25~35분, 7일 클리어 불가 유지 확인. 결과 수치를 보고에 포함.
    29	
    30	### B. 언락 폭포 (엔진 파생 + UI)
    31	- 파생 함수 `getUnlockedFeatures(state)` (순수 함수, 저장 안 함):
    32	  - books: 상시
    33	  - skills: 마법사 Lv3+
    34	  - quests: 최고 스테이지 5+
    35	  - rifts: 최고 스테이지 7+
    36	  - rebirth: 최고 스테이지 10+ (환생으로 스테이지가 리셋돼도 유지)
    37	  - camp: 환생 1회+
    38	- "최고 스테이지"는 상태에 `highestStage` 기록 필요(마이그레이션 포함).
    39	- UI: 잠긴 기능의 탭·배지·버튼은 **숨김**(자물쇠 아님 — 언락 등장이 보상). 언락 순간: 토스트 + 탭 등장 연출(펄스 1회).
    40	- 균열 배지도 rifts 언락 전 숨김.
    41	- 투토리얼·NEXT GOAL 힌트가 잠긴 기능을 가리키지 않는지 정합 확인.
    42	- 신규 세이브 첫 화면 목표: 탭 1개(마법서), 빨간점 0개.
    43	
    44	### C. 검증 (R1 완료 조건)
    45	- 유닛테스트: unlock 파생 경계값, highestStage 유지, 마이그레이션(v3→v4), 광산 환율. 기존 166개 회귀 없음.
    46	- `npm run test` + `npm run build` 그린.
    47	- 시뮬 곡선 수치 보고 (첫 벽/첫 환생/Day-7).
    48	- 커밋은 redesign 브랜치에만. main·배포·원격 테스트 접근 금지.
    49	
    50	**R1 결과 (2026-07-04, 오케스트레이터 검수 완료)**: 커밋 49dfc2c. 테스트 174 그린·빌드 그린 재확인. 곡선: 첫 벽 10m / 첫 환생 34m / Day-7 book 86<100. 프리뷰 실측: fresh 첫 화면 탭 1개(BOOKS)·빨간점 0·HUD MANA 제거·균열 배지 숨김. 랭킹 탭은 rebirth 언락에 편승(스테이지 10+) — R3에서 HUD 아이콘으로 이동 예정.
    51	
    52	## R3 스펙 — 정보구조 재배치 (R2보다 먼저 실행 — R2는 구슬 시안 확정 대기)
    53	
    54	### A. 탭 6→5, "마법사" 탭 신설
    55	- 새 탭 구성: **마법서(books) / 마법사(wizard) / 여정(journey) / 캠프(camp) / 환생(rebirth)**.
    56	- **마법사 탭** = 기존 스킬 탭 전체(스킬·특성) + 도감(CODEX) 이동 + 공명 현황 요약. 질문: "나는 얼마나 강한가".
    57	  - 마법서 탭에서 TOMES/CODEX 서브탭 제거 — 마법서 탭은 장착·인벤·구매에 집중.
    58	- **여정 탭** = 기존 퀘스트 탭(메인 연쇄·장기 맹세·업적) + 일일 미션(캠프에서 이동). NEXT GOAL 스트립을 탭하면 여정 탭이 열린다(스트립이 여정의 입구).
    59	- **랭킹**: 탭에서 제거 → HUD 설정 버튼 옆 트로피 아이콘 버튼 → 기존 RanksPanel을 모달(불투명 .modal.panel)로. rebirth 언락과 동일 시점에 아이콘 등장.
    60	- 언락 폭포 매핑 갱신: journey=기존 quests 조건, wizard=기존 skills 조건. R1의 getUnlockedFeatures 키를 새 탭 구조에 맞게 리네임(하위호환 불필요 — 브랜치 내부).
    61	
    62	### B. 웨이브 정보 HUD 통합
    63	- Phaser 캔버스 상단의 "STAGE X - WAVE Y/10" 상시 텍스트 제거 → HUD의 STAGE 항목을 "STAGE X · WAVE Y/10"으로 확장(React, 기존 data-stage/data-wave 소스 활용).
    64	- BattleBanner는 일시 연출(웨이브 클리어/보스/레벨 업/보스 실패) 전용으로 유지.
    65	- 균열 배지(DOM)는 rifts 언락 후 표시 — 위치는 캔버스 우상단 유지(이제 상시 텍스트가 없어 겹침 자체가 소멸).
    66	
    67	### C. 데스크톱(1280px+) 3열
    68	- 좌: 여정 요약 칼럼(현재 목표 + 진행 중 퀘스트 2~3개, 클릭 시 여정 탭) / 중: 전투 캔버스 / 우: 마법서 패널 상주(현행 우측 패널 유지).
    69	- 좌 칼럼은 journey 언락 전 숨김(전투가 그만큼 넓어짐).
    70	- 탭 콘텐츠(마법사/캠프/환생)는 우측 패널 영역에서 전환(현행 방식 유지).
    71	
    72	### D. 검증 (R3 완료 조건)
    73	- 모든 탭·모달 데스크톱/모바일 렌더 확인(가려짐·클리핑 없음), 언락 전 숨김 동작 유지.
    74	- NEXT GOAL 탭→여정 열림 상호작용 테스트 포함.
    75	- 유닛테스트 갱신+신규(탭 매핑·랭킹 모달·여정 통합), `npm run test`+`npm run build` 그린.
    76	- data-testid: 기존 것 유지 최우선. 탭 리네임으로 불가피한 변경(tab-skills→tab-wizard, tab-quests→tab-journey)은 보고서에 목록화 — E2E 재작성 시 반영.
    77	- 커밋은 redesign 브랜치에만. main·배포·원격 테스트 접근 금지.
    78	
    79	**R3 결과 (2026-07-04, 오케스트레이터 검수 완료)**: 탭 6→5(마법서/마법사/여정/캠프/환생). 랭킹은 탭에서 빠져 HUD 트로피 버튼→모달(rebirth 언락 시 등장). 웨이브 정보는 캔버스 상시 배너에서 HUD "STAGE X · W Y/10"로 통합(BattleBanner는 이벤트 연출 전용). 데스크톱 3열(좌 여정 요약·중 캔버스·우 마법서). 테스트 179 그린·빌드 그린. 프리뷰 실측(모바일 375+데스크톱 1280): 5탭·마법사(스킬+특성+공명+도감)·여정(퀘스트+일일미션)·랭킹 모달·데미지 숫자 정상, 캔버스 겹침 없음.
    80	- **data-testid 변경** (E2E 재작성 시 반영): `tab-skills→tab-wizard`, `tab-quests→tab-journey`, `tab-ranks` 제거(→`ranks-btn`·`ranks-modal`·`ranks-close`). 신규 `journey-summary`. `books-subview-*` 제거. `skills-badge`·`camp-daily-card`·`daily-*`·`resonance-row`·`codex-grid` 유지.
    81	- **Phaser 정식화 (감사 파생)**: 데스크톱 3열을 CSS로 캔버스를 강제하던 방식(`.phaser-host canvas { width !important }`, scale Gotcha 3 위반)을 걷어내고 ScaleManager가 host를 FIT + GameShell `ResizeObserver`→`game.scale.refresh()`로 재구현. 전체 Phaser 감사(src/game 24파일, 높음3/중간6/낮음10)에서 canvas 직접 스타일·`game.destroy` 누락·오디오 window 이벤트 우회(→EventBus)·데미지 숫자 Image 조합(→RetroFont BitmapText)·banner/wizard destroy 경로·audio unlock 리스너 해제까지 수정. 보류: 오디오 ogg 폴백(에셋 추가 필요). 재발방지: `src/game/phaser-conventions.test.ts`(CI) + AGENTS.md 스케일 규칙.
    82	
    83	## R4 스펙 — 균열→전장 포탈 (여정·캠프는 R3/선행 커밋으로 완료)
    84	
    85	원안(제안서 v2): "균열 → 재배치 → 전투 화면의 이벤트 문(門)으로 — 탭이 아니라 전장에 나타나는 포탈". 언락 폭포 "~15분 첫 균열 포탈 / 전투 화면에 처음으로 '누를 것'이 생김". 현재 균열은 `.ui-overlay` 안 `RiftsOverlay`(`rift-entry-btn` 떠있는 버튼→`.rift-modal`(golden/trial 카드)→진입→`rift-active-hud`). 데이터·전투 연결(`activeRift`·`riftRuns`·`riftMultiplier`·`riftComplete`)은 이미 있음 — **R4는 진입점의 위치·시각·연출을 "전장 포탈"로 재구성한다. 엔진(actions/battle/state) 신규 로직 없음.**
    86	
    87	### A. 포탈 진입점 (`rift-entry-btn` → 전장 포탈)
    88	- 균열 진입점을 전투 캔버스(`.phaser-host`) 위에 자리잡는 **포탈 요소**로 재구성. `.ui-overlay` 내 전장 영역에 겹쳐 배치 — HUD(상단)·여정 스트립·탭바(하단)와 겹치거나 클리핑되지 않게. 모바일은 전투 존 하단부, 데스크톱(1280+)은 중앙 전투열에.
    89	- 시각: 새 외부 레퍼런스 없이 **게임 자체 아트를 기준**으로 일관(레트로 픽셀, `--mm-gold`/`--mm-frost`, `clip-path` 각진 모서리, 오프셋 `box-shadow`). 포탈 = 열린 문/소용돌이 은유.
    90	- 남은 총횟수(golden+trial) 배지 유지. 횟수 0이면 "닫힌 포탈"(비활성 시각)·클릭 시 microToast.
    91	
    92	### B. 등장·워프 연출
    93	- rifts 언락(`highestStage≥7`) 순간: 포탈 **등장 연출**(스케일-업/페이드/펄스 1회) + 토스트. 언락 폭포의 "전투 화면에 처음 누를 것이 생김"을 실현. 최초 1회만 등장 연출, 이후 상시 표시.
    94	- 포탈 클릭 → 기존 golden/trial 선택 모달(`.rift-modal`) 유지(횟수·설명이 필요). 진입 확정 → 짧은 **워프 전환**(포탈 플래시/줌) 후 `activeRift` 세팅.
    95	- 균열 전장 분위기 전환은 **EventBus로 BattleScene에 일시 연출 신호**(배경 틴트 등). 캔버스 직접 스타일 금지(R3 Gotcha3). 과하면 생략 가능 — 필수는 포탈 등장 + 워프.
    96	- 나가기(`rift-exit-btn`) → 복귀. active 중엔 진입 포탈 숨김(기존 `rift-active-hud` 전환 로직 유지).
    97	
    98	### C. 상태·정합
    99	- 엔진 신규 로직 없음 — 기존 `enterRift`/`exitRift`/`activeRift`/`riftRuns` 재사용. 변경 범위 = UI(`RiftsOverlay`·`GameShell`·`overlay.css`) + 선택적 `BattleScene` EventBus 연출 + i18n 카피.
   100	- 포탈은 rifts 언락 전 숨김(`GameShell` 581 조건 유지).
   101	- 신규 카피(등장 토스트 등)는 `i18n.ts` ko/en 양쪽.
   102	
   103	### D. 검증 (R4 완료 조건)
   104	- 언락 전 포탈 숨김 / 언락 시 등장 연출 / golden·trial 진입·나가기 / 횟수 0 비활성.
   105	- 데스크톱(1280)·모바일(375) 렌더: 포탈이 전장 영역에 위치, HUD·탭바·여정 스트립과 겹침·클리핑 없음.
   106	- data-testid: 기존 `rifts-open-btn`·`rift-modal`·`rifts-close-btn`·`rift-active-hud`·`rift-exit-btn` 최대 유지. 포탈화로 불가피한 변경은 보고서에 목록화(E2E 재작성 반영).
   107	- 컴포넌트/유닛 테스트 갱신+신규(포탈 등장 조건·진입·비활성). `npm run test`+`npm run build` 그린.
   108	- 커밋은 redesign 브랜치에만. main·배포·원격 테스트 접근 금지.

exec
/bin/zsh -lc 'nl -ba src/ui/WizardPanel.tsx' in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import {
     2	  BASE_CAST_INTERVAL_MS,
     3	  BASE_CRIT_CHANCE,
     4	  CAST_SPEED_REDUCTION_MS,
     5	  CRIT_CHANCE_PER_POINT,
     6	  GOLD_GAIN_PER_POINT,
     7	  MIN_CAST_INTERVAL_MS,
     8	} from "../engine/constants"
     9	import { getTraitsForSlot, TRAIT_SLOTS, type TraitId, type TraitSlot } from "../engine/traits"
    10	import type { EngineState, SkillName } from "../engine/types"
    11	import { CodexGrid, ResonanceBadges, TomeIcon } from "./BooksPanelViews"
    12	import type { MessageKey, Translator } from "./i18n"
    13	import { useLocale } from "./useLocale"
    14	
    15	const SKILL_ROWS: readonly { readonly name: SkillName; readonly labelKey: MessageKey }[] = [
    16	  { name: "summonBonus", labelKey: "skillSummonFloor" },
    17	  { name: "castSpeed", labelKey: "skillCastSpeed" },
    18	  { name: "goldGain", labelKey: "skillGoldGain" },
    19	  { name: "critChance", labelKey: "skillCritChance" },
    20	] as const
    21	
    22	type WizardPanelProps = {
    23	  readonly state: EngineState
    24	  readonly onAllocateSkill: (skill: SkillName) => void
    25	  readonly onResetSkills: () => void
    26	  readonly onSelectTrait: (slot: TraitSlot, traitId: TraitId) => boolean
    27	}
    28	
    29	// Mirrors the engine's cast-interval formula (src/engine/battle.ts getCastIntervalMs).
    30	// That helper is private to the engine module, so the UI recomposes it from the
    31	// same exported constants rather than duplicating the magic numbers.
    32	function getCastIntervalMs(castSpeedPoints: number): number {
    33	  return Math.max(MIN_CAST_INTERVAL_MS, BASE_CAST_INTERVAL_MS - CAST_SPEED_REDUCTION_MS * castSpeedPoints)
    34	}
    35	
    36	function getSkillEffectCopy(skill: SkillName, state: EngineState, t: Translator): string {
    37	  switch (skill) {
    38	    case "summonBonus":
    39	      return t.skillSummonBonusEffect(state.skills.summonBonus)
    40	    case "castSpeed":
    41	      return t.skillCastSpeedEffect(CAST_SPEED_REDUCTION_MS, getCastIntervalMs(state.skills.castSpeed))
    42	    case "goldGain":
    43	      return t.skillGoldGainEffect(GOLD_GAIN_PER_POINT * 100, Math.round(state.skills.goldGain * GOLD_GAIN_PER_POINT * 100))
    44	    case "critChance":
    45	      return t.skillCritChanceEffect(CRIT_CHANCE_PER_POINT * 100, Math.round(
    46	        (BASE_CRIT_CHANCE + state.skills.critChance * CRIT_CHANCE_PER_POINT) * 100,
    47	      ))
    48	  }
    49	}
    50	
    51	// The Wizard tab answers "how strong am I": active skill points, arcane traits,
    52	// elemental resonance (equipped synergy), and the grimoire codex (collection
    53	// bonus). Resonance + codex moved here from the Books tab so Books stays focused
    54	// on equip/inventory/buy.
    55	export function WizardPanel(props: WizardPanelProps) {
    56	  const { t } = useLocale()
    57	
    58	  return (
    59	    <section className="panel tab-panel wizard-panel" aria-label="Wizard">
    60	      <div className="panel-header">
    61	        <span>{t("skillPoints")}</span>
    62	        <strong>{props.state.skillPoints}</strong>
    63	      </div>
    64	      {props.state.skillPoints === 0 ? (
    65	        <div className="empty-copy">{t("skillEmpty")}</div>
    66	      ) : null}
    67	      <div className="skill-list">
    68	        {SKILL_ROWS.map((skill) => (
    69	          <div className="skill-row" key={skill.name}>
    70	            <span className="skill-row-label">
    71	              {t(skill.labelKey)}
    72	              <span className="skill-row-effect">{getSkillEffectCopy(skill.name, props.state, t)}</span>
    73	            </span>
    74	            <strong>{props.state.skills[skill.name]}</strong>
    75	            <button
    76	              className="btn btn-mini"
    77	              data-testid={`skill-plus-${skill.name}`}
    78	              disabled={props.state.skillPoints < 1}
    79	              onClick={() => props.onAllocateSkill(skill.name)}
    80	              type="button"
    81	            >
    82	              +
    83	              {props.state.skillPoints > 0 ? <span aria-hidden="true" className="badge-dot" /> : null}
    84	            </button>
    85	          </div>
    86	        ))}
    87	      </div>
    88	      <button className="btn btn-wide" data-testid="skill-reset" onClick={props.onResetSkills} type="button">
    89	        {t("reset")}
    90	      </button>
    91	      <TraitsSection state={props.state} onSelectTrait={props.onSelectTrait} t={t} />
    92	      <div className="panel-header">
    93	        <span>{t("resonance")}</span>
    94	      </div>
    95	      <ResonanceBadges state={props.state} t={t} />
    96	      <div className="panel-header">
    97	        <span>{t("subCodex")}</span>
    98	      </div>
    99	      <CodexGrid state={props.state} t={t} renderTomeIcon={(element) => <TomeIcon element={element} />} />
   100	    </section>
   101	  )
   102	}
   103	
   104	function TraitsSection(props: {
   105	  readonly state: EngineState
   106	  readonly onSelectTrait: (slot: TraitSlot, traitId: TraitId) => boolean
   107	  readonly t: Translator
   108	}) {
   109	  return (
   110	    <section className="traits-section" aria-label="Arcane traits">
   111	      <div className="panel-header">
   112	        <span>{props.t("traits")}</span>
   113	        <strong>{Object.keys(props.state.traits.picks).filter((key) => key.startsWith("lv")).length}/3</strong>
   114	      </div>
   115	      {TRAIT_SLOTS.map((slot) => (
   116	        <TraitSlotRow key={slot} slot={slot} state={props.state} onSelectTrait={props.onSelectTrait} t={props.t} />
   117	      ))}
   118	    </section>
   119	  )
   120	}
   121	
   122	function TraitSlotRow(props: {
   123	  readonly slot: TraitSlot
   124	  readonly state: EngineState
   125	  readonly onSelectTrait: (slot: TraitSlot, traitId: TraitId) => boolean
   126	  readonly t: Translator
   127	}) {
   128	  const traits = getTraitsForSlot(props.slot)
   129	  const requiredLevel = traits[0]?.requiredLevel ?? 1
   130	  const unlocked = props.state.wizardLevel >= requiredLevel
   131	  const selected = props.state.traits.picks[props.slot]
   132	
   133	  return (
   134	    <div className={`trait-slot-row${unlocked ? " is-unlocked" : " is-locked"}`}>
   135	      <div className="trait-slot-title">
   136	        <span>{props.t.traitUnlock(requiredLevel)}</span>
   137	        {unlocked ? null : <strong>{props.t("locked")}</strong>}
   138	        {unlocked && selected !== undefined ? <strong>{props.t("selected")}</strong> : null}
   139	      </div>
   140	      <div className="trait-card-grid">
   141	        {traits.map((trait) => {
   142	          const isSelected = selected === trait.id
   143	          return (
   144	            <button
   145	              className={`trait-card${isSelected ? " is-selected" : ""}`}
   146	              data-testid={`trait-${props.slot}-${trait.id}`}
   147	              disabled={!unlocked || isSelected}
   148	              key={trait.id}
   149	              onClick={() => props.onSelectTrait(props.slot, trait.id)}
   150	              type="button"
   151	            >
   152	              <strong>{props.t.traitTitle(trait.id)}</strong>
   153	              <span>{props.t.traitDescription(trait.id)}</span>
   154	            </button>
   155	          )
   156	        })}
   157	      </div>
   158	    </div>
   159	  )
   160	}

exec
/bin/zsh -lc 'nl -ba src/engine/actions.ts' in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import {
     2	  BOSS_WAVE,
     3	  GOLDEN_RIFT_MS,
     4	  INVENTORY_LIMIT,
     5	  RELIC_LEVEL_CAP,
     6	  RELIC_SUMMON_COST,
     7	  RIFT_DAILY_LIMIT,
     8	  SLOT_INDEXES,
     9	  SLOT_MULTIPLIER_PER_TIER,
    10	  SLOT_UPGRADE_COST_BASE,
    11	  SLOT_UPGRADE_COST_GROWTH,
    12	  TRIAL_RIFT_BOSS_MULTIPLIERS,
    13	} from "./constants.js"
    14	import {
    15	  BookNotFoundError,
    16	  EmptySlotError,
    17	  InsufficientGoldError,
    18	  InsufficientManaCrystalsError,
    19	  InventoryFullError,
    20	  PrestigeRequirementError,
    21	  RelicLevelCapError,
    22	  RelicNotOwnedError,
    23	  RelicSlotIndexError,
    24	  RiftEntryError,
    25	  SkillPointError,
    26	  SlotIndexError,
    27	} from "./errors.js"
    28	import {
    29	  findBookLocation,
    30	  findHighestLevelMergePair,
    31	  refillEmptySlotsFromInventory,
    32	  refillSlotsFromInventory,
    33	  swapBookLocations,
    34	  toSlotIndex,
    35	} from "./bookSlots.js"
    36	import { mergeSpellbooks } from "./merge.js"
    37	import { trackProgress } from "./progression.js"
    38	import { nextRandomState } from "./rng.js"
    39	import { getEquippedRelicEffects, getUncappedRelicIds, isRelicId, RELIC_IDS, type RelicId } from "./relics.js"
    40	import { getSummonCost, getSummonLevel } from "./summon.js"
    41	import { getPrestigeCrystalReward } from "./balance.js"
    42	import {
    43	  createInitialState,
    44	  createWaveEnemies,
    45	  emptyEquipment,
    46	  setEquippedSlot,
    47	  setSlotTier,
    48	  sumHp,
    49	  zeroTimers,
    50	} from "./state.js"
    51	import { assertNever, type BattleSnapshot, type Element, type EngineState, type RelicEquipment, type RiftKind, type SkillName, type Spellbook } from "./types.js"
    52	import { grantTraitRespecAfterPrestige } from "./traits.js"
    53	import { equipSkin as equipSkinReducer, recordDailyProgress } from "./camp.js"
    54	
    55	export {
    56	  BookNotFoundError,
    57	  EmptySlotError,
    58	  InsufficientGoldError,
    59	  InsufficientManaCrystalsError,
    60	  InventoryFullError,
    61	  PrestigeRequirementError,
    62	  RelicLevelCapError,
    63	  RelicNotOwnedError,
    64	  RelicSlotIndexError,
    65	  RiftEntryError,
    66	  SkillPointError,
    67	  SlotIndexError,
    68	} from "./errors.js"
    69	export { claimQuestReward, selectTrait } from "./progressionActions.js"
    70	
    71	export function summonBook(state: EngineState): EngineState {
    72	  const emptySlot = SLOT_INDEXES.find((slot) => state.equipped[slot] === null)
    73	  if (emptySlot === undefined && state.books.length >= INVENTORY_LIMIT) { throw new InventoryFullError(INVENTORY_LIMIT) }
    74	
    75	  const summonLevel = getSummonLevel(state.highestLevelEver) + state.skills.summonBonus
    76	  const cost = getSummonCost(summonLevel, getEquippedRelicEffects(state.relics).summonCostMultiplier)
    77	  if (state.gold < cost) {
    78	    throw new InsufficientGoldError(cost, state.gold)
    79	  }
    80	
    81	  const roll = nextRandomState(state.rngState)
    82	  const spellbook: Spellbook = {
    83	    id: `book-${state.nextBookId}`,
    84	    level: summonLevel,
    85	    element: pickElement(roll.value),
    86	  }
    87	
    88	  const next = {
    89	    ...state,
    90	    gold: state.gold - cost,
    91	    books: emptySlot === undefined ? [...state.books, spellbook] : state.books,
    92	    equipped: emptySlot === undefined ? state.equipped : setEquippedSlot(state.equipped, emptySlot, spellbook),
    93	    highestLevelEver: Math.max(state.highestLevelEver, spellbook.level),
    94	    rngState: roll.state,
    95	    nextBookId: state.nextBookId + 1,
    96	  }
    97	
    98	  return recordDailyProgress(trackProgress(next, [{ counter: "summonsTotal", amount: 1 }], spellbook), "summon30", 1)
    99	}
   100	
   101	export function mergeBooks(state: EngineState, idA: string, idB: string): EngineState {
   102	  if (idA === idB) {
   103	    throw new BookNotFoundError(idB)
   104	  }
   105	
   106	  const left = findBookLocation(state, idA)
   107	  const right = findBookLocation(state, idB)
   108	  const roll = nextRandomState(state.rngState)
   109	  const mergedBase = mergeSpellbooks(left.book, right.book, () => roll.value)
   110	  const merged: Spellbook = { ...mergedBase, id: `book-${state.nextBookId}` }
   111	  const books = state.books.flatMap((item) => {
   112	    if (item.id === idA) {
   113	      return [merged]
   114	    }
   115	    if (item.id === idB) {
   116	      return []
   117	    }
   118	    return [item]
   119	  })
   120	
   121	  const equipped = SLOT_INDEXES.reduce((next, slot) => {
   122	    const equippedBook = state.equipped[slot]
   123	    if (equippedBook?.id === idA) {
   124	      return setEquippedSlot(next, slot, merged)
   125	    }
   126	    if (equippedBook?.id === idB) {
   127	      return setEquippedSlot(next, slot, null)
   128	    }
   129	    return next
   130	  }, state.equipped)
   131	
   132	  const next = {
   133	    ...state,
   134	    books,
   135	    equipped,
   136	    highestLevelEver: Math.max(state.highestLevelEver, merged.level),
   137	    rngState: roll.state,
   138	    nextBookId: state.nextBookId + 1,
   139	  }
   140	  const refilled = right.kind === "equipped" ? refillSlotsFromInventory(next, [right.slot]) : next
   141	
   142	  return recordDailyProgress(trackProgress(refilled, [{ counter: "mergesTotal", amount: 1 }], merged), "merge20", 1)
   143	}
   144	
   145	export function equipBook(state: EngineState, bookId: string, slotIdx: number): EngineState {
   146	  const targetSlot = toSlotIndex(slotIdx)
   147	  const source = findBookLocation(state, bookId)
   148	
   149	  if (source.kind === "equipped" && source.slot === targetSlot) {
   150	    return state
   151	  }
   152	
   153	  const targetBook = state.equipped[targetSlot]
   154	  const booksWithoutSource = state.books.filter((item) => item.id !== bookId)
   155	
   156	  switch (source.kind) {
   157	    case "inventory":
   158	      return trackProgress({
   159	        ...state,
   160	        books: targetBook === null ? booksWithoutSource : [...booksWithoutSource, targetBook],
   161	        equipped: setEquippedSlot(state.equipped, targetSlot, source.book),
   162	      })
   163	    case "equipped":
   164	      return trackProgress({
   165	        ...state,
   166	        equipped: setEquippedSlot(setEquippedSlot(state.equipped, targetSlot, source.book), source.slot, targetBook),
   167	      })
   168	    default:
   169	      return assertNever(source)
   170	  }
   171	}
   172	
   173	export function unequipBook(state: EngineState, slotIdx: number): EngineState {
   174	  const slot = toSlotIndex(slotIdx)
   175	  const equipped = state.equipped[slot]
   176	
   177	  if (equipped === null) {
   178	    throw new EmptySlotError(slot)
   179	  }
   180	
   181	  return refillSlotsFromInventory({
   182	    ...state,
   183	    books: [...state.books, equipped],
   184	    equipped: setEquippedSlot(state.equipped, slot, null),
   185	  }, [slot])
   186	}
   187	
   188	export function swapBookPositions(state: EngineState, idA: string, idB: string): EngineState {
   189	  if (idA === idB) {
   190	    throw new BookNotFoundError(idB)
   191	  }
   192	
   193	  return swapBookLocations(state, idA, idB)
   194	}
   195	
   196	export function refillEmptySlots(state: EngineState): EngineState {
   197	  return refillEmptySlotsFromInventory(state)
   198	}
   199	
   200	export function autoMergeBooks(state: EngineState): EngineState {
   201	  let current = state
   202	  let pair = findHighestLevelMergePair(current)
   203	
   204	  while (pair !== null) {
   205	    current = mergeBooks(current, pair.targetId, pair.consumedId)
   206	    pair = findHighestLevelMergePair(current)
   207	  }
   208	
   209	  return current
   210	}
   211	
   212	export function upgradeSlot(state: EngineState, slotIdx: number): EngineState {
   213	  const slot = toSlotIndex(slotIdx)
   214	  const currentTier = state.slotTiers[slot]
   215	  const cost = getSlotUpgradeCost(currentTier, getEquippedRelicEffects(state.relics).slotUpgradeCostMultiplier)
   216	
   217	  if (state.gold < cost) {
   218	    throw new InsufficientGoldError(cost, state.gold)
   219	  }
   220	
   221	  return trackProgress({
   222	    ...state,
   223	    gold: state.gold - cost,
   224	    slotTiers: setSlotTier(state.slotTiers, slot, currentTier + 1),
   225	  })
   226	}
   227	
   228	export function allocateSkill(state: EngineState, skill: SkillName): EngineState {
   229	  if (state.skillPoints < 1) {
   230	    throw new SkillPointError()
   231	  }
   232	
   233	  switch (skill) {
   234	    case "summonBonus":
   235	      return trackProgress({ ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, summonBonus: state.skills.summonBonus + 1 } })
   236	    case "castSpeed":
   237	      return trackProgress({ ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, castSpeed: state.skills.castSpeed + 1 } })
   238	    case "goldGain":
   239	      return trackProgress({ ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, goldGain: state.skills.goldGain + 1 } })
   240	    case "critChance":
   241	      return trackProgress({ ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, critChance: state.skills.critChance + 1 } })
   242	    default:
   243	      return assertNever(skill)
   244	  }
   245	}
   246	
   247	export function resetSkills(state: EngineState): EngineState {
   248	  const allocated = state.skills.summonBonus + state.skills.castSpeed + state.skills.goldGain + state.skills.critChance
   249	
   250	  return trackProgress({
   251	    ...state,
   252	    skillPoints: state.skillPoints + allocated,
   253	    skills: { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 },
   254	  })
   255	}
   256	
   257	export function prestige(state: EngineState): EngineState {
   258	  if (state.stage < BOSS_WAVE) {
   259	    throw new PrestigeRequirementError(state.stage)
   260	  }
   261	
   262	  const initial = createInitialState(state.rngSeed)
   263	  const manaCrystals = getPrestigeCrystalReward(state.stage, getEquippedRelicEffects(state.relics).crystalGainMultiplier)
   264	  const enemiesHp = createWaveEnemies(initial.stage, initial.wave)
   265	
   266	  return trackProgress(grantTraitRespecAfterPrestige({
   267	    ...initial,
   268	    gold: initial.gold + getEquippedRelicEffects(state.relics).startingGoldBonus,
   269	    skills: state.skills,
   270	    wizardLevel: state.wizardLevel,
   271	    wizardXp: state.wizardXp,
   272	    skillPoints: state.skillPoints,
   273	    manaCrystals: state.manaCrystals + manaCrystals,
   274	    prestigeCount: state.prestigeCount + 1,
   275	    highestStage: state.highestStage,
   276	    rngState: state.rngState,
   277	    nextBookId: initial.nextBookId,
   278	    equipped: emptyEquipment(),
   279	    castProgressMs: zeroTimers(),
   280	    enemiesHp,
   281	    stageHp: sumHp(enemiesHp),
   282	    lastSeenServerTs: state.lastSeenServerTs,
   283	    quests: state.quests,
   284	    achievements: state.achievements,
   285	    codex: state.codex,
   286	    traits: state.traits,
   287	    relics: state.relics,
   288	    riftRuns: state.riftRuns,
   289	    activeRift: null,
   290	    pet: state.pet,
   291	    mine: state.mine,
   292	    dailyMissions: state.dailyMissions,
   293	    skins: state.skins,
   294	  }))
   295	}
   296	
   297	export function summonRelic(state: EngineState): EngineState {
   298	  if (state.manaCrystals < RELIC_SUMMON_COST) {
   299	    throw new InsufficientManaCrystalsError(RELIC_SUMMON_COST, state.manaCrystals)
   300	  }
   301	
   302	  const uncapped = getUncappedRelicIds(state.relics)
   303	  if (uncapped.length === 0) {
   304	    throw new RelicLevelCapError("all")
   305	  }
   306	
   307	  const roll = nextRandomState(state.rngState)
   308	  const rolledIndex = Math.floor(roll.value * RELIC_IDS.length)
   309	  const rolledId = RELIC_IDS[rolledIndex] ?? "emberSigil"
   310	  const relicId = state.relics.owned[rolledId] === RELIC_LEVEL_CAP ? getFirstRelicId(uncapped) : rolledId
   311	  const currentLevel = state.relics.owned[relicId] ?? 0
   312	
   313	  if (currentLevel >= RELIC_LEVEL_CAP) {
   314	    throw new RelicLevelCapError(relicId)
   315	  }
   316	
   317	  return {
   318	    ...state,
   319	    manaCrystals: state.manaCrystals - RELIC_SUMMON_COST,
   320	    rngState: roll.state,
   321	    relics: {
   322	      ...state.relics,
   323	      owned: { ...state.relics.owned, [relicId]: currentLevel + 1 },
   324	    },
   325	  }
   326	}
   327	
   328	export function equipSkin(state: EngineState, skinId: string): EngineState {
   329	  return equipSkinReducer(state, skinId)
   330	}
   331	
   332	export function equipRelic(state: EngineState, relicId: string | null, slotIdx: number): EngineState {
   333	  const slot = toRelicSlot(slotIdx)
   334	  if (relicId !== null && (!isRelicId(relicId) || (state.relics.owned[relicId] ?? 0) < 1)) {
   335	    throw new RelicNotOwnedError(relicId)
   336	  }
   337	
   338	  const cleared = state.relics.equipped.map((equippedId) => (equippedId === relicId ? null : equippedId))
   339	  return {
   340	    ...state,
   341	    relics: {
   342	      ...state.relics,
   343	      equipped: setRelicSlot(toRelicEquipment(cleared), slot, relicId),
   344	    },
   345	  }
   346	}
   347	
   348	export function enterRift(state: EngineState, kind: RiftKind, date: string): EngineState {
   349	  if (state.activeRift !== null) {
   350	    throw new RiftEntryError("active-rift")
   351	  }
   352	
   353	  const riftRuns = state.riftRuns.date === date ? state.riftRuns : { date, golden: 0, trial: 0 }
   354	  const used = kind === "golden" ? riftRuns.golden : riftRuns.trial
   355	  if (used >= RIFT_DAILY_LIMIT) {
   356	    throw new RiftEntryError("daily-limit")
   357	  }
   358	
   359	  const snapshot = takeBattleSnapshot(state)
   360	  const nextRuns = kind === "golden"
   361	    ? { ...riftRuns, golden: riftRuns.golden + 1 }
   362	    : { ...riftRuns, trial: riftRuns.trial + 1 }
   363	  const enemiesHp = kind === "golden" ? createWaveEnemies(state.stage, 1) : createTrialEnemies(state.stage, 0)
   364	
   365	  return {
   366	    ...state,
   367	    riftRuns: nextRuns,
   368	    activeRift:
   369	      kind === "golden"
   370	        ? { kind, remainingMs: GOLDEN_RIFT_MS, startedStage: state.stage, snapshot }
   371	        : { kind, step: 0, startedStage: state.stage, snapshot },
   372	    wave: kind === "golden" ? 1 : BOSS_WAVE,
   373	    enemiesHp,
   374	    stageHp: sumHp(enemiesHp),
   375	    bossElapsedMs: 0,
   376	    frostSlowMs: 0,
   377	  }
   378	}
   379	
   380	export function exitRift(state: EngineState): EngineState {
   381	  if (state.activeRift === null) {
   382	    return state
   383	  }
   384	  return restoreBattleSnapshot(state)
   385	}
   386	
   387	export function getSlotUpgradeCost(currentTier: number, costMultiplier = 1): number {
   388	  return Math.ceil(SLOT_UPGRADE_COST_BASE * SLOT_UPGRADE_COST_GROWTH ** currentTier * costMultiplier)
   389	}
   390	
   391	export function getSlotMultiplier(currentTier: number): number {
   392	  return 1 + SLOT_MULTIPLIER_PER_TIER * currentTier
   393	}
   394	
   395	function pickElement(value: number): Element {
   396	  if (value < 1 / 3) {
   397	    return "fire"
   398	  }
   399	  if (value < 2 / 3) {
   400	    return "frost"
   401	  }
   402	  return "holy"
   403	}
   404	
   405	function toRelicSlot(slotIdx: number): 0 | 1 | 2 {
   406	  switch (slotIdx) {
   407	    case 0:
   408	    case 1:
   409	    case 2:
   410	      return slotIdx
   411	    default:
   412	      throw new RelicSlotIndexError(slotIdx)
   413	  }
   414	}
   415	
   416	function setRelicSlot(equipped: RelicEquipment, slot: 0 | 1 | 2, relicId: string | null): RelicEquipment {
   417	  switch (slot) {
   418	    case 0:
   419	      return [relicId, equipped[1], equipped[2]]
   420	    case 1:
   421	      return [equipped[0], relicId, equipped[2]]
   422	    case 2:
   423	      return [equipped[0], equipped[1], relicId]
   424	    default:
   425	      return assertNever(slot)
   426	  }
   427	}
   428	
   429	function toRelicEquipment(values: readonly (string | null)[]): RelicEquipment {
   430	  return [
   431	    values[0] ?? null,
   432	    values[1] ?? null,
   433	    values[2] ?? null,
   434	  ]
   435	}
   436	
   437	function takeBattleSnapshot(state: EngineState): BattleSnapshot {
   438	  return {
   439	    stage: state.stage,
   440	    wave: state.wave,
   441	    stageHp: state.stageHp,
   442	    enemiesHp: state.enemiesHp,
   443	    bossElapsedMs: state.bossElapsedMs,
   444	    frostSlowMs: state.frostSlowMs,
   445	  }
   446	}
   447	
   448	function restoreBattleSnapshot(state: EngineState): EngineState {
   449	  const activeRift = state.activeRift
   450	  if (activeRift === null) {
   451	    return state
   452	  }
   453	  return {
   454	    ...state,
   455	    ...activeRift.snapshot,
   456	    activeRift: null,
   457	  }
   458	}
   459	
   460	function createTrialEnemies(stage: number, step: number): readonly number[] {
   461	  const multiplier = TRIAL_RIFT_BOSS_MULTIPLIERS[step] ?? 2.2
   462	  const hp = createWaveEnemies(stage, BOSS_WAVE)[0] ?? 1
   463	  return [hp * multiplier]
   464	}
   465	
   466	function getFirstRelicId(ids: readonly RelicId[]): RelicId {
   467	  return ids[0] ?? "emberSigil"
   468	}

exec
/bin/zsh -lc 'nl -ba src/engine/traits.ts' in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import { GOLD_GAIN_PER_POINT, MIN_CAST_INTERVAL_MS } from "./constants.js"
     2	import { assertNever, type EngineState } from "./types.js"
     3	
     4	export const TRAIT_SLOTS = ["lv8", "lv16", "lv24"] as const
     5	export type TraitSlot = (typeof TRAIT_SLOTS)[number]
     6	
     7	export const TRAIT_IDS = [
     8	  "chainCast",
     9	  "goldenLibrary",
    10	  "elementalCycle",
    11	  "pyroGlyphs",
    12	  "deepFreeze",
    13	  "sanctifiedAim",
    14	  "archmageFocus",
    15	  "quickHands",
    16	  "treasureOath",
    17	] as const
    18	export type TraitId = (typeof TRAIT_IDS)[number]
    19	
    20	export type TraitDefinition = {
    21	  readonly id: TraitId
    22	  readonly slot: TraitSlot
    23	  readonly requiredLevel: number
    24	}
    25	
    26	const RESPEC_KEY = "__respecPrestige"
    27	
    28	export const TRAITS: readonly TraitDefinition[] = [
    29	  { id: "chainCast", slot: "lv8", requiredLevel: 8 },
    30	  { id: "goldenLibrary", slot: "lv8", requiredLevel: 8 },
    31	  { id: "elementalCycle", slot: "lv8", requiredLevel: 8 },
    32	  { id: "pyroGlyphs", slot: "lv16", requiredLevel: 16 },
    33	  { id: "deepFreeze", slot: "lv16", requiredLevel: 16 },
    34	  { id: "sanctifiedAim", slot: "lv16", requiredLevel: 16 },
    35	  { id: "archmageFocus", slot: "lv24", requiredLevel: 24 },
    36	  { id: "quickHands", slot: "lv24", requiredLevel: 24 },
    37	  { id: "treasureOath", slot: "lv24", requiredLevel: 24 },
    38	] as const
    39	
    40	export function getTraitsForSlot(slot: TraitSlot): readonly TraitDefinition[] {
    41	  return TRAITS.filter((trait) => trait.slot === slot)
    42	}
    43	
    44	export function isTraitId(value: string): value is TraitId {
    45	  return TRAIT_IDS.some((traitId) => traitId === value)
    46	}
    47	
    48	export function getTraitDefinition(slot: TraitSlot, traitId: TraitId): TraitDefinition {
    49	  const definition = TRAITS.find((trait) => trait.slot === slot && trait.id === traitId)
    50	  if (definition === undefined) {
    51	    throw new TraitSelectionError(slot, traitId, "wrong_slot")
    52	  }
    53	  return definition
    54	}
    55	
    56	export function hasTrait(state: EngineState, traitId: TraitId): boolean {
    57	  return Object.values(state.traits.picks).some((value) => value === traitId)
    58	}
    59	
    60	export function canSelectTrait(state: EngineState, slot: TraitSlot, traitId: TraitId): boolean {
    61	  const definition = getTraitDefinition(slot, traitId)
    62	  if (state.wizardLevel < definition.requiredLevel) {
    63	    return false
    64	  }
    65	
    66	  const existing = state.traits.picks[slot]
    67	  return existing === undefined || existing === traitId || hasRespecCredit(state)
    68	}
    69	
    70	export function selectTraitPick(state: EngineState, slot: TraitSlot, traitId: TraitId): EngineState {
    71	  const definition = getTraitDefinition(slot, traitId)
    72	  if (state.wizardLevel < definition.requiredLevel) {
    73	    throw new TraitSelectionError(slot, traitId, "locked")
    74	  }
    75	
    76	  const existing = state.traits.picks[slot]
    77	  if (existing !== undefined && existing !== traitId && !hasRespecCredit(state)) {
    78	    throw new TraitSelectionError(slot, traitId, "respec_unavailable")
    79	  }
    80	
    81	  const picks =
    82	    existing !== undefined && existing !== traitId
    83	      ? { ...state.traits.picks, [slot]: traitId, [RESPEC_KEY]: "0" }
    84	      : { ...state.traits.picks, [slot]: traitId }
    85	
    86	  return { ...state, traits: { picks } }
    87	}
    88	
    89	export function grantTraitRespecAfterPrestige(state: EngineState): EngineState {
    90	  if (Object.values(state.traits.picks).filter(isTraitId).length === 0) {
    91	    return state
    92	  }
    93	  return { ...state, traits: { picks: { ...state.traits.picks, [RESPEC_KEY]: String(state.prestigeCount) } } }
    94	}
    95	
    96	export function getResonanceRequirement(state: EngineState): number {
    97	  return hasTrait(state, "elementalCycle") ? 2 : 3
    98	}
    99	
   100	export function getTraitCastIntervalMultiplier(state: EngineState): number {
   101	  let multiplier = 1
   102	  if (hasTrait(state, "chainCast")) {
   103	    multiplier *= 0.8
   104	  }
   105	  if (hasTrait(state, "quickHands")) {
   106	    multiplier *= 0.9
   107	  }
   108	  return multiplier
   109	}
   110	
   111	export function applyTraitCastInterval(state: EngineState, intervalMs: number): number {
   112	  return Math.max(MIN_CAST_INTERVAL_MS, intervalMs * getTraitCastIntervalMultiplier(state))
   113	}
   114	
   115	export function getTraitGoldMultiplier(state: EngineState): number {
   116	  let multiplier = 1
   117	  if (hasTrait(state, "goldenLibrary")) {
   118	    multiplier += 0.15
   119	  }
   120	  if (hasTrait(state, "treasureOath")) {
   121	    multiplier += 0.25
   122	  }
   123	  return multiplier
   124	}
   125	
   126	export function getTraitSkillGoldPoints(state: EngineState): number {
   127	  return state.skills.goldGain + (getTraitGoldMultiplier(state) - 1) / GOLD_GAIN_PER_POINT
   128	}
   129	
   130	export function getTraitElementDamageMultiplier(state: EngineState, element: "fire" | "frost" | "holy"): number {
   131	  switch (element) {
   132	    case "fire":
   133	      return hasTrait(state, "pyroGlyphs") ? 1.2 : 1
   134	    case "frost":
   135	      return 1
   136	    case "holy":
   137	      return 1
   138	    default:
   139	      return assertNever(element)
   140	  }
   141	}
   142	
   143	export function getTraitCodexBonusPerTier(state: EngineState): number {
   144	  return hasTrait(state, "archmageFocus") ? 0.01 : 0
   145	}
   146	
   147	export function getTraitFrostSlowBonus(state: EngineState): { readonly factor: number; readonly durationMs: number } {
   148	  return hasTrait(state, "deepFreeze") ? { factor: 0.1, durationMs: 500 } : { factor: 0, durationMs: 0 }
   149	}
   150	
   151	export function getTraitHolyBossBonus(state: EngineState): number {
   152	  return hasTrait(state, "sanctifiedAim") ? 0.25 : 0
   153	}
   154	
   155	function hasRespecCredit(state: EngineState): boolean {
   156	  return state.prestigeCount > 0 && state.traits.picks[RESPEC_KEY] === String(state.prestigeCount)
   157	}
   158	
   159	export class TraitSelectionError extends Error {
   160	  readonly name = "TraitSelectionError"
   161	
   162	  constructor(
   163	    readonly slot: TraitSlot,
   164	    readonly traitId: TraitId,
   165	    readonly reason: "locked" | "respec_unavailable" | "wrong_slot",
   166	  ) {
   167	    super(`Trait ${traitId} cannot be selected in ${slot}: ${reason}`)
   168	  }
   169	}

exec
/bin/zsh -lc 'nl -ba src/engine/simulate.ts' in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import { equipBook, mergeBooks } from "./actions.js"
     2	import { addPetXp } from "./camp.js"
     3	import * as C from "./constants.js"
     4	import { getCodexBonusMultiplier, recordBookCodex } from "./codex.js"
     5	import { getEquippedRelicEffects, getElementDamageMultiplier, RELIC_IDS, type RelicId } from "./relics.js"
     6	import { getFireTargetCap, getFrostSlow, getHolyBossMultiplier } from "./resonance.js"
     7	import { createRandomState, nextRandomState } from "./rng.js"
     8	import { createInitialV3ProgressionState, setEquippedSlot, setSlotTier, setSlotTimer, sumHp } from "./state.js"
     9	import {
    10	  applyTraitCastInterval,
    11	  getTraitCodexBonusPerTier,
    12	  getTraitElementDamageMultiplier,
    13	  getTraitSkillGoldPoints,
    14	  type TraitId,
    15	  type TraitSlot,
    16	} from "./traits.js"
    17	import { assertNever, type Element, type EngineState, type EquippedBooks, type SlotIndex, type SlotTiers, type SlotTimers, type Spellbook } from "./types.js"
    18	
    19	type CliProcess = {
    20	  readonly argv: readonly string[]
    21	  readonly stdout: { readonly write: (text: string) => void }
    22	}
    23	
    24	declare const process: CliProcess | undefined
    25	
    26	const INNATE_STAFF_INTERVAL_MS = 1_200
    27	const PET_ATTACK_INTERVAL_MS = 1_000
    28	const PET_BASE_DPS_SHARE = 0.05
    29	const PET_LEVEL_DPS_SHARE = 0.01
    30	const PET_EVOLUTION_DPS_SHARE = 0.05
    31	const RECENT_POWERUP_INTERVALS = 10
    32	const POLICY_INTERVAL_TICKS = 10
    33	const WALL_STRENGTH_CAP = 999.9
    34	
    35	const SIMULATION_CONSTANT_KEYS = [
    36	  "SUMMON_FLOOR_GAP",
    37	  "SUMMON_COST_BASE",
    38	  "SUMMON_COST_GROWTH",
    39	  "DMG_BASE",
    40	  "DMG_GROWTH",
    41	  "HP_BASE",
    42	  "HP_GROWTH",
    43	  "INITIAL_GOLD",
    44	  "INITIAL_STAGE",
    45	  "INITIAL_WAVE",
    46	  "INITIAL_HIGHEST_LEVEL",
    47	  "INVENTORY_LIMIT",
    48	  "SLOT_UPGRADE_COST_BASE",
    49	  "SLOT_UPGRADE_COST_GROWTH",
    50	  "SLOT_MULTIPLIER_PER_TIER",
    51	  "TICK_MS",
    52	  "BASE_CAST_INTERVAL_MS",
    53	  "CAST_SPEED_REDUCTION_MS",
    54	  "MIN_CAST_INTERVAL_MS",
    55	  "REGULAR_MOB_BASE_COUNT",
    56	  "REGULAR_MOB_MIN_COUNT",
    57	  "REGULAR_MOB_MAX_COUNT",
    58	  "REGULAR_MOB_STAGE_BAND",
    59	  "BOSS_WAVE",
    60	  "BOSS_EXPECTED_DPS_BASE",
    61	  "BOSS_EXPECTED_DPS_GROWTH",
    62	  "BOSS_REGULAR_FACTOR",
    63	  "BOSS_WALL_FACTOR",
    64	  "BOSS_GATE_FACTOR",
    65	  "BOSS_ENRAGE_MS",
    66	  "FIRE_TARGET_CAP",
    67	  "FROST_SLOW_MS",
    68	  "FROST_SLOW_FACTOR",
    69	  "BASE_CRIT_CHANCE",
    70	  "CRIT_CHANCE_PER_POINT",
    71	  "CRIT_DAMAGE_MULTIPLIER",
    72	  "MANA_DAMAGE_PER_CRYSTAL",
    73	  "GOLD_REWARD_BASE",
    74	  "GOLD_REWARD_GROWTH",
    75	  "GOLD_GAIN_PER_POINT",
    76	  "BOSS_REWARD_MULTIPLIER",
    77	  "WIZARD_XP_PER_LEVEL",
    78	  "WIZARD_CAST_MILESTONE_LEVEL",
    79	  "WIZARD_CAST_INTERVAL_MULTIPLIER",
    80	  "WIZARD_CRIT_MILESTONE_LEVEL",
    81	  "WIZARD_CRIT_CHANCE_BONUS",
    82	  "WIZARD_GOLD_MILESTONE_LEVEL",
    83	  "WIZARD_GOLD_MULTIPLIER",
    84	  "TOME_DAMAGE_MILESTONE_MULTIPLIER",
    85	  "PRESTIGE_STAGE_OFFSET",
    86	  "PRESTIGE_CRYSTAL_EXPONENT",
    87	  "PRESTIGE_CRYSTAL_DIVISOR",
    88	  "XP_PER_KILL",
    89	  "XP_PER_BOSS_KILL",
    90	] as const
    91	
    92	type SimulationConstantKey = (typeof SIMULATION_CONSTANT_KEYS)[number]
    93	type SimulationOverrides = Partial<Record<SimulationConstantKey, number>>
    94	type SimulationConfig = Record<SimulationConstantKey, number>
    95	
    96	export type SimulationOptions = {
    97	  readonly minutes: number
    98	  readonly seed?: number
    99	  readonly rowMinutes?: number
   100	  readonly overrides?: SimulationOverrides
   101	}
   102	
   103	export type SimulationRow = {
   104	  readonly minute: number
   105	  readonly stage: number
   106	  readonly highestBookLevel: number
   107	  readonly gold: number
   108	  readonly summonFloor: number
   109	  readonly wallStrength: number
   110	  readonly flags: readonly string[]
   111	}
   112	
   113	export type StageBreakthrough = {
   114	  readonly stage: number
   115	  readonly minute: number
   116	}
   117	
   118	export type SimulationSummary = {
   119	  readonly firstPrestigeMinute: number | null
   120	  readonly firstWallMinute: number | null
   121	  readonly stageBreakthroughs: readonly StageBreakthrough[]
   122	}
   123	
   124	export type SimulationResult = {
   125	  readonly rows: readonly SimulationRow[]
   126	  readonly finalState: EngineState
   127	  readonly summary: SimulationSummary
   128	  readonly overrides: SimulationOverrides
   129	}
   130	
   131	type PowerupTracker = {
   132	  readonly lastPowerupSecond: number | null
   133	  readonly intervals: readonly number[]
   134	}
   135	
   136	type PolicyResult = {
   137	  readonly state: EngineState
   138	  readonly powerup: boolean
   139	  readonly prestiged: boolean
   140	}
   141	
   142	type TickResult = {
   143	  readonly state: EngineState
   144	  readonly goldEarned: number
   145	}
   146	
   147	type CliOptions = {
   148	  readonly minutes: number
   149	  readonly rowMinutes?: number
   150	  readonly summary: boolean
   151	  readonly overrides: SimulationOverrides
   152	}
   153	
   154	export class CliArgumentError extends Error {
   155	  readonly name = "CliArgumentError"
   156	
   157	  constructor(readonly argument: string) {
   158	    super(`Invalid simulator argument: ${argument}`)
   159	  }
   160	}
   161	
   162	export function runBalanceSimulation(options: SimulationOptions): SimulationResult {
   163	  const seed = options.seed ?? 1
   164	  const config = createSimulationConfig(options.overrides ?? {})
   165	  const totalTicks = Math.floor((options.minutes * 60 * 1_000) / config.TICK_MS)
   166	  const rowIntervalTicks = Math.max(1, Math.floor(((options.rowMinutes ?? 10) * 60 * 1_000) / config.TICK_MS))
   167	  let state = createInitialSimulationState(seed, config)
   168	  let rows: readonly SimulationRow[] = []
   169	  let tracker: PowerupTracker = { lastPowerupSecond: null, intervals: [] }
   170	  let lastProgressMinute = 0
   171	  let lastStage = state.stage
   172	  let firstPrestigeMinute: number | null = null
   173	  let firstWallMinute: number | null = null
   174	  let stageBreakthroughs: readonly StageBreakthrough[] = []
   175	
   176	  for (let tick = 1; tick <= totalTicks; tick += POLICY_INTERVAL_TICKS) {
   177	    const policy = applyGreedyPolicy(state, config)
   178	    state = policy.state
   179	    tracker = policy.powerup ? recordPowerup(tracker, ((tick - 1) * config.TICK_MS) / 1_000) : tracker
   180	    if (firstPrestigeMinute === null && policy.prestiged) {
   181	      firstPrestigeMinute = Math.floor(((tick - 1) * config.TICK_MS) / 60_000)
   182	    }
   183	
   184	    const ticksThisStep = Math.min(POLICY_INTERVAL_TICKS, totalTicks - tick + 1)
   185	    state = simulateTicksForBalance(state, ticksThisStep, config).state
   186	    const currentTick = tick + ticksThisStep - 1
   187	    const minute = Math.floor((currentTick * config.TICK_MS) / 60_000)
   188	
   189	    if (state.stage > lastStage) {
   190	      stageBreakthroughs = recordStageBreakthroughs(stageBreakthroughs, lastStage, state.stage, minute)
   191	      lastStage = state.stage
   192	      lastProgressMinute = minute
   193	    }
   194	
   195	    if (currentTick % rowIntervalTicks === 0) {
   196	      const wallStrength = getWallStrength(state, tracker, config)
   197	      if (firstWallMinute === null && wallStrength > 5) {
   198	        firstWallMinute = minute
   199	      }
   200	      rows = [
   201	        ...rows,
   202	        {
   203	          minute,
   204	          stage: state.stage,
   205	          highestBookLevel: getHighestBookLevel(state),
   206	          gold: state.gold,
   207	          summonFloor: getSummonLevel(state.highestLevelEver, config) + state.skills.summonBonus,
   208	          wallStrength,
   209	          flags: minute - lastProgressMinute > 15 ? ["STALL"] : [],
   210	        },
   211	      ]
   212	    }
   213	  }
   214	
   215	  return {
   216	    rows,
   217	    finalState: state,
   218	    summary: { firstPrestigeMinute, firstWallMinute, stageBreakthroughs },
   219	    overrides: options.overrides ?? {},
   220	  }
   221	}
   222	
   223	export function formatSimulation(result: SimulationResult): string {
   224	  const lines = ["minute | stage | highest book | gold | summon floor | wall | flags"]
   225	
   226	  for (const row of result.rows) {
   227	    lines.push(
   228	      `${row.minute.toString().padStart(6)} | ${row.stage.toString().padStart(5)} | ${row.highestBookLevel
   229	        .toString()
   230	        .padStart(12)} | ${Math.floor(row.gold).toString().padStart(4)} | ${row.summonFloor.toString().padStart(12)} | ${formatWall(
   231	        row.wallStrength,
   232	      ).padStart(4)} | ${row.flags.length === 0 ? "-" : row.flags.join(",")}`,
   233	    )
   234	  }
   235	
   236	  return `${formatOverrideHeader(result)}${lines.join("\n")}\n`
   237	}
   238	
   239	export function formatSimulationSummary(result: SimulationResult): string {
   240	  const lines: readonly string[] = [
   241	    ...formatOverrideLines(result),
   242	    `first prestige: ${formatMinute(result.summary.firstPrestigeMinute)}`,
   243	    `first wall>5: ${formatMinute(result.summary.firstWallMinute)}`,
   244	    ...result.summary.stageBreakthroughs.map((event) => `stage ${event.stage}: ${event.minute}m`),
   245	    `final: stage ${result.finalState.stage}, wave ${result.finalState.wave}, highest book ${getHighestBookLevel(result.finalState)}, gold ${Math.floor(
   246	      result.finalState.gold,
   247	    )}, mana ${result.finalState.manaCrystals}`,
   248	  ]
   249	
   250	  return `${lines.join("\n")}\n`
   251	}
   252	
   253	function createSimulationConfig(overrides: SimulationOverrides): SimulationConfig {
   254	  return { ...DEFAULT_SIMULATION_CONFIG, ...overrides }
   255	}
   256	
   257	const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
   258	  SUMMON_FLOOR_GAP: C.SUMMON_FLOOR_GAP,
   259	  SUMMON_COST_BASE: C.SUMMON_COST_BASE,
   260	  SUMMON_COST_GROWTH: C.SUMMON_COST_GROWTH,
   261	  DMG_BASE: C.DMG_BASE,
   262	  DMG_GROWTH: C.DMG_GROWTH,
   263	  HP_BASE: C.HP_BASE,
   264	  HP_GROWTH: C.HP_GROWTH,
   265	  INITIAL_GOLD: C.INITIAL_GOLD,
   266	  INITIAL_STAGE: C.INITIAL_STAGE,
   267	  INITIAL_WAVE: C.INITIAL_WAVE,
   268	  INITIAL_HIGHEST_LEVEL: C.INITIAL_HIGHEST_LEVEL,
   269	  INVENTORY_LIMIT: C.INVENTORY_LIMIT,
   270	  SLOT_UPGRADE_COST_BASE: C.SLOT_UPGRADE_COST_BASE,
   271	  SLOT_UPGRADE_COST_GROWTH: C.SLOT_UPGRADE_COST_GROWTH,
   272	  SLOT_MULTIPLIER_PER_TIER: C.SLOT_MULTIPLIER_PER_TIER,
   273	  TICK_MS: C.TICK_MS,
   274	  BASE_CAST_INTERVAL_MS: C.BASE_CAST_INTERVAL_MS,
   275	  CAST_SPEED_REDUCTION_MS: C.CAST_SPEED_REDUCTION_MS,
   276	  MIN_CAST_INTERVAL_MS: C.MIN_CAST_INTERVAL_MS,
   277	  REGULAR_MOB_BASE_COUNT: C.REGULAR_MOB_BASE_COUNT,
   278	  REGULAR_MOB_MIN_COUNT: C.REGULAR_MOB_MIN_COUNT,
   279	  REGULAR_MOB_MAX_COUNT: C.REGULAR_MOB_MAX_COUNT,
   280	  REGULAR_MOB_STAGE_BAND: C.REGULAR_MOB_STAGE_BAND,
   281	  BOSS_WAVE: C.BOSS_WAVE,
   282	  BOSS_EXPECTED_DPS_BASE: C.BOSS_EXPECTED_DPS_BASE,
   283	  BOSS_EXPECTED_DPS_GROWTH: C.BOSS_EXPECTED_DPS_GROWTH,
   284	  BOSS_REGULAR_FACTOR: C.BOSS_REGULAR_FACTOR,
   285	  BOSS_WALL_FACTOR: C.BOSS_WALL_FACTOR,
   286	  BOSS_GATE_FACTOR: C.BOSS_GATE_FACTOR,
   287	  BOSS_ENRAGE_MS: C.BOSS_ENRAGE_MS,
   288	  FIRE_TARGET_CAP: C.FIRE_TARGET_CAP,
   289	  FROST_SLOW_MS: C.FROST_SLOW_MS,
   290	  FROST_SLOW_FACTOR: C.FROST_SLOW_FACTOR,
   291	  BASE_CRIT_CHANCE: C.BASE_CRIT_CHANCE,
   292	  CRIT_CHANCE_PER_POINT: C.CRIT_CHANCE_PER_POINT,
   293	  CRIT_DAMAGE_MULTIPLIER: C.CRIT_DAMAGE_MULTIPLIER,
   294	  MANA_DAMAGE_PER_CRYSTAL: C.MANA_DAMAGE_PER_CRYSTAL,
   295	  GOLD_REWARD_BASE: C.GOLD_REWARD_BASE,
   296	  GOLD_REWARD_GROWTH: C.GOLD_REWARD_GROWTH,
   297	  GOLD_GAIN_PER_POINT: C.GOLD_GAIN_PER_POINT,
   298	  BOSS_REWARD_MULTIPLIER: C.BOSS_REWARD_MULTIPLIER,
   299	  WIZARD_XP_PER_LEVEL: C.WIZARD_XP_PER_LEVEL,
   300	  WIZARD_CAST_MILESTONE_LEVEL: C.WIZARD_CAST_MILESTONE_LEVEL,
   301	  WIZARD_CAST_INTERVAL_MULTIPLIER: C.WIZARD_CAST_INTERVAL_MULTIPLIER,
   302	  WIZARD_CRIT_MILESTONE_LEVEL: C.WIZARD_CRIT_MILESTONE_LEVEL,
   303	  WIZARD_CRIT_CHANCE_BONUS: C.WIZARD_CRIT_CHANCE_BONUS,
   304	  WIZARD_GOLD_MILESTONE_LEVEL: C.WIZARD_GOLD_MILESTONE_LEVEL,
   305	  WIZARD_GOLD_MULTIPLIER: C.WIZARD_GOLD_MULTIPLIER,
   306	  TOME_DAMAGE_MILESTONE_MULTIPLIER: C.TOME_DAMAGE_MILESTONE_MULTIPLIER,
   307	  PRESTIGE_STAGE_OFFSET: C.PRESTIGE_STAGE_OFFSET,
   308	  PRESTIGE_CRYSTAL_EXPONENT: C.PRESTIGE_CRYSTAL_EXPONENT,
   309	  PRESTIGE_CRYSTAL_DIVISOR: C.PRESTIGE_CRYSTAL_DIVISOR,
   310	  XP_PER_KILL: C.XP_PER_KILL,
   311	  XP_PER_BOSS_KILL: C.XP_PER_BOSS_KILL,
   312	}
   313	
   314	function applyGreedyPolicy(state: EngineState, config: SimulationConfig): PolicyResult {
   315	  const meta = applyMetaPolicy(state, config)
   316	  const summoned = summonAffordableBooks(meta.state, config)
   317	  let current = mergeAllPairs(summoned.state)
   318	  let changed = true
   319	
   320	  while (changed) {
   321	    const before = current
   322	    const next = summonAffordableBooks(current, config)
   323	    current = mergeAllPairs(next.state)
   324	    changed = before !== current
   325	  }
   326	
   327	  const upgraded = upgradeCheapestSlot(equipTopSix(current), config)
   328	  return { state: upgraded.state, powerup: meta.powerup || summoned.powerup || upgraded.powerup, prestiged: meta.prestiged }
   329	}
   330	
   331	function applyMetaPolicy(state: EngineState, config: SimulationConfig): PolicyResult {
   332	  const withTraits = selectGreedyTraits(state)
   333	  const withRelics = summonAndEquipRelics(withTraits)
   334	  const previewCrystals = getPrestigeCrystalReward(withRelics.stage, getEquippedRelicEffects(withRelics.relics).crystalGainMultiplier, config)
   335	
   336	  if (previewCrystals >= getPrestigeTarget(withRelics.prestigeCount)) {
   337	    return {
   338	      state: prestigeForBalance(withRelics, previewCrystals, config),
   339	      powerup: true,
   340	      prestiged: true,
   341	    }
   342	  }
   343	
   344	  return { state: withRelics, powerup: withRelics !== state, prestiged: false }
   345	}
   346	
   347	function summonAffordableBooks(state: EngineState, config: SimulationConfig): PolicyResult {
   348	  let current = state
   349	  let powerup = false
   350	  let canContinue = true
   351	
   352	  while (canContinue) {
   353	    const summonLevel = getSummonLevel(current.highestLevelEver, config) + current.skills.summonBonus
   354	    const summonCost = getSummonCost(summonLevel, config)
   355	    if (current.books.length >= config.INVENTORY_LIMIT || current.gold < summonCost) {
   356	      canContinue = false
   357	    } else {
   358	      current = summonBookForBalance(current, summonLevel, summonCost)
   359	      powerup = true
   360	    }
   361	  }
   362	
   363	  return { state: current, powerup, prestiged: false }
   364	}
   365	
   366	function mergeAllPairs(state: EngineState): EngineState {
   367	  let current = state
   368	  let pair = findMergePair(current)
   369	
   370	  while (pair !== null) {
   371	    current = mergeBooks(current, pair.leftId, pair.rightId)
   372	    pair = findMergePair(current)
   373	  }
   374	
   375	  return current
   376	}
   377	
   378	function findMergePair(state: EngineState): { readonly leftId: string; readonly rightId: string } | null {
   379	  const books = getAllBooks(state)
   380	
   381	  for (const left of books) {
   382	    for (const right of books) {
   383	      if (left.id !== right.id && left.level === right.level) {
   384	        return { leftId: left.id, rightId: right.id }
   385	      }
   386	    }
   387	  }
   388	
   389	  return null
   390	}
   391	
   392	function equipTopSix(state: EngineState): EngineState {
   393	  const sorted = [...getAllBooks(state)].sort((left, right) => right.level - left.level)
   394	  let current: EngineState = { ...state, books: sorted, equipped: emptyEquipment() }
   395	  const top = sorted.slice(0, C.SLOT_INDEXES.length)
   396	
   397	  for (const book of top) {
   398	    const firstEmpty = C.SLOT_INDEXES.find((slot) => current.equipped[slot] === null)
   399	    if (firstEmpty !== undefined) {
   400	      current = equipBook(current, book.id, firstEmpty)
   401	    }
   402	  }
   403	
   404	  return current
   405	}
   406	
   407	function upgradeCheapestSlot(state: EngineState, config: SimulationConfig): PolicyResult {
   408	  const summonLevel = getSummonLevel(state.highestLevelEver, config) + state.skills.summonBonus
   409	  const summonCost = getSummonCost(summonLevel, config)
   410	  let cheapestSlot: SlotIndex = 0
   411	  let cheapestCost = getSlotUpgradeCost(state.slotTiers[cheapestSlot], config)
   412	
   413	  for (const slot of C.SLOT_INDEXES) {
   414	    const cost = getSlotUpgradeCost(state.slotTiers[slot], config)
   415	    if (cost < cheapestCost) {
   416	      cheapestSlot = slot
   417	      cheapestCost = cost
   418	    }
   419	  }
   420	
   421	  if (state.gold > summonCost * 5 && state.gold >= cheapestCost) {
   422	    return {
   423	      state: { ...state, gold: state.gold - cheapestCost, slotTiers: setSlotTier(state.slotTiers, cheapestSlot, state.slotTiers[cheapestSlot] + 1) },
   424	      powerup: true,
   425	      prestiged: false,
   426	    }
   427	  }
   428	
   429	  return { state, powerup: false, prestiged: false }
   430	}
   431	
   432	function selectGreedyTraits(state: EngineState): EngineState {
   433	  return selectTraitIfOpen(
   434	    selectTraitIfOpen(
   435	      selectTraitIfOpen(state, "lv8", "elementalCycle", 8),
   436	      "lv16",
   437	      "pyroGlyphs",
   438	      16,
   439	    ),
   440	    "lv24",
   441	    "quickHands",
   442	    24,
   443	  )
   444	}
   445	
   446	function selectTraitIfOpen(state: EngineState, slot: TraitSlot, traitId: TraitId, requiredLevel: number): EngineState {
   447	  if (state.wizardLevel < requiredLevel || state.traits.picks[slot] !== undefined) {
   448	    return state
   449	  }
   450	  return { ...state, traits: { picks: { ...state.traits.picks, [slot]: traitId } } }
   451	}
   452	
   453	function summonAndEquipRelics(state: EngineState): EngineState {
   454	  let current = state
   455	
   456	  while (current.manaCrystals >= C.RELIC_SUMMON_COST) {
   457	    const roll = nextRandomState(current.rngState)
   458	    const relicId = RELIC_IDS[Math.floor(roll.value * RELIC_IDS.length)] ?? "emberSigil"
   459	    const level = current.relics.owned[relicId] ?? 0
   460	    if (level >= C.RELIC_LEVEL_CAP) {
   461	      return { ...current, rngState: roll.state }
   462	    }
   463	    current = {
   464	      ...current,
   465	      manaCrystals: current.manaCrystals - C.RELIC_SUMMON_COST,
   466	      rngState: roll.state,
   467	      relics: {
   468	        ...current.relics,
   469	        owned: { ...current.relics.owned, [relicId]: level + 1 },
   470	      },
   471	    }
   472	  }
   473	
   474	  return equipPreferredRelics(current)
   475	}
   476	
   477	function equipPreferredRelics(state: EngineState): EngineState {
   478	  const preferred: readonly RelicId[] = ["quickeningHourglass", "emberSigil", "goldenBookmark", "crystalVial", "sageInk", "craftsmanChisel"]
   479	  const equipped = preferred.filter((relicId) => (state.relics.owned[relicId] ?? 0) > 0).slice(0, 3)
   480	  return {
   481	    ...state,
   482	    relics: {
   483	      ...state.relics,
   484	      equipped: [equipped[0] ?? null, equipped[1] ?? null, equipped[2] ?? null],
   485	    },
   486	  }
   487	}
   488	
   489	function getPrestigeTarget(prestigeCount: number): number {
   490	  return Math.floor(3 * 1.45 ** prestigeCount)
   491	}
   492	
   493	function prestigeForBalance(state: EngineState, manaCrystals: number, config: SimulationConfig): EngineState {
   494	  const enemiesHp = createWaveEnemies(config.INITIAL_STAGE, config.INITIAL_WAVE, config)
   495	  return {
   496	    ...state,
   497	    gold: config.INITIAL_GOLD + getEquippedRelicEffects(state.relics).startingGoldBonus,
   498	    books: [],
   499	    equipped: emptyEquipment(),
   500	    highestLevelEver: config.INITIAL_HIGHEST_LEVEL,
   501	    stage: config.INITIAL_STAGE,
   502	    wave: config.INITIAL_WAVE,
   503	    stageHp: sumHp(enemiesHp),
   504	    manaCrystals: state.manaCrystals + manaCrystals,
   505	    prestigeCount: state.prestigeCount + 1,
   506	    highestStage: state.highestStage,
   507	    castProgressMs: zeroSlots(),
   508	    enemiesHp,
   509	    bossElapsedMs: 0,
   510	    frostSlowMs: 0,
   511	    recentGoldPerSecond: 0,
   512	    activeRift: null,
   513	  }
   514	}
   515	
   516	function simulateTicksForBalance(state: EngineState, nTicks: number, config: SimulationConfig): TickResult {
   517	  let current = normalizeBattleState(state, config)
   518	  let goldEarned = 0
   519	
   520	  for (let tick = 0; tick < nTicks; tick += 1) {
   521	    const previousElapsedMs = current.elapsedMs
   522	    current = {
   523	      ...current,
   524	      elapsedMs: previousElapsedMs + config.TICK_MS,
   525	      frostSlowMs: Math.max(0, current.frostSlowMs - config.TICK_MS),
   526	    }
   527	
   528	    if (shouldCastInnateStaff(previousElapsedMs, current.elapsedMs)) {
   529	      const applied = applyInnateStaffDamage(current, config)
   530	      current = applied.state
   531	      goldEarned += applied.goldEarned
   532	    }
   533	
   534	    if (shouldPetAttack(previousElapsedMs, current.elapsedMs)) {
   535	      const applied = applyPetDamage(current, config)
   536	      current = applied.state
   537	      goldEarned += applied.goldEarned
   538	    }
   539	
   540	    for (const slot of C.SLOT_INDEXES) {
   541	      const book = current.equipped[slot]
   542	      if (book === null) {
   543	        current = { ...current, castProgressMs: setSlotTimer(current.castProgressMs, slot, 0) }
   544	        continue
   545	      }
   546	
   547	      const nextProgress = current.castProgressMs[slot] + config.TICK_MS
   548	      const castInterval = getCastIntervalMs(current, config)
   549	      if (nextProgress < castInterval) {
   550	        current = { ...current, castProgressMs: setSlotTimer(current.castProgressMs, slot, nextProgress) }
   551	        continue
   552	      }
   553	
   554	      const damageRoll = bookDamage(book, current.slotTiers[slot], current, config)
   555	      current = { ...damageRoll.state, castProgressMs: setSlotTimer(damageRoll.state.castProgressMs, slot, nextProgress - castInterval) }
   556	      const applied = applyCastDamage(current, slot, book, damageRoll.damage, config)
   557	      current = applied.state
   558	      goldEarned += applied.goldEarned
   559	    }
   560	
   561	    if (current.wave === config.BOSS_WAVE && current.enemiesHp.length > 0) {
   562	      const bossElapsedMs = current.bossElapsedMs + config.TICK_MS
   563	      current = { ...current, bossElapsedMs }
   564	      if (bossElapsedMs >= config.BOSS_ENRAGE_MS) {
   565	        const enemiesHp = createWaveEnemies(current.stage, 1, config)
   566	        current = {
   567	          ...current,
   568	          wave: 1,
   569	          enemiesHp,
   570	          stageHp: sumHp(enemiesHp),
   571	          bossElapsedMs: 0,
   572	          frostSlowMs: 0,
   573	        }
   574	      }
   575	    }
   576	  }
   577	
   578	  return {
   579	    state: {
   580	      ...current,
   581	      recentGoldPerSecond: nTicks > 0 ? goldEarned / ((nTicks * config.TICK_MS) / 1_000) : current.recentGoldPerSecond,
   582	    },
   583	    goldEarned,
   584	  }
   585	}
   586	
   587	function applyInnateStaffDamage(state: EngineState, config: SimulationConfig): TickResult {
   588	  if (state.enemiesHp.length === 0) {
   589	    return { state, goldEarned: 0 }
   590	  }
   591	
   592	  const damage = config.DMG_BASE * 0.6 * (1 + config.MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals)
   593	  const damaged = state.enemiesHp.map((hp, index) => (index === 0 ? hp - damage : hp))
   594	  return finalizeDamage(state, damaged, config)
   595	}
   596	
   597	function applyPetDamage(state: EngineState, config: SimulationConfig): TickResult {
   598	  if (state.enemiesHp.length === 0) {
   599	    return { state, goldEarned: 0 }
   600	  }
   601	
   602	  const damage = getPetDps(state, config)
   603	  if (damage <= 0) {
   604	    return { state, goldEarned: 0 }
   605	  }
   606	
   607	  const damaged = state.enemiesHp.map((hp, index) => (index === 0 ? hp - damage : hp))
   608	  return finalizeDamage(state, damaged, config)
   609	}
   610	
   611	function applyCastDamage(state: EngineState, slot: SlotIndex, book: Spellbook, baseDamage: number, config: SimulationConfig): TickResult {
   612	  if (state.enemiesHp.length === 0) {
   613	    return { state, goldEarned: 0 }
   614	  }
   615	
   616	  const targetsHit = getTargetsHit(book.element, state.enemiesHp.length, state)
   617	  const damage = getElementDamage(book.element, baseDamage, state.wave, state, config)
   618	  const damaged = state.enemiesHp.map((hp, index) => (index < targetsHit ? hp - damage : hp))
   619	  const frostSlow = getFrostSlow(state)
   620	  const frostSlowMs = frostSlow.durationMs + getEquippedRelicEffects(state.relics).frostSlowBonusMs
   621	  const slowedState = book.element === "frost" ? { ...state, frostSlowMs: Math.max(state.frostSlowMs, frostSlowMs) } : state
   622	  return finalizeDamage(slowedState, damaged, config)
   623	}
   624	
   625	function finalizeDamage(state: EngineState, damaged: readonly number[], config: SimulationConfig): TickResult {
   626	  const survivors = damaged.filter((hp) => hp > 0)
   627	  const killed = damaged.length - survivors.length
   628	  const boss = state.wave === config.BOSS_WAVE
   629	  const reward = getKillReward(state, boss, config)
   630	  const gold = reward * killed
   631	  const xpPerKill = getXpPerKill(state, boss, config)
   632	  const withXp = addWizardXp({ ...state, gold: state.gold + gold }, xpPerKill * killed, config)
   633	  const stateWithEnemies = { ...withXp, enemiesHp: survivors, stageHp: sumHp(survivors) }
   634	  const cleared = survivors.length === 0 ? advanceWave(stateWithEnemies, config) : stateWithEnemies
   635	
   636	  return { state: cleared, goldEarned: gold }
   637	}
   638	
   639	function advanceWave(state: EngineState, config: SimulationConfig): EngineState {
   640	  if (state.wave === config.BOSS_WAVE) {
   641	    const nextStage = state.stage + 1
   642	    const enemiesHp = createWaveEnemies(nextStage, 1, config)
   643	    return { ...state, stage: nextStage, highestStage: Math.max(state.highestStage, nextStage), wave: 1, enemiesHp, stageHp: sumHp(enemiesHp), bossElapsedMs: 0 }
   644	  }
   645	
   646	  const nextWave = state.wave + 1
   647	  const enemiesHp = createWaveEnemies(state.stage, nextWave, config)
   648	  return { ...state, wave: nextWave, enemiesHp, stageHp: sumHp(enemiesHp), bossElapsedMs: 0 }
   649	}
   650	
   651	function addWizardXp(state: EngineState, xp: number, config: SimulationConfig): EngineState {
   652	  let wizardLevel = state.wizardLevel
   653	  let wizardXp = state.wizardXp + xp
   654	  let skillPoints = state.skillPoints
   655	
   656	  while (wizardXp >= config.WIZARD_XP_PER_LEVEL * wizardLevel) {
   657	    wizardXp -= config.WIZARD_XP_PER_LEVEL * wizardLevel
   658	    wizardLevel += 1
   659	    skillPoints += 1
   660	  }
   661	
   662	  return addPetXp({ ...state, wizardLevel, wizardXp, skillPoints }, xp * 0.5)
   663	}
   664	
   665	function createInitialSimulationState(seed: number, config: SimulationConfig): EngineState {
   666	  const enemiesHp = createWaveEnemies(config.INITIAL_STAGE, config.INITIAL_WAVE, config)
   667	
   668	  return {
   669	    gold: config.INITIAL_GOLD,
   670	    books: [],
   671	    equipped: emptyEquipment(),
   672	    highestLevelEver: config.INITIAL_HIGHEST_LEVEL,
   673	    highestStage: config.INITIAL_STAGE,
   674	    stage: config.INITIAL_STAGE,
   675	    wave: config.INITIAL_WAVE,
   676	    stageHp: sumHp(enemiesHp),
   677	    wizardLevel: 1,
   678	    wizardXp: 0,
   679	    skillPoints: 0,
   680	    skills: { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 },
   681	    manaCrystals: 0,
   682	    prestigeCount: 0,
   683	    lastSeenServerTs: null,
   684	    slotTiers: zeroSlots(),
   685	    castProgressMs: zeroSlots(),
   686	    enemiesHp,
   687	    bossElapsedMs: 0,
   688	    frostSlowMs: 0,
   689	    recentGoldPerSecond: 0,
   690	    elapsedMs: 0,
   691	    rngSeed: seed,
   692	    rngState: createRandomState(seed),
   693	    nextBookId: 1,
   694	    ...createInitialV3ProgressionState(),
   695	  }
   696	}
   697	
   698	function summonBookForBalance(state: EngineState, summonLevel: number, cost: number): EngineState {
   699	  const emptySlot = C.SLOT_INDEXES.find((slot) => state.equipped[slot] === null)
   700	  const roll = nextRandomState(state.rngState)
   701	  const spellbook: Spellbook = {
   702	    id: `book-${state.nextBookId}`,
   703	    level: summonLevel,
   704	    element: pickElement(roll.value),
   705	  }
   706	
   707	  return recordBookCodex({
   708	    ...state,
   709	    gold: state.gold - cost,
   710	    books: emptySlot === undefined ? [...state.books, spellbook] : state.books,
   711	    equipped: emptySlot === undefined ? state.equipped : setEquippedSlot(state.equipped, emptySlot, spellbook),
   712	    highestLevelEver: Math.max(state.highestLevelEver, spellbook.level),
   713	    rngState: roll.state,
   714	    nextBookId: state.nextBookId + 1,
   715	  }, spellbook)
   716	}
   717	
   718	function recordPowerup(tracker: PowerupTracker, second: number): PowerupTracker {
   719	  if (tracker.lastPowerupSecond === null) {
   720	    return { ...tracker, lastPowerupSecond: second }
   721	  }
   722	
   723	  if (tracker.lastPowerupSecond === second) {
   724	    return tracker
   725	  }
   726	
   727	  return {
   728	    lastPowerupSecond: second,
   729	    intervals: [...tracker.intervals, second - tracker.lastPowerupSecond].slice(-RECENT_POWERUP_INTERVALS),
   730	  }
   731	}
   732	
   733	function getWallStrength(state: EngineState, tracker: PowerupTracker, config: SimulationConfig): number {
   734	  if (state.stage < 7) {
   735	    return 0
   736	  }
   737	
   738	  const median = getMedian(tracker.intervals)
   739	  if (median === null || median <= 0) {
   740	    return 0
   741	  }
   742	
   743	  return Math.min(WALL_STRENGTH_CAP, getExpectedPowerupWaitSeconds(state, config) / median)
   744	}
   745	
   746	function getExpectedPowerupWaitSeconds(state: EngineState, config: SimulationConfig): number {
   747	  const requiredGold = Math.min(getNextSummonRequiredGold(state, config), getNextSlotRequiredGold(state, config))
   748	  if (requiredGold <= state.gold) {
   749	    return 0
   750	  }
   751	
   752	  return state.recentGoldPerSecond > 0 ? (requiredGold - state.gold) / state.recentGoldPerSecond : Number.POSITIVE_INFINITY
   753	}
   754	
   755	function getNextSummonRequiredGold(state: EngineState, config: SimulationConfig): number {
   756	  if (state.books.length >= config.INVENTORY_LIMIT) {
   757	    return Number.POSITIVE_INFINITY
   758	  }
   759	
   760	  return getSummonCost(getSummonLevel(state.highestLevelEver, config) + state.skills.summonBonus, config)
   761	}
   762	
   763	function getNextSlotRequiredGold(state: EngineState, config: SimulationConfig): number {
   764	  const summonCost = getSummonCost(getSummonLevel(state.highestLevelEver, config) + state.skills.summonBonus, config)
   765	  const cheapest = C.SLOT_INDEXES.reduce((best, slot) => Math.min(best, getSlotUpgradeCost(state.slotTiers[slot], config)), getSlotUpgradeCost(state.slotTiers[0], config))
   766	  return Math.max(cheapest, summonCost * 5)
   767	}
   768	
   769	function getMedian(values: readonly number[]): number | null {
   770	  if (values.length === 0) {
   771	    return null
   772	  }
   773	
   774	  const sorted = [...values].sort((left, right) => left - right)
   775	  const mid = Math.floor(sorted.length / 2)
   776	  const middle = sorted[mid]
   777	  if (middle === undefined) {
   778	    return null
   779	  }
   780	
   781	  if (sorted.length % 2 === 1) {
   782	    return middle
   783	  }
   784	
   785	  const before = sorted[mid - 1]
   786	  return before === undefined ? middle : (before + middle) / 2
   787	}
   788	
   789	function recordStageBreakthroughs(events: readonly StageBreakthrough[], previousStage: number, nextStage: number, minute: number): readonly StageBreakthrough[] {
   790	  let recorded = events
   791	  for (let stage = Math.ceil((previousStage + 1) / 10) * 10; stage <= nextStage; stage += 10) {
   792	    recorded = [...recorded, { stage, minute }]
   793	  }
   794	  return recorded
   795	}
   796	
   797	function normalizeBattleState(state: EngineState, config: SimulationConfig): EngineState {
   798	  if (state.enemiesHp.length > 0) {
   799	    return { ...state, stageHp: sumHp(state.enemiesHp) }
   800	  }
   801	
   802	  const enemiesHp = createWaveEnemies(state.stage, state.wave, config)
   803	  return { ...state, enemiesHp, stageHp: sumHp(enemiesHp) }
   804	}
   805	
   806	function createWaveEnemies(stage: number, wave: number, config: SimulationConfig): readonly number[] {
   807	  const hp = config.HP_BASE * config.HP_GROWTH ** stage
   808	  if (wave === config.BOSS_WAVE) {
   809	    return [getBossHp(stage, config)]
   810	  }
   811	
   812	  const mobCount = getRegularMobCount(stage, config)
   813	  return Array.from({ length: mobCount }, () => (hp * config.REGULAR_MOB_BASE_COUNT) / mobCount)
   814	}
   815	
   816	function bookDamage(book: Spellbook, slotTier: number, state: EngineState, config: SimulationConfig): { readonly state: EngineState; readonly damage: number } {
   817	  const roll = nextRandomState(state.rngState)
   818	  const critChance = Math.min(1, config.BASE_CRIT_CHANCE + config.CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel, config))
   819	  const critical = roll.value < critChance
   820	  const relicEffects = getEquippedRelicEffects(state.relics)
   821	  const critFactor = critical ? config.CRIT_DAMAGE_MULTIPLIER + relicEffects.critDamageBonus : 1
   822	  const damage =
   823	    config.DMG_BASE *
   824	    config.DMG_GROWTH ** book.level *
   825	    getSlotMultiplier(slotTier, config) *
   826	    (1 + config.MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals) *
   827	    getElementDamageMultiplier(book.element, state.relics) *
   828	    getElementProgressionMultiplier(state, book.element) *
   829	    getTomeMilestoneDamageMultiplier(state.highestLevelEver, config) *
   830	    critFactor
   831	
   832	  return { state: { ...state, rngState: roll.state }, damage }
   833	}
   834	
   835	function shouldCastInnateStaff(previousElapsedMs: number, nextElapsedMs: number): boolean {
   836	  return Math.floor(previousElapsedMs / INNATE_STAFF_INTERVAL_MS) < Math.floor(nextElapsedMs / INNATE_STAFF_INTERVAL_MS)
   837	}
   838	
   839	function shouldPetAttack(previousElapsedMs: number, nextElapsedMs: number): boolean {
   840	  return Math.floor(previousElapsedMs / PET_ATTACK_INTERVAL_MS) < Math.floor(nextElapsedMs / PET_ATTACK_INTERVAL_MS)
   841	}
   842	
   843	function getTargetsHit(element: Element, enemyCount: number, state: EngineState): number {
   844	  switch (element) {
   845	    case "fire":
   846	      return Math.min(getFireTargetCap(state), enemyCount)
   847	    case "frost":
   848	      return Math.min(1, enemyCount)
   849	    case "holy":
   850	      return Math.min(1, enemyCount)
   851	    default:
   852	      return assertNever(element)
   853	  }
   854	}
   855	
   856	function getElementDamage(element: Element, damage: number, wave: number, state: EngineState, config: SimulationConfig): number {
   857	  switch (element) {
   858	    case "fire":
   859	      return damage
   860	    case "frost":
   861	      return damage
   862	    case "holy":
   863	      return wave === config.BOSS_WAVE ? damage * getHolyBossMultiplier(state) : damage
   864	    default:
   865	      return assertNever(element)
   866	  }
   867	}
   868	
   869	function pickElement(value: number): Element {
   870	  if (value < 1 / 3) {
   871	    return "fire"
   872	  }
   873	  if (value < 2 / 3) {
   874	    return "frost"
   875	  }
   876	  return "holy"
   877	}
   878	
   879	function getCastIntervalMs(state: EngineState, config: SimulationConfig): number {
   880	  const baseInterval = config.BASE_CAST_INTERVAL_MS - config.CAST_SPEED_REDUCTION_MS * state.skills.castSpeed
   881	  const relicInterval = baseInterval * getEquippedRelicEffects(state.relics).castIntervalMultiplier * getWizardCastIntervalMultiplier(state.wizardLevel, config)
   882	  return applyTraitCastInterval(state, Math.max(config.MIN_CAST_INTERVAL_MS, relicInterval))
   883	}
   884	
   885	function getKillReward(state: EngineState, boss: boolean, config: SimulationConfig): number {
   886	  const relicEffects = getEquippedRelicEffects(state.relics)
   887	  const reward = Math.ceil(
   888	    config.GOLD_REWARD_BASE *
   889	      config.GOLD_REWARD_GROWTH ** state.stage *
   890	      (1 + config.GOLD_GAIN_PER_POINT * getTraitSkillGoldPoints(state)) *
   891	      getWizardGoldMultiplier(state.wizardLevel, config) *
   892	      relicEffects.goldMultiplier,
   893	  )
   894	  return boss
   895	    ? Math.ceil(reward * config.BOSS_REWARD_MULTIPLIER * relicEffects.bossGoldMultiplier)
   896	    : Math.ceil((reward * config.REGULAR_MOB_BASE_COUNT) / getRegularMobCount(state.stage, config))
   897	}
   898	
   899	function getSlotUpgradeCost(currentTier: number, config: SimulationConfig): number {
   900	  return config.SLOT_UPGRADE_COST_BASE * config.SLOT_UPGRADE_COST_GROWTH ** currentTier
   901	}
   902	
   903	function getSlotMultiplier(currentTier: number, config: SimulationConfig): number {
   904	  return 1 + config.SLOT_MULTIPLIER_PER_TIER * currentTier
   905	}
   906	
   907	function getRegularMobCount(stage: number, config: SimulationConfig): number {
   908	  return Math.min(config.REGULAR_MOB_MAX_COUNT, config.REGULAR_MOB_MIN_COUNT + Math.floor(Math.max(0, stage - 1) / config.REGULAR_MOB_STAGE_BAND))
   909	}
   910	
   911	function getBossHp(stage: number, config: SimulationConfig): number {
   912	  return config.BOSS_EXPECTED_DPS_BASE * config.BOSS_EXPECTED_DPS_GROWTH ** stage * (config.BOSS_ENRAGE_MS / 1_000) * getBossFactor(stage, config)
   913	}
   914	
   915	function getBossFactor(stage: number, config: SimulationConfig): number {
   916	  if (stage % 10 === 0) {
   917	    return config.BOSS_GATE_FACTOR
   918	  }
   919	  if (stage % 5 === 0) {
   920	    return config.BOSS_WALL_FACTOR
   921	  }
   922	  return config.BOSS_REGULAR_FACTOR
   923	}
   924	
   925	function getXpPerKill(state: EngineState, boss: boolean, config: SimulationConfig): number {
   926	  const baseXp = boss ? config.XP_PER_BOSS_KILL : (config.XP_PER_KILL * config.REGULAR_MOB_BASE_COUNT) / getRegularMobCount(state.stage, config)
   927	  return baseXp * getEquippedRelicEffects(state.relics).xpMultiplier
   928	}
   929	
   930	function getPetDps(state: EngineState, config: SimulationConfig): number {
   931	  return getWizardTotalDps(state, config) * (PET_BASE_DPS_SHARE + PET_LEVEL_DPS_SHARE * state.pet.level + PET_EVOLUTION_DPS_SHARE * state.pet.evolution)
   932	}
   933	
   934	function getWizardTotalDps(state: EngineState, config: SimulationConfig): number {
   935	  const castIntervalSeconds = getCastIntervalMs(state, config) / 1_000
   936	  const equippedDps = C.SLOT_INDEXES.reduce<number>((total, slot) => {
   937	    const book = state.equipped[slot]
   938	    return book === null ? total : total + getExpectedBookDamage(state, book, state.slotTiers[slot], config) / castIntervalSeconds
   939	  }, 0)
   940	  const innateStaffDps = (config.DMG_BASE * 0.6 * (1 + config.MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals)) / (INNATE_STAFF_INTERVAL_MS / 1_000)
   941	  return equippedDps + innateStaffDps
   942	}
   943	
   944	function getExpectedBookDamage(state: EngineState, book: Spellbook, slotTier: number, config: SimulationConfig): number {
   945	  const critChance = Math.min(1, config.BASE_CRIT_CHANCE + config.CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel, config))
   946	  const expectedCritFactor = 1 + critChance * (config.CRIT_DAMAGE_MULTIPLIER + getEquippedRelicEffects(state.relics).critDamageBonus - 1)
   947	  const bossElementMultiplier = book.element === "holy" && state.wave === config.BOSS_WAVE ? getHolyBossMultiplier(state) : 1
   948	  return config.DMG_BASE *
   949	    config.DMG_GROWTH ** book.level *
   950	    getSlotMultiplier(slotTier, config) *
   951	    (1 + config.MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals) *
   952	    getElementDamageMultiplier(book.element, state.relics) *
   953	    getElementProgressionMultiplier(state, book.element) *
   954	    getTomeMilestoneDamageMultiplier(state.highestLevelEver, config) *
   955	    bossElementMultiplier *
   956	    expectedCritFactor
   957	}
   958	
   959	function getElementProgressionMultiplier(state: EngineState, element: Element): number {
   960	  const codexTiers = state.codex.tiers[element] ?? 0
   961	  return getCodexBonusMultiplier(state, element) * (1 + getTraitCodexBonusPerTier(state) * codexTiers) * getTraitElementDamageMultiplier(state, element)
   962	}
   963	
   964	function getTomeMilestoneDamageMultiplier(highestLevelEver: number, config: SimulationConfig): number {
   965	  const milestones = [10, 20, 30, 40] as const
   966	  return config.TOME_DAMAGE_MILESTONE_MULTIPLIER ** milestones.filter((level) => highestLevelEver >= level).length
   967	}
   968	
   969	function getWizardCastIntervalMultiplier(wizardLevel: number, config: SimulationConfig): number {
   970	  return wizardLevel >= config.WIZARD_CAST_MILESTONE_LEVEL ? config.WIZARD_CAST_INTERVAL_MULTIPLIER : 1
   971	}
   972	
   973	function getWizardCritChanceBonus(wizardLevel: number, config: SimulationConfig): number {
   974	  return wizardLevel >= config.WIZARD_CRIT_MILESTONE_LEVEL ? config.WIZARD_CRIT_CHANCE_BONUS : 0
   975	}
   976	
   977	function getWizardGoldMultiplier(wizardLevel: number, config: SimulationConfig): number {
   978	  return wizardLevel >= config.WIZARD_GOLD_MILESTONE_LEVEL ? config.WIZARD_GOLD_MULTIPLIER : 1
   979	}
   980	
   981	function getPrestigeCrystalReward(stage: number, crystalGainMultiplier: number, config: SimulationConfig): number {
   982	  const progress = Math.max(0, stage - config.PRESTIGE_STAGE_OFFSET)
   983	  return Math.floor((progress ** config.PRESTIGE_CRYSTAL_EXPONENT / config.PRESTIGE_CRYSTAL_DIVISOR) * crystalGainMultiplier)
   984	}
   985	
   986	function getSummonLevel(highestLevel: number, config: SimulationConfig): number {
   987	  return Math.max(1, highestLevel - config.SUMMON_FLOOR_GAP)
   988	}
   989	
   990	function getSummonCost(summonLevel: number, config: SimulationConfig): number {
   991	  return Math.ceil(config.SUMMON_COST_BASE * config.SUMMON_COST_GROWTH ** summonLevel)
   992	}
   993	
   994	function getAllBooks(state: EngineState): readonly Spellbook[] {
   995	  return [...state.books, ...state.equipped.filter((book): book is Spellbook => book !== null)]
   996	}
   997	
   998	function getHighestBookLevel(state: EngineState): number {
   999	  return getAllBooks(state).reduce((highest, book) => Math.max(highest, book.level), state.highestLevelEver)
  1000	}
  1001	
  1002	function emptyEquipment(): EquippedBooks {
  1003	  return [null, null, null, null, null, null]
  1004	}
  1005	
  1006	function zeroSlots(): SlotTiers & SlotTimers {
  1007	  return [0, 0, 0, 0, 0, 0]
  1008	}
  1009	
  1010	function formatWall(value: number): string {
  1011	  return (Number.isFinite(value) ? value : WALL_STRENGTH_CAP).toFixed(1)
  1012	}
  1013	
  1014	function formatMinute(value: number | null): string {
  1015	  return value === null ? "-" : `${value}m`
  1016	}
  1017	
  1018	function formatOverrideHeader(result: SimulationResult): string {
  1019	  const lines = formatOverrideLines(result)
  1020	  return lines.length === 0 ? "" : `${lines.join("\n")}\n`
  1021	}
  1022	
  1023	function formatOverrideLines(result: SimulationResult): readonly string[] {
  1024	  const entries = Object.entries(result.overrides)
  1025	  return entries.length === 0 ? [] : [`overrides: ${entries.map(([key, value]) => `${key}=${value}`).join(", ")}`]
  1026	}
  1027	
  1028	function parseCliOptions(argv: readonly string[]): CliOptions {
  1029	  const rowMinutes = parseOptionalNumberFlag(argv, "--row-minutes")
  1030	  const base = {
  1031	    minutes: parseNumberFlag(argv, "--minutes", 120),
  1032	    summary: argv.includes("--summary"),
  1033	    overrides: parseSetOverrides(argv),
  1034	  }
  1035	
  1036	  return rowMinutes === undefined ? base : { ...base, rowMinutes }
  1037	}
  1038	
  1039	function parseNumberFlag(argv: readonly string[], flag: string, fallback: number): number {
  1040	  const flagIndex = argv.findIndex((arg) => arg === flag)
  1041	  if (flagIndex === -1) {
  1042	    return fallback
  1043	  }
  1044	
  1045	  const raw = argv[flagIndex + 1]
  1046	  const value = Number(raw)
  1047	  if (raw === undefined || !Number.isFinite(value) || value <= 0) {
  1048	    throw new CliArgumentError(raw ?? flag)
  1049	  }
  1050	
  1051	  return value
  1052	}
  1053	
  1054	function parseOptionalNumberFlag(argv: readonly string[], flag: string): number | undefined {
  1055	  const flagIndex = argv.findIndex((arg) => arg === flag)
  1056	  if (flagIndex === -1) {
  1057	    return undefined
  1058	  }
  1059	
  1060	  const raw = argv[flagIndex + 1]
  1061	  const value = Number(raw)
  1062	  if (raw === undefined || !Number.isFinite(value) || value <= 0) {
  1063	    throw new CliArgumentError(raw ?? flag)
  1064	  }
  1065	
  1066	  return value
  1067	}
  1068	
  1069	function parseSetOverrides(argv: readonly string[]): SimulationOverrides {
  1070	  let overrides: SimulationOverrides = {}
  1071	
  1072	  for (let index = 0; index < argv.length; index += 1) {
  1073	    if (argv[index] !== "--set") {
  1074	      continue
  1075	    }
  1076	
  1077	    const raw = argv[index + 1]
  1078	    if (raw === undefined) {
  1079	      throw new CliArgumentError("--set")
  1080	    }
  1081	
  1082	    const parsed = parseOverride(raw)
  1083	    overrides = { ...overrides, [parsed.key]: parsed.value }
  1084	  }
  1085	
  1086	  return overrides
  1087	}
  1088	
  1089	function parseOverride(raw: string): { readonly key: SimulationConstantKey; readonly value: number } {
  1090	  const separator = raw.indexOf("=")
  1091	  if (separator <= 0 || separator === raw.length - 1) {
  1092	    throw new CliArgumentError(raw)
  1093	  }
  1094	
  1095	  const key = raw.slice(0, separator)
  1096	  const value = Number(raw.slice(separator + 1))
  1097	  if (!isSimulationConstantKey(key) || !Number.isFinite(value)) {
  1098	    throw new CliArgumentError(raw)
  1099	  }
  1100	
  1101	  return { key, value }
  1102	}
  1103	
  1104	function isSimulationConstantKey(key: string): key is SimulationConstantKey {
  1105	  return SIMULATION_CONSTANT_KEYS.some((candidate) => candidate === key)
  1106	}
  1107	
  1108	function isCliEntry(argv: readonly string[]): boolean {
  1109	  const entry = argv[1]
  1110	  return entry !== undefined && (entry.endsWith("simulate.ts") || entry.endsWith("simulate.js"))
  1111	}
  1112	
  1113	if (typeof process !== "undefined" && isCliEntry(process.argv)) {
  1114	  const options = parseCliOptions(process.argv)
  1115	  const simulationOptions = {
  1116	    minutes: options.minutes,
  1117	    overrides: options.overrides,
  1118	  }
  1119	  const result = runBalanceSimulation(options.rowMinutes === undefined ? simulationOptions : { ...simulationOptions, rowMinutes: options.rowMinutes })
  1120	  process.stdout.write(options.summary ? formatSimulationSummary(result) : formatSimulation(result))
  1121	}

2026-07-04T07:02:08.139733Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:02:08.144391Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
codex
지정 파일만으로는 `SAVE_VERSION`과 실제 레벨업 발생 지점이 보이지 않아, 설계 충돌을 피하려고 관련 정의 위치만 추가로 확인합니다. 변경은 하지 않습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '489,680p' src/engine/simulate.ts | nl -ba -v489" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
   489	function getPrestigeTarget(prestigeCount: number): number {
   490	  return Math.floor(3 * 1.45 ** prestigeCount)
   491	}
   492	
   493	function prestigeForBalance(state: EngineState, manaCrystals: number, config: SimulationConfig): EngineState {
   494	  const enemiesHp = createWaveEnemies(config.INITIAL_STAGE, config.INITIAL_WAVE, config)
   495	  return {
   496	    ...state,
   497	    gold: config.INITIAL_GOLD + getEquippedRelicEffects(state.relics).startingGoldBonus,
   498	    books: [],
   499	    equipped: emptyEquipment(),
   500	    highestLevelEver: config.INITIAL_HIGHEST_LEVEL,
   501	    stage: config.INITIAL_STAGE,
   502	    wave: config.INITIAL_WAVE,
   503	    stageHp: sumHp(enemiesHp),
   504	    manaCrystals: state.manaCrystals + manaCrystals,
   505	    prestigeCount: state.prestigeCount + 1,
   506	    highestStage: state.highestStage,
   507	    castProgressMs: zeroSlots(),
   508	    enemiesHp,
   509	    bossElapsedMs: 0,
   510	    frostSlowMs: 0,
   511	    recentGoldPerSecond: 0,
   512	    activeRift: null,
   513	  }
   514	}
   515	
   516	function simulateTicksForBalance(state: EngineState, nTicks: number, config: SimulationConfig): TickResult {
   517	  let current = normalizeBattleState(state, config)
   518	  let goldEarned = 0
   519	
   520	  for (let tick = 0; tick < nTicks; tick += 1) {
   521	    const previousElapsedMs = current.elapsedMs
   522	    current = {
   523	      ...current,
   524	      elapsedMs: previousElapsedMs + config.TICK_MS,
   525	      frostSlowMs: Math.max(0, current.frostSlowMs - config.TICK_MS),
   526	    }
   527	
   528	    if (shouldCastInnateStaff(previousElapsedMs, current.elapsedMs)) {
   529	      const applied = applyInnateStaffDamage(current, config)
   530	      current = applied.state
   531	      goldEarned += applied.goldEarned
   532	    }
   533	
   534	    if (shouldPetAttack(previousElapsedMs, current.elapsedMs)) {
   535	      const applied = applyPetDamage(current, config)
   536	      current = applied.state
   537	      goldEarned += applied.goldEarned
   538	    }
   539	
   540	    for (const slot of C.SLOT_INDEXES) {
   541	      const book = current.equipped[slot]
   542	      if (book === null) {
   543	        current = { ...current, castProgressMs: setSlotTimer(current.castProgressMs, slot, 0) }
   544	        continue
   545	      }
   546	
   547	      const nextProgress = current.castProgressMs[slot] + config.TICK_MS
   548	      const castInterval = getCastIntervalMs(current, config)
   549	      if (nextProgress < castInterval) {
   550	        current = { ...current, castProgressMs: setSlotTimer(current.castProgressMs, slot, nextProgress) }
   551	        continue
   552	      }
   553	
   554	      const damageRoll = bookDamage(book, current.slotTiers[slot], current, config)
   555	      current = { ...damageRoll.state, castProgressMs: setSlotTimer(damageRoll.state.castProgressMs, slot, nextProgress - castInterval) }
   556	      const applied = applyCastDamage(current, slot, book, damageRoll.damage, config)
   557	      current = applied.state
   558	      goldEarned += applied.goldEarned
   559	    }
   560	
   561	    if (current.wave === config.BOSS_WAVE && current.enemiesHp.length > 0) {
   562	      const bossElapsedMs = current.bossElapsedMs + config.TICK_MS
   563	      current = { ...current, bossElapsedMs }
   564	      if (bossElapsedMs >= config.BOSS_ENRAGE_MS) {
   565	        const enemiesHp = createWaveEnemies(current.stage, 1, config)
   566	        current = {
   567	          ...current,
   568	          wave: 1,
   569	          enemiesHp,
   570	          stageHp: sumHp(enemiesHp),
   571	          bossElapsedMs: 0,
   572	          frostSlowMs: 0,
   573	        }
   574	      }
   575	    }
   576	  }
   577	
   578	  return {
   579	    state: {
   580	      ...current,
   581	      recentGoldPerSecond: nTicks > 0 ? goldEarned / ((nTicks * config.TICK_MS) / 1_000) : current.recentGoldPerSecond,
   582	    },
   583	    goldEarned,
   584	  }
   585	}
   586	
   587	function applyInnateStaffDamage(state: EngineState, config: SimulationConfig): TickResult {
   588	  if (state.enemiesHp.length === 0) {
   589	    return { state, goldEarned: 0 }
   590	  }
   591	
   592	  const damage = config.DMG_BASE * 0.6 * (1 + config.MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals)
   593	  const damaged = state.enemiesHp.map((hp, index) => (index === 0 ? hp - damage : hp))
   594	  return finalizeDamage(state, damaged, config)
   595	}
   596	
   597	function applyPetDamage(state: EngineState, config: SimulationConfig): TickResult {
   598	  if (state.enemiesHp.length === 0) {
   599	    return { state, goldEarned: 0 }
   600	  }
   601	
   602	  const damage = getPetDps(state, config)
   603	  if (damage <= 0) {
   604	    return { state, goldEarned: 0 }
   605	  }
   606	
   607	  const damaged = state.enemiesHp.map((hp, index) => (index === 0 ? hp - damage : hp))
   608	  return finalizeDamage(state, damaged, config)
   609	}
   610	
   611	function applyCastDamage(state: EngineState, slot: SlotIndex, book: Spellbook, baseDamage: number, config: SimulationConfig): TickResult {
   612	  if (state.enemiesHp.length === 0) {
   613	    return { state, goldEarned: 0 }
   614	  }
   615	
   616	  const targetsHit = getTargetsHit(book.element, state.enemiesHp.length, state)
   617	  const damage = getElementDamage(book.element, baseDamage, state.wave, state, config)
   618	  const damaged = state.enemiesHp.map((hp, index) => (index < targetsHit ? hp - damage : hp))
   619	  const frostSlow = getFrostSlow(state)
   620	  const frostSlowMs = frostSlow.durationMs + getEquippedRelicEffects(state.relics).frostSlowBonusMs
   621	  const slowedState = book.element === "frost" ? { ...state, frostSlowMs: Math.max(state.frostSlowMs, frostSlowMs) } : state
   622	  return finalizeDamage(slowedState, damaged, config)
   623	}
   624	
   625	function finalizeDamage(state: EngineState, damaged: readonly number[], config: SimulationConfig): TickResult {
   626	  const survivors = damaged.filter((hp) => hp > 0)
   627	  const killed = damaged.length - survivors.length
   628	  const boss = state.wave === config.BOSS_WAVE
   629	  const reward = getKillReward(state, boss, config)
   630	  const gold = reward * killed
   631	  const xpPerKill = getXpPerKill(state, boss, config)
   632	  const withXp = addWizardXp({ ...state, gold: state.gold + gold }, xpPerKill * killed, config)
   633	  const stateWithEnemies = { ...withXp, enemiesHp: survivors, stageHp: sumHp(survivors) }
   634	  const cleared = survivors.length === 0 ? advanceWave(stateWithEnemies, config) : stateWithEnemies
   635	
   636	  return { state: cleared, goldEarned: gold }
   637	}
   638	
   639	function advanceWave(state: EngineState, config: SimulationConfig): EngineState {
   640	  if (state.wave === config.BOSS_WAVE) {
   641	    const nextStage = state.stage + 1
   642	    const enemiesHp = createWaveEnemies(nextStage, 1, config)
   643	    return { ...state, stage: nextStage, highestStage: Math.max(state.highestStage, nextStage), wave: 1, enemiesHp, stageHp: sumHp(enemiesHp), bossElapsedMs: 0 }
   644	  }
   645	
   646	  const nextWave = state.wave + 1
   647	  const enemiesHp = createWaveEnemies(state.stage, nextWave, config)
   648	  return { ...state, wave: nextWave, enemiesHp, stageHp: sumHp(enemiesHp), bossElapsedMs: 0 }
   649	}
   650	
   651	function addWizardXp(state: EngineState, xp: number, config: SimulationConfig): EngineState {
   652	  let wizardLevel = state.wizardLevel
   653	  let wizardXp = state.wizardXp + xp
   654	  let skillPoints = state.skillPoints
   655	
   656	  while (wizardXp >= config.WIZARD_XP_PER_LEVEL * wizardLevel) {
   657	    wizardXp -= config.WIZARD_XP_PER_LEVEL * wizardLevel
   658	    wizardLevel += 1
   659	    skillPoints += 1
   660	  }
   661	
   662	  return addPetXp({ ...state, wizardLevel, wizardXp, skillPoints }, xp * 0.5)
   663	}
   664	
   665	function createInitialSimulationState(seed: number, config: SimulationConfig): EngineState {
   666	  const enemiesHp = createWaveEnemies(config.INITIAL_STAGE, config.INITIAL_WAVE, config)
   667	
   668	  return {
   669	    gold: config.INITIAL_GOLD,
   670	    books: [],
   671	    equipped: emptyEquipment(),
   672	    highestLevelEver: config.INITIAL_HIGHEST_LEVEL,
   673	    highestStage: config.INITIAL_STAGE,
   674	    stage: config.INITIAL_STAGE,
   675	    wave: config.INITIAL_WAVE,
   676	    stageHp: sumHp(enemiesHp),
   677	    wizardLevel: 1,
   678	    wizardXp: 0,
   679	    skillPoints: 0,
   680	    skills: { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 },

exec
/bin/zsh -lc 'rg -n "SAVE_VERSION|migrat|version|levelUp|wizardLevel|wizardXp|WIZARD_" src docs/specs/2026-07-04-redesign-tracks.md' in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
docs/specs/2026-07-04-redesign-tracks.md:26:- `SAVE_VERSION` 4 마이그레이션: 기존 세이브 manaStone → 크리스탈 환산 편입, 서버 zod 스키마는 관대 원칙 유지.
src/engine/unlocks.ts:19:    wizard: state.wizardLevel >= 3,
src/engine/battle.test.ts:150:    const crit = { ...base, wizardLevel: 20 } satisfies EngineState
src/engine/battle.test.ts:151:    const fast = { ...base, wizardLevel: 10 } satisfies EngineState
src/engine/battle.test.ts:152:    const gold = { ...base, wizardLevel: 30, stage: 20, enemiesHp: [1], stageHp: 1 } satisfies EngineState
src/engine/traits.ts:62:  if (state.wizardLevel < definition.requiredLevel) {
src/engine/traits.ts:72:  if (state.wizardLevel < definition.requiredLevel) {
src/engine/actions.test.ts:331:      wizardLevel: 4,
src/engine/actions.test.ts:350:    expect(next.wizardLevel).toBe(4)
src/engine/progression.test.ts:91:    const picked = selectTrait({ ...createInitialState(9), wizardLevel: 8 }, "lv8", "elementalCycle")
src/engine/constants.ts:47:export const WIZARD_XP_PER_LEVEL = 20
src/engine/constants.ts:50:export const WIZARD_CAST_MILESTONE_LEVEL = 10
src/engine/constants.ts:51:export const WIZARD_CAST_INTERVAL_MULTIPLIER = 0.95
src/engine/constants.ts:52:export const WIZARD_CRIT_MILESTONE_LEVEL = 20
src/engine/constants.ts:53:export const WIZARD_CRIT_CHANCE_BONUS = 0.03
src/engine/constants.ts:54:export const WIZARD_GOLD_MILESTONE_LEVEL = 30
src/engine/constants.ts:55:export const WIZARD_GOLD_MULTIPLIER = 1.1
src/engine/camp.ts:14:  WIZARD_XP_PER_LEVEL,
src/engine/camp.ts:350:  const critChance = Math.min(1, BASE_CRIT_CHANCE + CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel))
src/engine/camp.ts:373:  const relicInterval = baseInterval * getEquippedRelicEffects(state.relics).castIntervalMultiplier * getWizardCastIntervalMultiplier(state.wizardLevel)
src/engine/camp.ts:382:  return WIZARD_XP_PER_LEVEL * level
src/engine/simulate.ts:77:  "WIZARD_XP_PER_LEVEL",
src/engine/simulate.ts:78:  "WIZARD_CAST_MILESTONE_LEVEL",
src/engine/simulate.ts:79:  "WIZARD_CAST_INTERVAL_MULTIPLIER",
src/engine/simulate.ts:80:  "WIZARD_CRIT_MILESTONE_LEVEL",
src/engine/simulate.ts:81:  "WIZARD_CRIT_CHANCE_BONUS",
src/engine/simulate.ts:82:  "WIZARD_GOLD_MILESTONE_LEVEL",
src/engine/simulate.ts:83:  "WIZARD_GOLD_MULTIPLIER",
src/engine/simulate.ts:299:  WIZARD_XP_PER_LEVEL: C.WIZARD_XP_PER_LEVEL,
src/engine/simulate.ts:300:  WIZARD_CAST_MILESTONE_LEVEL: C.WIZARD_CAST_MILESTONE_LEVEL,
src/engine/simulate.ts:301:  WIZARD_CAST_INTERVAL_MULTIPLIER: C.WIZARD_CAST_INTERVAL_MULTIPLIER,
src/engine/simulate.ts:302:  WIZARD_CRIT_MILESTONE_LEVEL: C.WIZARD_CRIT_MILESTONE_LEVEL,
src/engine/simulate.ts:303:  WIZARD_CRIT_CHANCE_BONUS: C.WIZARD_CRIT_CHANCE_BONUS,
src/engine/simulate.ts:304:  WIZARD_GOLD_MILESTONE_LEVEL: C.WIZARD_GOLD_MILESTONE_LEVEL,
src/engine/simulate.ts:305:  WIZARD_GOLD_MULTIPLIER: C.WIZARD_GOLD_MULTIPLIER,
src/engine/simulate.ts:447:  if (state.wizardLevel < requiredLevel || state.traits.picks[slot] !== undefined) {
src/engine/simulate.ts:652:  let wizardLevel = state.wizardLevel
src/engine/simulate.ts:653:  let wizardXp = state.wizardXp + xp
src/engine/simulate.ts:656:  while (wizardXp >= config.WIZARD_XP_PER_LEVEL * wizardLevel) {
src/engine/simulate.ts:657:    wizardXp -= config.WIZARD_XP_PER_LEVEL * wizardLevel
src/engine/simulate.ts:658:    wizardLevel += 1
src/engine/simulate.ts:662:  return addPetXp({ ...state, wizardLevel, wizardXp, skillPoints }, xp * 0.5)
src/engine/simulate.ts:677:    wizardLevel: 1,
src/engine/simulate.ts:678:    wizardXp: 0,
src/engine/simulate.ts:818:  const critChance = Math.min(1, config.BASE_CRIT_CHANCE + config.CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel, config))
src/engine/simulate.ts:881:  const relicInterval = baseInterval * getEquippedRelicEffects(state.relics).castIntervalMultiplier * getWizardCastIntervalMultiplier(state.wizardLevel, config)
src/engine/simulate.ts:891:      getWizardGoldMultiplier(state.wizardLevel, config) *
src/engine/simulate.ts:945:  const critChance = Math.min(1, config.BASE_CRIT_CHANCE + config.CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel, config))
src/engine/simulate.ts:969:function getWizardCastIntervalMultiplier(wizardLevel: number, config: SimulationConfig): number {
src/engine/simulate.ts:970:  return wizardLevel >= config.WIZARD_CAST_MILESTONE_LEVEL ? config.WIZARD_CAST_INTERVAL_MULTIPLIER : 1
src/engine/simulate.ts:973:function getWizardCritChanceBonus(wizardLevel: number, config: SimulationConfig): number {
src/engine/simulate.ts:974:  return wizardLevel >= config.WIZARD_CRIT_MILESTONE_LEVEL ? config.WIZARD_CRIT_CHANCE_BONUS : 0
src/engine/simulate.ts:977:function getWizardGoldMultiplier(wizardLevel: number, config: SimulationConfig): number {
src/engine/simulate.ts:978:  return wizardLevel >= config.WIZARD_GOLD_MILESTONE_LEVEL ? config.WIZARD_GOLD_MULTIPLIER : 1
src/engine/actions.ts:270:    wizardLevel: state.wizardLevel,
src/engine/actions.ts:271:    wizardXp: state.wizardXp,
src/engine/balance.ts:16:  WIZARD_CAST_INTERVAL_MULTIPLIER,
src/engine/balance.ts:17:  WIZARD_CAST_MILESTONE_LEVEL,
src/engine/balance.ts:18:  WIZARD_CRIT_CHANCE_BONUS,
src/engine/balance.ts:19:  WIZARD_CRIT_MILESTONE_LEVEL,
src/engine/balance.ts:20:  WIZARD_GOLD_MILESTONE_LEVEL,
src/engine/balance.ts:21:  WIZARD_GOLD_MULTIPLIER,
src/engine/balance.ts:33:export function getWizardCastIntervalMultiplier(wizardLevel: number): number {
src/engine/balance.ts:34:  return wizardLevel >= WIZARD_CAST_MILESTONE_LEVEL ? WIZARD_CAST_INTERVAL_MULTIPLIER : 1
src/engine/balance.ts:37:export function getWizardCritChanceBonus(wizardLevel: number): number {
src/engine/balance.ts:38:  return wizardLevel >= WIZARD_CRIT_MILESTONE_LEVEL ? WIZARD_CRIT_CHANCE_BONUS : 0
src/engine/balance.ts:41:export function getWizardGoldMultiplier(wizardLevel: number): number {
src/engine/balance.ts:42:  return wizardLevel >= WIZARD_GOLD_MILESTONE_LEVEL ? WIZARD_GOLD_MULTIPLIER : 1
src/engine/battleRewards.ts:10:  WIZARD_XP_PER_LEVEL,
src/engine/battleRewards.ts:152:  let wizardLevel = state.wizardLevel
src/engine/battleRewards.ts:153:  let wizardXp = state.wizardXp + xp
src/engine/battleRewards.ts:157:  while (wizardXp >= getWizardXpThreshold(wizardLevel)) {
src/engine/battleRewards.ts:158:    wizardXp -= getWizardXpThreshold(wizardLevel)
src/engine/battleRewards.ts:159:    wizardLevel += 1
src/engine/battleRewards.ts:161:    events = [...events, { type: "levelUp", wizardLevel, skillPoints }]
src/engine/battleRewards.ts:165:    state: addPetXp({ ...state, wizardLevel, wizardXp, skillPoints }, xp * 0.5),
src/engine/battleRewards.ts:177:      getWizardGoldMultiplier(state.wizardLevel) *
src/engine/battleRewards.ts:186:function getWizardXpThreshold(wizardLevel: number): number {
src/engine/battleRewards.ts:187:  return WIZARD_XP_PER_LEVEL * wizardLevel
src/game/TextureKeys.ts:27:const WIZARD_FRAME_SIZE = { width: 231, height: 190 } as const
src/game/TextureKeys.ts:28:const WIZARD_FRAMES = {
src/game/TextureKeys.ts:140:    frameWidth: WIZARD_FRAME_SIZE.width,
src/game/TextureKeys.ts:141:    frameHeight: WIZARD_FRAME_SIZE.height,
src/game/TextureKeys.ts:144:    frameWidth: WIZARD_FRAME_SIZE.width,
src/game/TextureKeys.ts:145:    frameHeight: WIZARD_FRAME_SIZE.height,
src/game/TextureKeys.ts:148:    frameWidth: WIZARD_FRAME_SIZE.width,
src/game/TextureKeys.ts:149:    frameHeight: WIZARD_FRAME_SIZE.height,
src/game/TextureKeys.ts:152:    frameWidth: WIZARD_FRAME_SIZE.width,
src/game/TextureKeys.ts:153:    frameHeight: WIZARD_FRAME_SIZE.height,
src/game/TextureKeys.ts:204:  createAnimation(scene, AnimationKeys.wizard.idle, scene.anims.generateFrameNumbers(TextureKeys.wizard.idle, { start: 0, end: WIZARD_FRAMES.idle - 1 }), 8, -1)
src/game/TextureKeys.ts:205:  createAnimation(scene, AnimationKeys.wizard.cast, scene.anims.generateFrameNumbers(TextureKeys.wizard.cast, { start: 0, end: WIZARD_FRAMES.cast - 1 }), 18, 0)
src/game/TextureKeys.ts:206:  createAnimation(scene, AnimationKeys.wizard.hit, scene.anims.generateFrameNumbers(TextureKeys.wizard.hit, { start: 0, end: WIZARD_FRAMES.hit - 1 }), 14, 0)
src/game/TextureKeys.ts:207:  createAnimation(scene, AnimationKeys.wizard.death, scene.anims.generateFrameNumbers(TextureKeys.wizard.death, { start: 0, end: WIZARD_FRAMES.death - 1 }), 12, 0)
src/engine/state.ts:34:    wizardLevel: 1,
src/engine/state.ts:35:    wizardXp: 0,
src/engine/battle.ts:45:  const critChance = Math.min(1, BASE_CRIT_CHANCE + CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel))
src/engine/battle.ts:273:  const relicInterval = baseInterval * getEquippedRelicEffects(state.relics).castIntervalMultiplier * riftMultiplier * getWizardCastIntervalMultiplier(state.wizardLevel)
src/engine/unlocks.test.ts:21:    const below = { ...createInitialState(1), wizardLevel: 2, highestStage: 4 } satisfies EngineState
src/engine/unlocks.test.ts:25:    const wizard = { ...below, wizardLevel: 3 } satisfies EngineState
src/engine/types.ts:121:  readonly wizardLevel: number
src/engine/types.ts:122:  readonly wizardXp: number
src/engine/types.ts:174:  | { readonly type: "levelUp"; readonly wizardLevel: number; readonly skillPoints: number }
src/game/scenes/BattleJuiceEffects.ts:19:  private readonly levelUpText: PixelTextLine
src/game/scenes/BattleJuiceEffects.ts:28:    this.levelUpText = new PixelTextLine(scene, 8, 58)
src/game/scenes/BattleJuiceEffects.ts:42:    this.scene.tweens.killTweensOf(this.levelUpText.container)
src/game/scenes/BattleJuiceEffects.ts:43:    this.levelUpText.hide()
src/game/scenes/BattleJuiceEffects.ts:77:  levelUp(point: Point): void {
src/game/scenes/BattleJuiceEffects.ts:79:    this.scene.tweens.killTweensOf(this.levelUpText.container)
src/game/scenes/BattleJuiceEffects.ts:80:    this.levelUpText.setText(this.t("battleLevelUp"), { tint: 0xe6b450, scale: 3 })
src/game/scenes/BattleJuiceEffects.ts:81:    this.levelUpText.show(point.x + 18, point.y - 86)
src/game/scenes/BattleJuiceEffects.ts:82:    this.levelUpText.container.setAlpha(1).setScale(0.8)
src/game/scenes/BattleJuiceEffects.ts:84:      targets: this.levelUpText.container,
src/game/scenes/BattleJuiceEffects.ts:90:      onComplete: () => this.levelUpText.hide(),
src/game/scenes/BattleEffects.ts:178:  levelUp(point: Point): void {
src/game/scenes/BattleEffects.ts:179:    this.juice.levelUp(point)
src/ui/WizardPanel.tsx:130:  const unlocked = props.state.wizardLevel >= requiredLevel
src/ui/useBadges.test.ts:20:      wizardLevel: 3,
src/ui/WizardPanel.test.tsx:57:    const unlocked = renderWizardPanel({ ...createInitialState(1), wizardLevel: 8 })
src/ui/engineStorage.ts:16:export const SAVE_VERSION = 4
src/ui/engineStorage.ts:19:  readonly version: number
src/ui/engineStorage.ts:68:      // A save exists but is legacy / below SAVE_VERSION: reset everything so
src/ui/engineStorage.ts:82: * Returns the EngineState from a persisted wrapper. v2/v3 are migrated in
src/ui/engineStorage.ts:83: * place; older versions return null so the caller resets.
src/ui/engineStorage.ts:87:    if (value.version >= SAVE_VERSION) {
src/ui/engineStorage.ts:92:    if (value.version === 3) {
src/ui/engineStorage.ts:94:        return migrateV3State(value.state)
src/ui/engineStorage.ts:97:        return migrateV3PreManaStoneState(value.state)
src/ui/engineStorage.ts:100:    if (value.version === 2 && isV2EngineState(value.state)) {
src/ui/engineStorage.ts:101:      return migrateV2State(value.state)
src/ui/engineStorage.ts:108:  return isRecord(value) && typeof value["version"] === "number" && "state" in value
src/ui/engineStorage.ts:112:  const payload: VersionedSave = { version: SAVE_VERSION, state }
src/ui/engineStorage.ts:233:function migrateV2State(state: EngineV2State): EngineState {
src/ui/engineStorage.ts:243:function migrateV3State(state: EngineV3State): EngineState {
src/ui/engineStorage.ts:252:function migrateV3PreManaStoneState(state: EngineV3PreManaStoneState): EngineState {
src/ui/engineStorage.ts:271:    "wizardLevel",
src/ui/engineStorage.ts:272:    "wizardXp",
src/game/scenes/BattleScene.ts:142:      case "levelUp":
src/game/scenes/BattleScene.ts:143:        this.effects?.levelUp({ x: BattleLayout.wizardX, y: BattleLayout.wizardY })
src/ui/tabs.test.ts:19:      wizardLevel: 3,
src/ui/HudOverlay.tsx:2:import { BOSS_WAVE, WIZARD_XP_PER_LEVEL } from "../engine/constants"
src/ui/HudOverlay.tsx:22:  const xpRequired = WIZARD_XP_PER_LEVEL * props.state.wizardLevel
src/ui/HudOverlay.tsx:23:  const xpProgress = Math.min(100, (props.state.wizardXp / xpRequired) * 100)
src/ui/HudOverlay.tsx:92:        <span>{t.wizardLevel(props.state.wizardLevel)}</span>
src/ui/i18n.ts:307:  readonly wizardLevel: (level: number) => string
src/ui/i18n.ts:357:    wizardLevel: (level) => `WIZARD ${level}`,
src/ui/i18n.ts:402:    wizardLevel: (level) => `마법사 ${level}`,
src/ui/engineStorage.test.ts:3:import { loadInitialState, saveLocalState, SAVE_VERSION } from "./engineStorage"
src/ui/engineStorage.test.ts:29:describe("engineStorage save versioning", () => {
src/ui/engineStorage.test.ts:41:  it("wraps saves as {version, state} at the current SAVE_VERSION", () => {
src/ui/engineStorage.test.ts:48:    expect(parsed.version).toBe(SAVE_VERSION)
src/ui/engineStorage.test.ts:49:    expect(parsed.version).toBe(4)
src/ui/engineStorage.test.ts:53:  it("loads a current-version save unchanged", () => {
src/ui/engineStorage.test.ts:63:    // Pre-v2 saves stored a bare EngineState (no version wrapper).
src/ui/engineStorage.test.ts:79:  it("resets a save whose version is below SAVE_VERSION", () => {
src/ui/engineStorage.test.ts:80:    const belowVersion = { version: 1, state: { ...createInitialState(4), stage: 8 } }
src/ui/engineStorage.test.ts:90:  it("migrates a v2 save to v4 while preserving existing progress", () => {
src/ui/engineStorage.test.ts:98:    storage.setItem(SAVE_STATE_KEY, JSON.stringify({ version: 2, state: v2State }))
src/ui/engineStorage.test.ts:120:  it("migrates a v3 save by folding mana stones into crystals and deriving highest stage", () => {
src/ui/engineStorage.test.ts:129:    storage.setItem(SAVE_STATE_KEY, JSON.stringify({ version: 3, state: v3State }))
src/ui/engineStorage.test.ts:140:  it("round-trips a saved-then-loaded run at the current version", () => {

hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '1,260p' src/engine/state.ts | nl -ba" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import {
     2	  BOSS_WAVE,
     3	  HP_BASE,
     4	  HP_GROWTH,
     5	  INITIAL_GOLD,
     6	  INITIAL_HIGHEST_LEVEL,
     7	  INITIAL_STAGE,
     8	  INITIAL_WAVE,
     9	  REGULAR_MOB_BASE_COUNT,
    10	} from "./constants.js"
    11	import { getBossHp, getRegularMobCount } from "./balance.js"
    12	import { DEFAULT_SKIN_STATE } from "./camp.js"
    13	import { createRandomState } from "./rng.js"
    14	import { assertNever, type EngineState, type EquippedBooks, type SkillAllocations, type SlotIndex, type SlotTiers, type SlotTimers } from "./types.js"
    15	
    16	export type { EngineState } from "./types.js"
    17	export type EngineV3ProgressionState = Pick<
    18	  EngineState,
    19	  "quests" | "achievements" | "codex" | "traits" | "relics" | "riftRuns" | "activeRift" | "pet" | "mine" | "dailyMissions" | "skins"
    20	>
    21	
    22	export function createInitialState(seed: number): EngineState {
    23	  const enemiesHp = createWaveEnemies(INITIAL_STAGE, INITIAL_WAVE)
    24	
    25	  return {
    26	    gold: INITIAL_GOLD,
    27	    books: [],
    28	    equipped: emptyEquipment(),
    29	    highestLevelEver: INITIAL_HIGHEST_LEVEL,
    30	    highestStage: INITIAL_STAGE,
    31	    stage: INITIAL_STAGE,
    32	    wave: INITIAL_WAVE,
    33	    stageHp: sumHp(enemiesHp),
    34	    wizardLevel: 1,
    35	    wizardXp: 0,
    36	    skillPoints: 0,
    37	    skills: zeroSkills(),
    38	    manaCrystals: 0,
    39	    prestigeCount: 0,
    40	    lastSeenServerTs: null,
    41	    slotTiers: zeroSlots(),
    42	    castProgressMs: zeroSlots(),
    43	    enemiesHp,
    44	    bossElapsedMs: 0,
    45	    frostSlowMs: 0,
    46	    recentGoldPerSecond: 0,
    47	    elapsedMs: 0,
    48	    rngSeed: seed,
    49	    rngState: createRandomState(seed),
    50	    nextBookId: 1,
    51	    ...createInitialV3ProgressionState(),
    52	  }
    53	}
    54	
    55	export function createInitialV3ProgressionState(): EngineV3ProgressionState {
    56	  return {
    57	    quests: { completed: [], claimed: [] },
    58	    achievements: { counters: {}, claimed: [] },
    59	    codex: { tiers: {} },
    60	    traits: { picks: {} },
    61	    relics: { owned: {}, equipped: [null, null, null] },
    62	    riftRuns: { date: "", golden: 0, trial: 0 },
    63	    activeRift: null,
    64	    pet: { level: 1, xp: 0, evolution: 0 },
    65	    mine: { floor: 1, lastClaimAt: null },
    66	    dailyMissions: { date: "", progress: {}, claimed: [] },
    67	    skins: DEFAULT_SKIN_STATE,
    68	  }
    69	}
    70	
    71	export function zeroSkills(): SkillAllocations {
    72	  return { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 }
    73	}
    74	
    75	export function emptyEquipment(): EquippedBooks {
    76	  return [null, null, null, null, null, null]
    77	}
    78	
    79	export function zeroSlots(): SlotTiers {
    80	  return [0, 0, 0, 0, 0, 0]
    81	}
    82	
    83	export function zeroTimers(): SlotTimers {
    84	  return [0, 0, 0, 0, 0, 0]
    85	}
    86	
    87	export function createWaveEnemies(stage: number, wave: number): readonly number[] {
    88	  const hp = getMobHp(stage)
    89	
    90	  if (wave === BOSS_WAVE) {
    91	    return [getBossHp(stage)]
    92	  }
    93	
    94	  const mobCount = getRegularMobCount(stage)
    95	  const perMobHp = (hp * REGULAR_MOB_BASE_COUNT) / mobCount
    96	  return Array.from({ length: mobCount }, () => perMobHp)
    97	}
    98	
    99	export function getMobHp(stage: number): number {
   100	  return HP_BASE * HP_GROWTH ** stage
   101	}
   102	
   103	export function sumHp(values: readonly number[]): number {
   104	  return values.reduce((total, value) => total + Math.max(0, value), 0)
   105	}
   106	
   107	export function setEquippedSlot(equipped: EquippedBooks, slot: SlotIndex, value: EquippedBooks[SlotIndex]): EquippedBooks {
   108	  switch (slot) {
   109	    case 0:
   110	      return [value, equipped[1], equipped[2], equipped[3], equipped[4], equipped[5]]
   111	    case 1:
   112	      return [equipped[0], value, equipped[2], equipped[3], equipped[4], equipped[5]]
   113	    case 2:
   114	      return [equipped[0], equipped[1], value, equipped[3], equipped[4], equipped[5]]
   115	    case 3:
   116	      return [equipped[0], equipped[1], equipped[2], value, equipped[4], equipped[5]]
   117	    case 4:
   118	      return [equipped[0], equipped[1], equipped[2], equipped[3], value, equipped[5]]
   119	    case 5:
   120	      return [equipped[0], equipped[1], equipped[2], equipped[3], equipped[4], value]
   121	    default:
   122	      return assertNever(slot)
   123	  }
   124	}
   125	
   126	export function setSlotTier(slotTiers: SlotTiers, slot: SlotIndex, value: number): SlotTiers {
   127	  switch (slot) {
   128	    case 0:
   129	      return [value, slotTiers[1], slotTiers[2], slotTiers[3], slotTiers[4], slotTiers[5]]
   130	    case 1:
   131	      return [slotTiers[0], value, slotTiers[2], slotTiers[3], slotTiers[4], slotTiers[5]]
   132	    case 2:
   133	      return [slotTiers[0], slotTiers[1], value, slotTiers[3], slotTiers[4], slotTiers[5]]
   134	    case 3:
   135	      return [slotTiers[0], slotTiers[1], slotTiers[2], value, slotTiers[4], slotTiers[5]]
   136	    case 4:
   137	      return [slotTiers[0], slotTiers[1], slotTiers[2], slotTiers[3], value, slotTiers[5]]
   138	    case 5:
   139	      return [slotTiers[0], slotTiers[1], slotTiers[2], slotTiers[3], slotTiers[4], value]
   140	    default:
   141	      return assertNever(slot)
   142	  }
   143	}
   144	
   145	export function setSlotTimer(castProgressMs: SlotTimers, slot: SlotIndex, value: number): SlotTimers {
   146	  switch (slot) {
   147	    case 0:
   148	      return [value, castProgressMs[1], castProgressMs[2], castProgressMs[3], castProgressMs[4], castProgressMs[5]]
   149	    case 1:
   150	      return [castProgressMs[0], value, castProgressMs[2], castProgressMs[3], castProgressMs[4], castProgressMs[5]]
   151	    case 2:
   152	      return [castProgressMs[0], castProgressMs[1], value, castProgressMs[3], castProgressMs[4], castProgressMs[5]]
   153	    case 3:
   154	      return [castProgressMs[0], castProgressMs[1], castProgressMs[2], value, castProgressMs[4], castProgressMs[5]]
   155	    case 4:
   156	      return [castProgressMs[0], castProgressMs[1], castProgressMs[2], castProgressMs[3], value, castProgressMs[5]]
   157	    case 5:
   158	      return [castProgressMs[0], castProgressMs[1], castProgressMs[2], castProgressMs[3], castProgressMs[4], value]
   159	    default:
   160	      return assertNever(slot)
   161	  }
   162	}

exec
/bin/zsh -lc "sed -n '1,260p' src/engine/battle.ts | nl -ba" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import {
     2	  BASE_CAST_INTERVAL_MS,
     3	  BASE_CRIT_CHANCE,
     4	  BOSS_ENRAGE_MS,
     5	  BOSS_WAVE,
     6	  CAST_SPEED_REDUCTION_MS,
     7	  CRIT_CHANCE_PER_POINT,
     8	  CRIT_DAMAGE_MULTIPLIER,
     9	  DMG_BASE,
    10	  DMG_GROWTH,
    11	  GOLDEN_RIFT_MS,
    12	  MANA_DAMAGE_PER_CRYSTAL,
    13	  MIN_CAST_INTERVAL_MS,
    14	  SLOT_INDEXES,
    15	  TICK_MS,
    16	} from "./constants.js"
    17	import { getBossRequiredDps, getTomeMilestoneDamageMultiplier, getWizardCastIntervalMultiplier, getWizardCritChanceBonus } from "./balance.js"
    18	import { getPetDps, shouldPetAttack } from "./camp.js"
    19	import { getSlotMultiplier } from "./actions.js"
    20	import { finalizeDamage, type DamageApplication } from "./battleRewards.js"
    21	import { getElementDamageMultiplier, getEquippedRelicEffects } from "./relics.js"
    22	import { getCodexBonusMultiplier } from "./codex.js"
    23	import { getFireTargetCap, getFrostSlow, getHolyBossMultiplier } from "./resonance.js"
    24	import { nextRandomState } from "./rng.js"
    25	import { createWaveEnemies, setSlotTimer, sumHp } from "./state.js"
    26	import { applyTraitCastInterval, getTraitCodexBonusPerTier, getTraitElementDamageMultiplier } from "./traits.js"
    27	import { assertNever, type Element, type EngineEvent, type EngineState, type SlotIndex, type Spellbook } from "./types.js"
    28	
    29	const INNATE_STAFF_INTERVAL_MS = 1_200
    30	const INNATE_STAFF_BOOK_ID = "wizard-staff"
    31	
    32	export type DamageRoll = {
    33	  readonly state: EngineState
    34	  readonly damage: number
    35	  readonly critical: boolean
    36	}
    37	
    38	export type TickSimulation = {
    39	  readonly state: EngineState
    40	  readonly events: readonly EngineEvent[]
    41	}
    42	
    43	export function bookDamage(book: Spellbook, slotTier: number, state: EngineState): DamageRoll {
    44	  const roll = nextRandomState(state.rngState)
    45	  const critChance = Math.min(1, BASE_CRIT_CHANCE + CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel))
    46	  const critical = roll.value < critChance
    47	  const relicEffects = getEquippedRelicEffects(state.relics)
    48	  const critFactor = critical ? CRIT_DAMAGE_MULTIPLIER + relicEffects.critDamageBonus : 1
    49	  const damage =
    50	    DMG_BASE *
    51	    DMG_GROWTH ** book.level *
    52	    getSlotMultiplier(slotTier) *
    53	    (1 + MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals) *
    54	    getElementDamageMultiplier(book.element, state.relics) *
    55	    getElementProgressionMultiplier(state, book.element) *
    56	    getTomeMilestoneDamageMultiplier(state.highestLevelEver) *
    57	    critFactor
    58	
    59	  return {
    60	    state: { ...state, rngState: roll.state },
    61	    damage,
    62	    critical,
    63	  }
    64	}
    65	
    66	export function simulateTicks(state: EngineState, nTicks: number): TickSimulation {
    67	  let current = normalizeBattleState(state)
    68	  let events: readonly EngineEvent[] = []
    69	  let goldEarned = 0
    70	
    71	  for (let tick = 0; tick < nTicks; tick += 1) {
    72	    const previousElapsedMs = current.elapsedMs
    73	    current = {
    74	      ...current,
    75	      elapsedMs: previousElapsedMs + TICK_MS,
    76	      frostSlowMs: Math.max(0, current.frostSlowMs - TICK_MS),
    77	      activeRift:
    78	        current.activeRift?.kind === "golden"
    79	          ? { ...current.activeRift, remainingMs: Math.max(0, current.activeRift.remainingMs - TICK_MS) }
    80	          : current.activeRift,
    81	    }
    82	
    83	    if (shouldCastInnateStaff(previousElapsedMs, current.elapsedMs)) {
    84	      const applied = applyInnateStaffDamage(current)
    85	      current = applied.state
    86	      events = [...events, ...applied.events]
    87	      goldEarned += applied.goldEarned
    88	    }
    89	
    90	    if (shouldPetAttack(previousElapsedMs, current.elapsedMs)) {
    91	      const applied = applyPetDamage(current)
    92	      current = applied.state
    93	      events = [...events, ...applied.events]
    94	      goldEarned += applied.goldEarned
    95	    }
    96	
    97	    for (const slot of SLOT_INDEXES) {
    98	      const book = current.equipped[slot]
    99	      if (book === null) {
   100	        current = { ...current, castProgressMs: setSlotTimer(current.castProgressMs, slot, 0) }
   101	        continue
   102	      }
   103	
   104	      const nextProgress = current.castProgressMs[slot] + TICK_MS
   105	      const castInterval = getCastIntervalMs(current)
   106	      if (nextProgress < castInterval) {
   107	        current = { ...current, castProgressMs: setSlotTimer(current.castProgressMs, slot, nextProgress) }
   108	        continue
   109	      }
   110	
   111	      const damageRoll = bookDamage(book, current.slotTiers[slot], current)
   112	      current = { ...damageRoll.state, castProgressMs: setSlotTimer(damageRoll.state.castProgressMs, slot, nextProgress - castInterval) }
   113	      const applied = applyCastDamage(current, slot, book, damageRoll.damage, damageRoll.critical)
   114	      current = applied.state
   115	      events = [...events, ...applied.events]
   116	      goldEarned += applied.goldEarned
   117	    }
   118	
   119	    if (current.wave === BOSS_WAVE && current.enemiesHp.length > 0) {
   120	      const bossElapsedMs = current.bossElapsedMs + TICK_MS
   121	      current = { ...current, bossElapsedMs }
   122	      if (current.activeRift?.kind !== "trial" && bossElapsedMs >= BOSS_ENRAGE_MS) {
   123	        const requiredDps = getBossRequiredDps(current.stage)
   124	        const currentDps = Math.max(0, requiredDps - current.stageHp / (BOSS_ENRAGE_MS / 1_000))
   125	        const enemiesHp = createWaveEnemies(current.stage, 1)
   126	        current = {
   127	          ...current,
   128	          wave: 1,
   129	          enemiesHp,
   130	          stageHp: sumHp(enemiesHp),
   131	          bossElapsedMs: 0,
   132	          frostSlowMs: 0,
   133	        }
   134	        events = [...events, { type: "bossFail", stage: current.stage, requiredDps, currentDps }]
   135	      }
   136	    }
   137	
   138	    if (current.activeRift?.kind === "golden" && current.activeRift.remainingMs <= 0) {
   139	      current = {
   140	        ...current,
   141	        ...current.activeRift.snapshot,
   142	        activeRift: null,
   143	      }
   144	      events = [...events, { type: "riftComplete", kind: "golden", reward: goldEarned }]
   145	    }
   146	  }
   147	
   148	  return {
   149	    state: {
   150	      ...current,
   151	      recentGoldPerSecond: nTicks > 0 ? goldEarned / ((nTicks * TICK_MS) / 1_000) : current.recentGoldPerSecond,
   152	    },
   153	    events,
   154	  }
   155	}
   156	
   157	function shouldCastInnateStaff(previousElapsedMs: number, nextElapsedMs: number): boolean {
   158	  return Math.floor(previousElapsedMs / INNATE_STAFF_INTERVAL_MS) < Math.floor(nextElapsedMs / INNATE_STAFF_INTERVAL_MS)
   159	}
   160	
   161	function applyInnateStaffDamage(state: EngineState): DamageApplication {
   162	  if (state.enemiesHp.length === 0) {
   163	    return { state, events: [], goldEarned: 0 }
   164	  }
   165	
   166	  const damage = DMG_BASE * 0.6 * (1 + MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals)
   167	  const damaged = state.enemiesHp.map((hp, index) => (index === 0 ? hp - damage : hp))
   168	  const castEvent: EngineEvent = {
   169	    type: "cast",
   170	    bookId: INNATE_STAFF_BOOK_ID,
   171	    slotIdx: 0,
   172	    element: "arcane",
   173	    damage,
   174	    critical: false,
   175	    targetIndex: 0,
   176	    targetsHit: 1,
   177	  }
   178	
   179	  return finalizeDamage(state, damaged, [castEvent])
   180	}
   181	
   182	function applyPetDamage(state: EngineState): DamageApplication {
   183	  if (state.enemiesHp.length === 0) {
   184	    return { state, events: [], goldEarned: 0 }
   185	  }
   186	
   187	  const damage = getPetDps(state)
   188	  if (damage <= 0) {
   189	    return { state, events: [], goldEarned: 0 }
   190	  }
   191	
   192	  const damaged = state.enemiesHp.map((hp, index) => (index === 0 ? hp - damage : hp))
   193	  const castEvent: EngineEvent = {
   194	    type: "petCast",
   195	    damage,
   196	    targetIndex: 0,
   197	    evolution: state.pet.evolution,
   198	  }
   199	
   200	  return finalizeDamage(state, damaged, [castEvent])
   201	}
   202	
   203	function applyCastDamage(
   204	  state: EngineState,
   205	  slot: SlotIndex,
   206	  book: Spellbook,
   207	  baseDamage: number,
   208	  critical: boolean,
   209	): DamageApplication {
   210	  if (state.enemiesHp.length === 0) {
   211	    return { state, events: [], goldEarned: 0 }
   212	  }
   213	
   214	  const targetsHit = getTargetsHit(book.element, state.enemiesHp.length, state)
   215	  const damage = getElementDamage(book.element, baseDamage, state.wave, state)
   216	  const damaged = state.enemiesHp.map((hp, index) => (index < targetsHit ? hp - damage : hp))
   217	  const castEvent: EngineEvent = {
   218	    type: "cast",
   219	    bookId: book.id,
   220	    slotIdx: slot,
   221	    element: book.element,
   222	    damage,
   223	    critical,
   224	    targetIndex: 0,
   225	    targetsHit,
   226	  }
   227	  const frostSlow = getFrostSlow(state)
   228	  const frostSlowMs = frostSlow.durationMs + getEquippedRelicEffects(state.relics).frostSlowBonusMs
   229	  const slowEvents: readonly EngineEvent[] =
   230	    book.element === "frost" ? [{ type: "slow", durationMs: frostSlowMs, factor: frostSlow.factor }] : []
   231	  const slowedState = book.element === "frost" ? { ...state, frostSlowMs: Math.max(state.frostSlowMs, frostSlowMs) } : state
   232	  return finalizeDamage(slowedState, damaged, [castEvent, ...slowEvents])
   233	}
   234	
   235	function normalizeBattleState(state: EngineState): EngineState {
   236	  if (state.enemiesHp.length > 0) {
   237	    return { ...state, stageHp: sumHp(state.enemiesHp) }
   238	  }
   239	
   240	  const enemiesHp = createWaveEnemies(state.stage, state.wave)
   241	  return { ...state, enemiesHp, stageHp: sumHp(enemiesHp) }
   242	}
   243	
   244	function getTargetsHit(element: Element, enemyCount: number, state: EngineState): number {
   245	  switch (element) {
   246	    case "fire":
   247	      return Math.min(getFireTargetCap(state), enemyCount)
   248	    case "frost":
   249	      return Math.min(1, enemyCount)
   250	    case "holy":
   251	      return Math.min(1, enemyCount)
   252	    default:
   253	      return assertNever(element)
   254	  }
   255	}
   256	
   257	function getElementDamage(element: Element, damage: number, wave: number, state: EngineState): number {
   258	  switch (element) {
   259	    case "fire":
   260	      return damage

exec
/bin/zsh -lc "sed -n '1,220p' src/engine/constants.ts | nl -ba" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	export const SUMMON_FLOOR_GAP = 8
     2	export const SUMMON_COST_BASE = 20
     3	export const SUMMON_COST_GROWTH = 1.34
     4	export const DMG_BASE = 5
     5	export const DMG_GROWTH = 1.35
     6	export const HP_BASE = 10
     7	export const HP_GROWTH = 1.43
     8	export const INITIAL_GOLD = 100
     9	export const INITIAL_STAGE = 1
    10	export const INITIAL_WAVE = 1
    11	export const INITIAL_HIGHEST_LEVEL = 1
    12	export const INVENTORY_LIMIT = 15
    13	export const EQUIPMENT_SLOT_COUNT = 6
    14	export const SLOT_INDEXES = [0, 1, 2, 3, 4, 5] as const
    15	export const SLOT_UPGRADE_COST_BASE = 50
    16	export const SLOT_UPGRADE_COST_GROWTH = 1.6
    17	export const SLOT_MULTIPLIER_PER_TIER = 0.15
    18	export const TICK_MS = 100
    19	export const BASE_CAST_INTERVAL_MS = 1_000
    20	export const CAST_SPEED_REDUCTION_MS = 40
    21	export const MIN_CAST_INTERVAL_MS = 300
    22	// Wave C: regular waves use 6-9 visible mobs, while balance helpers keep
    23	// regular-wave HP/reward totals anchored to the original five-mob budget.
    24	export const REGULAR_MOB_BASE_COUNT = 5
    25	export const REGULAR_MOB_MIN_COUNT = 6
    26	export const REGULAR_MOB_MAX_COUNT = 9
    27	export const REGULAR_MOB_STAGE_BAND = 20
    28	export const BOSS_WAVE = 10
    29	// Wave C boss HP is expected-DPS based: expectedDps(stage) * 30s * factor.
    30	export const BOSS_EXPECTED_DPS_BASE = 9
    31	export const BOSS_EXPECTED_DPS_GROWTH = 1.49
    32	export const BOSS_REGULAR_FACTOR = 1
    33	export const BOSS_WALL_FACTOR = 1.5
    34	export const BOSS_GATE_FACTOR = 2.2
    35	export const BOSS_ENRAGE_MS = 30_000
    36	export const FIRE_TARGET_CAP = 3
    37	export const FROST_SLOW_MS = 2_000
    38	export const FROST_SLOW_FACTOR = 0.2
    39	export const BASE_CRIT_CHANCE = 0.05
    40	export const CRIT_CHANCE_PER_POINT = 0.01
    41	export const CRIT_DAMAGE_MULTIPLIER = 2
    42	export const MANA_DAMAGE_PER_CRYSTAL = 0.08
    43	export const GOLD_REWARD_BASE = 2
    44	export const GOLD_REWARD_GROWTH = 1.3
    45	export const GOLD_GAIN_PER_POINT = 0.1
    46	export const BOSS_REWARD_MULTIPLIER = 15
    47	export const WIZARD_XP_PER_LEVEL = 20
    48	// Wave C permanent wizard milestones: Lv10 cast -5%, Lv20 crit +3%p,
    49	// Lv30 gold +10%. They are derived from retained wizard level.
    50	export const WIZARD_CAST_MILESTONE_LEVEL = 10
    51	export const WIZARD_CAST_INTERVAL_MULTIPLIER = 0.95
    52	export const WIZARD_CRIT_MILESTONE_LEVEL = 20
    53	export const WIZARD_CRIT_CHANCE_BONUS = 0.03
    54	export const WIZARD_GOLD_MILESTONE_LEVEL = 30
    55	export const WIZARD_GOLD_MULTIPLIER = 1.1
    56	// Wave C tome tier milestones are current-run firepower jumps.
    57	export const TOME_DAMAGE_MILESTONES = [10, 20, 30, 40] as const
    58	export const TOME_DAMAGE_MILESTONE_MULTIPLIER = 2
    59	// First useful rebirth should appear around st14-16: floor((stage-8)^1.7/6).
    60	export const PRESTIGE_STAGE_OFFSET = 8
    61	export const PRESTIGE_CRYSTAL_EXPONENT = 1.7
    62	export const PRESTIGE_CRYSTAL_DIVISOR = 6
    63	export const OFFLINE_CAP_MS = 8 * 60 * 60 * 1_000
    64	export const OFFLINE_EFFICIENCY = 0.6
    65	export const XP_PER_KILL = 1
    66	export const XP_PER_BOSS_KILL = 15
    67	export const RELIC_SUMMON_COST = 10
    68	export const RELIC_LEVEL_CAP = 10
    69	export const RELIC_SLOT_COUNT = 3
    70	export const GOLDEN_RIFT_MS = 180_000
    71	export const RIFT_DAILY_LIMIT = 2
    72	export const GOLDEN_RIFT_REWARD_MULTIPLIER = 2.5
    73	export const TRIAL_RIFT_BOSS_MULTIPLIERS = [0.8, 1, 1.3, 1.7, 2.2] as const

2026-07-04T07:02:19.659442Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:02:19.664152Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
codex
현 구조는 레벨업이 `battleRewards`/시뮬 내부 XP 누적으로 발생하고, 환생은 마법사 레벨·스킬·특성·스킨을 유지하는 흐름입니다. R5는 이 유지 흐름에 전직 상태를 얹되, 기존 공명 수치가 즉시 전역 버프로 튀지 않도록 “선택 유파 + 장착 조건”으로 보존하는 방향이 맞습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '1,140p' src/engine/camp.ts | nl -ba" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import {
     2	  BASE_CAST_INTERVAL_MS,
     3	  BASE_CRIT_CHANCE,
     4	  BOSS_WAVE,
     5	  CAST_SPEED_REDUCTION_MS,
     6	  CRIT_CHANCE_PER_POINT,
     7	  CRIT_DAMAGE_MULTIPLIER,
     8	  DMG_BASE,
     9	  DMG_GROWTH,
    10	  MANA_DAMAGE_PER_CRYSTAL,
    11	  MIN_CAST_INTERVAL_MS,
    12	  SLOT_INDEXES,
    13	  SLOT_MULTIPLIER_PER_TIER,
    14	  WIZARD_XP_PER_LEVEL,
    15	} from "./constants.js"
    16	import {
    17	  getTomeMilestoneDamageMultiplier,
    18	  getWizardCastIntervalMultiplier,
    19	  getWizardCritChanceBonus,
    20	} from "./balance.js"
    21	import { getCodexBonusMultiplier } from "./codex.js"
    22	import { getElementDamageMultiplier, getEquippedRelicEffects } from "./relics.js"
    23	import { getHolyBossMultiplier } from "./resonance.js"
    24	import { applyTraitCastInterval, getTraitCodexBonusPerTier, getTraitElementDamageMultiplier } from "./traits.js"
    25	import type { Element, EngineState, PetState, SkinState } from "./types.js"
    26	
    27	export type DailyMissionId = "merge20" | "boss3" | "summon30" | "mineClaim1" | "stage3"
    28	export type SkinId = "apprentice" | "ember" | "frost" | "gilded"
    29	
    30	export type DailyMissionDefinition = {
    31	  readonly id: DailyMissionId
    32	  readonly goal: number
    33	  readonly rewardManaCrystals: number
    34	}
    35	
    36	export type DailyMissionStatus = DailyMissionDefinition & {
    37	  readonly progress: number
    38	  readonly claimed: boolean
    39	  readonly claimable: boolean
    40	}
    41	
    42	export type SkinDefinition = {
    43	  readonly id: SkinId
    44	  readonly tint: number
    45	}
    46	
    47	export type MineClaimPreview = {
    48	  readonly floor: number
    49	  readonly elapsedMs: number
    50	  readonly manaCrystals: number
    51	  readonly ratePerHour: number
    52	  readonly claimable: boolean
    53	}
    54	
    55	const PET_EVOLUTION_ONE_LEVEL = 10
    56	const PET_EVOLUTION_TWO_LEVEL = 25
    57	const PET_ATTACK_INTERVAL_MS = 1_000
    58	const PET_BASE_DPS_SHARE = 0.05
    59	const PET_LEVEL_DPS_SHARE = 0.01
    60	const PET_EVOLUTION_DPS_SHARE = 0.05
    61	const MINE_CAP_MS = 12 * 60 * 60 * 1_000
    62	const MINE_FLOOR_ONE_RATE = 0.15
    63	const MINE_FLOOR_RATES_PER_HOUR: readonly [number, number, number, number] = [MINE_FLOOR_ONE_RATE, 0.4, 0.95, 2]
    64	// R4: the familiar mines. Its level/evolution raise the crystal rate (it still
    65	// contributes battle DPS via getPetDps). Kept gentle so mining stays well under
    66	// a rebirth's yield (R1 balance rule: <=5% of first-rebirth crystals per hour).
    67	const MINE_PET_LEVEL_BONUS = 0.015
    68	const MINE_PET_EVOLUTION_BONUS = 0.1
    69	
    70	const DAILY_MISSION_MERGE20: DailyMissionDefinition = { id: "merge20", goal: 20, rewardManaCrystals: 1 }
    71	const DAILY_MISSION_BOSS3: DailyMissionDefinition = { id: "boss3", goal: 3, rewardManaCrystals: 1 }
    72	const DAILY_MISSION_SUMMON30: DailyMissionDefinition = { id: "summon30", goal: 30, rewardManaCrystals: 1 }
    73	const DAILY_MISSION_MINE_CLAIM1: DailyMissionDefinition = { id: "mineClaim1", goal: 1, rewardManaCrystals: 1 }
    74	const DAILY_MISSION_STAGE3: DailyMissionDefinition = { id: "stage3", goal: 3, rewardManaCrystals: 1 }
    75	
    76	export const DAILY_MISSIONS: readonly DailyMissionDefinition[] = [
    77	  DAILY_MISSION_MERGE20,
    78	  DAILY_MISSION_BOSS3,
    79	  DAILY_MISSION_SUMMON30,
    80	  DAILY_MISSION_MINE_CLAIM1,
    81	  DAILY_MISSION_STAGE3,
    82	] as const
    83	
    84	const APPRENTICE_SKIN: SkinDefinition = { id: "apprentice", tint: 0xffffff }
    85	const EMBER_SKIN: SkinDefinition = { id: "ember", tint: 0xff7a3c }
    86	const FROST_SKIN: SkinDefinition = { id: "frost", tint: 0x86dcff }
    87	const GILDED_SKIN: SkinDefinition = { id: "gilded", tint: 0xffd873 }
    88	
    89	export const SKINS: readonly SkinDefinition[] = [APPRENTICE_SKIN, EMBER_SKIN, FROST_SKIN, GILDED_SKIN] as const
    90	
    91	export const DEFAULT_SKIN_STATE: SkinState = {
    92	  owned: ["apprentice"],
    93	  equipped: "apprentice",
    94	}
    95	
    96	export function getPetEvolutionForLevel(level: number): number {
    97	  if (level >= PET_EVOLUTION_TWO_LEVEL) {
    98	    return 2
    99	  }
   100	  if (level >= PET_EVOLUTION_ONE_LEVEL) {
   101	    return 1
   102	  }
   103	  return 0
   104	}
   105	
   106	export function getPetDamagePercent(pet: PetState): number {
   107	  return PET_BASE_DPS_SHARE + pet.level * PET_LEVEL_DPS_SHARE + pet.evolution * PET_EVOLUTION_DPS_SHARE
   108	}
   109	
   110	export function addPetXp(state: EngineState, xp: number): EngineState {
   111	  if (xp <= 0) {
   112	    return state
   113	  }
   114	
   115	  let level = state.pet.level
   116	  let petXp = state.pet.xp + xp
   117	
   118	  while (petXp >= getPetXpThreshold(level)) {
   119	    petXp -= getPetXpThreshold(level)
   120	    level += 1
   121	  }
   122	
   123	  return {
   124	    ...state,
   125	    pet: {
   126	      level,
   127	      xp: petXp,
   128	      evolution: getPetEvolutionForLevel(level),
   129	    },
   130	  }
   131	}
   132	
   133	export function shouldPetAttack(previousElapsedMs: number, nextElapsedMs: number): boolean {
   134	  return Math.floor(previousElapsedMs / PET_ATTACK_INTERVAL_MS) < Math.floor(nextElapsedMs / PET_ATTACK_INTERVAL_MS)
   135	}
   136	
   137	export function getWizardTotalDps(state: EngineState): number {
   138	  const castIntervalSeconds = getCastIntervalMs(state) / 1_000
   139	  let equippedDps = 0
   140	  for (const slot of SLOT_INDEXES) {

exec
/bin/zsh -lc "sed -n '130,205p' src/engine/battleRewards.ts | nl -ba -v130" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
   130	        bossElapsedMs: 0,
   131	      }, "bestStage", nextStage), "stage3", 1),
   132	      events: [clearEvent, { type: "bossKill", stage: state.stage, gold: bossGold }],
   133	    }
   134	  }
   135	
   136	  const nextWave = state.wave + 1
   137	  const enemiesHp = createWaveEnemies(state.stage, nextWave)
   138	  const bossSpawn = nextWave === BOSS_WAVE ? [{ type: "bossSpawn", stage: state.stage } satisfies EngineEvent] : []
   139	  return {
   140	    state: {
   141	      ...state,
   142	      wave: nextWave,
   143	      enemiesHp,
   144	      stageHp: sumHp(enemiesHp),
   145	      bossElapsedMs: 0,
   146	    },
   147	    events: [clearEvent, ...bossSpawn],
   148	  }
   149	}
   150	
   151	function addCombatXp(state: EngineState, xp: number): { readonly state: EngineState; readonly events: readonly EngineEvent[] } {
   152	  let wizardLevel = state.wizardLevel
   153	  let wizardXp = state.wizardXp + xp
   154	  let skillPoints = state.skillPoints
   155	  let events: readonly EngineEvent[] = []
   156	
   157	  while (wizardXp >= getWizardXpThreshold(wizardLevel)) {
   158	    wizardXp -= getWizardXpThreshold(wizardLevel)
   159	    wizardLevel += 1
   160	    skillPoints += 1
   161	    events = [...events, { type: "levelUp", wizardLevel, skillPoints }]
   162	  }
   163	
   164	  return {
   165	    state: addPetXp({ ...state, wizardLevel, wizardXp, skillPoints }, xp * 0.5),
   166	    events,
   167	  }
   168	}
   169	
   170	function getKillReward(state: EngineState, boss: boolean): number {
   171	  const relicEffects = getEquippedRelicEffects(state.relics)
   172	  const riftMultiplier = state.activeRift?.kind === "golden" ? GOLDEN_RIFT_REWARD_MULTIPLIER : 1
   173	  const reward = Math.ceil(
   174	    GOLD_REWARD_BASE *
   175	      GOLD_REWARD_GROWTH ** state.stage *
   176	      (1 + GOLD_GAIN_PER_POINT * getTraitSkillGoldPoints(state)) *
   177	      getWizardGoldMultiplier(state.wizardLevel) *
   178	      relicEffects.goldMultiplier *
   179	      riftMultiplier,
   180	  )
   181	  return boss
   182	    ? Math.ceil(reward * BOSS_REWARD_MULTIPLIER * relicEffects.bossGoldMultiplier)
   183	    : Math.ceil((reward * REGULAR_MOB_BASE_COUNT) / getRegularMobCount(state.stage))
   184	}
   185	
   186	function getWizardXpThreshold(wizardLevel: number): number {
   187	  return WIZARD_XP_PER_LEVEL * wizardLevel
   188	}
   189	
   190	function createTrialEnemies(stage: number, step: number): readonly number[] {
   191	  const multiplier = TRIAL_RIFT_BOSS_MULTIPLIERS[step] ?? 2.2
   192	  const hp = createWaveEnemies(stage, BOSS_WAVE)[0] ?? 1
   193	  return [hp * multiplier]
   194	}

hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '1,330p' src/ui/engineStorage.ts | nl -ba" in /Users/ahndohun/projects/merge-mage-redesign
exec
/bin/zsh -lc "sed -n '1,140p' src/engine/progressionActions.ts | nl -ba" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import { QuestClaimError } from "./errors.js"
     2	import { trackProgress } from "./progression.js"
     3	import { findQuest, getVisibleQuests, refreshQuests } from "./quests.js"
     4	import { selectTraitPick, type TraitId, type TraitSlot } from "./traits.js"
     5	import type { EngineState } from "./types.js"
     6	
     7	export function claimQuestReward(state: EngineState, questId: string): EngineState {
     8	  const refreshed = refreshQuests(state)
     9	  const quest = findQuest(questId)
    10	  if (quest === null) {
    11	    throw new QuestClaimError(questId, "missing")
    12	  }
    13	  if (!getVisibleQuests(refreshed).some((visibleQuest) => visibleQuest.id === questId)) {
    14	    throw new QuestClaimError(questId, "locked")
    15	  }
    16	  if (!refreshed.quests.completed.includes(questId) && !quest.isComplete(refreshed)) {
    17	    throw new QuestClaimError(questId, "incomplete")
    18	  }
    19	  if (refreshed.quests.claimed.includes(questId)) {
    20	    throw new QuestClaimError(questId, "claimed")
    21	  }
    22	
    23	  return trackProgress({
    24	    ...refreshed,
    25	    gold: refreshed.gold + quest.reward.gold,
    26	    skillPoints: refreshed.skillPoints + quest.reward.skillPoints,
    27	    quests: {
    28	      completed: refreshed.quests.completed,
    29	      claimed: [...refreshed.quests.claimed, questId],
    30	    },
    31	  })
    32	}
    33	
    34	export function selectTrait(state: EngineState, slot: TraitSlot, traitId: TraitId): EngineState {
    35	  return trackProgress(selectTraitPick(state, slot, traitId))
    36	}

 succeeded in 0ms:
     1	import { convertLegacyManaStonesToCrystals } from "../engine/currency"
     2	import { createInitialState, createInitialV3ProgressionState, type EngineV3ProgressionState } from "../engine/state"
     3	import type { AchievementState, EngineState, Spellbook } from "../engine/types"
     4	import { writeLocaleOverride } from "./i18n"
     5	
     6	const SAVE_STATE_KEY = "merge-mage:engine-state"
     7	const SAVE_TOKEN_KEY = "merge-mage:save-token"
     8	const NICKNAME_KEY = "merge-mage:nickname"
     9	const TUTORIAL_DONE_KEY = "merge-mage:tutorial-done"
    10	
    11	/**
    12	 * Bump when a save-format change changes the local wrapper contract. v2 wiped
    13	 * pre-release bare saves; v3 preserved progression slots; v4 folds mana stones
    14	 * into crystals and records highestStage.
    15	 */
    16	export const SAVE_VERSION = 4
    17	
    18	type VersionedSave = {
    19	  readonly version: number
    20	  readonly state: unknown
    21	}
    22	
    23	type EngineV2State = Omit<EngineState, keyof EngineV3ProgressionState | "highestStage"> & {
    24	  readonly manaStone?: number
    25	}
    26	type EngineV3State = Omit<EngineState, "highestStage"> & {
    27	  readonly manaStone: number
    28	}
    29	type EngineV3PreManaStoneState = Omit<EngineState, "highestStage">
    30	
    31	export type SaveToken = {
    32	  readonly token: string
    33	  readonly existed: boolean
    34	}
    35	
    36	/** Drop the save, token, and tutorial flag — a clean-slate first experience. */
    37	function wipeLegacySave(): void {
    38	  const storage = getStorage()
    39	  storage?.removeItem(SAVE_STATE_KEY)
    40	  storage?.removeItem(SAVE_TOKEN_KEY)
    41	  storage?.removeItem(TUTORIAL_DONE_KEY)
    42	}
    43	
    44	export function loadInitialState(): EngineState {
    45	  // ?fresh=1 starts a brand-new run: E2E tests need isolation from state the
    46	  // previous test left in this browser profile, and players get a reset URL.
    47	  // A fresh-param visitor already knows the game, so the first-run tutorial is
    48	  // marked done too (it would dim-block E2E agents otherwise); only organic
    49	  // first visits (no param) see the tutorial.
    50	  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("fresh")) {
    51	    getStorage()?.removeItem(SAVE_STATE_KEY)
    52	    getStorage()?.removeItem(SAVE_TOKEN_KEY)
    53	    writeLocaleOverride("en")
    54	    getStorage()?.setItem(TUTORIAL_DONE_KEY, "1")
    55	    const fresh = createInitialState(createSeed())
    56	    saveLocalState(fresh)
    57	    return fresh
    58	  }
    59	
    60	  const raw = getStorage()?.getItem(SAVE_STATE_KEY)
    61	  if (raw !== undefined && raw !== null) {
    62	    try {
    63	      const parsed: unknown = JSON.parse(raw)
    64	      const state = readVersionedSave(parsed)
    65	      if (state !== null) {
    66	        return state
    67	      }
    68	      // A save exists but is legacy / below SAVE_VERSION: reset everything so
    69	      // pre-release visitors get the current first-run experience.
    70	      wipeLegacySave()
    71	    } catch (error) {
    72	      if (!(error instanceof SyntaxError)) {
    73	        throw error
    74	      }
    75	    }
    76	  }
    77	
    78	  return createInitialState(createSeed())
    79	}
    80	
    81	/**
    82	 * Returns the EngineState from a persisted wrapper. v2/v3 are migrated in
    83	 * place; older versions return null so the caller resets.
    84	 */
    85	function readVersionedSave(value: unknown): EngineState | null {
    86	  if (isVersionedSave(value)) {
    87	    if (value.version >= SAVE_VERSION) {
    88	      if (isEngineState(value.state)) {
    89	        return value.state
    90	      }
    91	    }
    92	    if (value.version === 3) {
    93	      if (isV3EngineState(value.state)) {
    94	        return migrateV3State(value.state)
    95	      }
    96	      if (isV3PreManaStoneState(value.state)) {
    97	        return migrateV3PreManaStoneState(value.state)
    98	      }
    99	    }
   100	    if (value.version === 2 && isV2EngineState(value.state)) {
   101	      return migrateV2State(value.state)
   102	    }
   103	  }
   104	  return null
   105	}
   106	
   107	function isVersionedSave(value: unknown): value is VersionedSave {
   108	  return isRecord(value) && typeof value["version"] === "number" && "state" in value
   109	}
   110	
   111	export function saveLocalState(state: EngineState): void {
   112	  const payload: VersionedSave = { version: SAVE_VERSION, state }
   113	  getStorage()?.setItem(SAVE_STATE_KEY, JSON.stringify(payload))
   114	}
   115	
   116	export function loadNickname(): string {
   117	  return getStorage()?.getItem(NICKNAME_KEY) ?? "Mage"
   118	}
   119	
   120	export function saveNickname(nickname: string): void {
   121	  getStorage()?.setItem(NICKNAME_KEY, nickname)
   122	}
   123	
   124	let wipeInProgress = false
   125	
   126	/** True after clearSavedRun(): unload-time autosave must not resurrect the run. */
   127	export function isWipeInProgress(): boolean {
   128	  return wipeInProgress
   129	}
   130	
   131	export function clearSavedRun(): void {
   132	  // NEW GAME was broken: the beforeunload/pagehide autosave re-wrote the old
   133	  // state between the wipe and the reload, so the "fresh" run loaded stage N.
   134	  wipeInProgress = true
   135	  const storage = getStorage()
   136	  storage?.removeItem(SAVE_STATE_KEY)
   137	  storage?.removeItem(SAVE_TOKEN_KEY)
   138	  storage?.removeItem(NICKNAME_KEY)
   139	}
   140	
   141	export function ensureSaveToken(): SaveToken {
   142	  const storage = getStorage()
   143	  const existing = storage?.getItem(SAVE_TOKEN_KEY)
   144	  if (existing !== undefined && existing !== null && existing.length === 32) {
   145	    return { token: existing, existed: true }
   146	  }
   147	
   148	  const token = createToken()
   149	  storage?.setItem(SAVE_TOKEN_KEY, token)
   150	  return { token, existed: false }
   151	}
   152	
   153	function getStorage(): Storage | null {
   154	  if (typeof window === "undefined") {
   155	    return null
   156	  }
   157	
   158	  try {
   159	    return window.localStorage
   160	  } catch (error) {
   161	    if (error instanceof Error) {
   162	      return null
   163	    }
   164	    throw error
   165	  }
   166	}
   167	
   168	function createSeed(): number {
   169	  return Math.floor(Math.random() * 2_147_483_647) + 1
   170	}
   171	
   172	function createToken(): string {
   173	  const bytes = new Uint8Array(16)
   174	  window.crypto.getRandomValues(bytes)
   175	  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
   176	}
   177	
   178	function isEngineState(value: unknown): value is EngineState {
   179	  if (!isRecord(value)) {
   180	    return false
   181	  }
   182	  const record: Record<string, unknown> = value
   183	
   184	  return (
   185	    isV2EngineState(value) &&
   186	    typeof record["highestStage"] === "number" &&
   187	    !("manaStone" in record) &&
   188	    isQuestState(record["quests"]) &&
   189	    isAchievementState(record["achievements"]) &&
   190	    isCodexState(record["codex"]) &&
   191	    isTraitState(record["traits"]) &&
   192	    isRiftRunsState(record["riftRuns"]) &&
   193	    (record["activeRift"] === null || isActiveRiftState(record["activeRift"])) &&
   194	    isRelicState(record["relics"]) &&
   195	    isPetState(record["pet"]) &&
   196	    isMineState(record["mine"]) &&
   197	    isDailyMissionState(record["dailyMissions"]) &&
   198	    isSkinState(record["skins"])
   199	  )
   200	}
   201	
   202	function isV3EngineState(value: unknown): value is EngineV3State {
   203	  if (!isRecord(value)) {
   204	    return false
   205	  }
   206	  const record: Record<string, unknown> = value
   207	  return isV3PreManaStoneState(value) && typeof record["manaStone"] === "number"
   208	}
   209	
   210	function isV3PreManaStoneState(value: unknown): value is EngineV3PreManaStoneState {
   211	  if (!isRecord(value)) {
   212	    return false
   213	  }
   214	
   215	  const record: Record<string, unknown> = value
   216	
   217	  return (
   218	    isV2EngineState(value) &&
   219	    isQuestState(record["quests"]) &&
   220	    isAchievementState(record["achievements"]) &&
   221	    isCodexState(record["codex"]) &&
   222	    isTraitState(record["traits"]) &&
   223	    isRelicState(record["relics"]) &&
   224	    isRiftRunsState(record["riftRuns"]) &&
   225	    (record["activeRift"] === null || isActiveRiftState(record["activeRift"])) &&
   226	    isPetState(record["pet"]) &&
   227	    isMineState(record["mine"]) &&
   228	    isDailyMissionState(record["dailyMissions"]) &&
   229	    isSkinState(record["skins"])
   230	  )
   231	}
   232	
   233	function migrateV2State(state: EngineV2State): EngineState {
   234	  const { manaStone = 0, ...withoutManaStone } = state
   235	  return {
   236	    ...withoutManaStone,
   237	    manaCrystals: state.manaCrystals + convertLegacyManaStonesToCrystals(manaStone),
   238	    highestStage: deriveHighestStage(state),
   239	    ...createInitialV3ProgressionState(),
   240	  }
   241	}
   242	
   243	function migrateV3State(state: EngineV3State): EngineState {
   244	  const { manaStone, ...withoutManaStone } = state
   245	  return {
   246	    ...withoutManaStone,
   247	    manaCrystals: state.manaCrystals + convertLegacyManaStonesToCrystals(manaStone),
   248	    highestStage: deriveHighestStage(state),
   249	  }
   250	}
   251	
   252	function migrateV3PreManaStoneState(state: EngineV3PreManaStoneState): EngineState {
   253	  return { ...state, highestStage: deriveHighestStage(state) }
   254	}
   255	
   256	function deriveHighestStage(state: { readonly stage: number; readonly highestStage?: number; readonly achievements?: AchievementState }): number {
   257	  return Math.max(state.stage, state.highestStage ?? 0, state.achievements?.counters["bestStage"] ?? 0, state.achievements?.counters["stagesReached"] ?? 0)
   258	}
   259	
   260	function isV2EngineState(value: unknown): value is EngineV2State {
   261	  if (!isRecord(value)) {
   262	    return false
   263	  }
   264	
   265	  const numbers = [
   266	    "gold",
   267	    "highestLevelEver",
   268	    "stage",
   269	    "wave",
   270	    "stageHp",
   271	    "wizardLevel",
   272	    "wizardXp",
   273	    "skillPoints",
   274	    "manaCrystals",
   275	    "prestigeCount",
   276	    "bossElapsedMs",
   277	    "frostSlowMs",
   278	    "recentGoldPerSecond",
   279	    "elapsedMs",
   280	    "rngSeed",
   281	    "rngState",
   282	    "nextBookId",
   283	  ] as const
   284	
   285	  return (
   286	    numbers.every((key) => typeof value[key] === "number") &&
   287	    (value["lastSeenServerTs"] === null || typeof value["lastSeenServerTs"] === "number") &&
   288	    isSpellbookArray(value["books"]) &&
   289	    isEquippedArray(value["equipped"]) &&
   290	    isSkills(value["skills"]) &&
   291	    isNumberArray(value["slotTiers"], 6) &&
   292	    isNumberArray(value["castProgressMs"], 6) &&
   293	    isNumberArray(value["enemiesHp"], null)
   294	  )
   295	}
   296	
   297	function isQuestState(value: unknown): boolean {
   298	  return isRecord(value) && isStringArray(value["completed"]) && isStringArray(value["claimed"])
   299	}
   300	
   301	function isAchievementState(value: unknown): boolean {
   302	  return isRecord(value) && isNumberRecord(value["counters"]) && isStringArray(value["claimed"])
   303	}
   304	
   305	function isCodexState(value: unknown): boolean {
   306	  return isRecord(value) && isNumberRecord(value["tiers"])
   307	}
   308	
   309	function isTraitState(value: unknown): boolean {
   310	  return isRecord(value) && isStringRecord(value["picks"])
   311	}
   312	
   313	function isRelicState(value: unknown): boolean {
   314	  return isRecord(value) && isNumberRecord(value["owned"]) && isNullableStringArray(value["equipped"], 3)
   315	}
   316	
   317	function isRiftRunsState(value: unknown): boolean {
   318	  return (
   319	    isRecord(value) &&
   320	    typeof value["date"] === "string" &&
   321	    typeof value["golden"] === "number" &&
   322	    typeof value["trial"] === "number"
   323	  )
   324	}
   325	
   326	function isActiveRiftState(value: unknown): boolean {
   327	  if (!isRecord(value) || !isBattleSnapshot(value["snapshot"]) || typeof value["startedStage"] !== "number") {
   328	    return false
   329	  }
   330	  if (value["kind"] === "golden") {

exec
/bin/zsh -lc "sed -n '1,80p' src/engine/unlocks.ts | nl -ba" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
     1	import type { EngineState } from "./types.js"
     2	
     3	export type UnlockedFeatures = {
     4	  readonly books: boolean
     5	  readonly wizard: boolean
     6	  readonly journey: boolean
     7	  readonly rifts: boolean
     8	  readonly rebirth: boolean
     9	  readonly camp: boolean
    10	}
    11	
    12	export type UnlockFeatureId = keyof UnlockedFeatures
    13	
    14	export const UNLOCK_FEATURE_IDS: readonly UnlockFeatureId[] = ["books", "wizard", "journey", "rifts", "rebirth", "camp"] as const
    15	
    16	export function getUnlockedFeatures(state: EngineState): UnlockedFeatures {
    17	  return {
    18	    books: true,
    19	    wizard: state.wizardLevel >= 3,
    20	    journey: state.highestStage >= 5,
    21	    rifts: state.highestStage >= 7,
    22	    rebirth: state.highestStage >= 10,
    23	    camp: state.prestigeCount >= 1,
    24	  }
    25	}

2026-07-04T07:02:30.279375Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:02:30.284005Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
codex
스킨은 현재 `apprentice/ember/frost/gilded` 네 가지 tint 보상처럼 존재하고, 구매 화폐는 붙어 있지 않습니다. 따라서 R5에서는 새 경제를 만들지 않고 이 네 스킨을 전직 단계·유파 선택 보상으로 재해석하는 쪽이 가장 보존적입니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "skins|SKINS|equipSkin|apprentice|ember|frost|gilded|skin" src docs/specs/2026-07-04-redesign-tracks.md' in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
docs/specs/2026-07-04-redesign-tracks.md:89:- 시각: 새 외부 레퍼런스 없이 **게임 자체 아트를 기준**으로 일관(레트로 픽셀, `--mm-gold`/`--mm-frost`, `clip-path` 각진 모서리, 오프셋 `box-shadow`). 포탈 = 열린 문/소용돌이 은유.
src/engine/relics.ts:5:  "emberSigil",
src/engine/relics.ts:6:  "frostLens",
src/engine/relics.ts:16:  "apprenticePurse",
src/engine/relics.ts:31:  readonly frostSlowBonusMs: number
src/engine/relics.ts:46:    id: "emberSigil",
src/engine/relics.ts:53:    id: "frostLens",
src/engine/relics.ts:123:    id: "apprenticePurse",
src/engine/relics.ts:141:  let frostSlowBonusMs = 0
src/engine/relics.ts:158:    fireDamageMultiplier *= relicId === "emberSigil" ? 1 + 0.08 * level : 1
src/engine/relics.ts:159:    frostSlowBonusMs += relicId === "frostLens" ? 200 * level : 0
src/engine/relics.ts:169:    startingGoldBonus += relicId === "apprenticePurse" ? 5 * level : 0
src/engine/relics.ts:174:    frostSlowBonusMs,
src/engine/codex.ts:58:    case "frost":
src/engine/camp.test.ts:8:  equipSkin,
src/engine/camp.test.ts:137:describe("wizard skins", () => {
src/engine/camp.test.ts:138:  it("unlocks skins from counters and equips only owned skins", () => {
src/engine/camp.test.ts:146:    const equipped = equipSkin(state, "gilded")
src/engine/camp.test.ts:147:    const blocked = equipSkin(state, "missing")
src/engine/camp.test.ts:149:    expect(unlocked.map((skin) => skin.id)).toEqual(["apprentice", "ember", "frost", "gilded"])
src/engine/camp.test.ts:150:    expect(equipped.skins.equipped).toBe("gilded")
src/engine/camp.test.ts:151:    expect(blocked.skins.equipped).toBe("apprentice")
src/engine/camp.test.ts:161:    expect(getUnlockedSkins(state).map((skin) => skin.id)).toContain("gilded")
src/engine/state.test.ts:28:    expect(state.skins).toEqual({ owned: ["apprentice"], equipped: "apprentice" })
src/engine/actions.test.ts:55:        book("slot-1", 1, "frost"),
src/engine/actions.test.ts:58:        book("slot-4", 1, "frost"),
src/engine/actions.test.ts:77:        book("slot-1", 1, "frost"),
src/engine/actions.test.ts:80:        book("slot-4", 1, "frost"),
src/engine/actions.test.ts:100:      book("b", 9, "frost"),
src/engine/actions.test.ts:143:      books: [book("backup", 5, "frost")],
src/engine/actions.test.ts:170:      equipped: [book("old", 1, "frost"), null, null, null, null, null],
src/engine/actions.test.ts:201:      equipped: [book("equipped", 2, "frost"), null, null, null, null, null],
src/engine/actions.test.ts:225:      books: [book("low", 2, "fire"), book("high", 8, "holy"), book("mid", 5, "frost")],
src/engine/actions.test.ts:239:      equipped: [book("equipped", 3, "frost"), null, null, null, null, null],
src/engine/actions.test.ts:268:      books: [book("inv-low", 2, "fire"), book("inv-high", 6, "frost")],
src/engine/actions.test.ts:284:      books: [book("c", 3, "fire"), book("d", 3, "frost")],
src/engine/actions.test.ts:335:      relics: { owned: { crystalVial: 2, apprenticePurse: 1 }, equipped: ["crystalVial", "apprenticePurse", null] },
src/engine/actions.test.ts:383:          emberSigil: 10,
src/engine/actions.test.ts:384:          frostLens: 10,
src/engine/actions.test.ts:394:          apprenticePurse: 10,
src/engine/actions.test.ts:407:      relics: { owned: { emberSigil: 1, goldenBookmark: 2 }, equipped: [null, null, null] },
src/engine/actions.test.ts:410:    const equipped = equipRelic(equipRelic(state, "emberSigil", 0), "goldenBookmark", 0)
src/engine/simulate.ts:458:    const relicId = RELIC_IDS[Math.floor(roll.value * RELIC_IDS.length)] ?? "emberSigil"
src/engine/simulate.ts:478:  const preferred: readonly RelicId[] = ["quickeningHourglass", "emberSigil", "goldenBookmark", "crystalVial", "sageInk", "craftsmanChisel"]
src/engine/simulate.ts:510:    frostSlowMs: 0,
src/engine/simulate.ts:525:      frostSlowMs: Math.max(0, current.frostSlowMs - config.TICK_MS),
src/engine/simulate.ts:572:          frostSlowMs: 0,
src/engine/simulate.ts:619:  const frostSlow = getFrostSlow(state)
src/engine/simulate.ts:620:  const frostSlowMs = frostSlow.durationMs + getEquippedRelicEffects(state.relics).frostSlowBonusMs
src/engine/simulate.ts:621:  const slowedState = book.element === "frost" ? { ...state, frostSlowMs: Math.max(state.frostSlowMs, frostSlowMs) } : state
src/engine/simulate.ts:688:    frostSlowMs: 0,
src/engine/simulate.ts:847:    case "frost":
src/engine/simulate.ts:860:    case "frost":
src/engine/simulate.ts:874:    return "frost"
src/engine/actions.ts:53:import { equipSkin as equipSkinReducer, recordDailyProgress } from "./camp.js"
src/engine/actions.ts:293:    skins: state.skins,
src/engine/actions.ts:309:  const rolledId = RELIC_IDS[rolledIndex] ?? "emberSigil"
src/engine/actions.ts:328:export function equipSkin(state: EngineState, skinId: string): EngineState {
src/engine/actions.ts:329:  return equipSkinReducer(state, skinId)
src/engine/actions.ts:376:    frostSlowMs: 0,
src/engine/actions.ts:400:    return "frost"
src/engine/actions.ts:444:    frostSlowMs: state.frostSlowMs,
src/engine/actions.ts:467:  return ids[0] ?? "emberSigil"
src/engine/battleRewards.ts:96:        frostSlowMs: 0,
src/engine/types.ts:3:export const ELEMENTS = ["fire", "frost", "holy"] as const
src/engine/types.ts:73:  readonly frostSlowMs: number
src/engine/types.ts:132:  readonly frostSlowMs: number
src/engine/types.ts:148:  readonly skins: SkinState
src/engine/resonance.ts:14:  readonly frost: ElementResonance & { readonly factor: number; readonly durationMs: number }
src/engine/resonance.ts:23:  const frostScale = getScale(counts.frost, requirement, monoElement === "frost")
src/engine/resonance.ts:25:  const frostTrait = getTraitFrostSlowBonus(state)
src/engine/resonance.ts:34:    frost: {
src/engine/resonance.ts:35:      ...baseResonance(counts.frost, requirement, monoElement === "frost"),
src/engine/resonance.ts:36:      factor: FROST_SLOW_FACTOR + 0.15 * frostScale + frostTrait.factor,
src/engine/resonance.ts:37:      durationMs: FROST_SLOW_MS + 1_000 * frostScale + frostTrait.durationMs,
src/engine/resonance.ts:51:  const frost = getResonance(state).frost
src/engine/resonance.ts:52:  return { factor: frost.factor, durationMs: frost.durationMs }
src/engine/resonance.ts:68:        case "frost":
src/engine/resonance.ts:69:          return { ...counts, frost: counts.frost + 1 }
src/engine/resonance.ts:76:    { fire: 0, frost: 0, holy: 0 },
src/engine/battle.test.ts:104:  it("applies equipped relic damage, frost duration, and crit damage contracts", () => {
src/engine/battle.test.ts:110:        owned: { emberSigil: 2, abyssalEye: 3, frostLens: 1 },
src/engine/battle.test.ts:111:        equipped: ["emberSigil", "abyssalEye", "frostLens"],
src/engine/battle.test.ts:117:    const frost = simulateTicks(
src/engine/battle.test.ts:120:        equipped: [book("frost", 20, "frost"), null, null, null, null, null],
src/engine/battle.test.ts:128:    expect(frost.events).toContainEqual(expect.objectContaining({ type: "slow", durationMs: 2_200 }))
src/engine/engine.test.ts:45:    const right: Spellbook = { id: "right", level: 5, element: "frost" }
src/engine/traits.ts:130:export function getTraitElementDamageMultiplier(state: EngineState, element: "fire" | "frost" | "holy"): number {
src/engine/traits.ts:134:    case "frost":
src/engine/progression.test.ts:32:        equipped: [book("b", 1, "frost"), null, null, null, null, null],
src/engine/progression.test.ts:84:    const plain = bookDamage(book("cast", 10, "fire"), 0, { ...base, equipped: [book("x", 10, "frost"), null, null, null, null, null], codex: { tiers: {} } })
src/engine/camp.ts:28:export type SkinId = "apprentice" | "ember" | "frost" | "gilded"
src/engine/camp.ts:84:const APPRENTICE_SKIN: SkinDefinition = { id: "apprentice", tint: 0xffffff }
src/engine/camp.ts:85:const EMBER_SKIN: SkinDefinition = { id: "ember", tint: 0xff7a3c }
src/engine/camp.ts:86:const FROST_SKIN: SkinDefinition = { id: "frost", tint: 0x86dcff }
src/engine/camp.ts:87:const GILDED_SKIN: SkinDefinition = { id: "gilded", tint: 0xffd873 }
src/engine/camp.ts:89:export const SKINS: readonly SkinDefinition[] = [APPRENTICE_SKIN, EMBER_SKIN, FROST_SKIN, GILDED_SKIN] as const
src/engine/camp.ts:92:  owned: ["apprentice"],
src/engine/camp.ts:93:  equipped: "apprentice",
src/engine/camp.ts:286:  return SKINS.filter((skin) => isSkinUnlocked(state, skin.id))
src/engine/camp.ts:289:export function equipSkin(state: EngineState, skinId: string): EngineState {
src/engine/camp.ts:290:  const unlocked = getUnlockedSkins(state).some((skin) => skin.id === skinId)
src/engine/camp.ts:292:    return { ...state, skins: normalizeSkinState(state.skins, state) }
src/engine/camp.ts:296:    skins: {
src/engine/camp.ts:297:      owned: mergeOwnedSkins(normalizeSkinState(state.skins, state).owned, skinId),
src/engine/camp.ts:298:      equipped: skinId,
src/engine/camp.ts:303:export function normalizeSkinState(skins: SkinState, state: EngineState): SkinState {
src/engine/camp.ts:305:  const owned = mergeOwnedSkins(skins.owned.length === 0 ? DEFAULT_SKIN_STATE.owned : skins.owned, ...unlockedIds)
src/engine/camp.ts:306:  const equipped = skins.equipped !== null && owned.includes(skins.equipped) ? skins.equipped : DEFAULT_SKIN_STATE.equipped
src/engine/camp.ts:311:  const normalized = normalizeSkinState(state.skins, state)
src/engine/camp.ts:312:  return SKINS.find((skin) => skin.id === normalized.equipped) ?? APPRENTICE_SKIN
src/engine/camp.ts:417:function isSkinUnlocked(state: EngineState, skinId: SkinId): boolean {
src/engine/camp.ts:418:  switch (skinId) {
src/engine/camp.ts:419:    case "apprentice":
src/engine/camp.ts:421:    case "ember":
src/engine/camp.ts:423:    case "frost":
src/engine/camp.ts:425:    case "gilded":
src/engine/camp.ts:431:  return getUnlockedSkins(state).map((skin) => skin.id)
src/engine/camp.ts:456:function mergeOwnedSkins(owned: readonly string[], ...skinIds: readonly string[]): readonly string[] {
src/engine/camp.ts:458:  for (const skinId of skinIds) {
src/engine/camp.ts:459:    merged.add(skinId)
src/engine/state.ts:19:  "quests" | "achievements" | "codex" | "traits" | "relics" | "riftRuns" | "activeRift" | "pet" | "mine" | "dailyMissions" | "skins"
src/engine/state.ts:45:    frostSlowMs: 0,
src/engine/state.ts:67:    skins: DEFAULT_SKIN_STATE,
src/engine/battle.ts:76:      frostSlowMs: Math.max(0, current.frostSlowMs - TICK_MS),
src/engine/battle.ts:132:          frostSlowMs: 0,
src/engine/battle.ts:227:  const frostSlow = getFrostSlow(state)
src/engine/battle.ts:228:  const frostSlowMs = frostSlow.durationMs + getEquippedRelicEffects(state.relics).frostSlowBonusMs
src/engine/battle.ts:230:    book.element === "frost" ? [{ type: "slow", durationMs: frostSlowMs, factor: frostSlow.factor }] : []
src/engine/battle.ts:231:  const slowedState = book.element === "frost" ? { ...state, frostSlowMs: Math.max(state.frostSlowMs, frostSlowMs) } : state
src/engine/battle.ts:248:    case "frost":
src/engine/battle.ts:261:    case "frost":
src/game/TextureKeys.ts:7:  frost: 0x6ecbff,
src/game/TextureKeys.ts:13:  frost: ElementColors.frost,
src/game/TextureKeys.ts:20:export const TOME_ELEMENTS = ["fire", "frost", "holy"] as const
src/game/TextureKeys.ts:68:    frost: "battle:tome:frost",
src/game/TextureKeys.ts:101:  vfxFrame(kind: "fire" | "frost" | "explosion", frame: number): string {
src/game/TextureKeys.ts:126:    frost: "battle:anim:projectile:frost",
src/game/TextureKeys.ts:171:    scene.load.image(TextureKeys.vfxFrame("frost", frame), `/assets/vfx/frost/${frameName(frame)}.png`)
src/game/TextureKeys.ts:226:  createAnimation(scene, AnimationKeys.projectile.frost, sequenceFrames(VFX_PROJECTILE_FRAMES.map((frame) => TextureKeys.vfxFrame("frost", frame))), 18, -1)
src/game/scenes/BattleLayout.ts:33:const ELEMENT_CYCLE: readonly Element[] = ["fire", "frost", "holy"]
src/game/scenes/BattleEffects.ts:191:    // than the 64x64 fire/frost explosion frames, so scale it up to match.
src/game/scenes/BattleEffects.ts:251:    case "frost":
src/game/scenes/BattleEffects.ts:252:      return TextureKeys.vfxFrame("frost", 1)
src/game/scenes/BattleEffects.ts:266:    case "frost":
src/game/scenes/BattleEffects.ts:267:      return AnimationKeys.projectile.frost
src/server/api.test.ts:7:const V3_PROGRESS_KEYS = ["highestStage", "quests", "achievements", "codex", "traits", "relics", "riftRuns", "activeRift", "pet", "mine", "dailyMissions", "skins"] as const
src/server/api.test.ts:56:      expect(parsed.data.state.skins).toEqual({ owned: ["apprentice"], equipped: "apprentice" })
src/server/api.test.ts:65:      relics: { owned: { emberSigil: 2 }, equipped: ["emberSigil", null, null] as const },
src/server/api.test.ts:67:      skins: { owned: ["apprentice-blue"], equipped: "apprentice-blue" },
src/server/api.test.ts:75:    expect(parsed.relics).toEqual({ owned: { emberSigil: 2 }, equipped: ["emberSigil", null, null] })
src/server/api.test.ts:77:    expect(parsed.skins).toEqual({ owned: ["apprentice-blue"], equipped: "apprentice-blue" })
src/game/scenes/BattleScene.ts:20:// Rift warp flash tints — mirror --mm-gold / --mm-frost from src/styles.css.
src/game/scenes/BattleScene.ts:283:  // itself, so there is no persisted tint to remember to undo on exit.
src/ui/BooksPanel.test.tsx:137:        book("b", 1, "frost"),
src/ui/BooksPanel.test.tsx:140:        book("e", 1, "frost"),
src/ui/HelpModal.tsx:20:  { nameKey: "frost", descKey: "frostDesc", className: "help-el-frost" },
src/ui/useActionFeedback.ts:77:  frost: "#6ecbff",
src/ui/renderTab.tsx:66:          onEquipSkin={engine.equipSkin}
src/ui/i18n.ts:60:  skinsTitle: "WIZARD SKINS",
src/ui/i18n.ts:62:  skinApprentice: "APPRENTICE",
src/ui/i18n.ts:63:  skinEmber: "EMBER",
src/ui/i18n.ts:64:  skinFrost: "FROST",
src/ui/i18n.ts:65:  skinGilded: "GILDED",
src/ui/i18n.ts:108:  frost: "FROST",
src/ui/i18n.ts:118:  frostDesc: "slows",
src/ui/i18n.ts:210:  skinsTitle: "위저드 스킨",
src/ui/i18n.ts:212:  skinApprentice: "견습",
src/ui/i18n.ts:213:  skinEmber: "잿불",
src/ui/i18n.ts:214:  skinFrost: "서리",
src/ui/i18n.ts:215:  skinGilded: "금빛",
src/ui/i18n.ts:258:  frost: "냉기",
src/ui/i18n.ts:268:  frostDesc: "느리게 해요",
src/ui/engineStorage.ts:198:    isSkinState(record["skins"])
src/ui/engineStorage.ts:229:    isSkinState(record["skins"])
src/ui/engineStorage.ts:277:    "frostSlowMs",
src/ui/engineStorage.ts:347:    typeof value["frostSlowMs"] === "number"
src/ui/engineStorage.ts:415:  return value === "fire" || value === "frost" || value === "holy"
src/ui/engineStorage.test.ts:9:const V3_PROGRESS_KEYS = ["highestStage", "quests", "achievements", "codex", "traits", "relics", "riftRuns", "activeRift", "pet", "mine", "dailyMissions", "skins"] as const
src/ui/engineStorage.test.ts:117:    expect(loaded.skins).toEqual({ owned: ["apprentice"], equipped: "apprentice" })
src/ui/engineStorage.test.ts:127:      skins: { owned: ["ember"], equipped: "ember" },
src/ui/engineStorage.test.ts:137:    expect(loaded.skins).toEqual({ owned: ["ember"], equipped: "ember" })
src/ui/bookInteractions.ts:190:  return value === "fire" || value === "frost" || value === "holy"
src/ui/CampPanel.tsx:2:  SKINS,
src/ui/CampPanel.tsx:18:  readonly onEquipSkin: (skinId: string) => boolean
src/ui/CampPanel.tsx:21:const skinLabelKeys: Record<SkinId, MessageKey> = {
src/ui/CampPanel.tsx:22:  apprentice: "skinApprentice",
src/ui/CampPanel.tsx:23:  ember: "skinEmber",
src/ui/CampPanel.tsx:24:  frost: "skinFrost",
src/ui/CampPanel.tsx:25:  gilded: "skinGilded",
src/ui/CampPanel.tsx:29:// homestead systems: familiar, mana mine, and skins.
src/ui/CampPanel.tsx:85:      <section className="camp-card camp-skins-card" data-testid="camp-skins-card">
src/ui/CampPanel.tsx:86:        <div className="camp-card-title">{t("skinsTitle")}</div>
src/ui/CampPanel.tsx:87:        <div className="skin-grid">
src/ui/CampPanel.tsx:88:          {SKINS.map((skin) => {
src/ui/CampPanel.tsx:89:            const unlocked = unlockedSkins.some((item) => item.id === skin.id)
src/ui/CampPanel.tsx:90:            const active = equippedSkin.id === skin.id
src/ui/CampPanel.tsx:94:                className={`skin-cell${active ? " is-active" : ""}${unlocked ? "" : " is-locked"}`}
src/ui/CampPanel.tsx:95:                data-testid={`skin-${skin.id}`}
src/ui/CampPanel.tsx:97:                key={skin.id}
src/ui/CampPanel.tsx:98:                onClick={() => props.onEquipSkin(skin.id)}
src/ui/CampPanel.tsx:101:                <span className="skin-swatch" style={{ backgroundColor: `#${skin.tint.toString(16).padStart(6, "0")}` }} />
src/ui/CampPanel.tsx:102:                <span>{t(skinLabelKeys[skin.id])}</span>
src/ui/hints.test.ts:30:      books: [book("inventory", 3, "frost")],
src/ui/useEngine.ts:10:  equipSkin as equipSkinReducer,
src/ui/useEngine.ts:85:  readonly equipSkin: (skinId: string) => boolean
src/ui/useEngine.ts:237:  const equipSkin = useCallback(
src/ui/useEngine.ts:238:    (skinId: string) => applyReducer({ reducer: (current) => equipSkinReducer(current, skinId) }),
src/ui/useEngine.ts:396:    equipSkin,
src/ui/bookInteractions.test.ts:65:      books: [book("a", 1, "fire"), book("b", 1, "frost")],
src/ui/bookInteractions.test.ts:102:      books: [book("a", 2, "fire"), book("b", 2, "frost")],
src/ui/bookInteractions.test.ts:124:        target: { kind: "inventory", index: 1, book: book("b", 2, "frost") },
src/ui/overlay.css:12:  --mm-frost: #6ecbff;
src/ui/overlay.css:309:  color: var(--mm-frost);
src/ui/overlay.css:540:  outline: 2px solid var(--mm-frost);
src/ui/overlay.css:610:.element-frost {
src/ui/overlay.css:611:  --element-accent: var(--mm-frost);
src/ui/overlay.css:886:  color: var(--mm-frost);
src/ui/overlay.css:1038:  border-color: var(--mm-frost);
src/ui/overlay.css:1099:    inset 0 0 0 16px var(--mm-frost),
src/ui/overlay.css:1171:  background: var(--mm-frost);
src/ui/overlay.css:1789:.help-el-frost strong {
src/ui/overlay.css:1790:  color: var(--mm-frost);
src/ui/overlay.css:1873:    inset 0 0 0 2px var(--mm-frost),
src/ui/overlay.css:1874:    0 0 0 2px var(--mm-frost),
src/ui/overlay.css:1879:  border-color: var(--mm-frost);
src/ui/overlay.css:2164:  color: var(--mm-frost);
src/ui/overlay.css:2179:  background: var(--mm-frost);
src/ui/overlay.css:2240:.skin-grid {
src/ui/overlay.css:2246:.skin-cell {
src/ui/overlay.css:2264:.skin-cell small {
src/ui/overlay.css:2270:.skin-cell.is-active {
src/ui/overlay.css:2275:.skin-cell.is-locked {
src/ui/overlay.css:2281:  border-color: var(--mm-frost);
src/ui/overlay.css:2285:.skin-swatch {
src/ui/overlay.css:2627:  .camp-skins-card,

exec
/bin/zsh -lc "sed -n '140,260p' src/engine/camp.ts | nl -ba -v140" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
   140	  for (const slot of SLOT_INDEXES) {
   141	    const book = state.equipped[slot]
   142	    if (book === null) {
   143	      continue
   144	    }
   145	    equippedDps += getExpectedBookDamage(state, book.level, state.slotTiers[slot], book.element) / castIntervalSeconds
   146	  }
   147	  const innateStaffDps = DMG_BASE * 0.6 * getManaDamageMultiplier(state) / 1.2
   148	  return equippedDps + innateStaffDps
   149	}
   150	
   151	export function getPetDps(state: EngineState): number {
   152	  return getWizardTotalDps(state) * getPetDamagePercent(state.pet)
   153	}
   154	
   155	export function getUnlockedMineFloor(stage: number): number {
   156	  if (stage >= 50) {
   157	    return 4
   158	  }
   159	  if (stage >= 30) {
   160	    return 3
   161	  }
   162	  if (stage >= 15) {
   163	    return 2
   164	  }
   165	  return 1
   166	}
   167	
   168	export function getMineClaimPreview(state: EngineState, nowMs: number): MineClaimPreview {
   169	  const floor = Math.max(state.mine.floor, getUnlockedMineFloor(state.stage))
   170	  const ratePerHour = getMineRatePerHour(floor) * getMinePetMultiplier(state.pet)
   171	  if (state.mine.lastClaimAt === null) {
   172	    return { floor, elapsedMs: 0, manaCrystals: 0, ratePerHour, claimable: false }
   173	  }
   174	
   175	  const elapsedMs = Math.min(MINE_CAP_MS, Math.max(0, nowMs - state.mine.lastClaimAt))
   176	  const manaCrystals = Math.floor((elapsedMs / (60 * 60 * 1_000)) * ratePerHour)
   177	  return { floor, elapsedMs, manaCrystals, ratePerHour, claimable: manaCrystals > 0 }
   178	}
   179	
   180	export function claimMine(state: EngineState, nowMs: number): EngineState {
   181	  const preview = getMineClaimPreview(state, nowMs)
   182	  const claimed = {
   183	    ...state,
   184	    manaCrystals: state.manaCrystals + preview.manaCrystals,
   185	    mine: {
   186	      floor: preview.floor,
   187	      lastClaimAt: nowMs,
   188	    },
   189	  }
   190	  return preview.manaCrystals > 0 ? recordDailyProgress(incrementAchievementCounter(claimed, "mineClaims", 1), "mineClaim1", 1) : claimed
   191	}
   192	
   193	export function syncMineClock(state: EngineState, nowMs: number): EngineState {
   194	  const floor = Math.max(state.mine.floor, getUnlockedMineFloor(state.stage))
   195	  if (state.mine.lastClaimAt === null || state.mine.floor !== floor) {
   196	    return {
   197	      ...state,
   198	      mine: {
   199	        floor,
   200	        lastClaimAt: state.mine.lastClaimAt ?? nowMs,
   201	      },
   202	    }
   203	  }
   204	  return state
   205	}
   206	
   207	export function syncDailyMissions(state: EngineState, date: Date): EngineState {
   208	  const dateKey = getLocalDateKey(date)
   209	  if (state.dailyMissions.date === dateKey) {
   210	    return state
   211	  }
   212	  return {
   213	    ...state,
   214	    dailyMissions: {
   215	      date: dateKey,
   216	      progress: {},
   217	      claimed: [],
   218	    },
   219	  }
   220	}
   221	
   222	export function recordDailyProgress(
   223	  state: EngineState,
   224	  missionId: DailyMissionId,
   225	  amount: number,
   226	  date?: Date,
   227	): EngineState {
   228	  if (amount <= 0) {
   229	    return state
   230	  }
   231	
   232	  const current = date === undefined ? state : syncDailyMissions(state, date)
   233	  const mission = getDailyMissionDefinition(missionId)
   234	  const currentProgress = current.dailyMissions.progress[missionId] ?? 0
   235	  return {
   236	    ...current,
   237	    dailyMissions: {
   238	      ...current.dailyMissions,
   239	      progress: {
   240	        ...current.dailyMissions.progress,
   241	        [missionId]: Math.min(mission.goal, currentProgress + amount),
   242	      },
   243	    },
   244	  }
   245	}
   246	
   247	export function claimDailyMission(state: EngineState, missionId: DailyMissionId, date: Date): EngineState {
   248	  const current = syncDailyMissions(state, date)
   249	  const mission = getDailyMissionDefinition(missionId)
   250	  const status = getDailyMissionStatus(current, mission, date)
   251	  if (!status.claimable) {
   252	    return current
   253	  }
   254	  return {
   255	    ...current,
   256	    manaCrystals: current.manaCrystals + mission.rewardManaCrystals,
   257	    dailyMissions: {
   258	      ...current.dailyMissions,
   259	      claimed: [...current.dailyMissions.claimed, missionId],
   260	    },

hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '330,430p' src/ui/engineStorage.ts | nl -ba -v330" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
   330	  if (value["kind"] === "golden") {
   331	    return typeof value["remainingMs"] === "number"
   332	  }
   333	  if (value["kind"] === "trial") {
   334	    return typeof value["step"] === "number"
   335	  }
   336	  return false
   337	}
   338	
   339	function isBattleSnapshot(value: unknown): boolean {
   340	  return (
   341	    isRecord(value) &&
   342	    typeof value["stage"] === "number" &&
   343	    typeof value["wave"] === "number" &&
   344	    typeof value["stageHp"] === "number" &&
   345	    isNumberArray(value["enemiesHp"], null) &&
   346	    typeof value["bossElapsedMs"] === "number" &&
   347	    typeof value["frostSlowMs"] === "number"
   348	  )
   349	}
   350	
   351	function isPetState(value: unknown): boolean {
   352	  return (
   353	    isRecord(value) &&
   354	    typeof value["level"] === "number" &&
   355	    typeof value["xp"] === "number" &&
   356	    typeof value["evolution"] === "number"
   357	  )
   358	}
   359	
   360	function isMineState(value: unknown): boolean {
   361	  return isRecord(value) && typeof value["floor"] === "number" && (value["lastClaimAt"] === null || typeof value["lastClaimAt"] === "number")
   362	}
   363	
   364	function isDailyMissionState(value: unknown): boolean {
   365	  return isRecord(value) && typeof value["date"] === "string" && isNumberRecord(value["progress"]) && isStringArray(value["claimed"])
   366	}
   367	
   368	function isSkinState(value: unknown): boolean {
   369	  return isRecord(value) && isStringArray(value["owned"]) && (value["equipped"] === null || typeof value["equipped"] === "string")
   370	}
   371	
   372	function isSkills(value: unknown): boolean {
   373	  return (
   374	    isRecord(value) &&
   375	    typeof value["summonBonus"] === "number" &&
   376	    typeof value["castSpeed"] === "number" &&
   377	    typeof value["goldGain"] === "number" &&
   378	    typeof value["critChance"] === "number"
   379	  )
   380	}
   381	
   382	function isEquippedArray(value: unknown): boolean {
   383	  return Array.isArray(value) && value.length === 6 && value.every((item) => item === null || isSpellbook(item))
   384	}
   385	
   386	function isSpellbookArray(value: unknown): boolean {
   387	  return Array.isArray(value) && value.every(isSpellbook)
   388	}
   389	
   390	function isNumberArray(value: unknown, length: number | null): boolean {
   391	  return Array.isArray(value) && (length === null || value.length === length) && value.every((item) => typeof item === "number")
   392	}
   393	
   394	function isStringArray(value: unknown): boolean {
   395	  return Array.isArray(value) && value.every((item) => typeof item === "string")
   396	}
   397	
   398	function isNullableStringArray(value: unknown, length: number): boolean {
   399	  return Array.isArray(value) && value.length === length && value.every((item) => item === null || typeof item === "string")
   400	}
   401	
   402	function isNumberRecord(value: unknown): boolean {
   403	  return isRecord(value) && Object.values(value).every((item) => typeof item === "number")
   404	}
   405	
   406	function isStringRecord(value: unknown): boolean {
   407	  return isRecord(value) && Object.values(value).every((item) => typeof item === "string")
   408	}
   409	
   410	function isSpellbook(value: unknown): value is Spellbook {
   411	  return isRecord(value) && typeof value["id"] === "string" && typeof value["level"] === "number" && isElement(value["element"])
   412	}
   413	
   414	function isElement(value: unknown): value is Spellbook["element"] {
   415	  return value === "fire" || value === "frost" || value === "holy"
   416	}
   417	
   418	function isRecord(value: unknown): value is Record<string, unknown> {
   419	  return typeof value === "object" && value !== null && !Array.isArray(value)
   420	}

2026-07-04T07:02:40.233260Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:02:40.238119Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
codex
밸런스 시뮬은 현재 특성을 자동으로 `elementalCycle → pyroGlyphs → quickHands` 순서로 찍습니다. R5 설계에는 이 정책도 유파 선택으로 치환해야 하며, 이 부분이 첫 벽/첫 환생 회귀의 가장 큰 테스트 표면입니다.
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '280,465p' src/engine/camp.ts | nl -ba -v280" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
   280	export function hasDailyMissionClaim(state: EngineState, date: Date): boolean {
   281	  const current = syncDailyMissions(state, date)
   282	  return DAILY_MISSIONS.some((mission) => getDailyMissionStatus(current, mission).claimable)
   283	}
   284	
   285	export function getUnlockedSkins(state: EngineState): readonly SkinDefinition[] {
   286	  return SKINS.filter((skin) => isSkinUnlocked(state, skin.id))
   287	}
   288	
   289	export function equipSkin(state: EngineState, skinId: string): EngineState {
   290	  const unlocked = getUnlockedSkins(state).some((skin) => skin.id === skinId)
   291	  if (!unlocked) {
   292	    return { ...state, skins: normalizeSkinState(state.skins, state) }
   293	  }
   294	  return {
   295	    ...state,
   296	    skins: {
   297	      owned: mergeOwnedSkins(normalizeSkinState(state.skins, state).owned, skinId),
   298	      equipped: skinId,
   299	    },
   300	  }
   301	}
   302	
   303	export function normalizeSkinState(skins: SkinState, state: EngineState): SkinState {
   304	  const unlockedIds = getUnlockedSkinsFromCounters(state)
   305	  const owned = mergeOwnedSkins(skins.owned.length === 0 ? DEFAULT_SKIN_STATE.owned : skins.owned, ...unlockedIds)
   306	  const equipped = skins.equipped !== null && owned.includes(skins.equipped) ? skins.equipped : DEFAULT_SKIN_STATE.equipped
   307	  return { owned, equipped }
   308	}
   309	
   310	export function getEquippedSkin(state: EngineState): SkinDefinition {
   311	  const normalized = normalizeSkinState(state.skins, state)
   312	  return SKINS.find((skin) => skin.id === normalized.equipped) ?? APPRENTICE_SKIN
   313	}
   314	
   315	export function incrementAchievementCounter(state: EngineState, counter: string, amount: number): EngineState {
   316	  if (amount <= 0) {
   317	    return state
   318	  }
   319	  const current = state.achievements.counters[counter] ?? 0
   320	  return {
   321	    ...state,
   322	    achievements: {
   323	      ...state.achievements,
   324	      counters: {
   325	        ...state.achievements.counters,
   326	        [counter]: current + amount,
   327	      },
   328	    },
   329	  }
   330	}
   331	
   332	export function setAchievementCounterMax(state: EngineState, counter: string, value: number): EngineState {
   333	  const current = state.achievements.counters[counter] ?? 0
   334	  if (current >= value) {
   335	    return state
   336	  }
   337	  return {
   338	    ...state,
   339	    achievements: {
   340	      ...state.achievements,
   341	      counters: {
   342	        ...state.achievements.counters,
   343	        [counter]: value,
   344	      },
   345	    },
   346	  }
   347	}
   348	
   349	function getExpectedBookDamage(state: EngineState, level: number, slotTier: number, element: Element): number {
   350	  const critChance = Math.min(1, BASE_CRIT_CHANCE + CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel))
   351	  const expectedCritFactor = 1 + critChance * (CRIT_DAMAGE_MULTIPLIER + getEquippedRelicEffects(state.relics).critDamageBonus - 1)
   352	  const bossElementMultiplier = element === "holy" && state.wave === BOSS_WAVE ? getHolyBossMultiplier(state) : 1
   353	  const codexTiers = state.codex.tiers[element] ?? 0
   354	  return DMG_BASE *
   355	    DMG_GROWTH ** level *
   356	    getSlotMultiplierForTier(slotTier) *
   357	    getManaDamageMultiplier(state) *
   358	    getElementDamageMultiplier(element, state.relics) *
   359	    getCodexBonusMultiplier(state, element) *
   360	    (1 + getTraitCodexBonusPerTier(state) * codexTiers) *
   361	    getTraitElementDamageMultiplier(state, element) *
   362	    getTomeMilestoneDamageMultiplier(state.highestLevelEver) *
   363	    bossElementMultiplier *
   364	    expectedCritFactor
   365	}
   366	
   367	function getManaDamageMultiplier(state: EngineState): number {
   368	  return 1 + MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals
   369	}
   370	
   371	function getCastIntervalMs(state: EngineState): number {
   372	  const baseInterval = BASE_CAST_INTERVAL_MS - CAST_SPEED_REDUCTION_MS * state.skills.castSpeed
   373	  const relicInterval = baseInterval * getEquippedRelicEffects(state.relics).castIntervalMultiplier * getWizardCastIntervalMultiplier(state.wizardLevel)
   374	  return applyTraitCastInterval(state, Math.max(MIN_CAST_INTERVAL_MS, relicInterval))
   375	}
   376	
   377	function getSlotMultiplierForTier(slotTier: number): number {
   378	  return 1 + SLOT_MULTIPLIER_PER_TIER * slotTier
   379	}
   380	
   381	export function getPetXpThreshold(level: number): number {
   382	  return WIZARD_XP_PER_LEVEL * level
   383	}
   384	
   385	function getMineRatePerHour(floor: number): number {
   386	  return MINE_FLOOR_RATES_PER_HOUR[Math.max(0, floor - 1)] ?? MINE_FLOOR_ONE_RATE
   387	}
   388	
   389	export function getMinePetMultiplier(pet: PetState): number {
   390	  // A level-1 familiar adds nothing, so the base rate stays under the R1 balance
   391	  // ceiling; the bonus grows as the familiar levels up and evolves.
   392	  return 1 + Math.max(0, pet.level - 1) * MINE_PET_LEVEL_BONUS + pet.evolution * MINE_PET_EVOLUTION_BONUS
   393	}
   394	
   395	function getLocalDateKey(date: Date): string {
   396	  const year = date.getFullYear().toString().padStart(4, "0")
   397	  const month = (date.getMonth() + 1).toString().padStart(2, "0")
   398	  const day = date.getDate().toString().padStart(2, "0")
   399	  return `${year}-${month}-${day}`
   400	}
   401	
   402	function getDailyMissionDefinition(id: DailyMissionId): DailyMissionDefinition {
   403	  switch (id) {
   404	    case "merge20":
   405	      return DAILY_MISSION_MERGE20
   406	    case "boss3":
   407	      return DAILY_MISSION_BOSS3
   408	    case "summon30":
   409	      return DAILY_MISSION_SUMMON30
   410	    case "mineClaim1":
   411	      return DAILY_MISSION_MINE_CLAIM1
   412	    case "stage3":
   413	      return DAILY_MISSION_STAGE3
   414	  }
   415	}
   416	
   417	function isSkinUnlocked(state: EngineState, skinId: SkinId): boolean {
   418	  switch (skinId) {
   419	    case "apprentice":
   420	      return true
   421	    case "ember":
   422	      return (state.achievements.counters["bossKills"] ?? 0) >= 25
   423	    case "frost":
   424	      return state.prestigeCount >= 3
   425	    case "gilded":
   426	      return getAchievementMilestoneCount(state) >= 15
   427	  }
   428	}
   429	
   430	function getUnlockedSkinsFromCounters(state: EngineState): readonly SkinId[] {
   431	  return getUnlockedSkins(state).map((skin) => skin.id)
   432	}
   433	
   434	function getAchievementMilestoneCount(state: EngineState): number {
   435	  const explicit = state.achievements.counters["achievementMilestones"]
   436	  if (explicit !== undefined) {
   437	    return explicit
   438	  }
   439	
   440	  const bestStage = Math.max(state.stage, state.achievements.counters["bestStage"] ?? 0)
   441	  if (Object.keys(state.achievements.counters).length === 0 && bestStage >= 50 && state.prestigeCount >= 3) {
   442	    return 15
   443	  }
   444	
   445	  return getThresholdCount(bestStage, [5, 10, 15, 20, 25, 30, 40, 50]) +
   446	    getThresholdCount(state.prestigeCount, [1, 2, 3]) +
   447	    getThresholdCount(state.achievements.counters["bossKills"] ?? 0, [1, 3, 10, 25]) +
   448	    getThresholdCount(state.achievements.counters["mergesTotal"] ?? 0, [1, 20, 100]) +
   449	    getThresholdCount(state.achievements.counters["summonsTotal"] ?? 0, [1, 30, 100])
   450	}
   451	
   452	function getThresholdCount(value: number, thresholds: readonly number[]): number {
   453	  return thresholds.filter((threshold) => value >= threshold).length
   454	}
   455	
   456	function mergeOwnedSkins(owned: readonly string[], ...skinIds: readonly string[]): readonly string[] {
   457	  const merged = new Set<string>(owned)
   458	  for (const skinId of skinIds) {
   459	    merged.add(skinId)
   460	  }
   461	  return [...merged]
   462	}

2026-07-04T07:02:48.150728Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:02:48.155437Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
codex
현재 정본 문서의 기준 곡선은 R1 결과로 `첫 벽 10m / 첫 환생 34m / Day-7 book 86<100`입니다. 설계안에서는 이 값을 회귀 기준으로 삼고, 유파 효과는 기존 특성·공명 수치의 “발동 위치”만 옮기는 방식으로 잡겠습니다.
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse
exec
/bin/zsh -lc "sed -n '1,160p' package.json" in /Users/ahndohun/projects/merge-mage-redesign
 succeeded in 0ms:
{
  "name": "merge-mage",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run"
  },
  "dependencies": {
    "@fontsource/silkscreen": "^5.2.8",
    "@fontsource/vt323": "^5.2.7",
    "@hono/node-server": "^1.19.14",
    "@neondatabase/serverless": "^0.10.4",
    "hono": "4.12.27",
    "phaser": "4.2.0",
    "react": "19.2.7",
    "react-dom": "19.2.7",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@types/react": "19.2.17",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "6.0.3",
    "galmuri": "^2.40.3",
    "happy-dom": "^20.10.6",
    "tsx": "^4.22.4",
    "typescript": "6.0.3",
    "vite": "8.1.0",
    "vitest": "4.1.9"
  }
}

hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "simulate|balance|Day|7" package.json src test docs' in /Users/ahndohun/projects/merge-mage-redesign
 exited 2 in 0ms:
rg: test: No such file or directory (os error 2)
package.json:7:    "dev": "vite --host 127.0.0.1",
package.json:9:    "preview": "vite preview --host 127.0.0.1",
package.json:14:    "@fontsource/vt323": "^5.2.7",
package.json:17:    "hono": "4.12.27",
package.json:19:    "react": "19.2.7",
package.json:20:    "react-dom": "19.2.7",
package.json:24:    "@types/react": "19.2.17",
docs/specs/2026-07-04-redesign-tracks.md:3:디렉터 승인: 2026-07-04. 제안서 정본: https://claude.ai/code/artifact/9cafc25b-c6ae-4f06-bcd1-8c2fbae9707f
docs/specs/2026-07-04-redesign-tracks.md:28:- 시뮬 재검증: `src/engine/simulate.ts`로 첫 벽 8~12분, 첫 환생 25~35분, 7일 클리어 불가 유지 확인. 결과 수치를 보고에 포함.
docs/specs/2026-07-04-redesign-tracks.md:35:  - rifts: 최고 스테이지 7+
docs/specs/2026-07-04-redesign-tracks.md:47:- 시뮬 곡선 수치 보고 (첫 벽/첫 환생/Day-7).
docs/specs/2026-07-04-redesign-tracks.md:50:**R1 결과 (2026-07-04, 오케스트레이터 검수 완료)**: 커밋 49dfc2c. 테스트 174 그린·빌드 그린 재확인. 곡선: 첫 벽 10m / 첫 환생 34m / Day-7 book 86<100. 프리뷰 실측: fresh 첫 화면 탭 1개(BOOKS)·빨간점 0·HUD MANA 제거·균열 배지 숨김. 랭킹 탭은 rebirth 언락에 편승(스테이지 10+) — R3에서 HUD 아이콘으로 이동 예정.
docs/specs/2026-07-04-redesign-tracks.md:79:**R3 결과 (2026-07-04, 오케스트레이터 검수 완료)**: 탭 6→5(마법서/마법사/여정/캠프/환생). 랭킹은 탭에서 빠져 HUD 트로피 버튼→모달(rebirth 언락 시 등장). 웨이브 정보는 캔버스 상시 배너에서 HUD "STAGE X · W Y/10"로 통합(BattleBanner는 이벤트 연출 전용). 데스크톱 3열(좌 여정 요약·중 캔버스·우 마법서). 테스트 179 그린·빌드 그린. 프리뷰 실측(모바일 375+데스크톱 1280): 5탭·마법사(스킬+특성+공명+도감)·여정(퀘스트+일일미션)·랭킹 모달·데미지 숫자 정상, 캔버스 겹침 없음.
docs/specs/2026-07-04-redesign-tracks.md:93:- rifts 언락(`highestStage≥7`) 순간: 포탈 **등장 연출**(스케일-업/페이드/펄스 1회) + 토스트. 언락 폭포의 "전투 화면에 처음 누를 것이 생김"을 실현. 최초 1회만 등장 연출, 이후 상시 표시.
docs/specs/2026-07-04-redesign-tracks.md:105:- 데스크톱(1280)·모바일(375) 렌더: 포탈이 전장 영역에 위치, HUD·탭바·여정 스트립과 겹침·클리핑 없음.
src/engine/relics.ts:161:    castIntervalMultiplier *= relicId === "quickeningHourglass" ? Math.max(0.7, 1 - 0.03 * level) : 1
src/engine/relics.ts:167:    slotUpgradeCostMultiplier *= relicId === "craftsmanChisel" ? Math.max(0.75, 1 - 0.025 * level) : 1
docs/specs/2026-07-02-merge-mage-design.md:3:> TestSprite Hackathon S3 Track A 출품작. 마감 2026-07-07 4:59PM PDT.
docs/specs/2026-07-02-merge-mage-design.md:40:│  │  └─ simulate.ts    # 밸런스 시뮬레이터 (n시간 플레이 곡선 검증)
docs/specs/2026-07-02-merge-mage-design.md:56:## 4. 일정 (2026-07-02 저녁 착수)
docs/specs/2026-07-02-merge-mage-design.md:57:- 7/2 밤: 스펙(본 문서), 에셋 확보+아트디렉션, 스캐폴드, 첫 배포, TestSprite 온보딩
docs/specs/2026-07-02-merge-mage-design.md:58:- 7/3: 이코노미 엔진 + 머지 그리드 + 전투 (루프 가동)
docs/specs/2026-07-02-merge-mage-design.md:59:- 7/4: 상점·스킬 + 게임필(이펙트/사운드) 1차
docs/specs/2026-07-02-merge-mage-design.md:60:- 7/5: 환생 + 오프라인 + 리더보드 + CI 게이트
docs/specs/2026-07-02-merge-mage-design.md:61:- 7/6: 밸런싱(시뮬레이터) + 폴리시 + LOOP.md 정리 + X 중간 공유
docs/specs/2026-07-02-merge-mage-design.md:62:- 7/7: 버퍼 + 구글폼 제출 + Discord 공개
docs/specs/2026-07-02-merge-mage-design.md:67:## 밸런스 v2 (2026-07-03, 시뮬 검증)
docs/specs/2026-07-02-merge-mage-design.md:69:장르 근거: 비용 지수 > 생산(선형+멀티) 시소, 첫 벽 15~60분, 첫 환생 Day 1 (Pecorella/Kongregate).
docs/specs/2026-07-02-merge-mage-design.md:80:그리디 봇 시뮬 (`npx tsx src/engine/simulate.ts --minutes N [--row-minutes M]`):
docs/specs/2026-07-02-merge-mage-design.md:82:v1 기준선은 st47@60분로 가속 폭주 — 벽 부재.
src/engine/simulate.test.ts:2:import { formatSimulation, formatSimulationSummary, runBalanceSimulation } from "./simulate.js"
src/engine/simulate.test.ts:4:describe("balance simulator", () => {
src/engine/simulate.test.ts:21:  it("keeps Day 1 progress in the requested stage band", () => {
src/engine/simulate.test.ts:28:    // Then: Day 1 is slower than v2 and remains within the target band.
src/engine/simulate.test.ts:77:    // Then: the experiment changes simulated progress without touching shared constants.
docs/specs/2026-07-03-grand-update-v3.md:3:> 2026-07-03 디렉터 지시: "시시하고 성장곡선이 가파르다. 콘텐츠가 부족하다. 대대적 개선."
docs/specs/2026-07-03-grand-update-v3.md:5:> 마감 제약: Track A 제출 7/7 4:59PM PDT. 매 웨이브 = 배포 + TestSprite 루프 (LOOP.md 서사 = 심사 40점).
docs/specs/2026-07-03-grand-update-v3.md:25:4. **언락 폭포**: 2분 퀘스트 → 3분 보스 게이트 → 7분 두 번째 성장축 → 30분 도감. "어제와 다른 목표".
docs/specs/2026-07-03-grand-update-v3.md:28:7. **아트디렉션 준수**: docs/ART-DIRECTION.md 팔레트·픽셀 규칙. 신규 UI 전부 나인슬라이스+비트맵 폰트.
docs/specs/2026-07-03-grand-update-v3.md:30:## 2. Wave A — 전투 연출 대개편 "Orbiting Grimoires" (7/3 밤)
docs/specs/2026-07-03-grand-update-v3.md:50:## 3. Wave B — 조작감·UX 개편 "Hands & Signals" (7/4)
docs/specs/2026-07-03-grand-update-v3.md:59:- 머지: 두 카드 중심 흡착(120ms) → 히트스톱(60ms) → 결과 scale 0.4→1.2→1.0 (Back.Out) → 원소색 파티클 12~20개 + 카메라 쉐이크 70ms/0.002 (10레벨 승급 머지는 120ms/0.004 + 사운드 피치 업).
docs/specs/2026-07-03-grand-update-v3.md:70:## 4. Wave C — 밸런스 v3 "Bumpy Ascent" + Day-7 곡선 (7/4~5)
docs/specs/2026-07-03-grand-update-v3.md:72:> 2026-07-03 디렉터 추가 지시: "최소 일주일 플레이해도 클리어 못할 볼륨." → Wave C의 목표를 "세션 리듬"에서 **"Day 7 지속 곡선"**으로 격상. idle의 볼륨은 물량이 아니라 곡선 수학×언락 폭포×반복 이유로 만든다.
docs/specs/2026-07-03-grand-update-v3.md:76:### C0. Day-7 목표 곡선 (시뮬로 강제 검증)
docs/specs/2026-07-03-grand-update-v3.md:82:| Day 1 | st25~30, 티어3 톰, 특성 2개 | 일일 던전 루프 정착 |
docs/specs/2026-07-03-grand-update-v3.md:83:| Day 3 | st50대, 유물 세트 절반 | 강벽: 유물/특성 조합 최적화 필요 |
docs/specs/2026-07-03-grand-update-v3.md:84:| Day 7 | st80~100 (티어 캡 Lv100 미달성) | **클리어 불가 상태 유지** |
docs/specs/2026-07-03-grand-update-v3.md:86:### 밸런스 v3 최종 상수 및 시뮬 검증 (Wave C, 2026-07-03)
docs/specs/2026-07-03-grand-update-v3.md:90:| SUMMON_COST_GROWTH | 1.32 | 1.34 | 골드 보상 1.30 대비 비용 우위 확대. Day-7 Lv100 미달성 보장 |
docs/specs/2026-07-03-grand-update-v3.md:91:| HP_GROWTH | 1.38 | 1.43 | 마일스톤 ×2, 펫, 특성, 유물 반영 후 Day-1 st35~50으로 감속 |
docs/specs/2026-07-03-grand-update-v3.md:95:| BOSS_EXPECTED_DPS_GROWTH | - | 1.49 | Day-1 이후 벽 강도를 키워 장기 폭주 차단 |
docs/specs/2026-07-03-grand-update-v3.md:98:| PRESTIGE_CRYSTALS | floor(stage^1.5/10) | floor((stage-8)^1.7/6) | st14부터 3크리스탈. 첫 환생 적기 25~35분 |
docs/specs/2026-07-03-grand-update-v3.md:104:`pnpm exec tsx src/engine/simulate.ts --minutes 60 --row-minutes 5`
docs/specs/2026-07-03-grand-update-v3.md:108:     5 |     6 |            7 |    4 |            1 |  0.0 | -
docs/specs/2026-07-03-grand-update-v3.md:109:    10 |     7 |            8 |   19 |            1 | 999.9 | -
docs/specs/2026-07-03-grand-update-v3.md:113:    30 |    11 |           11 |   72 |            3 |  0.0 | -
docs/specs/2026-07-03-grand-update-v3.md:117:    50 |    10 |           10 |   67 |            2 |  0.0 | STALL
docs/specs/2026-07-03-grand-update-v3.md:122:`pnpm exec tsx src/engine/simulate.ts --minutes 1440 --summary`
docs/specs/2026-07-03-grand-update-v3.md:132:final: stage 45, wave 10, highest book 43, gold 74708, mana 4
docs/specs/2026-07-03-grand-update-v3.md:135:`pnpm exec tsx src/engine/simulate.ts --minutes 10080 --summary`
docs/specs/2026-07-03-grand-update-v3.md:145:stage 60: 1737m
docs/specs/2026-07-03-grand-update-v3.md:146:stage 70: 3695m
docs/specs/2026-07-03-grand-update-v3.md:153:- wall_strength가 Day가 갈수록 완만히 상승하는 곡선을 시뮬레이터(장시간 모드)로 검증.
docs/specs/2026-07-03-grand-update-v3.md:165:- 해금 스테이지 10 유지하되 **크리스탈 공식을 `floor((stage-8)^1.7/6)`로** — 첫 환생 적기가 st14~16(≈25~35분)에 오도록. 환생 패널에 "지금 환생 시 +X% (권장: +50%↑)" 게이지.
docs/specs/2026-07-03-grand-update-v3.md:168:## 5. Wave D — 콘텐츠 확장 + 캐릭터 특화 (7/5~7/6)
docs/specs/2026-07-03-grand-update-v3.md:186:- 메인 퀘스트 20 → **30개** (Day 1~7 구간까지: "환생 3회", "유물 5종", "st50" 등 장기 목표 포함).
docs/specs/2026-07-03-grand-update-v3.md:189:## 5.5 Wave E — 장기 축 신설 "Relics & Rifts" (7/6) ← 디렉터 볼륨 지시로 부활
docs/specs/2026-07-03-grand-update-v3.md:195:- **효과**: 환생이 "초기화 비용"에서 "수집 기회"로 바뀜 — Day 2~7의 핵심 반복 루프 (ISM 아티팩트 문법).
docs/specs/2026-07-03-grand-update-v3.md:204:> 2026-07-03 디렉터: "제외시키지 마라. 에이전트 기준으로 일정을 짜라." 일정 산정을 인간 공수에서 **병렬 위임 기준**으로 전환. 컷 기준은 시간이 아니라 품질 게이트(전 스위트 그린 + 검수 통과)다.
docs/specs/2026-07-03-grand-update-v3.md:219:## 5.7 Wave G — 주인공 아이덴티티 교체 (2026-07-03 디렉터 지시)
docs/specs/2026-07-03-grand-update-v3.md:222:- 무료 에셋 물색 결과 컨셉 일치 없음 (0x72=역시 노인, Purple Mage=노인/치비, Pointy Hat=톤 미달 판정, Evil Wizard 3=다크 완성형) → **agent-sprite-forge(codex $generate2dsprite)로 생성**. 스타일 레퍼런스 유도 + 크로마키/프레임 정렬 자동 파이프라인. 시안 승인 → idle/hit/death 세트 (cast는 궤도 구체가 대체해 불필요).
docs/specs/2026-07-03-grand-update-v3.md:225:## 5.8 Wave H — 반응형 레이아웃 (2026-07-03 디렉터 지시)
docs/specs/2026-07-03-grand-update-v3.md:231:- 어떤 기능도 선제 컷하지 않는다. 단 **7/6 저녁 통합 게이트(전 스위트 그린+시뮬 곡선+검수)를 통과 못한 기능은 main에서 feature flag off**로 출고 보류 — 심사 기간 라이브 안정성이 우선.
docs/specs/2026-07-03-grand-update-v3.md:240:| 배치 1 (7/3 밤) | A 전투연출(game/scenes+engine이벤트) ∥ B UX(ui/) ∥ C 밸런스(engine/constants+simulate) | 머지 → 테스트·빌드·시뮬 곡선 → 배포 → TestSprite → 디렉터 대리 검수 |
docs/specs/2026-07-03-grand-update-v3.md:241:| 배치 2 (7/4) | 엔진 스키마 v3 선행(1에이전트) → D 퀘스트·도감·특화 ∥ E 유물·던전 ∥ F 펫·광산·스킨·일일미션 (기능별 병렬) | 동일 게이트 + BE 세이브 v3 + FE 신규 플랜 |
docs/specs/2026-07-03-grand-update-v3.md:242:| 배치 3 (7/5) | 통합 폴리시 ∥ 밸런스 재시뮬(전 시스템 반영 Day-7 곡선) ∥ FE/BE 플랜 전면 갱신 | 전 스위트 그린 + 디렉터 최종 검수 |
docs/specs/2026-07-03-grand-update-v3.md:243:| 7/6~7 | 버퍼(재작업 여유) + LOOP.md 정리 + 제출(plans/002) | 최종 스냅샷 |
docs/specs/2026-07-03-grand-update-v3.md:247:- 리스크: 7/6 저녁까지 전 스위트 그린 미달 시 D3 특성(②)을 컷하고 공명(①)만 출고.
docs/specs/2026-07-03-grand-update-v3.md:249:## 7. 승인 요청 사항
docs/ART-DIRECTION.md:5:## 팔레트 (0x72 GrafxKid 계열 기준)
docs/ART-DIRECTION.md:6:- 배경 최암부 `#100e14`, UI 배경 `#1a1721`, 패널 `#241e2e`, 패널 프레임 `#4a3f63` / 하이라이트 `#73648c`
docs/ART-DIRECTION.md:9:- 원소: fire `#e25822` / frost `#6ecbff` / holy `#ffd873`
docs/ART-DIRECTION.md:12:- 히어로: `wizard-pack/Wizard Pack/` — Idle(6f), Attack1(8f)=시전, Hit(4f), Death(7f). 좌측 배치, 우향.
docs/ART-DIRECTION.md:29:- 0x72 DungeonTileset II — 0x72, CC0
src/engine/rng.ts:7:const MULBERRY_INCREMENT = 0x6d2b79f5
src/engine/rng.ts:28:  value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
src/engine/rng.ts:31:    value: ((value ^ (value >>> 14)) >>> 0) / 4294967296,
src/engine/engine.test.ts:9:    const highestLevel = 7
src/engine/camp.test.ts:2:import { simulateTicks } from "./battle.js"
src/engine/camp.test.ts:41:      ...createInitialState(7),
src/engine/camp.test.ts:51:    const result = simulateTicks(state, 10)
src/engine/camp.test.ts:122:    const nextDay = syncDailyMissions(secondClaim, new Date(2026, 6, 4, 0, 1))
src/engine/camp.test.ts:131:    expect(nextDay.dailyMissions.date).toBe("2026-07-04")
src/engine/camp.test.ts:132:    expect(nextDay.dailyMissions.progress).toEqual({})
src/engine/camp.test.ts:133:    expect(nextDay.dailyMissions.claimed).toEqual([])
src/engine/quests.ts:26:  { gold: 720, skillPoints: 1 },
src/engine/quests.ts:30:  { gold: 1_700, skillPoints: 1 },
src/engine/quests.ts:46:  chain("chain-07", 7, chainRewards[6], (state) => getTotalSkillPoints(state) >= 1),
src/engine/quests.ts:47:  chain("chain-08", 8, chainRewards[7], (state) => state.traits.picks["lv8"] !== undefined),
src/engine/quests.ts:56:  chain("chain-17", 17, chainRewards[16], (state) => (state.achievements.counters["bossKills"] ?? 0) >= 25),
src/engine/quests.ts:57:  chain("chain-18", 18, chainRewards[17], (state) => state.stage >= 25),
src/engine/quests.ts:62:  long("long-stage-75", { gold: 18_000, skillPoints: 3 }, (state) => state.stage >= 75),
src/engine/state.test.ts:32:    // Derived, not pinned: balance tuning changes HP_GROWTH on purpose.
src/engine/progression.test.ts:4:import { bookDamage, simulateTicks } from "./battle.js"
src/engine/progression.test.ts:37:    const battled = simulateTicks({
src/engine/progression.test.ts:71:      ...createInitialState(7),
src/engine/achievements.ts:16:  highestLevelEver: [10, 20, 40, 70, 100],
src/engine/achievements.ts:17:  stagesReached: [10, 25, 50, 75, 100],
src/engine/actions.test.ts:200:      books: [book("inventory", 7, "fire")],
src/engine/actions.test.ts:277:    expect(next.highestLevelEver).toBe(7)
src/engine/actions.test.ts:325:      books: [book("a", 7, "fire")],
src/engine/actions.test.ts:327:      highestLevelEver: 7,
src/engine/actions.test.ts:336:      riftRuns: { date: "2026-07-03", golden: 1, trial: 0 },
src/engine/actions.test.ts:422:      wave: 7,
src/engine/actions.test.ts:427:    const active = enterRift(state, "golden", "2026-07-03")
src/engine/actions.test.ts:430:    expect(active.riftRuns).toEqual({ date: "2026-07-03", golden: 1, trial: 0 })
src/engine/actions.test.ts:433:    expect(exited.wave).toBe(7)
src/engine/actions.test.ts:439:    const state = { ...createInitialState(1), riftRuns: { date: "2026-07-03", golden: 2, trial: 0 } }
src/engine/actions.test.ts:441:    expect(() => enterRift(state, "golden", "2026-07-03")).toThrow(RiftEntryError)
src/engine/actions.test.ts:442:    expect(enterRift(state, "golden", "2026-07-04").riftRuns).toEqual({ date: "2026-07-04", golden: 1, trial: 0 })
src/engine/camp.ts:20:} from "./balance.js"
src/engine/camp.ts:66:// a rebirth's yield (R1 balance rule: <=5% of first-rebirth crystals per hour).
src/engine/camp.ts:85:const EMBER_SKIN: SkinDefinition = { id: "ember", tint: 0xff7a3c }
src/engine/camp.ts:87:const GILDED_SKIN: SkinDefinition = { id: "gilded", tint: 0xffd873 }
src/engine/camp.ts:390:  // A level-1 familiar adds nothing, so the base rate stays under the R1 balance
src/engine/constants.ts:22:// Wave C: regular waves use 6-9 visible mobs, while balance helpers keep
src/engine/constants.ts:59:// First useful rebirth should appear around st14-16: floor((stage-8)^1.7/6).
src/engine/constants.ts:61:export const PRESTIGE_CRYSTAL_EXPONENT = 1.7
src/engine/constants.ts:73:export const TRIAL_RIFT_BOSS_MULTIPLIERS = [0.8, 1, 1.3, 1.7, 2.2] as const
src/engine/simulate.ts:185:    state = simulateTicksForBalance(state, ticksThisStep, config).state
src/engine/simulate.ts:516:function simulateTicksForBalance(state: EngineState, nTicks: number, config: SimulationConfig): TickResult {
src/engine/simulate.ts:734:  if (state.stage < 7) {
src/engine/simulate.ts:1110:  return entry !== undefined && (entry.endsWith("simulate.ts") || entry.endsWith("simulate.js"))
src/engine/state.ts:11:import { getBossHp, getRegularMobCount } from "./balance.js"
src/engine/actions.ts:41:import { getPrestigeCrystalReward } from "./balance.js"
src/engine/battle.ts:17:import { getBossRequiredDps, getTomeMilestoneDamageMultiplier, getWizardCastIntervalMultiplier, getWizardCritChanceBonus } from "./balance.js"
src/engine/battle.ts:66:export function simulateTicks(state: EngineState, nTicks: number): TickSimulation {
src/engine/battleRewards.ts:14:import { getRegularMobCount, getWizardGoldMultiplier } from "./balance.js"
src/engine/unlocks.test.ts:23:    const rifts = { ...journey, highestStage: 7 } satisfies EngineState
src/game/phaser-conventions.test.ts:10: * Guards the Phaser scale conventions. The 2026-07-04 audit found the desktop
src/game/PixelGlyphs.test.ts:4:const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const
src/engine/unlocks.ts:21:    rifts: state.highestStage >= 7,
src/game/TextureKeys.ts:8:  holy: 0xffd873,
src/game/TextureKeys.ts:15:  arcane: 0xa875ff,
src/game/TextureKeys.ts:32:  death: 7,
src/game/TextureKeys.ts:37:  death: [1, 2, 3, 4, 5, 6, 7, 8],
src/game/TextureKeys.ts:39:const VFX_PROJECTILE_FRAMES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
src/game/TextureKeys.ts:40:const VFX_EXPLOSION_FRAMES = [1, 2, 3, 4, 5, 6, 7] as const
src/game/TextureKeys.ts:42:const FLOOR_TILES = ["floor_1", "floor_2", "floor_3", "floor_4", "floor_5", "floor_6", "floor_7", "floor_8"] as const
src/game/TextureKeys.ts:217:  createActorAnimation(scene, AnimationKeys.familiar.idle, TextureKeys.mob, "imp", "idle", 7, -1)
src/game/PixelGlyphs.ts:10:  "7",
src/game/PixelGlyphs.ts:58:  "7": ["1111", "0001", "0010", "0100", "0100"],
src/engine/battle.test.ts:3:import { getBossFactor, getBossHp, getPrestigeCrystalReward } from "./balance.js"
src/engine/battle.test.ts:4:import { bookDamage, simulateTicks } from "./battle.js"
src/engine/battle.test.ts:36:    const result = simulateTicks(state, 300)
src/engine/battle.test.ts:53:      ...createInitialState(7),
src/engine/battle.test.ts:59:    const result = simulateTicks(state, 10)
src/engine/battle.test.ts:69:    const result = simulateTicks(state, 60)
src/engine/battle.test.ts:91:    const result = simulateTicks(state, 10)
src/engine/battle.test.ts:117:    const frost = simulateTicks(
src/engine/battle.test.ts:157:    const baseCasts = simulateTicks(base, 29).events.filter((event) => event.type === "cast")
src/engine/battle.test.ts:158:    const fastCasts = simulateTicks(fast, 29).events.filter((event) => event.type === "cast")
src/engine/battle.test.ts:159:    const baseGoldResult = simulateTicks(baseGold, 10)
src/engine/battle.test.ts:160:    const goldResult = simulateTicks(gold, 10)
src/engine/battle.test.ts:187:    const active = { ...enterRift(state, "golden", "2026-07-03"), enemiesHp: [1], stageHp: 1 }
src/engine/battle.test.ts:189:    const normal = simulateTicks(state, 10)
src/engine/battle.test.ts:190:    const rift = simulateTicks(active, 10)
src/styles.css:73:  background: #1a1721;
src/styles.css:76:    4px 4px 0 #08070a;
src/styles.css:117:    2px 0 #08070a,
src/styles.css:118:    0 2px #08070a,
src/styles.css:119:    2px 2px #08070a;
src/styles.css:132:@media (min-width: 768px) {
src/styles.css:212:    width: calc(100vw - 474px);
src/game/scenes/BattleJuiceEffects.ts:55:    flash.setPosition(point.x + 3, point.y - 1).setTint(CastColors[element]).setAlpha(0.75).setScale(0.6).setVisible(true)
src/game/scenes/BattleJuiceEffects.ts:100:    const targetX = target === undefined ? BattleLayout.hudCoinTargetX + index * 7 : target.x + index * 3
src/main.tsx:6:import "@fontsource/silkscreen/700.css"
src/game/scenes/BattleLoadingView.ts:9:const BAR_Y = 174
src/game/scenes/BattleLoadingView.ts:35:    this.track.fillStyle(0x1a1721, 1)
src/game/scenes/PixelText.ts:148:    const tint = request.critical ? 0xfff06a : 0xf7f7ff
src/game/scenes/PixelText.ts:166:      duration: request.critical ? 720 : 560,
src/game/scenes/BattleWizardView.ts:20:      .setOrigin(0.46, 0.78)
src/game/scenes/BattleWizardView.ts:87:    this.setTint(CastColors[element], Phaser.TintModes.ADD, 70)
src/game/scenes/BattleFrame.ts:22:  graphics.fillRect(14, 76, BattleLayout.width - 28, BattleLayout.viewportHeight - 90)
src/game/scenes/BattleFrame.ts:25:  graphics.lineStyle(2, 0x73648c, 0.55)
src/game/scenes/BattleFrame.ts:35:    scene.add.image(x, 14, topKey).setOrigin(0, 0).setScale(TILE_SCALE).setTint(WALL_TINT).setAlpha(0.78).setDepth(1)
src/game/scenes/BattleMobView.ts:23:  chort: { idle: 9, run: 7 },
src/game/scenes/BattleMobView.ts:26:  orc_warrior: { idle: 9, run: 7 },
src/game/scenes/BattleMobView.ts:60:    this.sprite = scene.add.sprite(0, 0, TextureKeys.mob("imp", "idle", 0)).setOrigin(0.5, 0.75)
src/game/scenes/BattleMobView.ts:62:    this.hpFill = makePixel(scene, 0x49e071, 1, 22, 0)
src/game/scenes/BattleMobView.ts:235:  // is that top edge (origin.y = 0.75 means the sprite's anchor point sits
src/game/scenes/BattleMobView.ts:236:  // 75% down the frame, so the visible top is that many px above it); we
src/game/scenes/BattleLayout.test.ts:18:      displayHeight: 72,
src/game/scenes/BattleLayout.test.ts:20:      originY: 0.78,
src/game/scenes/BattleLayout.test.ts:30:      originY: 0.75,
src/game/scenes/BattleLayout.test.ts:36:      originY: 0.75,
src/game/scenes/BattleLayout.test.ts:46:    const staffTip = { x: 103, y: 171 }
src/game/scenes/BattleLayout.test.ts:52:    const staffTip = { x: 103, y: 171 }
src/game/scenes/BattleLayout.test.ts:74:    expect(getWaveIndicator(7)).toEqual({ text: "W 7/10", tint: 0xfff0a8 })
src/game/scenes/BattleEffects.ts:28:const PROJECTILE_SPEED_PER_SECOND = 760
src/game/scenes/BattleEffects.ts:54:        speed: { min: 22, max: 72 },
src/game/scenes/BattleEffects.ts:213:    this.scene.time.delayedCall(75, () => {
src/game/scenes/OrbitingTomesView.ts:28:  punchScale: 1.7,
src/game/scenes/OrbitingTomesView.ts:94:      duration: 75,
src/ui/useActionFeedback.ts:53:  "juice-area-shake": 70,
src/ui/useActionFeedback.ts:78:  holy: "#ffd873",
src/ui/i18n.ts:501:  "chain-07": { title: "Spend the Spark", description: "Earn or spend a skill point." },
src/ui/i18n.ts:511:  "chain-17": { title: "Boss Ledger", description: "Defeat 25 bosses." },
src/ui/i18n.ts:517:  "long-stage-75": { title: "Oath: Stage 75", description: "Climb to stage 75." },
src/ui/i18n.ts:534:  "chain-07": { title: "불씨 사용", description: "스킬 포인트를 얻거나 사용하세요." },
src/ui/i18n.ts:544:  "chain-17": { title: "보스 장부", description: "보스 25마리를 처치하세요." },
src/ui/i18n.ts:550:  "long-stage-75": { title: "맹세: 스테이지 75", description: "스테이지 75에 도달하세요." },
src/ui/useBadges.ts:2:import { getPrestigeCrystalReward } from "../engine/balance"
src/game/scenes/BattleScreenEffects.ts:13:      .setDepth(78)
src/game/scenes/BattleScreenEffects.ts:41:    const alpha = active ? 0.045 + Math.sin(this.scene.time.now / 78) * 0.025 : 0
src/game/scenes/BattleScreenEffects.ts:54:  const top = makeImage(scene, 57).setOrigin(0, 0).setTint(tint).setDisplaySize(BattleLayout.width, 42)
src/game/scenes/BattleScreenEffects.ts:55:  const bottom = makeImage(scene, 57)
src/game/scenes/BattleScreenEffects.ts:60:  const left = makeImage(scene, 57).setOrigin(0, 0).setTint(tint).setDisplaySize(20, BattleLayout.viewportHeight)
src/game/scenes/BattleScreenEffects.ts:61:  const right = makeImage(scene, 57)
src/ui/engineStorage.ts:169:  return Math.floor(Math.random() * 2_147_483_647) + 1
src/ui/RebirthPanel.tsx:2:import { getPrestigeCrystalReward } from "../engine/balance"
src/game/scenes/BattleLayout.ts:13:  castX: 78,
src/game/scenes/BattleLayout.ts:16:  mobMinX: 178,
src/game/scenes/BattleLayout.ts:21:  bannerY: 70,
src/game/scenes/BattleLayout.ts:27:  slowAlpha: 0.78,
src/game/scenes/BattleLayout.ts:32:const LANES = [174, 210, 246, 282, 318] as const
src/game/scenes/BattleLayout.ts:157:  let value = Math.imul(left + 31, 73856093) ^ Math.imul(middle + 17, 19349663) ^ Math.imul(right + 13, 83492791)
src/game/UtilityTextures.ts:54:const DAMAGE_DIGITS = "0123456789"
src/ui/useEngineEffects.ts:2:import { simulateTicks } from "../engine/battle"
src/ui/useEngineEffects.ts:44:          simulate: simulateTicks,
src/game/scenes/BattleFamiliarView.ts:11:  tints: [0x7fd6ff, 0xa875ff, 0xb7f3ff],
src/server/api.test.ts:22:        ...createInitialState(7),
src/server/api.test.ts:35:      ...createInitialState(7),
src/server/api.test.ts:62:      ...createInitialState(7),
src/server/api.test.ts:66:      riftRuns: { date: "2026-07-03", golden: 1, trial: 2 },
src/server/api.test.ts:76:    expect(parsed.riftRuns).toEqual({ date: "2026-07-03", golden: 1, trial: 2 })
src/server/api.test.ts:83:      ...createInitialState(7),
src/server/api.test.ts:91:    expect(parsed.manaCrystals).toBe(7)
src/server/api.test.ts:99:      state: createInitialState(7),
src/server/api.test.ts:109:        state: { ...createInitialState(7), gold },
src/server/api.test.ts:120:        state: { ...createInitialState(7), stage },
src/server/api.test.ts:131:      state: { ...createInitialState(7), books: tooManyBooks },
src/server/api.test.ts:135:      state: { ...createInitialState(7), books: [book("book-1", 0)] },
src/ui/engineDriver.test.ts:12:function simulate(state: TestState, ticks: number): FixedStepSimulation<TestState, TestEvent> {
src/ui/engineDriver.test.ts:26:      simulate,
src/ui/engineDriver.test.ts:39:      simulate,
src/ui/engineDriver.test.ts:51:      elapsedMs: 79,
src/ui/engineDriver.test.ts:53:      simulate,
src/ui/RiftsOverlay.test.tsx:103:      const state = enterRift(createInitialState(1), "golden", "2026-07-04")
src/ui/RiftsOverlay.test.tsx:228:      const state = enterRift(createInitialState(1), "trial", "2026-07-04")
src/ui/engineDriver.ts:11:  readonly simulate: (state: State, ticks: number) => FixedStepSimulation<State, Event>
src/ui/engineDriver.ts:36:  const simulated = input.simulate(input.state, ticks)
src/ui/engineDriver.ts:39:    state: simulated.state,
src/ui/engineDriver.ts:41:    events: simulated.events,
src/ui/engineStorage.test.ts:42:    const state = createInitialState(7)
src/ui/engineStorage.test.ts:50:    expect(parsed.state.rngSeed).toBe(7)
src/ui/engineStorage.test.ts:122:      ...createInitialState(17),
src/ui/bookInteractions.test.ts:80:    expect(shouldActivateDrag(7)).toBe(false)
src/ui/overlay.css:3:  --mm-ui-bg: #1a1721;
src/ui/overlay.css:6:  --mm-panel-hi: #73648c;
src/ui/overlay.css:13:  --mm-holy: #ffd873;
src/ui/overlay.css:14:  --mm-good: #79c86a;
src/ui/overlay.css:15:  --mm-shadow: #08070a;
src/ui/overlay.css:57:  grid-template-columns: 0.78fr 1.05fr 0.78fr 1fr 92px;
src/ui/overlay.css:157:  opacity: 0.72;
src/ui/overlay.css:437:/* >=768px: room for the full 10-column x 3-row grid without collapsing. */
src/ui/overlay.css:438:@media (min-width: 768px) {
src/ui/overlay.css:486:  padding: 5px 7px;
src/ui/overlay.css:567:  min-width: 17px;
src/ui/overlay.css:586:  opacity: 0.7;
src/ui/overlay.css:647:  color: #6f657c;
src/ui/overlay.css:800:    filter: brightness(1.7);
src/ui/overlay.css:807:  opacity: 0.72;
src/ui/overlay.css:834:  width: 7px;
src/ui/overlay.css:835:  height: 7px;
src/ui/overlay.css:931:  opacity: 0.75;
src/ui/overlay.css:1076:  top: 278px;
src/ui/overlay.css:1080:  width: 72px;
src/ui/overlay.css:1097:    inset 0 0 0 7px var(--mm-gold),
src/ui/overlay.css:1124:    inset 0 0 0 7px var(--mm-panel-edge),
src/ui/overlay.css:1133:/* Plays once, the instant rifts unlocks (highestStage >= 7) — the wave map's
src/ui/overlay.css:1232:  padding: 7px;
src/ui/overlay.css:1315:  padding: 7px;
src/ui/overlay.css:1556:    transform: translate(-50%, -70%) scale(0.9);
src/ui/overlay.css:1857:  min-width: 17px;
src/ui/overlay.css:1894:  min-width: 17px;
src/ui/overlay.css:1944:  border-left: 7px solid var(--mm-gold);
src/ui/overlay.css:2082:  font-size: 7px;
src/ui/overlay.css:2172:  height: 7px;
src/ui/overlay.css:2266:  font-size: 7px;
src/ui/overlay.css:2381:    opacity: 0.72;
src/ui/overlay.css:2457:  animation: juiceAreaShake 70ms steps(4, end);
src/ui/overlay.css:2474:  75% {
src/ui/overlay.css:2553:@media (min-width: 768px) and (max-width: 1279px) {
src/ui/overlay.css:2603:    grid-template-rows: repeat(3, minmax(74px, 1fr));
src/ui/overlay.css:2671:    padding: 7px 10px;
src/ui/overlay.css:2684:    top: 72px;
src/ui/overlay.css:2692:    padding: 7px;
src/ui/overlay.css:2708:    padding: 7px;
src/ui/overlay.css:2716:    grid-template-rows: repeat(3, minmax(70px, 1fr));
src/ui/overlay.css:2741:    top: 74px;
src/ui/overlay.css:2746:     mobile/tablet bottom-of-zone spot. rifts unlocks at highestStage >= 7,
src/ui/overlay.css:2753:    bottom: 72px;
src/ui/overlay.css:2760:    top: 74px;

2026-07-04T07:02:56.690180Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:02:56.694628Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
  ✓ 지정된 엔진·UI·스펙 파일을 읽고 현재 시스템 경계 파악
  ✓ 공명·특성·전직·스킨 상태 모델과 밸런스 제약 정리
  → 한국어 마크다운 설계안 작성
2026-07-04T07:03:01.908624Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:03:01.914267Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
  ✓ 지정된 엔진·UI·스펙 파일을 읽고 현재 시스템 경계 파악
  ✓ 공명·특성·전직·스킨 상태 모델과 밸런스 제약 정리
  ✓ 한국어 마크다운 설계안 작성
2026-07-04T07:03:09.407895Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt: maximum of 3 prompts is supported path=/Users/ahndohun/.cache/codex-runtimes/codex-primary-runtime/plugins/openai-primary-runtime/plugins/template-creator/.codex-plugin/plugin.json
2026-07-04T07:03:09.413428Z  WARN codex_core_plugins::manifest: ignoring interface.defaultPrompt[0]: prompt must be at most 128 characters path=/Users/ahndohun/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json
codex
**R5 전직·유파 설계안**

전제: 코드는 수정하지 않았고, 지정 파일과 관련 저장/레벨업/스킨 정의만 읽었다. 현재 핵심은 [resonance.ts](/Users/ahndohun/projects/merge-mage-redesign/src/engine/resonance.ts:18)의 장착 원소 카운트 기반 공명, [traits.ts](/Users/ahndohun/projects/merge-mage-redesign/src/engine/traits.ts:4)의 Lv8/16/24 특성 슬롯, [battleRewards.ts](/Users/ahndohun/projects/merge-mage-redesign/src/engine/battleRewards.ts:151)의 XP 레벨업, [actions.ts](/Users/ahndohun/projects/merge-mage-redesign/src/engine/actions.ts:257)의 환생 유지 흐름이다.

**1. 전직 3단계 조건**
전직은 저장 상태로 보관하되, “가능 여부”는 기존 진행값에서 파생한다.

| 단계 | 명칭 | 판정 기준 | 타이밍 | 의미 |
|---|---:|---|---|---|
| 1 | 견습 | `wizardLevel >= 3` | 마법사 탭 언락과 동일 | 스킬 포인트 사용 시작, 기본 스킨 `apprentice` |
| 2 | 정식 | `wizardLevel >= 8 && highestStage >= 7` | 기존 첫 특성 슬롯과 균열 언락 근처 | 유파 1차 선택. 기존 Lv8 특성/공명 입구 흡수 |
| 3 | 대마법사 | `wizardLevel >= 24 && prestigeCount >= 1` | 환생 이후 장기 축 | 유파 완성. 기존 Lv24 특성/후반 자동화 보상 연결 |

보조 게이트:
- Lv16은 별도 전직 단계가 아니라 “유파 심화” 레벨로 둔다. 기존 Lv16 특성 효과가 여기서 열린다.
- 전직 완료 상태는 `state.ascension.rank`로 저장한다. 단, 권한 판정은 항상 `wizardLevel/highestStage/prestigeCount` 기준으로 재검증한다.
- 환생은 현재처럼 `wizardLevel`, `wizardXp`, `skillPoints`, `traits`, `skins`를 유지한다. R5에서는 `ascension`도 유지한다.

**2. 유파 효과**
원칙: 기존 수치를 최대한 보존한다. 공명은 삭제하지 않고 “선택 유파가 해당 원소 장착 조건을 만족할 때 더 강하게 읽히는 파생 효과”로 재배치한다.

공통 구조:
- `school: "fire" | "frost" | "holy" | null`
- 정식 전직 때 1회 선택.
- 환생 후 1회 변경권은 기존 특성 respec 개념을 흡수한다.
- 공명 발동 조건은 기존 `requirement = 3`, 기존 `elementalCycle` 효과는 선택 유파에 한해 `requirement = 2`로 흡수한다.
- 6개 장착 mono 보너스 `scale = 1.5`는 유지한다.

| 유파 | 정식 전직, Lv8 | 심화, Lv16 | 대마법사, Lv24 |
|---|---|---|---|
| 화염 | 선택 유파가 화염이면 화염 공명 요구치 `3 -> 2`. 기존 화염 공명 `targetCap = FIRE_TARGET_CAP + ceil(scale)` 유지 | 기존 `pyroGlyphs`: 화염 피해 `x1.2` | 기존 `quickHands` 일부 흡수: 화염 공명 활성 중 cast interval `x0.9`, 단 `MIN_CAST_INTERVAL_MS` 유지 |
| 냉기 | 냉기 공명 요구치 `3 -> 2`. 기존 냉기 공명 `factor = 0.2 + 0.15*scale`, `durationMs = 2000 + 1000*scale` 유지 | 기존 `deepFreeze`: `factor +0.1`, `durationMs +500` | 기존 `archmageFocus`를 냉기형으로 흡수: 냉기 도감 티어당 해당 냉기 피해 `+1%` |
| 신성 | 신성 공명 요구치 `3 -> 2`. 기존 신성 공명 `bossMultiplier = 2 + 0.5*scale` 유지 | 기존 `sanctifiedAim`: 보스 배율 `+0.25` | 기존 골드형 특성 흡수: 골드 보상 `+25%`, 보스 처치 골드에는 현재 보스 보상식 위에 곱하지 말고 기존 `getTraitGoldMultiplier`와 같은 additive 지점에 합산 |

비유파 특성 흡수:
- `chainCast x0.8`은 너무 크므로 전 유파 공통 보상이 아니라 “대마법사 후 자동합성/자동구매 해금 전의 조작 피로 완화”와 충돌한다. 직접 이전하지 않고 삭제 또는 자동화 보상으로 이동.
- `goldenLibrary +15%`는 신성 Lv16 또는 정식 전직 완료 공통 보상 후보지만, 보존 우선이면 신성에 둔다.
- `treasureOath +25%`는 신성 대마법사.
- `elementalCycle requirement 2`는 선택 유파 전용으로 축소해야 전체 딜 폭주를 막는다.

**3. 스킨 매핑**
현재 스킨은 [camp.ts](/Users/ahndohun/projects/merge-mage-redesign/src/engine/camp.ts:28)에 `apprentice/ember/frost/gilded`가 있고, 잠금은 업적/환생 카운터 기반이다. R5에서는 구매가 아니라 전직 보상으로 바꾼다.

| 스킨 | 새 의미 | 지급 조건 |
|---|---|---|
| `apprentice` | 견습 로브 | 기본 보유 |
| `ember` | 화염 정식 로브 | 정식 전직에서 화염 선택 |
| `frost` | 냉기 정식 로브 | 정식 전직에서 냉기 선택 |
| `gilded` | 신성/대마법사 로브 | 신성 선택 시 정식 지급, 또는 비신성 유파는 대마법사 달성 시 금빛 대마법사 공통 보상 |

권장: 유파별 스킨 3개가 필요하지만 현재는 4개뿐이다. 신규 에셋 없이 보존하려면 `gilded = holy`로 쓰고, 대마법사 공통 보상은 기존 스킨 tint 강화/테두리 연출로 처리한다.

**4. 상태·액션·마이그레이션 변경**
`types.ts`:
- 추가:
```ts
export const ASCENSION_RANKS = ["apprentice", "adept", "archmage"] as const
export type AscensionRank = (typeof ASCENSION_RANKS)[number]
export type WizardSchool = "fire" | "frost" | "holy"

export type AscensionState = {
  readonly rank: AscensionRank
  readonly school: WizardSchool | null
  readonly respecPrestige: number | null
}
```
- `EngineState`에 `readonly ascension: AscensionState` 추가.
- `TraitState`는 즉시 제거하지 말고 v5에서 남겨 마이그레이션 입력으로만 사용한다. 내부 효과 함수는 `ascension`을 읽도록 전환.

액션:
- `promoteWizard(state, rank)` 또는 `claimPromotion(state)` 추가: 조건 충족 시 rank 상승.
- `chooseSchool(state, school)` 추가: 정식 전직 완료 시 1회 선택.
- `respecSchoolAfterPrestige(state, school)` 추가: 기존 `grantTraitRespecAfterPrestige` 역할 대체.
- `prestige()`는 `ascension`을 보존하고, 환생 후 변경권 `respecPrestige = nextPrestigeCount` 부여.
- 기존 `selectTrait`는 UI에서 제거하되, 저장 마이그레이션 이후 내부 호환용으로만 유지하거나 삭제.

`SAVE_VERSION`:
- `SAVE_VERSION 4 -> 5`.
- v4 로드 시 `ascension` 기본값 생성:
  - `wizardLevel >= 24 && prestigeCount >= 1`이면 `rank = "archmage"`
  - 아니면 `wizardLevel >= 8 && highestStage >= 7`이면 `rank = "adept"`
  - 아니면 `rank = "apprentice"`
- 기존 trait picks로 school 추론:
  - `pyroGlyphs` 있으면 fire
  - `deepFreeze` 있으면 frost
  - `sanctifiedAim` 있으면 holy
  - 없으면 `null` 유지. 자동 선택하지 않는다.
- 기존 `elementalCycle`만 있는 세이브는 school을 정하지 말고 “유파 선택 가능” 상태로 둔다.
- 기존 skin owned는 보존하되, 새 전직 조건으로 `normalizeSkinState`가 추가 지급한다.

**5. 마법사 탭 UI 재구성**
현재 [WizardPanel.tsx](/Users/ahndohun/projects/merge-mage-redesign/src/ui/WizardPanel.tsx:55)는 스킬, 특성, 공명, 도감 순서다. R5 이후 구조:

1. 상단: 마법사 레벨, XP, 현재 전직 단계, 유파 배지.
2. “전직” 섹션:
   - 견습/정식/대마법사 3단계 세로 진행.
   - 충족 조건은 `wizardLevel`, `highestStage`, `prestigeCount`로 표시.
   - 가능한 단계는 버튼, 완료 단계는 보상 요약.
3. “유파” 섹션:
   - 정식 전직 전에는 잠김.
   - 정식 전직 가능 시 화염/냉기/신성 3카드 선택.
   - 선택 후에는 현재 유파 효과와 다음 심화 Lv16/Lv24 효과 표시.
4. “스킬” 섹션 유지:
   - 4종 스킬포인트는 유지.
   - 전직/유파와 중복되는 효과 카피는 제거.
5. “공명” 섹션은 독립 시스템처럼 보이지 않게 “현재 유파 공명 상태”로 축소.
6. “도감”은 유지하되, 선택 유파 도감 티어가 유파 효과에 어떻게 붙는지만 강조.

**6. 밸런스 영향·리스크·테스트 충돌 예상**
밸런스 기준:
- 정본 기준선: 첫 벽 10m, 첫 환생 34m, Day-7 highest book 86<100.
- 시뮬의 현재 자동 특성은 `elementalCycle -> pyroGlyphs -> quickHands`다. 이를 화염 유파로 치환하면 화염이 기준선 담당 유파가 된다.

주요 리스크:
- `elementalCycle`을 전 유파/전 원소 requirement 2로 유지하면 공명 발동률이 과해진다. 선택 유파에만 적용해야 한다.
- `chainCast x0.8`와 `quickHands x0.9`를 그대로 누적하면 cast interval이 크게 줄어 Day-1/Day-7이 당겨질 수 있다.
- 신성은 보스 특화라 첫 환생 타이밍을 앞당길 수 있다. `+0.25`는 Lv16 이후로 제한해야 한다.
- 냉기는 slow duration이 직접 DPS는 아니지만 보스 실패/슬로우 이벤트 테스트와 체감 난이도에 영향이 있다.

충돌 예상 테스트:
- `progression.test.ts`, `WizardPanel.test.tsx`: trait 선택 UI/로직 제거로 실패.
- `simulate.test.ts`: greedy trait 정책 변경으로 곡선 수치 변동 가능.
- `battle.test.ts`: frost slow duration, holy boss multiplier, fire target cap 기대값 갱신 필요.
- `camp.test.ts`, `state.test.ts`, `engineStorage.test.ts`: 스킨 잠금 조건과 SAVE_VERSION 5 마이그레이션으로 갱신 필요.
- `server/api.test.ts`: 서버 상태 스키마가 `ascension`을 관대하게 받아야 한다.

최소 수용 기준:
- 화염 유파를 시뮬 기본 선택으로 두고 R1 기준선에서 ±10% 안에 들어야 한다.
- 첫 벽은 8~12분, 첫 환생은 25~35분 유지.
- 10080분 시뮬에서 highest book이 100 미만이어야 한다.
- 자동합성/자동구매는 전직 효과가 아니라 대마법사 이후 보상으로 별도 잠금해제해야 한다.
hook: Stop
hook: Stop Completed
2026-07-04T07:04:02.994751Z  WARN codex_mcp::rmcp_client: failed to initialize MCP client during shutdown: MCP startup failed: No such file or directory (os error 2)
2026-07-04T07:04:02.994778Z  WARN codex_mcp::rmcp_client: failed to initialize MCP client during shutdown: MCP startup failed: handshaking with MCP server failed: Send message error Transport [rmcp::transport::worker::WorkerTransport<rmcp::transport::streamable_http_client::StreamableHttpClientWorker<codex_rmcp_client::http_client_adapter::StreamableHttpClientAdapter>>] error: Client error: HTTP request failed: http/request failed: error sending request for url (http://127.0.0.1:29979/mcp), when send initialize request
2026-07-04T07:04:02.994807Z  WARN codex_mcp::rmcp_client: failed to initialize MCP client during shutdown: MCP startup failed: handshaking with MCP server failed: Send message error Transport [rmcp::transport::worker::WorkerTransport<rmcp::transport::streamable_http_client::StreamableHttpClientWorker<codex_rmcp_client::http_client_adapter::StreamableHttpClientAdapter>>] error: Client error: HTTP request failed: http/request failed: error sending request for url (http://127.0.0.1:6006/mcp), when send initialize request
tokens used
114,646
**R5 전직·유파 설계안**

전제: 코드는 수정하지 않았고, 지정 파일과 관련 저장/레벨업/스킨 정의만 읽었다. 현재 핵심은 [resonance.ts](/Users/ahndohun/projects/merge-mage-redesign/src/engine/resonance.ts:18)의 장착 원소 카운트 기반 공명, [traits.ts](/Users/ahndohun/projects/merge-mage-redesign/src/engine/traits.ts:4)의 Lv8/16/24 특성 슬롯, [battleRewards.ts](/Users/ahndohun/projects/merge-mage-redesign/src/engine/battleRewards.ts:151)의 XP 레벨업, [actions.ts](/Users/ahndohun/projects/merge-mage-redesign/src/engine/actions.ts:257)의 환생 유지 흐름이다.

**1. 전직 3단계 조건**
전직은 저장 상태로 보관하되, “가능 여부”는 기존 진행값에서 파생한다.

| 단계 | 명칭 | 판정 기준 | 타이밍 | 의미 |
|---|---:|---|---|---|
| 1 | 견습 | `wizardLevel >= 3` | 마법사 탭 언락과 동일 | 스킬 포인트 사용 시작, 기본 스킨 `apprentice` |
| 2 | 정식 | `wizardLevel >= 8 && highestStage >= 7` | 기존 첫 특성 슬롯과 균열 언락 근처 | 유파 1차 선택. 기존 Lv8 특성/공명 입구 흡수 |
| 3 | 대마법사 | `wizardLevel >= 24 && prestigeCount >= 1` | 환생 이후 장기 축 | 유파 완성. 기존 Lv24 특성/후반 자동화 보상 연결 |

보조 게이트:
- Lv16은 별도 전직 단계가 아니라 “유파 심화” 레벨로 둔다. 기존 Lv16 특성 효과가 여기서 열린다.
- 전직 완료 상태는 `state.ascension.rank`로 저장한다. 단, 권한 판정은 항상 `wizardLevel/highestStage/prestigeCount` 기준으로 재검증한다.
- 환생은 현재처럼 `wizardLevel`, `wizardXp`, `skillPoints`, `traits`, `skins`를 유지한다. R5에서는 `ascension`도 유지한다.

**2. 유파 효과**
원칙: 기존 수치를 최대한 보존한다. 공명은 삭제하지 않고 “선택 유파가 해당 원소 장착 조건을 만족할 때 더 강하게 읽히는 파생 효과”로 재배치한다.

공통 구조:
- `school: "fire" | "frost" | "holy" | null`
- 정식 전직 때 1회 선택.
- 환생 후 1회 변경권은 기존 특성 respec 개념을 흡수한다.
- 공명 발동 조건은 기존 `requirement = 3`, 기존 `elementalCycle` 효과는 선택 유파에 한해 `requirement = 2`로 흡수한다.
- 6개 장착 mono 보너스 `scale = 1.5`는 유지한다.

| 유파 | 정식 전직, Lv8 | 심화, Lv16 | 대마법사, Lv24 |
|---|---|---|---|
| 화염 | 선택 유파가 화염이면 화염 공명 요구치 `3 -> 2`. 기존 화염 공명 `targetCap = FIRE_TARGET_CAP + ceil(scale)` 유지 | 기존 `pyroGlyphs`: 화염 피해 `x1.2` | 기존 `quickHands` 일부 흡수: 화염 공명 활성 중 cast interval `x0.9`, 단 `MIN_CAST_INTERVAL_MS` 유지 |
| 냉기 | 냉기 공명 요구치 `3 -> 2`. 기존 냉기 공명 `factor = 0.2 + 0.15*scale`, `durationMs = 2000 + 1000*scale` 유지 | 기존 `deepFreeze`: `factor +0.1`, `durationMs +500` | 기존 `archmageFocus`를 냉기형으로 흡수: 냉기 도감 티어당 해당 냉기 피해 `+1%` |
| 신성 | 신성 공명 요구치 `3 -> 2`. 기존 신성 공명 `bossMultiplier = 2 + 0.5*scale` 유지 | 기존 `sanctifiedAim`: 보스 배율 `+0.25` | 기존 골드형 특성 흡수: 골드 보상 `+25%`, 보스 처치 골드에는 현재 보스 보상식 위에 곱하지 말고 기존 `getTraitGoldMultiplier`와 같은 additive 지점에 합산 |

비유파 특성 흡수:
- `chainCast x0.8`은 너무 크므로 전 유파 공통 보상이 아니라 “대마법사 후 자동합성/자동구매 해금 전의 조작 피로 완화”와 충돌한다. 직접 이전하지 않고 삭제 또는 자동화 보상으로 이동.
- `goldenLibrary +15%`는 신성 Lv16 또는 정식 전직 완료 공통 보상 후보지만, 보존 우선이면 신성에 둔다.
- `treasureOath +25%`는 신성 대마법사.
- `elementalCycle requirement 2`는 선택 유파 전용으로 축소해야 전체 딜 폭주를 막는다.

**3. 스킨 매핑**
현재 스킨은 [camp.ts](/Users/ahndohun/projects/merge-mage-redesign/src/engine/camp.ts:28)에 `apprentice/ember/frost/gilded`가 있고, 잠금은 업적/환생 카운터 기반이다. R5에서는 구매가 아니라 전직 보상으로 바꾼다.

| 스킨 | 새 의미 | 지급 조건 |
|---|---|---|
| `apprentice` | 견습 로브 | 기본 보유 |
| `ember` | 화염 정식 로브 | 정식 전직에서 화염 선택 |
| `frost` | 냉기 정식 로브 | 정식 전직에서 냉기 선택 |
| `gilded` | 신성/대마법사 로브 | 신성 선택 시 정식 지급, 또는 비신성 유파는 대마법사 달성 시 금빛 대마법사 공통 보상 |

권장: 유파별 스킨 3개가 필요하지만 현재는 4개뿐이다. 신규 에셋 없이 보존하려면 `gilded = holy`로 쓰고, 대마법사 공통 보상은 기존 스킨 tint 강화/테두리 연출로 처리한다.

**4. 상태·액션·마이그레이션 변경**
`types.ts`:
- 추가:
```ts
export const ASCENSION_RANKS = ["apprentice", "adept", "archmage"] as const
export type AscensionRank = (typeof ASCENSION_RANKS)[number]
export type WizardSchool = "fire" | "frost" | "holy"

export type AscensionState = {
  readonly rank: AscensionRank
  readonly school: WizardSchool | null
  readonly respecPrestige: number | null
}
```
- `EngineState`에 `readonly ascension: AscensionState` 추가.
- `TraitState`는 즉시 제거하지 말고 v5에서 남겨 마이그레이션 입력으로만 사용한다. 내부 효과 함수는 `ascension`을 읽도록 전환.

액션:
- `promoteWizard(state, rank)` 또는 `claimPromotion(state)` 추가: 조건 충족 시 rank 상승.
- `chooseSchool(state, school)` 추가: 정식 전직 완료 시 1회 선택.
- `respecSchoolAfterPrestige(state, school)` 추가: 기존 `grantTraitRespecAfterPrestige` 역할 대체.
- `prestige()`는 `ascension`을 보존하고, 환생 후 변경권 `respecPrestige = nextPrestigeCount` 부여.
- 기존 `selectTrait`는 UI에서 제거하되, 저장 마이그레이션 이후 내부 호환용으로만 유지하거나 삭제.

`SAVE_VERSION`:
- `SAVE_VERSION 4 -> 5`.
- v4 로드 시 `ascension` 기본값 생성:
  - `wizardLevel >= 24 && prestigeCount >= 1`이면 `rank = "archmage"`
  - 아니면 `wizardLevel >= 8 && highestStage >= 7`이면 `rank = "adept"`
  - 아니면 `rank = "apprentice"`
- 기존 trait picks로 school 추론:
  - `pyroGlyphs` 있으면 fire
  - `deepFreeze` 있으면 frost
  - `sanctifiedAim` 있으면 holy
  - 없으면 `null` 유지. 자동 선택하지 않는다.
- 기존 `elementalCycle`만 있는 세이브는 school을 정하지 말고 “유파 선택 가능” 상태로 둔다.
- 기존 skin owned는 보존하되, 새 전직 조건으로 `normalizeSkinState`가 추가 지급한다.

**5. 마법사 탭 UI 재구성**
현재 [WizardPanel.tsx](/Users/ahndohun/projects/merge-mage-redesign/src/ui/WizardPanel.tsx:55)는 스킬, 특성, 공명, 도감 순서다. R5 이후 구조:

1. 상단: 마법사 레벨, XP, 현재 전직 단계, 유파 배지.
2. “전직” 섹션:
   - 견습/정식/대마법사 3단계 세로 진행.
   - 충족 조건은 `wizardLevel`, `highestStage`, `prestigeCount`로 표시.
   - 가능한 단계는 버튼, 완료 단계는 보상 요약.
3. “유파” 섹션:
   - 정식 전직 전에는 잠김.
   - 정식 전직 가능 시 화염/냉기/신성 3카드 선택.
   - 선택 후에는 현재 유파 효과와 다음 심화 Lv16/Lv24 효과 표시.
4. “스킬” 섹션 유지:
   - 4종 스킬포인트는 유지.
   - 전직/유파와 중복되는 효과 카피는 제거.
5. “공명” 섹션은 독립 시스템처럼 보이지 않게 “현재 유파 공명 상태”로 축소.
6. “도감”은 유지하되, 선택 유파 도감 티어가 유파 효과에 어떻게 붙는지만 강조.

**6. 밸런스 영향·리스크·테스트 충돌 예상**
밸런스 기준:
- 정본 기준선: 첫 벽 10m, 첫 환생 34m, Day-7 highest book 86<100.
- 시뮬의 현재 자동 특성은 `elementalCycle -> pyroGlyphs -> quickHands`다. 이를 화염 유파로 치환하면 화염이 기준선 담당 유파가 된다.

주요 리스크:
- `elementalCycle`을 전 유파/전 원소 requirement 2로 유지하면 공명 발동률이 과해진다. 선택 유파에만 적용해야 한다.
- `chainCast x0.8`와 `quickHands x0.9`를 그대로 누적하면 cast interval이 크게 줄어 Day-1/Day-7이 당겨질 수 있다.
- 신성은 보스 특화라 첫 환생 타이밍을 앞당길 수 있다. `+0.25`는 Lv16 이후로 제한해야 한다.
- 냉기는 slow duration이 직접 DPS는 아니지만 보스 실패/슬로우 이벤트 테스트와 체감 난이도에 영향이 있다.

충돌 예상 테스트:
- `progression.test.ts`, `WizardPanel.test.tsx`: trait 선택 UI/로직 제거로 실패.
- `simulate.test.ts`: greedy trait 정책 변경으로 곡선 수치 변동 가능.
- `battle.test.ts`: frost slow duration, holy boss multiplier, fire target cap 기대값 갱신 필요.
- `camp.test.ts`, `state.test.ts`, `engineStorage.test.ts`: 스킨 잠금 조건과 SAVE_VERSION 5 마이그레이션으로 갱신 필요.
- `server/api.test.ts`: 서버 상태 스키마가 `ascension`을 관대하게 받아야 한다.

최소 수용 기준:
- 화염 유파를 시뮬 기본 선택으로 두고 R1 기준선에서 ±10% 안에 들어야 한다.
- 첫 벽은 8~12분, 첫 환생은 25~35분 유지.
- 10080분 시뮬에서 highest book이 100 미만이어야 한다.
- 자동합성/자동구매는 전직 효과가 아니라 대마법사 이후 보상으로 별도 잠금해제해야 한다.
