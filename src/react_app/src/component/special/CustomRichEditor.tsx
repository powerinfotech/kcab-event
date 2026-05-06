'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  PictureOutlined,
  LinkOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';

interface Props {
  value: string;
  isEditable: boolean;
  onChange: (value: string) => void;
  showToolbar?: boolean;
  height?: number;
  placeholder?: string;
}

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

const CustomRichEditor = ({
  value,
  onChange,
  isEditable,
  showToolbar = true,
  height = 200,
  placeholder = '내용을 입력하세요',
}: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
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
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value]);

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('이미지 URL을 입력하세요');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('링크 URL을 입력하세요');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={`rich-editor-wrap ${!isEditable ? 'is-readonly' : ''}`}>
      {showToolbar && isEditable && (
        <div className="rich-editor-toolbar">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={<BoldOutlined />} title="굵게" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={<ItalicOutlined />} title="기울임" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={<UnderlineOutlined />} title="밑줄" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={<StrikethroughOutlined />} title="취소선" />
          <span className="rich-editor-toolbar-divider" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={<UnorderedListOutlined />} title="목록" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={<OrderedListOutlined />} title="번호목록" />
          <span className="rich-editor-toolbar-divider" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={<AlignLeftOutlined />} title="왼쪽정렬" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={<AlignCenterOutlined />} title="가운데정렬" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={<AlignRightOutlined />} title="오른쪽정렬" />
          <span className="rich-editor-toolbar-divider" />
          <ToolbarButton onClick={addImage} icon={<PictureOutlined />} title="이미지" />
          <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} icon={<LinkOutlined />} title="링크" />
          <span className="rich-editor-toolbar-divider" />
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={<UndoOutlined />} title="실행취소" />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={<RedoOutlined />} title="다시실행" />
        </div>
      )}
      <EditorContent editor={editor} className="rich-editor-content" style={{ minHeight: height }} />
    </div>
  );
};

export default CustomRichEditor;
