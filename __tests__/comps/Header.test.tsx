// comps/Header.test.tsx
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Header from "./Header";
import Cookies from "js-cookie";

// Use full relative path (no @ alias)
jest.mock("../lib/getBaseUrl", () => () => "http://localhost:3000");

// Mock js-cookie (Header reads counts etc. from this, but NOT display name)
jest.mock("js-cookie", () => {
  const get = jest.fn();
  const set = jest.fn();
  const remove = jest.fn();
  return { __esModule: true, default: { get, set, remove }, get, set, remove };
});

const realLocation = window.location;

beforeEach(() => {
  jest.clearAllMocks();

  // Mock fetch
  // @ts-ignore
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });

  // Prevent popup errors
  // @ts-ignore
  window.open = jest.fn(() => ({ postMessage: () => {} }));

  // Default: no cookie
  (Cookies.get as unknown as jest.Mock).mockReturnValue(undefined);

  // Make window.location writable with mocked methods
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = {
    ...realLocation,
    href: "http://localhost/",
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn()
  };
});

afterAll(() => {
  // @ts-ignore
  window.location = realLocation;
});

describe("Header component", () => {
  it("renders anonymous by default", () => {
    render(<Header />);
    expect(screen.getByText(/anonymous/i)).toBeInTheDocument();
  });

  it("renders user from props", () => {
    render(<Header user={{ name: "Yaro", picture: "/avatar.png" }} />);
    expect(screen.getByText("Yaro")).toBeInTheDocument();
    expect(screen.getByAltText("Yaro")).toHaveAttribute("src", "/avatar.png");
  });

  // Header does not use cookie for display name: it stays Anonymous without props
  it("ignores cookie for display name (stays anonymous when no user prop)", () => {
    (Cookies.get as unknown as jest.Mock).mockImplementation((key: string) =>
      key === "user_data" ? JSON.stringify({ name: "CookieUser", picture: "/img.png" }) : undefined
    );

    render(<Header />);
    expect(screen.getByText(/anonymous/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login with google/i })).toBeInTheDocument();
  });

  it("opens Google login popup", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /login with google/i }));
    expect(window.open).toHaveBeenCalled();
  });

  it("logs out and reloads the page", async () => {
    render(<Header user={{ name: "Yaro" }} />);
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      // Component calls reload rather than assign("/")
      expect(window.location.reload).toHaveBeenCalled();
    });

    // Optional: if your code also assigns "/", this won't fail if it didn't:
    // expect(window.location.assign).toHaveBeenCalledWith("/");
  });

  it("toggles menu visibility", () => {
    render(<Header />);
    const menuBtn = screen.getByRole("button", { name: /toggle menu/i });

    fireEvent.click(menuBtn);
    expect(screen.getByText(/search/i)).toBeInTheDocument();

    fireEvent.click(menuBtn);
    expect(screen.queryByText(/search/i)).not.toBeInTheDocument();
  });
});
