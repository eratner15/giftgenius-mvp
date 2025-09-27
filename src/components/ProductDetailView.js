import React, { useState, useEffect } from 'react';
import { getGifts as fetchGifts, getGifts as getGiftsWithFallback } from '../api/gifts';
import '../styles/ProductDetail.css';

/**
 * ProductDetailView
 *
 * A dedicated product detail page. Given a gift ID from the URL, this
 * component fetches the corresponding gift from the existing gifts API
 * and renders a detailed view including an image, title, description,
 * price and a call-to-action button linking to the affiliate URL. A
 * placeholder explanation is provided for "Why this gift works" until
 * the AI integration is added.
 *
 * Props:
 *   id (string) – The gift's unique identifier extracted from the URL.
 */
const ProductDetailView = ({ id }) => {
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all gifts and find the matching one. We reuse the
    // existing getGifts API for now; in the future this can be
    // optimized to fetch a single gift by ID.
    const fetchGift = async () => {
      try {
        const data = await getGiftsWithFallback();
        const list = data.gifts || data || [];
        const found = list.find(item => {
          // Gifts may have id or slug properties; check both
          return (item.id && String(item.id) === id) || (item.slug && item.slug === id);
        });
        setGift(found);
      } catch (err) {
        console.error('Error fetching gift:', err);
        setError(err.message || 'Unable to load gift');
      } finally {
        setLoading(false);
      }
    };
    fetchGift();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <p>Loading gift details…</p>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="product-detail-page">
        <p>Sorry, we couldn't find that gift.</p>
      </div>
    );
  }

  // Derive image and URL fields with fallbacks
  const image = gift.image_url || gift.imageUrl || gift.image || null;
  const title = gift.name || gift.title || 'Gift';
  const description = gift.description || gift.details || '';
  const price = gift.price ? '$' + gift.price : '';

  const whyWorks = gift.successReason || gift.reason || 'This gift is highly rated by other recipients and suits the occasion perfectly.';
  const affiliateUrl = gift.trackedUrl || gift.affiliateUrl || gift.buyUrl || gift.url || '#';

  return (
    <div className="product-detail-page">
      <div className="product-detail-wrapper">
        {image && (
          <img
            src={image}
            alt={title}
            className="product-detail-image"
          />
        )}
        <div className="product-detail-content">
          <h1 className="product-detail-title">{title}</h1>
          {price && <div className="product-detail-price">{price}</div>}
          {description && <p className="product-detail-description">{description}</p>}
          <div className="product-detail-why">
            <h2>Why this gift works</h2>
            <p>{whyWorks}</p>
          </div>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="product-detail-cta"
          >
            Buy this gift
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
