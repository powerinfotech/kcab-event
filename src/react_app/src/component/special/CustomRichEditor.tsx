'use client';

import React, { useEffect, useRef } from 'react';
import { callUploadEditorImage } from '@api/CommonApi';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import { FileHandler } from '@tiptap/extension-file-handler';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  CheckSquareOutlined,
  CodeOutlined,
  HighlightOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  TableOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

interface Props {
  value: string;
  isEditable: boolean;
  onChange: (value: string) => void;
  showToolbar?: boolean;
  height?: number;
  placeholder?: string;
  /** 글자수 제한. 0 또는 미지정이면 제한 없음 */
  maxLength?: number;
  /** 이미지 드래그/붙여넣기 시 호출. 반환된 URL이 본문에 삽입됨. 미지정 시 base64로 임베드 */
  onImageUpload?: (file: File) => Promise<string>;
}

const lowlight = createLowlight(common);

function ToolbarButton({
  onClick,
  isActive,
  icon,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      className={`rich-editor-toolbar-btn ${isActive ? 'is-active' : ''}`}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  );
}

async function defaultUploadImage(file: File): Promise<string> {
  const res = await callUploadEditorImage(file);
  return res.url;
}

const CustomRichEditor = ({
  value,
  onChange,
  isEditable,
  showToolbar = true,
  height = 200,
  placeholder = '내용을 입력하세요',
  maxLength,
  onImageUpload,
}: Props) => {
  const uploaderRef = useRef(onImageUpload);
  useEffect(() => {
    uploaderRef.current = onImageUpload;
  }, [onImageUpload]);

  const insertImages = async (
    editor: ReturnType<typeof useEditor>,
    files: File[],
    pos?: number,
  ) => {
    if (!editor) return;
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      let src: string;
      try {
        const uploader = uploaderRef.current ?? defaultUploadImage;
        src = await uploader(file);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Image upload failed:', err);
        continue;
      }
      const chain = editor.chain().focus();
      if (pos !== undefined) {
        chain.insertContentAt(pos, { type: 'image', attrs: { src } });
      } else {
        chain.setImage({ src });
      }
      chain.run();
    }
  };

  const editor = useEditor({
    immediatelyRender: false,
    content: value ?? '',
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      Highlight.configure({ multicolor: false }),
      Subscript,
      Superscript,
      Typography,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      ...(maxLength && maxLength > 0 ? [CharacterCount.configure({ limit: maxLength })] : []),
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: (currentEditor, files, pos) => {
          insertImages(currentEditor, files, pos);
        },
        onPaste: (currentEditor, files) => {
          insertImages(currentEditor, files);
        },
      }),
    ],
    editable: isEditable,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [isEditable, editor]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const next = value ?? '';
    if (next === editor.getHTML()) return;
    editor.commands.setContent(next, {
      emitUpdate: false,
      parseOptions: { preserveWhitespace: false },
    });
  }, [value, editor]);

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        await insertImages(editor, [file]);
      }
    };
    input.click();
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('링크 URL을 입력하세요', previousUrl ?? '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const charsUsed = maxLength ? editor.storage.characterCount.characters() : 0;

  return (
    <div className={`rich-editor-wrap ${!isEditable ? 'is-readonly' : ''}`}>
      {showToolbar && isEditable && (
        <div className="rich-editor-toolbar">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={<BoldOutlined />} title="굵게 (Ctrl+B)" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={<ItalicOutlined />} title="기울임 (Ctrl+I)" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={<UnderlineOutlined />} title="밑줄 (Ctrl+U)" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={<StrikethroughOutlined />} title="취소선" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} icon={<HighlightOutlined />} title="형광펜" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive('superscript')}
            icon={<span style={{ fontSize: 11 }}>x²</span>}
            title="윗첨자"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive('subscript')}
            icon={<span style={{ fontSize: 11 }}>x₂</span>}
            title="아래첨자"
          />
          <span className="rich-editor-toolbar-divider" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            icon={<span style={{ fontWeight: 600 }}>H1</span>}
            title="제목 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            icon={<span style={{ fontWeight: 600 }}>H2</span>}
            title="제목 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            icon={<span style={{ fontWeight: 600 }}>H3</span>}
            title="제목 3"
          />
          <span className="rich-editor-toolbar-divider" />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={<UnorderedListOutlined />} title="목록" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={<OrderedListOutlined />} title="번호목록" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} icon={<CheckSquareOutlined />} title="체크리스트" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={<span style={{ fontSize: 14 }}>❝</span>} title="인용" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={<CodeOutlined />} title="코드 블록" />
          <span className="rich-editor-toolbar-divider" />

          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={<AlignLeftOutlined />} title="왼쪽정렬" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={<AlignCenterOutlined />} title="가운데정렬" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={<AlignRightOutlined />} title="오른쪽정렬" />
          <span className="rich-editor-toolbar-divider" />

          <ToolbarButton onClick={addImage} icon={<PictureOutlined />} title="이미지 (드래그·붙여넣기도 가능)" />
          <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} icon={<LinkOutlined />} title="링크" />
          <ToolbarButton onClick={insertTable} icon={<TableOutlined />} title="표 삽입 (3×3)" />
          <span className="rich-editor-toolbar-divider" />

          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={<UndoOutlined />} title="실행취소 (Ctrl+Z)" />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={<RedoOutlined />} title="다시실행 (Ctrl+Y)" />
        </div>
      )}
      <EditorContent editor={editor} className="rich-editor-content" style={{ minHeight: height }} />
      {maxLength && maxLength > 0 && (
        <div className="rich-editor-footer">
          <span className={charsUsed > maxLength ? 'is-over' : ''}>
            {charsUsed.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default CustomRichEditor;
