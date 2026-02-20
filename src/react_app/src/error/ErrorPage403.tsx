import {useEffect} from 'react';
import IconWarning from '@icon/IconWarning';
import CustomButton from '@component/CustomButton';

const ErrorPage403 = ({onChange}:{onChange:(flag:boolean) => void}) => {

    useEffect(() => {
        onChange(true);
        return () => {
            onChange(false);
        };
    });

    return (
        <div className="error-box">
            <div className="tit">403-Forbidden</div>
            <div className="inner">
                <div className="icon">
                    <IconWarning />
                </div>
                <div className="txt">
                    엑세스가 거부되어 습니다.<br />
                    입력하신 페이지의 주소가 정확한지 다시 한번<br />
                    확인해주시기 바랍니다.
                </div>
                <CustomButton className="btn" type="primary">이전페이지로 이동</CustomButton>
            </div>
            <div className="copy-right">Copyright ©Lxnn. All Rights Reserved.</div>
        </div>
    );
};

export  default ErrorPage403;