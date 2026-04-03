import {message} from '@util/antdMessage';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import type {TableColumnsType} from 'antd';
import {useForm} from 'react-hook-form';
import {HttpStatusCode} from 'axios';
import CustomInput from '@component/input/CustomInput';
import CustomCheckbox from '@component/select/CustomCheckbox';
import {IUD_COLUMN} from '@component/display/CustomTable';
import EditableFormCell from '@component/special/EditableFormCell';
import {ComGrpCdList} from '@interface/code/CommonGroupCode';
import {ComCdList} from '@interface/code/CommonCode';
import {IudType} from '@interface/common';
import {callGetComGrpCdList, callSaveComGrpCd} from '@api/code/CommonGroupCodeApi';
import {callGetComCdList, callSaveComCd} from '@api/code/CommonCodeApi';
import {useMessage} from '@hook/useMessage';
import {applyDataChange} from '@util/dataSourceUtils';
import {ALPHANUMERIC_REGEXP, INTEGER_REGEXP, FLOAT_REGEXP} from '@util/validationPatterns';

// ref 필드 정의
const REF_FIELDS = [
    {ref: 'ref01', refval: 'refval01', type: 'string', label: '문자형1'},
    {ref: 'ref02', refval: 'refval02', type: 'string', label: '문자형2'},
    {ref: 'ref03', refval: 'refval03', type: 'string', label: '문자형3'},
    {ref: 'ref04', refval: 'refval04', type: 'string', label: '문자형4'},
    {ref: 'ref05', refval: 'refval05', type: 'string', label: '문자형5'},
    {ref: 'ref06', refval: 'refval06', type: 'integer', label: '정수형1'},
    {ref: 'ref07', refval: 'refval07', type: 'integer', label: '정수형2'},
    {ref: 'ref08', refval: 'refval08', type: 'integer', label: '정수형3'},
    {ref: 'ref09', refval: 'refval09', type: 'integer', label: '정수형4'},
    {ref: 'ref10', refval: 'refval10', type: 'integer', label: '정수형5'},
    {ref: 'ref11', refval: 'refval11', type: 'float', label: '실수형1'},
    {ref: 'ref12', refval: 'refval12', type: 'float', label: '실수형2'},
    {ref: 'ref13', refval: 'refval13', type: 'float', label: '실수형3'},
    {ref: 'ref14', refval: 'refval14', type: 'float', label: '실수형4'},
    {ref: 'ref15', refval: 'refval15', type: 'float', label: '실수형5'},
];

export {REF_FIELDS};

