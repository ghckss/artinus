import type { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  bannerText: string;
  bannerIcon?: string;
  themeColor: string;
  children: ReactNode;
}

export function PageLayout({ title, bannerText, bannerIcon, themeColor, children }: PageLayoutProps) {
  return (
    <div className="page-shell" style={{ '--theme-color': themeColor } as React.CSSProperties}>
      <header className="page-header">
        <h1 className="page-title">{title}</h1>
        <div className="page-banner-card">
          <div className="page-banner-icon" aria-hidden="true">
            {bannerIcon ?? '✨'}
          </div>
          <p className="page-banner-text">{bannerText}</p>
        </div>
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
}
