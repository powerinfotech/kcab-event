import {useEffect} from 'react';
import IconWarning from '@icon/IconWarning';
import CustomButton from '@component/CustomButton';

const ErrorPage404 = ({onChange}:{onChange:(flag:boolean) => void}) => {

    useEffect(() => {
        onChange(true);
        return () => {
            onChange(false);
        };
    });

    return (
        <div className="error-box">
            <div className="tit red">404-Not Found</div>
            <div className="inner">
                <div className="icon">
                    <IconWarning />
                </div>
                <div className="txt">
                    죄송합니다. 해당 페이지를 찾을 수 없습니다.
                </div>
                <CustomButton className="btn" type="primary">이전페이지로 이동</CustomButton>
            </div>
            <div className="copy-right">Copyright ©Lxnn. All Rights Reserved.</div>
        </div>
    );
};

export  default ErrorPage404;