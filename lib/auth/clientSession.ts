/**
 * Client-side session utility.
 * Memoizes the /api/profile/me network request to prevent duplicate calls
 * when multiple components (Header, FollowCard, Comments, Metrics) mount.
 */

let clientSessionPromise: Promise<any> | null = null;

export function getClientSession(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (!clientSessionPromise) {
    clientSessionPromise = fetch("/api/profile/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.user) {
          return data.user;
        }
        return null;
      })
      .catch((err) => {
        console.error("[getClientSession] failed:", err);
        return null;
      });
  }

  return clientSessionPromise;
}

/**
 * Resets the memoized session promise.
 * Call this upon logout or login to trigger fresh fetches.
 */
export function resetClientSession() {
  clientSessionPromise = null;
}
