"use client";

import { useState, FormEvent } from "react";

const WEB3FORMS_KEY = "a0154d11-0e66-4a41-9699-43ca89848c3c";

interface QuestionFormProps {
  title?: string;
}

export default function QuestionForm({ title = "Have a Question?" }: QuestionFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_KEY);
      formData.append('email', email);
      formData.append('question', question);
      formData.append('subject', 'New PYP Question Submission');
      formData.append('form_name', 'question');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setQuestion('');
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
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
    <form onSubmit={handleSubmit} className="question-form" aria-label={title}>
      <input 
        type="email" 
        name="email"
        placeholder="your@email.com" 
        required 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
      />
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
