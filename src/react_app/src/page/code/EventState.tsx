import CustomButton from '@component/CustomButton';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import React, {useEffect, useState} from 'react';
import {Option} from 'antd/lib/mentions';
import IconTitle from '@icon/IconTitle';
import CustomTable from '@component/CustomTable';
import {ColumnsType} from 'antd/es/table';
import {eventStateList} from '@page/code/initData';
import {EventStateListItem, EventStateSearchParam} from '@interface/code/EventState';
import {useForm} from 'react-hook-form';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import CustomValidFormSelect from '@component/form/CustomValidFormSelect';


const EventState = () => {
    const {control: searchFormControl, handleSubmit: searchFormHandleSubmit} = useForm<EventStateSearchParam>({mode:'all'});
    const [eventStateDataSource, setEventStateDataSource] = useState<EventStateListItem[]>(eventStateList);

    const onSearch =(data:EventStateSearchParam) => {

    };

    useEffect(() => {
        const processedData :any = [];
        const nameCount : any = {};

        eventStateList.forEach((item) => {
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
                const row = eventStateDataSource.find(item => item.unqKey === key);
                if (index === 0) {
                    processedData.push({ ...row, rowSpan: count });
                } else {
                    processedData.push({ ...row, rowSpan: 0 });
                }
            });
        });

        setEventStateDataSource(processedData);
    }, []);
    const columns: ColumnsType<EventStateListItem> = [
        {
            title: '센서구분',
            key:'data1',
            dataIndex: 'data1',
            align:'center',
            onCell: (record) => ({
                rowSpan: record.rowSpan,
            }),
        },
        {
            title: '알림구분',
            key:'data2',
            dataIndex: 'data2',
            align:'center',
        },
        {
            title: '기준값',
            key:'data3',
            dataIndex: 'data3',
            align:'center',
            render: (value) => {
                return <a>{value}</a>;
            }
        },
        {
            title: '설명',
            key:'data4',
            dataIndex: 'data4',
            align:'center',
        }
    ];

    return (
        <>
            <section className="button-wrap">
                <div className="box-btn">
                    <CustomButton type="primary"><IconBtnRefresh/>초기화</CustomButton>
                    <CustomButton type="primary" onClick={searchFormHandleSubmit(onSearch)}><IconBtnSearch/>조회</CustomButton>
                </div>
            </section>
            <section className="search-wrap">
                <form>
                    <span>국가지점/다목적위치표지판 번호</span>
                    <CustomValidFormInput control={searchFormControl} name={'param1'} style={{width: 250, margin: '0 8px'}}/>
                    <span>권역</span>
                    <CustomValidFormSelect control={searchFormControl} name={'param2'} style={{width: 250, margin: '0 8px'}}>
                        <Option value={''}>전체</Option>
                        <Option value={'11380'}>은평구</Option>
                        <Option value={'11110'}>종로구</Option>
                        <Option value={'11290'}>성동구</Option>
                        <Option value={'11305'}>강북구</Option>
                        <Option value={'11320'}>도봉구</Option>
                    </CustomValidFormSelect>
                </form>
            </section>

            <section className="board-wrap">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            목록
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable columns={columns}
                                     rowKey={'unqKey'} dataSource={eventStateDataSource} rowNoFlag={true}/>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EventState;