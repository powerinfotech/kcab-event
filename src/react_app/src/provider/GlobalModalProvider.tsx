/**
 * GlobalModalProvider - 전역 모달 렌더링 프로바이더
 *
 * [목적]
 * modalAtom에 저장된 ReactNode를 화면에 렌더링한다.
 * useCustomModal 훅의 openModal/closeModal로 모달을 열고 닫는다.
 *
 * [동작 방식]
 * - modalAtom 값이 null이면 아무것도 렌더링하지 않는다.
 * - modalAtom에 ReactNode가 설정되면 해당 노드를 그대로 출력한다.
 * - 앱 루트에 한 번 배치하면 어디서든 openModal()로 모달을 띄울 수 있다.
 *
 * [사용 방법]
 * @example
 * // _app.tsx 또는 루트 레이아웃에 배치
 * import GlobalModalProvider from '@provider/GlobalModalProvider';
 *
 * const App = () => (
 *   <RecoilRoot>
 *     <GlobalModalProvider />
 *     <RouterProvider router={router} />
 *   </RecoilRoot>
 * );
 *
 * // 컴포넌트에서 모달 열기
 * import { useCustomModal } from '@hook/useCustomModal';
 *
 * const { openModal, closeModal } = useCustomModal();
 * openModal(<MyModal onClose={closeModal} />);
 */
import { useAtomValue } from 'jotai';
import {modalAtom} from '@atom/modalAtom';

const GlobalModalProvider = () => {
    const modal = useAtomValue(modalAtom);
    return modal ?? null;
};

export default GlobalModalProvider;
