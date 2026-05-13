import { atom } from 'jotai';

/**
 * 현재 URL pathname을 추적하는 atom.
 * 정적 빌드(output: 'export')에서 router.push 대신 history.pushState를 사용하기 위한 전역 상태.
 */
export const currentPathAtom = atom(
  typeof window !== 'undefined' ? window.location.pathname : '/',
);

export const KCAB_PATH_CHANGE_EVENT = 'kcab:pathchange';

function notifyPathChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(KCAB_PATH_CHANGE_EVENT));
  }
}

/**
 * URL 변경 + atom 업데이트를 동시에 수행하는 네비게이션 함수.
 * 페이지 리로드 없이 SPA 내부 화면만 전환한다.
 */
export function pushPath(
  url: string,
  setCurrentPath: (path: string) => void,
) {
  if (typeof window !== 'undefined') {
    window.history.pushState(null, '', url);
    setCurrentPath(window.location.pathname);
    notifyPathChange();
  } else {
    setCurrentPath(url);
  }
}

export function replacePath(
  url: string,
  setCurrentPath: (path: string) => void,
) {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', url);
    setCurrentPath(window.location.pathname);
    notifyPathChange();
  } else {
    setCurrentPath(url);
  }
}
