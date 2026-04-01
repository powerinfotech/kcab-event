/**
 * CustomCkEditor - CKEditor 5 Classic 래퍼 컴포넌트
 *
 * [목적]
 * @ckeditor/ckeditor5-react와 @ckeditor/ckeditor5-build-classic을 래핑하여
 * 읽기 전용 / 편집 가능 전환 기능을 제공하는 리치 텍스트 에디터다.
 * 게시판 내용 작성, 공지사항 등 HTML 편집에 사용한다.
 *
 * @param value      - 에디터 HTML 내용 (controlled)
 * @param isEditable - true이면 편집 가능, false이면 읽기 전용 (배경색 회색)
 * @param onChange   - 내용 변경 시 HTML 문자열 전달 콜백
 *
 * [특징]
 * - toolbar=[] 고정 (툴바 없음 — 필요 시 config 수정)
 * - isEditable 변경 시 enableReadOnlyMode/disableReadOnlyMode 토글
 * - 에디터 영역 높이 200px 고정 (CSS 인라인)
 *
 * [사용 방법]
 * @example
 * import CustomCkEditor from '@component/special/CustomCkEditor';
 *
 * const [content, setContent] = useState('<p>초기 내용</p>');
 * const [isEdit, setIsEdit] = useState(false);
 *
 * // 읽기 전용
 * <CustomCkEditor value={content} isEditable={false} onChange={setContent} />
 *
 * // 편집 모드 전환
 * <CustomButton onClick={() => setIsEdit(true)}>수정</CustomButton>
 * <CustomCkEditor value={content} isEditable={isEdit} onChange={setContent} />
 */

import React, {useEffect, useRef} from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
                        if (!isEditable) {
                            editor.enableReadOnlyMode('custom-id');
                        }
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