import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { activeTabKeyAtom, tabListAtom } from '@atom/tabListAtom';
import { callGetMenuBtnList } from '@api/CommonApi';
import { MenuBtnDetail } from '@interface/common';

interface UsePermissionReturn {
    /** 특정 버튼 기능코드에 대한 권한 여부 */
    hasButton: (btnFuncCd: string) => boolean;
    /** 현재 메뉴의 버튼 목록 */
    buttons: MenuBtnDetail[];
    /** 버튼 목록 로딩 완료 여부 */
    loaded: boolean;
}

/**
 * 현재 활성 탭(메뉴)의 버튼 권한을 조회하는 훅
 * @param menuSeq 메뉴 시퀀스 (미입력 시 현재 활성 탭의 menuSeq 사용)
 * @example
 * const { hasButton, buttons } = usePermission();
 * if (hasButton('cfmSave')) { // 저장 버튼 표시 }
 */
export function usePermission(menuSeq?: number): UsePermissionReturn {
    const activeTabKey = useRecoilValue(activeTabKeyAtom);
    const tabList = useRecoilValue(tabListAtom);

    const resolvedMenuSeq = useMemo(() => {
        if (menuSeq != null) return menuSeq;
        const activeTab = tabList.find((tab) => tab.key === activeTabKey);
        return activeTab?.menuSeq ?? null;
    }, [menuSeq, activeTabKey, tabList]);

    const [buttons, setButtons] = useState<MenuBtnDetail[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (resolvedMenuSeq == null) {
            setButtons([]);
            setLoaded(true);
            return;
        }

        let cancelled = false;
        callGetMenuBtnList(resolvedMenuSeq)
            .then((res) => {
                if (!cancelled) {
                    setButtons(res.item ?? []);
                    setLoaded(true);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setButtons([]);
                    setLoaded(true);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [resolvedMenuSeq]);

    const hasButton = useCallback(
        (btnFuncCd: string) => buttons.some((btn) => btn.btnFuncCd === btnFuncCd),
        [buttons]
    );

    return { hasButton, buttons, loaded };
}
