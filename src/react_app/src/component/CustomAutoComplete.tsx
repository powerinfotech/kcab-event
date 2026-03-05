import React, {useEffect, useState} from 'react';
import {AutoComplete, AutoCompleteProps, Input} from 'antd';

interface CustomAutocompleteProps extends AutoCompleteProps{
    showName?:boolean;
    size?:'small' | 'middle' | 'large' ;
    label?:string;
}
const CustomAutoComplete =  (props:CustomAutocompleteProps) => {
        const [labelText, setLabelText] = useState<string>(props.label??'');


    useEffect(() => {
        setLabelText(props.label??'');
    }, [props.label]);

    return (
        <>
             <AutoComplete
                    {...props}
                    size={props.size}
                    onSelect={(value, option) => {props.onSelect&&props.onSelect(value, option);}}
                    className={props.showName ? `${props.className || ''} autocomplete-mr`.trim() : props.className}
                >
                    {props.children}

                </AutoComplete>
            {props.showName&&<Input value={labelText} disabled={true} className="w200"/>}
        </>
    );
};

export default CustomAutoComplete;