/**
 * Deep sanitization middleware against:
 * 1. Cross-Site Scripting (XSS) & bad script injection (<script>, javascript:, inline event handlers)
 * 2. NoSQL Injection (strips keys starting with '$' or containing '.')
 */

function sanitizeString(str) {
    if (typeof str !== 'string') return str;

    // Remove null bytes
    let clean = str.replace(/\0/g, '');

    // Strip HTML script tags & dangerous URI schemes
    clean = clean.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
    clean = clean.replace(/<\s*script[^>]*>/gi, '');
    clean = clean.replace(/javascript\s*:/gi, '');
    clean = clean.replace(/data\s*:\s*text\/html/gi, '');
    clean = clean.replace(/vbscript\s*:/gi, '');

    // Neutralize dangerous inline event handlers like onerror=, onload=, onclick=
    clean = clean.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    clean = clean.replace(/on\w+\s*=\s*[^>\s]+/gi, '');

    return clean;
}

function sanitizeObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return typeof obj === 'string' ? sanitizeString(obj) : obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }

    const sanitized = {};
    for (const key of Object.keys(obj)) {
        // Prevent NoSQL operator injection: reject keys that start with '$' or contain '.'
        if (key.startsWith('$') || key.includes('.')) {
            console.warn(`[Security Alert] Blocked suspicious NoSQL key: "${key}"`);
            continue;
        }

        sanitized[key] = sanitizeObject(obj[key]);
    }

    return sanitized;
}

function sanitizeInput(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }

    if (req.query && typeof req.query === 'object') {
        req.query = sanitizeObject(req.query);
    }

    if (req.params && typeof req.params === 'object') {
        req.params = sanitizeObject(req.params);
    }

    next();
}

module.exports = sanitizeInput;
