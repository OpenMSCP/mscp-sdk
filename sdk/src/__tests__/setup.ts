// Increase timeout for tests that interact with the blockchain
jest.setTimeout(30000);

// Mock console.error to keep test output clean
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("Warning: ReactDOM.render is no longer supported")
  ) {
    return;
  }
  originalError.call(console, ...args);
};
