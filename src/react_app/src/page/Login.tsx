import React, {useEffect, useState} from 'react';
import {ApiResponse} from '@interface/common';
import CustomButton from '@component/CustomButton';
import axios, {HttpStatusCode} from 'axios';
import {getUserLoginInfo, getUserMenuInfo} from '@api/CommonApi';
import {useForm} from 'react-hook-form';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import {useCookies} from 'react-cookie';
import CustomValidFormCheckbox from '@component/form/CustomValidFormCheckbox';
import {message, Modal} from "antd";
import {MenuInfo} from "@interface/auth/MenuManagement";
import FindIdPopup from "@page/auth/FindIdPopup";
import FindPasswordPopup from "@page/auth/FindPasswordPopup";
import { useRouter } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { menuInfoAtom } from '@atom/menuInfoAtom';

const Login = () => {
    const router = useRouter();
    const setSessionInfo = useSetRecoilState(sessionInfoAtom);
    const setMenuInfoRecoil = useSetRecoilState(menuInfoAtom);
    const {register: saveFormRegister
        , control: saveFormControl
        , handleSubmit: saveFormHandleSubmit
        , setValue: saveFormSetValue
        , getValues:saveFormGetValues} = useForm<{ userId: string, password: string, isRememberId:boolean,mode:string|null }>({mode:'onChange'});
    const [cookies, setCookie, removeCookie] = useCookies(['id'], {doNotParse: true});

    const handleLogin = async() => {
        const param =   {userId:saveFormGetValues('userId'), password:saveFormGetValues('password')};
        const {data} = await axios.post<ApiResponse<boolean>>('/api/login',param);
        if(data.code === HttpStatusCode.Ok) {
            const ret = await getUserLoginInfo();
            if(ret.code === HttpStatusCode.Ok) {
                saveFormGetValues('isRememberId')?setCookie('id', saveFormGetValues('userId')): removeCookie('id');
                if (ret.item) {
                    setSessionInfo({
                        userId: ret.item.userId,
                        userName: ret.item.userName,
                        admYn: ret.item.admYn ?? 'N',
                    });
                }

                getUserMenuInfo().then((res)=> {
                    if(res.code === HttpStatusCode.Ok && res.item) {
                        setMenuInfoRecoil(res.item);
                        defaultMenu(res.item);
                    }
                });
            }
        }

        return data;
    };

    const defaultMenu = (menuList: MenuInfo[]) => {
        const level2Menu = menuList.filter((item) => item.level === 2);

        if (level2Menu.length > 0) {
            const minumSeqMenu = level2Menu.reduce((minMenu, currentMenu) => {
                return currentMenu.menuSeq < minMenu.menuSeq ? currentMenu : minMenu;
            });

            const path = minumSeqMenu.menuUrl?.startsWith('/') ? minumSeqMenu.menuUrl : `/${minumSeqMenu.menuUrl}`;
            if (path && path !== '/') {
                router.replace(path);
            }
        }
    };

    const AutoLogin = async() => {
        const param =   {userId:saveFormGetValues('userId'), password:saveFormGetValues('password'), mode:"auto"};
        const {data} = await axios.post<ApiResponse<boolean>>('/api/login',param);
        if(data.code === HttpStatusCode.Ok) {
            const ret = await getUserLoginInfo();
            if(ret.code === HttpStatusCode.Ok) {
                saveFormGetValues('isRememberId')?setCookie('id', saveFormGetValues('userId')): removeCookie('id');
                if (ret.item) {
                    setSessionInfo({
                        userId: ret.item.userId,
                        userName: ret.item.userName,
                        admYn: ret.item.admYn ?? 'N',
                    });
                }

                getUserMenuInfo().then((res)=> {
                    if(res.code === HttpStatusCode.Ok && res.item) {
                        setMenuInfoRecoil(res.item);
                        defaultMenu(res.item);
                    }
                });
            }
        }

        return data;
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            saveFormHandleSubmit(handleLogin)();
        }
    };
    const ManageAlert = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault(); // 기본 동작 방지 (링크 이동 방지)
        message.warning('관리자에게 문의하세요.');
    };

    useEffect(() => {
        let sso = location.pathname;
        sso = sso.replaceAll('/','');
        const result = sso.split("987654321");
        if(cookies.id) {
            saveFormSetValue('userId',  cookies.id);
            saveFormSetValue('isRememberId', true);
        }
        if(result.length === 2)
        {
            saveFormSetValue('userId',result[0]);
            saveFormSetValue('password',result[1]);
            AutoLogin();
        }
    }, []);

    const [showFindIdModal,setShowFindIdModal] = useState(false);
    const [showFindPasswordModal,setShowFindPasswordModal] = useState(false);
    return (
        <>
            <div className='login-dim'></div>
            <div className='login-wrap'>
                <h2 className='logo'>국가지점번호 센서관리 시스템</h2>

                <form className={'ant-form'} onSubmit={saveFormHandleSubmit(handleLogin)}>
                    <div className={'ant-form-item ant-form-item-control-input'}>
                        <CustomValidFormInput
                            placeholder="아이디"
                            control={saveFormControl}
                            onChangeValue={(v) => {
                            }}
                            {...saveFormRegister('userId', {required: '아이디를 입력해주세요.'})}
                        />
                        <CustomValidFormInput
                            type={'password'}
                            placeholder="비밀번호"
                            required={true}
                            control={saveFormControl}
                            onChangeValue={(v) => {
                            }}
                            {...saveFormRegister('password', {required: '비밀번호를 입력해주세요.'})}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <CustomButton className='btn' type="primary"
                                  onClick={saveFormHandleSubmit(handleLogin)}>로그인</CustomButton>

                    <div className='box'>
                        <CustomValidFormCheckbox
                            name={'isRememberId'}
                            control={saveFormControl}
                            onChange={(p) => {
                                saveFormSetValue('isRememberId', p.target.checked);
                            }}>아이디 저장</CustomValidFormCheckbox>

                        <div className='find'>
                            <a className='link' href="#" onClick={()=>setShowFindIdModal(true)}>아이디찾기</a>
                            <a className='link' href="#" onClick={()=>setShowFindPasswordModal(true)}>비밀번호찾기</a>
                        </div>
                    </div>


                    <div className='copy-right'>
                        Copyright © 국가지점번호 센서관리 시스템. All Rights Reserved.
                    </div>
                </form>
                <Modal open={showFindIdModal} onCancel={()=> setShowFindIdModal(false)} footer={null} title={"아이디찾기"} destroyOnHidden>
                    <FindIdPopup onClose={() => setShowFindIdModal(false)} />
                </Modal>
                <Modal open={showFindPasswordModal} onCancel={()=> setShowFindPasswordModal(false)} footer={null} title={"비밀번호찾기"} destroyOnHidden>
                    <FindPasswordPopup onClose={()=> setShowFindPasswordModal(false)}/>
                </Modal>
            </div>
        </>
    );

};

export default Login;
