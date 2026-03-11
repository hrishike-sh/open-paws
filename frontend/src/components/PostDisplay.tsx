import React, { useState, useCallback, useEffect } from 'react';

interface PostData {
  twitter?: { variant_a: string; variant_b: string };
  instagram?: {
    variant_a: { visual_concept: string; caption: string };
    variant_b: { visual_concept: string; caption: string };
  };
  email?: {
    variant_a: { subject: string; preview: string; body: string };
    variant_b: { subject: string; preview: string; body: string };
  };
  blog?: {
    variant_a: { title: string; excerpt: string };
    variant_b: { title: string; excerpt: string };
  };
  press_release?: {
    variant_a: { headline: string; opening_paragraph: string };
    variant_b: { headline: string; opening_paragraph: string };
  };
}


interface PostDisplayProps {
  post: PostData;
}

const PostDisplay: React.FC<PostDisplayProps> = ({ post }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(Object.keys(post)[0]);
  const [chosenVariants, setChosenVariants] = useState<{ [platform: string]: 'a' | 'b' }>({});
  const [copied, setCopied] = useState(false);
  const [editablePost, setEditablePost] = useState<PostData>(post);

  useEffect(() => {
    setEditablePost(post);
    setSelectedPlatform(Object.keys(post)[0]);
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

  const renderContent = (platform: string, variant: 'a' | 'b', content: string | object) => {
    if (typeof content === 'string') {
      return (
        <textarea
          className="editable-content"
          value={content}
          onChange={(e) => handleContentChange(platform, variant, null, e.target.value)}
          rows={5}
        />
      );
    }
    return (
      <>
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className="content-item">
            <strong>{key.replace(/_/g, ' ')}</strong>
            <textarea
              className="editable-content"
              value={value as string}
              onChange={(e) => handleContentChange(platform, variant, key, e.target.value)}
              rows={3}
            />
          </div>
        ))}
      </>
    );
  };

  const platformData = editablePost[selectedPlatform as keyof PostData];

  return (
    <div className="post-display-redesigned">
      <div className="platform-selector">
        {Object.keys(editablePost).map(platform => (
          <button
            key={platform}
            className={`platform-button ${selectedPlatform === platform ? 'active' : ''}`}
            onClick={() => setSelectedPlatform(platform)}
          >
            {platform}
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
            copied={copied && chosenVariants[selectedPlatform] === 'a'}
          />
          <VariantCard
            variant="b"
            content={platformData.variant_b}
            isChosen={chosenVariants[selectedPlatform] === 'b'}
            onChoose={() => handleChoose(selectedPlatform, 'b')}
            onCopy={handleCopyToClipboard}
            renderContent={(content) => renderContent(selectedPlatform, 'b', content)}
            copied={copied && chosenVariants[selectedPlatform] === 'b'}
          />
        </>}
      </div>
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
  copied: boolean;
}

const VariantCard: React.FC<VariantCardProps> = ({ variant, content, isChosen, onChoose, onCopy, renderContent, copied }) => {
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
