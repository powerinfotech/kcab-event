import React from 'react';
import {Controller, UseFormReturn} from 'react-hook-form';
import dayjs from 'dayjs';
import CustomInput from '@component/input/CustomInput';
import CustomCheckbox from '@component/select/CustomCheckbox';
import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';
import CustomSaveFormDatePicker from '@component/form/CustomSaveFormDatePicker';
import IconTitle from '@icon/IconTitle';
import CustomButton from '@component/button/CustomButton';
import {UserList} from '@interface/master/UserManagement';
import {IudType} from '@interface/common';

interface UserDetailFormProps {
    saveForm: UseFormReturn<UserList, any>;
    isEditable: boolean;
    currentDataSource: UserList | undefined;
    cmCode: Record<string, any>;
    onDataChanged: () => void;
    onOpenPasswordPopup: () => void;
}

const UserDetailForm: React.FC<UserDetailFormProps> = ({
    saveForm,
    isEditable,
    currentDataSource,
    cmCode,
    onDataChanged,
    onOpenPasswordPopup,
}) => {
    const {register, control, handleSubmit, getValues, setValue} = saveForm;

    return (
        <div>
            <div className="board-title-wrap">
                <h3 className="title">
                    <IconTitle/>
                    상세정보
                </h3>
                <div className="box-btn">
                    <CustomButton className="w100" type="default" size="small"
                                  disabled={!currentDataSource
                                      || !isEditable
                                      || currentDataSource?.iudType === IudType.I} onClick={onOpenPasswordPopup}>비밀번호 변경</CustomButton>
                </div>
            </div>

            <div className="board-cont-wrap">
                <form onSubmit={handleSubmit(() => {})}>
                <CustomInput className="hide" {...register('userSeq')}/>
                <div className="board-detail-info menu-detail-two-column">
                    <div>
                        <CustomSaveFormInput
                            title="사용자ID"
                            control={control}
                            required={true}
                            maxLength={20}
                            disabled={!isEditable || currentDataSource?.iudType !== IudType.I}
                            regExp={{value: /^[a-z0-9]*$/, message: '사용자 ID는 영문 소문자, 숫자만 입력가능합니다.'}}
                            {...register('userId', {
                                required: '사용자 ID는 필수입력입니다.',
                                minLength: {value: 3, message: '사용자 ID는 3글자 이상이어야 합니다.'},
                                maxLength: {value: 20, message: '사용자 ID는 20글자 이하이어야 합니다.'},
                                onChange: onDataChanged,
                            })}
                        />
                        <CustomSaveFormSelect
                            title="사용자구분"
                            control={control}
                            required={true}
                            disabled={!isEditable}
                            options={Object.keys(cmCode).length > 0 ? Array.from(Object.entries(cmCode['UserClass'] ?? {}), ([value, label]) => ({value, label: String(label)})) : []}
                            {...register('userCd', {required: '사용자구분은 필수입력입니다.', onChange: onDataChanged})}
                        />
                    </div>
                    <div>
                        <CustomSaveFormInput
                            title="성명(한글)"
                            control={control}
                            required={true}
                            maxLength={20}
                            disabled={!isEditable}
                            regExp={{value: /^[ㄱ-ㅎ가-힣]*$/, message: '성명(한글)은 한글만 입력가능합니다.'}}
                            {...register('userName', {
                                required: '성명(한글)은 필수입력입니다.',
                                pattern: {value: /^[가-힣]*$/, message: '성명(한글)은 한글만 입력가능합니다.'},
                                minLength: {value: 2, message: '성명(한글)은 2글자 이상이어야 합니다.'},
                                onChange: onDataChanged,
                            })}
                        />
                        <CustomSaveFormInput
                            title="성명(영문)"
                            control={control}
                            required={true}
                            disabled={!isEditable}
                            maxLength={30}
                            regExp={{value: /^[a-z\sA-Z]*$/, message: '성명(영문)은 알파벳만 입력가능합니다.'}}
                            {...register('userNameEng', {
                                required: '성명(영문)은 필수입력입니다.',
                                minLength: {value: 2, message: '성명(영문)은 2글자 이상이어야 합니다.'},
                                onChange: onDataChanged,
                            })}
                        />
                    </div>
                    <div>
                        <CustomSaveFormInput
                            title="내선번호"
                            control={control}
                            required={true}
                            maxLength={4}
                            disabled={!isEditable}
                            regExp={{value: /^[0-9]*$/, message: '내선번호는 숫자만 입력가능합니다.'}}
                            {...register('telNo', {
                                required: '내선번호는 필수입력입니다.',
                                minLength: {value: 4, message: '내선번호는 4자리여야 합니다.'},
                                onChange: onDataChanged,
                            })}
                        />
                        <CustomSaveFormInput
                            title="H.P 번호"
                            control={control}
                            required={true}
                            disabled={!isEditable}
                            maxLength={11}
                            regExp={{value: /^[0-9]*$/, message: '휴대폰번호는 숫자만 입력가능합니다.'}}
                            displayFormatter={(v: string) => v.length === 11 ? v.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : v}
                            {...register('hpNo', {
                                required: 'H.P 번호는 필수입력입니다.',
                                pattern: {value: /^[0-9]*$/, message: '휴대폰번호는 숫자만 입력가능합니다.'},
                                minLength: {value: 10, message: '휴대폰번호는 10자리 이상이어야 합니다.'},
                                onChange: onDataChanged,
                            })}
                        />
                    </div>
                    <div>
                        <CustomSaveFormInput
                            title="이메일"
                            control={control}
                            required={true}
                            disabled={!isEditable}
                            maxLength={120}
                            regExp={{value: /^[@\-_.a-zA-Z0-9]*$/, message: '이메일은 영문, 숫자, 특수문자(@-_.)만 입력가능합니다.'}}
                            {...register('email', {
                                required: '이메일은 필수입력입니다.',
                                pattern: {value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i, message: '이메일 형식에 맞지 않습니다.'},
                                onChange: onDataChanged,
                            })}
                        />
                        <CustomSaveFormInput
                            title="부서"
                            control={control}
                            disabled={!isEditable}
                            name="dprtCd"
                            onChangeValue={onDataChanged}
                            maxLength={20}
                        />
                    </div>
                    <div>
                        <CustomSaveFormDatePicker
                            title="사용시작일"
                            control={control}
                            disabled={!isEditable}
                            maxDate={getValues('endDate') ? dayjs(getValues('endDate'), 'YYYY-MM-DD') : undefined}
                            onChangeValue={() => onDataChanged()}
                            {...register('strDate', {required: '사용시작일은 필수입력입니다.', onChange: onDataChanged})}
                        />
                        <CustomSaveFormDatePicker
                            name="endDate"
                            title="사용종료일"
                            control={control}
                            disabled={!isEditable}
                            onChangeValue={onDataChanged}
                            minDate={getValues('strDate') ? dayjs(getValues('strDate'), 'YYYY-MM-DD') : undefined}
                        />
                    </div>
                    <div>
                        <Controller
                            name="admYn"
                            control={control}
                            render={({field}) => (
                                <div>
                                    <span className="tit">관리자여부</span>
                                    <div className="box-inp">
                                        <CustomCheckbox
                                            checked={field.value === 'Y'}
                                            disabled={!isEditable}
                                            onChange={(e) => {
                                                field.onChange(e.target.checked ? 'Y' : 'N');
                                                onDataChanged();
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        />
                        <CustomSaveFormInput
                            title="최종로그인일시"
                            control={control}
                            name="loginDateTime"
                            disabled={true}
                        />
                    </div>
                    <div>
                        <Controller
                            name="useYn"
                            control={control}
                            render={({field}) => (
                                <div>
                                    <span className="tit">사용여부</span>
                                    <div className="box-inp">
                                        <CustomCheckbox
                                            checked={field.value === 'Y'}
                                            disabled={!isEditable}
                                            onChange={(e) => {
                                                const v = e.target.checked ? 'Y' : 'N';
                                                field.onChange(v);
                                                setValue('endDate', v === 'Y' ? undefined : dayjs().format('YYYY-MM-DD'));
                                                onDataChanged();
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        />
                        <CustomSaveFormInput title="수정자" control={control} name="lastModifyUserName" disabled={true} />
                    </div>
                    <div>
                        <CustomSaveFormInput title="최종수정일" control={control} name="uptDateTime" disabled={true} />
                        {currentDataSource?.iudType === IudType.I ? (
                            <CustomSaveFormInput
                                title="비밀번호"
                                type="password"
                                control={control}
                                required={true}
                                maxLength={20}
                                disabled={!isEditable}
                                autoComplete="new-password"
                                {...register('password', {
                                    required: '비밀번호는 필수입력입니다.',
                                    minLength: {value: 4, message: '비밀번호는 4글자 이상이어야 합니다.'},
                                    maxLength: {value: 20, message: '비밀번호는 20글자 이하이어야 합니다.'},
                                    onChange: onDataChanged,
                                })}
                            />
                        ) : <div />}
                    </div>
                </div>
                </form>
            </div>
        </div>
    );
};

export default UserDetailForm;
