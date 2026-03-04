import CustomButton from '@component/CustomButton';
import React, {useEffect, useRef, useState} from 'react';
import {ColumnsType} from 'antd/es/table';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import CustomInput from '@component/CustomInput';
import CustomCheckbox from '@component/CustomCheckbox';
import {HttpStatusCode} from 'axios';
import {message} from 'antd';
import IconTitle from '@icon/IconTitle';
import {ComGrpCdList} from '@interface/code/CommonGroupCode';
import {ComCdList, ComCdSaveData} from '@interface/code/CommonCode';
import {IudType, PageButtonHandlers} from '@interface/common';
import {callGetComGrpCdList} from '@api/code/CommonGroupCodeApi';
import {callGetComCdList, callSaveComCd} from '@api/code/CommonCodeApi';
import {useForm} from 'react-hook-form';
import {useMessage} from '@hook/useMessage';
import {usePageHandlers} from '@hook/usePageHandlers';
import {applyDataChange} from '@util/dataSourceUtils';
import {ALPHANUMERIC_REGEXP, INTEGER_REGEXP, FLOAT_REGEXP} from '@util/validationPatterns';
import EditableFormCell from '@component/EditableFormCell';

const CommonCodeManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const {register, unregister, control, handleSubmit, setValue} = useForm<any>({mode: 'onSubmit'});
    const {confirm} = useMessage();
    const tempSeqRef = useRef(-1);

    const [searchText, setSearchText] = useState('');
    const [grpDataSource, setGrpDataSource] = useState<ComGrpCdList[]>([]);
    const [selectedGrpRowIndex, setSelectedGrpRowIndex] = useState<number | undefined>(undefined);
    const [selectedGrpCd, setSelectedGrpCd] = useState<ComGrpCdList | null>(null);

    const [comCdDataSource, setComCdDataSource] = useState<ComCdList[]>([]);
    const [orgComCdDataSource, setOrgComCdDataSource] = useState<ComCdList[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const isChanged = comCdDataSource.some(v => v.iudType);

    const handleDataChange = (record: ComCdList, key: string, value: any) =>
        applyDataChange(setComCdDataSource, 'comCdSeq', record, key, value);

    const fetchGrpList = async () => {
        const res = await callGetComGrpCdList(searchText);
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
        setSearchText('');
        setGrpDataSource([]);
        setSelectedGrpRowIndex(undefined);
        setSelectedGrpCd(null);
        setComCdDataSource([]);
        setOrgComCdDataSource([]);
        setSelectedRowKeys([]);
    };

    const handleAddRow = () => {
        if (!selectedGrpCd) {
            message.info('분류코드를 먼저 선택해 주세요.');
            return;
        }
        const tempSeq = tempSeqRef.current--;
        setComCdDataSource(prev => [...prev, {
            comCdSeq: tempSeq,
            comGrpCdSeq: selectedGrpCd.comGrpCdSeq,
            comCd: '', comStdCd: '', comCdNm: '', comCdDesc: '',
            refval01: '', refval02: '', refval03: '', refval04: '', refval05: '',
            refval06: '', refval07: '', refval08: '', refval09: '', refval10: '',
            refval11: '', refval12: '', refval13: '', refval14: '', refval15: '',
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

        // 기존 row: iudType을 D로 변경하여 dataSource에 유지
        // 새 row: dataSource에서 아예 제거
        setComCdDataSource(prev => prev
            .filter(v => !(selectedRowKeys.includes(v.comCdSeq) && v.iudType === IudType.I))
            .map(v => selectedRowKeys.includes(v.comCdSeq) ? {...v, iudType: IudType.D} : v)
        );
        setSelectedRowKeys([]);
    };

    const handleSave = async () => {
        if (!selectedGrpCd) {
            message.info('분류코드를 먼저 선택해 주세요.');
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
            message.success('저장이 완료 되었습니다.');
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
    const floatRegExp = FLOAT_REGEXP;

    const grpColumns: ColumnsType<ComGrpCdList> = [
        {
            title: '분류코드', key: 'comGrpCd', dataIndex: 'comGrpCd', align: 'center', width: 100,
            render: (value: string) => <a>{value}</a>,
        },
        {
            title: '분류명', key: 'comGrpCdNm', dataIndex: 'comGrpCdNm', align: 'center', width: 120,
        },
    ];

    const comCdColumns: ColumnsType<ComCdList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">공통코드<em>*</em></span>,
            key: 'comCd', dataIndex: 'comCd', align: 'center', width: 100, fixed: 'left',
            render: (value: string, record: ComCdList) =>
                record.rgstUserSeq
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
                {
                    title: '문자형1', key: 'refval01', dataIndex: 'refval01', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={100}
                            onChange={(e) => handleDataChange(record, 'refval01', e.target.value)}/>,
                },
                {
                    title: '문자형2', key: 'refval02', dataIndex: 'refval02', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={100}
                            onChange={(e) => handleDataChange(record, 'refval02', e.target.value)}/>,
                },
                {
                    title: '문자형3', key: 'refval03', dataIndex: 'refval03', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={100}
                            onChange={(e) => handleDataChange(record, 'refval03', e.target.value)}/>,
                },
                {
                    title: '문자형4', key: 'refval04', dataIndex: 'refval04', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={100}
                            onChange={(e) => handleDataChange(record, 'refval04', e.target.value)}/>,
                },
                {
                    title: '문자형5', key: 'refval05', dataIndex: 'refval05', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={100}
                            onChange={(e) => handleDataChange(record, 'refval05', e.target.value)}/>,
                },
            ],
        },
        {
            title: '관리항목(정수형)',
            children: [
                {
                    title: '정수형1', key: 'refval06', dataIndex: 'refval06', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={20} regExp={integerRegExp}
                            onChange={(e) => handleDataChange(record, 'refval06', e.target.value)}/>,
                },
                {
                    title: '정수형2', key: 'refval07', dataIndex: 'refval07', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={20} regExp={integerRegExp}
                            onChange={(e) => handleDataChange(record, 'refval07', e.target.value)}/>,
                },
                {
                    title: '정수형3', key: 'refval08', dataIndex: 'refval08', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={20} regExp={integerRegExp}
                            onChange={(e) => handleDataChange(record, 'refval08', e.target.value)}/>,
                },
                {
                    title: '정수형4', key: 'refval09', dataIndex: 'refval09', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={20} regExp={integerRegExp}
                            onChange={(e) => handleDataChange(record, 'refval09', e.target.value)}/>,
                },
                {
                    title: '정수형5', key: 'refval10', dataIndex: 'refval10', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={20} regExp={integerRegExp}
                            onChange={(e) => handleDataChange(record, 'refval10', e.target.value)}/>,
                },
            ],
        },
        {
            title: '관리항목(실수형)',
            children: [
                {
                    title: '실수형1', key: 'refval11', dataIndex: 'refval11', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={30} regExp={floatRegExp}
                            onChange={(e) => handleDataChange(record, 'refval11', e.target.value)}/>,
                },
                {
                    title: '실수형2', key: 'refval12', dataIndex: 'refval12', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={30} regExp={floatRegExp}
                            onChange={(e) => handleDataChange(record, 'refval12', e.target.value)}/>,
                },
                {
                    title: '실수형3', key: 'refval13', dataIndex: 'refval13', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={30} regExp={floatRegExp}
                            onChange={(e) => handleDataChange(record, 'refval13', e.target.value)}/>,
                },
                {
                    title: '실수형4', key: 'refval14', dataIndex: 'refval14', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={30} regExp={floatRegExp}
                            onChange={(e) => handleDataChange(record, 'refval14', e.target.value)}/>,
                },
                {
                    title: '실수형5', key: 'refval15', dataIndex: 'refval15', align: 'center', width: 100,
                    render: (value: string, record: ComCdList) =>
                        <CustomInput value={value} maxLength={30} regExp={floatRegExp}
                            onChange={(e) => handleDataChange(record, 'refval15', e.target.value)}/>,
                },
            ],
        },
    ];

    useEffect(() => {
        fetchGrpList();
    }, []);

    usePageHandlers(handlersRef, {
        cfmInit: handleReset,
        cfmSearch: handleSearch,
        cfmSave: handleSubmit(handleSave),
    });

    return (
        <>
            <section className="search-wrap">
                <form>
                    <span>ID/성명</span>
                    <CustomInput
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{width: 200}}
                    />
                </form>
            </section>

            <section className="board-wrap half-wrap type02">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title"><IconTitle/>분류코드목록</h3>
                        <span className="total-count">Total {grpDataSource.length}</span>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            onRow={(record: any, index?: number) => ({
                                onClick: () => handleGrpRowClick(record, index ?? -1),
                            })}
                            rowKey={'comGrpCdSeq'}
                            pagination={false}
                            rowNoFlag={true}
                            columns={grpColumns}
                            dataSource={grpDataSource}
                            rowSelectedFlag={true}
                            selectedRowIndex={selectedGrpRowIndex}
                        />
                    </div>
                </div>

                <div>
                    <div className="board-title-wrap">
                        <h3 className="title"><IconTitle/>공통코드목록</h3>
                        <span className="total-count">Total {comCdDataSource.length}</span>
                        <div className="box-btn">
                            <CustomButton type="default" size="small" onClick={handleAddRow}>+행추가</CustomButton>
                            <CustomButton type="default" size="small" onClick={handleDeleteRow}>-행삭제</CustomButton>
                        </div>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            rowSelection={{
                                selectedRowKeys,
                                onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
                            }}
                            rowKey={'comCdSeq'}
                            pagination={false}
                            rowNoFlag={true}
                            columns={comCdColumns}
                            dataSource={comCdDataSource}
                            scroll={{x: 2000, y: undefined}}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default CommonCodeManagement;
