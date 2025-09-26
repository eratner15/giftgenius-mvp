import React, { useState, useEffect, useRef, useCallback } from 'react';

// Camera capabilities detector
export const useCameraCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    hasCamera: false,
    hasMultipleCameras: false,
    supportsFacingMode: false,
    supportsFlash: false,
    supportsZoom: false,
    maxResolution: null,
    error: null
  });

  useEffect(() => {
    const detectCapabilities = async () => {
      try {
        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera not supported in this browser');
        }

        // Get available devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        setCapabilities({
          hasCamera: videoDevices.length > 0,
          hasMultipleCameras: videoDevices.length > 1,
          supportsFacingMode: videoDevices.some(device =>
            device.label.includes('back') || device.label.includes('rear')
          ),
          supportsFlash: 'torch' in navigator,
          supportsZoom: true, // Most modern browsers support zoom
          maxResolution: { width: 1920, height: 1080 }, // Common max resolution
          devices: videoDevices,
          error: null
        });
      } catch (error) {
        console.error('Camera capability detection failed:', error);
        setCapabilities(prev => ({
          ...prev,
          error: error.message
        }));
      }
    };

    detectCapabilities();
  }, []);

  return capabilities;
};

// AI-powered image analysis hook
export const useImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const analyzeImage = useCallback(async (imageData, options = {}) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert image to base64 if needed
      let base64Image = imageData;
      if (imageData instanceof HTMLCanvasElement) {
        base64Image = imageData.toDataURL('image/jpeg', 0.8);
      }

      // Simulate AI analysis with pattern detection
      const analysisResult = await simulateImageAnalysis(base64Image, options);

      setResults(analysisResult);
      return analysisResult;
    } catch (err) {
      console.error('Image analysis failed:', err);
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    analyzeImage,
    clearResults,
    isAnalyzing,
    results,
    error
  };
};

// Simulated AI image analysis
const simulateImageAnalysis = async (imageData, options) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  // Mock analysis results based on random factors
  const confidence = 0.7 + Math.random() * 0.25;

  const categories = [
    'jewelry', 'clothing', 'electronics', 'books', 'art', 'home-decor',
    'sports-equipment', 'beauty-products', 'toys', 'accessories'
  ];

  const colors = [
    'red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'gold', 'silver'
  ];

  const brands = [
    'Apple', 'Samsung', 'Nike', 'Adidas', 'Coach', 'Gucci', 'Sony', 'Generic'
  ];

  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomBrand = brands[Math.floor(Math.random() * brands.length)];

  return {
    confidence,
    category: randomCategory,
    subcategories: [randomCategory, 'gift-item'],
    colors: [randomColor],
    brand: randomBrand,
    features: [
      'high-quality',
      'popular-item',
      randomColor,
      'gift-worthy'
    ],
    suggestedTags: [randomCategory, randomColor, randomBrand.toLowerCase()],
    recommendations: generateMockRecommendations(randomCategory),
    timestamp: Date.now()
  };
};

const generateMockRecommendations = (category) => {
  const recommendations = {
    jewelry: [
      { name: 'Sterling Silver Necklace', price: 89.99, match: 95 },
      { name: 'Diamond Earrings', price: 299.99, match: 88 },
      { name: 'Gold Bracelet', price: 149.99, match: 82 }
    ],
    electronics: [
      { name: 'Wireless Headphones', price: 199.99, match: 92 },
      { name: 'Smart Watch', price: 299.99, match: 87 },
      { name: 'Portable Speaker', price: 79.99, match: 85 }
    ],
    clothing: [
      { name: 'Designer Scarf', price: 59.99, match: 90 },
      { name: 'Leather Jacket', price: 199.99, match: 85 },
      { name: 'Cashmere Sweater', price: 129.99, match: 88 }
    ]
  };

  return recommendations[category] || [
    { name: 'Similar Gift Item 1', price: 49.99, match: 85 },
    { name: 'Similar Gift Item 2', price: 79.99, match: 80 },
    { name: 'Similar Gift Item 3', price: 99.99, match: 75 }
  ];
};

