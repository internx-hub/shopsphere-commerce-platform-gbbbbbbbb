import { render, screen } from "@testing-library/react";
import ProductGrid from "./ProductGrid";

beforeEach(() => {
  global.fetch = jest.fn(
    () =>
      new Promise(() => {}) // Keeps fetch pending
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders skeleton cards during loading state", () => {
  render(<ProductGrid />);

  const skeletonGrid = screen.getByTestId("skeleton-grid");

  expect(skeletonGrid).toBeInTheDocument();

  // Check 6 skeleton cards rendered
  expect(skeletonGrid.children.length).toBe(6);
});