import React from 'react';

interface GuideSectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

interface GuideDemoBoxProps {
  title: string;
  children: React.ReactNode;
}

export const GuideSection = ({ id, title, description, children }: GuideSectionProps) => {
  return (
    <section id={id} className="guide-section">
      <div className="guide-section-header">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
};

export const GuideDemoBox = ({ title, children }: GuideDemoBoxProps) => {
  return (
    <div className="guide-demo-box">
      <h4 className="guide-demo-title">{title}</h4>
      <div className="guide-demo-content">
        {children}
      </div>
    </div>
  );
};

interface GuideStatusRowProps {
  children: React.ReactNode;
}

export const GuideStatusRow = ({ children }: GuideStatusRowProps) => {
  return <div className="guide-status-row">{children}</div>;
};

interface GuideStatusItemProps {
  label: string;
  children: React.ReactNode;
}

export const GuideStatusItem = ({ label, children }: GuideStatusItemProps) => {
  return (
    <div className="guide-status-item">
      <div className="guide-status-label">{label}</div>
      {children}
    </div>
  );
};

export default GuideSection;
