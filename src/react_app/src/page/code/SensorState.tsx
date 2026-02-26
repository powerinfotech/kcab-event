import {TableColumnsType} from 'antd';
import React, {useEffect, useState} from 'react';
import IconTitle from '@icon/IconTitle';
import CustomTable from '@component/CustomTable';
import {SensorListItem, SensorPackListItem, SensorPackSearchParam} from '@interface/code/Sensor';
import {HttpStatusCode} from 'axios';
import {callGetSensorDetailList, callGetSensorStateNationAddrNoStateList, callGetSensorStateNationAddrNoStateSearch} from '@api/code/SensorStateApi';
import CustomButton from "@component/CustomButton";
import IconBtnRefresh from "@icon/IconBtnRefresh";
import IconBtnSearch from "@icon/IconBtnSearch";
import CustomValidFormInput from "@component/form/CustomValidFormInput";
import CustomValidFormSelect from "@component/form/CustomValidFormSelect";
import {Option} from "antd/lib/mentions";
import {useForm} from "react-hook-form";
import {EventStateSearchParam} from "@interface/code/EventState";
import {NationAddrNoSearchInfo} from "@interface/code/NationAddrNoState";
import {callGetNationAddrNoStateList, callGetNationAddrNoStateSearch} from "@api/code/NationAddrNoStateApi";
import {PageButtonHandlers} from '@interface/common';


