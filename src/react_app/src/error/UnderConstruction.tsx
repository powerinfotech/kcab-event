import {useEffect} from 'react';
import IconRepair from '@icon/IconRepair';
import CustomButton from '@component/CustomButton';

const UnderConstruction = ({onChange}:{onChange:(flag:boolean) => void}) => {

    useEffect(() => {
        onChange(true);
        return () => {
            onChange(false);
        };
    });

    return (
        <div className="error-box">
            <div className="tit blue">공사중(Under Construction)</div>
            <div className="inner">
                <div className="icon">
                    <IconRepair />
                </div>
                <div className="txt">
                    더 나은 서비스를 제공해 드리기 위해<br />
                    최선을 다하겠습니다.
                </div>
                <CustomButton className="btn" type="primary">이전페이지로 이동</CustomButton>
            </div>
            <div className="copy-right">Copyright ©Lxnn. All Rights Reserved.</div>
        </div>
    );
};

export  default UnderConstruction;