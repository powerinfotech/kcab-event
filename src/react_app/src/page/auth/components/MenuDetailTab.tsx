import React from 'react';
import {UseFormReturn} from 'react-hook-form';
import {DefaultOptionType} from 'rc-select/lib/Select';
import CustomInput from '@component/input/CustomInput';
import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
import CustomSaveFormRadio from '@component/form/CustomSaveFormRadio';
import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';
import CustomEmpty from '@component/display/CustomEmpty';
import {MenuInfo, MenuType} from '@interface/auth/MenuManagement';
import {CommonCodeMap} from '@interface/common';

interface MenuDetailTabProps {
    saveForm: UseFormReturn<MenuInfo, any>;
    isEditable: boolean;
    isViewMenu: boolean;
    parentMenuCombo: DefaultOptionType[];
    cmCode: CommonCodeMap;
    onDataChanged: () => void;
    onCreateParentMenuCombo: () => void;
}

const MenuDetailTab: React.FC<MenuDetailTabProps> = ({
    saveForm,
    isEditable,
    isViewMenu,
    parentMenuCombo,
    cmCode,
    onDataChanged,
    onCreateParentMenuCombo,
}) => {
    const {register, control, getValues, clearErrors} = saveForm;

    if (!isEditable) {
        return (
            <div className="board-cont-wrap">
                <CustomEmpty description="좌측 트리에서 메뉴를 선택하세요."/>
            </div>
        );
    }

    return (
        <div className="board-cont-wrap">
            <CustomInput className="hide" {...register('menuSeq')}/>
            <CustomInput className="hide" {...register('iudType')}/>
            <div className="board-detail-info menu-detail-two-column">
                <div>
                    <CustomSaveFormInput
                        title={'메뉴일련번호'}
                        control={control}
                        name="menuSeq"
                        disabled={true}
                        onChange={onDataChanged}
                    />
                    <CustomSaveFormSelect
                        title={'상위메뉴'}
                        name="upMenuSeq"
                        control={control}
                        rules={{required: '상위메뉴를 선택해 주세요.'}}
                        required={true}
                        disabled={!isEditable}
                        options={parentMenuCombo}
                        className="w200"
                        showSearch
                        optionFilterProp="label"
                        onChangeValue={() => onDataChanged()}
                    />
                </div>

                <div>
                    <CustomSaveFormInput
                        title={'메뉴명'}
                        required={true}
                        disabled={!isEditable}
                        control={control}
                        name="menuNm"
                        rules={{required: '메뉴명이 입력되지 않았습니다.'}}
                        onChangeValue={onDataChanged}
                    />
                    <CustomSaveFormInput
                        title={'URL'}
                        required={isViewMenu}
                        disabled={!isEditable || !isViewMenu}
                        control={control}
                        name="menuUrl"
                        rules={{
                            validate: (value: string) => {
                                const type = getValues('menuTypeCd');
                                if (type === MenuType.V && (!value || value.trim() === '')) {
                                    return '메뉴 URL이 입력되지 않았습니다.';
                                }
                                return true;
                            },
                        }}
                        onChangeValue={onDataChanged}
                    />
                </div>

                <div>
                    <CustomSaveFormRadio
                        title={'메뉴타입'}
                        required={true}
                        disabled={!isEditable}
                        control={control}
                        name="menuTypeCd"
                        rules={{required: '메뉴타입이 선택되지 않았습니다.'}}
                        onChangeValue={(value: MenuType) => {
                            if (value === MenuType.D) {
                                clearErrors(['menuUrl', 'menuViewPath']);
                            }
                            setTimeout(() => {
                                onDataChanged();
                                onCreateParentMenuCombo();
                            }, 0);
                        }}
                        options={Object.keys(cmCode['MenuType']).map(key => ({value: key, label: cmCode['MenuType'][key]}))}
                    />
                    <CustomSaveFormInput
                        title={'메뉴 View Path'}
                        required={isViewMenu}
                        disabled={!isEditable || !isViewMenu}
                        control={control}
                        name="menuViewPath"
                        rules={{
                            validate: (value: string) => {
                                const type = getValues('menuTypeCd');
                                if (type === MenuType.V && (!value || value.trim() === '')) {
                                    return '메뉴 View Path가 입력되지 않았습니다.';
                                }
                                return true;
                            },
                        }}
                        onChangeValue={onDataChanged}
                    />
                </div>

                <div>
                    <CustomSaveFormRadio
                        title={'사용여부'}
                        required={true}
                        disabled={!isEditable}
                        control={control}
                        name="useYn"
                        rules={{required: '사용여부가 선택되지 않았습니다.'}}
                        onChangeValue={() => setTimeout(onDataChanged, 0)}
                        options={[{value: 'Y', label: '예'}, {value: 'N', label: '아니오'}]}
                    />
                    <CustomSaveFormInput
                        title={'조회순서'}
                        required={true}
                        disabled={!isEditable}
                        control={control}
                        name="sortSeq"
                        regExp={{value: /^\d*$/, message: '숫자만 입력 가능합니다.'}}
                        rules={{required: '조회순서를 입력해 주세요.'}}
                        onChangeValue={onDataChanged}
                    />
                </div>

                <div>
                    <CustomSaveFormInput
                        title={'등록자'}
                        control={control}
                        name="rgstUserName"
                        disabled={true}
                    />
                    <CustomSaveFormInput
                        title={'수정자'}
                        control={control}
                        name="uptUserName"
                        disabled={true}
                    />
                </div>

                <div>
                    <CustomSaveFormInput
                        title={'등록일자'}
                        control={control}
                        name={'rgstDateTime'}
                        disabled={true}
                    />
                    <CustomSaveFormInput
                        title={'수정일자'}
                        control={control}
                        name={'uptDateTime'}
                        disabled={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default MenuDetailTab;
