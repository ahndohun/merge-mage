type NeonParameter = string | number | boolean | null

type NeonQuery = <Row extends Record<string, unknown> = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: readonly NeonParameter[]
) => Promise<readonly Row[]>

declare module "@neondatabase/serverless" {
  export function neon(connectionString: string): NeonQuery
}

declare const process: {
  readonly env: Readonly<Record<string, string | undefined>>
}
