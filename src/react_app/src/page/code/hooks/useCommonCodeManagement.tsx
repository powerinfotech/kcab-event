import { message } from '@util/antdMessage';
import React, {useEffect, useRef, useState} from 'react';
import type { TableColumnsType } from 'antd';
import {useForm} from 'react-hook-form';
import {HttpStatusCode} from 'axios';
import CustomInput from '@component/input/CustomInput';
import CustomCheckbox from '@component/select/CustomCheckbox';
import {IUD_COLUMN} from '@component/display/CustomTable';
import EditableFormCell from '@component/special/EditableFormCell';
import {ComGrpCdList} from '@interface/code/CommonGroupCode';
import {ComCdList} from '@interface/code/CommonCode';
import {IudType} from '@interface/common';
import {callGetComGrpCdList} from '@api/code/CommonGroupCodeApi';
import {callGetComCdList, callSaveComCd} from '@api/code/CommonCodeApi';
import {useMessage} from '@hook/useMessage';
import {applyDataChange} from '@util/dataSourceUtils';
import {ALPHANUMERIC_REGEXP, INTEGER_REGEXP} from '@util/validationPatterns';

export function useCommonCodeManagement() {
    const form = useForm<any>({mode: 'onSubmit'});
    const {register, unregister, control, setValue} = form;
    const {confirm} = useMessage();
    const tempSeqRef = useRef(-1);

    const searchForm = useForm<{searchText: string; showAll: boolean}>({
        defaultValues: {
            searchText: typeof window === 'undefined' ? '' : (new URLSearchParams(window.location.search).get('comGrpCd') ?? ''),
            showAll: false,
        },
    });

    const [grpDataSource, setGrpDataSource] = useState<ComGrpCdList[]>([]);
    const [selectedGrpRowIndex, setSelectedGrpRowIndex] = useState<number | undefined>(undefined);
    const [selectedGrpCd, setSelectedGrpCd] = useState<ComGrpCdList | null>(null);

    const [comCdDataSource, setComCdDataSource] = useState<ComCdList[]>([]);
    const [orgComCdDataSource, setOrgComCdDataSource] = useState<ComCdList[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const isChanged = comCdDataSource.some(v => v.iudType);

    const handleDataChange = (record: ComCdList, key: string, value: any) =>
        applyDataChange(setComCdDataSource, 'comCdSeq', record, key, value);

    const fetchGrpList = async (showAllFlag?: boolean) => {
        const useYn = (showAllFlag ?? searchForm.getValues('showAll')) ? undefined : 'Y';
        const res = await callGetComGrpCdList(searchForm.getValues('searchText'), useYn);
        if (res.code === HttpStatusCode.Ok) {
            const items = structuredClone(res.item);
            setGrpDataSource(items);
            setSelectedRowKeys([]);
            if (items.length > 0) {
                setSelectedGrpRowIndex(0);
                setSelectedGrpCd(items[0]);
                await fetchComCdList(items[0].comGrpCdSeq);
            } else {
                setSelectedGrpRowIndex(undefined);
                setSelectedGrpCd(null);
                setComCdDataSource([]);
                setOrgComCdDataSource([]);
            }
        }
    };

    const fetchComCdList = async (comGrpCdSeq: number) => {
        const res = await callGetComCdList(comGrpCdSeq);
        if (res.code === HttpStatusCode.Ok) {
            setOrgComCdDataSource(structuredClone(res.item));
            setComCdDataSource(structuredClone(res.item));
            setSelectedRowKeys([]);
        }
    };

    const handleGrpRowClick = async (record: ComGrpCdList, index: number) => {
        if (isChanged) {
            if (!await confirm('저장하지 않은 내용은 초기화 됩니다. 계속 하시겠습니까?')) return false;
        }
        setSelectedGrpRowIndex(index);
        setSelectedGrpCd(record);
        await fetchComCdList(record.comGrpCdSeq);
        return true;
    };

    const handleSearch = async () => {
        if (isChanged) {
            if (!await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?')) return;
        }
        await fetchGrpList();
    };

    const handleReset = async () => {
        if (isChanged) {
            if (!await confirm('저장하지 않은 정보는 초기화됩니다. 계속 하시겠습니까?')) return;
        }
        searchForm.reset({searchText: '', showAll: false});
        setGrpDataSource([]);
        setSelectedGrpRowIndex(undefined);
        setSelectedGrpCd(null);
        setComCdDataSource([]);
        setOrgComCdDataSource([]);
        setSelectedRowKeys([]);
    };

    const handleAddRow = () => {
        if (!selectedGrpCd) {
            message.info('공통그룹코드를 먼저 선택해 주세요.');
            return;
        }
        const tempSeq = tempSeqRef.current--;
        setComCdDataSource(prev => [...prev, {
            comCdSeq: tempSeq,
            comGrpCdSeq: selectedGrpCd.comGrpCdSeq,
            comCd: '', comStdCd: '', comCdNm: '', comCdDesc: '',
            refval01: '', refval02: '', refval03: '',
            sortSeq: 0, useYn: 'Y', iudType: IudType.I,
        }]);
    };

    const handleDeleteRow = async () => {
        if (selectedRowKeys.length === 0) {
            message.info('선택한 내용이 없습니다.');
            return;
        }

        const selectedItems = comCdDataSource.filter(v => selectedRowKeys.includes(v.comCdSeq));
        selectedItems.forEach(v => unregister(`${v.comCdSeq}_comCd`));

        setComCdDataSource(prev => prev
            .filter(v => !(selectedRowKeys.includes(v.comCdSeq) && v.iudType === IudType.I))
            .map(v => selectedRowKeys.includes(v.comCdSeq) ? {...v, iudType: IudType.D} : v)
        );
        setSelectedRowKeys([]);
    };

    const handleSave = async () => {
        if (!selectedGrpCd) {
            message.info('공통그룹코드를 먼저 선택해 주세요.');
            return;
        }
        if (!isChanged) {
            message.info('변경된 내용이 없습니다.');
            return;
        }
        if (!await confirm('저장 하시겠습니까?')) return;

        const changedItems = comCdDataSource.filter(v => v.iudType);
        const allItems = [
            ...changedItems.map(v => v.iudType === IudType.I ? {...v, comCdSeq: undefined} : v)
        ] as ComCdList[];

        try {
            const res = await callSaveComCd({
                comGrpCdSeq: selectedGrpCd.comGrpCdSeq,
                comGrpCd: selectedGrpCd.comGrpCd,
                comCdList: allItems,
            });
            if (res.code !== HttpStatusCode.Ok) return;
            message.success('저장되었습니다.');
            await fetchComCdList(selectedGrpCd.comGrpCdSeq);
        } catch {
            // handled by axios interceptor
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const comCdRegExp = ALPHANUMERIC_REGEXP;
    const integerRegExp = INTEGER_REGEXP;

    const grpColumns: TableColumnsType<ComGrpCdList> = [
        {title: '공통그룹코드', key: 'comGrpCd', dataIndex: 'comGrpCd', align: 'center', width: 120},
        {title: '공통그룹코드명', key: 'comGrpCdNm', dataIndex: 'comGrpCdNm', align: 'center', width: ""},
        {title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: 80,
            render: (value: string) => value === 'Y' ? '예' : '아니오'},
    ];

    const comCdColumns: TableColumnsType<ComCdList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">공통코드<em>*</em></span>,
            key: 'comCd', dataIndex: 'comCd', align: 'center', width: 100, fixed: 'left',
            render: (value: string, record: ComCdList) =>
                record.comCdSeq > 0
                    ? <span>{value}</span>
                    : <EditableFormCell record={record} seqField="comCdSeq" fieldSuffix="comCd"
                          value={value} setValue={setValue} control={control} register={register}
                          onDataChange={handleDataChange} requiredMessage="공통코드는 필수입력입니다."
                          maxLength={20} regExp={comCdRegExp} transformValue={(v) => v.toUpperCase()}/>,
        },
        {
            title: '코드명', key: 'comCdNm', dataIndex: 'comCdNm', align: 'center', width: 120,
            render: (value: string, record: ComCdList) =>
                <CustomInput value={value} maxLength={100}
                    onChange={(e) => handleDataChange(record, 'comCdNm', e.target.value)}/>,
        },
        {
            title: '설명', key: 'comCdDesc', dataIndex: 'comCdDesc', align: 'center', width: 150,
            render: (value: string, record: ComCdList) =>
                <CustomInput value={value} maxLength={200}
                    onChange={(e) => handleDataChange(record, 'comCdDesc', e.target.value)}/>,
        },
        {
            title: '조회순서', key: 'sortSeq', dataIndex: 'sortSeq', align: 'center', width: 80,
            render: (value: number, record: ComCdList) =>
                <CustomInput value={value ?? ''} maxLength={10} regExp={integerRegExp}
                    onChange={(e) => handleDataChange(record, 'sortSeq', e.target.value === '' ? null : Number(e.target.value))}/>,
        },
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: 80,
            render: (value: string, record: ComCdList) =>
                <CustomCheckbox checked={value === 'Y'}
                    onChange={(e) => handleDataChange(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>,
        },
        {
            title: '관리항목(문자형)',
            children: [
                {title: '문자형1', key: 'refval01', dataIndex: 'refval01', align: 'center', width: 100, render: (value: string, record: ComCdList) => <CustomInput value={value} maxLength={100} onChange={(e) => handleDataChange(record, 'refval01', e.target.value)}/>},
                {title: '문자형2', key: 'refval02', dataIndex: 'refval02', align: 'center', width: 100, render: (value: string, record: ComCdList) => <CustomInput value={value} maxLength={100} onChange={(e) => handleDataChange(record, 'refval02', e.target.value)}/>},
                {title: '문자형3', key: 'refval03', dataIndex: 'refval03', align: 'center', width: 100, render: (value: string, record: ComCdList) => <CustomInput value={value} maxLength={100} onChange={(e) => handleDataChange(record, 'refval03', e.target.value)}/>},
            ],
        },
    ];

    useEffect(() => {
        fetchGrpList();
    }, []);

    return {
        form,
        searchForm,
        grpDataSource,
        selectedGrpRowIndex,
        comCdDataSource,
        selectedRowKeys,
        setSelectedRowKeys,
        grpColumns,
        comCdColumns,
        handleGrpRowClick,
        handleSearch,
        handleReset,
        handleAddRow,
        handleDeleteRow,
        handleSave,
        handleKeyDown,
    };
}
