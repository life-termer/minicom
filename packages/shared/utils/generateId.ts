// Deterministic ID creation. Works without backend. Mirrors real-world UUID usage.
export function generateId() {
  return crypto.randomUUID()
}
