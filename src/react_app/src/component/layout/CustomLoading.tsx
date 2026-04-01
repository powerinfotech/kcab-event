/**
 * CustomLoading - 전역 로딩 오버레이 컴포넌트
 *
 * [목적]
 * Recoil loadingAtom을 구독하여 API 호출 중 전체 화면 로딩 오버레이를 표시한다.
 * 로딩 중에는 body와 header에 scroll-lock 클래스를 추가하여 스크롤을 차단한다.
 *
 * [동작 방식]
 * 1. loadingAtom은 string[] (로딩 키 큐) → 하나 이상의 키가 있으면 로딩 표시
 * 2. useLoading() 훅의 startLoading/stopLoading을 통해 큐 관리
 * 3. 로딩이 사라지면 loading_wrap에 'hide' 클래스 추가 → CSS로 숨김 처리
 *
 * [사용 방법]
 * 앱 최상단 레이아웃에 한 번만 배치한다.
 *
 * @example
 * // app layout (최상단에 1회 배치)
 * const Layout = () => (
 *   <RecoilRoot>
 *     <CustomLoading />
 *     <Header />
 *     <main>{children}</main>
 *   </RecoilRoot>
 * );
 *
 * // API 호출 시 useLoading 훅으로 제어
 * const { startLoading, stopLoading } = useLoading();
 * startLoading('fetchUser');
 * await callGetUser();
 * stopLoading('fetchUser');
 */
import {Spin} from 'antd';
import {useRecoilValue} from 'recoil';
import {loadingAtom} from '@atom/loadingAtom';
import {Loading3QuartersOutlined} from '@ant-design/icons';
import {useEffect} from 'react';

const CustomLoading = () => {
    const isLoading = useRecoilValue(loadingAtom);
    const antIcon = <Loading3QuartersOutlined className="loading-icon" spin />;

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
        <div className={`loading_wrap${isLoading.length > 0 ? '' : ' hide'}`}>
            <div className={'loading_dim'}>
                <Spin indicator={antIcon} delay={1.5} />
            </div>
        </div>
    );

};

export default CustomLoading;