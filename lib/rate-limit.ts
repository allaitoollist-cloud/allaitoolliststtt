interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60;  // 60 requests per minute per IP

export function rateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
        store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS };
    }

    entry.count++;

    if (entry.count > MAX_REQUESTS) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
}

// Clean up expired entries every 5 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        store.forEach((val, key) => {
            if (now > val.resetAt) store.delete(key);
        });
    }, 5 * 60_000);
}
