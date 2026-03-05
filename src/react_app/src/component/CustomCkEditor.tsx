
import React, {Component, useEffect, useRef} from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {isEditable} from "@testing-library/user-event/dist/utils";

interface Props {
    value:string,
    isEditable:boolean,
    onChange:(value:string) => void;

}

const CustomCkEditor = ({value,onChange,isEditable}: Props)=>{
    const editorRef = useRef<any>(null); // editor instance 저장



    useEffect(() => {
        if (editorRef.current) {
            if (isEditable) {
                editorRef.current.disableReadOnlyMode('custom-id');
            } else {
                editorRef.current.enableReadOnlyMode('custom-id');
            }
        }
    }, [isEditable]);

        return (
            <div className="ckeditor-wrap">
                <style>
                    {`
                        .ck-editor__editable_inline {
                        height: 200px !important;
                      }
                    
                      .ck-editor__editable[contenteditable="false"] {
                        background-color: #0000000A !important;
                        color: rgba(0, 0, 0, 0.25) !important;
                        cursor: not-allowed;
                      }
                    `}
                </style>
                <CKEditor
                    editor={ ClassicEditor }
                    data={value}
                    config={{
                        toolbar:[]
                    }}
                    onReady={(editor) => {
                        editorRef.current = editor;
                        editor.enableReadOnlyMode('custom-id');
                    }}
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        onChange(data);
                    } }
                />
            </div>
        );
    };

export default CustomCkEditor;