import React from 'react';

const PublicFooter: React.FC = () => {
  return (
    <footer className="pub-footer">
      <div className="pub-footer-inner">
        <div>
          <div className="pub-footer-logo">KCAB INTERNATIONAL</div>
          <div className="pub-footer-info">
            대한상사중재원<br />
            서울특별시 강남구 테헤란로 606
          </div>
          <div className="pub-footer-copyright">
            &copy; {new Date().getFullYear()} KCAB INTERNATIONAL. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
