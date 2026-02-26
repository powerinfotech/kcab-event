/// <reference types="webpack-env" />
import dynamic from 'next/dynamic';
import { MenuInfo } from '@interface/auth/MenuManagement';

type PageComponentProps = { onChange: (flag: boolean) => void; menuInfo?: MenuInfo };

/**
 * require.context를 사용하여 src/page 디렉토리의 컴포넌트를 menu_view_path 기반으로 동적 로드
 * - menu_view_path 예: 'auth/MenuManagement', 'Dashboard', 'master/UserManagement'
 * - DB의 menu_view_path 칼럼 값과 파일 경로가 일치해야 함
 */
type PageContext = {
  keys: () => string[];
  (id: string): Promise<{ default: React.ComponentType<PageComponentProps> }>;
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pageContext: PageContext = require.context('../page', true, /\.tsx$/, 'lazy');

/** menu_view_path와 실제 파일명이 다른 경우 매핑 (예: template -> Template.tsx) */
const pathAliases: Record<string, string> = {
  template: 'Template',
};

const componentCache: Record<string, React.ComponentType<PageComponentProps>> = {};

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

export function getStaticRouteKey(pathname: string): string | null {
  const p = pathname === '/' ? '/' : pathname.replace(/^\//, '');
  if (p === '/') return 'Dashboard';
  if (['Guide', 'ScreenType01', 'ScreenType02', 'ScreenType03', 'ScreenType04', 'ScreenType05', 'ScreenType06', 'ScreenType07', 'ScreenType08', 'template'].includes(p)) return p;
  return null;
}
