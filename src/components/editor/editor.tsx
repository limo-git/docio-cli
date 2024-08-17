'use client';

import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { EditorContent, EditorOptions, useEditor } from '@tiptap/react';
import { extensions as builtInExtensions } from './extensions';
import FixedMenu from './components/fixed-menu';
import './styles/index.scss';
import LinkBubbleMenu from './components/link-bubble-menu';
import { EditorInstance } from '.';

export interface EditorProps extends Partial<EditorOptions> {
  fixedMenuClassName?: string;
  wrapperClassName?: string;
  contentClassName?: string;
  content?: string; // Assuming content is an optional prop
}

export type EditorRef = {
  getEditor: () => EditorInstance;
};

export const Editor = forwardRef<EditorRef, EditorProps>(
  (
    {
      wrapperClassName,
      fixedMenuClassName,
      contentClassName,
      extensions = [],
      editable = true,
      editorProps,
      content,
      ...rest
    },
    ref
  ) => {
    const editor = useEditor(
      {
        extensions: [...builtInExtensions, ...extensions],
        immediatelyRender: false,
        content,
        editorProps: {
          attributes: {
            class:
              'pt-6 pb-6 px-6 prose prose-base prose-blue prose-headings:scroll-mt-[80px]'
          },
          ...editorProps
        },
        ...rest
      },
      []
    );

    useImperativeHandle(ref, () => ({
      getEditor: () => {
        if (!editor) {
          throw new Error("Editor instance is not available");
        }
        return editor;
      }
    }));

    // Update editable state if/when it changes
    useEffect(() => {
      if (!editor || editor.isDestroyed || editor.isEditable === editable) {
        return;
      }
      queueMicrotask(() => editor.setEditable(editable));
    }, [editable, editor]);

    if (!editor) return null;

    return (
      <div className={wrapperClassName}>
        {editable && (
          <>
            <FixedMenu editor={editor} className={fixedMenuClassName} />
            <LinkBubbleMenu editor={editor} />
          </>
        )}
        <EditorContent editor={editor} className={contentClassName} />
      </div>
    );
  }
);

Editor.displayName = 'Editor';

export default Editor;
