import React from 'react';
import { GuideSection, GuideDemoBox } from './GuideSection';

/* ───────── 코드 예제 상수 ───────── */

const USE_ASYNC_CODE = `import { useAsync } from '@hook/useAsync';

// ① 기본 사용 — Returns { data, loading, error, fetch }
const { data, loading, error, fetch } = useAsync(callGetUserList, params);

useEffect(() => { fetch(); }, []);

// ② 결과 활용
// loading으로 로딩 표시, error로 에러 처리, data로 결과 사용
if (loading) return <Spin />;
if (error) return <Alert message={error.message} type="error" />;
return <div>{data?.userName}</div>;`;

const USE_PAGINATION_CODE = `import { usePagination } from '@hook/usePagination';

// ① 기본 사용 — Returns { dataSource, pagination, loading, search, reload, onPageChange }
const { dataSource, pagination, loading, search, onPageChange } = usePagination(
  (params) => callGetUserList(params),
  { defaultPageSize: 20 }
);

// ② 검색 (1페이지로 초기화 + 조회)
search({ userName: searchText });

// ③ 테이블 연동
<CustomTable
  dataSource={dataSource}
  pagination={{ ...pagination, onChange: onPageChange }}
/>`;

const USE_MESSAGE_CODE = `import { useMessage } from '@hook/useMessage';

const { confirm, alert } = useMessage();

// ① confirm — '확인/취소' → true/false 반환
const isOk = await confirm('정말 삭제하시겠습니까?');
if (isOk) { await callDelete(id); }

// ② alert — '확인' 버튼만
await alert('저장이 완료되었습니다.');`;

const USE_CM_CODE_CODE = `import { useCmCode } from '@hook/useCmCode';

// ① 공통코드 조회 — 배열로 코드 그룹 전달
const cmCode = useCmCode(['STATUS_CD', 'USER_TYPE_CD']);
// cmCode = { STATUS_CD: { '01': '활성', '02': '비활성' }, USER_TYPE_CD: { ... } }

// ② Select options으로 변환
const statusOptions = Object.entries(cmCode['STATUS_CD'] ?? {}).map(
  ([value, label]) => ({ value, label })
);

// ③ 컴포넌트에 적용
<CustomSelect options={statusOptions} value={status} onChange={setStatus} />`;

const USE_LOADING_CODE = `import { useLoading } from '@hook/useLoading';

const { add, remove } = useLoading();

// ① 수동 로딩 관리 (API 인터셉터가 자동 처리하지 않는 경우)
add('customTask');
try {
  await someAsyncTask();
} finally {
  remove('customTask');
}

// ② 여러 작업 동시 실행 시 각각 키를 다르게 → 전부 끝나야 로딩 해제
add('task1');
add('task2');
// task1, task2 모두 remove해야 로딩 스피너 사라짐`;

const USE_DEBOUNCE_CODE = `import { useDebounce, useDebouncedCallback } from '@hook/useDebounce';

// ① 값 디바운스
const debouncedSearch = useDebounce(searchText, 300);
useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);

// ② 콜백 디바운스
const debouncedFetch = useDebouncedCallback(
  (value: string) => fetchData(value),
  500
);
<CustomInput onChange={(e) => debouncedFetch(e.target.value)} />`;

const USE_LOCAL_STORAGE_CODE = `import { useLocalStorage } from '@hook/useLocalStorage';

// ① 기본 사용 — [값, setter, remover] 반환
const [theme, setTheme, removeTheme] = useLocalStorage<string>('theme', 'light');

// ② 값 변경 → localStorage에 저장 → 페이지 새로고침 후에도 유지
setTheme('dark');
removeTheme(); // localStorage에서 제거

// ③ 객체도 저장 가능 (JSON.stringify/parse 자동 처리)
const [settings, setSettings] = useLocalStorage('settings', { fontSize: 14, lang: 'ko' });`;

const USE_PERMISSION_CODE = `import { usePermission } from '@hook/usePermission';

const { hasButton } = usePermission();

// ① 현재 메뉴의 버튼 권한 체크
{hasButton('cfmSave') && <CustomButton onClick={handleSave}>저장</CustomButton>}
{hasButton('cfmDelete') && <CustomButton danger onClick={handleDelete}>삭제</CustomButton>}

// ② 버튼 코드 목록
// cfmInit(초기화), cfmSearch(조회), cfmAdd(등록),
// cfmSave(저장), cfmDelete(삭제), cfmExcel(엑셀)`;

const FORMAT_UTILS_CODE = `import {
  formatPhone, formatBizNo, formatCurrency, formatDate,
  formatDateTime, formatFileSize, stripNonNumeric
} from '@util/formatUtils';

// ① 전화번호 / 사업자번호
formatPhone('01012345678')       // '010-1234-5678'
formatBizNo('1234567890')        // '123-45-67890'

// ② 금액
formatCurrency(1500000)          // '1,500,000'
formatCurrency(1500000, '원')     // '1,500,000원'

// ③ 날짜 / 일시
formatDate('2024-01-15')                    // '2024-01-15'
formatDateTime('2024-01-15T09:30:00')       // '2024-01-15 09:30:00'

// ④ 파일 크기 / 숫자만 추출
formatFileSize(2621440)          // '2.5 MB'
stripNonNumeric('010-1234-5678') // '01012345678'

// ※ null/undefined 입력 시 안전하게 빈 문자열 반환`;

