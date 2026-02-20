import {useRecoilState} from 'recoil';
import {modalAtom} from '@atom/modalAtom';
import {ReactNode, useEffect, useState} from 'react';
import {useDimmed} from '@hook/useDimmed';

export const useCustomModal = () => {
    const [modal, setModal] = useRecoilState(modalAtom);
    const [showDimmed, setShowDimmed] = useState<boolean>(false);
    useDimmed(showDimmed);

    const openModal = (m:ReactNode) => {
        setModal(m);
    };

    const closeModal = () => {
        setModal(null);
    };

    useEffect(() => {
        setShowDimmed(modal !== null);
    }, []);

    return {openModal, closeModal, modal};
};