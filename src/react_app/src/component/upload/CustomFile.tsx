import { message } from '@util/antdMessage';
/**
 * CustomFile - 드래그 순서 변경 + IUD 상태 추적 파일 첨부 컴포넌트
 *
 * [목적]
 * 파일 첨부, 삭제, 순서 변경(드래그 앤 드롭), 기존 파일 유지를 하나의 컴포넌트에서 처리한다.
 * IUD 패턴(Insert/Update/Delete)으로 변경사항을 추적하여 저장 시 서버에 전달한다.
 *
 * [주요 기능]
 * - 최대 5개 파일 첨부 (MAX_FILE_COUNT=5)
 * - 최대 파일 크기 30MB 제한
 * - @dnd-kit 기반 드래그 앤 드롭 순서 변경
 * - 순서 변경 시 iudType=U, 새 파일=I, 삭제=D 자동 설정
 * - 기존 파일 클릭 다운로드 (서버 파일: axios GET /api/download-file, 신규 파일: Blob URL)
 *
 * [주요 Props]
 * @param fileList          - 초기 파일 목록 (FileDetailType[])
 * @param onFileListChange  - 파일 목록 변경 시 FileDetailType[] 전달 콜백
 * @param isEditable        - true이면 파일 첨부/삭제/순서변경 가능
 *
 * [exports]
 * - default: CustomFile
 * - named:   FileDetailType   (파일 DTO 인터페이스)
 * - named:   CustomFileUpload (Ant Design UploadFile 확장 인터페이스 — 컴포넌트 내부 상태 타입)
 *
 * [사용 방법]
 * @example
 * import CustomFile, { FileDetailType } from '@component/upload/CustomFile';
 *
 * const [fileList, setFileList] = useState<FileDetailType[]>(initialFiles);
 *
 * <CustomFile
 *   fileList={fileList}
 *   onFileListChange={(newList) => setFileList(newList)}
 *   isEditable={isEditMode}
 * />
 *
 * // 저장 시 IUD 상태로 분류
 * const newFiles    = fileList.filter(f => f.iudType === 'I');
 * const updatedFiles = fileList.filter(f => f.iudType === 'U');
 * const deletedFiles = fileList.filter(f => f.iudType === 'D');
 */
import React, {useEffect, useRef, useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import type {DragEndEvent} from '@dnd-kit/core';
import {DndContext, PointerSensor, useSensor} from '@dnd-kit/core';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {UploadFile, UploadProps} from 'antd';
import {Button, Upload} from 'antd';
import {IudType} from "@interface/common";
import {cloneDeep} from "lodash";
import {RcFile} from "antd/es/upload/interface";
import axios from 'axios';

interface CustomFileItemPropsType {
    originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    file: UploadFile<any>;
}

const CustomFileItem = ({ originNode, file }: CustomFileItemPropsType) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: file.uid});

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'move',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            // prevent preview event when drag end
            className={isDragging ? 'is-upload-dragging' : ''}
            {...attributes}
            {...listeners}
        >
            {/* hide error tooltip when dragging */}
            {file.status === 'error' && isDragging ? originNode.props.children : originNode}
        </div>
    );
};

export interface FileDetailType {
    uid?: string;
    fileDtlSeq?: number;
    fileSeq?: number;
    fileNm: string;
    filePath?: string;
    fileUrl?: string;
    fileType?: string;
    delYn?: string;
    sortSeq: number;
    originFileObj?: RcFile;
    iudType?: IudType;
}

export interface CustomFileUpload extends UploadFile{
    fileSeq?: number;
    fileDtlSeq?: number;
    filePath?: string;
    fileUrl?: string;
    sortSeq: number;
    iudType?: IudType;
}

