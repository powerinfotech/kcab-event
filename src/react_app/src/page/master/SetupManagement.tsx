import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import CustomInput from '@component/CustomInput';
import CustomButton from '@component/CustomButton';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import {CodeResponse, IudType} from '@interface/common';
import {HttpStatusCode} from 'axios';
import {ColumnsType} from 'antd/es/table';
import CustomCheckbox from '@component/CustomCheckbox';
import IconTitle from '@icon/IconTitle';
import {useMessage} from '@hook/useMessage';
import {Controller, useForm} from 'react-hook-form';
import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import {AreaDataType, AreaListSearchParam, SectorDataType} from "@interface/master/SetupManagement";
import {
    callDeleteArea,
    callGetAreaCmCodeList,
    callGetAreaList,
    callGetSectorList,
    callSaveArea
} from "@api/master/SetupManagementApi";
import {cloneDeep} from "lodash";
import CustomAddressSearchModal from "@component/CustomAddressSearchModal";
import {Address} from "react-daum-postcode";
import CustomSaveFormSearchInput from "@component/form/CustomSaveFormSearchInput";
import CustomSaveFormCheckbox from "@component/form/CustomSaveFormCheckbox";


/* 설치 구역 목록 칼럼설정 */
const areaColumns: ColumnsType<AreaDataType> = [
    IUD_COLUMN,
    {
        title: <div style={{ textAlign: 'center' }}>구역 명</div>,
        key:'areaName',
        dataIndex: 'areaName',
        width: '250px',
    },
    {
        title: <div style={{ textAlign: 'center' }}>구역 구분</div>,
        key:'areaCdNm',
        dataIndex: 'areaCdNm',
        width: '100px',
        align: 'center'
    },
    {
        title: <div style={{ textAlign: 'center' }}>구역 위도</div>,
        key:'areaLatitude',
        dataIndex: 'areaLatitude',
        width: '120px',
        align:'right'
    },
    {
        title: <div style={{ textAlign: 'center' }}>구역 경도</div>,
        key:'areaLongitude',
        dataIndex: 'areaLongitude',
        width: '120px',
        align:'right'
    },
    {
        title: <div style={{ textAlign: 'center' }}>구역 비고</div>,
        key:'areaDesc',
        dataIndex: 'areaDesc',
    },
];

/* 관리권역 목록 칼럼설정 */
const sectorColumns: ColumnsType<SectorDataType> = [
    IUD_COLUMN,
    {
        title: <div style={{ textAlign: 'center' }}>관리권역 명</div>,
        key:'sectorName',
        dataIndex: 'sectorName',
        width: '100px',
    },
    {
        title: <div style={{ textAlign: 'center' }}>관리권역 구분</div>,
        key:'sectorCdNm',
        dataIndex: 'sectorCdNm',
        width: '100px',
        align: 'center'
    },
    {
        title: <div style={{ textAlign: 'center' }}>관리권역 비고</div>,
        key:'sectorDesc',
        dataIndex: 'sectorDesc',
    },
    {
        title: <div style={{ textAlign: 'center' }}>X좌표</div>,
        key:'xAxis',
        dataIndex: 'xAxis',
        width: '11%',
        align: 'right'
    },
    {
        title: <div style={{ textAlign: 'center' }}>Y좌표</div>,
        key:'yAxis',
        dataIndex: 'yAxis',
        width: '11%',
        align: 'right'
    },
    {
        title: '사용여부',
        key: 'useFlag',
        dataIndex: 'useFlag',
        width:75,
        align:'center',
        render: (value) => {
            return <CustomCheckbox checked={value} />;
        }
    },
];

const emptyAreaData:AreaDataType = {
        areaSeq: 0,
        areaName:'',
        areaCd:'',
        areaCdNm:'',
        areaZipNo:'',
        areaAddr:'',
        areaDtlAddr:'',
        areaLatitude:'',
        areaLongitude:'',
        areaDesc:'',
        useFlag: true,
        iudType:IudType.I
    };


