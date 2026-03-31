import React from 'react';
import {message} from 'antd';
import {IudType} from '@interface/common';

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
