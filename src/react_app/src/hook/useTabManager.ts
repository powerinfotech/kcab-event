/**
 * useTabManager - 멀티탭 네비게이션 관리 훅
 *
 * [목적]
 * 메뉴 클릭 시 탭을 열고, 탭 전환/닫기/전체닫기 등 멀티탭 UI의 모든 동작을 관리.
 * Recoil(tabListAtom, activeTabKeyAtom)로 탭 상태를 전역 관리하며,
 * sessionStorage에 자동 영속화되어 새로고침 후에도 탭이 유지된다.
 *
 * [제약]
 * - 최대 탭 수: 10개 (초과 시 첫 번째 탭 닫기 confirm)
 * - 탭 키: menuUrl을 고유 키로 사용
 *
 * [사용 방법]
 * @example
 * const {
 *   tabMode,        // 탭 모드 ('multi' | 'single')
 *   tabList,        // 열린 탭 목록
 *   activeTabKey,   // 현재 활성 탭 키
 *   openTab,        // 탭 열기 (메뉴 클릭 시)
 *   closeTab,       // 탭 닫기 (X 버튼)
 *   activateTab,    // 탭 전환 (탭 클릭)
 *   closeOtherTabs, // 다른 탭 모두 닫기
 *   closeAllTabs,   // 전체 탭 닫기
 * } = useTabManager();
 *
 * // 사이드바 메뉴 클릭 시 탭 열기
 * const handleMenuClick = (menu: MenuInfo) => {
 *   openTab(menu);
 * };
 *
 * // 탭 닫기 버튼
 * <CloseIcon onClick={() => closeTab(tab.key)} />
 *
 * // 탭 클릭으로 전환
 * <TabBar tabs={tabList} activeKey={activeTabKey} onTabClick={activateTab} />
 */
import { useCallback, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { tabListAtom, activeTabKeyAtom } from '@atom/tabListAtom';
import { tabModeAtom } from '@atom/tabModeAtom';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import { useMessage } from '@hook/useMessage';
import { MenuInfo } from '@interface/auth/MenuManagement';

/** 최대 동시 오픈 가능한 탭 수 */
const MAX_TABS = 10;

/** URL을 히스토리에 push (브라우저 주소 변경, 페이지 리로드 없음) */
function updateUrl(url: string) {
  if (typeof window !== 'undefined') {
    window.history.pushState(null, '', url);
  }
}

/**
 * 멀티탭 네비게이션 관리 훅
 *
 * @returns {
 *   tabMode, tabList, activeTabKey,
 *   openTab, closeTab, activateTab, closeOtherTabs, closeAllTabs
 * }
 */
export default function useTabManager() {
  const { confirm } = useMessage();
  const setCurrentPath = useSetAtom(currentPathAtom);
  const tabMode = useAtomValue(tabModeAtom);
  const [tabList, setTabList] = useAtom(tabListAtom);
  const [activeTabKey, setActiveTabKey] = useAtom(activeTabKeyAtom);

  // closeTab에서 최신 activeTabKey를 읽기 위한 ref
  const activeTabKeyRef = useRef(activeTabKey);
  activeTabKeyRef.current = activeTabKey;

  /**
   * 메뉴 정보로 탭 열기
   * - 이미 열린 탭이면 해당 탭으로 전환만
   * - 최대 탭 수 초과 시 confirm 후 첫 번째 탭 제거
   * - 새 탭이면 목록에 추가하고 활성화
   */
  const openTab = useCallback(
    async (menu: MenuInfo) => {
      const key = menu.menuUrl;

      // 이미 열려있으면 활성화만
      if (tabList.find((t) => t.key === key)) {
        setActiveTabKey(key);
        updateUrl('/admin' + key);
        return;
      }

      // 탭 최대 개수 초과 시 confirm
      if (tabList.length >= MAX_TABS) {
        const confirmed = await confirm(
          `${MAX_TABS}개 초과하여 화면을 열 수 없습니다.\n첫번째 화면을 닫으시겠습니까?`,
        );
        if (!confirmed) return;

        // 첫번째 탭 제거 후 새 탭 추가
        setTabList((prev) => [
          ...prev.slice(1),
          {
            key,
            menuSeq: menu.menuSeq,
            menuNm: menu.menuNm,
            menuUrl: menu.menuUrl,
            menuViewPath: menu.menuViewPath,
            menuNamePath: menu.menuNamePath,
          },
        ]);
        setActiveTabKey(key);
        updateUrl('/admin' + key);
        return;
      }

      setTabList((prev) => {
        if (prev.find((t) => t.key === key)) return prev;
        return [
          ...prev,
          {
            key,
            menuSeq: menu.menuSeq,
            menuNm: menu.menuNm,
            menuUrl: menu.menuUrl,
            menuViewPath: menu.menuViewPath,
            menuNamePath: menu.menuNamePath,
          },
        ];
      });
      setActiveTabKey(key);
      updateUrl('/admin' + key);
    },
    [tabList, setTabList, setActiveTabKey, confirm],
  );

  /**
   * 탭 닫기
   * - 닫은 탭이 현재 활성 탭이면 인접 탭으로 자동 전환
   * - 마지막 탭을 닫으면 대시보드('/')로 이동
   */
  const closeTab = useCallback(
    (key: string) => {
      const idx = tabList.findIndex((t) => t.key === key);
      if (idx === -1) return;

      const newList = tabList.filter((t) => t.key !== key);

      setTabList(newList);

      if (activeTabKeyRef.current === key) {
        if (newList.length === 0) {
          setActiveTabKey(null);
          pushPath('/admin', setCurrentPath);
        } else {
          const nextIdx = Math.min(idx, newList.length - 1);
          const nextKey = newList[nextIdx].key;
          setActiveTabKey(nextKey);
          updateUrl('/admin' + nextKey);
        }
      }
    },
    [tabList, setTabList, setActiveTabKey, setCurrentPath],
  );

  /** 특정 탭으로 전환 (탭 클릭 시) */
  const activateTab = useCallback(
    (key: string) => {
      setActiveTabKey(key);
      updateUrl('/admin' + key);
    },
    [setActiveTabKey],
  );

  /** 지정한 탭을 제외한 나머지 모두 닫기 (우클릭 메뉴 등) */
  const closeOtherTabs = useCallback(
    (key: string) => {
      setTabList((prev) => prev.filter((t) => t.key === key));
      setActiveTabKey(key);
      updateUrl('/admin' + key);
    },
    [setTabList, setActiveTabKey],
  );

  /** 모든 탭 닫기 → 대시보드로 이동 */
  const closeAllTabs = useCallback(() => {
    setTabList([]);
    setActiveTabKey(null);
    pushPath('/admin', setCurrentPath);
  }, [setTabList, setActiveTabKey, setCurrentPath]);

  return {
    tabMode,
    tabList,
    activeTabKey,
    openTab,
    closeTab,
    activateTab,
    closeOtherTabs,
    closeAllTabs,
  };
}
