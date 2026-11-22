const { Redis } = require("@upstash/redis");
const env = require("../config/env");

/**
 * Upstash Redis Client Configuration
 * Uses stateless HTTPS REST requests (Ideal for Vercel Serverless)
 */
let redis = null;

if (env.REDIS.URL && env.REDIS.TOKEN) {
    try {
        redis = new Redis({
            url: env.REDIS.URL,
            token: env.REDIS.TOKEN,
        });
        console.log("[Redis] Upstash Redis client initialized successfully.");
    } catch (err) {
        console.warn("[Redis] Failed to initialize Upstash Redis:", err.message);
        redis = null;
    }
} else {
    console.log("[Redis] Redis credentials not found. Caching will run in bypass mode (Direct DB).");
}

/**
 * Standard Central Cache Keys
 */
const CACHE_KEYS = {
    // Categories
    ALL_CATEGORIES: "categories:all",
    CATEGORY_PAGE_DETAILS: (categoryId) => `category:${categoryId}:page_details`,

    // Courses
    ALL_COURSES: (page, limit) => `courses:page:${page}:limit:${limit}`,
    COURSE_DETAILS: (courseId) => `course:${courseId}:details`,
    INSTRUCTOR_COURSES: (instructorId, page, limit) => `instructor:${instructorId}:courses:p${page}:l${limit}`,

    // Reviews & Ratings
    ALL_REVIEWS: (cursor, limit) => `reviews:cursor:${cursor || "initial"}:limit:${limit}`,
    COURSE_AVG_RATING: (courseId) => `reviews:course:${courseId}:avg`,

    // User & Profile
    USER_PROFILE: (userId) => `user:${userId}:profile`,
    USER_ENROLLED_COURSES: (userId, page, limit) => `user:${userId}:enrolled_courses:p${page || "all"}:l${limit || "all"}`,
    INSTRUCTOR_DASHBOARD: (instructorId) => `instructor:${instructorId}:dashboard`,
};

/**
 * Cache-Aside Helper
 * 
 * 1. Checks Redis for key
 * 2. On Cache Hit -> Returns cached data instantly (~5-15ms)
 * 3. On Cache Miss -> Calls fetchFunction(), writes to Redis with TTL, returns fresh data
 * 4. Fallback: If Redis is down or unconfigured, runs fetchFunction() safely without crashing.
 *
 * @param {string} key - Cache key
 * @param {number} ttlSeconds - Time-To-Live in seconds
 * @param {Function} fetchFunction - Async function returning data from MongoDB
 * @returns {Promise<any>}
 */
async function getOrSetCache(key, ttlSeconds, fetchFunction) {
    if (!redis) {
        return await fetchFunction();
    }

    try {
        const cachedData = await redis.get(key);
        if (cachedData !== null && cachedData !== undefined) {
            return cachedData;
        }

        const freshData = await fetchFunction();
        if (freshData !== null && freshData !== undefined) {
            // Write to Redis with expiration
            await redis.set(key, freshData, { ex: ttlSeconds });
        }
        return freshData;
    } catch (err) {
        console.warn(`[Redis Cache-Aside Warning] Key "${key}" failed: ${err.message}. Falling back to DB.`);
        return await fetchFunction();
    }
}

/**
 * Invalidate a specific cache key
 * @param {string} key
 */
async function invalidateCache(key) {
    if (!redis) return;
    try {
        await redis.del(key);
    } catch (err) {
        console.warn(`[Redis Invalidation Warning] Failed to delete key "${key}":`, err.message);
    }
}

/**
 * Invalidate multiple keys matching a pattern (e.g. "courses:page:*")
 * @param {string} pattern
 */
async function invalidatePattern(pattern) {
    if (!redis) return;
    try {
        const keys = await redis.keys(pattern);
        if (keys && keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (err) {
        console.warn(`[Redis Pattern Invalidation Warning] Pattern "${pattern}" failed:`, err.message);
    }
}

module.exports = {
    redis,
    CACHE_KEYS,
    getOrSetCache,
    invalidateCache,
    invalidatePattern,
};
