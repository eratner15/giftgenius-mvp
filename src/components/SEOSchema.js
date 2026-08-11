import React from 'react';

const SEOSchema = ({
  pageType = 'product',
  giftData = null,
  categoryData = null,
  breadcrumbs = [],
  faqData = []
}) => {

  const generateProductSchema = (gift) => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": gift.title,
    "description": gift.description,
    "image": gift.image_url,
    "offers": {
      "@type": "Offer",
      "price": gift.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (gift.success_rate / 20) || 4.5,
      "reviewCount": gift.total_reviews || 100
    },
    "review": [
      {
        "@type": "Review",
        "author": "GiftGenius Community",
        "datePublished": new Date().toISOString(),
        "reviewBody": `${gift.success_rate}% success rate among our users`,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": Math.round(gift.success_rate / 20),
          "bestRating": 5
        }
      }
    ]
  });

  const generateCategorySchema = (category) => ({
    "@context": "https://schema.org/",
    "@type": "ItemList",
    "name": `Best ${category.name} Gifts`,
    "description": `Curated collection of the best ${category.name.toLowerCase()} gifts`,
    "numberOfItems": category.itemCount || 50,
    "itemListElement": category.items?.map((item, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": item.title,
      "url": `https://giftgenius-mvp.netlify.app/gift/${item.id}`
    })) || []
  });

  const generateBreadcrumbSchema = (breadcrumbs) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://giftgenius-mvp.netlify.app${crumb.url}`
    }))
  });

  const generateFAQSchema = (faqs) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  });

  const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GiftGenius",
    "url": "https://giftgenius-mvp.netlify.app",
    "logo": "https://giftgenius-mvp.netlify.app/logo.png",
    "sameAs": [
      "https://twitter.com/giftgenius",
      "https://facebook.com/giftgenius",
      "https://instagram.com/giftgenius"
    ],
    "description": "AI-powered gift recommendations that guarantee perfect gift-giving every time"
  });

  const schemas = [generateOrganizationSchema()];

  if (giftData && pageType === 'product') {
    schemas.push(generateProductSchema(giftData));
  }

  if (categoryData && pageType === 'category') {
    schemas.push(generateCategorySchema(categoryData));
  }

  if (breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }

  if (faqData.length > 0) {
    schemas.push(generateFAQSchema(faqData));
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default SEOSchema;