/**
 * usePageHandlers - 페이지 버튼 핸들러 등록 훅
 *
 * [목적]
 * 각 페이지에서 정의한 버튼 핸들러(조회, 저장, 삭제 등)를
 * 상위 레이아웃의 MenuButtonBar에 연결한다.
 * handlersRef를 통해 부모(레이아웃) ↔ 자식(페이지) 간 핸들러를 공유.
 *
 * [동작 방식]
 * 1. 매 렌더 시 handlersRef.current를 최신 handlers로 갱신
 * 2. 컴포넌트 언마운트 시 handlersRef를 빈 객체로 초기화 (이전 페이지 핸들러 잔류 방지)
 *
 * [사용 방법]
 * @example
 * // 페이지 컴포넌트에서 사용
 * const UserManagement = ({ handlersRef }: PageProps) => {
 *   const handleSearch = () => { ... };
 *   const handleSave = () => { ... };
 *   const handleDelete = () => { ... };
 *
 *   // 버튼 기능코드(btnFuncCd)를 키로 핸들러 등록
 *   usePageHandlers(handlersRef, {
 *     cfmSearch: handleSearch,    // 조회 버튼
 *     cfmSave: handleSave,        // 저장 버튼
 *     cfmDelete: handleDelete,    // 삭제 버튼
 *     cfmInit: handleReset,       // 초기화 버튼
 *   });
 *
 *   return ( ... );
 * };
 *
 * // MenuButtonBar에서 btnFuncCd로 핸들러 호출
 * // handlersRef.current['cfmSave']?.() → handleSave 실행
 */
import React, {useEffect} from 'react';
import {PageButtonHandlers} from '@interface/common';

/**
 * 페이지 버튼 핸들러를 handlersRef에 등록하는 훅
 *
 * @param handlersRef - 부모로부터 전달받은 핸들러 참조 (MutableRefObject)
 * @param handlers    - 현재 페이지의 버튼 핸들러 객체 { btnFuncCd: handler }
 */
export function usePageHandlers(
    handlersRef: React.MutableRefObject<PageButtonHandlers> | undefined,
    handlers: PageButtonHandlers,
): void {
    // 매 렌더 시 최신 핸들러로 갱신 (deps 없음 = 매번 실행)
    useEffect(() => {
        if (handlersRef) handlersRef.current = handlers;
    });
    // 언마운트 시 핸들러 초기화 (이전 페이지 핸들러 잔류 방지)
    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);
}
