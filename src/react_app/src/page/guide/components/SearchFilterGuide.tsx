import React, { useState } from 'react';
import CustomInput from '@component/input/CustomInput';
import CustomSelect from '@component/select/CustomSelect';
import CustomSearchBar from '@component/input/CustomSearchBar';
import CustomFilterPanel from '@component/layout/CustomFilterPanel';
import CustomDateRangePicker from '@component/date/CustomDateRangePicker';
import CustomButton from '@component/button/CustomButton';
import { SearchOutlined } from '@ant-design/icons';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const SearchFilterGuide = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <GuideSection id="search-filter" title="검색 / 필터 (Search & Filter)" description="통합 검색, 조건 검색, 필터 패널 컴포넌트">
      {/* SearchBar */}
      <GuideDemoBox title="SearchBar (통합 검색)">
        <GuideStatusRow>
          <GuideStatusItem label="기본 검색">
            <CustomSearchBar
              placeholder="검색어를 입력하세요"
              onSearch={(v) => setSearchValue(v)}
            />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomSearchBar placeholder="검색어를 입력하세요" disabled />
          </GuideStatusItem>
        </GuideStatusRow>
        {searchValue && (
          <div className="guide-demo-description">검색어: {searchValue}</div>
        )}
      </GuideDemoBox>

      {/* SearchForm */}
      <GuideDemoBox title="SearchForm (조건 검색 폼)">
        <div className="search-wrap">
          <form>
            <span>ID/성명</span>
            <CustomInput placeholder="ID 또는 성명을 입력해 주세요." className="search-input-w250" />
            <span>부서</span>
            <CustomSelect
              placeholder="선택"
              options={[
                { value: '', label: '전체' },
                { value: '01', label: '개발팀' },
                { value: '02', label: '인사팀' },
                { value: '03', label: '재무팀' },
              ]}
            />
            <span>기간</span>
            <CustomDateRangePicker />
          </form>
        </div>
        <div className="guide-demo-description">
          기존 .search-wrap 패턴을 사용한 조건 검색 폼입니다.
        </div>
      </GuideDemoBox>

      {/* FilterPanel */}
      <GuideDemoBox title="FilterPanel (접기/펼치기 필터)">
        <div className="guide-filter-demo">
          <CustomFilterPanel title="상세 검색 조건" defaultOpen>
            <div className="search-wrap">
              <form>
                <span>상태</span>
                <CustomSelect
                  placeholder="전체"
                  options={[
                    { value: '', label: '전체' },
                    { value: 'active', label: '활성' },
                    { value: 'inactive', label: '비활성' },
                  ]}
                />
                <span>등급</span>
                <CustomSelect
                  placeholder="전체"
                  options={[
                    { value: '', label: '전체' },
                    { value: 'admin', label: '관리자' },
                    { value: 'user', label: '일반사용자' },
                  ]}
                />
              </form>
            </div>
          </CustomFilterPanel>
        </div>
      </GuideDemoBox>

      {/* QuickFilter */}
      <GuideDemoBox title="QuickFilter (빠른 필터)">
        <div className="guide-demo-row">
          <CustomSearchBar
            placeholder="테이블 빠른 검색"
          />
        </div>
        <div className="guide-demo-description">
          그리드 상단에 배치하는 빠른 필터. CustomSearchBar를 활용합니다.
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default SearchFilterGuide;
