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
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import CharacterCount from '@tiptap/extension-character-count';
import { FileHandler } from '@tiptap/extension-file-handler';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  EditOutlined,
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

type RichEditorInstance = NonNullable<ReturnType<typeof useEditor>>;

interface RichEditorVariableOption {
  key: string;
  description?: string;
}

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
  /** 메일 템플릿 등에서 삽입할 수 있는 변수 목록 */
  variables?: RichEditorVariableOption[];
}

const TEXT_COLOR_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Black', value: '#111827' },
  { label: 'Navy', value: '#102033' },
  { label: 'Blue', value: '#1f5b95' },
  { label: 'Sky', value: '#0284c7' },
  { label: 'Teal', value: '#0f766e' },
  { label: 'Green', value: '#177245' },
  { label: 'Amber', value: '#b45309' },
  { label: 'Orange', value: '#c2410c' },
  { label: 'Red', value: '#b91c1c' },
  { label: 'Purple', value: '#6d28d9' },
  { label: 'Gray', value: '#64748b' },
];

const ManagedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => attributes.alt ? { alt: attributes.alt } : {},
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('title'),
        renderHTML: (attributes) => attributes.title ? { title: attributes.title } : {},
      },
      width: {
        default: null,
        parseHTML: (element) => element.style.width || element.getAttribute('width'),
        renderHTML: (attributes) => {
          const width = normalizeImageWidth(attributes.width);
          if (!width) return {};
          const htmlAttributes: Record<string, string> = {
            style: `width: ${width}; max-width: 100%; height: auto;`,
          };
          if (/^\d+px$/.test(width)) {
            htmlAttributes.width = width.replace('px', '');
          }
          return htmlAttributes;
        },
      },
    };
  },
});

