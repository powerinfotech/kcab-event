/**
 * usePermission - 메뉴 버튼 권한 조회 훅
 *
 * [목적]
 * 현재 활성 탭(메뉴)에 대해 사용자에게 부여된 버튼 권한을 조회한다.
 * hasButton()으로 특정 버튼의 표시 여부를 간편하게 확인할 수 있다.
 *
 * [동작 방식]
 * 1. 현재 활성 탭의 menuSeq를 자동 감지 (또는 직접 전달)
 * 2. callGetMenuBtnList API 호출 → 버튼 목록 조회
 * 3. hasButton(btnFuncCd)로 권한 체크
 *
 * [사용 방법]
 * @example
 * // 기본 사용 - 현재 활성 탭의 권한 자동 조회
 * const { hasButton, buttons, loaded } = usePermission();
 *
 * // 조건부 버튼 렌더링
 * {hasButton('cfmSave') && <CustomButton onClick={handleSave}>저장</CustomButton>}
 * {hasButton('cfmDelete') && <CustomButton onClick={handleDelete}>삭제</CustomButton>}
 *
 * // 특정 메뉴 시퀀스로 직접 조회
 * const { hasButton } = usePermission(menuSeq);
 *
 * // 로딩 완료 후 처리
 * if (loaded && !hasButton('cfmSearch')) {
 *   message.warning('조회 권한이 없습니다.');
 * }
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
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
    const activeTabKey = useAtomValue(activeTabKeyAtom);
    const tabList = useAtomValue(tabListAtom);

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
