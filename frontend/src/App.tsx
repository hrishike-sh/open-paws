import { useState } from 'react';
import './App.css';
import PostDisplay from './components/PostDisplay';
import Summary from './components/Summary';

export interface PostData {
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

export interface CampaignBrief {
  topic: string;
  tone: string;
  target_audience: string;
  key_stats: string;
  cta: string;
}

interface Choice {
  platform: string;
  variant: 'a' | 'b';
  content: any;
}

function App() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyStats, setKeyStats] = useState('');
  const [cta, setCta] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [post, setPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'form' | 'summary'>('form');
  const [selectedChoices, setSelectedChoices] = useState<Choice[]>([]);

  const currentBrief: CampaignBrief = {
    topic,
    tone,
    target_audience: targetAudience,
    key_stats: keyStats,
    cta
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPost(null);
    setError(null);
    setSelectedChoices([]);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
      }

      const response = await fetch('/api/ai/draft', {
        method: 'POST',
        headers,
        body: JSON.stringify(currentBrief),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate post' }));
        throw new Error(errorData.message || 'Failed to generate post');
      }

      const data = await response.json();
      setPost(data.text.data);
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = (choices: Choice[]) => {
    setSelectedChoices(choices);
    setView('summary');
  };

  if (view === 'summary') {
    return (
      <div className="App">
        <Summary 
          choices={selectedChoices} 
          onBack={() => setView('form')} 
        />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Content Generator</h1>
        <p>Generate platform-specific content variants using AI.</p>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <label>
            Bearer Token
            <input type="password" value={bearerToken} onChange={(e) => setBearerToken(e.target.value)} placeholder="Enter your bearer token" />
          </label>
          <label>
            Topic
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., AI in software development" required />
          </label>
          <label>
            Tone
            <input type="text" value={tone} onChange={(e) => setTone(e.target.value)} placeholder="e.g., Informative and engaging" required />
          </label>
          <label>
            Target Audience
            <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g., Software developers" required />
          </label>
          <label>
            Key Stats
            <input type="text" value={keyStats} onChange={(e) => setKeyStats(e.target.value)} placeholder="e.g., Reduces development time by 20%" />
          </label>
          <label>
            Call to Action (CTA)
            <input type="text" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g., Try our new AI tool today!" required />
          </label>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Content'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {post && Object.keys(post).length > 0 && (
          <PostDisplay 
            post={post} 
            bearerToken={bearerToken} 
            brief={currentBrief}
            onContinue={handleContinue}
          />
        )}
      </main>
    </div>
  );
}

export default App;
