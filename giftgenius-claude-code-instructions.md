# Claude Code Agent Instructions: GiftGenius MVP Enhancement

## Project Context
You're tasked with transforming the GiftGenius MVP codebase from its current state into a production-ready, performant application. The site currently appears to have significant rendering and functionality issues that need immediate attention.

## Primary Mission
Transform this gift recommendation platform into a robust, user-friendly application that actually helps people find perfect gifts. Focus on reliability, performance, and user experience over adding new features.

## Critical First Steps

### 1. Emergency Triage (Complete First)
- **Diagnose the blank page issue**: Check browser console for errors, verify build configuration, ensure proper deployment settings on Vercel
- **Fix any critical runtime errors** preventing the app from loading
- **Verify all environment variables** are properly configured in Vercel
- **Check API routes** and ensure they're accessible and functioning
- **Test locally** to confirm the app runs before pushing changes

### 2. Codebase Analysis & Cleanup
```
Priority Actions:
1. Run a full dependency audit (npm audit / yarn audit)
2. Update all critical security vulnerabilities
3. Remove unused dependencies and dead code
4. Implement proper error boundaries
5. Add comprehensive error logging
```

### 3. Core Functionality Restoration

#### Frontend Fixes
- **Component Architecture**: Refactor any monolithic components into smaller, reusable pieces
- **State Management**: Implement proper state management (Context API or Zustand if not using Redux)
- **Loading States**: Add skeleton screens and proper loading indicators
- **Error Handling**: Implement user-friendly error messages and fallback UI
- **Responsive Design**: Ensure mobile-first responsive design across all breakpoints

#### Backend/API Improvements
- **API Error Handling**: Wrap all API calls in try-catch blocks with proper error responses
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Data Validation**: Add input validation and sanitization
- **Caching Strategy**: Implement proper caching for gift recommendations
- **Database Optimization**: Add proper indexes and optimize queries if using a database

### 4. Performance Optimization

```javascript
// Example performance checklist
const performanceImprovements = {
  images: "Implement lazy loading and use next/image for optimization",
  bundleSize: "Analyze and reduce bundle size using webpack-bundle-analyzer",
  codeSpitting: "Implement dynamic imports for route-based code splitting",
  fonts: "Use font-display: swap and preload critical fonts",
  animations: "Use CSS transforms instead of position changes",
  memoization: "Add React.memo and useMemo where appropriate"
};
```

### 5. User Experience Enhancements

#### Gift Recommendation Flow
1. **Improve the gift finder interface**:
   - Add intuitive filters (price range, occasion, recipient age/interests)
   - Implement smart search with autocomplete
   - Add gift categories with visual icons
   - Create a wizard-style guided experience

2. **Results Display**:
   - Card-based layout with hover effects
   - Quick view modal for gift details
   - Save to favorites functionality
   - Share gift ideas feature
   - Price tracking/alerts

3. **Personalization**:
   - User profiles to save preferences
   - Gift history tracking
   - Recommendation algorithm improvements
   - Occasion reminders

### 6. Code Quality Standards

#### TypeScript Migration (if not already implemented)
```typescript
// Convert JavaScript files progressively
// Start with type definitions for API responses
interface GiftItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  occasion: string[];
  recipientType: string[];
}

// Add proper typing to all components and functions
```

#### Testing Implementation
```javascript
// Add comprehensive test coverage
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Aim for minimum 70% code coverage
```

### 7. SEO and Accessibility

```html
<!-- Essential Meta Tags -->
- Add proper meta descriptions
- Implement Open Graph tags
- Add structured data for products
- Ensure proper heading hierarchy
- Add alt text to all images
- Implement ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
```

### 8. Security Hardening

```javascript
const securityChecklist = [
  "Implement Content Security Policy headers",
  "Add HTTPS everywhere",
  "Sanitize all user inputs",
  "Implement proper authentication if needed",
  "Use environment variables for sensitive data",
  "Add rate limiting on API endpoints",
  "Implement CAPTCHA for forms",
  "Regular dependency updates"
];
```

