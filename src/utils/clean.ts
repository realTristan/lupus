/**
 * Clean a string
 * @param s String to clean
 * @returns {string} Cleaned string
 */
export const clean = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
