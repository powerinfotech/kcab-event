import React from 'react';
import CustomInput from '@component/CustomInput';
import IconTitle from '@image/icon_title.svg';
import {BtnInfo} from '@interface/auth/MenuManagement';
import {MenuBtnState} from '../hooks/useMenuManagement';

interface MenuButtonInfoPanelProps {
    btnList: BtnInfo[];
    menuBtnState: MenuBtnState[];
    isEditable: boolean;
    onUpdateUseYn: (btnSeq: number, useYn: string, prevUseYn: string) => void;
    onUpdateBtnNm: (btnSeq: number, btnNm: string, prevBtnNm: string) => void;
}

const MenuButtonInfoPanel: React.FC<MenuButtonInfoPanelProps> = ({
    btnList,
    menuBtnState,
    isEditable,
    onUpdateUseYn,
    onUpdateBtnNm,
}) => (
    <div className="bottom-right">
        <div className="board-title-wrap" style={{marginTop: 16}}>
            <h3 className="title">
                <IconTitle />
                버튼정보
            </h3>
        </div>
        <div className="board-cont-wrap button-info-two-column">
            <div className="button-info-box">
                <div className="button-info-header">기본버튼(권한설정)</div>
                <table className="tbl type02">
                    <colgroup>
                        <col style={{width: '120px'}} />
                        <col style={{width: '80px'}} />
                        <col style={{width: '80px'}} />
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
                                            name={`btn_use_${btn.btnSeq}`}
                                            checked={useYn === 'Y'}
                                            onChange={() => onUpdateUseYn(btn.btnSeq, 'Y', useYn)}
                                            disabled={!isEditable}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`btn_use_${btn.btnSeq}`}
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
                        <col style={{width: '120px'}} />
                        <col style={{width: '200px'}} />
                        <col style={{width: '80px'}} />
                        <col style={{width: '80px'}} />
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
                                            style={{width: '100%'}}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`btn_custom_use_${btn.btnSeq}`}
                                            checked={useYn === 'Y'}
                                            onChange={() => onUpdateUseYn(btn.btnSeq, 'Y', useYn)}
                                            disabled={!isEditable}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`btn_custom_use_${btn.btnSeq}`}
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
    </div>
);

export default MenuButtonInfoPanel;