const STRING_UTILS_CODE = `import {
  isEmpty, isNotEmpty, mask, lpad, truncate,
  getByteLength, toNumber, camelToSnake, snakeToCamel,
  removeHtml, nl2br
} from '@util/stringUtils';

// ① 빈값 체크
isEmpty('')           // true
isEmpty(null)         // true
isNotEmpty('hello')   // true

// ② 마스킹
mask('홍길동', 'name')           // '홍*동'
mask('01012345678', 'phone')    // '010-****-5678'
mask('hong@test.com', 'email')  // 'ho**@test.com'

// ③ 문자열 변환
lpad('7', 3, '0')               // '007'
truncate('긴 텍스트입니다', 8)     // '긴 텍스트...'
getByteLength('Hello안녕')       // 11 (영문1, 한글3)
toNumber('1,234')               // 1234

// ④ 네이밍 변환 / HTML 처리
camelToSnake('userName')        // 'user_name'
snakeToCamel('user_name')       // 'userName'
removeHtml('<p>안녕</p>')        // '안녕'`;

const HooksUtilsGuide = () => {
  return (
    <GuideSection id="hooks-utils" title="Hooks & 유틸리티" description="커스텀 훅과 유틸리티 함수 사용법">
      {/* useAsync */}
      <GuideDemoBox title="useAsync (비동기 데이터 호출)" codeExample={USE_ASYNC_CODE}>
        <div className="guide-demo-description">
          비동기 API 호출을 간편하게 처리하는 훅입니다. data, loading, error, fetch를 반환하며,
          fetch()를 호출하면 자동으로 loading/error 상태가 관리됩니다.
        </div>
      </GuideDemoBox>

      {/* usePagination */}
      <GuideDemoBox title="usePagination (페이징 데이터)" codeExample={USE_PAGINATION_CODE}>
        <div className="guide-demo-description">
          페이징 처리된 목록 조회를 위한 훅입니다. search() 호출 시 1페이지로 초기화되며,
          pagination 객체를 CustomTable에 바로 전달할 수 있습니다.
        </div>
      </GuideDemoBox>

      {/* useMessage */}
      <GuideDemoBox title="useMessage (확인/알림 다이얼로그)" codeExample={USE_MESSAGE_CODE}>
        <div className="guide-demo-description">
          confirm은 확인/취소 버튼이 있는 다이얼로그로 true/false를 반환하고,
          alert은 확인 버튼만 있는 알림 다이얼로그입니다. 모두 await으로 사용합니다.
        </div>
      </GuideDemoBox>

      {/* useCmCode */}
      <GuideDemoBox title="useCmCode (공통코드 조회)" codeExample={USE_CM_CODE_CODE}>
        <div className="guide-demo-description">
          공통코드 그룹을 배열로 전달하면 코드값-코드명 매핑 객체를 반환합니다.
          Select 컴포넌트의 options로 변환하여 사용할 수 있습니다.
        </div>
      </GuideDemoBox>

      {/* useLoading */}
      <GuideDemoBox title="useLoading (로딩 상태)" codeExample={USE_LOADING_CODE}>
        <div className="guide-demo-description">
          API 인터셉터가 자동 처리하지 않는 경우 수동으로 로딩 상태를 관리합니다.
          키 기반으로 동작하여, 여러 비동기 작업이 모두 완료되어야 로딩이 해제됩니다.
        </div>
      </GuideDemoBox>

      {/* useDebounce */}
      <GuideDemoBox title="useDebounce (디바운스)" codeExample={USE_DEBOUNCE_CODE}>
        <div className="guide-demo-description">
          useDebounce는 값의 변경을 지연시키고, useDebouncedCallback은 콜백 실행을 지연시킵니다.
          검색 입력 등에서 불필요한 API 호출을 줄이는 데 활용합니다.
        </div>
      </GuideDemoBox>

      {/* useLocalStorage */}
      <GuideDemoBox title="useLocalStorage (로컬스토리지)" codeExample={USE_LOCAL_STORAGE_CODE}>
        <div className="guide-demo-description">
          localStorage와 React 상태를 동기화하는 훅입니다. 페이지 새로고침 후에도 값이 유지되며,
          객체/배열도 JSON 직렬화를 통해 자동으로 저장/복원됩니다.
        </div>
      </GuideDemoBox>

      {/* usePermission */}
      <GuideDemoBox title="usePermission (권한 체크)" codeExample={USE_PERMISSION_CODE}>
        <div className="guide-demo-description">
          현재 메뉴에 대한 버튼 권한을 체크하는 훅입니다. hasButton()으로 권한이 있는 버튼만
          조건부 렌더링하여 권한 없는 기능을 UI에서 숨길 수 있습니다.
        </div>
      </GuideDemoBox>

      {/* formatUtils */}
      <GuideDemoBox title="formatUtils (포맷 유틸)" codeExample={FORMAT_UTILS_CODE}>
        <div className="guide-demo-description">
          전화번호, 사업자번호, 금액, 날짜, 파일 크기 등의 포맷 변환 함수 모음입니다.
          null/undefined 입력 시 안전하게 빈 문자열을 반환합니다.
        </div>
      </GuideDemoBox>

      {/* stringUtils */}
      <GuideDemoBox title="stringUtils (문자열 유틸)" codeExample={STRING_UTILS_CODE}>
        <div className="guide-demo-description">
          빈값 체크, 마스킹, 패딩, 말줄임, 바이트 계산, 네이밍 변환 등
          문자열 처리에 필요한 유틸리티 함수 모음입니다.
        </div>
      </GuideDemoBox>

    </GuideSection>
  );
};

export default HooksUtilsGuide;
