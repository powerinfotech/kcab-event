import React, {useEffect, useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import type {DragEndEvent} from '@dnd-kit/core';
import {DndContext, PointerSensor, useSensor} from '@dnd-kit/core';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {message, UploadFile, UploadProps} from 'antd';
import {Button, Upload} from 'antd';
import {IudType} from "@interface/common";
import {cloneDeep} from "lodash";
import {RcFile} from "antd/es/upload/interface";
import axios from 'axios';
import {isEditable} from "@testing-library/user-event/dist/utils";

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
    fileType?: string;
    delYn?: string;
    srtSq: number;
    originFileObj?: RcFile;
    iudType?: IudType;
}

export interface CustomFile extends UploadFile{
    fileSeq?: number;
    fileDtlSeq?: number;
    srtSq: number;
    iudType?: IudType;
}

interface CustomFilePropsType {
    fileList: FileDetailType[]
    onFileListChange: (newList: FileDetailType[]) => void;
    isEditable:boolean;
}

const CustomFile = (props:CustomFilePropsType) => {
    const fileDtoToAntdFile = (fileDto: FileDetailType): CustomFile => ({
        uid: fileDto.fileDtlSeq ? String(fileDto.fileDtlSeq) : fileDto.uid as string,
        fileSeq: fileDto.fileSeq,
        fileDtlSeq: fileDto.fileDtlSeq,
        fileName: fileDto.fileNm,
        name: fileDto.fileNm,
        url: fileDto.filePath,
        status: 'done',
        srtSq: fileDto.srtSq,
        iudType: fileDto.iudType,
        originFileObj: fileDto.originFileObj,
    });

    const AntdFileToFileDto = (antdFileData: CustomFile): FileDetailType => ({
        uid: antdFileData.uid,
        fileSeq: antdFileData.fileSeq,
        fileDtlSeq: antdFileData.fileDtlSeq,
        fileNm: antdFileData.name,
        filePath: antdFileData.url,
        srtSq: antdFileData.srtSq,
        iudType: antdFileData.iudType,
        originFileObj: antdFileData.originFileObj
    });

    const [fileList, setFileList] = useState<CustomFile[]>(props.fileList ? props.fileList.map(fileDtoToAntdFile) : []);

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
                    let srtSq = 0;

                    if (item.iudType !== IudType.D) {
                        srtSq = currentSrtSq++;
                    }

                    return {
                        ...item,
                        srtSq: srtSq,
                        iudType: item.iudType !== IudType.I && item.iudType !== IudType.D ? IudType.U : item.iudType
                    };
                });

                return reindexed;
            });
        }
    };

    const MAX_FILE_COUNT = 5;

    const onChange: UploadProps['onChange'] = ({file:newFile}) => {
        const targetFileIdx = fileList.findIndex(f => f.uid === newFile.uid);


        const currentFiles = fileList.filter((f) => f.iudType !== IudType.D);

        const isNew = !fileList.find(f => f.uid === newFile.uid);

        if (currentFiles.length >= MAX_FILE_COUNT && isNew) {
            message.warning(`최대 ${MAX_FILE_COUNT}개의 파일만 첨부할 수 있습니다.`);
            return;
        }

        let newFileList: CustomFile[];

        if(targetFileIdx > -1){
            let currentSrtSq = 1;

            newFileList = fileList.map((fileData) => {
                if(fileData.uid !== newFile.uid) return fileData;

                const isRemoved = newFile.status === 'removed';

                if (isRemoved && fileData.iudType === IudType.I) {
                    return null;
                } else {
                    return {
                        ...fileData,
                        status: newFile.status,
                        ...(isRemoved ? { iudType: IudType.D } : {}),
                    };
                }
            })
            .filter((fileData): fileData is CustomFile => fileData !== null)
            .map((fileData) => {
                let srtSq = 0;

                if (fileData.iudType !== IudType.D) {
                    srtSq = currentSrtSq++;
                }

                return { ...fileData, srtSq: srtSq};
            });
        } else {
            const maxSize =  10 * 1024 * 1024;
            if ((newFile as RcFile).size > maxSize) {
                message.error('10MB 이하 파일만 업로드 가능합니다.');
                return;
            }
            const newFileListItem = {
                uid: newFile.uid,
                fileName: newFile.name,
                name: newFile.name,
                url: URL.createObjectURL(newFile as any),
                status: newFile.status,
                srtSq: fileList.filter((fileData) => fileData.iudType !== IudType.D).length + 1,
                originFileObj : newFile as RcFile,
                iudType: IudType.I,
            };

            const newFileListBase: CustomFile[] = cloneDeep(fileList);
            newFileList = [...newFileListBase, newFileListItem];
        }

        setFileList(newFileList);
    };

    useEffect(() => {
        props.onFileListChange(fileList.map(AntdFileToFileDto));
    },[fileList]);

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
        if (file.url) {
            const res = await axios.get('/api/download-file', {
                params: { filePath : file.url },
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
                                            .sort((a, b) => a.srtSq - b.srtSq)
                                            .map((f) => f.uid)
                                    }
                             strategy={verticalListSortingStrategy}>
                <Upload
                    beforeUpload={() => false}
                    fileList={fileList.filter(file => file.iudType !== IudType.D)}
                    onChange={onChange}
                    onPreview={handlePreview}
                    disabled={!props.isEditable}
                    itemRender={(originNode, file) => {
                        return <CustomFileItem originNode={originNode} file={file} />;
                    }}
                >
                    <Button disabled={!props.isEditable} style={{backgroundColor:'white'}} icon={<UploadOutlined />}>파일첨부</Button>
                </Upload>
            </SortableContext>
        </DndContext>
    );
};

export default CustomFile;