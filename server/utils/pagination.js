/**
 * Utility to parse and strictly clamp pagination parameters.
 * Prevents clients from requesting unbounded limits (e.g., limit=100 or limit=99999).
 *
 * @param {object} input - An object containing page and/or limit (e.g. req.query or req.body)
 * @param {number} defaultLimit - The fallback limit if not provided (default: 10)
 * @param {number} maxLimit - The maximum allowed limit (default: 10)
 * @returns {{ page: number, limit: number, skip: number }}
 */
function parsePagination(input = {}, defaultLimit = 10, maxLimit = 10) {
    const rawPage = parseInt(input.page, 10);
    const rawLimit = parseInt(input.limit, 10);

    const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;

    let limit = !isNaN(rawLimit) && rawLimit > 0 ? rawLimit : defaultLimit;
    if (limit > maxLimit) {
        limit = maxLimit;
    }

    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

/**
 * Escapes special characters for regular expressions to prevent
 * ReDoS (Regular Expression Denial of Service) and regex injection.
 *
 * @param {string} text - User provided search string
 * @param {number} maxLength - Maximum allowed string length (default: 100)
 * @returns {string} Safe escaped string
 */
function sanitizeRegex(text = '', maxLength = 100) {
    if (typeof text !== 'string') {
        return '';
    }
    const truncated = text.trim().slice(0, maxLength);
    return truncated.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = {
    parsePagination,
    sanitizeRegex,
};
