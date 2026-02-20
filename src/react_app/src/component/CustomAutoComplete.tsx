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
                    style={props.showName?{...props.style, marginRight:'2px'}:{...props.style}}
                >
                    {props.children}

                </AutoComplete>
            {props.showName&&<Input value={labelText} disabled={true} style={{width:'200px'}}/>}
        </>
    );
};

export default CustomAutoComplete;