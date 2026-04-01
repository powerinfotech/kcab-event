/**
 * dataSourceUtils - 테이블 데이터 상태 변경 유틸 (IUD 패턴)
 *
 * [목적]
 * Ant Design Table의 dataSource(배열 상태)에 대해 행 추가, 단건 수정, 일괄 삭제를 처리한다.
 * IUD(Insert/Update/Delete) 패턴으로 변경 이력을 추적하여 서버 저장 시 한 번에 전송.
 *
 * [IUD 패턴 설명]
 * - I (Insert) : 클라이언트에서 새로 추가한 행 → 서버에 INSERT
 * - U (Update) : 기존 행을 수정한 행 → 서버에 UPDATE
 * - D (Delete) : 삭제 표시한 행 → 서버에 DELETE
 * - 신규 행(I)을 삭제하면 목록에서 즉시 제거 (서버에 없으므로 DELETE 불필요)
 *
 * [사용 방법]
 * @example
 * import { applyAddRow, applyDataChange, applyDeleteRows } from '@util/dataSourceUtils';
 *
 * // 신규 행 추가 (예: 추가 버튼 클릭 시)
 * applyAddRow(setDataSource, { userSeq: Date.now(), userName: '', iudType: 'I' });
 *
 * // 단건 필드 수정 (예: 테이블 셀 편집 시)
 * applyDataChange(setDataSource, 'userSeq', record, 'userName', '홍길동');
 *
 * // 선택한 행 일괄 삭제 (예: 삭제 버튼 클릭 시)
 * applyDeleteRows(dataSource, setDataSource, selectedKeys, setSelectedKeys, 'userSeq');
 *
 * // 저장 시 IUD 분류
 * const insertRows  = dataSource.filter(r => r.iudType === 'I');
 * const updateRows  = dataSource.filter(r => r.iudType === 'U');
 * const deleteRows  = dataSource.filter(r => r.iudType === 'D');
 */
import React from 'react';
import {message} from 'antd';
import {IudType} from '@interface/common';

/**
 * 테이블에 신규 행 추가 (iudType = I)
 * - 전달한 newRow 객체를 dataSource 맨 뒤에 추가한다.
 * - newRow에 iudType이 없으면 자동으로 I를 설정한다.
 * - uid 등 고유 키는 호출부에서 직접 지정해야 한다 (예: Date.now()).
 *
 * @param setter - dataSource 상태 setter
 * @param newRow - 추가할 행 데이터 (iudType은 자동 설정)
 *
 * @example
 * // 추가 버튼 클릭 시
 * applyAddRow(setDataSource, {
 *   userSeq: Date.now(),   // 임시 고유 키
 *   userName: '',
 *   useYn: 'Y',
 * });
 *
 * // 맨 앞에 추가하고 싶을 때는 setter를 직접 사용
 * setDataSource(prev => [{ ...newRow, iudType: IudType.I }, ...prev]);
 */
export function applyAddRow<T extends Record<string, any>>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    newRow: T,
): void {
    setter(prev => [...prev, { ...newRow, iudType: IudType.I }]);
}

/**
 * 테이블 데이터 단건 필드 수정
 * - keyField로 대상 행을 찾아 해당 field의 값을 value로 변경
 * - 기존 값과 동일하면 변경하지 않음
 * - 신규 행(iudType=I)은 iudType을 유지하고, 그 외에는 수정(iudType=U)으로 변경
 *
 * @param setter    - dataSource 상태 setter
 * @param keyField  - 행을 식별하는 고유 키 필드명
 * @param record    - 수정 대상 행 데이터
 * @param field     - 변경할 필드명
 * @param value     - 변경할 값
 */
export function applyDataChange<T extends Record<string, any>>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    keyField: keyof T,
    record: T,
    field: string,
    value: any,
) {
    setter(prev => prev.map(item =>
        item[keyField] === record[keyField]
            ? item[field] === value ? item
                : {...item, [field]: value, iudType: item.iudType !== IudType.I ? IudType.U : item.iudType}
            : item
    ));
}

/**
 * 테이블 선택 행 일괄 삭제 처리
 * - 신규 행(iudType=I): 목록에서 즉시 제거
 * - 기존 행: iudType을 삭제(D)로 변경하여 서버 저장 시 삭제 처리
 * - 선택된 항목이 없으면 안내 메시지 표시 후 null 반환
 *
 * @param dataSource      - 현재 테이블 데이터
 * @param setter          - dataSource 상태 setter
 * @param selectedKeys    - 선택된 행의 키 목록
 * @param setSelectedKeys - 선택 키 상태 setter (삭제된 신규 행 키를 제거)
 * @param keyField        - 행을 식별하는 고유 키 필드명
 * @returns 제거된 신규 행의 키 목록 (선택 항목 없으면 null)
 */
export function applyDeleteRows<T extends { iudType?: IudType }>(
    dataSource: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    selectedKeys: React.Key[],
    setSelectedKeys: React.Dispatch<React.SetStateAction<React.Key[]>>,
    keyField: keyof T,
): React.Key[] | null {
    if (selectedKeys.length === 0) {
        message.info('선택한 내용이 없습니다.');
        return null;
    }

    // 신규 행(I) 중 선택된 항목의 키 추출 (목록에서 바로 제거할 대상)
    const newRowKeys = dataSource
        .filter(v => selectedKeys.includes(v[keyField] as React.Key) && v.iudType === IudType.I)
        .map(v => v[keyField] as React.Key);

    // 신규 행은 제거, 기존 행은 iudType을 D로 변경
    setter(
        dataSource
            .filter(v => !(selectedKeys.includes(v[keyField] as React.Key) && v.iudType === IudType.I))
            .map(v => selectedKeys.includes(v[keyField] as React.Key) ? {...v, iudType: IudType.D} : v)
    );

    // 제거된 신규 행의 키를 선택 목록에서도 해제
    setSelectedKeys(prev => prev.filter(key => !newRowKeys.includes(key)));
    return newRowKeys;
}
