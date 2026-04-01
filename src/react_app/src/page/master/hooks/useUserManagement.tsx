import { message } from '@util/antdMessage';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {HttpStatusCode} from 'axios';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import {callDeleteUser, callGetUserList, callSaveUser} from '@api/master/UserManagementApi';
import {User, UserList, UserListSearchParam} from '@interface/master/UserManagement';
import {IudType} from '@interface/common';
import {useMessage} from '@hook/useMessage';
import {IUD_COLUMN} from '@component/display/CustomTable';

// ── Module-level constants ──

export const columns: TableColumnsType<any> = [
    IUD_COLUMN,
    {
        title: <div className="tac">ID</div>,
        key: 'userId',
        dataIndex: 'userId',
        width: '10%',
    },
    {
        title: <div className="tac">사용자구분</div>,
        key: 'userCd',
        dataIndex: 'userCd',
        align: 'center',
        width: '8%',
    },
    {
        title: <div className="tac">성명(한글)</div>,
        key: 'userName',
        dataIndex: 'userName',
        align: 'center',
        width: '9%',
    },
    {
        title: <div className="tac">성명(영문)</div>,
        key: 'userNameEng',
        dataIndex: 'userNameEng',
        width: '10%',
    },
    {
        title: <div className="tac">내선번호</div>,
        key: 'telNo',
        dataIndex: 'telNo',
        align: 'center',
        width: '8%',
    },
    {
        title: <div className="tac">전화번호</div>,
        key: 'hpNo',
        dataIndex: 'hpNo',
        width: '10%',
    },
    {
        title: <div className="tac">이메일</div>,
        key: 'email',
        dataIndex: 'email',
        width: '14%',
    },
    {
        title: <div className="tac">사용시작일</div>,
        key: 'strDate',
        dataIndex: 'strDate',
        align: 'center',
        width: '9%',
        render: (val: string | undefined) => (val ? dayjs(val, 'YYYYMMDD').format('YYYY-MM-DD') : ''),
    },
    {
        title: <div className="tac">사용종료일</div>,
        key: 'endDate',
        dataIndex: 'endDate',
        align: 'center',
        width: '9%',
        render: (val: string | undefined) => (val ? dayjs(val, 'YYYYMMDD').format('YYYY-MM-DD') : ''),
    },
    {
        title: <div className="tac">최종로그인일시</div>,
        key: 'loginDateTime',
        dataIndex: 'loginDateTime',
        align: 'center',
        width: '11%',
        render: (val: string | undefined) => (val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
];

const EMPTY_USER: UserList = {
    userSeq: 0,
    userId: '',
    password: '',
    userName: '',
    userNameEng: '',
    nickName: '',
    userCd: '',
    telNo: '',
    hpNo: '',
    dprtCd: '',
    email: '',
    strDate: undefined,
    endDate: undefined,
    loginDateTime: undefined,
    useYn: 'Y',
    admYn: 'N',
    lastUpdateDate: undefined,
    lastModifyUserName: '',
    iudType: IudType.I,
};

const isItemChanged = (originalItem: User, newItem: User): boolean => {
    for (const key in newItem) {
        if (originalItem[key] !== newItem[key]) return true;
    }
    return false;
};

const toDateVarcharYYYYMMDD = (dateStr: string | undefined): string | undefined => {
    if (!dateStr) return undefined;
    const d = dayjs(dateStr);
    return d.isValid() ? d.format('YYYYMMDD') : undefined;
};

// ── Hook ──

export function useUserManagement() {
    const {confirm} = useMessage();

    const searchForm = useForm<UserListSearchParam>();
    const saveForm = useForm<UserList>({mode: 'onSubmit'});

    const [dataSource, setDataSource] = useState<UserList[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<UserList[]>([]);
    const [isRowSelected, setIsRowSelected] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

    const isEditable = isRowSelected;
    const currentDataSource = dataSource[selectedRowIndex];
    const isChangedDataSource = dataSource.some(v => v.iudType);

    const getCurrentRowDataSourceById = (id: number) => {
        return dataSource.find(v => v.userSeq === id);
    };

    const handleSearchList = async (skipConfirm = false) => {
        if (!skipConfirm && isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if (!result) return;
        }
        const idOrName = searchForm.getValues('idOrName') ?? '';
        const isCheck = searchForm.getValues('isCheck') ?? false;
        const res = await callGetUserList({userId: idOrName, userName: idOrName, isCheck});
        setDataSource(structuredClone(res.item));
        setOrgDataSource(structuredClone(res.item));
        if (res.item.length > 0) {
            handleRowSelection(res.item[0], 0);
        } else {
            saveForm.reset(EMPTY_USER);
            setIsRowSelected(false);
            setSelectedRowIndex(-1);
        }
    };

    const handleSave = async (value: UserList) => {
        const saveData = getCurrentRowDataSourceById(value.userSeq);
        if (!saveData?.iudType) {
            message.info('변경된 내용이 없습니다.');
            return;
        }

        if (!await confirm('저장 하시겠습니까?')) return;

        const payload = {
            ...saveData,
            strDate: toDateVarcharYYYYMMDD(saveData.strDate),
            endDate: toDateVarcharYYYYMMDD(saveData.endDate),
        };
        const saveResult = await callSaveUser(payload);
        if (saveResult.code !== HttpStatusCode.Ok) return;

        message.success('저장되었습니다.');
        const idOrName = searchForm.getValues('idOrName') ?? '';
        const isCheck = searchForm.getValues('isCheck') ?? false;
        const res = await callGetUserList({userId: idOrName, userName: idOrName, isCheck});
        setDataSource(structuredClone(res.item));
        setOrgDataSource(structuredClone(res.item));

        const newUserListRowIdx = res.item.findIndex(f => f.userSeq === saveResult.item.userSeq) ?? -1;
        const savedUser = res.item.find(f => f.userSeq === saveResult.item.userSeq);

        setSelectedRowIndex(newUserListRowIdx);
        if (newUserListRowIdx >= 0 && savedUser) {
            saveForm.reset(savedUser);
            setIsRowSelected(true);
        } else {
            saveForm.reset(EMPTY_USER);
            setIsRowSelected(false);
        }
    };

    const handleReset = () => {
        const currentUserSeq = saveForm.getValues('userSeq');
        const changedDataSource = dataSource.map(item => {
            if (item.userSeq !== currentUserSeq) return item;
            const original = orgDataSource.find(v => v.userSeq === currentUserSeq);
            if (original) {
                return {...original};
            }
            return {...item, iudType: item.iudType !== IudType.I ? undefined : item.iudType};
        });
        saveForm.reset(EMPTY_USER);
        setIsRowSelected(false);
        setSelectedRowIndex(-1);
        setDataSource(changedDataSource);
    };

    const handleAdd = async () => {
        if (isChangedDataSource) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if (!result) return;
        }

        const newUser: UserList = {
            ...structuredClone(EMPTY_USER),
            userSeq: orgDataSource.length > 0 ? Math.max(...orgDataSource.map(v => v.userSeq + 1)) : 0,
            iudType: IudType.I,
            strDate: dayjs().format('YYYY-MM-DD'),
        };
        const addedDataSource = orgDataSource.concat([newUser]);
        setDataSource(addedDataSource);
        handleRowSelection(newUser, addedDataSource.length - 1).then();
    };

    const handleDelete = async () => {
        if (!await confirm('삭제하시겠습니까?')) return;

        const result = await callDeleteUser(saveForm.getValues('userSeq'));
        if (result.code === HttpStatusCode.Ok) {
            message.success('삭제되었습니다.');
            handleSearchList(true);
            setIsRowSelected(false);
        }
    };

    const handleRowSelection = async (recode: User, index: number) => {
        saveForm.reset(recode);
        setIsRowSelected(true);
        setSelectedRowIndex(index);
    };

    const handleRowChanged = async (clickedRecord?: User, clickedIndex?: number) => {
        if (clickedRecord != null && currentDataSource != null && clickedRecord.userSeq === currentDataSource.userSeq) {
            return true;
        }
        if (isChangedDataSource) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 진행 하시겠습니까?');
            if (!result) return false;
            saveForm.reset();
            setDataSource(structuredClone(orgDataSource));
        }
        return true;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchList();
        }
    };

    const handleDataChanged = () => {
        const formData = saveForm.getValues();
        const changedDataSource = dataSource.map(item => {
            if (item.userSeq !== saveForm.getValues('userSeq')) return item;
            const original = orgDataSource.find(v => v.userSeq === item.userSeq);
            if (original && !isItemChanged(original, formData)) {
                return {...item, ...formData, iudType: item.iudType === IudType.I ? IudType.I : undefined};
            }
            return {...item, ...formData, iudType: item.iudType ?? IudType.U};
        });
        setDataSource(changedDataSource);
    };

    useEffect(() => {
        handleSearchList();
    }, []);

    return {
        // Forms
        searchForm,
        saveForm,

        // Data state
        dataSource,
        currentDataSource,
        selectedRowIndex,

        // UI state
        isEditable,
        isChangedDataSource,
        isOpen,
        setIsOpen,

        // Handlers
        handleSearchList,
        handleSave,
        handleReset,
        handleAdd,
        handleDelete,
        handleRowSelection,
        handleRowChanged,
        handleKeyDown,
        handleDataChanged,
    };
}
