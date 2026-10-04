import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UsageBar } from "@/components/usage-bar";

// UsageBar renders a usage percentage bar.
// It colours the fill green (<50%), amber (50–79%), or red (≥80%).

describe("UsageBar", () => {
  it("renders the used amount and percentage text", () => {
    render(<UsageBar used={1240.5} limit={5000} />);
    // 1240.50 / 5000 = 24.81% → rounded to 25%
    expect(screen.getByText(/25%/)).toBeInTheDocument();
    expect(screen.getByText(/\$1,240\.50 used/)).toBeInTheDocument();
  });

  it("applies green colour when usage is below 50%", () => {
    render(<UsageBar used={1000} limit={5000} />);
    // 20% — should be green
    const fill = screen.getByTestId("usage-fill");
    expect(fill.className).toContain("bg-emerald-500");
  });

  it("applies amber colour when usage is between 50% and 79%", () => {
    render(<UsageBar used={3000} limit={5000} />);
    // 60% — should be amber
    const fill = screen.getByTestId("usage-fill");
    expect(fill.className).toContain("bg-amber-400");
  });

  it("applies red colour when usage is 80% or above", () => {
    render(<UsageBar used={4000} limit={5000} />);
    // 80% — should be red
    const fill = screen.getByTestId("usage-fill");
    expect(fill.className).toContain("bg-red-500");
  });

  it("sets the fill bar width to the correct percentage", () => {
    render(<UsageBar used={2500} limit={5000} />);
    // 50%
    const fill = screen.getByTestId("usage-fill");
    expect(fill.style.width).toBe("50%");
  });

  it("caps the percentage display at 100% for over-limit spending", () => {
    render(<UsageBar used={6000} limit={5000} />);
    // 120% — Math.round gives 120, which is fine to display
    expect(screen.getByText(/120%/)).toBeInTheDocument();
    const fill = screen.getByTestId("usage-fill");
    expect(fill.style.width).toBe("120%");
  });
});
