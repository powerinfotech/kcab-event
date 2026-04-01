/**
 * CommonGroupCodeSearchPopup - 공통그룹코드 검색 팝업 컴포넌트
 *
 * [목적]
 * 공통그룹코드를 검색하여 선택하는 공통 팝업이다.
 * 그룹코드명으로 검색, 더블클릭 즉시 선택을 지원한다.
 *
 * @param open     - 팝업 표시 여부
 * @param onClose  - 팝업 닫기 콜백
 * @param onSelect - 그룹코드 선택 시 ComGrpCd 전달 콜백
 *
 * [동작 방식]
 * 1. open=true 시 전체 공통그룹코드 목록 초기 조회
 * 2. 그룹코드명으로 검색 → callGetComGrpCdList API 호출
 * 3. 행 클릭으로 선택 후 확인 버튼, 또는 행 더블클릭으로 즉시 선택
 *
 * [사용 방법]
 * @example
 * import CommonGroupCodeSearchPopup from '@component/popup/search/CommonGroupCodeSearchPopup';
 * import { ComGrpCd } from '@interface/code/CommonGroupCode';
 *
 * const [popupOpen, setPopupOpen] = useState(false);
 * const [selectedGroup, setSelectedGroup] = useState<ComGrpCd | null>(null);
 *
 * <CustomButton onClick={() => setPopupOpen(true)}>그룹코드 선택</CustomButton>
 * <span>{selectedGroup?.comGrpCdNm}</span>
 *
 * <CommonGroupCodeSearchPopup
 *   open={popupOpen}
 *   onClose={() => setPopupOpen(false)}
 *   onSelect={(group) => {
 *     setSelectedGroup(group);
 *     setPopupOpen(false);
 *   }}
 * />
 */
import React, {useEffect, useState} from 'react';
import type { TableColumnsType } from 'antd';
import {HttpStatusCode} from 'axios';
import CustomInput from '@component/input/CustomInput';
import CustomButton from '@component/button/CustomButton';
import CustomTable from '@component/display/CustomTable';
import CustomSearchPopup from '@component/popup/CustomSearchPopup';
import {ComGrpCd} from '@interface/code/CommonGroupCode';
import {callGetComGrpCdList} from '@api/code/CommonGroupCodeApi';

const COM_GRP_CD_COLUMNS: TableColumnsType<ComGrpCd> = [
    {title: '그룹코드', key: 'comGrpCd', dataIndex: 'comGrpCd', align: 'center', width: '35%'},
    {title: '그룹코드명', key: 'comGrpCdNm', dataIndex: 'comGrpCdNm', align: 'center', width: '35%'},
    {title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: '30%'},
];

export interface CommonGroupCodeSearchPopupProps {
    open: boolean;
    onClose: () => void;
    onSelect: (group: ComGrpCd) => void;
}

const CommonGroupCodeSearchPopup = ({open, onClose, onSelect}: CommonGroupCodeSearchPopupProps) => {
    const [groupList, setGroupList] = useState<ComGrpCd[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

    useEffect(() => {
        if (open) {
            setSearchText('');
            setSelectedRowIndex(-1);
            callGetComGrpCdList().then(res => {
                if (res.code === HttpStatusCode.Ok) setGroupList(res.item);
            });
        }
    }, [open]);

    const handleSearch = () => {
        callGetComGrpCdList(searchText).then(res => {
            if (res.code === HttpStatusCode.Ok) setGroupList(res.item);
        });
    };

    const handleOk = () => {
        if (selectedRowIndex >= 0 && groupList[selectedRowIndex]) {
            onSelect(groupList[selectedRowIndex]);
        }
        onClose();
    };

    const handleDoubleClick = (record: ComGrpCd) => {
        onSelect(record);
        onClose();
    };

    return (
        <CustomSearchPopup
            title="공통그룹코드 팝업"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            tableTitle="공통그룹코드 조회내역"
            totalCount={groupList.length}
            searchSection={
                <form>
                    <span>그룹코드명</span>
                    <CustomInput
                        value={searchText}
                        className="w180"
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); }}
                    />
                    <CustomButton type="primary" size="small" onClick={handleSearch} className="ml-auto">조회</CustomButton>
                </form>
            }
        >
            <CustomTable
                onRow={(record: any, index?: number) => ({
                    onClick: () => setSelectedRowIndex(index ?? -1),
                    onDoubleClick: () => handleDoubleClick(record),
                })}
                rowKey="comGrpCdSeq"
                pagination={false}
                rowNoFlag
                rowSelectedFlag
                columns={COM_GRP_CD_COLUMNS}
                dataSource={groupList}
                selectedRowIndex={selectedRowIndex}
                scroll={{y: 300}}
            />
        </CustomSearchPopup>
    );
};

export default CommonGroupCodeSearchPopup;
