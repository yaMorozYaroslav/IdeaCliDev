require("@testing-library/jest-dom");

global.fetch = (..._args) =>
  Promise.resolve({
    ok: true,
    json: async () => ({}),
    text: async () => ""
  });