export function useCommonCodeIntegrated() {
    const grpForm = useForm<any>({mode: 'onSubmit'});
    const comForm = useForm<any>({mode: 'onSubmit'});
    const {confirm} = useMessage();
    const tempSeqRef = useRef(-1);

    const searchForm = useForm<{searchText: string; showAll: boolean}>({
        defaultValues: {searchText: '', showAll: false},
    });

    // ── Group State ──
    const [grpDataSource, setGrpDataSource] = useState<ComGrpCdList[]>([]);
    const [orgGrpDataSource, setOrgGrpDataSource] = useState<ComGrpCdList[]>([]);
    const [selectedGrpRowIndex, setSelectedGrpRowIndex] = useState<number | undefined>(undefined);
    const [selectedGrpCd, setSelectedGrpCd] = useState<ComGrpCdList | null>(null);
    const [selectedGrpRowKeys, setSelectedGrpRowKeys] = useState<React.Key[]>([]);

    // ── Code State ──
    const [comCdDataSource, setComCdDataSource] = useState<ComCdList[]>([]);
    const [orgComCdDataSource, setOrgComCdDataSource] = useState<ComCdList[]>([]);
    const [selectedComCdRowKeys, setSelectedComCdRowKeys] = useState<React.Key[]>([]);

    // ── Derived ──
    const isGrpChanged = grpDataSource.some(v => v.iudType);
    const isComCdChanged = comCdDataSource.some(v => v.iudType);
    const isAnyChanged = isGrpChanged || isComCdChanged;

    // ── Data Change Handlers ──
    const handleGrpDataChange = (record: ComGrpCdList, key: string, value: any) =>
        applyDataChange(setGrpDataSource, 'comGrpCdSeq', record, key, value);

    const handleComCdDataChange = (record: ComCdList, key: string, value: any) =>
        applyDataChange(setComCdDataSource, 'comCdSeq', record, key, value);

    // ── Group Detail Change (ref 편집 → 동적 컬럼 즉시 반영) ──
    const handleGrpDetailChange = (field: string, value: string) => {
        if (!selectedGrpCd) return;
        const updated = {...selectedGrpCd, [field]: value};
        if (!selectedGrpCd.iudType || selectedGrpCd.iudType !== IudType.I) {
            updated.iudType = IudType.U;
        }
        setSelectedGrpCd(updated);
        setGrpDataSource(prev => prev.map(g =>
            g.comGrpCdSeq === selectedGrpCd.comGrpCdSeq ? updated : g
        ));
    };

    // ── Fetch ──
    const fetchGrpList = async (showAllFlag?: boolean) => {
        const useYn = (showAllFlag ?? searchForm.getValues('showAll')) ? undefined : 'Y';
        const res = await callGetComGrpCdList(searchForm.getValues('searchText'), useYn);
        if (res.code === HttpStatusCode.Ok) {
            const items = structuredClone(res.item);
            setGrpDataSource(items);
            setOrgGrpDataSource(structuredClone(res.item));
            setSelectedGrpRowKeys([]);
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
            setSelectedComCdRowKeys([]);
        }
    };

    // ── Group Row Click ──
    const handleGrpRowClick = async (record: ComGrpCdList, index: number) => {
        if (index === selectedGrpRowIndex) return;
        if (isComCdChanged) {
            if (!await confirm('저장하지 않은 내용은 초기화 됩니다. 계속 하시겠습니까?')) return;
        }
        setSelectedGrpRowIndex(index);
        setSelectedGrpCd(record);
        if (record.rgstUserSeq && record.comGrpCdSeq > 0) {
            await fetchComCdList(record.comGrpCdSeq);
        } else {
            setComCdDataSource([]);
            setOrgComCdDataSource([]);
        }
    };

    // ── Group CRUD ──
    const handleAddGrp = () => {
        const tempSeq = tempSeqRef.current--;
        const maxSort = grpDataSource.reduce((max, v) => Math.max(max, v.sortSeq ?? 0), 0);
        setGrpDataSource(prev => [...prev, {
            comGrpCdSeq: tempSeq, comGrpCd: '', comGrpCdNm: '', comGrpCdDesc: '',
            ref01: '', ref02: '', ref03: '', ref04: '', ref05: '',
            ref06: '', ref07: '', ref08: '', ref09: '', ref10: '',
            ref11: '', ref12: '', ref13: '', ref14: '', ref15: '',
            sortSeq: maxSort + 1, useYn: 'Y', iudType: IudType.I,
        }]);
    };

    const handleDeleteGrp = async () => {
        if (selectedGrpRowKeys.length === 0) {
            message.info('선택한 내용이 없습니다.');
            return;
        }
        const hasUnsavedOnly = grpDataSource
            .filter(v => selectedGrpRowKeys.includes(v.comGrpCdSeq))
            .every(v => v.iudType === IudType.I);
        if (!hasUnsavedOnly) {
            message.info('저장된 공통그룹코드는 삭제할 수 없습니다. 사용여부를 N으로 변경해 주세요.');
            return;
        }
        if (!await confirm('삭제하시겠습니까?')) return;
        selectedGrpRowKeys.forEach(seq => grpForm.unregister(`${String(seq)}_comGrpCd`));
        setGrpDataSource(prev => prev.filter(v => !selectedGrpRowKeys.includes(v.comGrpCdSeq)));
        setSelectedGrpRowKeys([]);
    };

    // ── Code CRUD ──
    const handleAddComCd = () => {
        if (!selectedGrpCd) {
            message.info('공통그룹코드를 먼저 선택해 주세요.');
            return;
        }
        const tempSeq = tempSeqRef.current--;
        const maxSort = comCdDataSource.reduce((max, v) => Math.max(max, v.sortSeq ?? 0), 0);
        setComCdDataSource(prev => [...prev, {
            comCdSeq: tempSeq, comGrpCdSeq: selectedGrpCd.comGrpCdSeq,
            comCd: '', comStdCd: '', comCdNm: '', comCdDesc: '',
            refval01: '', refval02: '', refval03: '', refval04: '', refval05: '',
            refval06: '', refval07: '', refval08: '', refval09: '', refval10: '',
            refval11: '', refval12: '', refval13: '', refval14: '', refval15: '',
            sortSeq: maxSort + 1, useYn: 'Y', iudType: IudType.I,
        }]);
    };

    const handleDeleteComCd = async () => {
        if (selectedComCdRowKeys.length === 0) {
            message.info('선택한 내용이 없습니다.');
            return;
        }
        selectedComCdRowKeys.forEach(seq => comForm.unregister(`${String(seq)}_comCd`));
        setComCdDataSource(prev => prev
            .filter(v => !(selectedComCdRowKeys.includes(v.comCdSeq) && v.iudType === IudType.I))
            .map(v => selectedComCdRowKeys.includes(v.comCdSeq) ? {...v, iudType: IudType.D} : v)
        );
        setSelectedComCdRowKeys([]);
    };

    // ── Save (그룹 → 코드 순차) ──
    const handleSave = async () => {
        if (!isAnyChanged) {
            message.info('변경된 내용이 없습니다.');
            return;
        }
        if (!await confirm('저장 하시겠습니까?')) return;

        try {
            // 1. 그룹 저장
            if (isGrpChanged) {
                const changedGrps = grpDataSource.filter(v => v.iudType);
                const res = await callSaveComGrpCd({
                    comGrpCdList: changedGrps.map(v =>
                        v.iudType === IudType.I ? {...v, comGrpCdSeq: undefined} : v
                    ) as ComGrpCdList[],
                });
                if (res.code !== HttpStatusCode.Ok) return;
            }

            // 2. 코드 저장
            if (isComCdChanged && selectedGrpCd) {
                const changedCds = comCdDataSource.filter(v => v.iudType);
                const res = await callSaveComCd({
                    comGrpCdSeq: selectedGrpCd.comGrpCdSeq,
                    comGrpCd: selectedGrpCd.comGrpCd,
                    comCdList: changedCds.map(v =>
                        v.iudType === IudType.I ? {...v, comCdSeq: undefined} : v
                    ) as ComCdList[],
                });
                if (res.code !== HttpStatusCode.Ok) return;
            }

            message.success('저장되었습니다.');
            await fetchGrpList(searchForm.getValues('showAll'));
        } catch {
            // handled by axios interceptor
        }
    };

    // ── Search / Reset ──
    const handleSearch = async () => {
        if (isAnyChanged) {
            if (!await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?')) return;
        }
        await fetchGrpList();
    };

    const handleReset = async () => {
        if (isAnyChanged) {
            if (!await confirm('저장하지 않은 정보는 초기화됩니다. 계속 하시겠습니까?')) return;
        }
        searchForm.reset({searchText: '', showAll: false});
        setSelectedGrpRowIndex(undefined);
        setSelectedGrpCd(null);
        setGrpDataSource([]);
        setOrgGrpDataSource([]);
        setSelectedGrpRowKeys([]);
        setComCdDataSource([]);
        setOrgComCdDataSource([]);
        setSelectedComCdRowKeys([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { e.preventDefault(); handleSearch(); }
    };

    // ── Group Table Columns ──
    const comGrpCdRegExp = ALPHANUMERIC_REGEXP;
    const grpColumns: TableColumnsType<ComGrpCdList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">그룹코드<em>*</em></span>,
            key: 'comGrpCd', dataIndex: 'comGrpCd', align: 'center', width: 90,
            render: (value: string, record: ComGrpCdList) =>
                record.rgstUserSeq
                    ? <span>{value}</span>
                    : <EditableFormCell record={record} seqField="comGrpCdSeq" fieldSuffix="comGrpCd"
                          value={value} setValue={grpForm.setValue} control={grpForm.control} register={grpForm.register}
                          onDataChange={handleGrpDataChange} requiredMessage="분류코드는 필수입력입니다."
                          maxLength={20} regExp={comGrpCdRegExp} transformValue={(v) => v.toUpperCase()}/>,
        },
        {
            title: '코드명', key: 'comGrpCdNm', dataIndex: 'comGrpCdNm', align: 'center',
            render: (value: string, record: ComGrpCdList) =>
                <CustomInput value={value} maxLength={100}
                    onChange={(e) => handleGrpDataChange(record, 'comGrpCdNm', e.target.value)}/>,
        },
        {
            title: '정렬', key: 'sortSeq', dataIndex: 'sortSeq', align: 'right', width: 60,
            render: (value: number, record: ComGrpCdList) =>
                <CustomInput value={value ?? ''} maxLength={10} style={{textAlign: 'right'}}
                    onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '');
                        handleGrpDataChange(record, 'sortSeq', v === '' ? null : Number(v));
                    }}/>,
        },
        {
            title: '사용', key: 'useYn', dataIndex: 'useYn', align: 'center', width: 60,
            render: (value: string, record: ComGrpCdList) =>
                <CustomCheckbox checked={value === 'Y'}
                    onChange={(e) => handleGrpDataChange(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>,
        },
    ];

    // ── Dynamic Code Table Columns ──
    const comCdRegExp = ALPHANUMERIC_REGEXP;
    const integerRegExp = INTEGER_REGEXP;
    const floatRegExp = FLOAT_REGEXP;

    const dynamicComCdColumns: TableColumnsType<ComCdList> = useMemo(() => {
        const fixedCols: TableColumnsType<ComCdList> = [
            IUD_COLUMN,
            {
                title: <span className="tit">공통코드<em>*</em></span>,
                key: 'comCd', dataIndex: 'comCd', align: 'center', width: 80, fixed: 'left',
                render: (value: string, record: ComCdList) =>
                    record.rgstUserSeq
                        ? <span>{value}</span>
                        : <EditableFormCell record={record} seqField="comCdSeq" fieldSuffix="comCd"
                              value={value} setValue={comForm.setValue} control={comForm.control} register={comForm.register}
                              onDataChange={handleComCdDataChange} requiredMessage="공통코드는 필수입력입니다."
                              maxLength={20} regExp={comCdRegExp} transformValue={(v) => v.toUpperCase()}/>,
            },
            {
                title: '코드명', key: 'comCdNm', dataIndex: 'comCdNm', align: 'center', width: 120,
                render: (value: string, record: ComCdList) =>
                    <CustomInput value={value} maxLength={100}
                        onChange={(e) => handleComCdDataChange(record, 'comCdNm', e.target.value)}/>,
            },
            {
                title: '설명', key: 'comCdDesc', dataIndex: 'comCdDesc', align: 'center', width: 150,
                render: (value: string, record: ComCdList) =>
                    <CustomInput value={value} maxLength={200}
                        onChange={(e) => handleComCdDataChange(record, 'comCdDesc', e.target.value)}/>,
            },
            {
                title: '정렬', key: 'sortSeq', dataIndex: 'sortSeq', align: 'right', width: 70,
                render: (value: number, record: ComCdList) =>
                    <CustomInput value={value ?? ''} maxLength={10}
                        onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '');
                            handleComCdDataChange(record, 'sortSeq', v === '' ? null : Number(v));
                        }}/>,
            },
            {
                title: '사용', key: 'useYn', dataIndex: 'useYn', align: 'center', width: 60,
                render: (value: string, record: ComCdList) =>
                    <CustomCheckbox checked={value === 'Y'}
                        onChange={(e) => handleComCdDataChange(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>,
            },
        ];

        // 동적 컬럼: selectedGrpCd의 ref값이 있는 것만 추가
        const dynCols: TableColumnsType<ComCdList> = REF_FIELDS
            .filter(f => selectedGrpCd?.[f.ref]?.trim())
            .map(f => {
                const title = selectedGrpCd![f.ref];
                const regExp = f.type === 'integer' ? integerRegExp : f.type === 'float' ? floatRegExp : undefined;
                const maxLen = f.type === 'string' ? 100 : f.type === 'integer' ? 20 : 30;
                return {
                    title, key: f.refval, dataIndex: f.refval, align: 'center' as const, width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value ?? ''} maxLength={maxLen} regExp={regExp}
                            onChange={(e) => handleComCdDataChange(record, f.refval, e.target.value)}/>,
                };
            });

        return [...fixedCols, ...dynCols];
    }, [selectedGrpCd, comForm.control]);

    const comCdScrollX = useMemo(() => {
        const dynCount = REF_FIELDS.filter(f => selectedGrpCd?.[f.ref]?.trim()).length;
        return 600 + dynCount * 100;
    }, [selectedGrpCd]);

    // ── Init ──
    useEffect(() => { fetchGrpList(); }, []);

    return {
        grpForm,
        comForm,
        searchForm,

        grpDataSource,
        selectedGrpRowIndex,
        selectedGrpCd,
        selectedGrpRowKeys,
        setSelectedGrpRowKeys,
        grpColumns,

        comCdDataSource,
        selectedComCdRowKeys,
        setSelectedComCdRowKeys,
        dynamicComCdColumns,
        comCdScrollX,

        handleGrpRowClick,
        handleGrpDataChange,
        handleGrpDetailChange,
        handleAddGrp,
        handleDeleteGrp,

        handleAddComCd,
        handleDeleteComCd,

        handleSearch,
        handleReset,
        handleSave,
        handleKeyDown,
    };
}
