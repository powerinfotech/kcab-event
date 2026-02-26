import {TableColumnsType,message} from 'antd';
import React, {useEffect, useState} from 'react';
import CustomButton from '@component/CustomButton';
import CustomRangePicker from "@component/CustomRangePicker";
import CustomTable from '@component/CustomTable';
import IconTitle from '@icon/IconTitle';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import {callGetAccessLogList, callGetAccessLogUserList} from '@api/stats/AccessLogApi';
import {AccessLogAutoCompeteOption, AccessLogListItem, AccessLogListParam} from '@interface/stats/AccessLog';
import {useForm} from 'react-hook-form';
import dayjs from "dayjs";
import CustomValidAutoComplete from '@component/form/CustomValidAutocomplete';
import CustomValidFormCheckbox from '@component/form/CustomValidFormCheckbox';
import {PageButtonHandlers} from '@interface/common';

const AccessLog = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const [open, setOpen] = useState(false);
    const {control: searchFormControl, handleSubmit: searchFormHandleSubmit,reset:searchFormReset,setValue, getValues} = useForm<AccessLogListParam>({mode:'all'});
    const [tableHeight, setTableHeight] = useState(600);
    // 초기화 버튼 기능 구현을 위한 변수 선언 (초기값 셋팅)
    const initParam = {
        userId:'',
        useFlag:undefined,
        searchText:'',
        startDate:dayjs().format("YYYY-MM-DD"),
        endDate:dayjs().format("YYYY-MM-DD")
    };

    //검색조건이 여러개 있는 경우에는 아래 state를 검색조건 통 하나로 선언해 줍니다.
    const [userList, setUserList] = useState<AccessLogAutoCompeteOption[]>([]);
    //autoComplete 에서 선택된 user state
    const [selectUser, setSelectUser] = useState<AccessLogAutoCompeteOption | null>(null);
    //logList
    const [accessLogList, setAccessLogList] = useState<AccessLogListItem[]>([]);

    const columns: TableColumnsType<AccessLogListItem> = [
        {
            title: 'ID',
            dataIndex: 'userId',
            align:'center',
        },
        {
            title: '사용자',
            dataIndex: 'userName',
            align:'center',
        },
        {
            title: '일시',
            dataIndex: 'loginDateTime',
            align:'center',
        },
        {
            title: 'IP 주소',
            dataIndex: 'accessIp',
            align:'center',
        },
        {
            title: '로그인 환경',
            dataIndex: 'browser',
            align:'center',
        },
        {
            title: '접속 구분',
            dataIndex: 'accessNm',
            align:'center',
        }
    ];

    const selectUserList = async (searchText : string) => {
        const data = await callGetAccessLogUserList(searchText);
        const autoCompleteList = data.item.map((item) => {
            const object = {
                label : `${item.userName}(${item.userId})`,
                value : item.userName,
                value2: item.userId
            };
            return object;
        });
        setUserList(autoCompleteList);
    };

    const selectAccessLogList = async (params:AccessLogListParam) => {
        const data = await callGetAccessLogList(params);
        setAccessLogList(data.item);
    };

    const onFinish = (values:AccessLogListParam) => {
        values.userId =selectUser?.value2?selectUser?.value2:'';
        values.startDate = getValues("startDate") ?? dayjs().format("YYYY-MM-DD");
        values.endDate = getValues("endDate") ?? dayjs().format("YYYY-MM-DD");
        selectAccessLogList(values);
    };

    useEffect(() => {
        selectUserList('');
        selectAccessLogList(initParam);
    }, []);

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

    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: () => { selectAccessLogList(initParam); setSelectUser(null); searchFormReset(); },
                cfmSearch: searchFormHandleSubmit(onFinish),
            };
        }
    });

    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);

    return <>
        <section className="search-wrap">
            <form>
                <span>기간</span>&nbsp;&nbsp;
                <div className="deps">

                    <CustomRangePicker
                        open={open}
                        onOpenChange={(open) => setOpen(open)}
                        value={[
                            dayjs(getValues("startDate")),
                            dayjs(getValues("endDate")),
                        ]}
                        minLength={6}
                        onCalendarChange={(value, dateStrings, info) => {

                            if(value[0] && value[1]) {
                                /*
                                const startDate = dayjs(value[0]);
                                const endDate = dayjs(value[1]);
                                const maxDiff = 6;

                                if(endDate.diff(startDate, "month") > maxDiff) {
                                    message.error("최대 6개월까지만 조회 가능합니다.");
                                    setOpen(false);
                                } else {
                                    setValue("startDate", dayjs(value[0]).format("YYYY-MM-DD"));
                                    setValue("endDate", dayjs(value[1]).format("YYYY-MM-DD"));
                                }
                                 */
                                setValue("startDate", dayjs(value[0]).format("YYYY-MM-DD"));
                                setValue("endDate", dayjs(value[1]).format("YYYY-MM-DD"));
                            }

                        }}
                    />
                </div>&emsp;
                <span>사용자</span>
                <CustomValidAutoComplete
                    control={searchFormControl}
                    name={'searchText'}
                    placeholder={'사용자를 선택해 주세요.'}
                    options={userList}
                    onChangeValue={(value) => {
                        const user = userList.find(user => user.value === value);
                        if (!value || (undefined===user)) {
                            setSelectUser(null);
                        }
                    }}
                    onSelect={(value, item) => {
                        setSelectUser({
                            label: `${item.value}(${item.value2})`,
                            value: `${item.value}`,
                            value2: item.value2 ? item.value2 : ''
                        });
                    }}
                    label={selectUser?.label as string??''}
                    onSearch={selectUserList}
                    showName={true}
                    size="large">
                </CustomValidAutoComplete>

                <CustomValidFormCheckbox name={'useFlag'} control={searchFormControl}/>
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
                    <CustomTable scroll={{ x: 900, y: tableHeight }} columns={columns} dataSource={accessLogList} rowNoFlag={true}/>
                </div>
            </div>
        </section>
    </>;

};

export default AccessLog;

