import React, { useState } from 'react';
import { Button } from 'antd';
import { CodeOutlined } from '@ant-design/icons';

interface GuideSectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

interface GuideDemoBoxProps {
  title: string;
  children: React.ReactNode;
  codeExample?: string;
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

export const GuideDemoBox = ({ title, children, codeExample }: GuideDemoBoxProps) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="guide-demo-box">
      <div className="guide-demo-title">
        <h4>{title}</h4>
        {codeExample && (
          <Button
            type="text"
            size="small"
            icon={<CodeOutlined />}
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? '코드 닫기' : '코드 보기'}
          </Button>
        )}
      </div>
      <div className="guide-demo-content">
        {children}
      </div>
      {showCode && codeExample && (
        <div className="guide-code-block">
          <pre><code>{codeExample}</code></pre>
        </div>
      )}
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
