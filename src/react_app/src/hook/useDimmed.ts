import {useEffect} from 'react';

export const useDimmed = (isShow: boolean, popLength?: number) => {


    useEffect(() => {
        if(popLength===undefined) {
            document.body.style.overflowY =  isShow?'hidden':'auto';
        }

        if(popLength === 0) {
            document.body.style.overflowY = 'auto';
        }else {
            document.body.style.overflowY = 'hidden';

        }
    }, [isShow]);
};