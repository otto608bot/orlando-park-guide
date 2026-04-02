"use client";

import { useState, FormEvent } from "react";

interface QuestionFormProps {
  title?: string;
}

export default function QuestionForm({ title = "Have a Question?" }: QuestionFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [question, setQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    
    const form = e.currentTarget;
    const data = new FormData(form);

    // Timeout after 10 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('https://formspree.io/f/xwvnjpgd', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setStatus('success');
        setQuestion('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        setErrorMessage('Request timed out. Please check your connection and try again.');
      } else {
        setErrorMessage('Network error. Please check your connection and try again.');
      }
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success">
        <p>✅ Got it! We&apos;ll add your question to our FAQ.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <textarea
        name="question"
        placeholder="Ask about closures, planning, or anything else..."
        required
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={status === 'loading'}
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Submit Question'}
      </button>
      {status === 'error' && errorMessage && (
        <p className="form-error">{errorMessage}</p>
      )}
    </form>
  );
}
