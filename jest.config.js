module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^.+\\.module\\.(css|scss|sass)$": "identity-obj-proxy",
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^/lib/(.*)$": "<rootDir>/lib/$1", // for getBaseUrl
    "^.+\\.(jpg|jpeg|png|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
