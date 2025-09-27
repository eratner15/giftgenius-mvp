const sanitizeString = (str, maxLength = 200) => {
  if (typeof str !== 'string') return '';

  return str
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '');
};

const validateNumber = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  if (num < min) return min;
  if (num > max) return max;
  return num;
};

const validateInteger = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = parseInt(value, 10);
  if (isNaN(num)) return null;
  if (num < min) return min;
  if (num > max) return max;
  return num;
};

const validateCategory = (category) => {
  const validCategories = [
    'jewelry',
    'books',
    'tech',
    'home',
    'fashion',
    'sports',
    'toys',
    'beauty',
    'food',
    'art'
  ];

  if (!category) return null;
  const sanitized = sanitizeString(category.toLowerCase(), 50);
  return validCategories.includes(sanitized) ? sanitized : null;
};

const validateGiftQueryParams = (query) => {
  const validated = {};

  if (query.category) {
    const cat = validateCategory(query.category);
    if (cat) validated.category = cat;
  }

  if (query.minPrice !== undefined) {
    const price = validateNumber(query.minPrice, 0, 100000);
    if (price !== null) validated.minPrice = price;
  }

  if (query.maxPrice !== undefined) {
    const price = validateNumber(query.maxPrice, 0, 100000);
    if (price !== null) validated.maxPrice = price;
  }

  if (query.minSuccessRate !== undefined) {
    const rate = validateInteger(query.minSuccessRate, 0, 100);
    if (rate !== null) validated.minSuccessRate = rate;
  }

  if (query.search) {
    validated.search = sanitizeString(query.search, 100);
  }

  if (query.limit !== undefined) {
    validated.limit = validateInteger(query.limit, 1, 100) || 50;
  } else {
    validated.limit = 50;
  }

  if (query.offset !== undefined) {
    validated.offset = validateInteger(query.offset, 0, 10000) || 0;
  } else {
    validated.offset = 0;
  }

  return validated;
};

const validateGiftId = (id) => {
  const sanitized = sanitizeString(id, 50);
  if (/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    return sanitized;
  }
  return null;
};

module.exports = {
  sanitizeString,
  validateNumber,
  validateInteger,
  validateCategory,
  validateGiftQueryParams,
  validateGiftId
};