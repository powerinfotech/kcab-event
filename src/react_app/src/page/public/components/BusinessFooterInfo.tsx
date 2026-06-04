import React from 'react';

const businessInfoItems = [
  '대한상사중재원',
  '사업자등록번호 120-82-00222',
  '대표: 신현윤',
  '서울 강남구 영동대로 511 트레이드타워 18층',
];

const BusinessFooterInfo: React.FC = () => (
  <div className="kcab-business-footer" aria-label="KCAB business information">
    <span className="kcab-business-footer-title">사업자 정보</span>
    <div className="kcab-business-footer-lines">
      {businessInfoItems.map((item) => (
        <span key={item}>{item}</span>
      ))}
      <a href="mailto:international@kcab.or.kr">international@kcab.or.kr</a>
      <a href="tel:+8225512000">+82 2 551 2000</a>
    </div>
  </div>
);

export default BusinessFooterInfo;
