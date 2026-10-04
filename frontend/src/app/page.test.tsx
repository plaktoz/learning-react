import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Helper to stub fetch
function mockFetch(body: object, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    })
  );
}

describe("Login page", () => {
  beforeEach(() => {
    mockPush.mockClear();
    vi.restoreAllMocks();
  });

  it("renders the sign-in heading and form fields", () => {
    render(<Home />);
    // CardTitle renders as a div, not a heading — match by its exact text content
    expect(screen.getAllByText("Sign in").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows an error when login returns success:false", async () => {
    mockFetch({ success: false, error: "Invalid email or password" }, 401);

    render(<Home />);
    await userEvent.type(screen.getByLabelText("Email"), "bad@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(
        screen.getByText("Invalid email or password")
      ).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows a fallback error when fetch itself throws (server down)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    render(<Home />);
    await userEvent.type(screen.getByLabelText("Email"), "a@b.com");
    await userEvent.type(screen.getByLabelText("Password"), "pass");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(
        screen.getByText(/Could not reach the server/)
      ).toBeInTheDocument();
    });
  });

  it("redirects to the dashboard on successful login", async () => {
    mockFetch({ success: true });

    render(<Home />);
    await userEvent.type(
      screen.getByLabelText("Email"),
      "alex.morgan@example.com"
    );
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/prototype/dashboard");
    });

    // Error message should not be visible after success
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("clears the error when the user starts typing again", async () => {
    mockFetch({ success: false, error: "Invalid email or password" }, 401);

    render(<Home />);
    await userEvent.type(screen.getByLabelText("Email"), "bad@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() =>
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument()
    );

    // Typing should clear the error
    await userEvent.type(screen.getByLabelText("Email"), "x");
    expect(
      screen.queryByText("Invalid email or password")
    ).not.toBeInTheDocument();
  });

  it("disables the Sign in button while loading", async () => {
    // fetch never resolves — simulates in-flight request
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    render(<Home />);
    await userEvent.type(screen.getByLabelText("Email"), "a@b.com");
    await userEvent.type(screen.getByLabelText("Password"), "pass");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Signing in…" })
      ).toBeDisabled();
    });
  });

  it("submits when the user presses Enter in the password field", async () => {
    mockFetch({ success: true });

    render(<Home />);
    await userEvent.type(screen.getByLabelText("Email"), "a@b.com");
    await userEvent.type(screen.getByLabelText("Password"), "pass{Enter}");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/prototype/dashboard");
    });
  });
});
