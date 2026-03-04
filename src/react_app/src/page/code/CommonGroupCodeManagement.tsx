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
import {IudType, PageButtonHandlers} from '@interface/common';
import {callGetComGrpCdList, callSaveComGrpCd} from '@api/code/CommonGroupCodeApi';
import {useForm} from 'react-hook-form';
import {useMessage} from '@hook/useMessage';
import {usePageHandlers} from '@hook/usePageHandlers';
import {applyDataChange} from '@util/dataSourceUtils';
import {ALPHANUMERIC_REGEXP, INTEGER_REGEXP, FLOAT_REGEXP} from '@util/validationPatterns';
import EditableFormCell from '@component/EditableFormCell';

const CommonGroupCodeManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const {register, unregister, control, handleSubmit, setValue} = useForm<any>({mode: 'onSubmit'});
    const {confirm} = useMessage();
    const tempSeqRef = useRef(-1);

    const [searchText, setSearchText] = useState('');
    const [dataSource, setDataSource] = useState<ComGrpCdList[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<ComGrpCdList[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const isChanged = dataSource.some(v => v.iudType);

    const handleDataChange = (record: ComGrpCdList, key: string, value: any) =>
        applyDataChange(setDataSource, 'comGrpCdSeq', record, key, value);

    const fetchList = async () => {
        const res = await callGetComGrpCdList(searchText);
        if (res.code === HttpStatusCode.Ok) {
            setOrgDataSource(structuredClone(res.item));
            setDataSource(structuredClone(res.item));
            setSelectedRowKeys([]);
        }
    };

    const handleSearch = async () => {
        if (isChanged) {
            if (!await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?')) return;
        }
        await fetchList();
    };

    const handleReset = async () => {
        if (isChanged) {
            if (!await confirm('저장하지 않은 정보는 초기화됩니다. 계속 하시겠습니까?')) return;
        }
        setDataSource(structuredClone(orgDataSource));
        setSelectedRowKeys([]);
        setSearchText('');
    };

    const handleAddRow = () => {
        const tempSeq = tempSeqRef.current--;
        setDataSource(prev => [...prev, {
            comGrpCdSeq: tempSeq, comGrpCd: '', comGrpCdNm: '', comGrpCdDesc: '',
            ref01: '', ref02: '', ref03: '', ref04: '', ref05: '',
            ref06: '', ref07: '', ref08: '', ref09: '', ref10: '',
            ref11: '', ref12: '', ref13: '', ref14: '', ref15: '',
            useYn: 'Y', iudType: IudType.I,
        }]);
    };

    const handleDeleteRow = async () => {
        if (selectedRowKeys.length === 0) {
            message.info('선택한 내용이 없습니다.');
            return;
        }

        const hasUnsavedOnly = dataSource
            .filter(v => selectedRowKeys.includes(v.comGrpCdSeq))
            .every(v => v.iudType === IudType.I);

        if (!hasUnsavedOnly) {
            message.info('저장된 공통그룹코드는 삭제할 수 없습니다. 사용여부를 N으로 변경해 주세요.');
            return;
        }

        if (!await confirm('삭제하시겠습니까?')) return;

        selectedRowKeys.forEach(seq => unregister(`${seq}_comGrpCd`));
        setDataSource(prev => prev.filter(v => !selectedRowKeys.includes(v.comGrpCdSeq)));
        setSelectedRowKeys([]);
    };

    const handleSave = async () => {
        if (!isChanged) {
            message.info('변경된 내용이 없습니다.');
            return;
        }

        if (!await confirm('저장 하시겠습니까?')) return;

        const changedItems = dataSource.filter(v => v.iudType);

        try {
            const res = await callSaveComGrpCd({
                comGrpCdList: changedItems.map(v =>
                    v.iudType === IudType.I ? {...v, comGrpCdSeq: undefined} : v
                ) as ComGrpCdList[],
            });
            if (res.code !== HttpStatusCode.Ok) return;
            message.success('저장이 완료 되었습니다.');
            await fetchList();
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

    const comGrpCdRegExp = ALPHANUMERIC_REGEXP;
    const integerRegExp = INTEGER_REGEXP;
    const floatRegExp = FLOAT_REGEXP;

    const columns: ColumnsType<ComGrpCdList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">분류코드<em>*</em></span>,
            key: 'comGrpCd', dataIndex: 'comGrpCd', align: 'center', width: 100, fixed: 'left',
            render: (value: string, record: ComGrpCdList) =>
                record.rgstUserSeq
                    ? <a>{value}</a>
                    : <EditableFormCell record={record} seqField="comGrpCdSeq" fieldSuffix="comGrpCd"
                          value={value} setValue={setValue} control={control} register={register}
                          onDataChange={handleDataChange} requiredMessage="분류코드는 필수입력입니다."
                          maxLength={20} regExp={comGrpCdRegExp} transformValue={(v) => v.toUpperCase()}/>,
        },
        {
            title: '분류명', key: 'comGrpCdNm', dataIndex: 'comGrpCdNm', align: 'center', width: 150,
            render: (value: string, record: ComGrpCdList) =>
                <CustomInput value={value} maxLength={100}
                    onChange={(e) => handleDataChange(record, 'comGrpCdNm', e.target.value)}/>,
        },
        {
            title: '설명', key: 'comGrpCdDesc', dataIndex: 'comGrpCdDesc', align: 'center', width: 150,
            render: (value: string, record: ComGrpCdList) =>
                <CustomInput value={value} maxLength={200}
                    onChange={(e) => handleDataChange(record, 'comGrpCdDesc', e.target.value)}/>,
        },
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: 80,
            render: (value: string, record: ComGrpCdList) =>
                <CustomCheckbox checked={value === 'Y'}
                    onChange={(e) => handleDataChange(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>,
        },
        {
            title: '관리항목(문자형)',
            children: [
                {
                    title: '문자형1', key: 'ref01', dataIndex: 'ref01', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={200}
                            onChange={(e) => handleDataChange(record, 'ref01', e.target.value)}/>,
                },
                {
                    title: '문자형2', key: 'ref02', dataIndex: 'ref02', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={200}
                            onChange={(e) => handleDataChange(record, 'ref02', e.target.value)}/>,
                },
                {
                    title: '문자형3', key: 'ref03', dataIndex: 'ref03', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={200}
                            onChange={(e) => handleDataChange(record, 'ref03', e.target.value)}/>,
                },
                {
                    title: '문자형4', key: 'ref04', dataIndex: 'ref04', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={200}
                            onChange={(e) => handleDataChange(record, 'ref04', e.target.value)}/>,
                },
                {
                    title: '문자형5', key: 'ref05', dataIndex: 'ref05', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={200}
                            onChange={(e) => handleDataChange(record, 'ref05', e.target.value)}/>,
                },
            ],
        },
        {
            title: '관리항목(정수형)',
            children: [
                {
                    title: '정수형1', key: 'ref06', dataIndex: 'ref06', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={20} regExp={integerRegExp}
                            onChange={(e) => handleDataChange(record, 'ref06', e.target.value)}/>,
                },
                {
                    title: '정수형2', key: 'ref07', dataIndex: 'ref07', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={20} regExp={integerRegExp}
                            onChange={(e) => handleDataChange(record, 'ref07', e.target.value)}/>,
                },
                {
                    title: '정수형3', key: 'ref08', dataIndex: 'ref08', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={20} regExp={integerRegExp}
                            onChange={(e) => handleDataChange(record, 'ref08', e.target.value)}/>,
                },
                {
                    title: '정수형4', key: 'ref09', dataIndex: 'ref09', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={20} regExp={integerRegExp}
                            onChange={(e) => handleDataChange(record, 'ref09', e.target.value)}/>,
                },
                {
                    title: '정수형5', key: 'ref10', dataIndex: 'ref10', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={20} regExp={integerRegExp}
                            onChange={(e) => handleDataChange(record, 'ref10', e.target.value)}/>,
                },
            ],
        },
        {
            title: '관리항목(실수형)',
            children: [
                {
                    title: '실수형1', key: 'ref11', dataIndex: 'ref11', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={30} regExp={floatRegExp}
                            onChange={(e) => handleDataChange(record, 'ref11', e.target.value)}/>,
                },
                {
                    title: '실수형2', key: 'ref12', dataIndex: 'ref12', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={30} regExp={floatRegExp}
                            onChange={(e) => handleDataChange(record, 'ref12', e.target.value)}/>,
                },
                {
                    title: '실수형3', key: 'ref13', dataIndex: 'ref13', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={30} regExp={floatRegExp}
                            onChange={(e) => handleDataChange(record, 'ref13', e.target.value)}/>,
                },
                {
                    title: '실수형4', key: 'ref14', dataIndex: 'ref14', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={30} regExp={floatRegExp}
                            onChange={(e) => handleDataChange(record, 'ref14', e.target.value)}/>,
                },
                {
                    title: '실수형5', key: 'ref15', dataIndex: 'ref15', align: 'center', width: 100,
                    render: (value: string, record: ComGrpCdList) =>
                        <CustomInput value={value} maxLength={30} regExp={floatRegExp}
                            onChange={(e) => handleDataChange(record, 'ref15', e.target.value)}/>,
                },
            ],
        },
    ];

    useEffect(() => {
        callGetComGrpCdList().then(res => {
            if (res.code === HttpStatusCode.Ok) {
                setOrgDataSource(structuredClone(res.item));
                setDataSource(structuredClone(res.item));
            }
        });
    }, []);

    usePageHandlers(handlersRef, {
        cfmInit: handleReset,
        cfmSearch: handleSearch,
        cfmAdd: handleAddRow,
        cfmDelete: handleDeleteRow,
        cfmSave: handleSubmit(handleSave),
    });

    return (
        <>
            <section className="search-wrap">
                <form>
                    <span>분류코드/명</span>
                    <CustomInput
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{width: 200}}
                    />
                </form>
            </section>

            <section className="board-wrap">
                <div className="board-title-wrap">
                    <h3 className="title"><IconTitle/>분류코드목록</h3>
                    <span className="total-count">Total {dataSource.length}</span>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable
                        rowSelection={{
                            selectedRowKeys,
                            onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
                            renderCell: (_value: any, record: any, _index: number, originNode: React.ReactNode) =>
                                record.rgstUserSeq ? null : originNode,
                        }}
                        rowKey={'comGrpCdSeq'}
                        pagination={false}
                        rowNoFlag={true}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{x: 2000, y: undefined}}
                    />
                </div>
            </section>
        </>
    );
};

export default CommonGroupCodeManagement;
