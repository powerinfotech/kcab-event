import { message } from '@util/antdMessage';
import CustomModal, {CustomModalProps} from '@component/feedback/CustomModal';
import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
import {ChangePassword, User} from '@interface/master/UserManagement';
import {Button} from 'antd';
import {callChangePassword} from '@api/master/UserManagementApi';
import {HttpStatusCode} from 'axios';

interface ChangePasswordPopupProps extends CustomModalProps {
    userInfo: User;
    onOk?: () => void;
    onCancel?: () => void;
}

const ChangePasswordPopup = (props:ChangePasswordPopupProps) => {
    const {control: changePasswordFormControl
        , register: changePasswordFormRegister
        , handleSubmit: changePasswordFormHandleSubmit
        , reset: changePasswordFormReset
        , setError: changePasswordFormSetError
    } = useForm<ChangePassword>({mode:'onSubmit'});
    const [info, setInfo] = useState<ChangePassword>({userSeq:props.userInfo?.userSeq, userId: props.userInfo?.userId, password:'', password_retry:''});
    const formRef = useRef<HTMLButtonElement>(null);

    const handleSave = async(value:ChangePassword) => {
        if(value.password != value.password_retry) {
            changePasswordFormSetError('password_retry', { message:'패스워드가 일치하지 않습니다.'});
            return;
        }
        const result = await callChangePassword({...info, password: value.password, password_retry: value.password_retry});
        if(result.code === HttpStatusCode.Ok) {
            message.info('비밀번호가 변경되었습니다.');
            handleReset();
            props.onOk && props.onOk();
        }

    };

    const handleReset = () => {
        setInfo({userSeq:-1, userId: '', password:'', password_retry:''});
        changePasswordFormReset();
    };

    useEffect(() => {
       props.userInfo&& setInfo(props.userInfo);
       props.userInfo&&changePasswordFormReset(props.userInfo);
    }, [props.userInfo, props.open]);

    return (
        <CustomModal  {...props}
                      onOk={()=>{formRef.current?.click();}}
                      onCancel={()=>{handleReset(); props.onCancel&&props.onCancel();}}>
            <form onSubmit={changePasswordFormHandleSubmit(handleSave)}>
                <div>
                    <CustomSaveFormInput
                        name={'userId'}
                        title={'사용자 ID'}
                        control={changePasswordFormControl}
                        disabled={true}
                        defaultValue={info?.userId??''}
                    />
                    <CustomSaveFormInput
                        title={'변경할 비밀번호'}
                        type={'password'}
                        control={changePasswordFormControl}
                        required={true}
                        onChangeValue={(v)=>setInfo({...info, password:v})}
                        {...changePasswordFormRegister('password', {required:'비밀번호를 입력하세요.'})}
                    />
                    <CustomSaveFormInput
                        title={'비밀번호 확인'}
                        type={'password'}
                        control={changePasswordFormControl}
                        required={true}
                        {...changePasswordFormRegister('password_retry', {required:'비밀번호를 입력하세요.'})}
                    />
                </div>
                <Button className="hide" ref={formRef} onClick={changePasswordFormHandleSubmit(handleSave)}/>
            </form>
        </CustomModal>
    );
};

export default ChangePasswordPopup;