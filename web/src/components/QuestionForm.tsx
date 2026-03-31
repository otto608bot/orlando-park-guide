"use client";

import { useState, FormEvent } from "react";

interface QuestionFormProps {
  title?: string;
}

export default function QuestionForm({ title = "Have a Question?" }: QuestionFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [question, setQuestion] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    
    const form = e.currentTarget;
    const data = new FormData(form);
    
    try {
      const response = await fetch('https://formspree.io/f/xwvnjpgd', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      
      if (response.ok) {
        setStatus('success');
        setQuestion('');
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
        <p>✅ Got it! We&apos;ll add your question to our FAQ.</p>
      </div>
    );
  }

  return (
    <form action="https://formspree.io/f/xwvnjpgd" method="POST" className="question-form" onSubmit={handleSubmit}>
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
    </form>
  );
}