const SensorState = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const {control: searchFormControl, handleSubmit: searchFormHandleSubmit, setValue, getValues: searchFormGetValues} = useForm<SensorPackSearchParam>({mode:'all'});
    const [sensorPackStateDataSource, setSensorPackStateDataSource] = useState<SensorPackListItem[]>([]);
    const [sensorStateDataSource, setSensorStateDataSource] = useState<SensorListItem[]>([]);
    const [searchInfoState, setSearchInfoState] = useState<NationAddrNoSearchInfo>({
        sggList:[],instlList:[]
    });

    const sensorPackColumns :TableColumnsType<SensorPackListItem> = [
        {
            title: '사고 다발 구역',
            key:'accdntAreaFlag',
            dataIndex: 'accdntAreaFlag',
            align:'center',
            render: (value, record, index) => {
                return value?'예':'아니오';
            },
            width:'100px'
        },
        {
            title: '국가지점번호',
            key:'ntnlPntNo',
            dataIndex: 'ntnlPntNo',
            align:'center',
            width:'120px'
        },
        {
            title: '다목적위치표지판 번호',
            key:'lctnSignNo',
            dataIndex: 'lctnSignNo',
            align:'center',
            width:'123px'
        },
        {
            title: '관리 기관(권역)',
            key:'sggNm',
            dataIndex: 'sggNm',
            align:'center',
            width:'100px'
        },
        {
            title: '태양광 패널여부',
            key:'slrPnlFlag',
            dataIndex: 'slrPnlFlag',
            align:'center',
            render:(value) => {
                return value?'예':'아니오';
            },
            width:'100px'
        },
    ];

    const sensorColumns :TableColumnsType<SensorListItem>  = [
        {
            title: '센서',
            align:'center',
            dataIndex: 'eventType',
            key: 'eventType'
        },
        {
            title: '알람기준값',
            dataIndex: 'columns1',
            align:'center',
            key: 'columns1'
        },
        {
            title: '설명',
            dataIndex: 'columns2',
            align:'center',
            key: 'columns2'
        }
    ];

    const sensorDataInit = (list : SensorListItem[]) => {
        const processedData :any = [];
        const nameCount : any = {};

        list.map((item,index) => {
            item.unqKey = index;
        });

        list.forEach((item) => {
            if (nameCount[item.eventType]) {
                nameCount[item.eventType].count += 1;
                nameCount[item.eventType].keys.push(item.unqKey);
            } else {
                nameCount[item.eventType] = { count: 1, keys: [item.unqKey] };
            }
        });

        // processedData에 rowSpan 추가
        Object.keys(nameCount).forEach((name) => {
            const count = nameCount[name].count;
            const keys = nameCount[name].keys;

            keys.forEach((key : any, index :number) => {
                const row = list.find(item => item.unqKey === key);
                if (index === 0) {
                    processedData.push({ ...row, rowSpan1: count });
                } else {
                    processedData.push({ ...row, rowSpan1: 0 });
                }
            });
        });

        const nameCount2 : any = {};
        const rowSpanData :any = [];
        processedData.forEach((item:SensorListItem) => {
            if (nameCount2[item.columns1]) {
                nameCount2[item.columns1].count += 1;
                nameCount2[item.columns1].keys.push(item.unqKey);
            } else {
                nameCount2[item.columns1] = { count: 1, keys: [item.unqKey] };
            }
        });

        Object.keys(nameCount2).forEach((name) => {
            const count = nameCount2[name].count;
            const keys = nameCount2[name].keys;

            keys.forEach((key : any, index :number) => {
                const row = processedData.find((item:SensorListItem) => item.unqKey === key);
                if (index === 0) {
                    rowSpanData.push({ ...row, rowSpan2: count });
                } else {
                    rowSpanData.push({ ...row, rowSpan2: 0 });
                }
            });
        });

        rowSpanData.map((item : SensorListItem) => {
            if (item.columns3 && !item.columns5) {
                item.colsSpan2 = 2;
            }

            if (item.columns4 && !item.columns1) {
                item.colsSpan1 = 2;
            }
            // item.colsSpan =
        });

        setSensorStateDataSource(rowSpanData);
    };
    // callGetSensorDetailList

    const detailSearch = (ntnlPntNo:string) => {
        callGetSensorDetailList(ntnlPntNo).then((res) => {
            if (res.code === HttpStatusCode.Ok) {
                //sensorDataInit(res.item);
                setSensorStateDataSource(res.item);
            }
        });
    };

    const searchInfo = () => {
        callGetSensorStateNationAddrNoStateSearch().then((res) => {
            if (res.code === HttpStatusCode.Ok) {
                setSearchInfoState(res.item);
                onSearch();
                setValue('sggCd','');
            }
        });
    };


    const onSearch = async () => {
        callGetSensorStateNationAddrNoStateList({searchText:searchFormGetValues('searchText')??'', sggCd: searchFormGetValues('sggCd')??''}).then((res) => {
            if (res.code === HttpStatusCode.Ok) {
                res.item.forEach((item,index) => {
                    item.unqKey = index;
                });
                setSensorPackStateDataSource(res.item);
                if(res.item.length > 0) {
                    detailSearch(res.item[0].ntnlPntNo);
                }
                else {
                    setSensorStateDataSource([]);
                }
            }
        });
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearch();
        }
    };

    useEffect(() => {
        searchInfo();
    }, []);
    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmSearch: onSearch,
            };
        }
    });

    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);

    return (
        <>
            <section className="search-wrap">
                <form onSubmit={searchFormHandleSubmit(onSearch)}>
                    <span>국가지점/다목적위치표지판 번호</span>
                    <CustomValidFormInput control={searchFormControl} name={'searchText'}
                                          style={{width: 250, margin: '0 8px'}}
                                          onKeyPress={handleKeyPress}/>
                    <span>권역</span>
                    <CustomValidFormSelect control={searchFormControl} name={'sggCd'}
                                           style={{width: 250, margin: '0 8px'}}>
                        <Option value={''}>전체</Option>
                        {searchInfoState.sggList.map((item, index) => {
                            return <Option key={`sgg_${index}`} value={item.value}>{item.label}</Option>;
                        })
                        }
                    </CustomValidFormSelect>
                </form>
            </section>

            <section className="board-wrap half-wrap type03">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            국가지점 목록
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        {/* rowSelected 에 예제로 만들어둠*/}
                        <CustomTable rowSelectedFlag={true}
                                     onRow={(recode: SensorPackListItem, index?: number) => {
                                         return {
                                             onClick: () => {
                                                 // setSearchComGrpCdSeq(recode.comGrpCdSeq);
                                                 detailSearch(recode.ntnlPntNo);
                                             },
                                         };
                                     }}
                                     columns={sensorPackColumns}
                                     rowKey={'unqKey'}
                                     dataSource={sensorPackStateDataSource}
                                     rowNoFlag={true}/>
                    </div>
                </div>
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            센서 목록
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable columns={sensorColumns}
                                     rowKey={'unqKey'}
                            // components={{
                            //     header: {
                            //         cell: ({ children, ...rest } : any) => (
                            //             <th colSpan={rest.colSpan || 1} {...rest}>
                            //                 {children}
                            //             </th>
                            //         ),
                            //
                            //     },
                            // }}
                                     dataSource={sensorStateDataSource} rowNoFlag={true}/>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SensorState;