import {Breadcrumb, TableColumnsType} from 'antd';


import React, {useEffect, useState} from 'react';
import CustomButton from '@component/CustomButton';
import CustomCheckbox from '@component/CustomCheckbox';
import CustomInput from '@component/CustomInput';
import CustomSelect from '@component/CustomSelect';
import CustomDatePicker from '@component/CustomDatePicker';
import CustomTable from '@component/CustomTable';
import IconStepArrow from '@icon/IconStepArrow';
import IconHome from '@icon/IconHome';
import IconTitle from '@icon/IconTitle';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import {useForm} from 'react-hook-form';


const Template = () => {
    const {register: searchFormRegister, control: searchFormControl }= useForm<any>({mode:'all'});
    const {register: saveFormRegister, control: saveFormControl }= useForm<any>({mode:'all'});
    const [tableHeight, setTableHeight] = useState(600);

    interface DataType {
        key: React.Key;
        userId: string;
        userName: string;
        userNameEng: string;
        telNo: string;
        hpNo: string;
        email: string;
        strDate: string;
        endDate: string;
    }
    const columns: TableColumnsType<any> = [
        {
            title: 'ID',
            dataIndex: 'userId',
            width:100
        },
        {
            title: '성명(한글)',
            dataIndex: 'userName',
            width:90
        },
        {
            title: '성명(영문)',
            dataIndex: 'userNameEng',
            width:100
        },
        {
            title: '내선번호',
            dataIndex: 'telNo',
            width:100
        },
        {
            title: 'H.P 번호',
            dataIndex: 'hpNo',
            width:100
        },
        {
            title: '이메일',
            dataIndex: 'email',
        },
        {
            title: '시작일',
            dataIndex: 'strDate',
            width:95
        },
        {
            title: '종료일',
            dataIndex: 'endDate',
            width:95
        },
    ];
    const data: DataType[] = [];
    for (let i = 0; i < 56; i++) {
        data.push({
            key         : i,
            userId      : 'goldeul',
            userName    : '최주원',
            userNameEng : 'abcdef',
            telNo       : '000-000-000',
            hpNo        : '000-000-000',
            email       : 'jung456@gmail.com',
            strDate      : '2024-05-15',
            endDate      : '2024-05-15',
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
                <h2 className="title">사용자관리</h2>

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
                            title: (
                                <>
                                    <span className="txt">사용자관리</span>
                                </>
                            ),
                        },
                    ]}
                />
            </div>

            <div className="box-btn">
                <CustomButton type="primary"><IconBtnRefresh />초기화</CustomButton>
                <CustomButton type="primary"><IconBtnSearch />조회</CustomButton>
                <CustomButton type="primary">추가</CustomButton>
                <CustomButton type="primary">삭제</CustomButton>
                <CustomButton type="primary">저장</CustomButton>
            </div>
        </section>

        <section className="search-wrap">
            <form>
                <span>ID/성명</span>
                <CustomInput placeholder="ID/성명"/>

                <span>사용자구분</span>
                <CustomSelect placeholder="선택"
                              options={[
                                  {value: 'jack', label: 'Jack'},
                                  {value: 'lucy', label: 'Lucy'},
                                  {value: 'Yiminghe', label: 'yiminghe'},
                                  {value: 'disabled', label: 'Disabled', disabled: true},
                              ]}
                />

                <CustomButton type="primary" htmlType="submit">검색</CustomButton>
                <CustomCheckbox onChange={(p) => {

                }}/>
            </form>
        </section>

        <section className="board-wrap half-wrap type01">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        사용자 목록
                    </h3>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable scroll={{ x: 900, y: tableHeight }} columns={columns as any} dataSource={data} rowNoFlag={true}/>
                </div>
            </div>

            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        상세정보
                    </h3>
                    <div className="box-btn">
                        <CustomButton className="w100" type="default" size="small">비밀번호 변경</CustomButton>
                    </div>
                </div>
                <form>
                    <div className="board-cont-wrap">
                        <div className="board-detail-info">
                            <div>
                                <p>
                                    <span className="tit">사용자ID<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomInput type={'text'}/>
                                    </div>
                                </p>
                                <p>
                                    <span className="tit">사용자구분<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomInput type={'text'}/>
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p>
                                    <span className="tit">성명(한글)<em>*</em></span>
                                    <div className="box-inp">
                                         <CustomInput type={'text'}/>
                                    </div>
                                </p>
                                <p>
                                    <span className="tit">성명(영문)<em>*</em></span>
                                    <div className="box-inp">
                                       <CustomInput type={'text'}/>
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p>
                                    <span className="tit">내선번호<em>*</em></span>
                                    <div className="box-inp">
                                       <CustomInput type={'text'}/>
                                    </div>
                                </p>
                                <p>
                                    <span className="tit">H.P번호<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomInput type={'text'}/>
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p className="full">
                                    <span className="tit">이메일<em>*</em></span>
                                    <div className="box-inp">
                                       <CustomInput type={'text'}/>
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p className="full">
                                    <span className="tit">부서명<em>*</em></span>
                                    <div className="box-inp flex">
                                        <CustomInput className="inp-search" placeholder="검색어 입력"/>
                                        <CustomButton type="primary" htmlType="submit">검색</CustomButton>
                                         <CustomInput type={'text'}/>
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p>
                                    <span className="tit">최종수정일<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomDatePicker/>
                                    </div>
                                </p>
                                <p>
                                    <span className="tit">수정자<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomInput type={'text'}/>
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p>
                                    <span className="tit">관리자여부<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomCheckbox />
                                    </div>
                                </p>
                                <p>
                                    <span className="tit">사용여부<em>*</em></span>
                                    <div className="box-inp">
                                         <CustomCheckbox />
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </section>
    </>
        ;

};

export default Template;

