// 📄 jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  // Help Next packages pick browser/dev exports during tests
  testEnvironmentOptions: {
    customExportConditions: ["browser", "development"],
  },

  // Preload (runs before test framework) — used to silence punycode DEP0040
 // setupFiles: ["<rootDir>/jest.preload.js"],

  // After-env setup (jest-dom, fetch mocks, etc.)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },

  // Transpile styled-components v6 (ESM) inside node_modules
  transformIgnorePatterns: ["/node_modules/(?!(styled-components)/)"],

  moduleNameMapper: {
    // Map Node's deprecated builtin to userland to suppress DEP0040
    "^node:punycode$": require.resolve("punycode/"),
    "^punycode$": require.resolve("punycode/"),

    // CSS modules → identity object proxy
    "^.+\\.module\\.(css|scss|sass)$": "identity-obj-proxy",

    // Static assets
    "^.+\\.(jpg|jpeg|png|svg|gif|webp|avif)$": "<rootDir>/__mocks__/fileMock.js",
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],
};
