// Global category mapping for consistent emojis and category handling
export const CATEGORIES = {
  FOOD: 'Food',
  ENTERTAINMENT: 'Entertainment',
  HEALTH: 'Health',
  UTILITIES: 'Utilities',
  TRANSPORT: 'Transport',
  SHOPPING: 'Shopping',
  OTHER: 'Other'
};

export const CATEGORY_EMOJIS = {
  [CATEGORIES.FOOD]: '🍕',
  [CATEGORIES.ENTERTAINMENT]: '🎬',
  [CATEGORIES.HEALTH]: '💪',
  [CATEGORIES.UTILITIES]: '📄',
  [CATEGORIES.TRANSPORT]: '🚗',
  [CATEGORIES.SHOPPING]: '🛍️',
  [CATEGORIES.OTHER]: '📦'
};

export const CATEGORY_COLORS = {
  [CATEGORIES.FOOD]: 'bg-orange-100 dark:bg-orange-900',
  [CATEGORIES.ENTERTAINMENT]: 'bg-purple-100 dark:bg-purple-900',
  [CATEGORIES.HEALTH]: 'bg-green-100 dark:bg-green-900',
  [CATEGORIES.UTILITIES]: 'bg-blue-100 dark:bg-blue-900',
  [CATEGORIES.TRANSPORT]: 'bg-yellow-100 dark:bg-yellow-900',
  [CATEGORIES.SHOPPING]: 'bg-pink-100 dark:bg-pink-900',
  [CATEGORIES.OTHER]: 'bg-gray-100 dark:bg-gray-900'
};

// Function to get emoji for a category
export const getCategoryEmoji = (category) => {
  const normalizedCategory = category?.trim() || '';
  return CATEGORY_EMOJIS[normalizedCategory] || CATEGORY_EMOJIS[CATEGORIES.OTHER];
};

// Function to get color class for a category
export const getCategoryColor = (category) => {
  const normalizedCategory = category?.trim() || '';
  return CATEGORY_COLORS[normalizedCategory] || CATEGORY_COLORS[CATEGORIES.OTHER];
};

// Function to get all available categories
export const getAvailableCategories = () => {
  return Object.values(CATEGORIES);
};

// Function to check if a category is valid
export const isValidCategory = (category) => {
  const normalizedCategory = category?.trim() || '';
  return Object.values(CATEGORIES).includes(normalizedCategory);
}; 