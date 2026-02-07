//Simulate random delivery failures. Centralized logic for maintainability. Mirrors real-world network conditions, making the app more robust and realistic. Useful for testing retry logic and error handling across the app. Forces UI to handle failure states.
export function simulateNetwork<T>(fn: () => T) {
  const shouldFail = Math.random() < 0.1
  if (shouldFail) {
    throw new Error('Simulated network error')
  }
  return fn()
}
