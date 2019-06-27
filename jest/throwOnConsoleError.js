const originalConsoleError = console.error;

console.error = (message) => {
    originalConsoleError(message);
    throw new Error(message);
};
