import {Spin} from 'antd';
import {useRecoilValue} from 'recoil';
import {loadingAtom} from '@atom/loadingAtom';
import {Loading3QuartersOutlined} from '@ant-design/icons';
import {useEffect} from 'react';

const CustomLoading = () => {
    const isLoading = useRecoilValue(loadingAtom);
    const antIcon = <Loading3QuartersOutlined style={{fontSize: 24, color: '#fff'}} spin />;

    useEffect(() =>  {
        const body = document.querySelector('body');
        const header = document.querySelector('.header_wrap');

        if(isLoading && isLoading.length > 0) {
            body?.classList.add('scroll-lock');
            header?.classList.add('scroll-lock');
        }
        else {
            body?.classList.remove('scroll-lock');
            header?.classList.remove('scroll-lock');
        }
    }, [isLoading]);


    return (
      <>
          <div className={'loading_wrap'} style={{display: isLoading.length > 0? '' : 'none'}}>
              <div className={'loading_dim'}>
                  <Spin indicator={antIcon} delay={1.5} />
              </div>
          </div>
      </>
    );

};

export default CustomLoading;