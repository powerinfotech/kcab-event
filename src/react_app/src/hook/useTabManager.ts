import { useCallback, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/navigation';
import { tabListAtom, activeTabKeyAtom } from '@atom/tabListAtom';
import { tabModeAtom } from '@atom/tabModeAtom';
import { useMessage } from '@hook/useMessage';
import { MenuInfo } from '@interface/auth/MenuManagement';

const MAX_TABS = 10;

function updateUrl(url: string) {
  if (typeof window !== 'undefined') {
    window.history.pushState(null, '', url);
  }
}

export default function useTabManager() {
  const router = useRouter();
  const { confirm } = useMessage();
  const tabMode = useRecoilValue(tabModeAtom);
  const [tabList, setTabList] = useRecoilState(tabListAtom);
  const [activeTabKey, setActiveTabKey] = useRecoilState(activeTabKeyAtom);

  // closeTab에서 최신 activeTabKey를 읽기 위한 ref
  const activeTabKeyRef = useRef(activeTabKey);
  activeTabKeyRef.current = activeTabKey;

  const openTab = useCallback(
    async (menu: MenuInfo) => {
      const key = menu.menuUrl;

      // 이미 열려있으면 활성화만
      if (tabList.find((t) => t.key === key)) {
        setActiveTabKey(key);
        updateUrl(key);
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
        updateUrl(key);
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
      updateUrl(key);
    },
    [tabList, setTabList, setActiveTabKey, confirm],
  );

  const closeTab = useCallback(
    (key: string) => {
      const idx = tabList.findIndex((t) => t.key === key);
      if (idx === -1) return;

      const newList = tabList.filter((t) => t.key !== key);

      setTabList(newList);

      if (activeTabKeyRef.current === key) {
        if (newList.length === 0) {
          setActiveTabKey(null);
          router.push('/');
        } else {
          const nextIdx = Math.min(idx, newList.length - 1);
          const nextKey = newList[nextIdx].key;
          setActiveTabKey(nextKey);
          updateUrl(nextKey);
        }
      }
    },
    [tabList, setTabList, setActiveTabKey, router],
  );

  const activateTab = useCallback(
    (key: string) => {
      setActiveTabKey(key);
      updateUrl(key);
    },
    [setActiveTabKey],
  );

  const closeOtherTabs = useCallback(
    (key: string) => {
      setTabList((prev) => prev.filter((t) => t.key === key));
      setActiveTabKey(key);
      updateUrl(key);
    },
    [setTabList, setActiveTabKey],
  );

  const closeAllTabs = useCallback(() => {
    setTabList([]);
    setActiveTabKey(null);
    router.push('/');
  }, [setTabList, setActiveTabKey, router]);

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
