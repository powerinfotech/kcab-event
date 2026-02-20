import {Breadcrumb, Form, TableColumnsType} from 'antd';


import React, {useEffect, useState} from 'react';
import CustomButton from '@component/CustomButton';
import CustomCheckbox from '@component/CustomCheckbox';
import CustomInput from '@component/CustomInput';
import CustomTable from '@component/CustomTable';
import IconStepArrow from '@icon/IconStepArrow';
import IconHome from '@icon/IconHome';
import IconTitle from '@icon/IconTitle';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';


const Template = () => {
    const [searchForm] = Form.useForm();
    const [saveForm] = Form.useForm();
    const [tableHeight, setTableHeight] = useState(600);

    interface DataType {
        key: React.Key;
        userId: string;
        userName: string;
        date: string;
        ip: string;
        browser: string;
    }
    const columns: TableColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'userId',
        },
        {
            title: '사용자',
            dataIndex: 'userName',
        },
        {
            title: '일시',
            dataIndex: 'date',
        },
        {
            title: 'IP 주소',
            dataIndex: 'ip',
        },
        {
            title: '로그인 환경',
            dataIndex: 'browser',
        }
    ];
    const data: DataType[] = [];
    for (let i = 0; i < 146; i++) {
        data.push({
            key         : i,
            userId      : 'goldeul',
            userName    : '최주원',
            date        : '2024-05-15',
            ip          : '72.14.201.167',
            browser     : 'chrome',
        });
    }

    useEffect(() => {
        const handleResize = () => {
          const windowHeight = window.innerHeight;
          const availableHeight = windowHeight * 0.55;
          setTableHeight(availableHeight);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <>
        <section className="title-wrap">
            <div className="box-flex">
                <h2 className="title">접속정보 (DB로그) </h2>

                <Breadcrumb
                    separator={[
                        (<><IconStepArrow /></>)
                    ]}
                    className="bread-crumb"
                    items={[
                        {
                            href: '',
                            title: (
                                <>
                                    <IconHome />
                                    <span className="txt">시스템</span>
                                </>
                            ),
                        },
                        {
                            href: '',
                            title: (
                                <>
                                    <span className="txt">접속관리</span>
                                </>
                            ),
                        },
                        {
                            title: (
                                <>
                                    <span className="txt">접속정보 (DB로그)</span>
                                </>
                            ),
                        },
                    ]}
                />
            </div>

            <div className="box-btn">
                <CustomButton type="primary"><IconBtnRefresh />초기화</CustomButton>
                <CustomButton type="primary"><IconBtnSearch />조회</CustomButton>
            </div>
        </section>

        <section className="search-wrap">
            <form>
                <span>사용자</span>
                <CustomInput className='inp-search' placeholder="사용자"/>

                <CustomButton type="primary" htmlType="submit">검색</CustomButton>
                <CustomCheckbox/>
                <span>미사용자 제외</span>
            </form>
        </section>

        <section className="board-wrap">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        로그인 기록
                    </h3>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable scroll={{ x: 900, y: tableHeight }} columns={columns as any} dataSource={data} rowNoFlag={true}/>
                </div>
            </div>
        </section>
    </>
    ;

};

export default Template;

