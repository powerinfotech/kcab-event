import {Button, message } from "antd";
import React, {useRef, useState} from "react";

import {HttpStatusCode} from "axios";

import { useForm} from "react-hook-form";

import CustomValidFormInput from '@component/form/CustomValidFormInput';
import CustomModal, {CustomModalProps} from "@component/feedback/CustomModal";
import {useMessage} from '@hook/useMessage';
import {ModalProps} from "antd/es/modal/interface";
import {ChangePassword, findUserInfo} from "@interface/auth/FindUser";
import {callChangePassword, getUserPassword} from "@api/auth/FindUserApi";

interface ChangePasswordPopupProps extends ModalProps {
    onOk?: () => void;
    onCancel?: () => void;
    onClose:() => void;
}
const FindPasswordPopup = (props:ChangePasswordPopupProps) => {
    const{
        control: findPasswordControl
        ,register: findPasswordRegister
        ,handleSubmit: findPasswordHandleSubmit
        ,reset: findPassworReset
        ,setError: findPassworSetError
    } = useForm<findUserInfo>({mode:'onSubmit'});
    const{
        control: changePasswordControl
        , register: changePasswordRegister
        , handleSubmit: changePasswordHandleSubmit
        , reset: changePasswordReset
        , setError: changePasswordSetError
    } = useForm<ChangePassword>({mode:'onSubmit'});
    const[findInfo,SetFindInfo] = useState<findUserInfo>({
        userId:'',
        userName:'',
        confirmPassword:'',
        newPassword:'',
        hpNo:''
    });
    const [changeInfo, SetChangeInfo] = useState<ChangePassword>({
        userId: '',
        userSeq: 0,
        password: '',
        password_retry: ''
    });
    const {alert} = useMessage();
    const formRef = useRef<HTMLButtonElement>(null);
    const [isModalOpen,setIsModalOpen] = useState(false);

    const handleFindPassword = async (value:findUserInfo)=>{
        try{
            const result = await getUserPassword(value);
            if(result.code===HttpStatusCode.Ok&& result.item)
            {
                SetChangeInfo(
                    {
                        userId:result.item.userId,
                        userSeq:result.item.userSeq
                    });
                setIsModalOpen(true);
            }else{
                message.warning("해당 정보로 회원가입된 아이디가 없습니다.");
            }
        }catch (e){

            message.error("관리자에게 문의바랍니다.");
        }


    };

    const handleSave = async(value:ChangePassword) => {
        if(value.password != value.password_retry) {
            changePasswordSetError('password_retry', { message:'패스워드가 일치하지 않습니다.'});
            return;
        }

        const result = await callChangePassword(changeInfo);
        if(result.code === HttpStatusCode.Ok) {
            alert('비밀번호가 변경되었습니다.');
            setTimeout(()=>{
                handleReset();
                props.onOk && props.onOk();
                props.onClose && props.onClose();
            });

        }  else {
            message.error(result.message);
        }

    };
    const handleReset=()=>{
        SetFindInfo({userId:'',userName:'',hpNo:""});
        findPassworReset();
    };
    return(
        <div>

            <form onSubmit={findPasswordHandleSubmit(handleFindPassword)}>
        <div>

            <span className={'tit'}>{'사용자ID'}</span>
            <div className={"box-inp"}>
    <CustomValidFormInput
        control={findPasswordControl} title={'사용자Id'}
    required={true}
    {...findPasswordRegister('userId',{required:'아이디를 입력하세요'})}
    onChangeValue={(v: string) => SetFindInfo({...findInfo, userId: v})}

    />
    </div>


    <span className={'tit'}>{'이름'}</span>
        <div className={"box-inp"}>
    <CustomValidFormInput
        control={findPasswordControl}
    title={'사용자이름'}
    onChangeValue={(v: string) => SetFindInfo({...findInfo, userName: v})}
    {...findPasswordRegister('userName',{required:'아이디를 입력하세요'})}
    />
    </div>


    <span className={'tit'}>{'휴대폰번호'}</span>
        <div className={"box-inp"}>
    <CustomValidFormInput
        control={findPasswordControl}
    title={'휴대폰번호'}
    onChangeValue={(v: string) => SetFindInfo({...findInfo, hpNo: v})}
    {...findPasswordRegister('hpNo',{required:'아이디를 입력하세요'})}
    />
    </div>

    </div>
    <Button type='primary'  ref={formRef} onClick={findPasswordHandleSubmit(handleFindPassword)} className="mt10">비밀번호 찾기</Button>
    <Button type='primary' onClick={props.onClose} className="mt10">닫기</Button>
    </form>

    {changeInfo &&(
        <CustomModal {...props}
        onOk={()=> {formRef.current?.click();}}
        onCancel={()=>{handleReset();
        props.onClose && props.onClose();}}
        open={isModalOpen}
        footer={null}
        >
        <form onSubmit={changePasswordHandleSubmit(handleSave)}>
        <div>

            <span className="tit">{'변경할 비밀번호'}</span>
            <div className="box-inp">
    <CustomValidFormInput
        title={'변경할 비밀번호'}
        type={'password'}
        control={changePasswordControl}
        required={true}
        onChangeValue={(v: string) => SetChangeInfo({...changeInfo, password: v})}
        {...changePasswordRegister('password', {required: '비밀번호를 입력하세요.'})}
        />
        </div>


        <span className="tit">{'비밀번호 확인'}</span>
        <div className="box-inp">
    <CustomValidFormInput
        title={'비밀번호 확인'}
        type={'password'}
        control={changePasswordControl}
        required={true}
        {...changePasswordRegister('password_retry', {required: '비밀번호를 입력하세요.'})}
        />
        </div>

        </div>
        <Button type={'primary'} ref={formRef} onClick={changePasswordHandleSubmit(handleSave)} className="mt10">비밀번호 변경</Button>
    <Button type="primary" onClick={props.onClose} className="mt10">닫기</Button>
    </form>

    </CustomModal>
    )}

    </div>
);
};




export default FindPasswordPopup;
