import React, { useState, useEffect } from 'react';
import LogoImage from '../../../assets/images/logo.png';

interface Props {
  currentUrl?: string;
  onNavigate: (url: string) => void;
}

const PublicHeader: React.FC<Props> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logoSrc = typeof LogoImage === 'string' ? LogoImage : (LogoImage as { src?: string })?.src ?? '';

  return (
    <header className={`pub-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="pub-header-inner">
        <a className="pub-logo" href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>
          {logoSrc && <img src={logoSrc} alt="KCAB" />}
          <span>KCAB INTERNATIONAL</span>
        </a>

        <div className="pub-header-actions">
          <a className="pub-btn-admin" href="/login">Admin</a>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