// Main Camera Scanner Component
export const CameraScanner = ({
  onCapture,
  onAnalysis,
  onClose,
  facingMode = 'environment', // 'user' for front, 'environment' for back
  className = ''
}) => {
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const capabilities = useCameraCapabilities();
  const { analyzeImage, clearResults, isAnalyzing, results, error: analysisError } = useImageAnalysis();

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      setError(null);

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsActive(true);
      }
    } catch (err) {
      console.error('Failed to start camera:', err);
      setError(`Camera access failed: ${err.message}`);
    }
  }, [facingMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  }, [stream]);

  // Capture photo
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);

    // Flash effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 9999;
      opacity: 0.8;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 150);

    // Camera shutter sound (if permissions allow)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dto2QdCCuI0fPBdSUGJ3nI9NaOPAgTYbe');
      audio.play().catch(() => {}); // Ignore if can't play
    } catch (e) {}

    // Trigger callbacks
    if (onCapture) {
      onCapture(imageDataUrl, canvas);
    }

    // Auto-analyze if callback provided
    if (onAnalysis) {
      const analysisResult = await analyzeImage(canvas);
      if (analysisResult) {
        onAnalysis(analysisResult, imageDataUrl);
      }
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [onCapture, onAnalysis, analyzeImage]);

  // Toggle flash
  const toggleFlash = useCallback(async () => {
    if (!stream) return;

    try {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !flashEnabled }]
        });
        setFlashEnabled(!flashEnabled);
      }
    } catch (err) {
      console.error('Flash toggle failed:', err);
    }
  }, [stream, flashEnabled]);

  // Zoom control
  const handleZoom = useCallback(async (newZoom) => {
    if (!stream) return;

    try {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (capabilities.zoom) {
        const zoomValue = Math.max(
          capabilities.zoom.min,
          Math.min(capabilities.zoom.max, newZoom)
        );

        await track.applyConstraints({
          advanced: [{ zoom: zoomValue }]
        });
        setZoom(zoomValue);
      }
    } catch (err) {
      console.error('Zoom adjustment failed:', err);
    }
  }, [stream]);

  // Initialize camera on mount
  useEffect(() => {
    if (capabilities.hasCamera && !capabilities.error) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [capabilities.hasCamera, capabilities.error, startCamera, stopCamera]);

  if (capabilities.error) {
    return (
      <div className={`camera-scanner error ${className}`}>
        <div className="error-message">
          <h3>Camera Unavailable</h3>
          <p>{capabilities.error}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`camera-scanner ${className}`}>
      <div className="camera-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
        />

        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />

        {/* Camera Controls */}
        <div className="camera-controls">
          <div className="control-row top">
            {capabilities.supportsFlash && (
              <button
                className={`control-btn flash ${flashEnabled ? 'active' : ''}`}
                onClick={toggleFlash}
                disabled={!isActive}
              >
                ⚡
              </button>
            )}

            <button
              className="control-btn close"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="control-row center">
            <div className="scan-frame">
              <div className="scan-corners">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
              </div>
            </div>
          </div>

          <div className="control-row bottom">
            {capabilities.supportsZoom && (
              <div className="zoom-control">
                <button
                  className="zoom-btn"
                  onClick={() => handleZoom(Math.max(1, zoom - 0.5))}
                  disabled={zoom <= 1}
                >
                  -
                </button>
                <span className="zoom-indicator">{zoom.toFixed(1)}x</span>
                <button
                  className="zoom-btn"
                  onClick={() => handleZoom(Math.min(3, zoom + 0.5))}
                  disabled={zoom >= 3}
                >
                  +
                </button>
              </div>
            )}

            <button
              className="capture-btn"
              onClick={capturePhoto}
              disabled={!isActive || isAnalyzing}
            >
              {isAnalyzing ? (
                <div className="analyzing-spinner"></div>
              ) : (
                <div className="capture-ring">
                  <div className="capture-inner"></div>
                </div>
              )}
            </button>

            {capabilities.hasMultipleCameras && (
              <button
                className="control-btn flip-camera"
                onClick={() => {
                  stopCamera();
                  setTimeout(() => {
                    facingMode = facingMode === 'user' ? 'environment' : 'user';
                    startCamera();
                  }, 100);
                }}
              >
                🔄
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="camera-instructions">
          <p>Point camera at item to scan</p>
          {isAnalyzing && <p className="analyzing-text">Analyzing image...</p>}
        </div>
      </div>

      {/* Analysis Results Modal */}
      {results && (
        <div className="analysis-results-modal">
          <div className="results-content">
            <div className="results-header">
              <h3>Item Identified!</h3>
              <button
                className="close-results"
                onClick={() => clearResults()}
              >
                ✕
              </button>
            </div>

            <div className="results-body">
              <div className="identification">
                <h4>Category: {results.category}</h4>
                <p>Confidence: {Math.round(results.confidence * 100)}%</p>
                {results.colors && (
                  <p>Colors: {results.colors.join(', ')}</p>
                )}
                {results.brand && results.brand !== 'Generic' && (
                  <p>Brand: {results.brand}</p>
                )}
              </div>

              <div className="recommendations">
                <h4>Similar Gifts:</h4>
                <div className="recommendation-list">
                  {results.recommendations.map((rec, index) => (
                    <div key={index} className="recommendation-item">
                      <div className="rec-info">
                        <h5>{rec.name}</h5>
                        <p className="rec-price">${rec.price}</p>
                      </div>
                      <div className="match-score">
                        {rec.match}% match
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="results-actions">
                <button
                  className="btn-primary"
                  onClick={() => {
                    // Handle selecting recommendations
                    onAnalysis && onAnalysis(results);
                    clearResults();
                  }}
                >
                  View All Matches
                </button>
                <button
                  className="btn-secondary"
                  onClick={capturePhoto}
                >
                  Scan Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {analysisError && (
        <div className="analysis-error">
          <p>Analysis failed: {analysisError}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

// Quick Scan Button Component
export const QuickScanButton = ({ onScanStart, className = '' }) => {
  const [isSupported, setIsSupported] = useState(false);
  const capabilities = useCameraCapabilities();

  useEffect(() => {
    setIsSupported(capabilities.hasCamera && !capabilities.error);
  }, [capabilities]);

  if (!isSupported) return null;

  return (
    <button
      className={`quick-scan-btn ${className}`}
      onClick={onScanStart}
      title="Scan item with camera"
    >
      <div className="scan-icon">
        <div className="camera-body">📷</div>
        <div className="scan-lines">
          <div className="scan-line"></div>
          <div className="scan-line"></div>
          <div className="scan-line"></div>
        </div>
      </div>
      <span>Scan Item</span>
    </button>
  );
};

export default {
  CameraScanner,
  QuickScanButton,
  useCameraCapabilities,
  useImageAnalysis
};