import React from 'react';

interface Choice {
  platform: string;
  variant: 'a' | 'b';
  content: any;
}

interface SummaryProps {
  choices: Choice[];
  onBack: () => void;
}

const Summary: React.FC<SummaryProps> = ({ choices, onBack }) => {
  const renderValue = (content: any) => {
    if (typeof content === 'string') {
      return <p className="summary-text">{content}</p>;
    }
    return (
      <div className="summary-nested">
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className="summary-item">
            <strong>{key.replace(/_/g, ' ')}:</strong>
            <p>{value as string}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="summary-container">
      <header className="summary-header">
        <h2>Your Selected Campaign Content</h2>
        <button className="back-btn" onClick={onBack}>← Back to Editor</button>
      </header>
      <div className="summary-list">
        {choices.map((choice) => (
          <div key={choice.platform} className="summary-card">
            <div className="summary-card-header">
              <span className="platform-tag">{choice.platform}</span>
              <span className="variant-tag">Variant {choice.variant.toUpperCase()}</span>
            </div>
            <div className="summary-card-body">
              {renderValue(choice.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
