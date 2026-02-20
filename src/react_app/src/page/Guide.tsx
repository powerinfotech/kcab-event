import {Form, Radio, TableColumnsType} from 'antd';
import React, {useState} from 'react';
import CustomButton from '@component/CustomButton';
import CustomCheckbox from '@component/CustomCheckbox';
import CustomInput from '@component/CustomInput';
import CustomSelect from '@component/CustomSelect';
import CustomDatePicker from '@component/CustomDatePicker';
import CustomTable from '@component/CustomTable';


import IconBtnRefresh from '../assets/images/icon_btn_refresh.svg';
import IconBtnSearch from '../assets/images/icon_btn_search.svg';
import IconTitle from '../assets/images/icon_title.svg';


const Guide = () => {
    const [searchForm] = Form.useForm();
    const [saveForm] = Form.useForm();


    // rowSelection을 위한 상태 선언
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // type TableRowSelection<T> = TableProps<T>['rowSelection'];

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    interface DataType {
        key: React.Key;
        name: string;
        age: number;
        address: string;
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
    ];

    const data: DataType[] = [];
    for (let i = 0; i < 146; i++) {
        data.push({
            key: i,
            name: `Edward King ${i}`,
            age: 32,
            address: `London, Park Lane no. ${i}`,
        });
    }

    return <>

        <div className="guide-title">COLOR</div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : '#D3FCD2' }}>$PrimaryLighter</div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : '#77ED8B' }}>$PrimaryLight  </div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : '#22C55E' }}>$PrimaryMain   </div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : '#118D57' }}>$PrimaryDark   </div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : '#065E49' }}>$PrimaryDarker </div>

        <br />

        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : 'rgba(34, 197, 94, 0.08)' }}>$Primary08</div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : 'rgba(34, 197, 94, 0.12)' }}>$Primary12</div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : 'rgba(34, 197, 94, 0.16)' }}>$Primary16</div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : 'rgba(34, 197, 94, 0.20)' }}>$Primary20</div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : 'rgba(34, 197, 94, 0.24)' }}>$Primary24</div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : 'rgba(34, 197, 94, 0.32)' }}>$Primary32</div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : 'rgba(34, 197, 94, 0.48)' }}>$Primary48</div>

        <br />

        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : 'linear-gradient(135deg, #77ED8B 0%, #22C55E 100%)' }}>$Primary-gradient-main</div>
        <div className="tac" style={{ display : 'inline-block',  width : '200px', padding : '10px 0', background : 'linear-gradient(135deg, #22C55E 0%, #118D57 100%)' }}>$Primary-gradient-bold</div>

        <br /><br />

        <div className="guide-title">INPUT</div>
        <section>
                {/* INPUT */}
                <Form.Item
                    // label="필수입력"
                    // name="input_name1"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: '필수입력 사항입니다.',
                    //     },
                    // ]}
                >
                    <CustomInput type={'text'}/>
                </Form.Item>

            <br />

                {/* SELECT */}
                <Form.Item
                    // label="필수 선택"
                    // name="select_name1"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: '필수입력 사항입니다.',
                    //     },
                    // ]}
                >
                    <CustomSelect placeholder="선택해 주세요"
                        options={[
                            {value: 'jack', label: 'Jack'},
                            {value: 'lucy', label: 'Lucy'},
                            {value: 'Yiminghe', label: 'yiminghe'},
                            {value: 'disabled', label: 'Disabled', disabled: true},
                        ]}
                    />
                </Form.Item>

            <br />

                <Form.Item
                    // label="필수 날짜 선택"
                    // name="picker_name1"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: '필수입력 사항입니다.',
                    //     },
                    // ]}
                >
                    <CustomDatePicker/>
                </Form.Item>

            <br />

                <Form.Item
                    // name="text"
                    // label="검색어"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: '필수입력 항목입니다.',
                    //     },
                    // ]}
                >
                    <CustomInput className="inp-search" placeholder="검색어 입력"/>
                </Form.Item>
        </section>

        <br />

        <div className="guide-title">BUTTON</div>
        <section>
            <CustomButton type="primary"><IconBtnRefresh />초기화</CustomButton>
            <CustomButton type="primary"><IconBtnSearch />조회</CustomButton>
            <CustomButton type="primary">추가</CustomButton>
            <CustomButton type="primary">삭제</CustomButton>
            <CustomButton type="primary">저장</CustomButton>

            <CustomButton type="primary" disabled><IconBtnRefresh />초기화</CustomButton>
            <CustomButton type="primary" disabled><IconBtnSearch />조회</CustomButton>
            <CustomButton type="primary" disabled>추가</CustomButton>
            <CustomButton type="primary" disabled>삭제</CustomButton>
            <CustomButton type="primary" disabled>저장</CustomButton>

            <br /><br />

            <CustomButton type="default" size="small">+ 행추가</CustomButton>
            <CustomButton type="default" size="small">+ 삭제</CustomButton>
            <CustomButton type="default" size="small">접기</CustomButton>
            <CustomButton type="default" size="small">펼치기</CustomButton>
            <CustomButton type="default" size="small">인원추가</CustomButton>
            <CustomButton type="default" size="small">불러오기</CustomButton>
            <CustomButton className="point" type="default" size="small">강조버튼</CustomButton>

            <CustomButton type="default" size="small" disabled>+ 행추가</CustomButton>
            <CustomButton type="default" size="small" disabled>+ 삭제</CustomButton>
            <CustomButton type="default" size="small" disabled>접기</CustomButton>
            <CustomButton type="default" size="small" disabled>펼치기</CustomButton>
            <CustomButton type="default" size="small" disabled>인원추가</CustomButton>
            <CustomButton type="default" size="small" disabled>불러오기</CustomButton>
            <CustomButton className="point" type="default" size="small" disabled>강조버튼</CustomButton>
        </section>

        <br />

        <div className="guide-title">CHECKBOX</div>
        <section>
            <Form.Item
                className="box-check"
                label="해당 사용자의 모든 권한"
                name="checkName"
            >
                <CustomCheckbox
                    onChange={(p) => {
                        p.target.checked ? saveForm.setFieldsValue({checkName: p.target.checked}) : saveForm.setFieldsValue({checkName: null});
                }}/>
            </Form.Item>

            <Form.Item
                className="box-check"
                label="해당 사용자의 모든 권한"
                name="checkName01"
            >
                <CustomCheckbox
                    onChange={(p) => {
                        p.target.checked ? saveForm.setFieldsValue({checkName: p.target.checked}) : saveForm.setFieldsValue({checkName: null});
                }}/>
            </Form.Item>
        </section>

        <br />

        <div className="guide-title">RADIOBOX</div>
        <section>
            <Radio.Group
                className="box-radio"
                onChange={()=>{}}
            >
                <Radio value={1}>A</Radio>
                <Radio value={2}>B</Radio>
                <Radio value={3}>C</Radio>
                <Radio value={4}>D</Radio>
            </Radio.Group>
        </section>

        <br />

        <div className="guide-title">SEARCH</div>
        <section className="search-wrap">
            <Form
                form={searchForm}
                name="searchFrom"
                onFinish={() => { }}
            >

                <Form.Item
                    name="text"
                    label="검색어"
                >
                    <CustomInput className="inp-search" placeholder="검색어 입력" />
                </Form.Item>

                <Form.Item
                    label="기간"
                    name="picker_name1"
                    className="picker-st"
                >
                    <CustomDatePicker/>
                </Form.Item>

                <Form.Item
                    name="picker_name2"
                    className="picker-ed"
                >
                    <CustomDatePicker/>
                </Form.Item>

                <CustomButton type="primary" htmlType="submit">검색</CustomButton>

                <Form.Item
                    className="box-check"
                    label="해당 사용자의 모든 권한"
                    name="checkName"
                >
                    <CustomCheckbox
                        onChange={(p) => {
                            p.target.checked ? saveForm.setFieldsValue({checkName: p.target.checked}) : saveForm.setFieldsValue({checkName: null});
                    }}/>
                </Form.Item>
            </Form>
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

        <section className="search-wrap">
            <form>
                <span>코드/명</span>
                <CustomInput placeholder="코드/명"/>

                <CustomButton type="primary" htmlType="submit">검색</CustomButton>
                <CustomCheckbox/>
                <span>미사용자 제외</span>
            </form>
        </section>

        <section className="search-wrap">
            <form>
                <span>권한명</span>
                <CustomInput placeholder="권한명" />
                <CustomButton type="primary" htmlType="submit">검색</CustomButton>
            </form>
        </section>

        <section className="search-wrap">
            <form>
                <span>사용자</span>
                <CustomInput className='inp-search' placeholder="사용자"/>
                <CustomButton type="primary" htmlType="submit">검색</CustomButton>
                <CustomCheckbox/>
                <span>해당 사용자의 모든 권한 보기</span>
            </form>
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

        <section className="search-wrap">
            <form>
                <span>분류코드/코드명</span>
                <CustomInput placeholder="분류코드/코드명" />
                <CustomButton type="primary" htmlType="submit">검색</CustomButton>
            </form>
        </section>

        <section className="search-wrap">
            <form>
                <span>코드/코드명</span>
                <CustomInput placeholder="코드/코드명" />
                <CustomButton type="primary" htmlType="submit">검색</CustomButton>
            </form>
        </section>

        <div className="guide-title">BOARD LAYOUT</div>

        <section className="board-wrap">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        board-title-wrap
                    </h3>
                    <div className="box-btn">
                        <CustomButton type="default" size="small">+ 행추가</CustomButton>
                        <CustomButton type="default" size="small">행삭제</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap" style={{ background : 'rgb(211, 252, 210)' }}>
                    board-cont-wrap
                </div>
            </div>
        </section>

        <br />

        <section className="board-wrap half-wrap type01">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        board-title-wrap
                    </h3>
                    <div className="box-btn">
                        <CustomButton type="default" size="small">+ 행추가</CustomButton>
                        <CustomButton type="default" size="small">행삭제</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap" style={{ background : 'rgb(211, 252, 210)' }}>
                    board-cont-wrap
                </div>
            </div>
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        board-title-wrap
                    </h3>
                </div>
                <div className="board-cont-wrap" style={{ background : 'rgb(211, 252, 210)' }}>
                    board-cont-wrap
                </div>
            </div>
        </section>

        <br />

        <section className="board-wrap half-wrap type02">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        board-title-wrap
                    </h3>
                </div>
                <div className="board-cont-wrap" style={{ background : 'rgb(211, 252, 210)' }}>
                    board-cont-wrap
                </div>
            </div>
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        board-title-wrap
                    </h3>
                    <div className="box-btn">
                        <CustomButton type="default" size="small">+ 행추가</CustomButton>
                        <CustomButton type="default" size="small">행삭제</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap" style={{ background : 'rgb(211, 252, 210)' }}>
                    board-cont-wrap
                </div>
            </div>
        </section>

        <br />

        <div className="guide-title">TABLE</div>
        <CustomTable rowSelection={rowSelection} columns={columns as any} dataSource={data} rowNoFlag={true}/>
    </>
        ;

};

export default Guide;

