import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PrototypeSwitcher } from "@/components/prototype-switcher";

// PrototypeSwitcher uses next/navigation hooks — mock them.
const mockReplace = vi.fn();
const mockSearchParams = new URLSearchParams("variant=A");

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}));

const VARIANTS = [
  { key: "A", label: "Card grid" },
  { key: "B", label: "Sidebar + detail" },
  { key: "C", label: "Statement strip" },
];

describe("PrototypeSwitcher", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    vi.stubEnv("NODE_ENV", "development");
  });

  it("renders the current variant label", () => {
    render(<PrototypeSwitcher variants={VARIANTS} current="A" />);
    expect(screen.getByText(/A — Card grid/)).toBeInTheDocument();
  });

  it("renders previous and next navigation buttons", () => {
    render(<PrototypeSwitcher variants={VARIANTS} current="B" />);
    expect(screen.getByLabelText("Previous variant")).toBeInTheDocument();
    expect(screen.getByLabelText("Next variant")).toBeInTheDocument();
  });

  it("clicking next navigates to the next variant", () => {
    render(<PrototypeSwitcher variants={VARIANTS} current="A" />);
    fireEvent.click(screen.getByLabelText("Next variant"));
    // Should navigate to variant=B
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("variant=B"));
  });

  it("clicking previous navigates to the previous variant", () => {
    render(<PrototypeSwitcher variants={VARIANTS} current="B" />);
    fireEvent.click(screen.getByLabelText("Previous variant"));
    // Should navigate to variant=A
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("variant=A"));
  });

  it("wraps around from first to last when going previous", () => {
    render(<PrototypeSwitcher variants={VARIANTS} current="A" />);
    fireEvent.click(screen.getByLabelText("Previous variant"));
    // A → prev wraps to C
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("variant=C"));
  });

  it("wraps around from last to first when going next", () => {
    render(<PrototypeSwitcher variants={VARIANTS} current="C" />);
    fireEvent.click(screen.getByLabelText("Next variant"));
    // C → next wraps to A
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("variant=A"));
  });

  it("returns null in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const { container } = render(
      <PrototypeSwitcher variants={VARIANTS} current="A" />
    );
    expect(container.firstChild).toBeNull();
  });
});
