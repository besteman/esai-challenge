import "@testing-library/jest-dom";

// Mock fetch globally
global.fetch = jest.fn();

// Mock Web APIs for Next.js API routes
global.Request = jest.fn().mockImplementation((input, init) => ({
  json: jest.fn().mockResolvedValue({}),
  text: jest.fn().mockResolvedValue(""),
  url: input || "http://localhost:3000/api/test",
  method: init?.method || "GET",
  headers: new Map(Object.entries(init?.headers || {})),
  ...init,
}));

(global as any).Response = {
  json: jest.fn().mockImplementation((data) => ({
    json: () => Promise.resolve(data),
    status: 200,
  })),
};

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "/major_mentor",
}));

// Mock IntersectionObserver
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

// Mock ResizeObserver
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});
