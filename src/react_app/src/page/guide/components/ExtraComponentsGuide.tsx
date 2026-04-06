import React, { useState } from 'react';
import type { UploadFile } from 'antd';
import CustomPageHeader from '@component/layout/CustomPageHeader';
import CustomImageUpload from '@component/upload/CustomImageUpload';
import CustomButton from '@component/button/CustomButton';
import CustomSpace from '@component/layout/CustomSpace';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const PAGE_HEADER_CODE = `import CustomPageHeader from '@component/layout/CustomPageHeader';

// ① 기본 사용 (제목만)
<CustomPageHeader title="사용자 관리" />

// ② 부제목 포함
<CustomPageHeader title="공지사항" subTitle="전체 12건" />

// ③ 뒤로가기 + 액션 버튼
<CustomPageHeader
  title="사용자 상세"
  onBack={() => router.back()}
  extra={
    <CustomSpace>
      <CustomButton onClick={handleEdit}>수정</CustomButton>
      <CustomButton danger onClick={handleDelete}>삭제</CustomButton>
    </CustomSpace>
  }
/>

// ④ 등록 버튼이 있는 목록 헤더
<CustomPageHeader
  title="게시판"
  extra={<CustomButton type="primary" onClick={() => setPopupOpen(true)}>등록</CustomButton>}
/>

// Props:
// title: string         - 페이지 제목 (필수)
// subTitle?: ReactNode  - 부제목 (건수 표시 등)
// onBack?: () => void   - 뒤로가기 버튼 (있으면 ← 아이콘 표시)
// extra?: ReactNode     - 우측 액션 영역 (버튼 등)`;

const IMAGE_UPLOAD_CODE = `import CustomImageUpload from '@component/upload/CustomImageUpload';
import type { UploadFile } from 'antd';

// ① 기본 사용 (최대 3장)
const [images, setImages] = useState<UploadFile[]>([]);
<CustomImageUpload
  fileList={images}
  onChange={setImages}
  maxCount={3}
/>

// ② 비활성화 (읽기전용)
<CustomImageUpload fileList={images} disabled />

// ③ 최대 5장 (기본값)
<CustomImageUpload fileList={images} onChange={setImages} />

// ④ 서버 저장 시
const handleSave = async () => {
  const formData = new FormData();
  images
    .filter(f => f.originFileObj) // 새로 추가된 파일만
    .forEach(f => formData.append('files', f.originFileObj as File));
  await axios.post('/api/upload-images', formData);
};

// Props:
// fileList?: UploadFile[]              - 현재 이미지 목록
// onChange?: (fileList: UploadFile[]) => void - 변경 콜백
// maxCount?: number                    - 최대 업로드 수 (기본: 5)
// disabled?: boolean                   - 비활성화 (기본: false)
// 이미지만 업로드 가능 (image/* MIME type)
// 클릭 시 모달로 원본 크기 미리보기
// maxCount 도달 시 업로드 버튼 자동 숨김`;

const ERROR_BOUNDARY_CODE = `import ErrorBoundary from '@component/layout/ErrorBoundary';

// ① 기본 사용 - 컴포넌트를 감싸면 런타임 에러 발생 시 에러 화면 표시
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// ② 페이지 단위로 감싸기
const MyPage = () => (
  <ErrorBoundary>
    <PageHeader title="사용자 관리" />
    <SearchForm />
    <DataTable />
  </ErrorBoundary>
);

// ③ 레이아웃에서 전체 감싸기
const Layout = ({ children }) => (
  <ErrorBoundary>
    <Header />
    <main>{children}</main>
    <Footer />
  </ErrorBoundary>
);

// 동작 방식:
// - 하위 컴포넌트에서 렌더링 중 에러 발생 시 catch
// - 에러 메시지 + 새로고침 버튼 표시
// - 에러가 전체 페이지를 깨뜨리는 것을 방지
// ※ 이벤트 핸들러 내 에러는 catch하지 않음 (try-catch 사용)`;

