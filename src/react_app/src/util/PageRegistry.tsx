import dynamic from 'next/dynamic';
import { MenuInfo } from '@interface/auth/MenuManagement';

type PageComponentProps = { onChange: (flag: boolean) => void; menuInfo?: MenuInfo };

const pageMap: Record<string, React.ComponentType<PageComponentProps>> = {
  'Dashboard': dynamic(() => import('@page/Dashboard'), { ssr: false }),
  'Guide': dynamic(() => import('@page/Guide'), { ssr: false }),
  'ScreenType01': dynamic(() => import('@page/ScreenType01'), { ssr: false }),
  'ScreenType02': dynamic(() => import('@page/ScreenType02'), { ssr: false }),
  'ScreenType03': dynamic(() => import('@page/ScreenType03'), { ssr: false }),
  'ScreenType04': dynamic(() => import('@page/ScreenType04'), { ssr: false }),
  'ScreenType05': dynamic(() => import('@page/ScreenType05'), { ssr: false }),
  'ScreenType06': dynamic(() => import('@page/ScreenType06'), { ssr: false }),
  'ScreenType07': dynamic(() => import('@page/ScreenType07'), { ssr: false }),
  'ScreenType08': dynamic(() => import('@page/ScreenType08'), { ssr: false }),
  'template': dynamic(() => import('@page/Template'), { ssr: false }),
  'master/UserManagement': dynamic(() => import('@page/master/UserManagement'), { ssr: false }),
  'master/InstitutionManagement': dynamic(() => import('@page/master/InstitutionManagement'), { ssr: false }),
  'master/SetupManagement': dynamic(() => import('@page/master/SetupManagement'), { ssr: false }),
  'master/NoticeManagement': dynamic(() => import('@page/master/NoticeManagement'), { ssr: false }),
  'master/CommonGroupCodeManagement': dynamic(() => import('@page/master/CommonGroupCodeManagement'), { ssr: false }),
  'master/CommonCodeManagement': dynamic(() => import('@page/master/CommonCodeManagement'), { ssr: false }),
  'auth/MenuManagement': dynamic(() => import('@page/auth/MenuManagement'), { ssr: false }),
  'auth/RoleManagement': dynamic(() => import('@page/auth/RoleManagement'), { ssr: false }),
  'auth/AuthGroupManagement': dynamic(() => import('@page/auth/AuthGroupManagement'), { ssr: false }),
  'auth/AuthGroupRoleManagement': dynamic(() => import('@page/auth/AuthGroupRoleManagement'), { ssr: false }),
  'auth/AuthGroupMenuManagement': dynamic(() => import('@page/auth/AuthGroupMenuManagement'), { ssr: false }),
  'auth/UserMenuAuthState': dynamic(() => import('@page/auth/UserMenuAuthState'), { ssr: false }),
  'stats/AccessLog': dynamic(() => import('@page/stats/AccessLog'), { ssr: false }),
  'code/SensorState': dynamic(() => import('@page/code/SensorState'), { ssr: false }),
  'code/NationAddrNoState': dynamic(() => import('@page/code/NationAddrNoState'), { ssr: false }),
  'code/EventState': dynamic(() => import('@page/code/EventState'), { ssr: false }),
};

export function getPageComponent(viewPath: string): React.ComponentType<PageComponentProps> | null {
  const key = viewPath.replace(/^\//, '');
  return pageMap[key] ?? null;
}

export function getStaticRouteKey(pathname: string): string | null {
  const p = pathname === '/' ? '/' : pathname.replace(/^\//, '');
  if (p === '/') return 'Dashboard';
  if (['Guide', 'ScreenType01', 'ScreenType02', 'ScreenType03', 'ScreenType04', 'ScreenType05', 'ScreenType06', 'ScreenType07', 'ScreenType08', 'template'].includes(p)) return p;
  return null;
}