const SetupManagement = () => {
    const {
        watch: watchSearchParam
        , control: controlAreaSearchForm
        , getValues: getValuesAreaSearchForm
        , handleSubmit: handleSubmitAreaSearchForm
    } = useForm<AreaListSearchParam>();

    const { watch: watchAreaForm
        , register: registerAreaForm
        , control: controlAreaForm
        , handleSubmit: handleSubmitAreaForm
        , reset: resetAreaForm
        , setValue: setValueAreaForm
        , getValues:getValuesAreaForm} = useForm<AreaDataType>({mode:'onSubmit'});

    /* area common code list for select comp */
    const [areaCmCdList, setAreaCmCdList] = useState<CodeResponse[]>([]);

    /* table datasource state */
    const [areaDataSource, setAreaDataSource] = useState<AreaDataType[]>([]);
    const [originAreaDataSource, setOriginAreaDataSource] = useState<AreaDataType[]>([]);
    const [sectorDataSource, setSectorDataSource] = useState<SectorDataType[]>([]);

    /* edit 권한 관련 state */
    const [isRowSelected, setIsRowSelected] = useState<boolean>(false);
    const isEditable = isRowSelected;

    const [selectedAreaRowIndex, setSelectedAreaRowIndex] = useState(-1);
    const currentAreaDataSource = areaDataSource[selectedAreaRowIndex];
    const isChangedDataSource = areaDataSource.some((v)=>v.iudType);

    /* AddressSearch Modal 노출 state */
    const [addrSearchModalOpenFlag, setAddrSearchModalOpenFlag] = useState<boolean>(false);

    const {confirm} = useMessage();

    const getAreaCmCdList = async () => {
        const getAreaCmCdResponse = await callGetAreaCmCodeList();
        setAreaCmCdList(getAreaCmCdResponse.item);
    };

    const handleSearchAreaList = async (searchParam : AreaListSearchParam) => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }

        const getAreaListResponse = await callGetAreaList(searchParam);

        setAreaDataSource(cloneDeep(getAreaListResponse.item));
        setOriginAreaDataSource(cloneDeep(getAreaListResponse.item));
        setSectorDataSource([]);
        resetAreaForm(emptyAreaData);
        setIsRowSelected(false);
        setSelectedAreaRowIndex(-1);
    };

    const handleSearchSectorList = async (areaSeq : number) => {
        const getSectorListResponse = await callGetSectorList(areaSeq);

        setSectorDataSource(cloneDeep(getSectorListResponse.item));
    };

    const handleSave = async (data: AreaDataType) => {
        const saveData = getCurRowAreaDataSourceByAreaSeq(data.areaSeq);
        if(!saveData.iudType) {
            message.info('변경된 내용이 없습니다.');
            return;
        }

        const result = await confirm('저장 하시겠습니까?');
        if(result) {

            const saveAreaResponse = await callSaveArea(saveData);

            if(saveAreaResponse.code === HttpStatusCode.Ok) {
                message.info('저장 되었습니다.');

                const getAreaListResponse = await callGetAreaList(watchSearchParam());

                const newAreaListRowIdx= getAreaListResponse.item.findIndex(obj => obj.areaSeq === saveAreaResponse.item.areaSeq) ?? -1;


                setAreaDataSource(cloneDeep(getAreaListResponse.item));
                setOriginAreaDataSource(cloneDeep(getAreaListResponse.item));

                setSelectedAreaRowIndex(newAreaListRowIdx);

                if(newAreaListRowIdx >= 0){
                    resetAreaForm(saveData);
                    setIsRowSelected(true);
                }else{
                    resetAreaForm(emptyAreaData);
                    setIsRowSelected(false);
                }
            }
        }
    };

    const getCurRowAreaDataSourceByAreaSeq = (areaSeq : number) => {
        return areaDataSource.filter((v)=>v.areaSeq === areaSeq)[0];
    };
    
    const handleReset = () => {
        const resetDataSource = areaDataSource.map((item)=> {
            if (item.areaSeq === getValuesAreaForm('areaSeq')) {
                if(originAreaDataSource.some((v) => v.areaSeq === getValuesAreaForm('areaSeq'))) {
                    return originAreaDataSource.filter((v) => v.areaSeq === getValuesAreaForm('areaSeq'))[0];
                } else {
                    const ret = areaDataSource.filter((v) => v.areaSeq === getValuesAreaForm('areaSeq'))[0];
                    ret.iudType = item.iudType !== IudType.I ? undefined: item.iudType;
                    return ret;
                }
            }
            return item;
        });
        resetSaveForm();
        setAreaDataSource(resetDataSource);
    };

    const resetSaveForm = () =>{
        resetAreaForm(originAreaDataSource.filter((v)=>v.areaSeq===getValuesAreaForm('areaSeq')??{})[0]);
    };

    const handleAdd = async() => {
        if(isChangedDataSource){
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if(!result) return;
        }

        const areaDataToAdd: AreaDataType = cloneDeep(emptyAreaData);
        areaDataToAdd.areaSeq = originAreaDataSource && originAreaDataSource.length > 0 ?
                                Math.max(...originAreaDataSource.map((v:AreaDataType) => v.areaSeq + 1)) : 0;
        areaDataToAdd.iudType = IudType.I;

        const addedDataSource = originAreaDataSource.concat(areaDataToAdd);

        setAreaDataSource(addedDataSource);
        handleRowSelection(areaDataToAdd, addedDataSource.length-1);
    };

    const handleDelete = async () => {
        if(!await confirm('삭제 하시겠습니까?')) return;

        const deleteAreaResponse = await callDeleteArea(getValuesAreaForm('areaSeq'));

        if(deleteAreaResponse.code === HttpStatusCode.Ok) {
            handleSearchAreaList(watchSearchParam());
            setIsRowSelected(false);
        }
    };
    
    /* 설치구역 목록 row 선택 관련 start */
    const handleRowSelection = async (recode:AreaDataType, index:number) => {
        resetAreaForm(recode);
        setIsRowSelected(true);
        setSelectedAreaRowIndex(index);
    };

    const handleRowChanged = async() => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 진행 하시겠습니까?');
            if(!result) {
                return false;
            }
            resetAreaForm();
            setAreaDataSource(cloneDeep(originAreaDataSource));
        }
        return true;
    };
    /* 설치구역 목록 row 선택 관련 end */

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchAreaList(watchSearchParam());
        }
    };

    /* Area Input Form onchange 메서드 관련 start */
    const handleDataChanged = () => {
        const formData  = getValuesAreaForm();
        const changedDataSource = areaDataSource.map((item)=> {
            if (item.areaSeq === getValuesAreaForm('areaSeq')) {
                if(isItemChanged(item, formData)) {
                    item = {...item, ...formData};
                    item.iudType = item.iudType ?? IudType.U;
                }
            }
            return item;
        });
        changedDataSource && setAreaDataSource(changedDataSource);
    };

    const isItemChanged = (originalItem: AreaDataType, newItem: AreaDataType): boolean => {
        for (const key in newItem) {
            if (originalItem[key] !== newItem[key]) {
                return true;
            }
        }
        return false;
    };
    /* Area Input Form onchange 메서드 관련 end */

    /* 구역 주소,우편번호 조회 관련 start */
    const onAddrSearchComplete = (data:Address) => {
        if(data.userSelectedType === 'R'){
            setValueAreaForm("areaAddr", data.address);
        } else {
            setValueAreaForm("areaAddr", data.jibunAddress);
        }

        setValueAreaForm("areaZipNo", data.zonecode);
        handleDataChanged();
        setAddrSearchModalOpenFlag(false);
    };
    /* 구역 주소,우편번호 조회 관련 end */

    useEffect(() => {
        handleSearchAreaList({});
        getAreaCmCdList();
    }, []);

    useEffect(() => {
        if(areaDataSource[selectedAreaRowIndex]?.areaSeq) {
            handleSearchSectorList(areaDataSource[selectedAreaRowIndex].areaSeq);
        }
    }, [selectedAreaRowIndex]);

    return  (
        <>
        <section className={'button-wrap'}>
            <div className="box-btn">
                <CustomButton type="primary"
                              onClick={() => {handleReset();}}
                              disabled={!isEditable || currentAreaDataSource?.iudType === IudType.I}>
                    <IconBtnRefresh/>초기화
                </CustomButton>
                <CustomButton type="primary"
                              onClick={() => {handleSearchAreaList(watchSearchParam());}}>
                    <IconBtnSearch/>조회
                </CustomButton>
                <CustomButton type="primary"
                              onClick={() => {handleAdd();}}>
                    추가
                </CustomButton>
                <CustomButton type="primary"
                              onClick={() => {handleDelete();}}
                              disabled={!isEditable}>
                    삭제
                </CustomButton>
                <CustomButton type="primary" onClick={handleSubmitAreaForm(handleSave)}
                              disabled={!isEditable}>
                    저장
                </CustomButton>
            </div>
        </section>
        <section className="search-wrap">
        <form onSubmit={handleSubmitAreaSearchForm(handleSearchAreaList)}>
            <span>구역 명</span>
            <Controller
                name={'areaName'}
                defaultValue={''}
                control={controlAreaSearchForm}
                render={({field}) => (
                    <CustomInput placeholder="검색할 구역 명을 입력해 주세요."
                                 onChange={field.onChange}
                                 style={{width: 250, margin: '0 8px'}}
                                 onKeyPress={handleKeyPress}/>
                )}
            />
            <span>구역 구분</span>
            <Controller
                name={'areaCdName'}
                defaultValue={''}
                control={controlAreaSearchForm}
                render={({field}) => (
                    <CustomInput placeholder="검색할 구역 구분을 입력해 주세요."
                                         onChange={field.onChange}
                                         style={{width: 250, margin: '0 8px'}}
                                 onKeyPress={handleKeyPress}/>
                        )}
                    />
                    <Controller
                        name={'includeUnusedFlag'}
                        defaultValue={false}
                        control={controlAreaSearchForm}
                        render={({field}) => (
                            <CustomCheckbox onChange={field.onChange}/>
                        )}
                    />
                    <span>미사용포함</span>
                </form>
            </section>

            <section className="board-wrap half-wrap type01">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            설치구역 목록
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            onRow={(recode:any, index?:number) => {
                                return {
                                    onClick: () => {
                                         handleRowChanged().then((res)=> {
                                             if(res)
                                                 handleRowSelection(recode, index??-1).then();
                                         });
                                   },
                                };
                            }}
                            rowKey={'areaSeq'}
                            pagination={false}
                            rowNoFlag={true}
                            columns={areaColumns}
                            selectedRowIndex={selectedAreaRowIndex}
                            dataSource={areaDataSource}/>
                    </div>
                </div>
                <div className="right-panel">
                    <div className="top-right">
                        <div className="board-title-wrap">
                            <h3 className="title">
                                <IconTitle/>
                                상세정보
                            </h3>
                        </div>
                        <div className="board-cont-wrap" >
                            <form onSubmit={handleSubmitAreaForm(handleSave)}  >
                            <CustomInput style={{display: 'none'}} className={'hide'} {...registerAreaForm('userSeq')}/>
                            <div className="board-detail-info">
                                <div>
                                    <CustomSaveFormInput
                                        title={'구역 명'}
                                        control={controlAreaForm}
                                        required={true}
                                        maxLength={40}
                                        disabled={!isEditable}
                                        {...registerAreaForm(
                                            'areaName',
                                            {required:'구역 명은 필수입력입니다.',
                                                onChange:handleDataChanged
                                            })
                                        }
                                    />
                                    <CustomSaveFormSelect
                                        title={'구역 구분'}
                                        control={controlAreaForm}
                                        required={true}
                                        disabled={!isEditable}
                                        options={areaCmCdList}
                                        nullFlag={true}
                                        onChangeValueback={(v) => {
                                            setValueAreaForm('areaCdNm',v.label);
                                            handleDataChanged();
                                        }}
                                        {...registerAreaForm(
                                            'areaCd',
                                            {required:'구역 명은 필수입력입니다.'}
                                        )}
                                    />
                                </div>
                                <div>
                                    <CustomSaveFormInput
                                        title={'구역 주소'}
                                        name={'areaZipNo'}
                                        control={controlAreaForm}
                                        maxLength={20}
                                        disabled={true}
                                        onChangeValue={handleDataChanged}
                                    />
                                    <CustomSaveFormSearchInput
                                        isNoTitle={true}
                                        name={'areaAddr'}
                                        disabled={true}
                                        onlyUseButtonFlag={true}
                                        disabledButton={!isEditable}
                                        onClickSearchBtn={()=> setAddrSearchModalOpenFlag(true)}
                                        control={controlAreaForm}
                                        onChangeValue={handleDataChanged}
                                    />
                                </div>
                                <div>
                                    <CustomSaveFormInput
                                        title={'구역 상세 주소'}
                                        name={'areaDtlAddr'}
                                        singleRow={true}
                                        control={controlAreaForm}
                                        maxLength={30}
                                        disabled={!isEditable }
                                        onChangeValue={handleDataChanged}
                                    />
                                </div>
                                <div>
                                    <CustomSaveFormInput
                                        title={'구역 위도'}
                                        name={'areaLatitude'}
                                        control={controlAreaForm}
                                        maxLength={30}
                                        disabled={!isEditable }
                                        regExp={{value:/^\d{0,3}(\.\d{0,7})?$/, message:"위도는 소숫점 형식으로 작성해야 합니다. ex)37.5665"}}
                                        onChangeValue={handleDataChanged}
                                    />
                                    <CustomSaveFormInput
                                        title={'구역 경도'}
                                        name={'areaLongitude'}
                                        control={controlAreaForm}
                                        maxLength={30}
                                        regExp={{value:/^\d{0,3}(\.\d{0,7})?$/, message:"경도는 소숫점 형식으로 작성해야 합니다. ex)126.9780"}}
                                        disabled={!isEditable }
                                        onChangeValue={handleDataChanged}
                                    />
                                </div>
                                <div>
                                    <CustomSaveFormInput
                                        title={'구역 비고'}
                                        name={'areaDesc'}
                                        singleRow={true}
                                        control={controlAreaForm}
                                        maxLength={30}
                                        disabled={!isEditable }
                                        onChangeValue={handleDataChanged}
                                    />
                                </div>
                                <div>
                                    <CustomSaveFormInput
                                        title={'최종수정일'}
                                        control={controlAreaForm}
                                        name={'lastUpdateDate'}
                                        disabled={true}
                                    />
                                    <CustomSaveFormInput
                                        title={'수정자'}
                                        control={controlAreaForm}
                                        name={'lastModifyUserName'}
                                        disabled={true}
                                    />
                                </div>
                                <div>
                                    <CustomSaveFormCheckbox
                                        title="사용여부"
                                        name="useFlag"
                                        disabled={!isEditable}
                                        control={controlAreaForm}
                                        onChangeValue={handleDataChanged}
                                    />
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                    <div className="bottom-right">
                        <div className="board-title-wrap">
                            <h3 className="title">
                                <IconTitle/>
                                관리권역 목록
                            </h3>
                            <div className="box-btn">
                                <CustomButton type="default" size="small">+ 행추가</CustomButton>
                                <CustomButton type="default" size="small">행삭제</CustomButton>
                            </div>
                        </div>
                        <div className="board-cont-wrap">
                            <CustomTable
                                pagination={false}
                                rowNoFlag={true}
                                columns={sectorColumns}
                                selectedRowIndex={undefined}
                                dataSource={sectorDataSource}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <CustomAddressSearchModal
                open={addrSearchModalOpenFlag}
                onAddrSearchComplete={onAddrSearchComplete}
                onCancel={() => setAddrSearchModalOpenFlag(false)}
            />
        </>
    );

};

export default SetupManagement;