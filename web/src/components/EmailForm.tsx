"use client";

import { useState, FormEvent } from "react";

interface EmailFormProps {
  buttonText?: string;
}

export default function EmailForm({ buttonText = "Subscribe" }: EmailFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    
    const form = e.currentTarget;
    const data = new FormData(form);
    
    try {
      const response = await fetch('https://formspree.io/f/xpqjewvb', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      
      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
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
    <form action="https://formspree.io/f/xpqjewvb" method="POST" className="email-form" onSubmit={handleSubmit}>
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
    </form>
  );
}