const CUSTOM_LOADING_CODE = `import CustomLoading from '@component/layout/CustomLoading';
import { useLoading } from '@hook/useLoading';

// ① 앱 루트에 한 번만 배치
const Layout = ({ children }) => (
  <>
    <CustomLoading />
    <Header />
    <main>{children}</main>
  </>
);

// ② API 호출 시 자동 로딩 (axios 인터셉터가 처리)
// → headers에 showLoading: false가 없으면 자동으로 로딩 스피너 표시
const res = await axios.get('/api/user/list'); // 자동 로딩 O
const res = await axios.get('/api/check', { headers: { showLoading: false } }); // 자동 로딩 X

// ③ 수동 로딩 제어 (useLoading 훅)
const { add, remove } = useLoading();
add('myTask');
try {
  await someNonAxiosTask();
} finally {
  remove('myTask');
}

// 동작 방식:
// - 전역 loadingAtom을 구독하여 로딩 상태 표시
// - 로딩 중 body에 scroll-lock 클래스 추가 (스크롤 방지)
// - 여러 API 동시 호출 시 모두 완료될 때까지 로딩 유지 (큐 방식)
// ※ 특정 영역만 로딩 → CustomSpin 사용`;

const ExtraComponentsGuide = () => {
  const [images, setImages] = useState<UploadFile[]>([]);

  return (
    <GuideSection id="extra-components" title="기타 컴포넌트 (Extra)" description="페이지 헤더, 이미지 업로드, 에러 경계, 전역 로딩 등 기타 컴포넌트">

      {/* PageHeader */}
      <GuideDemoBox title="PageHeader (페이지 헤더)" codeExample={PAGE_HEADER_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="기본 (제목만)">
            <CustomPageHeader title="사용자 관리" />
          </GuideStatusItem>
          <GuideStatusItem label="부제목 포함">
            <CustomPageHeader title="공지사항" subTitle="전체 12건" />
          </GuideStatusItem>
          <GuideStatusItem label="뒤로가기 + 액션">
            <CustomPageHeader
              title="사용자 상세"
              onBack={() => {}}
              extra={
                <CustomSpace>
                  <CustomButton>수정</CustomButton>
                  <CustomButton danger>삭제</CustomButton>
                </CustomSpace>
              }
            />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* ImageUpload */}
      <GuideDemoBox title="ImageUpload (이미지 업로드)" codeExample={IMAGE_UPLOAD_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="편집 가능 (최대 3장)">
            <CustomImageUpload
              fileList={images}
              onChange={setImages}
              maxCount={3}
            />
          </GuideStatusItem>
          <GuideStatusItem label="비활성화">
            <CustomImageUpload fileList={[]} disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* ErrorBoundary */}
      <GuideDemoBox title="ErrorBoundary (에러 경계)" codeExample={ERROR_BOUNDARY_CODE}>
        <div className="guide-demo-description">
          하위 컴포넌트에서 렌더링 중 에러 발생 시 catch하여 에러 메시지 + 새로고침 버튼을 표시한다.
          에러가 전체 페이지를 깨뜨리는 것을 방지하며, 페이지 단위 또는 레이아웃 단위로 감싸서 사용한다.
          이벤트 핸들러 내 에러는 catch하지 않으므로 try-catch를 별도로 사용해야 한다.
        </div>
      </GuideDemoBox>

      {/* CustomLoading */}
      <GuideDemoBox title="CustomLoading (전역 로딩)" codeExample={CUSTOM_LOADING_CODE}>
        <div className="guide-demo-description">
          앱 루트에 한 번 배치하면 axios 인터셉터가 API 호출 시 자동으로 로딩 스피너를 표시한다.
          여러 API 동시 호출 시 모두 완료될 때까지 로딩을 유지하는 큐 방식으로 동작한다.
          수동 제어가 필요한 경우 useLoading 훅의 add/remove를 사용한다.
          특정 영역만 로딩 처리하려면 CustomSpin을 사용한다.
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default ExtraComponentsGuide;
