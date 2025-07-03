"use client";

import { useUser } from "@clerk/nextjs";

/**
 * Custom hook to get the current user ID from Clerk
 * @returns Object containing userId, user object, isLoaded, and isSignedIn status
 */
export function useCurrentUser() {
  const { user, isLoaded, isSignedIn } = useUser();

  return {
    userId: user?.id || null,
    user,
    isLoaded,
    isSignedIn,
  };
}

/**
 * Custom hook to get just the user ID
 * @returns The current user's ID or null if not signed in
 */
export function useUserId() {
  const { user } = useUser();

  return user?.id || null;
}

/**
 * Custom hook to check if user is authenticated and get user ID
 * @returns Object with userId and authentication status
 */
export function useAuthenticatedUser() {
  const { user, isLoaded, isSignedIn } = useUser();

  return {
    userId: user?.id || null,
    isAuthenticated: isLoaded && isSignedIn,
    isLoading: !isLoaded,
  };
}
