import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any value (e.g., search text)
 * @param {any} value - The input value to debounce
 * @param {number} delay - The delay in milliseconds (default: 1000ms)
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timeout if value or delay changes before timeout fires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