### 9. Deployment Optimization

#### Vercel Configuration
```json
{
  "functions": {
    "api/*.js": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 10. Feature Enhancements (After Core Fixes)

#### New Features to Consider
1. **AI-Powered Recommendations**: Integrate with AI APIs for better gift suggestions
2. **Price Comparison**: Pull prices from multiple sources
3. **Gift Wrapping Options**: Partner integrations
4. **Wishlist Creation**: Allow users to create and share wishlists
5. **Social Features**: Gift giving groups, pooled gifts
6. **Budget Tracker**: Help users manage gift-giving budgets
7. **Reminder System**: Birthday and holiday reminders

### 11. Monitoring and Analytics

```javascript
// Implement comprehensive monitoring
- Error tracking with Sentry or LogRocket
- Performance monitoring with Web Vitals
- User analytics with Google Analytics or Plausible
- Custom event tracking for user interactions
- A/B testing framework for optimization
```

## Development Workflow

### Git Commit Standards
```bash
# Use conventional commits
feat: Add gift recommendation algorithm
fix: Resolve blank page issue on production
perf: Optimize image loading
docs: Update README with setup instructions
refactor: Restructure component hierarchy
test: Add unit tests for API endpoints
```

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `hotfix/*` - Emergency fixes

## Success Metrics

Track these KPIs after improvements:
1. **Page Load Time**: < 3 seconds on 3G
2. **Lighthouse Score**: > 90 for all metrics
3. **Error Rate**: < 1% of sessions
4. **User Engagement**: Increase time on site by 50%
5. **Conversion Rate**: Track gift click-throughs
6. **Mobile Usage**: Ensure 100% mobile compatibility

## Execution Strategy: Full Parallel Assault

**Deploy Everything Simultaneously**

This isn't a careful restoration—it's a complete transformation executed in parallel. Every system, every component, every line of code gets attention NOW. Think of yourself as commanding multiple specialized units attacking different fronts of the same battle:

### Strike Teams Assignment

**Team Alpha: Emergency Response**
- Fix the blank page issue while others work on features
- Restore basic functionality without waiting for perfect solutions
- Deploy hotfixes immediately as they're ready

**Team Bravo: Core Systems**
- Rebuild state management alongside UI fixes
- Implement error handling while fixing the errors themselves
- Add logging while debugging existing issues

**Team Charlie: User Experience**
- Design new interfaces while fixing current ones
- Implement gift recommendation improvements immediately
- Add personalization features as core functionality gets restored

**Team Delta: Infrastructure**
- Performance optimization runs concurrent with bug fixes
- Security hardening happens alongside feature development
- Deploy monitoring before, during, and after changes

### Parallel Execution Mindset

```javascript
// Not this:
fixBugs().then(() => addFeatures()).then(() => optimize())

// But this:
Promise.all([
  emergencyFixes(),
  coreRestoration(),
  performanceOptimization(),
  featureEnhancement(),
  securityHardening(),
  testingImplementation()
])
```

Work on multiple files simultaneously. Open 10 terminal tabs if needed. Run builds while writing tests. Deploy fixes while documenting changes. This is controlled chaos with a purpose—complete transformation through parallel execution.

Every improvement ships as soon as it's ready. No waiting for "Phase 2." No "we'll add that later." If you see it needs fixing, you fix it now. If it needs a feature, you build it now. The codebase should be unrecognizable (in the best way) by the time you're done.

## Communication

When making changes:
- Document all major decisions in code comments
- Update the README with any new setup steps
- Create a CHANGELOG.md to track version changes
- Add JSDoc comments to complex functions
- Maintain a known issues list

## Final Notes

Remember: A working MVP is better than a perfect app that doesn't load. Focus on getting the basics right first, then iterate. Every fix should be tested locally and in a staging environment before deploying to production.

Good luck transforming GiftGenius into the go-to platform for gift recommendations! 🎁
