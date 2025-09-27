import React, { useState } from 'react';

function GiftFinderWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    relationship: '',
    occasion: '',
    interests: [],
    personality: [],
    budgetMin: 0,
    budgetMax: 100,
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (onComplete) onComplete(formData);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="gift-finder-wizard">
      {step === 1 && (
        <div>
          <h2>Select Relationship</h2>
          <select
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
          >
            <option value="">Select...</option>
            <option value="partner">Partner</option>
            <option value="friend">Friend</option>
            <option value="family">Family</option>
            <option value="coworker">Coworker</option>
          </select>
          <button onClick={next}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Select Occasion</h2>
          <input
            type="text"
            value={formData.occasion}
            onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
          />
          <button onClick={prev}>Back</button>
          <button onClick={next}>Next</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Enter Interests (comma separated)</h2>
          <input
            type="text"
            value={formData.interests.join(',')}
            onChange={(e) =>
              setFormData({ ...formData, interests: e.target.value.split(',').map((s) => s.trim()) })
            }
          />
          <button onClick={prev}>Back</button>
          <button onClick={next}>Next</button>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2>Enter Personality Traits (comma separated)</h2>
          <input
            type="text"
            value={formData.personality.join(',')}
            onChange={(e) =>
              setFormData({ ...formData, personality: e.target.value.split(',').map((s) => s.trim()) })
            }
          />
          <button onClick={prev}>Back</button>
          <button onClick={next}>Next</button>
        </div>
      )}
      {step === 5 && (
        <div>
          <h2>Select Budget</h2>
          <label>
            Min: <input type="number" value={formData.budgetMin} onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })} />
          </label>
          <label>
            Max: <input type="number" value={formData.budgetMax} onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })} />
          </label>
          <button onClick={prev}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default GiftFinderWizard;
