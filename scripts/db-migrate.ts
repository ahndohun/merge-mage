import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

declare const process: {
  readonly cwd: () => string
  readonly env: Record<string, string | undefined>
  readonly exit: (code?: number) => never
}

type MigrationRow = {
  readonly table_name: string
}

loadEnvLocal()

try {
  const databaseUrl = process.env["DATABASE_URL"]
  if (databaseUrl === undefined || databaseUrl.length === 0) {
    throw new Error("DATABASE_URL is not set")
  }

  const { neon } = await import("@neondatabase/serverless")
  const sql = neon(databaseUrl)

  await sql`
    create table if not exists saves (
      token text primary key,
      state jsonb not null,
      updated_at timestamptz not null default now()
    )
  `
  await sql`
    create table if not exists leaderboard (
      token text primary key,
      nickname text not null,
      best_stage int not null,
      prestige_count int not null default 0,
      updated_at timestamptz not null default now()
    )
  `

  const rows = await sql<MigrationRow>`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('saves', 'leaderboard')
    order by table_name
  `
  const tables = new Set(rows.map((row) => row.table_name))
  if (!tables.has("saves") || !tables.has("leaderboard")) {
    throw new Error("migration did not create required tables")
  }

  console.log("Migration complete: saves and leaderboard tables exist")
} catch (error) {
  if (error instanceof Error) {
    console.error(`Migration failed: ${safeErrorMessage(error)}`)
    process.exit(1)
  }
  throw error
}

function loadEnvLocal(): void {
  const envPath = resolve(process.cwd(), ".env.local")
  if (!existsSync(envPath)) {
    return
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (trimmed.length === 0 || trimmed.startsWith("#")) {
      continue
    }
    const equalsIndex = trimmed.indexOf("=")
    if (equalsIndex <= 0) {
      continue
    }
    const key = trimmed.slice(0, equalsIndex).trim()
    const value = unquote(trimmed.slice(equalsIndex + 1).trim())
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function unquote(value: string): string {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  return value
}

function safeErrorMessage(error: Error): string {
  if (error.message.includes("@neondatabase/serverless")) {
    return "@neondatabase/serverless is not installed"
  }
  return error.message.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted]")
}