interface CustomFilePropsType {
    fileList: FileDetailType[]
    onFileListChange: (newList: FileDetailType[]) => void;
    isEditable:boolean;
    /** 최대 첨부 가능 파일 수 (기본 5) */
    maxCount?: number;
    /**
     * 허용 파일 타입 (HTML input accept 형식).
     * 예) 'image/*', '.pdf,.docx', 'application/pdf'
     */
    accept?: string;
    /** OS 파일 선택창에서 여러 파일 선택 허용 */
    multiple?: boolean;
}

/** 파일이 accept 패턴에 부합하는지 검사. accept가 비어있으면 true. */
function isFileAccepted(file: RcFile, accept?: string): boolean {
    if (!accept) return true;
    const tokens = accept.split(',').map((t) => t.trim().toLowerCase());
    const fileName = (file.name ?? '').toLowerCase();
    const fileType = (file.type ?? '').toLowerCase();
    return tokens.some((token) => {
        if (!token) return false;
        if (token.endsWith('/*')) {
            return fileType.startsWith(token.slice(0, -1));
        }
        if (token.startsWith('.')) {
            return fileName.endsWith(token);
        }
        return fileType === token;
    });
}

const CustomFile = (props:CustomFilePropsType) => {
    const fileDtoToAntdFile = (fileDto: FileDetailType): CustomFileUpload => ({
        uid: fileDto.fileDtlSeq ? String(fileDto.fileDtlSeq) : fileDto.uid as string,
        fileSeq: fileDto.fileSeq,
        fileDtlSeq: fileDto.fileDtlSeq,
        fileName: fileDto.fileNm,
        name: fileDto.fileNm,
        url: fileDto.fileUrl ?? fileDto.filePath,
        filePath: fileDto.filePath,
        fileUrl: fileDto.fileUrl,
        status: 'done',
        sortSeq: fileDto.sortSeq,
        iudType: fileDto.iudType,
        originFileObj: fileDto.originFileObj,
    });

    const AntdFileToFileDto = (antdFileData: CustomFileUpload): FileDetailType => ({
        uid: antdFileData.uid,
        fileSeq: antdFileData.fileSeq,
        fileDtlSeq: antdFileData.fileDtlSeq,
        fileNm: antdFileData.name,
        filePath: antdFileData.filePath ?? antdFileData.url,
        fileUrl: antdFileData.fileUrl,
        sortSeq: antdFileData.sortSeq,
        iudType: antdFileData.iudType,
        originFileObj: antdFileData.originFileObj
    });

    const [fileList, setFileList] = useState<CustomFileUpload[]>(props.fileList ? props.fileList.map(fileDtoToAntdFile) : []);
    const isInternalUpdate = useRef(false);

    const sensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    });

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setFileList((prev) => {
                const oldIndex = prev.findIndex((f) => f.uid === active.id);
                const newIndex = prev.findIndex((f) => f.uid === over?.id);
                const newList = arrayMove([...prev], oldIndex, newIndex);

                let currentSrtSq = 1;

                const reindexed = newList.map((item, index) => {
                    let sortSeq = 0;

                    if (item.iudType !== IudType.D) {
                        sortSeq = currentSrtSq++;
                    }

                    return {
                        ...item,
                        sortSeq: sortSeq,
                        iudType: item.iudType !== IudType.I && item.iudType !== IudType.D ? IudType.U : item.iudType
                    };
                });

                return reindexed;
            });
        }
    };

    const MAX_FILE_COUNT = props.maxCount ?? 5;

    const reindexFileList = (list: CustomFileUpload[]) => {
        let currentSrtSq = 1;
        return list.map((fileData) => {
            const sortSeq = fileData.iudType !== IudType.D ? currentSrtSq++ : 0;
            return { ...fileData, sortSeq };
        });
    };

    const createUploadItem = (uploadFile: UploadFile): CustomFileUpload | null => {
        const rcFile = (uploadFile.originFileObj ?? uploadFile) as RcFile;
        if (!isFileAccepted(rcFile, props.accept)) {
            message.error('This file type is not allowed.');
            return null;
        }
        const maxSize = 30 * 1024 * 1024;
        if (rcFile.size > maxSize) {
            message.error('Only files up to 30MB can be uploaded.');
            return null;
        }
        return {
            uid: uploadFile.uid,
            fileName: uploadFile.name,
            name: uploadFile.name,
            url: URL.createObjectURL(rcFile),
            status: uploadFile.status,
            sortSeq: 0,
            originFileObj: rcFile,
            iudType: IudType.I,
        };
    };

    const onChange: UploadProps['onChange'] = ({ file: newFile, fileList: uploadFileList }) => {
        setFileList((prevFileList) => {
            const targetFileIdx = prevFileList.findIndex((f) => f.uid === newFile.uid);

            if (targetFileIdx > -1) {
                const nextList = prevFileList.map((fileData) => {
                    if (fileData.uid !== newFile.uid) return fileData;

                    const isRemoved = newFile.status === 'removed';
                    if (isRemoved && fileData.iudType === IudType.I) {
                        if (fileData.url?.startsWith('blob:')) URL.revokeObjectURL(fileData.url);
                        return null;
                    }

                    return {
                        ...fileData,
                        status: newFile.status,
                        ...(isRemoved ? { iudType: IudType.D } : {}),
                    };
                })
                .filter((fileData): fileData is CustomFileUpload => fileData !== null);

                return reindexFileList(nextList);
            }

            const candidates = props.multiple
                ? uploadFileList.filter((uploadFile) => (
                    uploadFile.status !== 'removed'
                    && !prevFileList.some((fileData) => fileData.uid === uploadFile.uid)
                ))
                : [newFile];

            let nextList = cloneDeep(prevFileList);
            for (const candidate of candidates) {
                const currentFileCount = nextList.filter((fileData) => fileData.iudType !== IudType.D).length;
                if (currentFileCount >= MAX_FILE_COUNT) {
                    message.warning(`You can attach up to ${MAX_FILE_COUNT} files.`);
                    break;
                }

                const nextItem = createUploadItem(candidate);
                if (nextItem) {
                    nextList = [...nextList, nextItem];
                }
            }

            return reindexFileList(nextList);
        });
    };

    useEffect(() => {
        isInternalUpdate.current = true;
        props.onFileListChange(fileList.map(AntdFileToFileDto));
    },[fileList]);

    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }
        setFileList(props.fileList ? props.fileList.map(fileDtoToAntdFile) : []);
    }, [props.fileList]);

    const handlePreview: UploadProps['onPreview'] = async (file) => {
        // 1) 로컬에서 방금 올린 파일 (originFileObj 존재)
        if (file.originFileObj) {
            const url = URL.createObjectURL(file.originFileObj as Blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name || 'download';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // 메모리 해제
            return;
        }

        // 2) 서버에 있는 파일 (file.url 존재)
        const serverFile = file as CustomFileUpload;
        const downloadPath = serverFile.filePath ?? file.url;
        if (downloadPath) {
            const res = await axios.get('/api/download-file', {
                params: { filePath : downloadPath },
                responseType: 'blob',
            });

            const blobUrl = URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            a.remove();

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        }
    };

    return (
        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
            <SortableContext items={fileList.slice()
                                            .sort((a, b) => a.sortSeq - b.sortSeq)
                                            .map((f) => f.uid)
                                    }
                             strategy={verticalListSortingStrategy}>
                <Upload
                    beforeUpload={() => false}
                    fileList={fileList.filter(file => file.iudType !== IudType.D)}
                    onChange={onChange}
                    onPreview={handlePreview}
                    disabled={!props.isEditable}
                    accept={props.accept}
                    multiple={props.multiple}
                    itemRender={(originNode, file) => {
                        return <CustomFileItem originNode={originNode} file={file} />;
                    }}
                >
                    <Button disabled={!props.isEditable} className="btn-bg-white" icon={<UploadOutlined />}>Attach File</Button>
                </Upload>
            </SortableContext>
        </DndContext>
    );
};

export default CustomFile;
