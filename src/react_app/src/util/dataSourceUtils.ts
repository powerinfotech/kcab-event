import React from 'react';
import {message} from 'antd';
import {IudType} from '@interface/common';

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
    const newRowKeys = dataSource
        .filter(v => selectedKeys.includes(v[keyField] as React.Key) && v.iudType === IudType.I)
        .map(v => v[keyField] as React.Key);
    setter(
        dataSource
            .filter(v => !(selectedKeys.includes(v[keyField] as React.Key) && v.iudType === IudType.I))
            .map(v => selectedKeys.includes(v[keyField] as React.Key) ? {...v, iudType: IudType.D} : v)
    );
    setSelectedKeys(prev => prev.filter(key => !newRowKeys.includes(key)));
    return newRowKeys;
}
