/**
 * useDimmed - 모달/팝업 오버레이 시 배경 스크롤 잠금 훅
 *
 * [목적]
 * 모달, 드로어, 팝업 등 오버레이가 열렸을 때
 * document.body의 스크롤을 숨겨서 배경이 스크롤되지 않도록 한다.
 * 닫히면 스크롤을 다시 허용한다.
 *
 * [동작 방식]
 * - popLength 미지정: isShow 값에 따라 스크롤 잠금/해제
 * - popLength 지정: 열린 팝업 개수(popLength)로 판단 (0이면 해제, 1 이상이면 잠금)
 *
 * [사용 방법]
 * @example
 * // 단일 모달 - isShow로 제어
 * const [isOpen, setIsOpen] = useState(false);
 * useDimmed(isOpen);
 *
 * // 다중 팝업 - 열린 팝업 개수로 제어
 * const [popList, setPopList] = useState([]);
 * useDimmed(popList.length > 0, popList.length);
 */
import {useEffect} from 'react';

/**
 * 배경 스크롤 잠금/해제 훅
 *
 * @param isShow     - 오버레이 표시 여부 (true: 스크롤 잠금, false: 해제)
 * @param popLength  - (선택) 열린 팝업 개수. 지정 시 isShow 대신 이 값으로 판단
 *                     0이면 스크롤 해제, 1 이상이면 스크롤 잠금
 */
export const useDimmed = (isShow: boolean, popLength?: number) => {

    useEffect(() => {
        if(popLength===undefined) {
            // popLength 미지정: isShow 값으로 직접 제어
            document.body.style.overflowY =  isShow?'hidden':'auto';
        }

        if(popLength === 0) {
            // 열린 팝업이 없으면 스크롤 복원
            document.body.style.overflowY = 'auto';
        }else {
            // 열린 팝업이 있으면 스크롤 잠금
            document.body.style.overflowY = 'hidden';
        }
    }, [isShow]);
};