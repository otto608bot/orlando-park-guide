"use client";

import { useState, FormEvent } from "react";

interface EmailFormProps {
  buttonText?: string;
}

export default function EmailForm({ buttonText = "Subscribe" }: EmailFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
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
      const response = await fetch('https://formspree.io/f/xpqjewvb', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setStatus('success');
        setEmail('');
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
        <p>🎉 Thanks! You&apos;re subscribed. Check your inbox for confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="email-form">
      <input 
        type="email" 
        name="email" 
        placeholder="your@email.com" 
        required 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : buttonText}
      </button>
      {status === 'error' && errorMessage && (
        <p className="form-error">{errorMessage}</p>
      )}
    </form>
  );
}
