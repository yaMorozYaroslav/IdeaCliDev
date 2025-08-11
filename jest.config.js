// 📄 jest.config.js
module.exports = {
  testEnvironment: "jsdom",

  testEnvironmentOptions: {
    customExportConditions: ["browser", "development"],
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // SWC transformers (no Babel)
  transform: {
    "^.+\\.(ts|tsx)$": ["@swc/jest", {
      jsc: {
        parser: { syntax: "typescript", tsx: true },
        transform: { react: { runtime: "automatic", development: true } },
        target: "es2022",
      },
      module: { type: "commonjs" },
    }],
    "^.+\\.(js|jsx)$": ["@swc/jest", {
      jsc: {
        parser: { syntax: "ecmascript", jsx: true },
        transform: { react: { runtime: "automatic", development: true } },
        target: "es2022",
      },
      module: { type: "commonjs" },
    }],
  },

  // Transpile styled-components v6 (ESM) inside node_modules
  transformIgnorePatterns: ["/node_modules/(?!(styled-components)/)"],

  moduleNameMapper: {
    "^.+\\.module\\.(css|scss|sass)$": "identity-obj-proxy",
    "^.+\\.(jpg|jpeg|png|svg|gif|webp|avif)$": "<rootDir>/__mocks__/fileMock.js",
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],
};
