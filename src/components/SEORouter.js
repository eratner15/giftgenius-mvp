import React from 'react';
import SEOLandingPage from './SEOLandingPage';
import { generateSEOUrls } from '../data/seoKeywords';

const SEORouter = () => {
  const currentPath = window.location.pathname.replace(/^\/gifts/, '') || '/';

  // Check if current path matches SEO landing page pattern
  const seoUrls = generateSEOUrls();
  const matchedUrl = seoUrls.find(url => url.url === currentPath);

  if (!matchedUrl) {
    return null; // Not an SEO landing page
  }

  // Parse URL to extract parameters
  const urlParts = currentPath.split('/').filter(Boolean);

  // Extract parameters from URL pattern
  // Format: /gifts/birthday-gifts-for-mom-under-50
  const keyword = matchedUrl.keyword;
  const params = parseKeywordForParams(keyword);

  return (
    <SEOLandingPage
      demographic={params.demographic}
      occasion={params.occasion}
      priceRange={params.priceRange}
      interests={params.interests}
      age={params.age}
    />
  );
};

// Parse keyword to extract structured parameters
const parseKeywordForParams = (keyword) => {
  const params = {
    demographic: 'mom',
    occasion: 'birthday',
    priceRange: 'under-100',
    interests: [],
    age: null
  };

  // Common demographic patterns
  const demographics = ['mom', 'dad', 'wife', 'husband', 'girlfriend', 'boyfriend', 'mother', 'father'];
  const occasions = ['birthday', 'christmas', 'anniversary', 'wedding', 'graduation'];
  const pricePatterns = ['under-\\d+', '\\d+-to-\\d+', 'cheap', 'expensive', 'budget'];

  // Extract demographic
  demographics.forEach(demo => {
    if (keyword.includes(demo)) {
      params.demographic = demo;
    }
  });

  // Extract occasion
  occasions.forEach(occ => {
    if (keyword.includes(occ)) {
      params.occasion = occ;
    }
  });

  // Extract price range
  const priceMatch = keyword.match(/under[- ]?\$?(\d+)/i);
  if (priceMatch) {
    params.priceRange = `under-${priceMatch[1]}`;
  }

  // Extract age if specified
  const ageMatch = keyword.match(/(\d+)\s*year\s*old/i);
  if (ageMatch) {
    params.age = parseInt(ageMatch[1]);
  }

  return params;
};

export default SEORouter;