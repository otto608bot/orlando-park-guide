import type { ReactNode } from "react";

interface ContentPageShellProps {
  title: string;
  intro: string;
  children: ReactNode;
}

export default function ContentPageShell({ title, intro, children }: ContentPageShellProps) {
  return (
    <main className="content-page-shell">
      <header className="content-page-header">
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>

      <div className="content-page-body">{children}</div>

      <style>{`
        .content-page-shell {
          max-width: 880px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .content-page-header {
          margin-bottom: 2rem;
        }

        .content-page-header h1 {
          font-family: var(--font-heading);
          font-size: clamp(1.85rem, 4vw, 2.75rem);
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 0.75rem;
        }

        .content-page-header p {
          color: var(--text-medium);
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 720px;
        }

        .content-page-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .content-page-body section {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .content-page-body h2 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.75rem;
        }

        .content-page-body p,
        .content-page-body li {
          color: var(--text-medium);
          line-height: 1.75;
        }

        .content-page-body ul {
          margin: 0.75rem 0 0 1.25rem;
        }

        .content-page-body a {
          color: var(--primary);
        }

        @media (max-width: 640px) {
          .content-page-shell {
            padding: 1.5rem 1rem 3rem;
          }

          .content-page-body section {
            padding: 1.25rem;
          }
        }
      `}</style>
    </main>
  );
}
