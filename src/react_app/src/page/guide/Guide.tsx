import React from 'react';
import { MenuInfo } from '@interface/auth/MenuManagement';
import { Anchor } from 'antd';
import FormInputsGuide from './components/FormInputsGuide';
import SelectionGuide from './components/SelectionGuide';
import ButtonsActionsGuide from './components/ButtonsActionsGuide';
import DataDisplayGuide from './components/DataDisplayGuide';
import FeedbackGuide from './components/FeedbackGuide';
import FileGuide from './components/FileGuide';
import NavigationLayoutGuide from './components/NavigationLayoutGuide';
import SearchFilterGuide from './components/SearchFilterGuide';
import ChartsGuide from './components/ChartsGuide';
import UtilityGuide from './components/UtilityGuide';
import PopupGuide from './components/PopupGuide';
import SpecialGuide from './components/SpecialGuide';

const anchorItems = [
  { key: 'form-inputs', href: '#form-inputs', title: '폼 입력' },
  { key: 'selection', href: '#selection', title: '선택' },
  { key: 'file', href: '#file', title: '파일' },
  { key: 'data-display', href: '#data-display', title: '데이터 표시' },
  { key: 'navigation-layout', href: '#navigation-layout', title: '네비게이션/레이아웃' },
  { key: 'feedback', href: '#feedback', title: '피드백/알림' },
  { key: 'buttons-actions', href: '#buttons-actions', title: '버튼/액션' },
  { key: 'search-filter', href: '#search-filter', title: '검색/필터' },
  { key: 'popup', href: '#popup', title: '팝업' },
  { key: 'special', href: '#special', title: '특수 컴포넌트' },
  { key: 'charts', href: '#charts', title: '차트' },
  { key: 'utility', href: '#utility', title: '유틸리티' },
];

const Guide = ({ menuInfo }: { menuInfo?: MenuInfo }) => {
  return (
    <div className="guide-wrap">
      <aside className="guide-nav">
        <Anchor
          affix={false}
          items={anchorItems}
          targetOffset={80}
        />
      </aside>
      <main className="guide-content">
        <FormInputsGuide />
        <SelectionGuide />
        <FileGuide menuSeq={menuInfo?.menuSeq} />
        <DataDisplayGuide />
        <NavigationLayoutGuide />
        <FeedbackGuide />
        <ButtonsActionsGuide />
        <SearchFilterGuide />
        <PopupGuide />
        <SpecialGuide />
        <ChartsGuide />
        <UtilityGuide />
      </main>
    </div>
  );
};

export default Guide;
