// __tests__/layout-client.test.tsx
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("../comps/Header", () => () => <div data-testid="header">Mock Header</div>);
jest.mock("js-cookie", () => ({
  get: jest.fn(() => JSON.stringify({ name: "Test User" })),
  set: jest.fn()
}));

// silence console output for this suite
const originalConsole = { log: console.log, warn: console.warn, error: console.error };
beforeAll(() => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});
afterAll(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

beforeEach(() => {
  // @ts-ignore
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
});

import LayoutClient from "../app/layout-client";

describe("LayoutClient", () => {
  it("mounts and renders Header and children", async () => {
    render(
      <LayoutClient user={{ name: "Initial User" }}>
        <div>Test Content</div>
      </LayoutClient>
    );

    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
