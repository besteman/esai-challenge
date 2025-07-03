import React from "react";

// Mock for Clerk authentication in tests
export const useUser = jest.fn().mockReturnValue({
  user: {
    id: "mock-user-id",
    firstName: "Test",
    lastName: "User",
    emailAddresses: [
      {
        emailAddress: "test@example.com",
        id: "email-id",
        verification: { status: "verified" },
      },
    ],
  },
  isLoaded: true,
  isSignedIn: true,
});

export const useClerk = jest.fn().mockReturnValue({
  signOut: jest.fn(),
  openSignIn: jest.fn(),
});

// Mock React components without JSX
export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export const SignedOut = () => {
  return null;
};

export const UserButton = () => {
  return React.createElement(
    "div",
    { "data-testid": "user-button" },
    "User Button",
  );
};
