import React, { useState } from 'react';
import CustomInput from '@component/input/CustomInput';
import CustomSelect from '@component/select/CustomSelect';
import CustomSearchBar from '@component/input/CustomSearchBar';
import CustomFilterPanel from '@component/layout/CustomFilterPanel';
import CustomDateRangePicker from '@component/date/CustomDateRangePicker';
import CustomButton from '@component/button/CustomButton';
import { SearchOutlined } from '@ant-design/icons';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

/* ───────── 코드 예제 상수 ───────── */

const SEARCH_BAR_CODE = `import CustomSearchBar from '@component/input/CustomSearchBar';

// ① 기본 사용
const [searchValue, setSearchValue] = useState<string>('');
<CustomSearchBar
  placeholder="검색어를 입력하세요"
  onSearch={(v) => setSearchValue(v)}
/>

// ② disabled 상태
<CustomSearchBar placeholder="검색어를 입력하세요" disabled />

// ── Props 정리 ──
// placeholder   - 검색창 안내 텍스트
// onSearch      - 검색 실행 콜백 (debounce 내장)
// disabled      - 비활성화
// Ant Design Input.Search 기반, 내부 debounce 처리됨`;

const SEARCH_FORM_CODE = `import CustomInput from '@component/input/CustomInput';
import CustomSelect from '@component/select/CustomSelect';
import CustomDateRangePicker from '@component/date/CustomDateRangePicker';

// ① 조건 검색 폼 패턴 (.search-wrap)
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
      ]}
    />
    <span>기간</span>
    <CustomDateRangePicker />
  </form>
</div>

// ── 레이아웃 패턴 ──
// .search-wrap > form > span(라벨) + Input/Select 반복
// span 태그가 라벨 역할, 인라인 배치
// .search-input-w250 등 너비 클래스 사용 가능`;

const FILTER_PANEL_CODE = `import CustomFilterPanel from '@component/layout/CustomFilterPanel';

// ① 기본 사용 (접힌 상태)
<CustomFilterPanel title="상세 필터">
  <div className="search-wrap">
    <form>
      <span>상태</span>
      <CustomSelect placeholder="전체" options={statusOptions} />
    </form>
  </div>
</CustomFilterPanel>

// ② 펼쳐진 상태로 시작
<CustomFilterPanel title="상세 검색 조건" defaultOpen>
  {/* 검색 필터 내용 */}
</CustomFilterPanel>

// ── Props 정리 ──
// title       - 필터 패널 제목 (기본값: '상세 필터')
// defaultOpen - 초기 펼침 여부 (기본값: false)
// children    - 필터 패널 내부 콘텐츠`;

const SearchFilterGuide = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <GuideSection id="search-filter" title="검색 / 필터 (Search & Filter)" description="통합 검색, 조건 검색, 필터 패널 컴포넌트">
      {/* SearchBar */}
      <GuideDemoBox title="SearchBar (통합 검색)" codeExample={SEARCH_BAR_CODE}>
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
      <GuideDemoBox title="SearchForm (조건 검색 폼)" codeExample={SEARCH_FORM_CODE}>
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
      <GuideDemoBox title="FilterPanel (접기/펼치기 필터)" codeExample={FILTER_PANEL_CODE}>
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
    </GuideSection>
  );
};

export default SearchFilterGuide;
