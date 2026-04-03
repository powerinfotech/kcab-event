import React from 'react';
import CustomInput from '@component/input/CustomInput';
import CustomEmpty from '@component/display/CustomEmpty';
import {BtnInfo} from '@interface/auth/MenuManagement';
import {MenuBtnState} from '../hooks/useMenuManagement';

interface MenuButtonTabProps {
    btnList: BtnInfo[];
    menuBtnState: MenuBtnState[];
    isEditable: boolean;
    onUpdateUseYn: (btnSeq: number, useYn: string, prevUseYn: string) => void;
    onUpdateBtnNm: (btnSeq: number, btnNm: string, prevBtnNm: string) => void;
}

const MenuButtonTab: React.FC<MenuButtonTabProps> = ({
    btnList,
    menuBtnState,
    isEditable,
    onUpdateUseYn,
    onUpdateBtnNm,
}) => {
    if (!isEditable) {
        return (
            <div className="board-cont-wrap">
                <CustomEmpty description="좌측 트리에서 메뉴를 선택하세요."/>
            </div>
        );
    }

    return (
        <div className="board-cont-wrap button-info-two-column">
            <div className="button-info-box">
                <div className="button-info-header">기본버튼(권한설정)</div>
                <table className="tbl type02">
                    <colgroup>
                        <col className="w120"/>
                        <col className="w080"/>
                        <col className="w080"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>버튼명</th>
                            <th>사용</th>
                            <th>미사용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {btnList.filter(b => b.sortSeq >= 11 && b.sortSeq <= 15).map(btn => {
                            const state = menuBtnState.find(s => Number(s.btnSeq) === Number(btn.btnSeq));
                            const useYn = state?.useYn ?? 'N';
                            return (
                                <tr key={btn.btnSeq}>
                                    <td>{btn.btnNm}</td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`btn_use_v2_${btn.btnSeq}`}
                                            checked={useYn === 'Y'}
                                            onChange={() => onUpdateUseYn(btn.btnSeq, 'Y', useYn)}
                                            disabled={!isEditable}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`btn_use_v2_${btn.btnSeq}`}
                                            checked={useYn === 'N'}
                                            onChange={() => onUpdateUseYn(btn.btnSeq, 'N', useYn)}
                                            disabled={!isEditable}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="button-info-box">
                <div className="button-info-header">커스텀버튼(권한설정)</div>
                <table className="tbl type02">
                    <colgroup>
                        <col className="w120"/>
                        <col className="w200"/>
                        <col className="w080"/>
                        <col className="w080"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>버튼명</th>
                            <th></th>
                            <th>사용</th>
                            <th>미사용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {btnList.filter(b => b.sortSeq >= 1 && b.sortSeq <= 9).map(btn => {
                            const state = menuBtnState.find(s => Number(s.btnSeq) === Number(btn.btnSeq));
                            const btnNm = state?.btnNm ?? '';
                            const useYn = state?.useYn ?? 'N';
                            return (
                                <tr key={btn.btnSeq}>
                                    <td>{btn.btnNm}</td>
                                    <td>
                                        <CustomInput
                                            value={btnNm}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateBtnNm(btn.btnSeq, e.target.value, btnNm)}
                                            disabled={!isEditable}
                                            className="w-full"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`btn_custom_use_v2_${btn.btnSeq}`}
                                            checked={useYn === 'Y'}
                                            onChange={() => onUpdateUseYn(btn.btnSeq, 'Y', useYn)}
                                            disabled={!isEditable}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`btn_custom_use_v2_${btn.btnSeq}`}
                                            checked={useYn === 'N'}
                                            onChange={() => onUpdateUseYn(btn.btnSeq, 'N', useYn)}
                                            disabled={!isEditable}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MenuButtonTab;
