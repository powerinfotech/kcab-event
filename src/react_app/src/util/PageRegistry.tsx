/**
 * PageRegistry - 메뉴 기반 페이지 컴포넌트 동적 로딩 레지스트리
 *
 * [목적]
 * DB의 menu_view_path 값을 기반으로 src/page/ 하위의 React 컴포넌트를
 * 동적으로 로드한다. 탭 기반 네비게이션에서 메뉴 클릭 시 해당 페이지를
 * lazy loading하여 초기 번들 크기를 줄이고 성능을 최적화한다.
 *
 * [동작 방식]
 * 1. webpack의 require.context로 src/page 하위 모든 .tsx 파일을 lazy 모드로 등록
 * 2. menu_view_path → 파일 경로 매핑 → next/dynamic으로 SSR 비활성화 로드
 * 3. 한번 로드된 컴포넌트는 componentCache에 캐싱하여 재로드 방지
 *
 * [사용 방법]
 * @example
 * import { getPageComponent } from '@util/PageRegistry';
 *
 * // 메뉴의 viewPath로 컴포넌트 가져오기
 * const PageComponent = getPageComponent('auth/MenuManagement');
 * // → src/page/auth/MenuManagement.tsx 컴포넌트 반환
 *
 * if (PageComponent) {
 *   <PageComponent onChange={handleChange} menuInfo={menu} handlersRef={ref} />
 * }
 */
/// <reference types="webpack-env" />
import dynamic from 'next/dynamic';
import { MenuInfo } from '@interface/auth/MenuManagement';
import { PageButtonHandlers } from '@interface/common';

/** 페이지 컴포넌트가 공통으로 받는 props */
type PageComponentProps = {
  /** 데이터 변경 여부 플래그 (탭 이동 시 저장 확인용) */
  onChange: (flag: boolean) => void;
  /** 현재 메뉴 정보 (메뉴명, URL, 권한 등) */
  menuInfo?: MenuInfo;
  /** 페이지 버튼 핸들러 참조 (MenuButtonBar와 연동) */
  handlersRef?: React.MutableRefObject<PageButtonHandlers>;
};

/**
 * webpack require.context 타입 정의
 * - keys(): 등록된 모든 모듈 경로 목록
 * - (id): 특정 경로의 모듈을 lazy import
 */
type PageContext = {
  keys: () => string[];
  (id: string): Promise<{ default: React.ComponentType<PageComponentProps> }>;
};

// src/page 하위 모든 .tsx 파일을 lazy 모드로 등록
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pageContext: PageContext = require.context('../page', true, /\.tsx$/, 'lazy');

/** viewPath 별칭 매핑 (DB의 경로와 실제 파일 경로가 다를 때 사용) */
const pathAliases: Record<string, string> = {};

/** 로드된 컴포넌트 캐시 (동일 페이지 재로드 방지) */
const componentCache: Record<string, React.ComponentType<PageComponentProps>> = {};

/**
 * viewPath를 require.context의 키 형식(./경로.tsx)으로 변환
 * - 앞의 슬래시 제거, pathAliases 적용, .tsx 확장자 추가
 * - pageContext에 등록되지 않은 경로는 null 반환
 *
 * @param viewPath - 메뉴의 view path (예: 'auth/MenuManagement')
 * @returns require.context 키 문자열 또는 null
 */
function getContextKey(viewPath: string): string | null {
  const key = viewPath.replace(/^\//, '').trim();
  if (!key) return null;

  const resolvedPath = pathAliases[key] ?? key;
  const contextKey = `./${resolvedPath}.tsx`;

  if (pageContext.keys().includes(contextKey)) {
    return contextKey;
  }
  return null;
}

/**
 * menu_view_path에 해당하는 페이지 컴포넌트를 동적으로 가져오기
 * - 캐시에 있으면 캐시된 컴포넌트 반환
 * - 없으면 next/dynamic으로 lazy load 후 캐시에 저장
 * - 매핑되는 파일이 없으면 null 반환
 *
 * @param viewPath - DB menu_view_path 값 (예: 'master/UserManagement')
 * @returns 페이지 컴포넌트 또는 null
 *
 * @example
 * const Page = getPageComponent('master/UserManagement');
 * // → src/page/master/UserManagement.tsx를 SSR 없이 동적 로드
 */
export function getPageComponent(viewPath: string): React.ComponentType<PageComponentProps> | null {
  const contextKey = getContextKey(viewPath);
  if (!contextKey) return null;

  if (componentCache[contextKey]) {
    return componentCache[contextKey];
  }

  const LoadedComponent = dynamic(
    () => pageContext(contextKey).then((mod) => mod.default),
    { ssr: false }
  );

  componentCache[contextKey] = LoadedComponent;
  return LoadedComponent;
}

/**
 * 정적 라우트(고정 경로)에 대한 페이지 키 반환
 * - '/' 경로 → 'DashBoard' 반환
 * - 그 외 → null (동적 라우트로 처리)
 *
 * @param pathname - URL pathname (예: '/', '/auth/menu')
 * @returns 페이지 키 문자열 또는 null
 *
 * @example
 * getStaticRouteKey('/')        → 'DashBoard'
 * getStaticRouteKey('/auth/menu') → null
 */
export function getStaticRouteKey(pathname: string): string | null {
  const p = pathname === '/' ? '/' : pathname.replace(/^\//, '');
  if (p === '/') return 'DashBoard';
  return null;
}
