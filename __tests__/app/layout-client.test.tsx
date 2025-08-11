// __tests__/app/layout-client.test.tsx
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";

// --- Mocks ---
jest.mock("../../comps/Header", () => ({ user }: { user: any }) => (
  <div data-testid="header">{user?.name ?? "NoUser"}</div>
));

// Mock Cookies
const cookieStore: Record<string, string> = {};
jest.mock("js-cookie", () => ({
  get: jest.fn((k: string) => cookieStore[k]),
  set: jest.fn((k: string, v: string) => {
    cookieStore[k] = v;
  }),
}));
import Cookies from "js-cookie";

// Silence console noise
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

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

// --- Listener spies + capture registered handlers ---
const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
const docRemoveEventSpy = jest.spyOn(document, "removeEventListener");

// Keep a spy handle we can assert on, but also capture the real callbacks
const realWinAdd = window.addEventListener.bind(window);
const realDocAdd = document.addEventListener.bind(document);

let capturedFocus: (() => void) | null = null;
let capturedVisibility: (() => void) | null = null;

const addEventListenerSpy = jest
  .spyOn(window, "addEventListener")
  .mockImplementation((type: any, handler: any, options?: any) => {
    if (type === "focus" && typeof handler === "function") capturedFocus = handler as () => void;
    return realWinAdd(type, handler, options);
  });

const docAddEventSpy = jest
  .spyOn(document, "addEventListener")
  .mockImplementation((type: any, handler: any, options?: any) => {
    if (type === "visibilitychange" && typeof handler === "function")
      capturedVisibility = handler as () => void;
    return realDocAdd(type, handler, options);
  });

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date());

  (Cookies.get as jest.Mock).mockClear();
  (Cookies.set as jest.Mock).mockClear();
  (sessionStorage.getItem as jest.Mock).mockClear();
  (sessionStorage.setItem as jest.Mock).mockClear();

  capturedFocus = null;
  capturedVisibility = null;

  // default cookie state
  cookieStore["user_data"] = JSON.stringify({ name: "Cookie User" });

  // Default fetch: ok with userData for /api/refresh, ok empty for store-tokens
  // @ts-ignore
  global.fetch = jest.fn(async (input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === "string" ? input : (input as Request).url;
    if (url.includes("/api/refresh")) {
      return {
        ok: true,
        json: async () => ({ userData: { name: "FromRefresh" } }),
      } as any;
    }
    if (url.includes("/api/store-tokens")) {
      expect(init?.method).toBe("POST");
      return { ok: true, json: async () => ({}) } as any;
    }
    return { ok: true, json: async () => ({}) } as any;
  });
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

import LayoutClient from "../../app/layout-client";

const renderUI = (initialUser = { name: "Initial User" }) =>
  render(
    <LayoutClient user={initialUser}>
      <div data-testid="content">Test Content</div>
    </LayoutClient>
  );

// Helper to advance timers
const advance = async (ms: number) => {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
};

// Robust detector for refresh POST regardless of string URL vs Request object
const sawRefreshCall = () =>
  (global.fetch as jest.Mock).mock.calls.some(([req, init]) => {
    const url = typeof req === "string" ? req : req?.url;
    const method = (init && (init as any).method) || (req && (req as any).method);
    return url?.includes("/api/refresh") && method === "POST";
  });