function ToolbarButton({
  onClick,
  isActive,
  icon,
  title,
  disabled,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`rich-editor-toolbar-btn ${isActive ? 'is-active' : ''}`}
      onMouseDown={(event) => {
        event.preventDefault();
        if (!disabled) {
          onClick();
        }
      }}
      onClick={(event) => event.preventDefault()}
      title={title}
      disabled={disabled}
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
  variables = [],
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
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      ManagedImage.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
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

  const commandChain = () => {
    const domSelection = getEditorDomSelection(editor);
    const chain = editor.chain().focus();
    if (domSelection) {
      return chain.setTextSelection(domSelection);
    }
    return chain;
  };

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
    const domSelection = getEditorDomSelection(editor);
    const url = window.prompt('링크 URL을 입력하세요', previousUrl ?? '');
    if (url === null) return;
    let chain = editor.chain().focus();
    if (domSelection) {
      chain = chain.setTextSelection(domSelection);
    }
    if (url === '') {
      chain.extendMarkRange('link').unsetLink().run();
      return;
    }
    chain.extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertTable = () => {
    commandChain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const editImage = () => {
    if (!editor.isActive('image')) {
      window.alert('Please select an image first.');
      return;
    }
    const currentAttrs = editor.getAttributes('image') as { alt?: string; title?: string; width?: string };
    const width = window.prompt('Image width (e.g. 320px, 80%, leave empty for auto)', currentAttrs.width ?? '');
    if (width === null) return;
    const alt = window.prompt('Image alt text', currentAttrs.alt ?? '');
    if (alt === null) return;

    const normalizedWidth = normalizeImageWidth(width);
    const normalizedAlt = alt.trim() || null;
    commandChain().updateAttributes('image', {
      width: normalizedWidth,
      alt: normalizedAlt,
      title: normalizedAlt,
    }).run();
  };

  const insertVariable = (key: string) => {
    if (!key) return;
    commandChain().insertContent(key).run();
  };

  const setTextColor = (color: string) => {
    if (!color) {
      commandChain().unsetColor().run();
      return;
    }
    commandChain().setColor(color).run();
  };

  const charsUsed = maxLength ? editor.storage.characterCount.characters() : 0;
  const currentColor = ((editor.getAttributes('textStyle').color as string | undefined) ?? '').toLowerCase();

  return (
    <div className={`rich-editor-wrap ${!isEditable ? 'is-readonly' : ''}`}>
      {showToolbar && isEditable && (
        <div className="rich-editor-toolbar">
          <ToolbarButton onClick={() => commandChain().toggleBold().run()} isActive={editor.isActive('bold')} icon={<BoldOutlined />} title="굵게 (Ctrl+B)" />
          <ToolbarButton onClick={() => commandChain().toggleItalic().run()} isActive={editor.isActive('italic')} icon={<ItalicOutlined />} title="기울임 (Ctrl+I)" />
          <ToolbarButton onClick={() => commandChain().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={<UnderlineOutlined />} title="밑줄 (Ctrl+U)" />
          <ToolbarButton onClick={() => commandChain().toggleStrike().run()} isActive={editor.isActive('strike')} icon={<StrikethroughOutlined />} title="취소선" />
          <div className="rich-editor-color-group" aria-label="Text color">
            {TEXT_COLOR_OPTIONS.map((option) => {
              const isActiveColor = option.value.toLowerCase() === currentColor;
              return (
                <button
                  key={option.label}
                  type="button"
                  className={`rich-editor-color-swatch ${isActiveColor ? 'is-active' : ''} ${!option.value ? 'is-default' : ''}`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setTextColor(option.value);
                  }}
                  onClick={(event) => event.preventDefault()}
                  title={`Text color: ${option.label}`}
                >
                  <span style={option.value ? { backgroundColor: option.value } : undefined} />
                </button>
              );
            })}
          </div>
          <span className="rich-editor-toolbar-divider" />

          <ToolbarButton
            onClick={() => commandChain().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            icon={<span style={{ fontWeight: 600 }}>H1</span>}
            title="제목 1"
          />
          <ToolbarButton
            onClick={() => commandChain().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            icon={<span style={{ fontWeight: 600 }}>H2</span>}
            title="제목 2"
          />
          <ToolbarButton
            onClick={() => commandChain().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            icon={<span style={{ fontWeight: 600 }}>H3</span>}
            title="제목 3"
          />
          <span className="rich-editor-toolbar-divider" />

          <ToolbarButton onClick={() => commandChain().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={<UnorderedListOutlined />} title="목록" />
          <ToolbarButton onClick={() => commandChain().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={<OrderedListOutlined />} title="번호목록" />
          <ToolbarButton onClick={() => commandChain().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={<span style={{ fontSize: 14 }}>❝</span>} title="인용" />
          <span className="rich-editor-toolbar-divider" />

          <ToolbarButton onClick={() => commandChain().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={<AlignLeftOutlined />} title="왼쪽정렬" />
          <ToolbarButton onClick={() => commandChain().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={<AlignCenterOutlined />} title="가운데정렬" />
          <ToolbarButton onClick={() => commandChain().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={<AlignRightOutlined />} title="오른쪽정렬" />
          <span className="rich-editor-toolbar-divider" />

          <ToolbarButton onClick={addImage} icon={<PictureOutlined />} title="이미지 (드래그·붙여넣기도 가능)" />
          <ToolbarButton onClick={editImage} isActive={editor.isActive('image')} icon={<EditOutlined />} title="이미지 크기/대체텍스트" disabled={!editor.isActive('image')} />
          <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} icon={<LinkOutlined />} title="링크" />
          <ToolbarButton onClick={insertTable} icon={<TableOutlined />} title="표 삽입 (3×3)" />
          {!!variables.length && (
            <select
              className="rich-editor-toolbar-select is-variable"
              aria-label="Insert variable"
              defaultValue=""
              onChange={(event) => {
                insertVariable(event.target.value);
                event.target.value = '';
              }}
              title="Insert variable"
            >
              <option value="" disabled>Variable</option>
              {variables.map((variable) => (
                <option key={variable.key} value={variable.key}>
                  {variable.key}
                </option>
              ))}
            </select>
          )}
          <span className="rich-editor-toolbar-divider" />

          <ToolbarButton onClick={() => commandChain().undo().run()} icon={<UndoOutlined />} title="실행취소 (Ctrl+Z)" />
          <ToolbarButton onClick={() => commandChain().redo().run()} icon={<RedoOutlined />} title="다시실행 (Ctrl+Y)" />
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

function getEditorDomSelection(editor: RichEditorInstance) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  const editorDom = editor.view.dom;
  if (!editorDom.contains(range.startContainer) || !editorDom.contains(range.endContainer)) {
    return null;
  }

  try {
    const from = editor.view.posAtDOM(range.startContainer, range.startOffset);
    const to = editor.view.posAtDOM(range.endContainer, range.endOffset);
    return from <= to ? { from, to } : { from: to, to: from };
  } catch {
    return null;
  }
}

function normalizeImageWidth(value?: string | null) {
  const trimmed = `${value ?? ''}`.trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) return `${trimmed}px`;
  if (/^\d+(\.\d+)?(px|%)$/.test(trimmed)) return trimmed;
  return null;
}

export default CustomRichEditor;
