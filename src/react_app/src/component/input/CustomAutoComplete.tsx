import React, {useEffect, useState} from 'react';
import {AutoComplete, AutoCompleteProps, Input} from 'antd';

interface CustomAutocompleteProps extends AutoCompleteProps{
    showName?:boolean;
    size?:'small' | 'middle' | 'large' ;
    label?:string;
}
const CustomAutoComplete =  ({showName, label, children, ...restProps}:CustomAutocompleteProps) => {
        const [labelText, setLabelText] = useState<string>(label??'');


    useEffect(() => {
        setLabelText(label??'');
    }, [label]);

    return (
        <>
             <AutoComplete
                    {...restProps}
                    className={showName ? `${restProps.className || ''} autocomplete-mr`.trim() : restProps.className}
                >
                    {children}

                </AutoComplete>
            {showName&&<Input value={labelText} disabled={true} className="w200"/>}
        </>
    );
};

export default CustomAutoComplete;