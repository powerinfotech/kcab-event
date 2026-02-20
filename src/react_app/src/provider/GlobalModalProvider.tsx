import {useRecoilValue} from 'recoil';
import {modalAtom} from '@atom/modalAtom';

const GlobalModalProvider = () => {

    const modal = useRecoilValue(modalAtom);
    const provide = () => {
        if(!modal) return null;
        return modal;
    };

    return <> {provide()} </>;
};

export default GlobalModalProvider;