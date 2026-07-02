export class InvalidJsonError extends Error {
  readonly name = "InvalidJsonError"
}

export class DatabaseConfigError extends Error {
  readonly name = "DatabaseConfigError"
}

export class CorruptSaveError extends Error {
  readonly name = "CorruptSaveError"
}
