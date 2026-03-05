import React, {useRef, useState} from "react";
import {Button, Input, message, Modal} from "antd";
import  {HttpStatusCode} from "axios";
import {ModalProps} from "antd/es/modal/interface";
import {useForm} from "react-hook-form";
import CustomModal from "@component/CustomModal";
import {useMessage} from "@hook/useMessage";
import CustomValidFormInput from "@component/form/CustomValidFormInput";
import {getUserId} from "@api/auth/FindUserApi";
import {findUserInfo} from "@interface/auth/FindUser";


interface ChangePasswordPopupProps extends ModalProps {
    onOk?: () => void;
    onCancel?: () => void;
}

const FindIdPopup = (props:ChangePasswordPopupProps) => {

    const{
        control: findIdControl,
        register: findIdRegister,
        reset: findIdReset,
        setError: findIdError,
        handleSubmit:findIdHandleSubmit
    } = useForm<findUserInfo>({mode:"onSubmit"});

    const[findInfo,SetFindInfo]= useState<findUserInfo>({
        userName:'',
        hpNo:'',
        userId:''
    });
    const [isModalOpen,setIsModalOpen] = useState(false);
    const {alert} = useMessage();
    const formRef = useRef<HTMLButtonElement>(null);

    const handleFindId = async (value:findUserInfo)=>
    {

        try{
            getUserId(value).then((res)=>
            {
                if(res.code===HttpStatusCode.Ok && res.item)
                {
                    SetFindInfo({
                        userId:res.item.userId,
                        userName: '',
                        hpNo:''
                    });
                    setIsModalOpen(true);
                }else
                {
                    message.warning("해당 정보로 등록된 아이디가 없습니다.");
                    handleReset();
                }
            });
        }catch (err){
            message.error("관리자에게 문의바랍니다");
            console.error(err);
        }
    };

    const handleReset=()=>{
        SetFindInfo({userId:'',userName:'',hpNo:""});
        findIdReset();
    };

    return (

        <div>
            <form onSubmit={findIdHandleSubmit(handleFindId)}>
                <span className="tit">{'이름'}</span>
                <div>
                    <div className="box-inp">
                        <CustomValidFormInput
                            title={'이름'}
                            control={findIdControl}
                            required={true}
                            onChangeValue={(v) => SetFindInfo({...findInfo, userName: v})}
                            {...findIdRegister('userName', {required: '이름을 입력하세요.'})}
                        />
                    </div>
                </div>

                <span className="tit">{'휴대폰번호'}</span>
                <div>
                    <div className="box-inp">
                        <CustomValidFormInput
                            title={'휴대폰번호'}
                            control={findIdControl}
                            required={true}
                            onChangeValue={(v) => SetFindInfo({...findInfo, hpNo: v})}
                            {...findIdRegister('hpNo', {required: '휴대폰번호를 입력하세요.'})}

                        />
                    </div>
                </div>
                <Button type="primary" className="mt10" onClick={findIdHandleSubmit(handleFindId)}>아이디 찾기</Button>
                <Button type="primary" onClick={props.onClose} className="mt10">닫기</Button>
            </form>
            {findInfo.userId &&(
                <CustomModal {...props}
                             onOk={()=> {formRef.current?.click();}}
                             onCancel={()=>{handleReset();
                                 props.onCancel && props.onCancel();}}
                             open={isModalOpen}
                             footer={null}
                >
                    <p className="font-size-20">
                        회원님의 아이디는 <strong>{findInfo.userId}</strong> 입니다.
                    </p>
                    <Button type="primary" onClick={props.onClose} className="mt10">닫기</Button>
                </CustomModal >

            )}
        </div>
    );
};
export default FindIdPopup;