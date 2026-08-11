import React, { useEffect, useState } from 'react';

const MicroInteractions = () => {
  const [clickEffects, setClickEffects] = useState([]);
  const [hoverEffects, setHoverEffects] = useState([]);

  useEffect(() => {
    // Global click effect handler
    const handleGlobalClick = (e) => {
      const effect = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        type: 'click'
      };

      setClickEffects(prev => [...prev, effect]);

      // Remove effect after animation
      setTimeout(() => {
        setClickEffects(prev => prev.filter(f => f.id !== effect.id));
      }, 1000);
    };

    // Add ripple effect to interactive elements
    const addRippleEffect = () => {
      const interactiveElements = document.querySelectorAll(
        'button, .gift-card, .scenario-card, .testimonial-card, .wishlist-item, .trust-badge, .stat-card'
      );

      interactiveElements.forEach(element => {
        if (!element.classList.contains('ripple-enabled')) {
          element.classList.add('ripple-enabled');
          element.style.position = 'relative';
          element.style.overflow = 'hidden';

          element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
              position: absolute;
              width: ${size}px;
              height: ${size}px;
              left: ${x}px;
              top: ${y}px;
              background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
              border-radius: 50%;
              transform: scale(0);
              animation: ripple 0.6s ease-out;
              pointer-events: none;
              z-index: 10;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
              if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
              }
            }, 600);
          });
        }
      });
    };

    // Add hover glow effects
    const addHoverEffects = () => {
      const cards = document.querySelectorAll('.gift-card, .testimonial-card, .scenario-card');

      cards.forEach(card => {
        if (!card.classList.contains('hover-enhanced')) {
          card.classList.add('hover-enhanced');

          card.addEventListener('mouseenter', function(e) {
            this.style.setProperty('--mouse-x', `${e.offsetX}px`);
            this.style.setProperty('--mouse-y', `${e.offsetY}px`);
            this.classList.add('hover-active');
          });

          card.addEventListener('mousemove', function(e) {
            this.style.setProperty('--mouse-x', `${e.offsetX}px`);
            this.style.setProperty('--mouse-y', `${e.offsetY}px`);
          });

          card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
          });
        }
      });
    };

    // Add floating labels to form inputs
    const addFloatingLabels = () => {
      const inputs = document.querySelectorAll('input, textarea');

      inputs.forEach(input => {
        if (!input.classList.contains('floating-enhanced')) {
          input.classList.add('floating-enhanced');

          const wrapper = document.createElement('div');
          wrapper.className = 'floating-input-wrapper';
          input.parentNode.insertBefore(wrapper, input);
          wrapper.appendChild(input);

          if (input.placeholder) {
            const label = document.createElement('label');
            label.textContent = input.placeholder;
            label.className = 'floating-label';
            wrapper.appendChild(label);
            input.placeholder = '';
          }
        }
      });
    };

    // Add magnetic effect to buttons
    const addMagneticEffect = () => {
      const buttons = document.querySelectorAll('.cta-primary, .cta-secondary, .ai-chat-toggle, .wishlist-toggle');

      buttons.forEach(button => {
        if (!button.classList.contains('magnetic-enabled')) {
          button.classList.add('magnetic-enabled');

          button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
          });

          button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
          });
        }
      });
    };

    // Add tilt effect to cards
    const addTiltEffect = () => {
      const cards = document.querySelectorAll('.gift-card, .testimonial-card');

      cards.forEach(card => {
        if (!card.classList.contains('tilt-enabled')) {
          card.classList.add('tilt-enabled');

          card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
          });

          card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
          });
        }
      });
    };

    // Add morphing icons
    const addMorphingIcons = () => {
      const icons = document.querySelectorAll('.cta-icon, .badge-icon, .scenario-emoji');

      icons.forEach(icon => {
        if (!icon.classList.contains('morph-enabled')) {
          icon.classList.add('morph-enabled');

          icon.addEventListener('mouseenter', function() {
            this.style.animation = 'morphBounce 0.6s ease';
          });

          icon.addEventListener('animationend', function() {
            this.style.animation = '';
          });
        }
      });
    };

    // Initialize all effects
    const initEffects = () => {
      addRippleEffect();
      addHoverEffects();
      addFloatingLabels();
      addMagneticEffect();
      addTiltEffect();
      addMorphingIcons();
    };

    // Initialize immediately and on DOM changes
    initEffects();

    // Re-initialize on DOM changes (for dynamically added elements)
    const observer = new MutationObserver(initEffects);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Global click effects */}
      {clickEffects.map(effect => (
        <div
          key={effect.id}
          className="global-click-effect"
          style={{
            left: effect.x,
            top: effect.y,
          }}
        />
      ))}

      {/* Cursor trail */}
      <div className="cursor-trail-container">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="cursor-trail"
            style={{ '--delay': `${i * 0.1}s` }}
          />
        ))}
      </div>
    </>
  );
};

export default MicroInteractions;