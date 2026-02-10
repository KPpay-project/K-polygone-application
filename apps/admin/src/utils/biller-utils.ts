/**
 * Utility functions for biller logo display
 */

/**
 * Generate initials from a biller name
 * @param name - The biller name (e.g., "ZESCO Limited")
 * @returns The initials (e.g., "ZL")
 */
export const getBillerInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return 'N/A';

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    // If single word, take first two characters
    return words[0].substring(0, 2).toUpperCase();
  }

  // Take first character of first two words
  const first = words[0]?.charAt(0) || '';
  const second = words[1]?.charAt(0) || '';
  return `${first}${second}`.toUpperCase();
};

/**
 * Generate dynamic background and text colors based on biller name
 * @param name - The biller name
 * @returns Object with background and text color classes
 */
export const getBillerColors = (name: string): { bgColor: string; textColor: string } => {
  if (!name || typeof name !== 'string') {
    return { bgColor: 'bg-gray-200', textColor: 'text-gray-600' };
  }

  // Create a simple hash from the name to ensure consistent colors
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Define color combinations that work well together
  const colorCombinations = [
    { bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
    { bgColor: 'bg-green-100', textColor: 'text-green-700' },
    { bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
    { bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
    { bgColor: 'bg-pink-100', textColor: 'text-pink-700' },
    { bgColor: 'bg-indigo-100', textColor: 'text-indigo-700' },
    { bgColor: 'bg-teal-100', textColor: 'text-teal-700' },
    { bgColor: 'bg-red-100', textColor: 'text-red-700' },
    { bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { bgColor: 'bg-cyan-100', textColor: 'text-cyan-700' }
  ];

  // Use hash to select a color combination
  const colorIndex = Math.abs(hash) % colorCombinations.length;
  return colorCombinations[colorIndex];
};

/**
 * Generate a complete biller logo configuration
 * @param name - The biller name
 * @returns Object with initials, background color, and text color
 */
export const getBillerLogoConfig = (name: string) => {
  const initials = getBillerInitials(name);
  const colors = getBillerColors(name);

  return {
    initials,
    ...colors
  };
};
