import React, { useState, useCallback, useEffect } from 'react';
import type { PostData, CampaignBrief } from '../App';

interface PostDisplayProps {
  post: PostData;
  bearerToken: string;
  brief: CampaignBrief;
  onContinue: (choices: { platform: string; variant: 'a' | 'b'; content: any }[]) => void;
}

const PostDisplay: React.FC<PostDisplayProps> = ({ post, bearerToken, brief, onContinue }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(Object.keys(post)[0]);
  const [chosenVariants, setChosenVariants] = useState<{ [platform: string]: 'a' | 'b' }>({});
  const [copied, setCopied] = useState(false);
  const [editablePost, setEditablePost] = useState<PostData>(post);
  const [aiPrompts, setAiPrompts] = useState<{ [key: string]: string }>({});
  const [isAiLoading, setIsAiLoading] = useState<{ [key: string]: boolean }>({});
  const [activeAiEditVariant, setActiveAiEditVariant] = useState<string | null>(null);

  useEffect(() => {
    setEditablePost(post);
    setSelectedPlatform(Object.keys(post)[0]);
    setActiveAiEditVariant(null);
  }, [post]);

  const handleChoose = (platform: string, variant: 'a' | 'b') => {
    setChosenVariants(prev => ({ ...prev, [platform]: variant }));
  };

  const handleCopyToClipboard = useCallback((content: string | object) => {
    const textToCopy = typeof content === 'string' ? content : Object.values(content).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleContentChange = (platform: string, variant: 'a' | 'b', key: string | null, newValue: string) => {
    setEditablePost(prev => {
      const newPost = { ...prev };
      const platformKey = platform as keyof PostData;
      const platformData = { ...newPost[platformKey] } as any;

      if (platformData) {
        const variantKey = `variant_${variant}`;
        const variantData = platformData[variantKey];

        if (typeof variantData === 'string') {
          platformData[variantKey] = newValue;
        } else if (key && typeof variantData === 'object') {
          platformData[variantKey] = {
            ...variantData,
            [key]: newValue
          };
        }
        newPost[platformKey] = platformData;
      }
      return newPost;
    });
  };

  const handleAIEdit = async (platform: string, variant: 'a' | 'b', key: string | null, originalText: string) => {
    const promptKey = `${platform}-${variant}-${key || 'default'}`;
    const prompt = aiPrompts[promptKey];
    if (!prompt) return;

    setIsAiLoading(prev => ({ ...prev, [promptKey]: true }));

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
      }

      const response = await fetch('/api/ai/edit', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: originalText, prompt, brief }),
      });

      if (!response.ok) throw new Error('Failed to edit with AI');

      const result = await response.json();
      if (result.text.success) {
        handleContentChange(platform, variant, key, result.text.data);
        setAiPrompts(prev => ({ ...prev, [promptKey]: '' }));
      }
    } catch (err) {
      console.error(err);
      alert('Error editing with AI');
    } finally {
      setIsAiLoading(prev => ({ ...prev, [promptKey]: false }));
    }
  };

  const toggleAiEditVariant = (platform: string, variant: 'a' | 'b') => {
    const variantKey = `${platform}-${variant}`;
    setActiveAiEditVariant(prev => prev === variantKey ? null : variantKey);
  };

  const handleContinueClick = () => {
    const choices = Object.entries(chosenVariants).map(([platform, variant]) => {
      const platformData = editablePost[platform as keyof PostData] as any;
      const content = platformData[`variant_${variant}`];
      return { platform, variant, content };
    });
    onContinue(choices);
  };

  const renderContent = (platform: string, variant: 'a' | 'b', content: string | object) => {
    const renderEditableArea = (currentKey: string | null, currentValue: string) => {
      const promptKey = `${platform}-${variant}-${currentKey || 'default'}`;
      const isAiEditActive = activeAiEditVariant === `${platform}-${variant}`;

      return (
        <div className="editable-container">
          <textarea
            className="editable-content"
            value={currentValue}
            onChange={(e) => handleContentChange(platform, variant, currentKey, e.target.value)}
            rows={currentKey ? 3 : 5}
          />
          {isAiEditActive && (
            <div className="ai-edit-tools">
              <input
                type="text"
                placeholder="Prompt to rephrase (e.g., 'make it funnier')"
                value={aiPrompts[promptKey] || ''}
                onChange={(e) => setAiPrompts(prev => ({ ...prev, [promptKey]: e.target.value }))}
                autoFocus
              />
              <button
                onClick={() => handleAIEdit(platform, variant, currentKey, currentValue)}
                disabled={isAiLoading[promptKey] || !aiPrompts[promptKey]}
                className="ai-edit-btn"
              >
                {isAiLoading[promptKey] ? 'Editing...' : 'Rephrase'}
              </button>
            </div>
          )}
        </div>
      );
    };

    if (typeof content === 'string') {
      return renderEditableArea(null, content);
    }
    return (
      <>
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className="content-item">
            <strong>{key.replace(/_/g, ' ')}</strong>
            {renderEditableArea(key, value as string)}
          </div>
        ))}
      </>
    );
  };

  const platformData = editablePost[selectedPlatform as keyof PostData];
  const hasAnyChoice = Object.keys(chosenVariants).length > 0;

  return (
    <div className="post-display-redesigned">
      <div className="platform-selector">
        {Object.keys(editablePost).map(platform => (
          <button
            key={platform}
            className={`platform-button ${selectedPlatform === platform ? 'active' : ''} ${chosenVariants[platform] ? 'has-choice' : ''}`}
            onClick={() => setSelectedPlatform(platform)}
          >
            {platform} {chosenVariants[platform] && '✓'}
          </button>
        ))}
      </div>

      <div className="variants-deck">
        {platformData && <>
          <VariantCard
            variant="a"
            content={platformData.variant_a}
            isChosen={chosenVariants[selectedPlatform] === 'a'}
            onChoose={() => handleChoose(selectedPlatform, 'a')}
            onCopy={handleCopyToClipboard}
            renderContent={(content) => renderContent(selectedPlatform, 'a', content)}
            onAiEdit={() => toggleAiEditVariant(selectedPlatform, 'a')}
            copied={copied && chosenVariants[selectedPlatform] === 'a'}
          />
          <VariantCard
            variant="b"
            content={platformData.variant_b}
            isChosen={chosenVariants[selectedPlatform] === 'b'}
            onChoose={() => handleChoose(selectedPlatform, 'b')}
            onCopy={handleCopyToClipboard}
            renderContent={(content) => renderContent(selectedPlatform, 'b', content)}
            onAiEdit={() => toggleAiEditVariant(selectedPlatform, 'b')}
            copied={copied && chosenVariants[selectedPlatform] === 'b'}
          />
        </>}
      </div>

      {hasAnyChoice && (
        <div className="continue-section">
          <button className="continue-btn" onClick={handleContinueClick}>
            Continue to Summary ({Object.keys(chosenVariants).length} selected)
          </button>
        </div>
      )}
    </div>
  );
};


interface VariantCardProps {
  variant: 'a' | 'b';
  content: string | object;
  isChosen: boolean;
  onChoose: () => void;
  onCopy: (content: string | object) => void;
  renderContent: (content: string | object) => React.ReactNode;
  onAiEdit: () => void;
  copied: boolean;
}

const VariantCard: React.FC<VariantCardProps> = ({ variant, content, isChosen, onChoose, onCopy, renderContent, onAiEdit, copied }) => {
  return (
    <div className={`variant-card-redesigned ${isChosen ? 'chosen' : ''}`}>
      <div className="variant-header">
        Variant {variant.toUpperCase()}
      </div>
      <div className="variant-content">
        {renderContent(content)}
      </div>
      <div className="variant-actions">
        <button className="choose-btn" onClick={onChoose}>
          {isChosen ? '✓ Chosen' : 'Choose'}
        </button>
        <button className="pencil-btn" onClick={onAiEdit} title="Edit with AI">
          ✎
        </button>
        {isChosen && (
          <button className="copy-btn" onClick={() => onCopy(content)}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostDisplay;
