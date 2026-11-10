// Compatibility polyfill for Node.js >= 22 (where SlowBuffer was removed)
const buffer = require('buffer');

if (!buffer.SlowBuffer) {
    buffer.SlowBuffer = buffer.Buffer;
}

