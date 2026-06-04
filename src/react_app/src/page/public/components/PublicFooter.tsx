import React from 'react';
import BusinessFooterInfo from './BusinessFooterInfo';

const PublicFooter: React.FC = () => {
  return (
    <footer className="pub-footer">
      <div className="pub-footer-inner">
        <div>
          <div className="pub-footer-logo">KCAB INTERNATIONAL</div>
          <div className="pub-footer-info">
            Korean Commercial Arbitration Board<br />
            606 Teheran-ro, Gangnam-gu, Seoul, Korea
          </div>
          <BusinessFooterInfo />
          <div className="pub-footer-copyright">
            &copy; {new Date().getFullYear()} KCAB INTERNATIONAL. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
