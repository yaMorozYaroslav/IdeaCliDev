import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "./Header";

// Mock getBaseUrl used in handleLogin
jest.mock("/lib/getBaseUrl", () => () => "http://localhost:3000");

// Mock fetch for logout
global.fetch = jest.fn(() => Promise.resolve({ ok: true }));

const setCookie = (cookieValue: string) => {
  Object.defineProperty(document, "cookie", {
    writable: true,
    value: cookieValue,
  });
};

describe("Header component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Prevent error message about failed popup
    window.open = jest.fn(() => ({ postMessage: () => {} } as Window));
  });

  it("renders with anonymous user by default", () => {
    setCookie(""); // No user_data cookie
    render(<Header />);
    expect(screen.getByText("Anonymous")).toBeInTheDocument();
  });

  it("renders with user from props", () => {
    setCookie(""); // Prevent cookie override
    render(<Header user={{ name: "Yaro", picture: "/avatar.png" }} />);
    expect(screen.getByText("Yaro")).toBeInTheDocument();
    expect(screen.getByAltText("Yaro")).toHaveAttribute("src", "/avatar.png");
  });

  it("renders user from cookie", () => {
    const encoded = encodeURIComponent(JSON.stringify({ name: "CookieUser", picture: "/img.png" }));
    setCookie(`user_data=${encoded}`);
    render(<Header />);
    expect(screen.getByText("CookieUser")).toBeInTheDocument();
    expect(screen.getByAltText("CookieUser")).toHaveAttribute("src", "/img.png");
  });

  it("opens Google login popup", () => {
    setCookie(""); // Ensure logged out
    render(<Header />);
    const loginButton = screen.getByRole("button", { name: /login with google/i });
    fireEvent.click(loginButton);
    expect(window.open).toHaveBeenCalled();
  });

  it("logs out and redirects to /", async () => {
    setCookie(""); // Prevent cookie override
    delete window.location;
    window.location = { href: "" } as Location;

    render(<Header user={{ name: "Yaro" }} />);
    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(window.location.href).toBe("/");
    });
  });

  it("toggles menu visibility", () => {
    setCookie(""); // Prevent cookie override
    render(<Header />);
    const menuBtn = screen.getByRole("button", { name: /toggle menu/i });

    fireEvent.click(menuBtn);
    expect(screen.getByText("Search")).toBeInTheDocument();

    fireEvent.click(menuBtn);
    expect(screen.queryByText("Search")).not.toBeInTheDocument();
  });
});
