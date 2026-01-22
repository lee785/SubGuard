/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Upstash Redis or similar
 */

const requests = new Map<string, number[]>();

const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute

/**
 * Check if a request should be rate-limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @returns true if request is allowed, false if rate limit exceeded
 */
export function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];

    // Remove old requests outside the time window
    const validRequests = userRequests.filter(time => now - time < WINDOW_MS);

    if (validRequests.length >= MAX_REQUESTS) {
        return false; // Rate limit exceeded
    }

    validRequests.push(now);
    requests.set(identifier, validRequests);

    // Periodic cleanup to prevent memory leaks (1% chance per request)
    if (Math.random() < 0.01) {
        const cutoff = now - WINDOW_MS;
        for (const [key, times] of requests.entries()) {
            const filtered = times.filter(t => t > cutoff);
            if (filtered.length === 0) {
                requests.delete(key);
            } else {
                requests.set(key, filtered);
            }
        }
    }

    return true;
}