// --- Tests ---
describe("LayoutClient full behavior", () => {
  it("renders Header with cookie-rehydrated user and children after mount", async () => {
    renderUI();

    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());
    expect(screen.getByTestId("content")).toBeInTheDocument();

    // After first refresh, user should be FromRefresh
    await waitFor(() => expect(screen.getByTestId("header")).toHaveTextContent("FromRefresh"));

    // Cookie should be updated with userData
    expect(Cookies.set).toHaveBeenCalledWith(
      "user_data",
      JSON.stringify({ name: "FromRefresh" }),
      { path: "/" }
    );
  });

  it("falls back gracefully when cookie is invalid JSON", async () => {
    cookieStore["user_data"] = "{not-json" as any;

    // Cause refresh to return no userData
    // @ts-ignore
    (global.fetch as jest.Mock).mockImplementation(async (input: RequestInfo) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("/api/refresh")) {
        return { ok: true, json: async () => ({}) } as any; // no userData
      }
      return { ok: true, json: async () => ({}) } as any;
    });

    renderUI({ name: "Initial User" });

    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());
    // Keeps initial user when cookie parse fails and no userData
    expect(screen.getByTestId("header")).toHaveTextContent("Initial User");
    expect(console.warn).toHaveBeenCalled();
  });

  it("handles SET_TOKENS postMessage: posts to /api/store-tokens", async () => {
    renderUI();
    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "SET_TOKENS", accessToken: "a", refreshToken: "r" },
        })
      );
    });

    await waitFor(() => {
      const called = (global.fetch as jest.Mock).mock.calls.some(([req, init]) => {
        const url = typeof req === "string" ? req : req?.url;
        return (
          url === "/api/store-tokens" &&
          init?.method === "POST" &&
          init?.headers?.["Content-Type"] === "application/json" &&
          init?.body === JSON.stringify({ access_token: "a", refresh_token: "r" })
        );
      });
      expect(called).toBe(true);
    });
  });

  it("ignores unrelated or incomplete postMessage payloads", async () => {
    renderUI();
    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());

    act(() => {
      window.dispatchEvent(new MessageEvent("message", { data: { type: "NOPE" } }));
      window.dispatchEvent(
        new MessageEvent("message", { data: { type: "SET_TOKENS", accessToken: "a" } })
      );
      window.dispatchEvent(
        new MessageEvent("message", { data: { type: "SET_TOKENS", refreshToken: "r" } })
      );
    });

    const calls = (global.fetch as jest.Mock).mock.calls.map((c: any[]) => c[0]);
    expect(
      calls.filter((u: string | Request) => {
        const url = typeof u === "string" ? u : u?.url;
        return typeof url === "string" && url.includes("/api/store-tokens");
      }).length
    ).toBe(0);
  });

  it("starts a 14-minute refresh interval and dispatches tokenRefreshed after success", async () => {
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");

    renderUI();
    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());

    // Initial refresh happened
    expect(sawRefreshCall()).toBe(true);

    // Next interval refresh
    (global.fetch as jest.Mock).mockClear();
    await advance(14 * 60 * 1000);
    expect(sawRefreshCall()).toBe(true);

    // tokenRefreshed was fired at least once
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it("logs a warning on refresh failure (ok=false) and does not crash", async () => {
    // @ts-ignore
    (global.fetch as jest.Mock).mockImplementation(async (input: RequestInfo) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("/api/refresh")) {
        return { ok: false, json: async () => ({ message: "bad" }) } as any;
      }
      return { ok: true, json: async () => ({}) } as any;
    });

    renderUI();
    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());
    expect(console.warn).toHaveBeenCalled();
  });

  it("handles refresh network error (catch path)", async () => {
    // @ts-ignore
    (global.fetch as jest.Mock).mockImplementation(async (input: RequestInfo) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("/api/refresh")) throw new Error("boom");
      return { ok: true, json: async () => ({}) } as any;
    });

    renderUI();
    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());
    expect(console.error).toHaveBeenCalled();
  });

  it("triggers refresh on resume after being away >10 min (focus and visibilitychange)", async () => {
    renderUI();
    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());

    // ensure we actually captured the component's handlers
    expect(typeof capturedFocus).toBe("function");
    expect(typeof capturedVisibility).toBe("function");

    // Advance system time by >10 minutes AND set lastActive to 11 minutes ago
    const base = Date.now();
    sessionStorage.setItem("lastActive", String(base - 11 * 60 * 1000));
    jest.setSystemTime(new Date(base + 11 * 60 * 1000));

    // focus path
    (global.fetch as jest.Mock).mockClear();
    await act(async () => {
      capturedFocus!();
    });
    await act(async () => Promise.resolve()); // flush microtasks
    await waitFor(() => expect(sawRefreshCall()).toBe(true));

    // visibilitychange path (ensure visible)
    (global.fetch as jest.Mock).mockClear();
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });
    await act(async () => {
      capturedVisibility!();
    });
    await act(async () => Promise.resolve());
    await waitFor(() => expect(sawRefreshCall()).toBe(true));
  });

  it("updates lastActive on user activity events", async () => {
    renderUI();
    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());

    (sessionStorage.setItem as jest.Mock).mockClear();

    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove"));
      document.dispatchEvent(new KeyboardEvent("keydown"));
      document.dispatchEvent(new MouseEvent("click"));
    });

    expect(sessionStorage.setItem).toHaveBeenCalled();
  });

  it("cleans up interval and listeners on unmount", async () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");

    const { unmount } = renderUI();
    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    // window listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith("focus", expect.any(Function));

    // document listeners
    expect(docRemoveEventSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(docRemoveEventSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(docRemoveEventSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(docRemoveEventSpy).toHaveBeenCalledWith("click", expect.any(Function));
  });

  it("attaches expected listeners on mount", async () => {
    addEventListenerSpy.mockClear();
    docAddEventSpy.mockClear();

    renderUI();
    await waitFor(() => expect(screen.getByTestId("header")).toBeInTheDocument());

    expect(addEventListenerSpy).toHaveBeenCalledWith("focus", expect.any(Function));
    expect(docAddEventSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(docAddEventSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(docAddEventSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(docAddEventSpy).toHaveBeenCalledWith("click", expect.any(Function));
  });
});
