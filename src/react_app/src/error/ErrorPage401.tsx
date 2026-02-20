import {useEffect} from 'react';
import IconWarning from '@icon/IconWarning';
import CustomButton from '@component/CustomButton';

const ErrorPage401 = ({onChange}:{onChange:(flag:boolean) => void}) => {

    useEffect(() => {
        onChange(true);
        return () => {
            onChange(false);
        };
    });

    return (
        <div className="error-box">
            <div className="tit">401-Unauthorization</div>
            <div className="inner">
                <div className="icon">
                    <IconWarning />
                </div>
                <div className="txt">
                    한글로 멘트 를 적어주세요. ^^!
                </div>
                <CustomButton className="btn" type="primary">이전페이지로 이동</CustomButton>
            </div>
            <div className="copy-right">Copyright ©Lxnn. All Rights Reserved.</div>
        </div>
    );
};

export  default ErrorPage401;